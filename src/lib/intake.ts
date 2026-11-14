export const intakeFormKeys = ['consult', 'acne', 'followUp'] as const

export type IntakeFormKey = (typeof intakeFormKeys)[number]

/** Tally form IDs. `scripts/intake/sync-forms.ts` creates a form when its ID is empty. */
export const intakeFormIds: Record<IntakeFormKey, string> = {
	consult: 'lae2yB',
	acne: 'M1NW5M',
	followUp: 'RWMe0d',
}

/** Cal.com event type IDs. Each event links to the form with the same key. */
export const calEventTypeIds: Record<IntakeFormKey, number> = {
	consult: 7436556,
	acne: 7916454,
	followUp: 7909647,
}

/** About how long each form takes. The Cal.com descriptions say the same. */
export const intakeFormMinutes: Record<IntakeFormKey, number> = {
	consult: 15,
	acne: 20,
	followUp: 5,
}

export interface IntakePrefill {
	attendeeName: string
	email: string
	/** The Cal.com booking UID, so each submission matches its booking. */
	uid: string
}

/** A form link that fills in the client's name and email. */
export function intakeFormUrl(key: IntakeFormKey, prefill: IntakePrefill) {
	const url = new URL(`https://tally.so/r/${intakeFormIds[key]}`)

	for (const [name, value] of Object.entries(prefill)) {
		url.searchParams.set(name, value)
	}

	return url.href
}
