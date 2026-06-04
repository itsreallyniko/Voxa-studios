'use client'

import { useEffect } from 'react'
import { useBooking } from '@/lib/booking-context'
import { StepRail } from '@/components/book/step-rail'
import { BookingSummaryPanel, BookingSummaryBar } from '@/components/book/booking-summary'
import { StepFrame } from '@/components/book/step-frame'
import { WizardNavButtons } from '@/components/book/wizard-nav-buttons'
import { CollectionStep } from '@/components/book/steps/collection-step'
import { SetStep } from '@/components/book/steps/set-step'
import { AddonsStep } from '@/components/book/steps/addons-step'
import { DetailsStep } from '@/components/book/steps/details-step'
import { LengthStep } from '@/components/book/steps/length-step'
import { ScheduleStep } from '@/components/book/steps/schedule-step'
import { CheckoutStep } from '@/components/book/steps/checkout-step'

function CurrentStep() {
  const { currentStep } = useBooking()
  return (
    <StepFrame stepKey={currentStep}>
      {currentStep === 'collection' && <CollectionStep />}
      {currentStep === 'set' && <SetStep />}
      {currentStep === 'addons' && <AddonsStep />}
      {currentStep === 'details' && <DetailsStep />}
      {currentStep === 'length' && <LengthStep />}
      {currentStep === 'schedule' && <ScheduleStep />}
      {currentStep === 'checkout' && <CheckoutStep />}
    </StepFrame>
  )
}

function KeyboardShortcuts({ active }: { active: boolean }) {
  const { next, back } = useBooking()
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        back()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, back, active])
  return null
}

/**
 * Wizard renders the full 7-step booking flow. The caller is responsible for
 * wrapping it in a <BookingProvider>.
 *
 * When `inline` is true, keyboard shortcuts and the mobile summary bar only
 * activate while the wizard is in the viewport, so they don't fight the rest
 * of the page.
 */
export function Wizard({
  inline = false,
  activeInViewport = true,
}: {
  inline?: boolean
  activeInViewport?: boolean
}) {
  return (
    <>
      <KeyboardShortcuts active={!inline || activeInViewport} />
      <div className={inline ? '' : 'pt-20'}>
        <StepRail />
        <div className="max-w-container-max mx-auto px-6 md:px-margin-edge pt-12 pb-32 lg:pb-12">
          <div className="flex gap-12">
            <main className="flex-1 min-w-0">
              <CurrentStep />
              <WizardNavButtons />
            </main>
            <BookingSummaryPanel />
          </div>
        </div>
        {(!inline || activeInViewport) && <BookingSummaryBar />}
      </div>
    </>
  )
}
