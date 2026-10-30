const siteOrigin = 'https://skingroove.studio'

/** Canonical URL tags for a page. PR environments point at production on purpose. */
export function canonical(path: string) {
	const url = new URL(path, siteOrigin).href
	return {
		meta: [{ property: 'og:url', content: url }],
		links: [{ rel: 'canonical', href: url }],
	}
}
