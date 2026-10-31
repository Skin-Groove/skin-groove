import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

import { BookPill } from '../-site/booking'
import { Closing } from '../-site/closing'
import { InstagramLink, Record, Wave } from '../-site/parts'
import { expectations, pillars, sammyIntro, services } from './content'
import { FaqList, GalleryRows } from './parts'

import './sections.css'

export function Sections() {
	return (
		<>
			<section className="home-offer" aria-labelledby="home-offer-title">
				<div className="home-offer-ticket" data-reveal>
					<div>
						<h2 id="home-offer-title">
							<span>$50 consult.</span> <span>$50 shop credit.</span>
						</h2>
						<p>
							After your consult, you get a $50 code for the shop, opening soon.
						</p>
					</div>
					<BookPill />
				</div>
			</section>

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
						alt="Sammy, the founder of Skin Groove, smiling in a black uniform"
						decoding="async"
						height="1080"
						loading="lazy"
						src="/images/sammy.webp"
						width="810"
					/>
					<Record className="home-sammy-record" />
				</figure>
				<div className="home-sammy-copy" data-reveal>
					<p className="gv-kicker">The founder</p>
					<h2 id="home-sammy-title">Hi, I’m Sammy!</h2>
					{sammyIntro.map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
					<div className="home-sammy-actions">
						<Link className="gv-pill" to="/about">
							Meet the founder
							<ArrowRightIcon aria-hidden="true" weight="bold" />
						</Link>
						<InstagramLink />
					</div>
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
									decoding="async"
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
				<div className="home-room-head" data-reveal>
					<h2 id="home-room-title">The Groove Room</h2>
					<p>Warm light, soft shapes, and spaces that feel like an exhale.</p>
					<InstagramLink />
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
