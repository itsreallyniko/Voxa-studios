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

  describe('package deposits', () => {
    const fetchMock = vi.fn()
    const meta = {
      kind: 'package_deposit',
      config: JSON.stringify({ type: 'course', videos: 12, length: 'medium', level: 'text', record: true, recordMinutes: null, clips: 20 }),
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '813-555-0100',
      notes: '',
    }
    const evt = (metadata: Record<string, string>) => ({
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_pkg_1', metadata } },
    })
    beforeEach(() => {
      vi.stubGlobal('fetch', fetchMock)
      fetchMock.mockResolvedValue({ ok: true, status: 200 })
      process.env.RESEND_API_KEY = 're_test'
      vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    it('emails deposit_paid with the intent id', async () => {
      constructEvent.mockReturnValue(evt(meta))
      const res = await post('{}')
      expect(res.status).toBe(200)
      expect(fetchMock).toHaveBeenCalledTimes(1)
      const body = fetchMock.mock.calls[0][1].body as string
      expect(body).toContain('Package lead (deposit paid)')
      expect(body).toContain('pi_pkg_1')
    })

    it('sends nothing without kind', async () => {
      const { kind, ...rest } = meta
      constructEvent.mockReturnValue(evt(rest))
      const res = await post('{}')
      expect(res.status).toBe(200)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('still 200s when Resend throws', async () => {
      fetchMock.mockRejectedValue(new Error('boom'))
      constructEvent.mockReturnValue(evt(meta))
      const res = await post('{}')
      expect(res.status).toBe(200)
    })
  })
})
