// Sends client email through Resend.
// https://resend.com/docs/api-reference/emails/send-email

import { z } from 'zod'

import { contactEmail } from '@/components/site/links'
import type { Outgoing } from '@/lib/cal/webhook'

import { render } from './layout'

const site = 'https://skingroove.studio'

// Replies go to Sammy's Google Workspace inbox.
const from = 'Sammy at Skin Groove <hello@skingroove.studio>'

// Cal.com does not promise to send a failed webhook again, so the Worker
// retries a rate limit, a Resend outage, a stalled request, or a network error
// itself. The idempotency key makes a retry safe.
const retryDelays = [1000, 3000]

const attemptTimeout = 10_000

const resendError = z.object({ name: z.string() })

// Resend answers 409 `concurrent_idempotent_requests` while an earlier attempt
// with the same key is still in progress, and documents it as retryable.
// https://resend.com/docs/api-reference/errors
async function isTransient(response: Response) {
	if (response.status === 429 || response.status >= 500) return true

	if (response.status !== 409) return false

	// A body cut off mid-read is a network error, so it is retryable too.
	const body: unknown = await response
		.clone()
		.json()
		.catch(() => ({ name: 'concurrent_idempotent_requests' }))

	return (
		resendError.safeParse(body).data?.name === 'concurrent_idempotent_requests'
	)
}

const wait = (ms: number) =>
	new Promise<void>((resolve) => {
		setTimeout(resolve, ms)
	})

export async function send(
	outgoing: Outgoing,
	apiKey: string,
	{ fetchImpl = fetch, delays = retryDelays, timeout = attemptTimeout } = {},
) {
	const { subject, html } = render(outgoing.email, { origin: site })

	const request = () =>
		fetchImpl('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
				'Idempotency-Key': outgoing.idempotencyKey,
			},
			body: JSON.stringify({
				from,
				to: [outgoing.to],
				reply_to: contactEmail,
				subject,
				html,
			}),
			signal: AbortSignal.timeout(timeout),
		})

	const attempt = () => request().catch(() => undefined)

	let response = await attempt()

	for (const delay of delays) {
		if (response && !(await isTransient(response))) break
		await wait(delay)
		response = await attempt()
	}

	if (!response) throw new Error('Resend could not be reached')

	// The response body names the error. It holds no client data.
	if (!response.ok) {
		throw new Error(
			`Resend failed with ${response.status}: ${await response.text()}`,
		)
	}
}
