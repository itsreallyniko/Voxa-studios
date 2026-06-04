'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  Booking,
  initialBooking,
  isStepComplete,
  nextStep,
  prevStep,
  StepKey,
} from './steps'
import { addons } from './content/addons'
import { getTotal, PricingResult } from './pricing'

type Ctx = {
  booking: Booking
  setBooking: (updater: (b: Booking) => Booking) => void
  currentStep: StepKey
  goTo: (s: StepKey) => void
  next: () => void
  back: () => void
  totals: PricingResult
  isComplete: (s: StepKey) => boolean
}

const BookingContext = createContext<Ctx | null>(null)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBookingState] = useState<Booking>(initialBooking)
  const [currentStep, setCurrentStep] = useState<StepKey>('collection')

  const setBooking = useCallback((updater: (b: Booking) => Booking) => {
    setBookingState((prev) => updater(prev))
  }, [])

  const goTo = useCallback((s: StepKey) => setCurrentStep(s), [])

  const next = useCallback(() => {
    setCurrentStep((cur) => {
      if (!isStepComplete(cur, booking)) return cur
      return nextStep(cur) ?? cur
    })
  }, [booking])

  const back = useCallback(() => {
    setCurrentStep((cur) => prevStep(cur) ?? cur)
  }, [])

  const totals = useMemo(
    () => getTotal({ durationMinutes: booking.durationMinutes, addonIds: booking.addonIds }, addons),
    [booking.durationMinutes, booking.addonIds]
  )

  const isComplete = useCallback((s: StepKey) => isStepComplete(s, booking), [booking])

  return (
    <BookingContext.Provider value={{ booking, setBooking, currentStep, goTo, next, back, totals, isComplete }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider')
  return ctx
}
