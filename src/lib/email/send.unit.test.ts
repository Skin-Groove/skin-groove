import { describe, expect, test, vi } from 'vite-plus/test'

import type { Outgoing } from '@/lib/cal/webhook'

import { send } from './send'
import { consultBooked } from './templates'

const outgoing: Outgoing = {
	idempotencyKey: 'BOOKING_CREATED/booking-uid',
	to: 'jordan@example.com',
	email: consultBooked({
		name: 'Jordan Rivera',
		startTime: '2026-12-02T23:00:00.000Z',
		endTime: '2026-12-02T23:45:00.000Z',
		timeZone: 'America/Los_Angeles',
		formUrl: 'https://tally.so/r/lae2yB',
		formMinutes: 15,
	}),
}

interface ResendReply {
	name?: string
}

const reply = (status: number, body: ResendReply = {}) =>
	new Response(JSON.stringify(body), { status })

// Settles only when the request's own deadline aborts it.
const stall: typeof fetch = (_input, init) =>
	new Promise((_resolve, reject) => {
		init?.signal?.addEventListener('abort', () => {
			reject(new Error('aborted'))
		})
	})

describe('send', () => {
	test('retries a rate limit and then succeeds', async () => {
		const fetchImpl = vi
			.fn<typeof fetch>()
			.mockResolvedValueOnce(reply(429))
			.mockResolvedValueOnce(reply(200))

		await send(outgoing, 're_test', { fetchImpl, delays: [0, 0] })

		expect(fetchImpl).toHaveBeenCalledTimes(2)
	})

	test('retries a network error', async () => {
		const fetchImpl = vi
			.fn<typeof fetch>()
			.mockRejectedValueOnce(new Error('offline'))
			.mockResolvedValueOnce(reply(200))

		await send(outgoing, 're_test', { fetchImpl, delays: [0, 0] })

		expect(fetchImpl).toHaveBeenCalledTimes(2)
	})

	test('retries a stalled request after its deadline', async () => {
		const fetchImpl = vi
			.fn<typeof fetch>()
			.mockImplementationOnce(stall)
			.mockResolvedValueOnce(reply(200))

		await send(outgoing, 're_test', { fetchImpl, delays: [0, 0], timeout: 10 })

		expect(fetchImpl).toHaveBeenCalledTimes(2)
	})

	test('retries a concurrent idempotent request', async () => {
		const fetchImpl = vi
			.fn<typeof fetch>()
			.mockRejectedValueOnce(new Error('connection reset'))
			.mockResolvedValueOnce(
				reply(409, { name: 'concurrent_idempotent_requests' }),
			)
			.mockResolvedValueOnce(reply(200))

		await send(outgoing, 're_test', { fetchImpl, delays: [0, 0] })

		expect(fetchImpl).toHaveBeenCalledTimes(3)
	})

	test('retries a conflict whose body is cut off', async () => {
		const cutOff = new ReadableStream({
			start(controller) {
				controller.error(new Error('connection reset'))
			},
		})

		const fetchImpl = vi
			.fn<typeof fetch>()
			.mockResolvedValueOnce(new Response(cutOff, { status: 409 }))
			.mockResolvedValueOnce(reply(200))

		await send(outgoing, 're_test', { fetchImpl, delays: [0, 0] })

		expect(fetchImpl).toHaveBeenCalledTimes(2)
	})

	test('does not retry a reused key with a different email', async () => {
		const fetchImpl = vi
			.fn<typeof fetch>()
			.mockResolvedValue(reply(409, { name: 'invalid_idempotent_request' }))

		await expect(
			send(outgoing, 're_test', { fetchImpl, delays: [0, 0] }),
		).rejects.toThrow('409')
		expect(fetchImpl).toHaveBeenCalledTimes(1)
	})

	test('does not retry a rejected request', async () => {
		const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(reply(422))

		await expect(
			send(outgoing, 're_test', { fetchImpl, delays: [0, 0] }),
		).rejects.toThrow('422')
		expect(fetchImpl).toHaveBeenCalledTimes(1)
	})

	test('gives up after the last retry', async () => {
		const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(reply(503))

		await expect(
			send(outgoing, 're_test', { fetchImpl, delays: [0, 0] }),
		).rejects.toThrow('503')
		expect(fetchImpl).toHaveBeenCalledTimes(3)
	})
})
