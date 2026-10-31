import type { MouseEvent } from 'react'

import { cn } from '@/lib/utils/ui'

import { bookingPath, bookingUrl } from './links'

const calNamespace = 'consult'
const modalTimeout = 8000
const brokenModalStates = new Set([
	'failed',
	'has-message',
	'loading',
	'prerendering',
])

type CalApi = Awaited<
	ReturnType<typeof import('@calcom/embed-react').getCalApi>
>

let cal: Promise<CalApi> | undefined
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
	cal ??= import('@calcom/embed-react')
		.then(async ({ getCalApi }) => {
			const api = await getCalApi({ namespace: calNamespace })
			document
				.querySelector('script[src$="/embed/embed.js"]')
				?.addEventListener('error', handleEmbedFailure)
			api('on', { action: 'linkFailed', callback: handleEmbedFailure })
			api('ui', {
				cssVarsPerTheme: {
					light: { 'cal-brand': '#b8461b' },
					dark: { 'cal-brand': '#f2b54a' },
				},
				hideEventTypeDetails: false,
				layout: 'month_view',
				theme: 'light',
			})
			// A prerendered modal opens at once and closes cleanly. A late one reopens after the visitor closes it.
			api('prerender', { calLink: bookingPath, type: 'modal' })
			return api
		})
		.catch((error: unknown) => {
			cal = undefined
			throw error
		})
	return cal
}

function preloadCal() {
	loadCal().catch(() => undefined)
}

async function openBooking() {
	opening = true
	try {
		const api = await loadCal()
		if (embedBlocked) {
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

function handleClick(event: MouseEvent<HTMLAnchorElement>) {
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
	event.preventDefault()
	void openBooking()
}

/** Opens the Cal.com popup. The link still works in a new tab or without JavaScript. */
export function BookPill({ className }: { className?: string }) {
	return (
		<a
			aria-haspopup="dialog"
			className={cn('gv-pill', 'gv-book', className)}
			href={bookingUrl}
			onClick={handleClick}
			onFocus={preloadCal}
			onPointerEnter={preloadCal}
		>
			<b>
				Book<i> a consult</i>
			</b>
			<span>$50</span>
		</a>
	)
}
