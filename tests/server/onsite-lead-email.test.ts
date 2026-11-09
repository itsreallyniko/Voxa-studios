import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendOnsiteLeadEmail } from '@/lib/server/onsite-lead-email'

const lead = {
  name: 'Pat Doe',
  email: 'pat@example.com',
  phone: '8135550100',
  company: '',
  projectType: 'not-sure',
  budgetRange: 'band-2',
  shootDate: '',
  locationCity: '',
  referralSource: 'google',
  message: '',
  pageSlug: 'hub',
  receivedAt: '2026-11-09T12:00:00.000Z',
}

describe('sendOnsiteLeadEmail', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('writes the labels the visitor picked, not form codes', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await sendOnsiteLeadEmail(lead)

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.subject).toBe('On-Site lead: Pat Doe (Not sure yet)')
    expect(body.text).toContain('Budget: $1k to $3k')
    expect(body.text).toContain('Heard about us: Google')
    expect(body.text).not.toContain('band-2')
  })
})
