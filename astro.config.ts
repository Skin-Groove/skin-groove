import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

import { emailPreview } from './src/lib/email/preview/integration'

// `||`, because an empty APP_PORT gives 0, which means a random port.
const port = Number(process.env.APP_PORT || 3000)

export default defineConfig({
	site: 'https://skingroove.studio',
	output: 'static',
	// The Cal.com webhook route runs on the Worker. Every other page stays
	// prerendered. The site keeps no sessions and transforms no images, so the
	// adapter provisions no KV namespace and no Images binding.
	adapter: cloudflare({ imageService: 'passthrough' }),
	session: false,
	trailingSlash: 'never',
	devToolbar: { enabled: true, placement: 'bottom-right' },
	integrations: [emailPreview()],
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
		port,
		// Caddy and the Pitchfork proxy serve the app on *.lab.sahandamini.dev.
		allowedHosts: ['.lab.sahandamini.dev'],
	},
	vite: {
		plugins: [tailwindcss()],
		// A config change restarts the server. Astro then reads the port from the
		// old socket, and an overlapping restart reads none, so Vite falls back to
		// 5173 without this setting.
		server: { port, strictPort: true },
	},
})
