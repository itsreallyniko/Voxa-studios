import { describe, it, expect, vi, beforeEach } from 'vitest'

const constructEvent = vi.fn()
vi.mock('@/lib/server/stripe', () => ({
  getStripe: () => ({ webhooks: { constructEvent } }),
}))
vi.mock('@/lib/server/cal', () => ({ cancelBooking: vi.fn() }))

import { cancelBooking } from '@/lib/server/cal'

beforeEach(() => {
  vi.resetAllMocks()
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
})

async function post(body: string, sig = 'sig_ok') {
  const { POST } = await import('@/app/api/stripe/webhook/route')
  return POST(
    new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': sig },
      body,
    })
  )
}

describe('POST /api/stripe/webhook', () => {
  it('400s when signature verification fails', async () => {
    constructEvent.mockImplementation(() => {
      throw new Error('bad sig')
    })
    const res = await post('{}', 'bad')
    expect(res.status).toBe(400)
    expect(cancelBooking).not.toHaveBeenCalled()
  })

  it('200s and cancels Cal booking on charge.refunded', async () => {
    constructEvent.mockReturnValue({
      type: 'charge.refunded',
      data: {
        object: {
          payment_intent: 'pi_1',
          metadata: { bookingUid: 'cal_abc' },
        },
      },
    })
    const res = await post('{}')
    expect(res.status).toBe(200)
    expect(vi.mocked(cancelBooking)).toHaveBeenCalledWith('cal_abc', expect.any(String))
  })

  it('200s and no-ops on payment_intent.canceled', async () => {
    constructEvent.mockReturnValue({ type: 'payment_intent.canceled', data: { object: {} } })
    const res = await post('{}')
    expect(res.status).toBe(200)
    expect(cancelBooking).not.toHaveBeenCalled()
  })
})
