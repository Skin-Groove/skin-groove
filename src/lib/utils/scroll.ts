/**
 * Smooth scrolling lives here and not in CSS. A CSS smooth scroll also animates
 * the focus scroll of a clicked link, and that animation outlasts the jump to
 * the top of a new page.
 */
export const smoothScroll = (): ScrollBehavior =>
	typeof window !== 'undefined' &&
	window.matchMedia('(prefers-reduced-motion: no-preference)').matches
		? 'smooth'
		: 'auto'

export function scrollToTop() {
	window.scrollTo({ top: 0, behavior: smoothScroll() })
}
