import { describe, it, expect } from 'vitest'
import { PACKAGE_PAGES, getPackagePage, calPackageLink, DEPOSIT_TERMS } from '@/lib/content/packages'
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
  it('FAQ covers revisions and the deposit terms', () => {
    for (const p of all) {
      expect(text(p)).toMatch(/2 rounds of revisions/i)
      expect(p.faqs.some((f) => f.answer.includes(DEPOSIT_TERMS))).toBe(true)
    }
    expect(DEPOSIT_TERMS).toMatch(/credited toward/i)
    expect(DEPOSIT_TERMS).toMatch(/refundable/i)
  })
  it('calPackageLink is null when unset or blank', () => {
    delete process.env.NEXT_PUBLIC_CAL_PACKAGE_LINK
    expect(calPackageLink()).toBeNull()
    process.env.NEXT_PUBLIC_CAL_PACKAGE_LINK = '  '
    expect(calPackageLink()).toBeNull()
  })
})
