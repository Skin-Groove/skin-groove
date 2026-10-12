import Lenis from 'lenis'

import { gsap, motionQuery, ScrollTrigger, useGSAP } from '@/lib/motion'

import 'lenis/dist/lenis.css'

/** Adds inertial scrolling, driven by the GSAP ticker so ScrollTrigger reads the same frame. */
export function useSmoothScroll() {
	useGSAP(() => {
		const mm = gsap.matchMedia()

		mm.add(motionQuery, () => {
			const lenis = new Lenis({ anchors: true, autoRaf: false })
			const raf = (time: number) => lenis.raf(time * 1000)

			lenis.on('scroll', () => ScrollTrigger.update())
			gsap.ticker.add(raf)
			gsap.ticker.lagSmoothing(0)

			return () => {
				gsap.ticker.remove(raf)
				gsap.ticker.lagSmoothing(500, 33)
				lenis.destroy()
			}
		})
	})
}
