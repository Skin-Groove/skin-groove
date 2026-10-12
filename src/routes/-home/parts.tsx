import { ArrowUpRightIcon, PlusIcon } from '@phosphor-icons/react'
import { useRef } from 'react'

import {
	followScrollSpeed,
	gsap,
	motionQuery,
	ScrollTrigger,
	useGSAP,
} from '@/lib/motion'
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

/** Two endless photo rows that drift in opposite directions and speed up or reverse with the scroll. */
export function GalleryRows() {
	const ref = useRef<HTMLDivElement>(null)

	useGSAP(
		() => {
			const mm = gsap.matchMedia()

			mm.add(motionQuery, () => {
				const loops = gsap.utils.toArray<HTMLElement>('.gv-row').map((row) => {
					// Each row holds its photos twice. Half the row plus half a gap is one full lap.
					const lap = () =>
						-(
							row.scrollWidth +
							Number.parseFloat(getComputedStyle(row).columnGap)
						) / 2
					const reverse = row.classList.contains('is-reverse')
					return gsap.fromTo(
						row,
						{ x: () => (reverse ? lap() : 0) },
						{
							duration: 80,
							ease: 'none',
							repeat: -1,
							x: () => (reverse ? 0 : lap()),
						},
					)
				})

				const remeasure = () => {
					for (const loop of loops) loop.invalidate()
				}
				ScrollTrigger.addEventListener('refresh', remeasure)
				const stopFollowing = followScrollSpeed((speed) => {
					for (const loop of loops) loop.timeScale(speed * 1.5)
				})

				return () => {
					ScrollTrigger.removeEventListener('refresh', remeasure)
					stopFollowing()
				}
			})
		},
		{ scope: ref },
	)

	return (
		<div ref={ref} className="gv-rows" aria-hidden="true">
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
