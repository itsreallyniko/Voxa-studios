import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/server/cal', () => ({
  createBooking: vi.fn(),
  localISO: vi.fn((d: string, t: string) => `${d}T${t}:00-04:00`),
}))

import { createBooking } from '@/lib/server/cal'

beforeEach(() => {
  vi.resetAllMocks()
  process.env.CAL_EVENT_TYPE_TOUR = '6123370'
  process.env.STUDIO_TIMEZONE = 'America/New_York'
})

let ipCounter = 0
async function call(body: unknown) {
  const { POST } = await import('@/app/api/tour/book/route')
  // Unique IP per request so the route's in-memory rate limiter stays out of the way.
  ipCounter += 1
  return POST(new Request('http://localhost/api/tour/book', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.0.0.${ipCounter}` },
    body: JSON.stringify(body),
  }))
}

const valid = {
  name: 'Jane Founder',
  email: 'jane@example.com',
  phone: '+15555555555',
  date: '2026-07-08',
  time: '14:00',
}

describe('POST /api/tour/book', () => {
  it('400 on bad email', async () => {
    const res = await call({ ...valid, email: 'not-an-email' })
    expect(res.status).toBe(400)
  })

  it('400 on missing name', async () => {
    const res = await call({ ...valid, name: '' })
    expect(res.status).toBe(400)
  })

  it('400 on short phone', async () => {
    const res = await call({ ...valid, phone: '123' })
    expect(res.status).toBe(400)
  })

  it('400 on bad date format', async () => {
    const res = await call({ ...valid, date: '07/08/2026' })
    expect(res.status).toBe(400)
  })

  it('400 on bad time format', async () => {
    const res = await call({ ...valid, time: '2pm' })
    expect(res.status).toBe(400)
  })

  it('503 when CAL_EVENT_TYPE_TOUR is missing', async () => {
    delete process.env.CAL_EVENT_TYPE_TOUR
    const res = await call(valid)
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body.error).toBe('tour_not_configured')
  })

  it('200 with booking on success and passes phone via Cal attendeePhoneNumber field', async () => {
    vi.mocked(createBooking).mockResolvedValue({ uid: 'cal-uid-1', id: 999 })
    const res = await call(valid)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.uid).toBe('cal-uid-1')
    expect(body.startISO).toBe('2026-07-08T14:00:00-04:00')
    expect(body.durationMinutes).toBe(15)

    const callArgs = vi.mocked(createBooking).mock.calls[0][0]
    expect(callArgs.eventTypeId).toBe(6123370)
    // Tour event type is fixed-length in Cal.com; do not send lengthInMinutes.
    expect(callArgs.durationMinutes).toBeUndefined()
    expect(callArgs.attendee.name).toBe('Jane Founder')
    expect(callArgs.attendee.email).toBe('jane@example.com')
    expect(callArgs.bookingFieldsResponses?.attendeePhoneNumber).toBe('+15555555555')
    expect(callArgs.bookingFieldsResponses?.notes).toContain('Phone: +15555555555')
    expect(callArgs.bookingFieldsResponses?.notes).toContain('Interested in: Not specified')
    expect(callArgs.idempotencyKey).toBe('tour:jane@example.com:2026-07-08:14:00')
  })

  it('409 when slot is taken', async () => {
    const err = new Error('boom') as Error & { status: number }
    err.status = 409
    vi.mocked(createBooking).mockRejectedValue(err)
    const res = await call(valid)
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toBe('slot_taken')
  })

  it('retries once on 5xx and succeeds', async () => {
    const err = new Error('boom') as Error & { status: number }
    err.status = 502
    vi.mocked(createBooking)
      .mockRejectedValueOnce(err)
      .mockResolvedValueOnce({ uid: 'cal-uid-retry', id: 1000 })
    const res = await call(valid)
    expect(res.status).toBe(200)
    expect(vi.mocked(createBooking)).toHaveBeenCalledTimes(2)
  })

  it('502 when retry also fails', async () => {
    const err = new Error('boom') as Error & { status: number }
    err.status = 502
    vi.mocked(createBooking).mockRejectedValue(err)
    const res = await call(valid)
    expect(res.status).toBe(502)
  })

  it('normalises US phone formats to E.164', async () => {
    vi.mocked(createBooking).mockResolvedValue({ uid: 'u', id: 1 })
    await call({ ...valid, phone: '813-419-0128' })
    const callArgs = vi.mocked(createBooking).mock.calls[0][0]
    expect(callArgs.bookingFieldsResponses?.attendeePhoneNumber).toBe('+18134190128')
    expect(callArgs.bookingFieldsResponses?.notes).toContain('Phone: 813-419-0128')
  })

  it('puts interested sets in notes and drops unknown ids', async () => {
    vi.mocked(createBooking).mockResolvedValue({ uid: 'u', id: 1 })
    await call({ ...valid, interestedSets: ['executive-podcast', 'horizon-desk', 'bogus'] })
    const callArgs = vi.mocked(createBooking).mock.calls[0][0]
    expect(callArgs.bookingFieldsResponses?.notes).toContain(
      'Interested in: Executive Podcast Set, Horizon Desk Set'
    )
    expect(callArgs.metadata?.interestedSets).toBe('executive-podcast,horizon-desk')
  })

  it('retries without the phone field when Cal rejects it with 400', async () => {
    const err = new Error('bad phone') as Error & { status: number }
    err.status = 400
    vi.mocked(createBooking)
      .mockRejectedValueOnce(err)
      .mockResolvedValueOnce({ uid: 'u2', id: 2 })
    const res = await call(valid)
    expect(res.status).toBe(200)
    const second = vi.mocked(createBooking).mock.calls[1][0]
    expect(second.bookingFieldsResponses?.attendeePhoneNumber).toBeUndefined()
    expect(second.bookingFieldsResponses?.notes).toContain('Phone: +15555555555')
  })
})
