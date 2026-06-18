import { describe, it, expect } from 'vitest'
import { initialBooking, isStepComplete, type Booking } from '@/lib/steps'

const base: Booking = {
  ...initialBooking,
  collectionId: 'executive',
  setId: 'executive-podcast',
  details: { ...initialBooking.details, recordingType: 'Podcast' },
}

describe('isStepComplete(details)', () => {
  it('is incomplete when name + email are missing', () => {
    expect(isStepComplete('details', base)).toBe(false)
  })

  it('is incomplete when email is invalid', () => {
    const b: Booking = { ...base, contact: { name: 'Jane', email: 'not-an-email' } }
    expect(isStepComplete('details', b)).toBe(false)
  })

  it('is complete when recordingType, name, and valid email are all present', () => {
    const b: Booking = { ...base, contact: { name: 'Jane', email: 'jane@example.com' } }
    expect(isStepComplete('details', b)).toBe(true)
  })
})

describe('initialBooking', () => {
  it('includes an empty contact field', () => {
    expect(initialBooking.contact).toEqual({ name: '', email: '' })
  })
})
