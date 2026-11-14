/** Markup that `html` inserts without escaping. */
export class Html {
	readonly #markup: string

	constructor(markup: string) {
		this.#markup = markup
	}

	toString() {
		return this.#markup
	}
}

type Value = Html | string | number | false | null | undefined | Value[]

const entities = new Map([
	['&', '&amp;'],
	['<', '&lt;'],
	['>', '&gt;'],
	['"', '&quot;'],
	["'", '&#39;'],
])

function escape(text: string) {
	return text.replace(/[&<>"']/g, (char) => entities.get(char) ?? char)
}

/** Marks a string as safe markup. Pass only constants, never client data. */
function raw(markup: string) {
	return new Html(markup)
}

function serialize(value: Value): string {
	if (value === false || value === null || value === undefined) return ''

	if (Array.isArray(value)) return value.map(serialize).join('')

	if (value instanceof Html) return value.toString()

	return escape(String(value))
}

/**
 * Builds markup from a template literal. It escapes each interpolated string,
 * so client data such as a name cannot inject markup into an email.
 */
export function html(strings: TemplateStringsArray, ...values: Value[]) {
	return raw(
		strings.reduce(
			(markup, string, index) => markup + serialize(values[index - 1]) + string,
		),
	)
}
