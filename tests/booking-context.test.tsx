import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { BookingProvider, useBooking } from '@/lib/booking-context'

function wrapper({ children }: { children: React.ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>
}

describe('BookingProvider', () => {
  beforeEach(() => {
    sessionStorage.clear()
    window.location.hash = ''
  })

  it('starts on collection step with empty booking', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    expect(result.current.currentStep).toBe('collection')
    expect(result.current.booking.collectionId).toBe(null)
    expect(result.current.booking.durationMinutes).toBe(90)
  })

  it('updates booking via setBooking', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    act(() => {
      result.current.setBooking((b) => ({ ...b, collectionId: 'executive' }))
    })
    expect(result.current.booking.collectionId).toBe('executive')
  })

  it('goTo moves between steps', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    act(() => result.current.goTo('set'))
    expect(result.current.currentStep).toBe('set')
  })

  it('next advances if current step is complete', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    act(() => {
      result.current.setBooking((b) => ({ ...b, collectionId: 'executive' }))
    })
    act(() => result.current.next())
    expect(result.current.currentStep).toBe('set')
  })

  it('next is blocked if current step is incomplete', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    act(() => result.current.next())
    expect(result.current.currentStep).toBe('collection')
  })

  it('back moves to previous step', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    act(() => result.current.goTo('addons'))
    act(() => result.current.back())
    expect(result.current.currentStep).toBe('set')
  })

  it('persists booking to sessionStorage', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    act(() => {
      result.current.setBooking((b) => ({ ...b, collectionId: 'horizon' }))
    })
    const stored = JSON.parse(sessionStorage.getItem('voxa-booking') || '{}')
    expect(stored.booking.collectionId).toBe('horizon')
  })

  it('rehydrates booking from sessionStorage on mount', () => {
    sessionStorage.setItem(
      'voxa-booking',
      JSON.stringify({
        booking: {
          collectionId: 'executive',
          setId: 'executive-podcast',
          addonIds: [],
          details: { recordingType: '', guests: '', socials: '', notes: '' },
          durationMinutes: 90,
          schedule: { date: null, time: null },
        },
        currentStep: 'addons',
      })
    )
    const { result } = renderHook(() => useBooking(), { wrapper })
    expect(result.current.booking.collectionId).toBe('executive')
    expect(result.current.currentStep).toBe('addons')
  })
})
