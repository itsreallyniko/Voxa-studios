'use client'

import { useState } from 'react'
import { useBooking } from '@/lib/booking-context'
import { findCollection, findSet } from '@/lib/content/collections'
import { Button } from '@/components/ui/button'

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ivory/60">{k}</dt>
      <dd className="text-ivory text-right">{v || '—'}</dd>
    </div>
  )
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-label-caps text-ivory/60">{label}</label>
      <input
        placeholder={placeholder}
        className="w-full bg-transparent border-0 border-b border-slate-gray text-ivory py-3 outline-none transition-colors focus:border-heritage-gold placeholder:text-ivory/30"
      />
    </div>
  )
}

export function CheckoutStep() {
  const { booking, totals } = useBooking()
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  const collection = findCollection(booking.collectionId)
  const set = findSet(booking.collectionId, booking.setId)

  const onPay = () => {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setPaid(true)
    }, 1100)
  }

  if (paid) {
    return (
      <div className="flex flex-col items-center text-center py-24">
        <span className="material-symbols-outlined text-heritage-gold text-6xl mb-8">check_circle</span>
        <span className="text-label-caps text-heritage-gold mb-4 block">SESSION CONFIRMED</span>
        <h2 className="text-headline-xl text-white mb-6">You&apos;re booked.</h2>
        <p className="text-body-lg text-ivory/60 max-w-xl">
          A confirmation has been sent to your email. Our team will reach out 24 hours before your session with arrival
          details and any preparation notes.
        </p>
        <div className="mt-12 frosted-glass p-8 max-w-md w-full text-left">
          <p className="text-label-caps text-ivory/60 mb-2">YOUR SESSION</p>
          <p className="text-body-lg text-white">{set?.name}</p>
          <p className="text-body-md text-ivory/60 mt-1">
            {booking.schedule.date} · {booking.schedule.time}
          </p>
          <p className="text-headline-md text-heritage-gold mt-6 tabular-nums">${totals.total.toLocaleString()}</p>
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
        <p className="text-metadata text-ivory/30 mt-2">
          [Placeholder checkout — Stripe Payment Element wires in here later]
        </p>
      </header>

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
          <div className="flex flex-col gap-6 flex-1">
            <Field label="CARD NUMBER" placeholder="4242 4242 4242 4242" />
            <div className="grid grid-cols-2 gap-6">
              <Field label="EXPIRY" placeholder="MM / YY" />
              <Field label="CVC" placeholder="123" />
            </div>
            <Field label="NAME ON CARD" placeholder="Jane Founder" />
          </div>
          <Button variant="gold" size="lg" className="mt-8 w-full" onClick={onPay} disabled={paying}>
            {paying ? 'Processing...' : `Pay $${totals.total.toLocaleString()}`}
          </Button>
          <p className="text-metadata text-ivory/30 mt-4 text-center">Secure payment · placeholder only</p>
        </div>
      </div>
    </div>
  )
}
