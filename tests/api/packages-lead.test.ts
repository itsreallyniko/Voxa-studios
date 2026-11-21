import { describe, it, expect, vi, beforeEach } from 'vitest'

const course = { type: 'course', videos: 12, length: 'medium', level: 'text', record: true, recordMinutes: null, clips: 20 }
const contact = { name: 'Jane Doe', email: 'jane@example.com', phone: '813-555-0100', notes: '' }
const fetchMock = vi.fn()

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockResolvedValue({ ok: true, status: 200 })
  process.env.RESEND_API_KEY = 're_test'
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

let n = 0
async function post(body: unknown) {
  const { POST } = await import('@/app/api/packages/lead/route')
  return POST(
    new Request('http://localhost/api/packages/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.0.0.${++n}` },
      body: JSON.stringify(body),
    })
  )
}

describe('POST /api/packages/lead', () => {
  it('quotes server-side and sends the started email', async () => {
    const res = await post({ config: course, contact })
    expect(res.status).toBe(200)
    expect((await res.json()).quote.total).toBe(4700)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][1].body).toContain('Package lead (started)')
  })

  it.each([
    { videos: 0 },
    { videos: 999 },
    { recordMinutes: 45 },
    { level: 'x' },
  ])('400s on bad config %j', async (patch) => {
    const res = await post({ config: { ...course, ...patch }, contact })
    expect(res.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('400s on bad contact', async () => {
    const res = await post({ config: course, contact: { ...contact, email: 'nope' } })
    expect(res.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('200s without sending when RESEND_API_KEY is unset', async () => {
    delete process.env.RESEND_API_KEY
    const res = await post({ config: course, contact })
    expect(res.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('still 200s when Resend fails', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 })
    const res = await post({ config: course, contact })
    expect(res.status).toBe(200)
  })

  it('honeypot returns 200 with no email', async () => {
    const res = await post({ config: course, contact, website: 'spam.com' })
    expect(res.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
