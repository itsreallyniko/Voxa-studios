import { describe, it, expect } from 'vitest'
import { PACKAGE_PAGES, SEND_FILES_NOTE, getPackagePage, calPackageLink } from '@/lib/content/packages'
import { parsePackageConfig } from '@/lib/packages/pricing'

const all = Object.values(PACKAGE_PAGES)
const text = (p: (typeof all)[number]) => JSON.stringify(p)

describe('package page content', () => {
  it('has exactly course, vsl and demo', () => {
    expect(Object.keys(PACKAGE_PAGES).sort()).toEqual(['course', 'demo', 'vsl'])
    expect(getPackagePage('nope')).toBeUndefined()
  })
  it('defaults are valid configs matching the spec', () => {
    for (const p of all) expect(parsePackageConfig(p.defaults)).toEqual(p.defaults)
    expect(PACKAGE_PAGES.course.defaults).toMatchObject({ videos: 10, length: 'medium', level: 'clean' })
    expect(PACKAGE_PAGES.vsl.defaults).toMatchObject({ videos: 1, length: 'short', level: 'motion' })
    expect(PACKAGE_PAGES.demo.defaults).toMatchObject({ videos: 2, length: 'short', level: 'text' })
  })
  it('never mentions Vega', () => {
    for (const p of all) expect(text(p)).not.toMatch(/vega/i)
  })
  it('stories launch anonymous', () => {
    for (const p of all) expect(p.story.useNamed).toBe(false)
  })
  it('FAQ covers revisions and what happens after the call', () => {
    for (const p of all) {
      expect(p.faqs.map((f) => f.answer).join(' ')).toMatch(/2 rounds of revisions/i)
      const after = p.faqs.find((f) => f.question === 'What happens after the call?')
      expect(after?.answer).toBe(
        'We send your final quote and a schedule for recording and delivery. Nothing is due until you approve it.'
      )
    }
  })
  it('copy never mentions a deposit', () => {
    for (const p of all) expect(text(p)).not.toMatch(/deposit/i)
    expect(SEND_FILES_NOTE).not.toMatch(/deposit/i)
    expect(SEND_FILES_NOTE).toMatch(/after your vision call/i)
  })
  it('calPackageLink is null when unset or blank', () => {
    const prev = process.env.NEXT_PUBLIC_CAL_PACKAGE_LINK
    try {
      delete process.env.NEXT_PUBLIC_CAL_PACKAGE_LINK
      expect(calPackageLink()).toBeNull()
      process.env.NEXT_PUBLIC_CAL_PACKAGE_LINK = '  '
      expect(calPackageLink()).toBeNull()
    } finally {
      if (prev === undefined) delete process.env.NEXT_PUBLIC_CAL_PACKAGE_LINK
      else process.env.NEXT_PUBLIC_CAL_PACKAGE_LINK = prev
    }
  })
})
