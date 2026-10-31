import tailwindcss from '@tailwindcss/vite'
import varlock from '@varlock/astro-integration'
import { defineConfig } from 'astro/config'

export default defineConfig({
	site: 'https://skingroove.studio',
	output: 'static',
	trailingSlash: 'never',
	devToolbar: { enabled: true, placement: 'bottom-right' },
	integrations: [varlock()],
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
