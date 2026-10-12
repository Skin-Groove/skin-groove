import { useRef } from 'react'

import { ScrollTrigger, useGSAP } from '@/lib/motion'

import { BookPill, Record } from './parts'

import './nav.css'

/** Sits clear over the hero, then turns into a floating bar that hides on the way down and returns on the way up. */
export function SiteNav() {
	const ref = useRef<HTMLElement>(null)

	useGSAP(() => {
		const nav = ref.current
		if (!nav) return

		const update = (self: ScrollTrigger) => {
			const scrolled = self.scroll()
			nav.toggleAttribute('data-solid', scrolled > 80)
			nav.toggleAttribute(
				'data-hidden',
				scrolled > window.innerHeight && self.direction === 1,
			)
		}
		ScrollTrigger.create({
			end: 'max',
			start: 0,
			onRefresh: update,
			onUpdate: update,
		})
	})

	return (
		<nav ref={ref} className="site-nav" aria-label="Primary navigation">
			<div className="site-nav-bar">
				<a aria-label="Skin Groove home" href="#top">
					<Record className="site-nav-record" />
				</a>
				<div className="site-nav-links">
					<a href="#services">Services</a>
					<a href="#faq">FAQ</a>
					<a href="#contact">Contact</a>
				</div>
				<BookPill className="site-nav-pill" />
			</div>
		</nav>
	)
}
