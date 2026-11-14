import * as z from 'zod'

import type { Block, FormSettings } from './form-blocks.ts'

// https://developers.tally.so/api-reference/introduction
const apiOrigin = 'https://api.tally.so'

const createdFormSchema = z.object({ id: z.string() })

type Fetch = (url: string, init: RequestInit) => Promise<Response>

export class TallyClient {
	private readonly apiKey: string

	private readonly fetchImpl: Fetch

	constructor(apiKey: string, fetchImpl: Fetch = fetch) {
		this.apiKey = apiKey
		this.fetchImpl = fetchImpl
	}

	/** Creates a published form and returns its ID. */
	async createForm(blocks: Block[], settings: FormSettings): Promise<string> {
		const body = await this.request('/forms', {
			method: 'POST',
			body: JSON.stringify({ status: 'PUBLISHED', blocks, settings }),
		})

		return createdFormSchema.parse(body).id
	}

	/** Replaces the blocks and settings of a form, and publishes it. */
	async updateForm(
		formId: string,
		blocks: Block[],
		settings: FormSettings,
	): Promise<void> {
		await this.request(`/forms/${formId}`, {
			method: 'PATCH',
			body: JSON.stringify({ status: 'PUBLISHED', blocks, settings }),
		})
	}

	private async request(path: string, init: RequestInit) {
		const response = await this.fetchImpl(`${apiOrigin}${path}`, {
			...init,
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				'Content-Type': 'application/json',
			},
		})

		// Form responses hold only the form definition, never client data.
		if (!response.ok) {
			throw new Error(
				`Tally API ${init.method} ${path} failed with ${response.status}: ${await response.text()}`,
			)
		}

		return response.status === 204 ? undefined : response.json()
	}
}
