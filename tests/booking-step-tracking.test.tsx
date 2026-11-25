import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { BookingProvider, useBooking } from '@/lib/booking-context'
import { useStepTracking } from '@/components/book/wizard'

function wrapper({ children }: { children: React.ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>
}

function stepEvents() {
  return (window.dataLayer ?? []).filter((e) => e.event === 'booking_step')
}

describe('booking step tracking', () => {
  beforeEach(() => {
    window.dataLayer = []
  })

  it('pushes one booking_step event per step view', () => {
    const { result, rerender } = renderHook(
      () => {
        useStepTracking()
        return useBooking()
      },
      { wrapper }
    )
    expect(stepEvents()).toEqual([
      { event: 'booking_step', step_name: 'collection', step_number: 1, step_count: 7 },
    ])

    rerender()
    expect(stepEvents()).toHaveLength(1)

    act(() => result.current.goTo('length'))
    expect(stepEvents()).toHaveLength(2)
    expect(stepEvents()[1]).toMatchObject({ step_name: 'length', step_number: 4 })
  })
})
