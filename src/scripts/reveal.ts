const root = document.querySelector('main')

if (root) {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue
				entry.target.setAttribute('data-visible', '')
				observer.unobserve(entry.target)
			}
		},
		{ rootMargin: '0px 0px -10% 0px' },
	)

	for (const target of root.querySelectorAll('[data-reveal]')) {
		observer.observe(target)
	}

	root.setAttribute('data-reveal-ready', '')
}
