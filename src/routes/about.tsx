import { createFileRoute } from '@tanstack/react-router'

import { AboutHeader, Principles, Story } from './-about/sections'
import { Closing } from './-site/closing'
import { canonical } from './-site/meta'
import { useReveal } from './-site/parts'

const description =
	'Meet Sammy, the esthetician behind Skin Groove, and the principles that guide her virtual skincare practice.'

const page = canonical('/about')

export const Route = createFileRoute('/about')({
	head: () => ({
		links: page.links,
		meta: [
			...page.meta,
			{ title: 'About Sammy | Skin Groove' },
			{ name: 'description', content: description },
			{ property: 'og:title', content: 'About Sammy | Skin Groove' },
			{ property: 'og:description', content: description },
		],
	}),
	component: AboutPage,
})

function AboutPage() {
	const pageRef = useReveal()

	return (
		<main ref={pageRef} className="gv">
			<AboutHeader />
			<Story />
			<Principles />
			<Closing />
		</main>
	)
}
