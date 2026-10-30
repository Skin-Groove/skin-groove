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
	'Thoughtful, curated skincare guidance to help you understand your skin, simplify your routine, and finally find what works for you.'

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
