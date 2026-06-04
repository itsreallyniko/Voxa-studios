'use client'

import { Button } from '@/components/ui/button'
import { useBooking } from '@/lib/booking-context'
import { STEPS } from '@/lib/steps'

const HINTS: Record<string, string> = {
  collection: 'Select a collection to continue',
  set: 'Select a set to continue',
  details: "Tell us what you're recording",
  schedule: 'Pick a date and time to continue',
  checkout: 'Complete payment to confirm',
}

export function WizardNavButtons() {
  const { currentStep, next, back, isComplete } = useBooking()
  const idx = STEPS.findIndex((s) => s.key === currentStep)
  const isFirst = idx === 0
  const isLast = idx === STEPS.length - 1
  const canNext = isComplete(currentStep)

  if (isLast) return null

  return (
    <div className="mt-16 flex flex-col sm:flex-row gap-4 sm:justify-end items-stretch sm:items-center">
      {!canNext && <span className="text-metadata text-ivory/40 sm:mr-4">{HINTS[currentStep] ?? ''}</span>}
      {!isFirst && (
        <Button variant="secondary" size="md" onClick={back}>
          Back
        </Button>
      )}
      <Button variant="gold" size="md" onClick={next} disabled={!canNext}>
        Continue
      </Button>
    </div>
  )
}
