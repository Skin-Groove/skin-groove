import { ArrowUpIcon } from '@phosphor-icons/react'

import { scrollToTop } from '@/lib/utils/scroll'

import { BookPill } from './booking'
import { LavaLamp } from './lava-lamp'
import { SiteLinks } from './nav'
import { EmailLink, InstagramLink, Record } from './parts'

import './site.css'

const rainbowBands = [
	'var(--garnet)',
	'var(--burnt)',
	'var(--amber)',
	'var(--apricot)',
	'var(--cream)',
]

function Rainbow() {
	return (
		<svg
			aria-hidden="true"
			className="gv-rainbow"
			data-reveal
			viewBox="0 0 400 200"
		>
			{rainbowBands.map((color, index) => {
				const radius = 185 - index * 30
				return (
					<path
						d={`M ${200 - radius} 200 A ${radius} ${radius} 0 0 1 ${200 + radius} 200`}
						fill="none"
						key={color}
						pathLength="1"
						stroke={color}
						strokeDasharray="1"
						strokeWidth="26"
					/>
				)
			})}
		</svg>
	)
}

/** The contact call to action and footer that end each page. */
export function Closing() {
	return (
		<>
			<section
				id="contact"
				className="gv-closing"
				aria-labelledby="gv-closing-title"
			>
				<LavaLamp
					base="#56622a"
					className="gv-lava"
					hot="#f2b54a"
					wax="#b8461b"
				/>
				<Rainbow />
				<div className="gv-closing-arch" data-reveal>
					<h2 id="gv-closing-title">Your best skin era starts here.</h2>
					<p>Virtual · 45 minutes · $50 shop credit</p>
					<BookPill />
					<EmailLink />
					<InstagramLink />
				</div>
			</section>

			<footer className="gv-footer">
				<p className="gv-mark">
					<Record />
					Skin Groove
				</p>
				<nav aria-label="Footer navigation">
					<SiteLinks />
				</nav>
				<div className="gv-footer-end">
					<InstagramLink />
					<button
						aria-label="Back to top"
						className="gv-top"
						onClick={scrollToTop}
						type="button"
					>
						<ArrowUpIcon aria-hidden="true" weight="bold" />
					</button>
				</div>
			</footer>
		</>
	)
}
