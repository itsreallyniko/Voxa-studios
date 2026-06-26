'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  addonsRelevantFor,
  Booking,
  initialBooking,
  isStepComplete,
  nextStep,
  prevStep,
  StepKey,
} from './steps'
import { addonsForSet } from './content/addons'
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
  wizardSessionId: string
}

const BookingContext = createContext<Ctx | null>(null)

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBookingState] = useState<Booking>(initialBooking)
  const [currentStep, setCurrentStep] = useState<StepKey>('collection')
  const wizardSessionId = useMemo(() => makeId(), [])

  const setBooking = useCallback((updater: (b: Booking) => Booking) => {
    setBookingState((prev) => updater(prev))
  }, [])

  const goTo = useCallback((s: StepKey) => setCurrentStep(s), [])

  const next = useCallback(() => {
    setCurrentStep((cur) => {
      if (!isStepComplete(cur, booking)) return cur
      let n = nextStep(cur)
      if (n === 'addons' && !addonsRelevantFor(booking.setId)) {
        n = nextStep('addons')
      }
      return n ?? cur
    })
  }, [booking])

  const back = useCallback(() => {
    setCurrentStep((cur) => {
      let p = prevStep(cur)
      if (p === 'addons' && !addonsRelevantFor(booking.setId)) {
        p = prevStep('addons')
      }
      return p ?? cur
    })
  }, [booking.setId])

  // Prune any addon selections that don't apply to the currently-chosen set.
  useEffect(() => {
    const allowed = new Set(addonsForSet(booking.setId).map((a) => a.id))
    if (booking.addonIds.some((id) => !allowed.has(id))) {
      setBookingState((prev) => ({
        ...prev,
        addonIds: prev.addonIds.filter((id) => allowed.has(id)),
      }))
    }
  }, [booking.setId, booking.addonIds])

  const totals = useMemo(
    () =>
      getTotal(
        { durationMinutes: booking.durationMinutes, addonIds: booking.addonIds },
        addonsForSet(booking.setId)
      ),
    [booking.durationMinutes, booking.addonIds, booking.setId]
  )

  const isComplete = useCallback((s: StepKey) => isStepComplete(s, booking), [booking])

  return (
    <BookingContext.Provider
      value={{ booking, setBooking, currentStep, goTo, next, back, totals, isComplete, wizardSessionId }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider')
  return ctx
}
