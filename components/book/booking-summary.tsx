'use client'

import { useState } from 'react'
import { useBooking } from '@/lib/booking-context'
import { findCollection, findSet } from '@/lib/content/collections'
import { addons } from '@/lib/content/addons'

function formatDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ivory/60">{label}</dt>
      <dd className="text-ivory text-right">{value}</dd>
    </div>
  )
}

function SummaryContent() {
  const { booking, totals } = useBooking()
  const collection = findCollection(booking.collectionId)
  const set = findSet(booking.collectionId, booking.setId)
  const selectedAddons = addons.filter((a) => booking.addonIds.includes(a.id))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-label-caps text-heritage-gold mb-3 block">YOUR SESSION</span>
        <h3 className="text-headline-md text-white tabular-nums">${totals.total.toLocaleString()}</h3>
        <p className="text-metadata text-ivory/40 mt-2">Tax calculated at checkout</p>
      </div>

      <div className="h-px bg-slate-gray" />

      <dl className="flex flex-col gap-4 text-body-md">
        <Line label="Collection" value={collection?.name ?? '—'} />
        <Line label="Set" value={set?.name ?? '—'} />
        <Line label="Length" value={formatDuration(booking.durationMinutes)} />
      </dl>

      {selectedAddons.length > 0 && (
        <>
          <div className="h-px bg-slate-gray" />
          <div>
            <span className="text-label-caps text-ivory/60 mb-4 block">ADD-ONS</span>
            <ul className="flex flex-col gap-3">
              {selectedAddons.map((a) => (
                <li key={a.id} className="flex justify-between text-body-md">
                  <span className="text-ivory/80">{a.name}</span>
                  <span className="text-ivory tabular-nums">+${a.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="h-px bg-slate-gray" />
      <dl className="flex flex-col gap-2 text-body-md">
        <Line label="Base (90 min)" value={`$${totals.base}`} />
        {totals.extraHours > 0 && (
          <Line label={`Extra time (${totals.extraHours}h)`} value={`+$${totals.extraTimePrice}`} />
        )}
        {totals.addonTotal > 0 && <Line label="Add-ons" value={`+$${totals.addonTotal}`} />}
      </dl>
      <div className="h-px bg-slate-gray" />
      <div className="flex justify-between items-baseline">
        <span className="text-label-caps text-white">TOTAL</span>
        <span className="text-headline-md text-white tabular-nums">${totals.total.toLocaleString()}</span>
      </div>
    </div>
  )
}

export function BookingSummaryPanel() {
  return (
    <aside className="hidden lg:block w-[360px] shrink-0 sticky top-44 self-start">
      <div className="liquid-glass p-8 rounded">
        <SummaryContent />
      </div>
    </aside>
  )
}

export function BookingSummaryBar() {
  const [open, setOpen] = useState(false)
  const { booking, totals } = useBooking()
  const selectedCount = booking.addonIds.length + (booking.setId ? 1 : 0) + (booking.collectionId ? 1 : 0)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-obsidian border-t border-slate-gray px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-baseline gap-3">
          <span className="text-headline-md text-white tabular-nums">${totals.total.toLocaleString()}</span>
          <span className="text-metadata text-ivory/40">{selectedCount} selected</span>
        </div>
        <span className="text-label-caps text-heritage-gold flex items-center gap-2">
          VIEW <span className="material-symbols-outlined text-base">expand_less</span>
        </span>
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md flex items-end"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full bg-obsidian border-t border-slate-gray p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-label-caps text-heritage-gold">YOUR SESSION</span>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <span className="material-symbols-outlined text-white">close</span>
              </button>
            </div>
            <SummaryContent />
          </div>
        </div>
      )}
    </>
  )
}
