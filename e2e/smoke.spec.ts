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
		page.getByRole('heading', { name: 'How it works' }),
	).toBeAttached()
	await expect(
		page.getByRole('link', { name: /Book a consult/ }).first(),
	).toHaveAttribute('href', /cal\.com\/sammymintzer/)
	await expect(
		page.getByRole('link', { name: 'Or email sammy@skingroove.studio' }),
	).toBeAttached()
})
