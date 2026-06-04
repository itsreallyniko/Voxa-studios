import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { BookingProvider, useBooking } from '@/lib/booking-context'

function wrapper({ children }: { children: React.ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>
}

describe('BookingProvider', () => {
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

  it('fresh provider always starts at collection step (no persistence)', () => {
    const { result, unmount } = renderHook(() => useBooking(), { wrapper })
    act(() => {
      result.current.setBooking((b) => ({ ...b, collectionId: 'horizon' }))
      result.current.goTo('addons')
    })
    expect(result.current.currentStep).toBe('addons')
    unmount()

    // Remount: state should be reset to defaults, like a page refresh.
    const { result: result2 } = renderHook(() => useBooking(), { wrapper })
    expect(result2.current.currentStep).toBe('collection')
    expect(result2.current.booking.collectionId).toBe(null)
  })
})
