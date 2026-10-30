import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

// Mobile browsers resize the viewport when the address bar hides. Recomputing pins then makes the page jump.
ScrollTrigger.config({ ignoreMobileResize: true })

/** Matches visitors who accept motion. Wrap every animation in `gsap.matchMedia().add(motionQuery, …)`. */
export const motionQuery = '(prefers-reduced-motion: no-preference)'

/**
 * Calls `onFrame` every frame with a playback speed that follows the scroll:
 * 1 at rest, faster while the visitor scrolls down, negative while they scroll up fast.
 * Returns a cleanup function.
 */
export function followScrollSpeed(onFrame: (speed: number) => void) {
	let velocity = 0
	let speed = 1
	const trigger = ScrollTrigger.create({
		onUpdate: (self) => {
			velocity = self.getVelocity()
		},
	})
	const tick = () => {
		velocity *= 0.9
		speed += (gsap.utils.clamp(-4, 8, 1 + velocity / 400) - speed) * 0.08
		onFrame(speed)
	}

	gsap.ticker.add(tick)
	return () => {
		gsap.ticker.remove(tick)
		trigger.kill()
	}
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
