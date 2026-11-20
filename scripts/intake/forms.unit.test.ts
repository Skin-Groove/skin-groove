import { describe, expect, test } from 'vite-plus/test'

import { intakeFormKeys } from '../../src/lib/intake.ts'
import { intakeFormBlocks } from './forms.ts'

describe.each(intakeFormKeys)('the %s form', (key) => {
	const build = intakeFormBlocks[key]

	test('gives each block its own UUID', () => {
		const uuids = build().map((block) => block.uuid)

		expect(new Set(uuids).size).toBe(uuids.length)
	})

	// Tally keys answers by block UUID, so a rebuild must reuse them.
	test('keeps the same UUIDs on each build', () => {
		expect(build().map((block) => block.uuid)).toEqual(
			build().map((block) => block.uuid),
		)
	})

	test('marks only the last page break as last', () => {
		const pageBreaks = build().filter((block) => block.type === 'PAGE_BREAK')

		expect(pageBreaks).not.toHaveLength(0)
		expect(pageBreaks.map((block) => block.payload.isLast)).toEqual(
			pageBreaks.map((_, index) => index === pageBreaks.length - 1),
		)
	})
})
