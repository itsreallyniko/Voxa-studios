'use client'

import { useEffect, useRef, useState } from 'react'
import { BookingProvider, useBooking } from '@/lib/booking-context'
import { Wizard } from '@/components/book/wizard'
import { collections, type Collection } from '@/lib/content/collections'
import { Reveal } from '@/components/ui/reveal'

function shortLabel(setName: string, collectionName: string) {
  const collectionPrefix = collectionName.split(' ')[0] + ' '
  return setName.replace(collectionPrefix, '').replace(' Set', '')
}

function PreviewCard({
  c,
  onStart,
}: {
  c: Collection
  onStart: () => void
}) {
  const locked = !!c.comingSoon
  const [activeIdx, setActiveIdx] = useState(0)
  const setsCount = c.sets.length
  const previewSet = c.sets[activeIdx]
  const previewImg = locked ? c.heroImage : previewSet.heroImage

  const cycle = (dir: 1 | -1) => {
    setActiveIdx((i) => (i + dir + setsCount) % setsCount)
  }

  return (
    <div
      className={`group relative overflow-hidden bg-surface-container-low w-full ${
        locked ? 'cursor-not-allowed' : ''
      }`}
    >
      <div className="aspect-[16/10] overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={previewImg}
          alt={locked ? c.name : previewSet.name}
          className={`w-full h-full object-cover transition-[filter,transform] duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
            locked
              ? 'blur-md scale-110 grayscale opacity-50'
              : 'group-hover:scale-[1.04]'
          }`}
          src={previewImg}
        />
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-obsidian/30">
            <div className="liquid-glass border border-heritage-gold/40 px-6 py-3">
              <span className="text-label-caps text-heritage-gold tracking-[0.18em]">Coming Soon</span>
            </div>
          </div>
        )}
        {!locked && setsCount > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous set preview"
              onClick={() => cycle(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 liquid-glass border border-white/20 hover:border-heritage-gold/60 text-ivory w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next set preview"
              onClick={() => cycle(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 liquid-glass border border-white/20 hover:border-heritage-gold/60 text-ivory w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" aria-hidden="true">
              {c.sets.map((s, idx) => (
                <span
                  key={s.id}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx === activeIdx ? 'bg-heritage-gold' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className={`p-8 md:p-12 liquid-glass border-t-0 ${locked ? 'opacity-60' : ''}`}>
        <h3 className="text-headline-md text-white mb-2">{c.name}</h3>
        <span className="text-label-caps text-heritage-gold/80 mb-6 block">
          {c.sets.length} Studio Sets
        </span>
        <div className="flex flex-wrap gap-3 mb-10">
          {c.sets.map((s, idx) => {
            const active = !locked && idx === activeIdx
            return (
              <span
                key={s.id}
                className={`inline-flex px-4 py-1.5 rounded-full border text-metadata transition-colors ${
                  active
                    ? 'border-heritage-gold/70 bg-heritage-gold/10 text-heritage-gold'
                    : 'border-white/25 text-ivory/90'
                }`}
              >
                {shortLabel(s.name, c.name)}
              </span>
            )
          })}
        </div>
        <button
          type="button"
          disabled={locked}
          onClick={onStart}
          className={`w-full py-5 border text-label-caps text-center transition-[background-color,color,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            locked
              ? 'border-white/5 text-ivory/40 cursor-not-allowed'
              : 'border-heritage-gold/60 text-heritage-gold group-hover:bg-heritage-gold group-hover:text-obsidian group-hover:border-heritage-gold active:scale-[0.995]'
          }`}
        >
          {locked ? (
            'Coming Soon'
          ) : (
            <>
              <span className="md:hidden">
                Start Booking →
                <span className="block mt-1">Pick Your Set</span>
              </span>
              <span className="hidden md:inline">Start Booking → Pick Your Set</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function PreviewCards() {
  const { setBooking, goTo } = useBooking()

  const start = (id: 'executive' | 'horizon') => {
    setBooking((b) => ({ ...b, collectionId: id }))
    // Jump straight to "Set" — they've already chosen a collection.
    goTo('set')
  }

  return (
    <div className="max-w-container-max mx-auto px-6 md:px-margin-edge pb-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {collections.map((c, i) => (
          <Reveal key={c.id} delay={i * 80}>
            <PreviewCard c={c} onStart={() => !c.comingSoon && start(c.id)} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function SectionContent({ inView }: { inView: boolean }) {
  const { booking } = useBooking()
  // The cards are the entry point. Once a collection is chosen the section
  // morphs into the full wizard (step rail + summary panel + step content).
  if (!booking.collectionId) return <PreviewCards />
  return <Wizard inline activeInViewport={inView} />
}

export function BookSection() {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <BookingProvider>
      <section
        ref={ref}
        id="book"
        className="bg-obsidian scroll-mt-20 pt-section-gap"
      >
        <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
          <Reveal className="mb-16 max-w-3xl">
            <span className="text-label-caps text-heritage-gold mb-4 block">BOOK YOUR SESSION</span>
            <h2 className="text-headline-xl text-white">
              Choose the Environment <br />
              That Fits Your Brand
            </h2>
          </Reveal>
        </div>
        <SectionContent inView={inView} />
      </section>
    </BookingProvider>
  )
}
