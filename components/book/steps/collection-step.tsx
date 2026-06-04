'use client'

import { useBooking } from '@/lib/booking-context'
import { collections } from '@/lib/content/collections'

export function CollectionStep() {
  const { booking, setBooking, goTo } = useBooking()

  const choose = (id: 'executive' | 'horizon') => {
    setBooking((b) => ({
      ...b,
      collectionId: id,
      setId: b.collectionId === id ? b.setId : null,
    }))
    setTimeout(() => goTo('set'), 220)
  }

  return (
    <div>
      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 01 — COLLECTION</span>
        <h2 className="text-headline-xl text-white">Choose the Aesthetic</h2>
        <p className="text-body-lg text-ivory/60 mt-6">
          Collections represent overall visual styles. Pick the one that matches your brand — every set inside it shares
          the same atmosphere.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {collections.map((c) => {
          const isSelected = booking.collectionId === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => choose(c.id)}
              className={`group relative overflow-hidden bg-surface-container-low text-left transition-all border ${
                isSelected ? 'border-heritage-gold' : 'border-transparent hover:border-white/20'
              }`}
            >
              <div className="aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={c.name}
                  src={c.heroImage}
                  className={`w-full h-full object-cover transition-all duration-1000 ${
                    isSelected ? 'grayscale-0 scale-105' : 'grayscale group-hover:grayscale-0 group-hover:scale-105'
                  }`}
                />
              </div>
              <div className="p-8 lg:p-12 liquid-glass border-t-0">
                <h3 className="text-headline-md text-white mb-4">{c.name}</h3>
                <p className="text-body-md text-ivory/60 mb-8">{c.tagline}</p>
                <span className="text-label-caps text-ivory/40 mb-3 block">DESIGNED FOR</span>
                <p className="text-body-md text-ivory/70">{c.audience.join(' · ')}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
