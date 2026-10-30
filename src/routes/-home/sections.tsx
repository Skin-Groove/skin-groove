import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

import { Closing } from '../-site/closing'
import { Record, Wave } from '../-site/parts'
import { expectations, pillars, sammyIntro, services } from './content'
import { FaqList, GalleryRows } from './parts'

import './sections.css'

export function Sections() {
	return (
		<>
			<section className="home-meet" aria-labelledby="home-meet-title">
				<div className="home-meet-head" data-reveal>
					<Record className="home-meet-record" />
					<h2 id="home-meet-title">Meet Skin Groove</h2>
				</div>
				<div className="home-meet-cards">
					{pillars.map((pillar, index) => (
						<article
							data-reveal
							key={pillar.title}
							style={{ transitionDelay: `${index * 90}ms` }}
						>
							<h3>{pillar.title}</h3>
							{pillar.body.map((paragraph) => (
								<p key={paragraph}>{paragraph}</p>
							))}
						</article>
					))}
				</div>
			</section>

			<section className="home-expect" aria-labelledby="home-expect-title">
				<Wave className="is-top" />
				<div className="home-expect-inner">
					<h2 id="home-expect-title" data-reveal>
						What you can expect
					</h2>
					<div className="home-expect-grid">
						{expectations.map((item, index) => (
							<article
								data-reveal
								key={item.title}
								style={{ transitionDelay: `${index * 90}ms` }}
							>
								<Record className="home-expect-record" />
								<h3>{item.title}</h3>
								<p>{item.body}</p>
							</article>
						))}
					</div>
				</div>
				<Wave className="is-bottom" />
			</section>

			<section className="home-sammy" aria-labelledby="home-sammy-title">
				<figure className="home-sammy-photo" data-reveal>
					<img
						alt="A wavy green mirror with a soft glow beside a globe floor lamp"
						height="720"
						loading="lazy"
						src="/images/groove/53.webp"
						width="480"
					/>
				</figure>
				<div className="home-sammy-copy" data-reveal>
					<p className="gv-kicker">The founder</p>
					<h2 id="home-sammy-title">Hi, I’m Sammy!</h2>
					{sammyIntro.map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
					<Link className="gv-pill" to="/about">
						Meet the founder
						<ArrowRightIcon aria-hidden="true" weight="bold" />
					</Link>
				</div>
			</section>

			<section
				id="services"
				className="home-services"
				aria-labelledby="home-services-title"
			>
				<h2 id="home-services-title" data-reveal>
					Services
				</h2>
				<div className="home-service-grid">
					{services.map((service, index) => (
						<article
							data-reveal
							key={service.name}
							style={{ transitionDelay: `${index * 90}ms` }}
						>
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
			</section>

			<section className="home-room" aria-labelledby="home-room-title">
				<div className="home-room-head" data-reveal>
					<h2 id="home-room-title">The Groove Room</h2>
					<p>Warm light, soft shapes, and spaces that feel like an exhale.</p>
				</div>
				<GalleryRows />
			</section>

			<section id="faq" className="home-faq" aria-labelledby="home-faq-title">
				<figure className="home-faq-photo" data-reveal>
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

			<Closing />
		</>
	)
}
