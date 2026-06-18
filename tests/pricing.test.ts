import { describe, it, expect } from 'vitest'
import {
  getTotal,
  BASE_PRICE_USD,
  BASE_MINUTES,
  EXTRA_INCREMENT_MINUTES,
  EXTRA_INCREMENT_PRICE,
} from '@/lib/pricing'

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
    expect(r.extraIncrements).toBe(0)
    expect(r.extraTimePrice).toBe(0)
    expect(r.addonTotal).toBe(0)
    expect(r.total).toBe(300)
  })

  it('adds $50 per 30-min increment above 90 min', () => {
    const r = getTotal({ durationMinutes: 120, addonIds: [] }, addons)
    expect(r.extraIncrements).toBe(1)
    expect(r.extraTimePrice).toBe(50)
    expect(r.total).toBe(350)
  })

  it('handles multiple 30-min increments', () => {
    const r = getTotal({ durationMinutes: 210, addonIds: [] }, addons)
    expect(r.extraIncrements).toBe(4)
    expect(r.extraTimePrice).toBe(200)
    expect(r.total).toBe(500)
  })

  it('reaches $650 at the 5h cap', () => {
    const r = getTotal({ durationMinutes: 300, addonIds: [] }, addons)
    expect(r.extraIncrements).toBe(7)
    expect(r.extraTimePrice).toBe(350)
    expect(r.total).toBe(650)
  })

  it('adds add-on prices', () => {
    const r = getTotal({ durationMinutes: 90, addonIds: ['teleprompter', 'extra-camera'] }, addons)
    expect(r.addonTotal).toBe(400)
    expect(r.total).toBe(700)
  })

  it('combines extra time + add-ons', () => {
    const r = getTotal({ durationMinutes: 150, addonIds: ['producer'] }, addons)
    expect(r.extraIncrements).toBe(2)
    expect(r.extraTimePrice).toBe(100)
    expect(r.addonTotal).toBe(400)
    expect(r.total).toBe(800)
  })

  it('ignores unknown add-on ids', () => {
    const r = getTotal({ durationMinutes: 90, addonIds: ['fake-id'] }, addons)
    expect(r.addonTotal).toBe(0)
    expect(r.total).toBe(300)
  })

  it('treats durations below base as the base', () => {
    const r = getTotal({ durationMinutes: 30, addonIds: [] }, addons)
    expect(r.extraIncrements).toBe(0)
    expect(r.total).toBe(300)
  })

  it('exposes constants', () => {
    expect(BASE_PRICE_USD).toBe(300)
    expect(BASE_MINUTES).toBe(90)
    expect(EXTRA_INCREMENT_MINUTES).toBe(30)
    expect(EXTRA_INCREMENT_PRICE).toBe(50)
  })
})
