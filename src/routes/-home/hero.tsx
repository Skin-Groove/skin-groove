import { Fragment, useRef } from 'react'

import { gsap, motionQuery, ScrollTrigger, useGSAP } from '@/lib/motion'

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

// Timeline units. Each journey slide holds the screen for one slideLength before the next one replaces it.
const introLength = 0.7
const slideLength = 1
const fadeLength = 0.3
const holdLength = 0.5

/**
 * Pins the hero with sticky positioning, then shows the journey one slide at a
 * time. Wide screens first zoom through the middle doorway. Phones skip the
 * zoom and cover the hero with a dense veil.
 */
function useHeroMotion() {
	const ref = useRef<HTMLDivElement>(null)

	useGSAP(
		() => {
			const mm = gsap.matchMedia()

			mm.add(
				{
					motion: motionQuery,
					touch: '(hover: none)',
					wide: '(min-width: 721px)',
				},
				(context) => {
					const track = ref.current
					if (!track || !context.conditions?.motion) return

					// data-zoom makes the track tall and the stage sticky (journey.css).
					// Sticky replaces a GSAP pin, because a pin moves the stage into a
					// new wrapper, and the move restarts the CSS intro animations.
					track.setAttribute('data-zoom', '')

					const wide = context.conditions.wide ?? false
					// The matchMedia context reverts the scrubbed timeline by itself.
					const stopSteps = context.conditions.touch
						? stepThroughJourney(track, wide)
						: scrubJourney(track, wide)

					return () => {
						stopSteps?.()
						track.removeAttribute('data-zoom')
					}
				},
			)
		},
		{ scope: ref },
	)

	return ref
}

function journeyParts(track: HTMLElement) {
	return {
		doorways: gsap.utils.toArray<HTMLElement>('.hero-doorways figure', track),
		fills: gsap.utils.toArray<HTMLElement>('.journey-progress-fill', track),
		slides: gsap.utils.toArray<HTMLElement>(
			'.journey-step, .journey-payoff',
			track,
		),
	}
}

function journeyLength(slideCount: number) {
	return introLength + (slideCount - 1) * slideLength + fadeLength + holdLength
}

/** Mouse and trackpad: a timeline that follows the scroll position frame by frame. */
function scrubJourney(track: HTMLElement, wide: boolean) {
	const { doorways, fills, slides } = journeyParts(track)
	const [left, middle, right] = doorways

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
		.to('.hero-copy', { autoAlpha: 0, duration: 0.25, yPercent: -12 }, 0)
		.to('.hero-veil', { autoAlpha: 1, duration: 0.3 }, 0.3)
		.from(
			['.journey-title', '.journey-progress'],
			{ autoAlpha: 0, duration: 0.2, y: 20 },
			0.5,
		)

	if (wide && left && middle && right) {
		timeline
			.to(left, { autoAlpha: 0, duration: 0.4, xPercent: -60 }, 0)
			.to(right, { autoAlpha: 0, duration: 0.4, xPercent: 60 }, 0)
			.to(
				middle,
				{
					duration: introLength,
					ease: 'power2.inOut',
					scale: () => coverScale(middle),
					transformOrigin: '50% 100%',
				},
				0,
			)
	}

	gsap.set(fills, { scaleX: 0 })

	slides.forEach((slide, index) => {
		const enter = introLength + index * slideLength
		timeline.fromTo(
			slide,
			{ autoAlpha: 0, y: 60 },
			{ autoAlpha: 1, duration: fadeLength, y: 0 },
			enter,
		)
		const fill = fills[index]
		if (fill) timeline.to(fill, { duration: fadeLength, scaleX: 1 }, enter)
		if (index < slides.length - 1) {
			timeline.to(
				slide,
				{ autoAlpha: 0, duration: 0.25, y: -60 },
				enter + slideLength - fadeLength,
			)
		}
	})
	// Holds the payoff on screen before the stage scrolls away.
	timeline.to({}, { duration: holdLength })
}

/**
 * Touch screens: the scroll only picks the current slide, and CSS transitions
 * (journey.css) animate the change. iOS scrolls on its own thread at up to
 * 120 fps, but runs JavaScript frames at 60 fps or less. A scrubbed timeline
 * therefore lags the finger. CSS transitions run with the scroll.
 */
function stepThroughJourney(track: HTMLElement, wide: boolean) {
	const { doorways, fills, slides } = journeyParts(track)
	const middle = doorways[1]
	const length = journeyLength(slides.length)
	let current: number | undefined

	const show = (progress: number) => {
		// -1 is the hero. A slide takes over when the previous slide starts to fade out.
		const step = gsap.utils.clamp(
			-1,
			slides.length - 1,
			Math.floor((progress * length - introLength + fadeLength) / slideLength),
		)
		if (step === current) return
		current = step

		track.toggleAttribute('data-open', step >= 0)
		slides.forEach((element, index) => {
			element.toggleAttribute('data-active', index === step)
			element.toggleAttribute('data-past', index < step)
		})
		fills.forEach((element, index) => {
			element.toggleAttribute('data-done', index <= step)
		})
	}

	track.setAttribute('data-steps', '')
	const trigger = ScrollTrigger.create({
		end: 'bottom bottom',
		start: 'top top',
		trigger: track,
		onRefresh: (self) => {
			if (wide && middle) {
				track.style.setProperty('--cover-scale', String(coverScale(middle)))
			}
			show(self.progress)
		},
		onUpdate: (self) => show(self.progress),
	})

	return () => {
		trigger.kill()
		track.removeAttribute('data-steps')
		track.removeAttribute('data-open')
		track.style.removeProperty('--cover-scale')
		for (const element of [...slides, ...fills]) {
			element.removeAttribute('data-active')
			element.removeAttribute('data-past')
			element.removeAttribute('data-done')
		}
	}
}

export function Hero() {
	const ref = useHeroMotion()

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
