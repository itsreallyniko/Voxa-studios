import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/server/cal', () => ({
  getSlots: vi.fn(),
}))

import { getSlots } from '@/lib/server/cal'

beforeEach(() => {
  vi.resetAllMocks()
  process.env.CAL_EVENT_TYPE_EXECUTIVE_PODCAST = '111'
  process.env.STUDIO_TIMEZONE = 'America/New_York'
})

async function call(qs: string) {
  const { GET } = await import('@/app/api/cal/slots/route')
  return GET(new Request(`http://localhost/api/cal/slots${qs}`))
}

describe('GET /api/cal/slots', () => {
  it('400s on unknown setId', async () => {
    const res = await call('?setId=fake&start=2026-06-20&end=2026-06-25&duration=90')
    expect(res.status).toBe(400)
  })

  it('400s on duration below 90', async () => {
    const res = await call('?setId=executive-podcast&start=2026-06-20&end=2026-06-25&duration=60')
    expect(res.status).toBe(400)
  })

  it('400s on range over 60 days', async () => {
    const res = await call('?setId=executive-podcast&start=2026-06-20&end=2026-09-20&duration=90')
    expect(res.status).toBe(400)
  })

  it('200 with slotsByDate from Cal.com', async () => {
    vi.mocked(getSlots).mockResolvedValue({
      slotsByDate: { '2026-06-20': ['13:00'] },
    })
    const res = await call('?setId=executive-podcast&start=2026-06-20&end=2026-06-25&duration=90')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.slotsByDate['2026-06-20']).toEqual(['13:00'])
    expect(vi.mocked(getSlots).mock.calls[0][0].eventTypeId).toBe(111)
    expect(vi.mocked(getSlots).mock.calls[0][0].timeZone).toBe('America/New_York')
  })

  it('502 when Cal.com client throws', async () => {
    vi.mocked(getSlots).mockRejectedValue(new Error('boom'))
    const res = await call('?setId=executive-podcast&start=2026-06-20&end=2026-06-25&duration=90')
    expect(res.status).toBe(502)
  })
})
