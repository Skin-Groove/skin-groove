import { SiteNav } from '../-site/nav'
import { BookPill } from '../-site/parts'

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

export function Hero() {
	return (
		<>
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

				<SiteNav />

				<div className="hero-copy">
					<h1 className="hero-wordmark">Skin Groove</h1>
					<div className="hero-foot">
						<p className="hero-tagline">Find your skincare rhythm.</p>
						<p>
							Thoughtful, curated skincare guidance to help you understand your
							skin, simplify your routine, and finally find what works for you.
						</p>
						<BookPill />
					</div>
				</div>
			</header>
			<div aria-hidden="true" className="gv-colonnade" />
		</>
	)
}
