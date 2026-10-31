import { scrollToTop } from '@/lib/utils/scroll'

const nav = document.querySelector('.gv-nav')

const sentinel = document.querySelector('.gv-nav-sentinel')

const toggle = document.querySelector('.gv-nav-toggle')

const [menuIcon, closeIcon] = toggle?.querySelectorAll('svg') ?? []

const homeLink = document.querySelector<HTMLAnchorElement>('[data-home-link]')

const siteLinks = document.querySelectorAll<HTMLAnchorElement>('.gv-links a')

function setMenuOpen(open: boolean) {
	nav?.classList.toggle('is-open', open)
	toggle?.setAttribute('aria-expanded', String(open))
	menuIcon?.toggleAttribute('hidden', open)
	closeIcon?.toggleAttribute('hidden', !open)
}

function setCurrent(link: HTMLAnchorElement, current: boolean) {
	if (current) link.setAttribute('aria-current', 'page')
	else link.removeAttribute('aria-current')
}

// Hash links count as current only on their own hash, so `/` and `/#faq` never both read as current.
function markCurrentLinks() {
	for (const link of siteLinks) {
		const samePage = link.pathname === window.location.pathname
		setCurrent(
			link,
			samePage && (!link.hash || link.hash === window.location.hash),
		)
	}

	if (homeLink) {
		setCurrent(
			homeLink,
			window.location.pathname === '/' && !window.location.hash,
		)
	}
}

if (sentinel) {
	const watch = new IntersectionObserver(([entry]) => {
		nav?.toggleAttribute('data-solid', !entry?.isIntersecting)
	})

	watch.observe(sentinel)
}

toggle?.addEventListener('click', () => {
	setMenuOpen(!nav?.classList.contains('is-open'))
})

window.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') setMenuOpen(false)
})

for (const link of nav?.querySelectorAll('.gv-links a') ?? []) {
	link.addEventListener('click', () => setMenuOpen(false))
}

// A link to the current page would reload it, so home scrolls up by itself.
homeLink?.addEventListener('click', (event) => {
	setMenuOpen(false)

	if (window.location.pathname !== '/') return
	event.preventDefault()
	window.history.replaceState(null, '', '/')
	markCurrentLinks()
	scrollToTop()
})

window.addEventListener('hashchange', markCurrentLinks)

markCurrentLinks()
