import EmbedSnippet from '@calcom/embed-snippet'

import { bookingPath, bookingUrl } from '@/components/site/links'

const calNamespace = 'consult'

const modalTimeout = 8000

const brokenModalStates = new Set([
	'failed',
	'has-message',
	'loading',
	'prerendering',
])

type CalApi = ReturnType<typeof EmbedSnippet>['ns'][string]

let cal: CalApi | undefined

let embedBlocked = false

let opening = false

function goToBookingPage() {
	window.location.assign(bookingUrl)
}

function handleEmbedFailure() {
	embedBlocked = true

	if (opening) goToBookingPage()
}

/** Loads Cal.com on first intent, because its embed is too heavy for every page view. */
function loadCal() {
	if (cal) return cal

	const calGlobal = EmbedSnippet()
	calGlobal('init', calNamespace)
	cal = calGlobal.ns[calNamespace]

	if (!cal) return undefined

	document
		.querySelector('script[src$="/embed/embed.js"]')
		?.addEventListener('error', handleEmbedFailure)
	cal('on', { action: 'linkFailed', callback: handleEmbedFailure })
	cal('ui', {
		cssVarsPerTheme: {
			light: { 'cal-brand': '#b8461b' },
			dark: { 'cal-brand': '#f2b54a' },
		},
		hideEventTypeDetails: false,
		layout: 'month_view',
		theme: 'light',
	})
	// A prerendered modal opens at once and closes cleanly. A late one reopens after the visitor closes it.
	cal('prerender', { calLink: bookingPath, type: 'modal' })

	return cal
}

function openBooking() {
	opening = true

	try {
		const api = loadCal()

		if (!api || embedBlocked) {
			goToBookingPage()

			return
		}

		api('modal', { calLink: bookingPath })
	} catch {
		goToBookingPage()

		return
	}

	// Ad blockers can stop embed.js without an error, and a failed booking view stays in the page.
	// Cal.com serves embed.js live, so an unknown state counts as working and cannot close a good modal.
	window.setTimeout(() => {
		opening = false
		const state = document.querySelector('cal-modal-box')?.getAttribute('state')

		if (!state || brokenModalStates.has(state)) goToBookingPage()
	}, modalTimeout)
}

function handleClick(event: MouseEvent) {
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
	event.preventDefault()
	openBooking()
}

for (const link of document.querySelectorAll<HTMLAnchorElement>('a.gv-book')) {
	link.addEventListener('click', handleClick)
	link.addEventListener('focus', loadCal)
	link.addEventListener('pointerenter', loadCal)
}
