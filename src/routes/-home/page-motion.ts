import { useRef } from 'react'

import {
	followScrollSpeed,
	gsap,
	motionQuery,
	ScrollTrigger,
	SplitText,
	useGSAP,
} from '@/lib/motion'

/**
 * Animates shared page patterns inside the returned ref:
 * records spin faster with the scroll, `[data-reveal]` elements rise in,
 * and `[data-split]` headings slide up line by line.
 */
export function usePageMotion() {
	const ref = useRef<HTMLElement>(null)

	useGSAP(
		() => {
			const mm = gsap.matchMedia()

			// Touch screens spin records with CSS (base.css), because a JavaScript loop on every frame slows their scrolling.
			mm.add(`${motionQuery} and (hover: hover)`, () => {
				const spins = gsap.utils
					.toArray<SVGSVGElement>('.gv-record')
					.map((record) =>
						gsap.to(record, {
							duration: 6,
							ease: 'none',
							repeat: -1,
							rotation: 360,
							transformOrigin: '50% 50%',
						}),
					)
				return followScrollSpeed((speed) => {
					for (const spin of spins) spin.timeScale(speed)
				})
			})

			mm.add(motionQuery, () => {
				gsap.set('[data-reveal]', { autoAlpha: 0, y: 48 })
				ScrollTrigger.batch('[data-reveal]', {
					start: 'top 90%',
					once: true,
					onEnter: (batch) =>
						gsap.to(batch, {
							autoAlpha: 1,
							duration: 1.2,
							ease: 'expo.out',
							stagger: 0.1,
							y: 0,
						}),
				})

				for (const heading of gsap.utils.toArray<HTMLElement>('[data-split]')) {
					SplitText.create(heading, {
						autoSplit: true,
						mask: 'lines',
						type: 'lines',
						onSplit: (split) =>
							gsap.from(split.lines, {
								duration: 1.3,
								ease: 'expo.out',
								stagger: 0.12,
								yPercent: 110,
								scrollTrigger: {
									trigger: heading,
									start: 'top 88%',
									once: true,
								},
							}),
					})
				}
			})
		},
		{ scope: ref },
	)

	return ref
}
