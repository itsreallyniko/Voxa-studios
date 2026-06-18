import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/server/stripe', () => ({
  createManualCaptureIntent: vi.fn(),
}))

import { createManualCaptureIntent } from '@/lib/server/stripe'

beforeEach(() => {
  vi.resetAllMocks()
  process.env.CAL_EVENT_TYPE_EXECUTIVE_PODCAST = '111'
})

async function post(body: unknown) {
  const { POST } = await import('@/app/api/stripe/intent/route')
  return POST(
    new Request('http://localhost/api/stripe/intent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

describe('POST /api/stripe/intent', () => {
  it('400s on unknown setId', async () => {
    const res = await post({
      setId: 'unknown',
      durationMinutes: 90,
      addonIds: [],
      wizardSessionId: 'wiz-1',
      contact: { name: 'Jane', email: 'jane@example.com' },
    })
    expect(res.status).toBe(400)
  })

  it('400s on invalid email', async () => {
    const res = await post({
      setId: 'executive-podcast',
      durationMinutes: 90,
      addonIds: [],
      wizardSessionId: 'wiz-1',
      contact: { name: 'Jane', email: 'nope' },
    })
    expect(res.status).toBe(400)
  })

  it('creates a $300 PI for 90-min base session', async () => {
    vi.mocked(createManualCaptureIntent).mockResolvedValue({
      id: 'pi_1',
      clientSecret: 'pi_1_secret',
      amount: 30000,
      status: 'requires_payment_method',
    })
    const res = await post({
      setId: 'executive-podcast',
      durationMinutes: 90,
      addonIds: [],
      wizardSessionId: 'wiz-1',
      contact: { name: 'Jane', email: 'jane@example.com' },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.clientSecret).toBe('pi_1_secret')
    expect(body.amountCents).toBe(30000)

    const args = vi.mocked(createManualCaptureIntent).mock.calls[0][0]
    expect(args.amountCents).toBe(30000)
    expect(args.idempotencyKey).toBe('wiz-1')
    expect(args.metadata.setId).toBe('executive-podcast')
    expect(args.metadata.email).toBe('jane@example.com')
  })
})
