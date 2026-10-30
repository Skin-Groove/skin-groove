import { ListIcon, XIcon } from '@phosphor-icons/react'
import { Link, linkOptions } from '@tanstack/react-router'
import { useEffect, useId, useState } from 'react'

import { cn } from '@/lib/utils/ui'

import { BookPill, Record } from './parts'

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
	const menuId = useId()

	useEffect(() => {
		if (!menuOpen) return
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setMenuOpen(false)
		}
		window.addEventListener('keydown', closeOnEscape)
		return () => window.removeEventListener('keydown', closeOnEscape)
	}, [menuOpen])

	return (
		<nav
			className={cn('gv-nav', menuOpen && 'is-open')}
			aria-label="Primary navigation"
		>
			<Link
				activeOptions={{ exact: true, includeHash: true }}
				aria-label="Skin Groove home"
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
	)
}
