// Cal.com webhooks that trigger client emails.
// https://cal.com/docs/developing/guides/automation/webhooks

import { z } from 'zod'

import type { Email } from '@/lib/email/layout'
import {
	acneThanks,
	type Appointment,
	checkInBooked,
	consultBooked,
	consultThanks,
} from '@/lib/email/templates'
import { calEventTypeIds, intakeFormMinutes, intakeFormUrl } from '@/lib/intake'

const encoder = new TextEncoder()

/**
 * Checks the `x-cal-signature-256` header: a hex HMAC-SHA256 of the raw body,
 * keyed with the webhook secret.
 */
export async function verifySignature(
	body: string,
	signature: string | null,
	secret: string,
) {
	if (!signature || !/^[0-9a-f]{64}$/i.test(signature)) return false

	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['verify'],
	)

	const bytes = Uint8Array.from(signature.match(/../g) ?? [], (pair) =>
		Number.parseInt(pair, 16),
	)

	// crypto.subtle.verify compares in constant time.
	return crypto.subtle.verify('HMAC', key, bytes, encoder.encode(body))
}

// Cal.com payloads are a few kilobytes. The Worker reads the body before it can
// check the signature, so a limit stops a large unsigned body from using up
// the 128 MB isolate memory.
export const maxBodyBytes = 64 * 1024

/** Reads the body as text, or returns undefined when it is larger than `maxBytes`. */
export async function readBody(request: Request, maxBytes = maxBodyBytes) {
	if (Number(request.headers.get('content-length') ?? 0) > maxBytes) {
		return undefined
	}

	if (!request.body) return ''

	const reader = request.body.getReader()
	const chunks: Uint8Array[] = []
	let size = 0

	for (;;) {
		const { done, value } = await reader.read()

		if (done) break
		size += value.byteLength

		if (size > maxBytes) {
			await reader.cancel()

			return undefined
		}

		chunks.push(value)
	}

	const bytes = new Uint8Array(size)
	let offset = 0

	for (const chunk of chunks) {
		bytes.set(chunk, offset)
		offset += chunk.byteLength
	}

	return new TextDecoder().decode(bytes)
}

// Cal.com sets the Google Meet link only after Google Calendar creates the
// event. Accept only a Meet URL, so the email never links anywhere else.
const meetUrl = z
	.url({ protocol: /^https$/, hostname: /^meet\.google\.com$/ })
	.optional()
	.catch(undefined)

const client = z.object({ name: z.string().min(1), email: z.email() })

// MEETING_ENDED loads the booking again, and its attendees can lack a time
// zone. So the thank-you needs only the fields below.
const endedBooking = z.object({
	uid: z.string().min(1),
	eventTypeId: z.number(),
	attendees: z.array(client).min(1),
	status: z.string().optional(),
})

const booking = endedBooking.extend({
	startTime: z.iso.datetime({ offset: true }),
	endTime: z.iso.datetime({ offset: true }),
	attendees: z.array(client.extend({ timeZone: z.string().min(1) })).min(1),
	// A missing Meet link must not block the email, so bad metadata counts as none.
	metadata: z.object({ videoCallUrl: meetUrl }).optional().catch(undefined),
})

// A request that waits for Sammy, a declined request, or a cancelled booking
// gets no email. Cal.com sends its own notice for those.
const silentStatuses = new Set(['PENDING', 'REJECTED', 'CANCELLED'])

const isSilent = (status: string | undefined) =>
	silentStatuses.has(status?.toUpperCase() ?? '')

const event = z.object({
	triggerEvent: z.string(),
	payload: z.unknown().optional(),
})

export interface Outgoing {
	to: string
	email: Email
	/** Resend drops a second send with the same key for 24 hours, so a retry sends once. */
	idempotencyKey: string
}

/**
 * Picks the client email for a webhook body. Returns null for events that send
 * none, such as Cal.com's test ping or a booking for another event type. Throws
 * on a body that is not a valid Cal.com event.
 */
export function emailFor(body: string): Outgoing | null {
	const root: unknown = JSON.parse(body)
	const { triggerEvent, payload } = event.parse(root)

	if (triggerEvent === 'BOOKING_CREATED') return created(booking.parse(payload))

	// MEETING_STARTED and MEETING_ENDED put the booking fields at the top level,
	// with no `payload` wrapper. https://cal.com/docs/developing/guides/automation/webhooks
	if (triggerEvent === 'MEETING_ENDED') return ended(endedBooking.parse(root))

	return null
}

function created(parsed: z.infer<typeof booking>): Outgoing | null {
	const [attendee] = parsed.attendees

	if (!attendee || isSilent(parsed.status)) return null

	const appointment: Appointment = {
		name: attendee.name,
		startTime: parsed.startTime,
		endTime: parsed.endTime,
		timeZone: attendee.timeZone,
		meetUrl: parsed.metadata?.videoCallUrl,
	}

	const prefill = {
		attendeeName: attendee.name,
		email: attendee.email,
		uid: parsed.uid,
	}

	const isAcne = parsed.eventTypeId === calEventTypeIds.acne

	if (isAcne || parsed.eventTypeId === calEventTypeIds.consult) {
		const form = isAcne ? 'acne' : 'consult'

		return outgoing(
			'BOOKING_CREATED',
			parsed.uid,
			attendee.email,
			consultBooked({
				...appointment,
				formUrl: intakeFormUrl(form, prefill),
				formMinutes: intakeFormMinutes[form],
			}),
		)
	}

	if (parsed.eventTypeId === calEventTypeIds.followUp) {
		return outgoing(
			'BOOKING_CREATED',
			parsed.uid,
			attendee.email,
			checkInBooked({
				...appointment,
				formUrl: intakeFormUrl('followUp', prefill),
			}),
		)
	}

	return null
}

function ended(parsed: z.infer<typeof endedBooking>): Outgoing | null {
	const [attendee] = parsed.attendees

	if (!attendee || isSilent(parsed.status)) return null

	if (parsed.eventTypeId === calEventTypeIds.consult) {
		return outgoing(
			'MEETING_ENDED',
			parsed.uid,
			attendee.email,
			consultThanks({ name: attendee.name }),
		)
	}

	if (parsed.eventTypeId === calEventTypeIds.acne) {
		return outgoing(
			'MEETING_ENDED',
			parsed.uid,
			attendee.email,
			acneThanks({ name: attendee.name }),
		)
	}

	return null
}

function outgoing(
	trigger: 'BOOKING_CREATED' | 'MEETING_ENDED',
	uid: string,
	to: string,
	email: Email,
): Outgoing {
	return { to, email, idempotencyKey: `${trigger}/${uid}` }
}
