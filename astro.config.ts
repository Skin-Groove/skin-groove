import tailwindcss from '@tailwindcss/vite'
import varlock from '@varlock/astro-integration'
import { defineConfig } from 'astro/config'

export default defineConfig({
	site: 'https://skingroove.studio',
	output: 'static',
	trailingSlash: 'never',
	devToolbar: { enabled: true, placement: 'bottom-right' },
	integrations: [varlock()],
	// Pages may load scripts and frames only from these origins, so a tracker
	// cannot slip into the page. A Cal.com or Tally frame follows its own policy,
	// so provider settings keep trackers out of those frames. See "Site rules" in docs/privacy-and-intake.md. After a
	// booking, Cal.com can send its frame to the Tally intake form. The Cal.com
	// embed injects styles, so style-src allows inline styles and Astro emits no
	// style hashes.
	security: {
		csp: {
			directives: [
				"default-src 'self'",
				"img-src 'self' data:",
				"font-src 'self'",
				"connect-src 'self'",
				'frame-src https://app.cal.com https://cal.com https://tally.so',
				"object-src 'none'",
				"base-uri 'self'",
				"form-action 'self'",
			],
			scriptDirective: {
				resources: ["'self'", 'https://app.cal.com'],
			},
			styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
		},
	},
	server: {
		host: '127.0.0.1',
		port: Number(process.env.APP_PORT ?? 3000),
		// Caddy and the Pitchfork proxy serve the app on *.lab.sahandamini.dev.
		allowedHosts: ['.lab.sahandamini.dev'],
	},
	vite: {
		plugins: [tailwindcss()],
		server: { strictPort: true },
	},
})
