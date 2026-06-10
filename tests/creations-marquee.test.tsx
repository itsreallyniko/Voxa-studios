import { describe, it, expect } from 'vitest'
import { creations } from '@/components/marketing/creations-data'

describe('creations data', () => {
  it('contains six entries', () => {
    expect(creations).toHaveLength(6)
  })

  it('every entry has src under /creations/, alt, aspect, set, byline', () => {
    for (const c of creations) {
      expect(c.src).toMatch(/^\/creations\/.+\.jpg$/)
      expect(c.alt.length).toBeGreaterThan(0)
      expect(['16:9', '9:16']).toContain(c.aspect)
      expect(c.set.length).toBeGreaterThan(0)
      expect(c.byline.length).toBeGreaterThan(0)
    }
  })

  it('exposes the one 9:16 portrait (julietteastor)', () => {
    const portraits = creations.filter((c) => c.aspect === '9:16')
    expect(portraits).toHaveLength(1)
    expect(portraits[0].src).toContain('julietteastor')
  })

  it('groups three creators under EXECUTIVE CREATOR SET', () => {
    const creators = creations.filter((c) => c.set === 'EXECUTIVE CREATOR SET')
    expect(creators).toHaveLength(3)
  })
})
