import { createFileRoute } from '@tanstack/react-router'

import { Hero } from './-home/hero'
import { SiteNav } from './-home/nav'
import { usePageMotion } from './-home/page-motion'
import { Sections } from './-home/sections'
import { useSmoothScroll } from './-home/smooth-scroll'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
	useSmoothScroll()
	const pageRef = usePageMotion()

	return (
		<main ref={pageRef} id="top" className="gv">
			<SiteNav />
			<Hero />
			<Sections />
			<div aria-hidden="true" className="gv-grain" />
		</main>
	)
}
