import { createFileRoute } from '@tanstack/react-router'

import { Hero } from './-home/hero'
import { Sections } from './-home/sections'
import { canonical } from './-site/meta'
import { useReveal } from './-site/parts'

export const Route = createFileRoute('/')({
	head: () => canonical('/'),
	component: HomePage,
})

function HomePage() {
	const pageRef = useReveal()

	return (
		<main ref={pageRef} className="gv">
			<Hero />
			<Sections />
		</main>
	)
}
