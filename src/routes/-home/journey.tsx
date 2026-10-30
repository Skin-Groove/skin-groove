import { journey } from './content'
import { BookPill } from './parts'

import './journey.css'

/**
 * The three booking steps and the offer. With motion, hero.tsx stacks them
 * over the hero and shows one slide at a time as the visitor scrolls.
 * Without motion, it is a normal section under the hero.
 */
export function Journey() {
	return (
		<section className="journey" aria-labelledby="journey-title">
			<h2 className="journey-title" id="journey-title">
				How it works
			</h2>
			<div aria-hidden="true" className="journey-progress">
				{journey.map((step) => (
					<span key={step.title}>
						<span className="journey-progress-fill" />
					</span>
				))}
			</div>
			<div className="journey-slides">
				<div className="journey-path">
					<div aria-hidden="true" className="journey-track">
						<div className="journey-track-fill" />
					</div>
					<ol className="journey-steps">
						{journey.map((step, index) => (
							<li className="journey-step" key={step.title}>
								<span aria-hidden="true" className="journey-number">
									0{index + 1}
								</span>
								<h3>{step.title}</h3>
								<p>{step.body}</p>
								<span aria-hidden="true" className="journey-link" />
							</li>
						))}
					</ol>
				</div>
				<div className="journey-payoff">
					<p className="journey-payoff-line">Your consult pays for itself.</p>
					<p>Every $50 consult comes with $50 to spend in the shop.</p>
					<BookPill />
				</div>
			</div>
		</section>
	)
}
