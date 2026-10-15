import { Fragment, useRef } from 'react'

import { gsap, motionQuery, useGSAP } from '@/lib/motion'

import { Journey } from './journey'
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
	const ref = useRef<HTMLDivElement>(null)

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

					// data-zoom makes the track tall and the stage sticky (journey.css).
					// Sticky replaces a GSAP pin, because a pin moves the stage into a
					// new wrapper, and the move restarts the CSS intro animations.
					const track = ref.current
					track?.setAttribute('data-zoom', '')

					const timeline = gsap.timeline({
						defaults: { ease: 'none' },
						scrollTrigger: {
							end: 'bottom bottom',
							invalidateOnRefresh: true,
							scrub: 0.6,
							start: 'top top',
							trigger: track,
						},
					})

					timeline
						.to(
							'.hero-copy',
							{ autoAlpha: 0, duration: 0.25, yPercent: -12 },
							0,
						)
						.to(
							zoomTarget,
							{
								duration: 0.7,
								ease: 'power2.inOut',
								scale: () => coverScale(zoomTarget),
								transformOrigin: '50% 100%',
							},
							0,
						)
						.to('.hero-veil', { autoAlpha: 1, duration: 0.3 }, 0.4)
						.from('.journey', { autoAlpha: 0, duration: 0.15 }, 0.55)
						.from('.journey-title', { duration: 0.2, y: 30 }, 0.55)
						.from(
							'.journey-step',
							{ autoAlpha: 0, duration: 0.25, stagger: 0.3, y: 50 },
							0.7,
						)
						.from('.journey-track-fill', { duration: 0.6, scaleX: 0 }, 0.75)
						.from(
							'.journey-payoff',
							{ autoAlpha: 0, duration: 0.25, y: 40 },
							1.45,
						)
						// Holds the finished journey on screen before the stage scrolls away.
						.to({}, { duration: 0.35 })

					if (context.conditions?.wide) {
						timeline
							.to(left, { autoAlpha: 0, duration: 0.4, xPercent: -60 }, 0)
							.to(right, { autoAlpha: 0, duration: 0.4, xPercent: 60 }, 0)
					}

					return () => track?.removeAttribute('data-zoom')
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
			<div ref={ref} className="hero-track">
				<div className="hero-stage">
					<header className="hero">
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
												<span
													key={delay}
													style={{ animationDelay: `${delay}ms` }}
												>
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
									One-to-one video skin consults with New Orleans esthetician
									Sammy Mintzer.{' '}
									<strong>$50, and you get it back as shop credit.</strong>
								</p>
								<BookPill />
							</div>
						</div>
					</header>
					<Journey />
				</div>
			</div>
			<div aria-hidden="true" className="hero-colonnade" />
		</>
	)
}
