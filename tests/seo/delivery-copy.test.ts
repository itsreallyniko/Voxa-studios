import { describe, it, expect } from 'vitest'
import { allServices } from '@/lib/content/services'

describe('what you walk out with', () => {
  it.each(allServices())('$slug opens with what sessions include and names no set', (page) => {
    expect(page.delivery).toMatch(/^Sessions include /)
    expect(page.delivery).not.toMatch(/Authority|Executive|Horizon/)
  })

  it.each(allServices())('$slug FAQs describe delivery without limiting it to a set', (page) => {
    const answers = page.faqs.map((f) => f.answer).filter((a) => /multi-cam files|48 hours|48-hour/.test(a))
    for (const a of answers) expect(a).not.toMatch(/Authority|Executive|Horizon/)
  })

  it('still says VSL files are not finished ads', () => {
    const vsl = allServices().find((p) => p.slug === 'vsl-meta-ads-tampa')!
    expect(vsl.delivery).toContain('These are not finished, edited ads.')
  })
})
