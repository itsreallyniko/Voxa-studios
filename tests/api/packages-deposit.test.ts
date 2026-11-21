import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/server/stripe', () => ({ createDepositIntent: vi.fn() }))
import { createDepositIntent } from '@/lib/server/stripe'

const course = { type: 'course', videos: 12, length: 'medium', level: 'text', record: true, recordMinutes: null, clips: 20 }
const contact = { name: 'Jane Doe', email: 'jane@example.com', phone: '813-555-0100', notes: 'x'.repeat(600).slice(0, 600) }

beforeEach(() => {
  vi.resetAllMocks()
  process.env.STRIPE_SECRET_KEY = 'sk_test_x'
  vi.mocked(createDepositIntent).mockResolvedValue({ id: 'pi_1', clientSecret: 'cs_1' })
})

let n = 0
async function post(body: unknown) {
  const { POST } = await import('@/app/api/packages/deposit/route')
  return POST(
    new Request('http://localhost/api/packages/deposit', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.1.0.${++n}` },
      body: JSON.stringify(body),
    })
  )
}

describe('POST /api/packages/deposit', () => {
  it('recomputes the amount and ignores a client amount', async () => {
    const res = await post({ config: course, contact, sessionId: 's1', amount: 1 })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ clientSecret: 'cs_1', paymentIntentId: 'pi_1', deposit: 1410 })
    const args = vi.mocked(createDepositIntent).mock.calls[0][0]
    expect(args.amountCents).toBe(141000)
    expect(args.idempotencyKey).toBe('package-deposit:s1')
    expect(args.receiptEmail).toBe('jane@example.com')
    expect(args.description).toBe('Voxa package deposit (course)')
    expect(args.metadata.kind).toBe('package_deposit')
    expect(args.metadata.notes.length).toBe(450)
    expect(args.metadata.rangeLow).toBe('4700')
    expect(args.metadata.rangeHigh).toBe('5150')
    expect(JSON.parse(args.metadata.config).videos).toBe(12)
  })

  it('is limited to 5 requests per minute per IP', async () => {
    const { POST } = await import('@/app/api/packages/deposit/route')
    const send = () =>
      POST(
        new Request('http://localhost/api/packages/deposit', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.9.9.9' },
          body: JSON.stringify({ config: course, contact, sessionId: 's1' }),
        })
      )
    for (let i = 0; i < 5; i++) expect((await send()).status).toBe(200)
    expect((await send()).status).toBe(429)
  })

  it('400s on bad config', async () => {
    const res = await post({ config: { ...course, videos: 0 }, contact, sessionId: 's1' })
    expect(res.status).toBe(400)
    expect(createDepositIntent).not.toHaveBeenCalled()
  })

  it('400s on missing sessionId', async () => {
    const res = await post({ config: course, contact })
    expect(res.status).toBe(400)
    expect(createDepositIntent).not.toHaveBeenCalled()
  })

  it('503s when Stripe is not configured', async () => {
    delete process.env.STRIPE_SECRET_KEY
    const res = await post({ config: course, contact, sessionId: 's1' })
    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ error: 'payments_not_configured' })
    expect(createDepositIntent).not.toHaveBeenCalled()
  })
})
