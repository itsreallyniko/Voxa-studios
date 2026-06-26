import { describe, it, expect } from 'vitest'
import {
  addonsRelevantFor,
  applicableSteps,
  initialBooking,
  isStepComplete,
  STEPS,
  type Booking,
} from '@/lib/steps'

const base: Booking = {
  ...initialBooking,
  collectionId: 'executive',
  setId: 'executive-podcast',
  details: { ...initialBooking.details, recordingType: 'Podcast' },
}

describe('isStepComplete(details)', () => {
  it('is incomplete when name + email + phone are missing', () => {
    expect(isStepComplete('details', base)).toBe(false)
  })

  it('is incomplete when email is invalid', () => {
    const b: Booking = {
      ...base,
      contact: { name: 'Jane', email: 'not-an-email', phone: '+15555555555' },
    }
    expect(isStepComplete('details', b)).toBe(false)
  })

  it('is incomplete when phone is missing', () => {
    const b: Booking = {
      ...base,
      contact: { name: 'Jane', email: 'jane@example.com', phone: '' },
    }
    expect(isStepComplete('details', b)).toBe(false)
  })

  it('is incomplete when phone is too short', () => {
    const b: Booking = {
      ...base,
      contact: { name: 'Jane', email: 'jane@example.com', phone: '12345' },
    }
    expect(isStepComplete('details', b)).toBe(false)
  })

  it('is complete when recordingType, name, valid email, and phone are all present', () => {
    const b: Booking = {
      ...base,
      contact: { name: 'Jane', email: 'jane@example.com', phone: '+15555555555' },
    }
    expect(isStepComplete('details', b)).toBe(true)
  })
})

describe('initialBooking', () => {
  it('includes an empty contact field', () => {
    expect(initialBooking.contact).toEqual({ name: '', email: '', phone: '' })
  })
})

describe('addonsRelevantFor / applicableSteps', () => {
  it('shows add-ons step before a set is chosen', () => {
    expect(addonsRelevantFor(null)).toBe(true)
    expect(applicableSteps(null)).toEqual(STEPS)
  })

  it('shows add-ons step for podcast sets', () => {
    expect(addonsRelevantFor('executive-podcast')).toBe(true)
    expect(addonsRelevantFor('horizon-podcast')).toBe(true)
    expect(applicableSteps('executive-podcast').map((s) => s.key)).toContain('addons')
  })

  it('hides add-ons step for non-podcast sets', () => {
    expect(addonsRelevantFor('authority-desk')).toBe(false)
    expect(addonsRelevantFor('authority-creator')).toBe(false)
    expect(applicableSteps('authority-desk').map((s) => s.key)).not.toContain('addons')
  })
})
