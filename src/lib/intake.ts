export const intakeFormKeys = ['consult', 'acne', 'followUp'] as const

export type IntakeFormKey = (typeof intakeFormKeys)[number]

/** Tally form IDs. `scripts/intake/sync-forms.ts` creates a form when its ID is empty. */
export const intakeFormIds: Record<IntakeFormKey, string> = {
	consult: 'lae2yB',
	acne: 'M1NW5M',
	followUp: 'RWMe0d',
}
