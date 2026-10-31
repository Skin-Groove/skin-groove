import { createRouter } from '@tanstack/react-router'

import { NotFoundComponent, ServerErrorComponent } from '@/components/errors'
import { queryClient } from '@/lib/utils/query'
import { smoothScroll } from '@/lib/utils/scroll'

import { routeTree } from './routeTree.gen'

// A new visit has no position to restore. The router reset at hydration would pull a scrolling visitor back to the top.
const restoresFirstRender = () => {
	const [visit] = performance.getEntriesByType('navigation')
	return (
		visit instanceof PerformanceNavigationTiming && visit.type !== 'navigate'
	)
}

export const getRouter = () => {
	let firstRender = true

	return createRouter({
		routeTree,
		scrollRestoration: () => {
			if (typeof window === 'undefined') return false
			if (!firstRender) return true
			firstRender = false
			return restoresFirstRender()
		},
		defaultHashScrollIntoView: { behavior: smoothScroll() },
		defaultPreloadStaleTime: 0,
		context: { queryClient },
		defaultErrorComponent: ServerErrorComponent,
		defaultNotFoundComponent: NotFoundComponent,
	})
}
