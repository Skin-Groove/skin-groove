import { createHash } from 'node:crypto'

// Builds Tally form blocks. Block types and payloads follow
// https://developers.tally.so/api-reference/endpoint/forms/post

export type Json = string | number | boolean | Json[] | { [key: string]: Json }

export interface Block {
	uuid: string
	type: string
	groupUuid: string
	groupType: string
	payload: { [key: string]: Json }
}

/** The form settings that the sync script sets. */
export interface FormSettings {
	language: string
	hasProgressBar: boolean
	hasSelfEmailNotifications: boolean
	hasRespondentEmailNotifications: boolean
	hasPartialSubmissions: boolean
	saveForLater: boolean
}

/**
 * Derives a UUID from a key. Tally keys answers by block UUID, so each sync
 * must reuse the same UUIDs, or old answers lose their questions. The UUID
 * carries version 4 bits, because the Tally form treats a selected option with
 * another version as an "Other" answer.
 */
function stableUuid(key: string): string {
	const hex = createHash('sha256').update(key).digest('hex')

	return [
		hex.slice(0, 8),
		hex.slice(8, 12),
		`4${hex.slice(13, 16)}`,
		((Number.parseInt(hex.slice(16, 18), 16) & 0x3f) | 0x80)
			.toString(16)
			.padStart(2, '0') + hex.slice(18, 20),
		hex.slice(20, 32),
	].join('-')
}

export interface HiddenField {
	name: string
	uuid: string
	groupUuid: string
}

/** A question that logic can test or show. */
export interface Question {
	groupUuid: string
	/** The block type that a logic field reference names. */
	questionType: string
	name: string
	/** Every block of the question, its title included. */
	blockUuids: string[]
	/** Option UUIDs by option text, for choice and checkbox questions. */
	options: Map<string, string>
}

interface FieldOptions {
	required?: boolean
	/** Hidden until a showWhen() rule shows it. */
	hidden?: boolean
	placeholder?: string
}

interface ChoiceOptions extends FieldOptions {
	/** Adds an "Other" option with a text field. */
	other?: boolean
}

/** Builds the blocks of one form. Keys must be unique for each block type. */
export class FormBuilder {
	private readonly blocks: Block[] = []

	private pages = 0

	private readonly formKey: string

	constructor(formKey: string) {
		this.formKey = formKey
	}

	/** Returns the blocks, with the last page break marked as last. */
	build(): Block[] {
		const pageBreaks = this.blocks.filter((b) => b.type === 'PAGE_BREAK')

		for (const pageBreak of pageBreaks) {
			pageBreak.payload.isLast = pageBreak === pageBreaks.at(-1)
		}

		return this.blocks
	}

	private uuid(key: string) {
		return stableUuid(`${this.formKey}:${key}`)
	}

	private add(
		key: string,
		type: string,
		payload: { [key: string]: Json },
		group: { uuid?: string; type?: string } = {},
	) {
		const uuid = this.uuid(`${type}:${key}`)

		this.blocks.push({
			uuid,
			type,
			groupUuid: group.uuid ?? uuid,
			groupType: group.type ?? type,
			payload,
		})

		return uuid
	}

	title(text: string) {
		this.add(
			'form-title',
			'FORM_TITLE',
			{ html: text, title: text },
			{ type: 'TEXT' },
		)
	}

	heading(key: string, text: string, level: 2 | 3 = 2) {
		this.add(key, `HEADING_${level}`, { html: text })
	}

	/** Tally text blocks drop lists, so each paragraph is its own block. */
	paragraphs(key: string, html: readonly string[]) {
		html.forEach((paragraph, index) => {
			this.add(`${key}:${index}`, 'TEXT', { html: paragraph })
		})
	}

	hiddenFields(names: readonly string[]): Record<string, HiddenField> {
		const groupUuid = this.uuid('hidden-fields')

		const fields = Object.fromEntries(
			names.map((name) => [
				name,
				{ name, uuid: this.uuid(`hidden:${name}`), groupUuid },
			]),
		)

		this.add(
			'hidden-fields',
			'HIDDEN_FIELDS',
			{
				hiddenFields: Object.values(fields).map(({ name, uuid }) => ({
					uuid,
					name,
				})),
			},
			{ uuid: groupUuid },
		)

		return fields
	}

	pageBreak(key: string) {
		this.add(key, 'PAGE_BREAK', {
			index: this.pages,
			isFirst: this.pages === 0,
			isLast: false,
		})
		this.pages++
	}

	/** Replaces Tally's default thank-you screen. */
	thankYouPage(heading: string, text: string) {
		this.add('thank-you', 'PAGE_BREAK', {
			index: this.pages,
			isFirst: this.pages === 0,
			isLast: false,
			isThankYouPage: true,
		})
		this.pages++
		this.heading('thank-you-heading', heading)
		this.paragraphs('thank-you-text', [text])
	}

	private questionTitle(key: string, title: string, hidden: boolean) {
		return this.add(
			`${key}:title`,
			'TITLE',
			{ html: title, ...(hidden && { isHidden: true }) },
			{ type: 'QUESTION' },
		)
	}

	/** A one-line field. A hidden field can supply its default answer. */
	input(
		key: string,
		title: string,
		type: 'INPUT_TEXT' | 'INPUT_EMAIL' | 'INPUT_DATE',
		options: FieldOptions & { defaultFrom?: HiddenField } = {},
	): Question {
		const { defaultFrom, hidden = false } = options
		const titleUuid = this.questionTitle(key, title, hidden)

		const uuid = this.add(key, type, {
			...this.fieldPayload(key, options),
			...(type === 'INPUT_DATE' && { format: 'MM/dd/yyyy', startWeekOn: '0' }),
			...(defaultFrom && {
				hasDefaultAnswer: true,
				defaultAnswer: {
					uuid: defaultFrom.uuid,
					type: 'HIDDEN_FIELD',
					questionType: 'HIDDEN_FIELDS',
					blockGroupUuid: defaultFrom.groupUuid,
					title: defaultFrom.name,
				},
			}),
		})

		return this.questionOf(key, type, uuid, [titleUuid, uuid])
	}

	textarea(key: string, title: string, options: FieldOptions = {}): Question {
		const titleUuid = this.questionTitle(key, title, options.hidden ?? false)
		const uuid = this.add(key, 'TEXTAREA', this.fieldPayload(key, options))

		return this.questionOf(key, 'TEXTAREA', uuid, [titleUuid, uuid])
	}

	/** A single-choice question. */
	choice(
		key: string,
		title: string,
		options: readonly string[],
		settings: ChoiceOptions = {},
	): Question {
		return this.optionGroup(key, title, options, settings, {
			type: 'MULTIPLE_CHOICE_OPTION',
			groupType: 'MULTIPLE_CHOICE',
		})
	}

	/** A multiple-choice question. */
	checkboxes(
		key: string,
		title: string,
		options: readonly string[],
		settings: ChoiceOptions = {},
	): Question {
		return this.optionGroup(key, title, options, settings, {
			type: 'CHECKBOX',
			groupType: 'CHECKBOXES',
		})
	}

	/** One checkbox, with no question title. It is required by default. */
	consent(
		key: string,
		text: string,
		options: Pick<FieldOptions, 'hidden'> = {},
	): Question {
		const groupUuid = this.uuid(key)

		const uuid = this.add(
			`${key}:0`,
			'CHECKBOX',
			{
				index: 0,
				isFirst: true,
				isLast: true,
				isRequired: true,
				name: key,
				text,
				...(options.hidden && { isHidden: true }),
			},
			{ uuid: groupUuid, type: 'CHECKBOXES' },
		)

		return this.questionOf(key, 'CHECKBOX', groupUuid, [uuid])
	}

	photos(key: string, title: string, minFiles: number) {
		this.questionTitle(key, title, false)
		this.add(key, 'FILE_UPLOAD', {
			isRequired: true,
			name: key,
			hasMultipleFiles: true,
			hasMinFiles: true,
			minFiles,
			hasMaxFiles: true,
			maxFiles: 6,
			hasMaxFileSize: true,
			maxFileSize: 10,
			maxFileSizeUnit: 'MB',
			allowedFiles: { 'image/*': ['.jpg', '.jpeg', '.png', '.heic', '.webp'] },
		})
	}

	/**
	 * Shows hidden questions when any condition matches. A checkbox condition
	 * matches when the option is selected. Tally compares options by UUID.
	 */
	showWhen(
		key: string,
		conditions: readonly { question: Question; option: string }[],
		show: readonly Question[],
	) {
		this.add(key, 'CONDITIONAL_LOGIC', {
			logicalOperator: 'OR',
			conditionals: conditions.map(({ question, option }, index) => {
				const value = question.options.get(option)

				if (!value)
					throw new Error(`${question.name} has no option "${option}".`)

				return {
					uuid: this.uuid(`${key}:condition:${index}`),
					type: 'SINGLE',
					payload: {
						field: {
							uuid: question.groupUuid,
							type: 'INPUT_FIELD',
							questionType: question.questionType,
							blockGroupUuid: question.groupUuid,
							title: question.name,
						},
						comparison:
							question.questionType === 'CHECKBOX' ? 'CONTAINS' : 'IS',
						value,
					},
				}
			}),
			actions: [
				{
					uuid: this.uuid(`${key}:action`),
					type: 'SHOW_BLOCKS',
					payload: { showBlocks: show.flatMap((q) => q.blockUuids) },
				},
			],
		})
	}

	private fieldPayload(key: string, options: FieldOptions) {
		return {
			isRequired: options.required ?? false,
			name: key,
			...(options.hidden && { isHidden: true }),
			...(options.placeholder && { placeholder: options.placeholder }),
		}
	}

	private questionOf(
		key: string,
		questionType: string,
		groupUuid: string,
		blockUuids: string[],
	): Question {
		return {
			groupUuid,
			questionType,
			name: key,
			blockUuids,
			options: new Map(),
		}
	}

	private optionGroup(
		key: string,
		title: string,
		options: readonly string[],
		settings: ChoiceOptions,
		kind: { type: string; groupType: string },
	): Question {
		const titleUuid = this.questionTitle(key, title, settings.hidden ?? false)
		const groupUuid = this.uuid(key)
		const texts = settings.other ? [...options, 'Other'] : options
		const question = this.questionOf(key, kind.type, groupUuid, [titleUuid])

		if (new Set(texts).size !== texts.length) {
			throw new Error(`Question ${key} repeats an option`)
		}

		texts.forEach((text, index) => {
			const isOther = settings.other === true && index === texts.length - 1

			// The text keys the UUID, so a reorder keeps each answer on its own option.
			const uuid = this.add(
				`${key}:option:${text}`,
				kind.type,
				{
					...this.fieldPayload(key, settings),
					index,
					isFirst: index === 0,
					isLast: index === texts.length - 1,
					text,
					...(settings.other && { hasOtherOption: true }),
					...(isOther && { isOtherOption: true }),
				},
				{ uuid: groupUuid, type: kind.groupType },
			)

			question.blockUuids.push(uuid)
			question.options.set(text, uuid)
		})

		return question
	}
}
