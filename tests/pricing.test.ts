import { describe, it, expect } from 'vitest'
import { getTotal, BASE_PRICE_USD, BASE_MINUTES, EXTRA_HOUR_PRICE } from '@/lib/pricing'

const addons = [
  { id: 'teleprompter', name: 'Teleprompter', description: '', price: 150, image: '' },
  { id: 'clip-repurposing', name: 'Clip Repurposing', description: '', price: 500, image: '' },
  { id: 'extra-camera', name: 'Additional Camera Angle', description: '', price: 250, image: '' },
  { id: 'producer', name: 'Producer Assistance', description: '', price: 400, image: '' },
]

describe('getTotal', () => {
  it('returns $300 base for 90 minutes with no add-ons', () => {
    const r = getTotal({ durationMinutes: 90, addonIds: [] }, addons)
    expect(r.base).toBe(300)
    expect(r.extraHours).toBe(0)
    expect(r.extraTimePrice).toBe(0)
    expect(r.addonTotal).toBe(0)
    expect(r.total).toBe(300)
  })

  it('adds $100 per extra hour above 90 min', () => {
    const r = getTotal({ durationMinutes: 150, addonIds: [] }, addons)
    expect(r.extraHours).toBe(1)
    expect(r.extraTimePrice).toBe(100)
    expect(r.total).toBe(400)
  })

  it('handles multiple extra hours', () => {
    const r = getTotal({ durationMinutes: 330, addonIds: [] }, addons)
    expect(r.extraHours).toBe(4)
    expect(r.extraTimePrice).toBe(400)
    expect(r.total).toBe(700)
  })

  it('adds add-on prices', () => {
    const r = getTotal({ durationMinutes: 90, addonIds: ['teleprompter', 'extra-camera'] }, addons)
    expect(r.addonTotal).toBe(400)
    expect(r.total).toBe(700)
  })

  it('combines extra time + add-ons', () => {
    const r = getTotal({ durationMinutes: 210, addonIds: ['producer'] }, addons)
    expect(r.extraHours).toBe(2)
    expect(r.extraTimePrice).toBe(200)
    expect(r.addonTotal).toBe(400)
    expect(r.total).toBe(900)
  })

  it('ignores unknown add-on ids', () => {
    const r = getTotal({ durationMinutes: 90, addonIds: ['fake-id'] }, addons)
    expect(r.addonTotal).toBe(0)
    expect(r.total).toBe(300)
  })

  it('treats durations below base as the base', () => {
    const r = getTotal({ durationMinutes: 30, addonIds: [] }, addons)
    expect(r.extraHours).toBe(0)
    expect(r.total).toBe(300)
  })

  it('exposes constants', () => {
    expect(BASE_PRICE_USD).toBe(300)
    expect(BASE_MINUTES).toBe(90)
    expect(EXTRA_HOUR_PRICE).toBe(100)
  })
})
