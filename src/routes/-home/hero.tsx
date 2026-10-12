import { Fragment, useRef } from 'react'

import { gsap, motionQuery, useGSAP } from '@/lib/motion'

import { BookPill } from './parts'

import './hero.css'

const doorways = [
	{
		src: '/images/groove/06-lg.webp',
		alt: 'A glowing retro bar with amber pendant lights',
		width: 1170,
		height: 1169,
	},
	{
		src: '/images/groove/57.webp',
		alt: 'A sunken lounge under glowing amber arches',
		width: 736,
		height: 1104,
	},
	{
		src: '/images/groove/41-lg.webp',
		alt: 'A bedroom lit by a single orange lamp',
		width: 736,
		height: 1104,
	},
]

const wordmarkWords = ['Skin', 'Groove'].map((word, wordIndex, words) => {
	const offset = words.slice(0, wordIndex).join('').length
	return {
		word,
		letters: word.split('').map((letter, index) => ({
			letter,
			delay: 250 + (offset + index) * 45,
		})),
	}
})
const manifesto = 'Skincare education is care, not correction.'

/**
 * Finds the smallest scale, around the bottom center, at which an arch
 * bottom-aligned to the viewport covers the whole viewport.
 */
function coverScale(arch: HTMLElement) {
	const halfViewport = window.innerWidth / 2
	let scale = (halfViewport / (arch.offsetWidth / 2)) * 1.05

	for (; scale < 40; scale += 0.05) {
		const radius = (arch.offsetWidth / 2) * scale
		const archTop = window.innerHeight - arch.offsetHeight * scale
		const cornerEdge =
			archTop + radius - Math.sqrt(radius ** 2 - halfViewport ** 2)
		if (cornerEdge <= 0) break
	}
	return scale
}

function useDoorwayZoom() {
	const ref = useRef<HTMLElement>(null)

	useGSAP(
		() => {
			const mm = gsap.matchMedia()

			mm.add(
				{
					wide: `${motionQuery} and (min-width: 721px)`,
					narrow: `${motionQuery} and (max-width: 720px)`,
				},
				(context) => {
					const [left, middle, right] = gsap.utils.toArray<HTMLElement>(
						'.hero-doorways figure',
					)
					const doorways =
						ref.current?.querySelector<HTMLElement>('.hero-doorways')
					if (!left || !middle || !right || !doorways) return
					const zoomTarget = context.conditions?.wide ? middle : doorways

					const timeline = gsap.timeline({
						defaults: { ease: 'none' },
						scrollTrigger: {
							end: '+=140%',
							invalidateOnRefresh: true,
							pin: true,
							scrub: 0.6,
							start: 'top top',
							trigger: ref.current,
						},
					})

					timeline
						.to('.hero-copy', { autoAlpha: 0, duration: 0.3, yPercent: -12 }, 0)
						.to(
							zoomTarget,
							{
								duration: 1,
								ease: 'power2.inOut',
								scale: () => coverScale(zoomTarget),
								transformOrigin: '50% 100%',
							},
							0,
						)
						.to('.hero-veil', { autoAlpha: 1, duration: 0.4 }, 0.6)
						.set('.hero-manifesto', { autoAlpha: 1 }, 0.7)
						.fromTo(
							'.hero-manifesto span',
							{ opacity: 0.12, yPercent: 30 },
							{ duration: 0.3, opacity: 1, stagger: 0.05, yPercent: 0 },
							0.7,
						)
						// Holds the manifesto on screen before the pin releases.
						.to({}, { duration: 0.25 })

					if (context.conditions?.wide) {
						timeline
							.to(left, { autoAlpha: 0, duration: 0.5, xPercent: -60 }, 0)
							.to(right, { autoAlpha: 0, duration: 0.5, xPercent: 60 }, 0)
					}
				},
			)
		},
		{ scope: ref },
	)

	return ref
}

export function Hero() {
	const ref = useDoorwayZoom()

	return (
		<>
			<header ref={ref} className="hero">
				<div className="hero-doorways">
					{doorways.map((image, index) => (
						<figure key={image.src}>
							<img
								alt={image.alt}
								fetchPriority={index === 1 ? 'high' : undefined}
								height={image.height}
								src={image.src}
								width={image.width}
							/>
						</figure>
					))}
				</div>
				<div aria-hidden="true" className="hero-veil" />

				<div className="hero-copy">
					<h1 aria-label="Skin Groove" className="hero-wordmark">
						{wordmarkWords.map(({ word, letters }, wordIndex) => (
							<Fragment key={word}>
								{wordIndex > 0 && ' '}
								<span aria-hidden="true" className="hero-word">
									{letters.map(({ letter, delay }) => (
										<span key={delay} style={{ animationDelay: `${delay}ms` }}>
											{letter}
										</span>
									))}
								</span>
							</Fragment>
						))}
					</h1>
					<div className="hero-foot">
						<p className="hero-tagline">
							Virtual care.
							<br />
							Warm approach.
						</p>
						<p>
							Virtual esthetics rooted in skin health and routines that fit real
							life.
						</p>
						<BookPill />
					</div>
				</div>

				{/* Echoes a line from the guides cards, so screen readers skip it. */}
				<p aria-hidden="true" className="hero-manifesto">
					{manifesto.split(' ').map((word) => (
						<span key={word}>{word}</span>
					))}
				</p>
			</header>
			<div aria-hidden="true" className="hero-colonnade" />
		</>
	)
}
