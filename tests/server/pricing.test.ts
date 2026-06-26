import { describe, it, expect } from 'vitest'
import { recomputeTotalCents } from '@/lib/server/pricing'

describe('recomputeTotalCents', () => {
  it('returns 30000 (=$300) for 90 min, no add-ons', () => {
    expect(recomputeTotalCents({ durationMinutes: 90, addonIds: [] })).toBe(30000)
  })

  it('adds 10000 (=$100) per extra hour above 90 min', () => {
    expect(recomputeTotalCents({ durationMinutes: 150, addonIds: [] })).toBe(40000)
    expect(recomputeTotalCents({ durationMinutes: 330, addonIds: [] })).toBe(70000)
  })

  it('adds clip-repurposing when the chosen set is podcast', () => {
    expect(
      recomputeTotalCents({
        durationMinutes: 90,
        addonIds: ['clip-repurposing'],
        setId: 'executive-podcast',
      })
    ).toBe(30000 + 5000)
  })

  it('drops clip-repurposing when the chosen set is not podcast', () => {
    expect(
      recomputeTotalCents({
        durationMinutes: 90,
        addonIds: ['clip-repurposing'],
        setId: 'authority-desk',
      })
    ).toBe(30000)
  })

  it('ignores unknown add-on ids', () => {
    expect(
      recomputeTotalCents({
        durationMinutes: 90,
        addonIds: ['ghost-id'],
        setId: 'executive-podcast',
      })
    ).toBe(30000)
  })

  it('combines extra time + applicable add-ons', () => {
    expect(
      recomputeTotalCents({
        durationMinutes: 210,
        addonIds: ['clip-repurposing'],
        setId: 'executive-podcast',
      })
    ).toBe(30000 + 20000 + 5000)
  })
})
