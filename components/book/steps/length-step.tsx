'use client'

import { useState } from 'react'
import { useBooking } from '@/lib/booking-context'

const MIN_MINUTES = 90
const MAX_MINUTES = 300 // 5h
const STEP_MINUTES = 30
const STEP_PRICE = 50

function fmt(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export function LengthStep() {
  const { booking, setBooking, totals } = useBooking()
  const [bump, setBump] = useState<{ id: number; sign: '+' | '-' } | null>(null)

  const change = (delta: number) => {
    const next = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, booking.durationMinutes + delta))
    if (next === booking.durationMinutes) return
    setBooking((b) => ({ ...b, durationMinutes: next }))
    setBump({ id: Date.now(), sign: delta > 0 ? '+' : '-' })
    setTimeout(() => setBump(null), 700)
  }

  return (
    <div>
      <header className="mb-12 max-w-3xl mx-auto text-center">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 05 — SESSION LENGTH</span>
        <h2 className="text-headline-xl text-white">How long do you need?</h2>
        <p className="text-body-lg text-ivory/60 mt-6">Sessions start at 90 minutes. Add hours as needed.</p>
      </header>

      <div className="flex flex-col items-center gap-12 mt-16">
        <div className="text-center">
          <div className="text-[120px] md:text-[180px] leading-none text-white tabular-nums tracking-tighter">
            {fmt(booking.durationMinutes)}
          </div>
          <div className="text-label-caps text-ivory/40 mt-4">HOURS : MINUTES</div>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={() => change(-STEP_MINUTES)}
            disabled={booking.durationMinutes <= MIN_MINUTES}
            aria-label="Subtract 30 minutes"
            className="w-16 h-16 border border-slate-gray text-white hover:border-heritage-gold hover:text-heritage-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-3xl">remove</span>
          </button>

          <div className="relative">
            <div className="text-headline-md text-heritage-gold tabular-nums">${totals.total.toLocaleString()}</div>
            {bump && (
              <span
                key={bump.id}
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-label-caps text-heritage-gold animate-[bump_700ms_ease-out_forwards] whitespace-nowrap"
              >
                {bump.sign}${STEP_PRICE}
              </span>
            )}
            <style>{`@keyframes bump { from { transform: translate(-50%, 0); opacity: 1 } to { transform: translate(-50%, -24px); opacity: 0 } }`}</style>
          </div>

          <button
            onClick={() => change(STEP_MINUTES)}
            disabled={booking.durationMinutes >= MAX_MINUTES}
            aria-label="Add 30 minutes"
            className="w-16 h-16 border border-slate-gray text-white hover:border-heritage-gold hover:text-heritage-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>

        <p className="text-metadata text-ivory/40 max-w-md text-center">
          ${totals.base} for the first 90 minutes. ${STEP_PRICE} per additional 30 minutes. Maximum 5 hours.
        </p>
      </div>
    </div>
  )
}
