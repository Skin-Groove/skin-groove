import type { AstroIntegration } from 'astro'

/** Serves the email preview at /emails on the dev server only. */
export function emailPreview(): AstroIntegration {
	return {
		name: 'email-preview',
		hooks: {
			'astro:config:setup': ({ command, injectRoute }) => {
				if (command !== 'dev') return
				injectRoute({
					pattern: '/emails',
					entrypoint: new URL('./index.astro', import.meta.url),
				})
				injectRoute({
					pattern: '/emails/[name]',
					entrypoint: new URL('./email.ts', import.meta.url),
				})
			},
		},
	}
}
