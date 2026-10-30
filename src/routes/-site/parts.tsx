import {
	ArrowUpRightIcon,
	EnvelopeSimpleIcon,
	InstagramLogoIcon,
} from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils/ui'

import { contactEmail, instagramHandle, instagramUrl } from './links'

import './base.css'

const petalAngles = [0, 72, 144, 216, 288]

/** A spinning vinyl record with a flower label. The label takes the current text color. */
export function Record({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			className={cn('gv-record', className)}
			viewBox="0 0 100 100"
		>
			<circle className="gv-record-vinyl" cx="50" cy="50" r="48" />
			<circle className="gv-record-rim" cx="50" cy="50" r="47.5" />
			{[42, 37, 32, 27].map((radius) => (
				<circle
					className="gv-record-groove"
					cx="50"
					cy="50"
					key={radius}
					r={radius}
				/>
			))}
			<path
				className="gv-record-sheen"
				d="M50 50 L84 16 A48 48 0 0 1 96 34 Z"
			/>
			<path className="gv-record-sheen" d="M50 50 L16 84 A48 48 0 0 1 4 66 Z" />
			<circle className="gv-record-label" cx="50" cy="50" r="19" />
			{petalAngles.map((angle) => (
				<circle
					className="gv-record-vinyl"
					cx="50"
					cy="41"
					key={angle}
					r="6.5"
					transform={`rotate(${angle} 50 50)`}
				/>
			))}
			<circle className="gv-record-label" cx="50" cy="50" r="3.5" />
		</svg>
	)
}

export function EmailLink() {
	return (
		<a className="gv-text-link" href={`mailto:${contactEmail}`}>
			<EnvelopeSimpleIcon aria-hidden="true" weight="bold" />
			{contactEmail}
		</a>
	)
}

export function InstagramLink() {
	return (
		<a
			className="gv-text-link"
			href={instagramUrl}
			rel="noreferrer"
			target="_blank"
		>
			<InstagramLogoIcon aria-hidden="true" weight="bold" />@{instagramHandle}
			<ArrowUpRightIcon aria-hidden="true" weight="bold" />
		</a>
	)
}

export function Wave({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			className={cn('gv-wave', className)}
			preserveAspectRatio="none"
			viewBox="0 0 1440 80"
		>
			<path d="M0 40C240 80 480 0 720 40s480 40 720 0v40H0z" />
		</svg>
	)
}

/** Flags each `[data-reveal]` child once it scrolls into view. */
export function useReveal() {
	const ref = useRef<HTMLElement>(null)

	useEffect(() => {
		const root = ref.current
		if (!root) return

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue
					entry.target.setAttribute('data-visible', '')
					observer.unobserve(entry.target)
				}
			},
			{ rootMargin: '0px 0px -10% 0px' },
		)

		for (const target of root.querySelectorAll('[data-reveal]')) {
			observer.observe(target)
		}
		root.setAttribute('data-reveal-ready', '')

		return () => observer.disconnect()
	}, [])

	return ref
}
