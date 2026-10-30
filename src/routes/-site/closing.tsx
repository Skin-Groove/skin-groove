import { SiteLinks } from './nav'
import { EmailPill, Record } from './parts'

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
		<svg aria-hidden="true" className="gv-rainbow" viewBox="0 0 400 200">
			{rainbowBands.map((color, index) => {
				const radius = 185 - index * 30
				return (
					<path
						d={`M ${200 - radius} 200 A ${radius} ${radius} 0 0 1 ${200 + radius} 200`}
						fill="none"
						key={color}
						stroke={color}
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
				<Rainbow />
				<h2 id="gv-closing-title" data-reveal>
					Your best skin era starts here.
				</h2>
				<p data-reveal>Virtual · From wherever you are</p>
				<div data-reveal>
					<EmailPill />
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
				<p className="gv-footer-tagline">Find your skincare rhythm.</p>
			</footer>
		</>
	)
}
