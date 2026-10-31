import { expect, test } from '@playwright/test'

test('home page renders its primary content', async ({ page }) => {
	await page.goto('/')
	await expect(
		page.getByRole('heading', { level: 1, name: 'Skin Groove' }),
	).toBeVisible()
	await expect(
		page.getByRole('heading', { name: 'What you can expect' }),
	).toBeAttached()
	await expect(
		page.getByRole('link', { name: /Book a consult/ }).first(),
	).toHaveAttribute('href', /cal\.com\/sammymintzer/)
	await expect(
		page.getByRole('link', { name: 'sammy@skingroove.studio' }),
	).toBeAttached()
})

test('home page links to the about page', async ({ page }) => {
	await page.goto('/')
	await page.getByRole('link', { name: 'Meet the founder' }).click()
	await expect(page).toHaveURL(/\/about$/)
	await expect(
		page.getByRole('heading', { level: 1, name: 'Meet the founder' }),
	).toBeVisible()
	await expect(
		page.getByRole('heading', { name: 'What guides the practice' }),
	).toBeAttached()
})

test('booking falls back to Cal.com when the embed is blocked', async ({
	page,
}) => {
	await page.route('**/embed/embed.js', (route) => route.abort())
	await page.route('https://cal.com/**', (route) =>
		route.fulfill({ body: 'Cal.com', contentType: 'text/html' }),
	)
	await page.goto('/')
	await page
		.getByRole('link', { name: /Book a consult/ })
		.first()
		.click()
	await expect(page).toHaveURL(/cal\.com\/sammymintzer/)
})

test('booking falls back to Cal.com when the popup fails to load', async ({
	page,
}) => {
	await page.route('**/embed/embed.js', (route) =>
		route.fulfill({
			body: `document.body.append(Object.assign(document.createElement('cal-modal-box'), { id: 'failed-modal' }))
document.getElementById('failed-modal').setAttribute('state', 'failed')`,
			contentType: 'text/javascript',
		}),
	)
	await page.route('https://cal.com/**', (route) =>
		route.fulfill({ body: 'Cal.com', contentType: 'text/html' }),
	)
	await page.goto('/')
	await page
		.locator('[data-reveal-ready]')
		.first()
		.waitFor({ state: 'attached' })
	await page
		.getByRole('link', { name: /Book a consult/ })
		.first()
		.click()
	await expect(page).toHaveURL(/cal\.com\/sammymintzer/, { timeout: 12_000 })
})

test('booking falls back to Cal.com when the embed throws', async ({
	page,
}) => {
	await page.route('**/embed/embed.js', (route) =>
		route.fulfill({
			body: `window.Cal.ns.consult.q.push = () => { throw new Error('embed failed') }
window.embedReady = true`,
			contentType: 'text/javascript',
		}),
	)
	await page.route('https://cal.com/**', (route) =>
		route.fulfill({ body: 'Cal.com', contentType: 'text/html' }),
	)
	await page.goto('/')
	const book = page.getByRole('link', { name: /Book a consult/ }).first()
	await book.hover()
	await page.waitForFunction(() => 'embedReady' in window)
	await book.click()
	await expect(page).toHaveURL(/cal\.com\/sammymintzer/, { timeout: 2000 })
})

test('the home link returns to the top of the home page', async ({ page }) => {
	await page.goto('/')
	await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }))
	await page.getByRole('link', { name: 'Skin Groove home' }).click()
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

test('a new page starts at the top without a scroll animation', async ({
	page,
}) => {
	await page.goto('/#services')
	await expect
		.poll(() => page.evaluate(() => window.scrollY))
		.toBeGreaterThan(0)
	await page.getByRole('link', { name: 'Meet the founder' }).click()
	await expect(
		page.getByRole('heading', { level: 1, name: 'Meet the founder' }),
	).toBeVisible()
	expect(await page.evaluate(() => window.scrollY)).toBe(0)
})

test('scrolling before the page finishes loading keeps the position', async ({
	page,
}) => {
	let releaseScripts = () => {}

	const scriptsHeld = new Promise<void>((resolve) => {
		releaseScripts = resolve
	})

	await page.route(
		(url) => /\.(js|tsx?)$/.test(url.pathname),
		async (route) => {
			await scriptsHeld
			await route.continue()
		},
	)
	await page.goto('/', { waitUntil: 'commit' })
	await page.getByRole('heading', { level: 1 }).waitFor()
	await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }))
	releaseScripts()
	await page
		.locator('[data-reveal-ready]')
		.first()
		.waitFor({ state: 'attached' })
	// Scroll anchoring moves the position a little when the styles settle.
	expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(800)
})

test('the back to top button returns to the top of the page', async ({
	page,
}) => {
	await page.goto('/about')
	await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }))
	await page.getByRole('button', { name: 'Back to top' }).click()
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

test('a hash link reads as current only on its own hash', async ({ page }) => {
	await page.goto('/#faq')
	const footer = page.getByRole('navigation', { name: 'Footer navigation' })
	const faq = footer.getByRole('link', { name: 'FAQ' })
	await expect(faq).toHaveAttribute('aria-current', 'page')
	await expect(
		footer.getByRole('link', { name: 'Services' }),
	).not.toHaveAttribute('aria-current')
	await page.getByRole('link', { name: 'Skin Groove home' }).click()
	await expect(page).toHaveURL(/\/$/)
	await expect(faq).not.toHaveAttribute('aria-current')
})

test.describe('on a narrow screen', () => {
	test.use({ viewport: { width: 320, height: 800 } })

	test('the menu opens, and each way out closes it', async ({ page }) => {
		await page.goto('/')
		const toggle = page.getByRole('button', { name: 'Menu' })
		const menu = page.locator('.gv-nav-menu')

		await toggle.click()
		await expect(toggle).toHaveAttribute('aria-expanded', 'true')
		await expect(menu).toBeVisible()

		await page.keyboard.press('Escape')
		await expect(toggle).toHaveAttribute('aria-expanded', 'false')
		await expect(menu).toBeHidden()

		await toggle.click()
		await menu.getByRole('link', { name: 'FAQ' }).click()
		await expect(page).toHaveURL(/#faq$/)
		await expect(toggle).toHaveAttribute('aria-expanded', 'false')
	})
})

test.describe('on a touch screen', () => {
	test.use({ hasTouch: true, isMobile: true })

	test('a tap pauses the gallery and the next tap plays it', async ({
		page,
	}) => {
		await page.goto('/')
		await page
			.locator('[data-reveal-ready]')
			.first()
			.waitFor({ state: 'attached' })
		const gallery = page.locator('.gv-rows')

		const playState = () =>
			gallery
				.locator('.gv-row')
				.first()
				.evaluate((row) => getComputedStyle(row).animationPlayState)

		await gallery.scrollIntoViewIfNeeded()
		await expect.poll(playState).toBe('running')
		await gallery.tap()
		await expect.poll(playState).toBe('paused')
		await gallery.tap()
		await expect.poll(playState).toBe('running')
	})
})
