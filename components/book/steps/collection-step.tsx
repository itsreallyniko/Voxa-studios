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
      {/* h2 is sr-only so step transitions still announce a heading for screen
          readers, while visually the surrounding section header already
          frames this step. */}
      <h2 className="sr-only">Choose the aesthetic</h2>
      <p className="text-body-lg text-ivory/60 max-w-3xl mb-12">
        Collections represent overall visual styles. Pick the one that matches your brand — every set inside it shares
        the same atmosphere.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {collections.map((c) => {
          const isSelected = booking.collectionId === c.id
          const locked = c.comingSoon
          return (
            <button
              key={c.id}
              type="button"
              disabled={locked}
              aria-disabled={locked}
              onClick={() => !locked && choose(c.id)}
              className={`group relative overflow-hidden bg-surface-container-low text-left transition-all border ${
                locked
                  ? 'border-white/5 cursor-not-allowed'
                  : isSelected
                    ? 'border-heritage-gold'
                    : 'border-transparent hover:border-white/20'
              }`}
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={c.name}
                  src={c.heroImage}
                  className={`w-full h-full object-cover transition-all duration-1000 ${
                    locked
                      ? 'blur-md scale-110 grayscale opacity-50'
                      : isSelected
                        ? 'scale-105'
                        : 'group-hover:scale-105'
                  }`}
                />
                {locked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-obsidian/30">
                    <div className="liquid-glass border border-heritage-gold/40 px-6 py-3">
                      <span className="text-label-caps text-heritage-gold tracking-[0.18em]">Coming Soon</span>
                    </div>
                  </div>
                )}
              </div>
              <div className={`p-8 lg:p-12 liquid-glass border-t-0 ${locked ? 'opacity-60' : ''}`}>
                <h3 className="text-headline-md text-white mb-4">{c.name}</h3>
                <p className="text-body-md text-ivory/60 mb-8">
                  {locked ? 'A new aesthetic is coming. Check back soon.' : c.tagline}
                </p>
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
