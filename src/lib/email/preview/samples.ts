// Sample data for the email preview. The names and times are made up.

import { intakeFormMinutes, intakeFormUrl } from '@/lib/intake'

import type { Email } from '../layout'
import {
	acneThanks,
	checkInBooked,
	consultBooked,
	consultThanks,
} from '../templates'

const client = {
	name: 'Jordan Rivera',
	email: 'jordan@example.com',
	uid: 'sample-booking-uid',
}

const appointment = {
	name: client.name,
	startTime: '2026-12-02T23:00:00Z',
	endTime: '2026-12-02T23:45:00Z',
	timeZone: 'America/Los_Angeles',
	meetUrl: 'https://meet.google.com/abc-defg-hij',
}

const prefill = {
	attendeeName: client.name,
	email: client.email,
	uid: client.uid,
}

interface Sample {
	label: string
	trigger: string
	email: Email
}

export const samples = {
	'consult-booked': {
		label: 'Consult booked',
		trigger: 'Sammy confirms a consultation',
		email: consultBooked({
			...appointment,
			formUrl: intakeFormUrl('consult', prefill),
			formMinutes: intakeFormMinutes.consult,
		}),
	},
	'acne-booked': {
		label: 'Acne booked',
		trigger: 'Sammy confirms an acne consultation',
		email: consultBooked({
			...appointment,
			endTime: '2026-12-03T00:00:00Z',
			formUrl: intakeFormUrl('acne', prefill),
			formMinutes: intakeFormMinutes.acne,
		}),
	},
	'consult-thanks': {
		label: 'Consult thanks',
		trigger: 'The consultation ends',
		email: consultThanks({ name: client.name }),
	},
	'acne-thanks': {
		label: 'Acne thanks',
		trigger: 'The acne consultation ends',
		email: acneThanks({ name: client.name }),
	},
	'check-in-booked': {
		label: 'Check-in booked',
		trigger: 'Sammy confirms a follow-up',
		email: checkInBooked({
			...appointment,
			endTime: '2026-12-02T23:30:00Z',
			formUrl: intakeFormUrl('followUp', prefill),
		}),
	},
} satisfies Record<string, Sample>
