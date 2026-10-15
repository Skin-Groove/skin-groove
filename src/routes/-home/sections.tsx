import { useRef } from 'react'

import { gsap, motionQuery, useGSAP } from '@/lib/motion'
import { cn } from '@/lib/utils/ui'

import { esthetician, expectations, services } from './content'
import { LavaLamp } from './lava-lamp'
import {
	BookPill,
	EmailLink,
	FaqList,
	GalleryRows,
	InstagramLink,
	Record,
} from './parts'

import './sections.css'

const rainbowBands = [
	'var(--garnet)',
	'var(--burnt)',
	'var(--amber)',
	'var(--apricot)',
	'var(--cream)',
]

function Wave({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			className={cn('home-wave', className)}
			preserveAspectRatio="none"
			viewBox="0 0 1440 80"
		>
			<path d="M0 40C240 80 480 0 720 40s480 40 720 0v40H0z" />
		</svg>
	)
}

function Rainbow() {
	return (
		<svg aria-hidden="true" className="home-rainbow" viewBox="0 0 400 200">
			{rainbowBands.map((color, index) => {
				const radius = 185 - index * 30
				return (
					<path
						d={`M ${200 - radius} 200 A ${radius} ${radius} 0 0 1 ${200 + radius} 200`}
						fill="none"
						key={color}
						pathLength="1"
						strokeDasharray="1"
						stroke={color}
						strokeWidth="26"
					/>
				)
			})}
		</svg>
	)
}

const ringText = 'Before you book · Virtual care · Warm approach · '

/** Circular text that circles the FAQ photo. */
function TextRing() {
	return (
		<svg aria-hidden="true" className="home-ring" viewBox="0 0 200 200">
			<path
				d="M100 100 m-92 0 a92 92 0 1 1 184 0 a92 92 0 1 1 -184 0"
				id="home-ring-path"
			/>
			<text>
				<textPath href="#home-ring-path" textLength="575">
					{ringText.repeat(2)}
				</textPath>
			</text>
		</svg>
	)
}

function useSectionMotion() {
	const ref = useRef<HTMLDivElement>(null)

	useGSAP(
		() => {
			const mm = gsap.matchMedia()

			mm.add(motionQuery, () => {
				gsap.from('.home-badge', {
					duration: 1.4,
					ease: 'back.out(1.4)',
					rotation: -90,
					scale: 0.55,
					stagger: 0.15,
					y: 120,
					scrollTrigger: {
						trigger: '.home-expect-grid',
						start: 'top 85%',
						once: true,
					},
				})

				for (const figure of gsap.utils.toArray<HTMLElement>(
					'.home-service-grid figure',
				)) {
					gsap.from(figure, {
						clipPath: 'inset(100% 0% 0% 0% round 999px 999px 1.25rem 1.25rem)',
						duration: 1.6,
						ease: 'expo.out',
						scrollTrigger: { trigger: figure, start: 'top 85%', once: true },
					})
					gsap.fromTo(
						figure.querySelector('img'),
						{ yPercent: -8 },
						{
							ease: 'none',
							yPercent: 8,
							scrollTrigger: { trigger: figure, scrub: true },
						},
					)
				}

				gsap.from('.home-faq-photo img', {
					ease: 'none',
					rotation: -12,
					scale: 1.15,
					scrollTrigger: {
						trigger: '.home-faq',
						scrub: true,
						end: 'center center',
					},
				})

				gsap.from('.home-rainbow path', {
					duration: 1.8,
					ease: 'expo.inOut',
					stagger: 0.12,
					strokeDashoffset: 1,
					scrollTrigger: {
						trigger: '.home-book',
						start: 'top 60%',
						once: true,
					},
				})
			})
		},
		{ scope: ref },
	)

	return ref
}

export function Sections() {
	const ref = useSectionMotion()

	return (
		<div ref={ref}>
			<section
				id="about"
				className="home-meet"
				aria-labelledby="home-meet-title"
			>
				<figure className="home-meet-photo" data-reveal>
					<img
						alt={esthetician.name}
						height="1104"
						loading="lazy"
						src={esthetician.image}
						width="736"
					/>
					<Record className="home-meet-record" />
				</figure>
				<div className="home-meet-copy">
					<p className="home-eyebrow" data-reveal>
						Meet your esthetician
					</p>
					<h2 id="home-meet-title" data-split>
						Hi, I’m Sammy.
					</h2>
					{esthetician.bio.map((paragraph) => (
						<p data-reveal key={paragraph}>
							{paragraph}
						</p>
					))}
					<blockquote data-reveal>{esthetician.quote}</blockquote>
					<div data-reveal>
						<InstagramLink />
					</div>
				</div>
			</section>

			<section className="home-expect" aria-labelledby="home-expect-title">
				<Wave className="is-top" />
				<div className="home-expect-inner">
					<h2 id="home-expect-title" data-split>
						What you can expect
					</h2>
					<div className="home-expect-grid">
						{expectations.map((item) => (
							<article data-reveal key={item.title}>
								<div className="home-badge">
									<Record />
									<h3>{item.title}</h3>
								</div>
								<p>{item.body}</p>
							</article>
						))}
					</div>
				</div>
				<Wave className="is-bottom" />
			</section>

			<section
				id="services"
				className="home-services"
				aria-labelledby="home-services-title"
			>
				<h2 id="home-services-title" data-split>
					Services
				</h2>
				<div className="home-service-grid">
					{services.map((service) => (
						<article data-reveal key={service.name}>
							<figure>
								<img
									alt=""
									height="1400"
									loading="lazy"
									src={service.image}
									width="1000"
								/>
							</figure>
							<h3>{service.name}</h3>
							<p className="home-service-kind">{service.kind}</p>
							<p>{service.body}</p>
						</article>
					))}
				</div>
				<div className="home-services-cta" data-reveal>
					<BookPill />
				</div>
			</section>

			<section className="home-room" aria-labelledby="home-room-title">
				<div className="home-room-head">
					<h2 id="home-room-title" data-split>
						The Groove Room
					</h2>
					<p data-reveal>
						Warm light, soft shapes, and spaces that feel like an exhale. A
						curated shelf of skincare and home finds is coming soon.
					</p>
					<div data-reveal>
						<InstagramLink />
					</div>
				</div>
				<GalleryRows />
			</section>

			<section id="faq" className="home-faq" aria-labelledby="home-faq-title">
				<figure className="home-faq-photo" data-reveal>
					<TextRing />
					<img
						alt="A row of glowing lava lamps"
						height="1277"
						loading="lazy"
						src="/images/groove/61.webp"
						width="1800"
					/>
				</figure>
				<div className="home-faq-copy" data-reveal>
					<h2 id="home-faq-title">Before you book</h2>
					<FaqList />
				</div>
			</section>

			<div className="home-finale">
				<LavaLamp
					base="#56622a"
					className="home-lava"
					hot="#f2b54a"
					wax="#b8461b"
				/>
				<section
					id="contact"
					className="home-book"
					aria-labelledby="home-book-title"
				>
					<Rainbow />
					<h2 id="home-book-title" data-split>
						Your next skin chapter starts here
					</h2>
					<p data-reveal>Virtual · 45 minutes · $50 back in credit</p>
					<div className="home-book-actions" data-reveal>
						<BookPill />
						<EmailLink />
					</div>
				</section>

				<footer className="home-footer">
					<p className="home-mark">
						<Record />
						Skin Groove
					</p>
					<InstagramLink />
					<p>© {new Date().getFullYear()} Skin Groove</p>
				</footer>
			</div>
		</div>
	)
}
