import { describe, it, expect } from 'vitest'
import { allServices } from '@/lib/content/services'

const service = (slug: string) => allServices().find((s) => s.slug === slug)!
const text = (slug: string) => JSON.stringify(service(slug))

describe('screen recording and extra editing', () => {
  it.each(['youtube-studio-tampa', 'course-webinar-tampa'])('%s explains both', (slug) => {
    const page = service(slug)
    expect(page.sections.map((s) => s.heading)).toContain('Screen recording and extra editing')
    expect(text(slug)).toMatch(/screen recording is available/i)
    expect(text(slug)).toMatch(/motion graphics/i)
    expect(text(slug)).toMatch(/floating-head overlay/i)
    expect(page.faqs.map((f) => f.question)).toEqual(
      expect.arrayContaining(['Can I show what is on my laptop?', 'Can you add motion graphics or overlays?']),
    )
  })

  it.each(['vsl-meta-ads-tampa', 'podcast-studio-tampa'])('%s stays unchanged', (slug) => {
    expect(text(slug)).not.toMatch(/screen recording|floating-head/i)
  })

  it('treats editing as an inquiry, with no set price', () => {
    for (const slug of ['youtube-studio-tampa', 'course-webinar-tampa']) {
      const faq = service(slug).faqs.find((f) => f.question === 'Can you add motion graphics or overlays?')!
      expect(faq.answer).toMatch(/ask/i)
      expect(faq.answer).not.toMatch(/\$/)
    }
  })
})
