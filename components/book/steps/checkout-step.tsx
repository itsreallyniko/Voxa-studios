'use client'

import { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useBooking } from '@/lib/booking-context'
import { findCollection, findSet } from '@/lib/content/collections'
import { CheckoutForm } from '@/components/book/checkout-form'
import { track } from '@/lib/meta-pixel'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ivory/60">{k}</dt>
      <dd className="text-ivory text-right">{v || '—'}</dd>
    </div>
  )
}

export function CheckoutStep() {
  const { booking, totals, goTo, wizardSessionId } = useBooking()
  const collection = findCollection(booking.collectionId)
  const set = findSet(booking.collectionId, booking.setId)

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [amountCents, setAmountCents] = useState<number | null>(null)
  const [bootError, setBootError] = useState<string | null>(null)
  const [paid, setPaid] = useState<{ bookingUid: string } | null>(null)
  const [slotTaken, setSlotTaken] = useState(false)

  useEffect(() => {
    if (!booking.setId) return
    setBootError(null)
    fetch('/api/stripe/intent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        setId: booking.setId,
        durationMinutes: booking.durationMinutes,
        addonIds: booking.addonIds,
        wizardSessionId,
        contact: booking.contact,
      }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<{ clientSecret: string; paymentIntentId: string; amountCents: number }>
      })
      .then((d) => {
        setClientSecret(d.clientSecret)
        setPaymentIntentId(d.paymentIntentId)
        setAmountCents(d.amountCents)
        track('InitiateCheckout', {
          value: d.amountCents / 100,
          currency: 'USD',
          content_ids: booking.setId ? [booking.setId] : undefined,
          content_name: set?.name,
        })
      })
      .catch(() => setBootError('Could not start payment. Refresh and try again.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.setId, booking.durationMinutes, booking.addonIds.join(',')])

  if (paid) {
    return (
      <div className="flex flex-col items-center text-center py-24">
        <span className="material-symbols-outlined text-heritage-gold text-6xl mb-8">check_circle</span>
        <span className="text-label-caps text-heritage-gold mb-4 block">SESSION CONFIRMED</span>
        <h2 className="text-headline-xl text-white mb-6">You&apos;re booked.</h2>
        <p className="text-body-lg text-ivory/60 max-w-xl">
          A confirmation has been sent to {booking.contact.email}. Our team will reach out 24 hours before your session.
        </p>
        <div className="mt-12 frosted-glass p-8 max-w-md w-full text-left">
          <p className="text-label-caps text-ivory/60 mb-2">YOUR SESSION</p>
          <p className="text-body-lg text-white">{set?.name}</p>
          <p className="text-body-md text-ivory/60 mt-1">
            {booking.schedule.date} · {booking.schedule.time}
          </p>
          <p className="text-headline-md text-heritage-gold mt-6 tabular-nums">${totals.total.toLocaleString()}</p>
          <p className="text-metadata text-ivory/30 mt-4">Booking #{paid.bookingUid}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 07 — CHECKOUT</span>
        <h2 className="text-headline-xl text-white">Confirm &amp; Pay</h2>
        <p className="text-body-lg text-ivory/60 mt-6">
          Review your session below, then complete payment to reserve your slot.
        </p>
      </header>

      {slotTaken && (
        <div className="mb-8 border border-red-500/40 bg-red-500/5 p-6">
          <p className="text-body-md text-red-300">That slot was just taken. Your card was not charged.</p>
          <button
            type="button"
            onClick={() => goTo('schedule')}
            className="mt-4 text-label-caps text-heritage-gold underline"
          >
            Pick another time →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="frosted-glass p-8">
          <span className="text-label-caps text-ivory/60 mb-6 block">CONFIRMATION</span>
          <dl className="flex flex-col gap-4 text-body-md">
            <Row k="Collection" v={collection?.name ?? ''} />
            <Row k="Set" v={set?.name ?? ''} />
            <Row k="Date" v={booking.schedule.date ?? ''} />
            <Row k="Time" v={booking.schedule.time ?? ''} />
            <Row
              k="Duration"
              v={`${Math.floor(booking.durationMinutes / 60)}h ${
                booking.durationMinutes % 60 ? `${booking.durationMinutes % 60}m` : ''
              }`.trim()}
            />
          </dl>
          <div className="h-px bg-slate-gray my-6" />
          <div className="flex justify-between items-baseline">
            <span className="text-label-caps text-white">TOTAL</span>
            <span className="text-headline-md text-white tabular-nums">${totals.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="frosted-glass p-8 flex flex-col">
          <span className="text-label-caps text-ivory/60 mb-6 block">PAYMENT</span>
          {bootError && <p className="text-metadata text-red-400">{bootError}</p>}
          {clientSecret && paymentIntentId && amountCents !== null && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#C9A96E',
                    colorBackground: '#0D0D0D',
                    colorText: '#F5F0E8',
                    colorTextSecondary: '#888888',
                    borderRadius: '6px',
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                  },
                },
              }}
            >
              <CheckoutForm
                paymentIntentId={paymentIntentId}
                amountCents={amountCents}
                onPaid={(info) => {
                  setPaid({ bookingUid: info.bookingUid })
                  track('Purchase', {
                    value: totals.total,
                    currency: 'USD',
                    content_ids: booking.setId ? [booking.setId] : undefined,
                    content_name: set?.name,
                    content_type: 'product',
                    num_items: 1,
                  })
                }}
                onSlotTaken={() => setSlotTaken(true)}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  )
}
