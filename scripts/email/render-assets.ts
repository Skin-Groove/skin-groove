// Renders the email images into public/email, and copies the fonts there.
// Email clients do not support SVG or CSS shapes, so the art ships as images.
// Emails load the fonts from skingroove.studio, not Google Fonts, so no third
// party sees when a client opens an email.
// Run it after a change: `node scripts/email/render-assets.ts`.

import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'

const root = fileURLToPath(new URL('../../', import.meta.url))

const outDir = `${root}public/email/`

const colors = {
	cream: '#fbf1e1',
	apricot: '#f4b98e',
	burnt: '#b8461b',
	garnet: '#4f1420',
	amber: '#f2b54a',
}

async function dataUrl(path: string, type: string) {
	const bytes = await readFile(`${root}${path}`)

	return `data:${type};base64,${bytes.toString('base64')}`
}

const fonts = {
	'caprasimo.woff2':
		'node_modules/@fontsource/caprasimo/files/caprasimo-latin-400-normal.woff2',
	'manrope.woff2':
		'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2',
}

const caprasimo = await dataUrl(fonts['caprasimo.woff2'], 'font/woff2')

const baseCss = `
	@font-face { font-family: Caprasimo; src: url(${caprasimo}) format('woff2'); }
	* { box-sizing: border-box; margin: 0; }
	html, body { background: transparent; }
`

interface Image {
	name: string
	width: number
	height: number
	transparent?: boolean
	body: string
}

const images: Image[] = [
	{
		// The Swoosh logo from the /logo studies, cropped to its art. Garnet
		// replaces the near-black ink, so the emails have no black.
		name: 'logo-swoosh.png',
		width: 440,
		height: 130,
		transparent: true,
		body: `<svg width="440" height="130" viewBox="10 24 760 224" style="display:block">${[
			colors.apricot,
			colors.amber,
			colors.burnt,
			colors.garnet,
		]
			.map((color, index) => {
				const radius = 34 + index * 17

				return `<path d="M 34 ${150 + radius} H 660 A ${radius} ${radius} 0 0 0 ${660 + radius} 150 V 36" fill="none" stroke="${color}" stroke-linecap="round" stroke-width="12" />`
			})
			.join(
				'',
			)}<text x="28" y="150" font-family="Caprasimo" font-size="100" fill="${colors.garnet}">Skin Groove</text></svg>`,
	},
	{
		// The sunset rainbow from the closing section of each page.
		name: 'rainbow.png',
		width: 200,
		height: 100,
		transparent: true,
		body: `<svg width="200" height="100" viewBox="0 0 400 200" style="display:block">${[
			colors.garnet,
			colors.burnt,
			colors.amber,
			colors.apricot,
		]
			.map((color, index) => {
				const radius = 185 - index * 30

				return `<path d="M ${200 - radius} 200 A ${radius} ${radius} 0 0 1 ${200 + radius} 200" fill="none" stroke="${color}" stroke-width="26" />`
			})
			.join('')}</svg>`,
	},
]

await mkdir(`${outDir}fonts`, { recursive: true })

for (const [name, path] of Object.entries(fonts)) {
	await copyFile(`${root}${path}`, `${outDir}fonts/${name}`)
}

// 1 CSS pixel is 2 image pixels, so images stay sharp on retina screens.
const browser = await chromium.launch()

const page = await browser.newPage({ deviceScaleFactor: 2 })

for (const image of images) {
	await page.setViewportSize({ width: image.width, height: image.height })
	await page.setContent(`<style>${baseCss}</style>${image.body}`)
	await page.evaluate(() => document.fonts.ready)
	await page.screenshot({
		path: `${outDir}${image.name}`,
		omitBackground: image.transparent ?? false,
		...(image.name.endsWith('.jpg') && { type: 'jpeg', quality: 82 }),
	})
	console.log(`Rendered public/email/${image.name}`)
}

await browser.close()
