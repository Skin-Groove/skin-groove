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
		page.getByRole('link', { name: 'Email Skin Groove' }),
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
