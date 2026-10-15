import bodyFont from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url'
import displayFont from '@fontsource/caprasimo/files/caprasimo-latin-400-normal.woff2?url'
import { QueryClientProvider } from '@tanstack/react-query'
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRoute,
} from '@tanstack/react-router'

import { queryClient } from '@/lib/utils/query'

import appCss from '../styles.css?url'

const description =
	'One-to-one virtual skin consultations with New Orleans esthetician Sammy Mintzer. $50, returned as shop credit.'

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ title: 'Skin Groove | Virtual Esthetics' },
			{ name: 'description', content: description },
			{ property: 'og:title', content: 'Skin Groove' },
			{ property: 'og:description', content: description },
			{ property: 'og:type', content: 'website' },
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'theme-color', content: '#08140f' },
		],
		links: [
			// Preloads start the font downloads with the HTML, not after the CSS, so the first paint uses them.
			{
				as: 'font',
				crossOrigin: 'anonymous',
				href: displayFont,
				rel: 'preload',
				type: 'font/woff2',
			},
			{
				as: 'font',
				crossOrigin: 'anonymous',
				href: bodyFont,
				rel: 'preload',
				type: 'font/woff2',
			},
			{ rel: 'stylesheet', href: appCss },
			{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
		],
	}),
	component: RootComponent,
})

function RootComponent() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<Outlet />
				</QueryClientProvider>
				<Scripts />
			</body>
		</html>
	)
}
