import { describe, expect, test } from 'vite-plus/test'

import { intakeFormUrl } from '../intake'
import { render } from './layout'
import { consultBooked } from './templates'

const context = { origin: 'https://skingroove.studio' }

const appointment = {
	name: 'Jordan Rivera',
	startTime: '2026-12-02T23:00:00Z',
	endTime: '2026-12-02T23:45:00Z',
	timeZone: 'America/Los_Angeles',
	formUrl: 'https://tally.so/r/lae2yB',
	formMinutes: 15,
}

describe('consultBooked', () => {
	test('shows the time in the client time zone', () => {
		const { html } = render(consultBooked(appointment), context)

		expect(html).toContain('Wednesday, December 2 at 3:00 PM PST')
	})

	test('links the Google Meet call when Cal.com sends one', () => {
		const { html } = render(
			consultBooked({
				...appointment,
				meetUrl: 'https://meet.google.com/abc-defg-hij',
			}),
			context,
		)

		expect(html).toContain('href="https://meet.google.com/abc-defg-hij"')
		expect(html).toContain('45 minutes')
	})

	test('greets the client by first name', () => {
		const { html } = render(consultBooked(appointment), context)

		expect(html).toContain('You’re booked, Jordan!')
	})

	// Cal.com passes the name that the client typed, so it is untrusted.
	test('escapes markup in the client name', () => {
		const { html } = render(
			consultBooked({ ...appointment, name: '<img src=x onerror=alert(1)>' }),
			context,
		)

		expect(html).not.toContain('<img src=x')
		expect(html).toContain('&lt;img')
	})
})

describe('intakeFormUrl', () => {
	test('prefills the client details', () => {
		const url = new URL(
			intakeFormUrl('consult', {
				attendeeName: 'Jordan Rivera',
				email: 'jordan+skin@example.com',
				uid: 'abc123',
			}),
		)

		expect(url.origin + url.pathname).toBe('https://tally.so/r/lae2yB')
		expect(Object.fromEntries(url.searchParams)).toEqual({
			attendeeName: 'Jordan Rivera',
			email: 'jordan+skin@example.com',
			uid: 'abc123',
		})
	})
})
