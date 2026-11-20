// Client emails. Copy is a draft until Sammy approves it.

import { followUpBookingUrl } from '@/components/site/links'

import { html } from './html'
import {
	button,
	details,
	type Email,
	heading,
	list,
	note,
	paragraph,
	subheading,
} from './layout'

export interface Appointment {
	/** The name that the client typed into Cal.com. */
	name: string
	/** ISO 8601 start time from the Cal.com webhook. */
	startTime: string
	/** ISO 8601 end time from the Cal.com webhook. */
	endTime: string
	/** IANA time zone of the client, from the Cal.com webhook. */
	timeZone: string
	/** The Google Meet link. The email falls back to the calendar invite without it. */
	meetUrl?: string | undefined
}

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name

function formatAppointment({ startTime, timeZone }: Appointment) {
	const date = new Date(startTime)

	const day = new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		timeZone,
	}).format(date)

	const time = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		timeZoneName: 'short',
		timeZone,
	}).format(date)

	return `${day} at ${time}`
}

const minutes = ({ startTime, endTime }: Appointment) =>
	Math.round((Date.parse(endTime) - Date.parse(startTime)) / 60_000)

const appointmentDetails = (appointment: Appointment) =>
	details([
		['When', formatAppointment(appointment)],
		[
			'Where',
			appointment.meetUrl
				? html`Google Meet:
						<a href="${appointment.meetUrl}" style="color:inherit;"
							>${appointment.meetUrl.replace(/^https:\/\//, '')}</a
						>`
				: 'Google Meet. The link is in your calendar invite.',
		],
		['How long', `${minutes(appointment)} minutes`],
	])

const bookingReason =
	'You got this email because you booked an appointment with Skin Groove.'

// ===== Consultation =====

/** After Sammy confirms a consultation or an acne consultation: the intake form link. */
export function consultBooked(
	appointment: Appointment & { formUrl: string; formMinutes: number },
): Email {
	return {
		subject: 'You’re booked! Here’s your intake form',
		preheader: 'A few minutes now makes our time together count.',
		reason: bookingReason,
		content: html`
			${heading(`You’re booked, ${firstName(appointment.name)}!`)}
			${paragraph(
				'I can’t wait to meet you and talk all things skin. Before our consult, please fill out your intake form. It covers your skin history, your current routine, and your goals, so we can spend our time on what matters most.',
			)}
			${appointmentDetails(appointment)}
			${button('Start my intake form', appointment.formUrl)}
			${note(
				`It takes about ${appointment.formMinutes} minutes. Please send it at least 24 hours before we meet, so I have time to read it.`,
			)}
			${subheading('Before we meet')}
			${list([
				'Take 3 photos of your skin: front-facing, left side, and right side. Use a clean face, natural light, and no filters. The form asks for them.',
				'Keep your current products nearby, so we can talk through each one.',
				'Find a cozy spot with good light for our call.',
			])}
		`,
	}
}

/** After the consultation: thanks and the follow-up link. */
export function consultThanks(client: { name: string }): Email {
	return {
		subject: 'Thank you for grooving with me!',
		preheader: 'Thanks for meeting with me, and when to check in.',
		reason: bookingReason,
		content: html`
			${heading(`Thanks for grooving with me, ${firstName(client.name)}!`)}
			${paragraph(
				'I’m so glad we got to meet and talk through your skin and your goals. I hope you feel confident and excited about your new routine.',
			)}
			${subheading('Check in when you’re ready')}
			${paragraph(
				'Most routines need 4 to 6 weeks to show what they can do. Book a follow-up then, and we’ll look at what’s working and what to adjust.',
			)}
			${button('Book my follow-up', followUpBookingUrl)}
			${note(
				'Questions before then? Reply to this email. It comes straight to me.',
			)}
		`,
	}
}

/**
 * After an acne consultation. Acne follow-ups vary, so Sammy and the client
 * book the next one together during the call.
 */
export function acneThanks(client: { name: string }): Email {
	return {
		subject: 'Thank you for grooving with me!',
		preheader: 'Thanks for meeting with me, and your next visit.',
		reason: bookingReason,
		content: html`
			${heading(`Thanks for grooving with me, ${firstName(client.name)}!`)}
			${paragraph(
				'I’m so glad we got to meet and talk through your skin and your goals. I hope you feel confident and excited about your new routine.',
			)}
			${subheading('Your next visit')}
			${paragraph(
				'We talked through the timing for your follow-up on our call. Once it’s booked, Cal.com sends you the details. If you haven’t booked it yet, or the time no longer works, you can book it here.',
			)}
			${button('Book my follow-up', followUpBookingUrl)}
			${note(
				'Questions before then? Reply to this email. It comes straight to me.',
			)}
		`,
	}
}

// ===== Follow-up =====

/** After a client books a follow-up: the check-in form link. */
export function checkInBooked(
	appointment: Appointment & { formUrl: string },
): Email {
	return {
		subject: 'Your check-in is booked! One quick form first',
		preheader: 'Tell me how your skin is doing since we last met.',
		reason: bookingReason,
		content: html`
			${heading(`Welcome back, ${firstName(appointment.name)}!`)}
			${paragraph(
				'I can’t wait to hear how your skin is doing. Before we meet, please fill out a short check-in form: what changed, what works, and what doesn’t.',
			)}
			${appointmentDetails(appointment)}
			${button('Start my check-in form', appointment.formUrl)}
			${note(
				'The form asks for 3 new photos: front-facing, left side, and right side. Take them in the same light as last time, so we can compare them side by side.',
			)}
		`,
	}
}
