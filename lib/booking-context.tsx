'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  Booking,
  initialBooking,
  isStepComplete,
  nextStep,
  prevStep,
  StepKey,
  firstIncompleteStep,
  STEPS,
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

const STORAGE_KEY = 'voxa-booking'

function isStepKey(s: string): s is StepKey {
  return STEPS.some((step) => step.key === s)
}

function hydrate(): { booking: Booking; currentStep: StepKey } {
  if (typeof window === 'undefined') {
    return { booking: initialBooking, currentStep: 'collection' }
  }
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      const booking: Booking = { ...initialBooking, ...parsed.booking }
      let currentStep: StepKey = isStepKey(parsed.currentStep) ? parsed.currentStep : 'collection'
      const ordered = STEPS.map((s) => s.key)
      const idx = ordered.indexOf(currentStep)
      for (let i = 0; i < idx; i++) {
        if (!isStepComplete(ordered[i], booking)) {
          currentStep = firstIncompleteStep(booking)
          break
        }
      }
      return { booking, currentStep }
    } catch {
      // fall through
    }
  }
  const hash = window.location.hash.replace('#', '')
  const currentStep: StepKey = isStepKey(hash) ? hash : 'collection'
  return { booking: initialBooking, currentStep }
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const initial = useMemo(hydrate, [])
  const [booking, setBookingState] = useState<Booking>(initial.booking)
  const [currentStep, setCurrentStep] = useState<StepKey>(initial.currentStep)

  useEffect(() => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ booking, currentStep }))
  }, [booking, currentStep])

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
