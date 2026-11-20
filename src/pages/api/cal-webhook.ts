// Receives Cal.com booking webhooks and sends the client emails. The only
// route that runs on the Worker. See "Client emails" in docs/privacy-and-intake.md.

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { z } from 'zod'

import { emailFor, readBody, verifySignature } from '@/lib/cal/webhook'
import { send } from '@/lib/email/send'

export const prerender = false

// Worker secrets, set with `wrangler secret put`.
const secrets = z.object({
	CALCOM_WEBHOOK_SECRET: z.string().min(1),
	RESEND_API_KEY: z.string().startsWith('re_'),
})

// A signed body that fails to parse means Cal.com changed its payload. The
// 400 shows in the Cal.com webhook log.
function parse(body: string) {
	try {
		return emailFor(body)
	} catch {
		return 'invalid'
	}
}

export const POST: APIRoute = async ({ request }) => {
	const { CALCOM_WEBHOOK_SECRET, RESEND_API_KEY } = secrets.parse(env)
	const body = await readBody(request)

	if (body === undefined) return new Response('Too large', { status: 413 })

	const signature = request.headers.get('x-cal-signature-256')

	if (!(await verifySignature(body, signature, CALCOM_WEBHOOK_SECRET))) {
		return new Response('Bad signature', { status: 401 })
	}

	const outgoing = parse(body)

	if (outgoing === 'invalid')
		return new Response('Bad payload', { status: 400 })

	if (outgoing) await send(outgoing, RESEND_API_KEY)

	return new Response(null, { status: 204 })
}
