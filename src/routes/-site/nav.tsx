import { ListIcon, XIcon } from '@phosphor-icons/react'
import { Link, linkOptions, useNavigate } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { useEffect, useId, useRef, useState } from 'react'

import { scrollToTop } from '@/lib/utils/scroll'
import { cn } from '@/lib/utils/ui'

import { BookPill } from './booking'
import { Record } from './parts'

import './site.css'

// Hash links count as current only on their own hash, so `/` and `/#faq` never both read as current.
const siteLinks = linkOptions([
	{ children: 'About', to: '/about' },
	{
		children: 'Services',
		to: '/',
		hash: 'services',
		activeOptions: { exact: true, includeHash: true },
	},
	{
		children: 'FAQ',
		to: '/',
		hash: 'faq',
		activeOptions: { exact: true, includeHash: true },
	},
	{
		children: 'Contact',
		to: '.',
		hash: 'contact',
		activeOptions: { exact: true, includeHash: true },
	},
])

export function SiteLinks({
	className,
	onNavigate,
}: {
	className?: string
	onNavigate?: () => void
}) {
	return (
		<div className={cn('gv-links', className)}>
			{siteLinks.map((link) => (
				<Link key={link.children} onClick={onNavigate} {...link} />
			))}
		</div>
	)
}

/** The site navigation. It sits over the dark header at the top of each page. */
export function SiteNav() {
	const [menuOpen, setMenuOpen] = useState(false)
	const [solid, setSolid] = useState(false)
	const menuId = useId()
	const sentinelRef = useRef<HTMLDivElement>(null)
	const navigate = useNavigate()

	// The router keeps the scroll position on a link to the current page, so home scrolls up by itself.
	const goHome = (event: MouseEvent<HTMLAnchorElement>) => {
		setMenuOpen(false)
		if (window.location.pathname !== '/') return
		event.preventDefault()
		void navigate({ to: '/', replace: true, resetScroll: false }).then(
			scrollToTop,
		)
	}

	useEffect(() => {
		const sentinel = sentinelRef.current
		if (!sentinel) return
		const watch = new IntersectionObserver(([entry]) => {
			setSolid(!entry?.isIntersecting)
		})
		watch.observe(sentinel)
		return () => watch.disconnect()
	}, [])

	useEffect(() => {
		if (!menuOpen) return
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setMenuOpen(false)
		}
		window.addEventListener('keydown', closeOnEscape)
		return () => window.removeEventListener('keydown', closeOnEscape)
	}, [menuOpen])

	return (
		<>
			<div aria-hidden="true" className="gv-nav-sentinel" ref={sentinelRef} />
			<nav
				className={cn('gv-nav', menuOpen && 'is-open')}
				aria-label="Primary navigation"
				data-solid={solid || undefined}
			>
				<Link
					activeOptions={{ exact: true, includeHash: true }}
					aria-label="Skin Groove home"
					onClick={goHome}
					to="/"
				>
					<Record className="gv-nav-record" />
				</Link>
				<SiteLinks
					className="gv-nav-links"
					onNavigate={() => setMenuOpen(false)}
				/>
				<button
					aria-controls={menuId}
					aria-expanded={menuOpen}
					className="gv-nav-toggle"
					onClick={() => setMenuOpen((open) => !open)}
					type="button"
				>
					{menuOpen ? (
						<XIcon aria-hidden="true" weight="bold" />
					) : (
						<ListIcon aria-hidden="true" weight="bold" />
					)}
					Menu
				</button>
				<div className="gv-nav-menu" id={menuId}>
					<SiteLinks onNavigate={() => setMenuOpen(false)} />
				</div>
				<BookPill className="gv-nav-pill" />
			</nav>
		</>
	)
}
