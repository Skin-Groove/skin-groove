import EmbedSnippet from '@calcom/embed-snippet'

import { consults } from '@/components/site/links'

type Consult = (typeof consults)[number]

type CalApi = ReturnType<typeof EmbedSnippet>['ns'][string]

const modalTimeout = 8000

const brokenModalStates = new Set([
	'failed',
	'has-message',
	'loading',
	'prerendering',
])

const picker = document.querySelector<HTMLDialogElement>('dialog.gv-picker')

/** One Cal.com namespace for each consult, so each keeps its own prerendered modal. */
const cals = new Map<Consult['key'], CalApi>()

let embedBlocked = false

let opening: Consult | undefined

const bookingPage = (consult: Consult) => `https://cal.com/${consult.calLink}`

function goToBookingPage(consult: Consult) {
	window.location.assign(bookingPage(consult))
}

function handleEmbedFailure() {
	embedBlocked = true

	if (opening) goToBookingPage(opening)
}

function initCal(consult: Consult) {
	const calGlobal = EmbedSnippet()
	calGlobal('init', consult.key)
	const cal = calGlobal.ns[consult.key]

	if (!cal) return undefined

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
	cal('prerender', { calLink: consult.calLink, type: 'modal' })

	return cal
}

/** Loads Cal.com on first intent, because its embed is too heavy for every page view. */
function loadCals() {
	if (cals.size > 0) return

	for (const consult of consults) {
		const cal = initCal(consult)

		if (cal) cals.set(consult.key, cal)
	}

	document
		.querySelector('script[src$="/embed/embed.js"]')
		?.addEventListener('error', handleEmbedFailure)
}

function openBooking(consult: Consult) {
	opening = consult

	try {
		loadCals()
		const cal = cals.get(consult.key)

		if (!cal || embedBlocked) {
			goToBookingPage(consult)

			return
		}

		cal('modal', { calLink: consult.calLink })
	} catch {
		goToBookingPage(consult)

		return
	}

	// Ad blockers can stop embed.js without an error, and a failed booking view stays in the page.
	// Cal.com serves embed.js live, so an unknown state counts as working and cannot close a good modal.
	window.setTimeout(() => {
		opening = undefined

		const state = document
			.querySelector(`cal-modal-box:has(iframe[src*="/${consult.calLink}"])`)
			?.getAttribute('state')

		if (!state || brokenModalStates.has(state)) goToBookingPage(consult)
	}, modalTimeout)
}

const isModified = (event: MouseEvent) =>
	event.metaKey || event.ctrlKey || event.shiftKey || event.altKey

function handleBookClick(event: MouseEvent) {
	if (!picker || isModified(event)) return
	event.preventDefault()
	loadCals()
	picker.showModal()
}

// Safari has no `closedby`, so a click outside the picker box closes it here.
function handleBackdropClick(event: MouseEvent) {
	if (!picker || event.target !== picker) return
	const box = picker.getBoundingClientRect()

	const inside =
		event.clientX >= box.left &&
		event.clientX <= box.right &&
		event.clientY >= box.top &&
		event.clientY <= box.bottom

	if (!inside) picker.close()
}

picker?.addEventListener('click', handleBackdropClick)

for (const consult of consults) {
	const option = picker?.querySelector<HTMLAnchorElement>(
		`a[data-consult="${consult.key}"]`,
	)

	option?.addEventListener('click', (event) => {
		if (isModified(event)) return
		event.preventDefault()
		picker?.close()
		openBooking(consult)
	})
}

for (const link of document.querySelectorAll<HTMLAnchorElement>('a.gv-book')) {
	link.addEventListener('click', handleBookClick)
	link.addEventListener('focus', loadCals)
	link.addEventListener('pointerenter', loadCals)
}
