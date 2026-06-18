import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const realFetch = global.fetch

beforeEach(() => {
  process.env.CAL_API_KEY = 'test-key'
  process.env.CAL_API_BASE = 'https://api.cal.com/v2'
  process.env.CAL_API_VERSION = '2024-09-04'
})

afterEach(() => {
  global.fetch = realFetch
  vi.restoreAllMocks()
})

describe('getSlots', () => {
  it('calls Cal.com /slots with bearer token and version header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          slots: {
            '2026-06-20': [{ time: '2026-06-20T13:00:00-04:00' }],
            '2026-06-21': [
              { time: '2026-06-21T09:00:00-04:00' },
              { time: '2026-06-21T15:00:00-04:00' },
            ],
          },
        },
      }),
    })
    global.fetch = fetchMock as unknown as typeof fetch

    const { getSlots } = await import('@/lib/server/cal')
    const r = await getSlots({
      eventTypeId: 42,
      startISO: '2026-06-20T00:00:00-04:00',
      endISO: '2026-07-04T00:00:00-04:00',
      durationMinutes: 90,
      timeZone: 'America/New_York',
    })

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('https://api.cal.com/v2/slots')
    expect(url).toContain('eventTypeId=42')
    expect(url).toContain('startTime=2026-06-20')
    expect(url).toContain('duration=90')
    expect(url).toContain('timeZone=America%2FNew_York')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer test-key')
    expect((init.headers as Record<string, string>)['cal-api-version']).toBe('2024-09-04')

    expect(r.slotsByDate['2026-06-20']).toEqual(['13:00'])
    expect(r.slotsByDate['2026-06-21']).toEqual(['09:00', '15:00'])
  })

  it('throws when Cal.com returns non-2xx', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'boom',
    }) as unknown as typeof fetch
    const { getSlots } = await import('@/lib/server/cal')
    await expect(
      getSlots({
        eventTypeId: 1,
        startISO: '2026-06-20T00:00:00-04:00',
        endISO: '2026-06-21T00:00:00-04:00',
        durationMinutes: 90,
        timeZone: 'America/New_York',
      })
    ).rejects.toThrow(/Cal.com.*500/)
  })
})
