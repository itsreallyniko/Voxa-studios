'use client'

import { useState } from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { useBooking } from '@/lib/booking-context'

type Phase = 'idle' | 'authorizing' | 'booking' | 'paid' | 'error'

export function CheckoutForm({
  paymentIntentId,
  amountCents,
  onPaid,
  onSlotTaken,
}: {
  paymentIntentId: string
  amountCents: number
  onPaid: (info: { bookingUid: string; bookingId: number }) => void
  onSlotTaken: () => void
}) {
  const { booking } = useBooking()
  const stripe = useStripe()
  const elements = useElements()
  const [phase, setPhase] = useState<Phase>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const onPay = async () => {
    if (!stripe) return
    if (!elements) {
      setErrorMsg('Payment form not ready. Refresh and try again.')
      setPhase('error')
      return
    }
    setErrorMsg(null)
    setPhase('authorizing')
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })
    if (error || paymentIntent?.status !== 'requires_capture') {
      setErrorMsg(error?.message ?? 'Payment could not be authorized.')
      setPhase('error')
      return
    }

    setPhase('booking')
    try {
      const res = await fetch('/api/booking/confirm', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          setId: booking.setId,
          durationMinutes: booking.durationMinutes,
          addonIds: booking.addonIds,
          schedule: booking.schedule,
          contact: booking.contact,
          details: booking.details,
        }),
      })
      if (res.status === 409) {
        onSlotTaken()
        return
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `confirm ${res.status}`)
      }
      const body = (await res.json()) as { bookingUid: string; bookingId: number }
      setPhase('paid')
      onPaid({ bookingUid: body.bookingUid, bookingId: body.bookingId })
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Something went wrong booking your session. Your card was not charged.')
      setPhase('error')
    }
  }

  const label =
    phase === 'authorizing'
      ? 'Authorizing card…'
      : phase === 'booking'
      ? 'Confirming booking…'
      : phase === 'paid'
      ? 'Done'
      : `Pay $${(amountCents / 100).toLocaleString()}`

  return (
    <div className="flex flex-col gap-6">
      <PaymentElement />
      {errorMsg && <p className="text-metadata text-red-400">{errorMsg}</p>}
      <Button
        variant="gold"
        size="lg"
        onClick={onPay}
        disabled={!stripe || phase === 'authorizing' || phase === 'booking' || phase === 'paid'}
      >
        {label}
      </Button>
      <p className="text-metadata text-ivory/30 text-center">
        Secured by Stripe. Card not charged until your slot is confirmed.
      </p>
    </div>
  )
}
