import { createHmac } from 'node:crypto'

import { describe, expect, test } from 'vite-plus/test'

import { calEventTypeIds } from '../intake'
import { emailFor, readBody, verifySignature } from './webhook'

const booking = {
	uid: 'booking-uid',
	eventTypeId: calEventTypeIds.consult,
	startTime: '2026-12-02T23:00:00.000Z',
	endTime: '2026-12-02T23:45:00.000Z',
	attendees: [
		{
			name: 'Jordan Rivera',
			email: 'jordan@example.com',
			timeZone: 'America/Los_Angeles',
		},
	],
	metadata: { videoCallUrl: 'https://meet.google.com/abc-defg-hij' },
	status: 'ACCEPTED',
}

const body = (
	triggerEvent: string,
	payload: Partial<typeof booking> = booking,
) => JSON.stringify({ triggerEvent, payload })

// MEETING_ENDED puts the booking fields at the top level, with no `payload`.
// Its attendees can lack a time zone.
interface EndedFields extends Omit<Partial<typeof booking>, 'attendees'> {
	attendees?: { name: string; email: string; timeZone?: string }[]
}

const ended = (fields: EndedFields = {}) =>
	JSON.stringify({ triggerEvent: 'MEETING_ENDED', ...booking, ...fields })

describe('verifySignature', () => {
	const secret = 'test-secret'
	const signed = body('PING', {})
	const signature = createHmac('sha256', secret).update(signed).digest('hex')

	test('accepts the Cal.com HMAC of the raw body', async () => {
		expect(await verifySignature(signed, signature, secret)).toBe(true)
	})

	test('rejects a changed body', async () => {
		expect(await verifySignature(`${signed} `, signature, secret)).toBe(false)
	})

	test('rejects a missing or malformed signature', async () => {
		expect(await verifySignature(signed, null, secret)).toBe(false)
		expect(await verifySignature(signed, 'abc', secret)).toBe(false)
	})
})

describe('emailFor', () => {
	test('sends the intake form after a consultation booking', () => {
		const outgoing = emailFor(body('BOOKING_CREATED'))

		expect(outgoing?.to).toBe('jordan@example.com')
		expect(outgoing?.email.subject).toBe(
			'You’re booked! Here’s your intake form',
		)
		expect(outgoing?.idempotencyKey).toBe('BOOKING_CREATED/booking-uid')
	})

	test('sends the check-in form after a follow-up booking', () => {
		const outgoing = emailFor(
			body('BOOKING_CREATED', {
				...booking,
				eventTypeId: calEventTypeIds.followUp,
			}),
		)

		expect(outgoing?.email.subject).toBe(
			'Your check-in is booked! One quick form first',
		)
	})

	test('sends the acne intake form after an acne booking', () => {
		const outgoing = emailFor(
			body('BOOKING_CREATED', {
				...booking,
				eventTypeId: calEventTypeIds.acne,
			}),
		)

		const content = outgoing?.email.content.toString()

		expect(content).toContain('tally.so/r/M1NW5M')
		expect(content).toContain('about 20 minutes')
	})

	test('links the follow-up booking after an acne consultation', () => {
		const outgoing = emailFor(ended({ eventTypeId: calEventTypeIds.acne }))

		expect(outgoing?.email.content.toString()).toContain(
			'We talked through the timing for your follow-up',
		)
	})

	test('sends the thank-you after a consultation ends', () => {
		const outgoing = emailFor(ended())

		expect(outgoing?.email.subject).toBe('Thank you for grooving with me!')
		expect(outgoing?.idempotencyKey).toBe('MEETING_ENDED/booking-uid')
	})

	test('sends the thank-you when the attendee has no time zone', () => {
		const outgoing = emailFor(
			ended({
				attendees: [{ name: 'Jordan Rivera', email: 'jordan@example.com' }],
			}),
		)

		expect(outgoing?.to).toBe('jordan@example.com')
	})

	test('rejects a MEETING_ENDED body that nests the booking under payload', () => {
		expect(() => emailFor(body('MEETING_ENDED'))).toThrow()
	})

	test('sends nothing for a ping, another trigger, or another event type', () => {
		expect(emailFor(body('PING', {}))).toBeNull()
		expect(emailFor(body('BOOKING_CANCELLED'))).toBeNull()
		expect(emailFor(ended({ eventTypeId: 1 }))).toBeNull()
	})

	test('sends nothing for a cancelled or unconfirmed booking', () => {
		for (const status of ['CANCELLED', 'REJECTED', 'PENDING']) {
			expect(emailFor(ended({ status }))).toBeNull()
		}

		expect(
			emailFor(body('BOOKING_CREATED', { ...booking, status: 'ACCEPTED' })),
		).not.toBeNull()
	})

	test('drops a video link that is not Google Meet', () => {
		const outgoing = emailFor(
			body('BOOKING_CREATED', {
				...booking,
				metadata: { videoCallUrl: 'https://evil.example/meet' },
			}),
		)

		expect(outgoing?.email.content.toString()).not.toContain('evil.example')
	})

	test('sends the email when the metadata is null', () => {
		const outgoing = emailFor(
			JSON.stringify({
				triggerEvent: 'BOOKING_CREATED',
				payload: { ...booking, metadata: null },
			}),
		)

		expect(outgoing?.email.content.toString()).not.toContain('meet.google.com')
	})

	test('throws on a body that is not a Cal.com event', () => {
		expect(() => emailFor('not json')).toThrow()
		expect(() =>
			emailFor(body('BOOKING_CREATED', { uid: 'booking-uid' })),
		).toThrow()
	})
})

describe('readBody', () => {
	const post = (body: BodyInit, headers: HeadersInit = {}) =>
		new Request('https://skingroove.studio/api/cal-webhook', {
			method: 'POST',
			body,
			headers,
		})

	test('returns a body within the limit unchanged', async () => {
		expect(await readBody(post('{"a":"é"}'), 64)).toBe('{"a":"é"}')
	})

	test('refuses a body over the limit', async () => {
		expect(await readBody(post('x'.repeat(65)), 64)).toBeUndefined()
	})

	test('refuses a declared length over the limit without reading', async () => {
		expect(
			await readBody(post('x', { 'content-length': '100000' }), 64),
		).toBeUndefined()
	})
})
