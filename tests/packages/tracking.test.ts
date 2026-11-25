import { describe, it, expect, beforeEach } from 'vitest'
import {
  trackPackageBuilderStart,
  trackPackageTourClick,
  trackPackageTourBooked,
  trackPackageContactSubmit,
  trackPackageCallBooked,
  trackPackageDeepRead,
} from '@/lib/tracking/packages'

type Entry = Record<string, unknown>

describe('package tracking', () => {
  beforeEach(() => {
    ;(window as unknown as { dataLayer: unknown[] }).dataLayer = []
  })

  function fireAll() {
    trackPackageBuilderStart('course')
    trackPackageTourClick('course', 3000)
    trackPackageTourBooked('course', 'uid-1')
    trackPackageContactSubmit('course', 3000)
    trackPackageCallBooked('course')
    trackPackageDeepRead('course')
    return (window as unknown as { dataLayer: Entry[] }).dataLayer
  }

  it('pushes the six events in order with page_type', () => {
    const dl = fireAll()
    expect(dl.map((e) => e.event)).toEqual([
      'package_builder_start',
      'package_tour_click',
      'package_tour_booked',
      'package_contact_submit',
      'package_call_booked',
      'package_deep_read',
    ])
    dl.forEach((e) => expect(e.page_type).toBe('course'))
  })

  it('never uses studio conversion event names', () => {
    const dl = fireAll()
    expect(dl.some((e) => e.event === 'generate_lead')).toBe(false)
    expect(dl.some((e) => e.event === 'tour_booked')).toBe(false)
  })
})
