import { expect, test } from '@playwright/test'

// Baselines depend on the OS and fonts, so only the ubuntu-24.04 CI runner can
// record them. See "Visual baselines" in README.md.

// Reduced motion stops the marquee and the lava lamp, and it shows each reveal.
test.use({ contextOptions: { reducedMotion: 'reduce' } })

const pages = [
	{ name: 'home', path: '/' },
	{ name: 'about', path: '/about' },
	{ name: 'logo', path: '/logo' },
]

for (const { name, path } of pages) {
	test(`${name} looks the same`, { tag: '@visual' }, async ({ page }) => {
		await page.goto(path, { waitUntil: 'networkidle' })
		await page.evaluate(async () => {
			const images = [...document.images]

			for (const image of images) image.loading = 'eager'
			await Promise.all(images.map((image) => image.decode()))
		})

		await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true })
	})
}
