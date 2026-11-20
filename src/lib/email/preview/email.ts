import type { APIRoute, GetStaticPaths } from 'astro'

import { render } from '../layout'
import { samples } from './samples'

export const getStaticPaths = (() =>
	Object.keys(samples).map((name) => ({
		params: { name },
	}))) satisfies GetStaticPaths

const sampleByName = new Map(Object.entries(samples))

// An endpoint, not a page, so the dev toolbar stays out of the email markup.
// The empty origin makes asset paths relative, so the preview loads the images
// from the dev server before they deploy.
export const GET: APIRoute = ({ params }) => {
	const sample = sampleByName.get(params.name ?? '')

	if (!sample) return new Response('Not found', { status: 404 })

	const context = { origin: '' }
	const { html } = render(sample.email, context)

	return new Response(html, {
		headers: { 'Content-Type': 'text/html; charset=utf-8' },
	})
}
