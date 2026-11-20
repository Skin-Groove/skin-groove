// Creates or updates the Tally intake forms from scripts/intake/forms.ts.
// Run: pnpm exec varlock run -- node scripts/intake/sync-forms.ts
// A new form prints its ID. Commit that ID in src/lib/intake.ts.

import { execFileSync } from 'node:child_process'

import { intakeFormIds, intakeFormKeys } from '../../src/lib/intake.ts'
import { intakeFormBlocks, intakeFormSettings } from './forms.ts'
import { TallyClient } from './tally-api.ts'

const apiKey = process.env.TALLY_API_KEY

if (!apiKey) throw new Error('TALLY_API_KEY is not set.')

function git(...args: string[]): string {
	return execFileSync('git', args, {
		cwd: import.meta.dirname,
		encoding: 'utf8',
	}).trim()
}

// The log names a commit as the consent text that went live, so that commit
// must hold the forms that the script publishes.
if (
	git('status', '--porcelain', '--', ':/scripts/intake', ':/src/lib/intake.ts')
) {
	throw new Error('Commit the form changes before the sync.')
}

const commit = git('rev-parse', '--short', 'HEAD')

// Build every form first, so that a builder error stops the run before any
// form changes.
const forms = intakeFormKeys.map((key) => ({
	key,
	formId: intakeFormIds[key],
	blocks: intakeFormBlocks[key](),
}))

const client = new TallyClient(apiKey)

// Each form goes live when its own request succeeds, so each line records that
// time. The consent log needs it, also after a run that stops early.
function live(key: string, formId: string): string {
	return `${key} ${formId} live at ${new Date().toISOString()}, commit ${commit}`
}

for (const { key, formId, blocks } of forms) {
	if (formId) {
		await client.updateForm(formId, blocks, intakeFormSettings)
		console.log(`Updated ${live(key, formId)}`)
	} else {
		const id = await client.createForm(blocks, intakeFormSettings)
		console.log(`Created ${live(key, id)}. Add this ID to src/lib/intake.ts.`)
	}
}
