import { expect, type Page, test } from '@playwright/test'

/** Opens the consult picker from the first Book pill and picks a consult. */
async function bookConsult(page: Page, name: RegExp) {
	await page
		.getByRole('link', { name: /Book a consult/ })
		.first()
		.click()
	await page
		.getByRole('dialog', { name: 'Pick your consult' })
		.getByRole('link', { name })
		.click()
}

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
	await bookConsult(page, /Acne consultation/)
	await expect(page).toHaveURL(
		/cal\.com\/sammymintzer\/virtual-acne-consultation/,
	)
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
	await bookConsult(page, /Skin consultation/)
	await expect(page).toHaveURL(
		/cal\.com\/sammymintzer\/virtual-skin-consultation/,
		{ timeout: 12_000 },
	)
})

test('booking falls back to Cal.com when the embed throws', async ({
	page,
}) => {
	await page.route('**/embed/embed.js', (route) =>
		route.fulfill({
			body: `window.Cal.ns.skin.q.push = () => { throw new Error('embed failed') }
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
	await bookConsult(page, /Skin consultation/)
	await expect(page).toHaveURL(
		/cal\.com\/sammymintzer\/virtual-skin-consultation/,
		{ timeout: 2000 },
	)
})

test('the Book pill opens a picker with each consult', async ({ page }) => {
	await page.goto('/')
	await page
		.getByRole('link', { name: /Book a consult/ })
		.first()
		.click()
	const picker = page.getByRole('dialog', { name: 'Pick your consult' })
	await expect(picker.getByRole('link')).toHaveText([
		/Skin consultation/,
		/Acne consultation/,
	])
	await page.keyboard.press('Escape')
	await expect(picker).toBeHidden()
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
	await page.goto('/#services')
	const footer = page.getByRole('navigation', { name: 'Footer navigation' })
	const services = footer.getByRole('link', { name: 'Services' })
	await expect(services).toHaveAttribute('aria-current', 'page')
	await expect(footer.getByRole('link', { name: 'FAQ' })).not.toHaveAttribute(
		'aria-current',
	)
	await page.getByRole('link', { name: 'Skin Groove home' }).click()
	await expect(page).toHaveURL(/\/$/)
	await expect(services).not.toHaveAttribute('aria-current')
})

test('the FAQ page groups the questions by topic', async ({ page }) => {
	await page.goto('/faq')
	await expect(page.getByRole('link', { name: 'FAQ' }).first()).toHaveAttribute(
		'aria-current',
		'page',
	)
	await page
		.getByRole('navigation', { name: 'FAQ topics' })
		.getByRole('link', { name: 'Getting started' })
		.click()
	await expect(page).toHaveURL(/\/faq#getting-started$/)
	const question = page.getByText('I have no idea where to start.')
	await question.click()
	await expect(page.getByText('More than okay.')).toBeVisible()
})

test.describe('on a narrow screen', () => {
	test.use({ viewport: { width: 320, height: 800 } })

	// `.gv` clips horizontal overflow, so a broken layout cuts text off
	// instead of adding a scrollbar. Decorative rows are aria-hidden.
	for (const path of ['/', '/about', '/faq']) {
		test(`no text runs off the screen on ${path}`, async ({ page }) => {
			await page.goto(path)

			const cutOff = await page.evaluate(() =>
				[
					...document.querySelectorAll('h1, h2, h3, p, li, summary, a, button'),
				].flatMap((element) => {
					const box = element.getBoundingClientRect()

					// A long word can also spill out of a box that fits the screen.
					// Screen-reader text clips itself on purpose, so skip clipped boxes.
					const spills =
						element.textContent?.trim() !== '' &&
						getComputedStyle(element).overflowX === 'visible' &&
						element.scrollWidth > element.clientWidth + 1

					const offScreen =
						box.width > 1 &&
						(box.left < -1 || box.right > window.innerWidth + 1 || spills)

					return offScreen && !element.closest('[aria-hidden="true"]')
						? [element.textContent?.trim().slice(0, 40)]
						: []
				}),
			)

			expect(cutOff).toEqual([])
		})
	}

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
		await menu.getByRole('link', { name: 'Services' }).click()
		await expect(page).toHaveURL(/#services$/)
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
