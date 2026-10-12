import { ArrowUpRightIcon, PlusIcon } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils/ui'

import { galleryRows, questions } from './content'

import './base.css'

const petalAngles = [0, 45, 90, 135]

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
				<ellipse
					className="gv-record-vinyl"
					cx="50"
					cy="50"
					key={angle}
					rx="4"
					ry="13"
					transform={`rotate(${angle} 50 50)`}
				/>
			))}
			<circle className="gv-record-label" cx="50" cy="50" r="3.5" />
		</svg>
	)
}

export function BookPill({ className }: { className?: string }) {
	return (
		<button className={cn('gv-pill', className)} disabled type="button">
			Book now
			<span>Coming soon</span>
		</button>
	)
}

export function EmailPill() {
	return (
		<a className="gv-pill" href="mailto:sammy@skingroove.studio">
			Email Skin Groove
			<ArrowUpRightIcon aria-hidden="true" weight="bold" />
		</a>
	)
}

export function FaqList() {
	return (
		<div className="gv-faq">
			{questions.map((item) => (
				<details key={item.question}>
					<summary>
						{item.question}
						<PlusIcon aria-hidden="true" />
					</summary>
					<p>{item.answer}</p>
				</details>
			))}
		</div>
	)
}

export function GalleryRows() {
	return (
		<div className="gv-rows" aria-hidden="true">
			{galleryRows.map((row, rowIndex) => (
				<div
					className={cn('gv-row', rowIndex % 2 === 1 && 'is-reverse')}
					key={rowIndex}
				>
					{[...row, ...row].map((image, index) => (
						<img
							alt=""
							height="360"
							key={index}
							loading="lazy"
							src={`/images/groove/${image}.webp`}
							width="270"
						/>
					))}
				</div>
			))}
		</div>
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
