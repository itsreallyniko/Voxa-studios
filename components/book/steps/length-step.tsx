'use client'

import { useState } from 'react'
import { useBooking } from '@/lib/booking-context'
import { EXTRA_INCREMENT_MINUTES, EXTRA_INCREMENT_PRICE } from '@/lib/pricing'

const DURATIONS = [90, 120, 150, 180, 240, 300] as const

function fmt(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function priceDelta(fromMin: number, toMin: number): number {
  const steps = Math.abs(toMin - fromMin) / EXTRA_INCREMENT_MINUTES
  return steps * EXTRA_INCREMENT_PRICE
}

export function LengthStep() {
  const { booking, setBooking, totals } = useBooking()
  const [bump, setBump] = useState<{ id: number; sign: '+' | '-'; amount: number } | null>(null)

  const idx = Math.max(0, DURATIONS.findIndex((d) => d === booking.durationMinutes))
  const current = DURATIONS[idx] ?? DURATIONS[0]
  const atMin = idx <= 0
  const atMax = idx >= DURATIONS.length - 1

  const step = (dir: -1 | 1) => {
    const nextIdx = idx + dir
    if (nextIdx < 0 || nextIdx >= DURATIONS.length) return
    const next = DURATIONS[nextIdx]
    const amount = priceDelta(current, next)
    setBooking((b) => ({ ...b, durationMinutes: next }))
    setBump({ id: Date.now(), sign: dir > 0 ? '+' : '-', amount })
    setTimeout(() => setBump(null), 700)
  }

  return (
    <div>
      <header className="mb-12 max-w-3xl mx-auto text-center">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 05 — SESSION LENGTH</span>
        <h2 className="text-headline-xl text-white">How long do you need?</h2>
        <p className="text-body-lg text-ivory/60 mt-6">Sessions start at 90 minutes. Add time as needed.</p>
      </header>

      <div className="flex flex-col items-center gap-12 mt-16">
        <div className="text-center">
          <div className="text-[120px] md:text-[180px] leading-none text-white tabular-nums tracking-tighter">
            {fmt(current)}
          </div>
          <div className="text-label-caps text-ivory/40 mt-4">HOURS : MINUTES</div>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={() => step(-1)}
            disabled={atMin}
            aria-label="Decrease session length"
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
                {bump.sign}${bump.amount}
              </span>
            )}
            <style>{`@keyframes bump { from { transform: translate(-50%, 0); opacity: 1 } to { transform: translate(-50%, -24px); opacity: 0 } }`}</style>
          </div>

          <button
            onClick={() => step(1)}
            disabled={atMax}
            aria-label="Increase session length"
            className="w-16 h-16 border border-slate-gray text-white hover:border-heritage-gold hover:text-heritage-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>

        <p className="text-metadata text-ivory/40 max-w-md text-center">
          ${totals.base} for the first 90 minutes. ${EXTRA_INCREMENT_PRICE} per additional 30 minutes. Maximum 5 hours.
        </p>
      </div>
    </div>
  )
}
