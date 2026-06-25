import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/server/cal', () => ({
  createBooking: vi.fn(),
  cancelBooking: vi.fn(),
  localISO: (date: string, time: string) => `${date}T${time}:00-04:00`,
}))
const piRetrieve = vi.fn()
const piCapture = vi.fn()
const piCancel = vi.fn()
vi.mock('@/lib/server/stripe', () => ({
  getStripe: () => ({
    paymentIntents: { retrieve: piRetrieve, capture: piCapture, cancel: piCancel },
  }),
}))

import { createBooking } from '@/lib/server/cal'

beforeEach(() => {
  vi.resetAllMocks()
  process.env.CAL_EVENT_TYPE_EXECUTIVE_PODCAST = '111'
  process.env.STUDIO_TIMEZONE = 'America/New_York'
})

async function post(body: unknown) {
  const { POST } = await import('@/app/api/booking/confirm/route')
  return POST(
    new Request('http://localhost/api/booking/confirm', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

const validBody = {
  paymentIntentId: 'pi_1',
  setId: 'executive-podcast',
  durationMinutes: 90,
  addonIds: [],
  schedule: { date: '2026-06-20', time: '13:00' },
  contact: { name: 'Jane', email: 'jane@example.com', phone: '+15555555555' },
  details: { recordingType: 'Podcast', guests: '', socials: '', notes: '' },
}

describe('POST /api/booking/confirm', () => {
  it('books Cal then captures PI on happy path', async () => {
    piRetrieve.mockResolvedValue({ id: 'pi_1', status: 'requires_capture', amount: 30000 })
    vi.mocked(createBooking).mockResolvedValue({ uid: 'cal_abc', id: 5 })
    piCapture.mockResolvedValue({ id: 'pi_1', status: 'succeeded' })

    const res = await post(validBody)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.paid).toBe(true)
    expect(body.bookingUid).toBe('cal_abc')

    expect(vi.mocked(createBooking).mock.calls[0][0].idempotencyKey).toBe('pi_1')
    expect(piCapture).toHaveBeenCalledWith('pi_1')
    expect(piCancel).not.toHaveBeenCalled()
  })

  it('cancels PI and returns 409 when Cal returns 409', async () => {
    piRetrieve.mockResolvedValue({ id: 'pi_1', status: 'requires_capture', amount: 30000 })
    const slotErr = new Error('slot') as Error & { status?: number }
    slotErr.status = 409
    vi.mocked(createBooking).mockRejectedValue(slotErr)
    piCancel.mockResolvedValue({ id: 'pi_1', status: 'canceled' })

    const res = await post(validBody)
    expect(res.status).toBe(409)
    expect(piCancel).toHaveBeenCalledWith('pi_1')
    expect(piCapture).not.toHaveBeenCalled()
  })

  it('rejects + cancels PI when amount mismatches recomputed total', async () => {
    piRetrieve.mockResolvedValue({ id: 'pi_1', status: 'requires_capture', amount: 999 })
    piCancel.mockResolvedValue({ id: 'pi_1', status: 'canceled' })

    const res = await post(validBody)
    expect(res.status).toBe(400)
    expect(piCancel).toHaveBeenCalledWith('pi_1')
    expect(createBooking).not.toHaveBeenCalled()
  })

  it('400s when PI is not requires_capture', async () => {
    piRetrieve.mockResolvedValue({ id: 'pi_1', status: 'requires_payment_method', amount: 30000 })
    const res = await post(validBody)
    expect(res.status).toBe(400)
    expect(createBooking).not.toHaveBeenCalled()
    expect(piCancel).not.toHaveBeenCalled()
  })

  it('400s on missing or short phone', async () => {
    piRetrieve.mockResolvedValue({ id: 'pi_1', status: 'requires_capture', amount: 30000 })
    const res = await post({
      ...validBody,
      contact: { ...validBody.contact, phone: '123' },
    })
    expect(res.status).toBe(400)
    expect(createBooking).not.toHaveBeenCalled()
  })

  it('passes phone to Cal via bookingFieldsResponses and metadata', async () => {
    piRetrieve.mockResolvedValue({ id: 'pi_1', status: 'requires_capture', amount: 30000 })
    vi.mocked(createBooking).mockResolvedValue({ uid: 'cal_abc', id: 5 })
    piCapture.mockResolvedValue({ id: 'pi_1', status: 'succeeded' })

    await post(validBody)

    const callArgs = vi.mocked(createBooking).mock.calls[0][0]
    expect(callArgs.bookingFieldsResponses?.phone).toBe('+15555555555')
    expect(callArgs.metadata?.phone).toBe('+15555555555')
  })

  it('retries once on Cal 5xx then cancels PI', async () => {
    piRetrieve.mockResolvedValue({ id: 'pi_1', status: 'requires_capture', amount: 30000 })
    const flaky = new Error('flake') as Error & { status?: number }
    flaky.status = 500
    vi.mocked(createBooking).mockRejectedValue(flaky)
    piCancel.mockResolvedValue({ id: 'pi_1', status: 'canceled' })

    const res = await post(validBody)
    expect(res.status).toBe(502)
    expect(createBooking).toHaveBeenCalledTimes(2)
    expect(piCancel).toHaveBeenCalledWith('pi_1')
  })
})
