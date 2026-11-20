// The Worker runtime module, typed for the secrets that the site sets with
// `wrangler secret put`. The webhook route still parses them with zod, because
// a secret can be missing.
declare module 'cloudflare:workers' {
	export const env: {
		readonly CALCOM_WEBHOOK_SECRET?: string
		readonly RESEND_API_KEY?: string
	}
}
