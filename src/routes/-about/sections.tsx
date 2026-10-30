import { SiteNav } from '../-site/nav'
import { BookPill, Record, Wave } from '../-site/parts'
import { principles, storyAfter, storyBefore, storyTurn } from './content'

import './about.css'

export function AboutHeader() {
	return (
		<>
			<header className="about-hero">
				<SiteNav />
				<div className="about-hero-inner">
					<div className="about-hero-copy">
						<p className="gv-kicker">About</p>
						<h1>Meet the founder</h1>
						<p className="about-hero-lead">
							Sammy · Esthetician and cosmetologist
						</p>
						<BookPill />
					</div>
					<figure className="about-hero-photo">
						<img
							alt="A salon chair in front of a wavy orange and pink wall"
							fetchPriority="high"
							height="720"
							src="/images/groove/52.webp"
							width="540"
						/>
					</figure>
				</div>
			</header>
			<div aria-hidden="true" className="gv-colonnade" />
		</>
	)
}

export function Story() {
	return (
		<section className="about-story" aria-labelledby="about-story-title">
			<h2 id="about-story-title" className="sr-only">
				Sammy’s story
			</h2>
			<div className="about-story-body about-story-open" data-reveal>
				{storyBefore.map((paragraph, index) => (
					<p key={index}>{paragraph}</p>
				))}
			</div>
			<p className="about-story-turn" data-reveal>
				<Record />
				{storyTurn}
			</p>
			<div className="about-story-body" data-reveal>
				{storyAfter.map((paragraph, index) => (
					<p key={index}>{paragraph}</p>
				))}
			</div>
		</section>
	)
}

export function Principles() {
	return (
		<section
			className="about-principles"
			aria-labelledby="about-principles-title"
		>
			<Wave className="is-top" />
			<div className="about-principles-inner">
				<h2 id="about-principles-title" data-reveal>
					What guides the practice
				</h2>
				<ol>
					{principles.map((principle, index) => (
						<li data-reveal key={principle.title}>
							<span aria-hidden="true" className="about-principle-number">
								{String(index + 1).padStart(2, '0')}
							</span>
							<h3>{principle.title}</h3>
							<p>{principle.body}</p>
						</li>
					))}
				</ol>
			</div>
			<Wave className="is-bottom" />
		</section>
	)
}
