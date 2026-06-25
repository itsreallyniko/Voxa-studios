import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/server/cal', () => ({
  getSlots: vi.fn(),
}))

import { getSlots } from '@/lib/server/cal'

beforeEach(() => {
  vi.resetAllMocks()
  process.env.CAL_EVENT_TYPE_TOUR = '6123370'
  process.env.STUDIO_TIMEZONE = 'America/New_York'
})

async function call(qs: string) {
  const { GET } = await import('@/app/api/tour/slots/route')
  return GET(new Request(`http://localhost/api/tour/slots${qs}`))
}

describe('GET /api/tour/slots', () => {
  it('400s on invalid date format', async () => {
    const res = await call('?start=bad&end=2026-06-25')
    expect(res.status).toBe(400)
  })

  it('400s when end is before start', async () => {
    const res = await call('?start=2026-06-25&end=2026-06-20')
    expect(res.status).toBe(400)
  })

  it('400s on range over 60 days', async () => {
    const res = await call('?start=2026-06-20&end=2026-09-20')
    expect(res.status).toBe(400)
  })

  it('503 when CAL_EVENT_TYPE_TOUR is not configured', async () => {
    delete process.env.CAL_EVENT_TYPE_TOUR
    const res = await call('?start=2026-06-20&end=2026-06-25')
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body.error).toBe('tour_not_configured')
  })

  it('200 with slotsByDate from Cal.com', async () => {
    vi.mocked(getSlots).mockResolvedValue({
      slotsByDate: { '2026-06-20': ['13:00', '13:30'] },
    })
    const res = await call('?start=2026-06-20&end=2026-06-25')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.slotsByDate['2026-06-20']).toEqual(['13:00', '13:30'])
    expect(vi.mocked(getSlots).mock.calls[0][0].eventTypeId).toBe(6123370)
    expect(vi.mocked(getSlots).mock.calls[0][0].durationMinutes).toBe(15)
    expect(vi.mocked(getSlots).mock.calls[0][0].timeZone).toBe('America/New_York')
  })

  it('502 when Cal.com client throws', async () => {
    vi.mocked(getSlots).mockRejectedValue(new Error('boom'))
    const res = await call('?start=2026-06-20&end=2026-06-25')
    expect(res.status).toBe(502)
  })
})
