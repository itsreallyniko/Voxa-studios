'use client'

import { useBooking } from '@/lib/booking-context'
import { addons } from '@/lib/content/addons'
import { CheckboxToggle } from '@/components/ui/checkbox-toggle'

export function AddonsStep() {
  const { booking, setBooking } = useBooking()
  const toggle = (id: string) => {
    setBooking((b) => ({
      ...b,
      addonIds: b.addonIds.includes(id) ? b.addonIds.filter((x) => x !== id) : [...b.addonIds, id],
    }))
  }

  return (
    <div>
      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 03 — ADD-ONS</span>
        <h2 className="text-headline-xl text-white">Augment Your Session</h2>
        <p className="text-body-lg text-ivory/60 mt-6">
          Optional upgrades. Pick any combination — selections update your total instantly.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addons.map((a) => {
          const checked = booking.addonIds.includes(a.id)
          return (
            <CheckboxToggle
              key={a.id}
              checked={checked}
              onChange={() => toggle(a.id)}
              ariaLabel={`Toggle ${a.name}`}
            >
              <div className="bg-surface-container-low">
                <div className="aspect-[16/9] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={a.name} src={a.image} className="w-full h-full object-cover grayscale" />
                  <div className="absolute inset-0 bg-obsidian/40" />
                  <div className="absolute top-4 right-4">
                    {checked ? (
                      <span className="text-label-caps text-heritage-gold bg-obsidian/80 px-3 py-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">check</span>
                        ADDED
                      </span>
                    ) : (
                      <span className="text-label-caps text-white bg-obsidian/80 px-3 py-1">+${a.price}</span>
                    )}
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-baseline justify-between mb-3 gap-4">
                    <h3 className="text-headline-md text-white">{a.name}</h3>
                    <span className="text-body-lg text-ivory tabular-nums whitespace-nowrap">${a.price}</span>
                  </div>
                  <p className="text-body-md text-ivory/60">{a.description}</p>
                </div>
              </div>
            </CheckboxToggle>
          )
        })}
      </div>
    </div>
  )
}
