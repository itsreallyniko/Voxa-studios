import { describe, it, expect } from 'vitest'
import { allServices } from '@/lib/content/services'

const banned =
  /(we|our team)\s+(write|craft|script)|scriptwriting service|funnel strategy|media buying|ad management|\/onsite|guaranteed/i

describe('service page copy', () => {
  it('has the four planned pages', () => {
    expect(allServices().map((p) => p.slug)).toEqual([
      'vsl-meta-ads-tampa',
      'podcast-studio-tampa',
      'youtube-studio-tampa',
      'course-webinar-tampa',
    ])
  })

  it.each(allServices())('$slug stays within what Voxa sells', (page) => {
    expect(JSON.stringify(page)).not.toMatch(banned)
  })

  it.each(allServices())('$slug answers first and is substantive', (page) => {
    expect(page.directAnswer.length).toBeGreaterThan(80)
    expect(page.sections.length).toBeGreaterThanOrEqual(3)
    expect(page.delivery.length).toBeGreaterThan(0)
  })
})
