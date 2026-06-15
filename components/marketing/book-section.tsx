'use client'

import { useEffect, useRef, useState } from 'react'
import { BookingProvider, useBooking } from '@/lib/booking-context'
import { Wizard } from '@/components/book/wizard'
import { collections } from '@/lib/content/collections'
import { Tag } from '@/components/ui/tag'
import { Reveal } from '@/components/ui/reveal'

function shortLabel(setName: string, collectionName: string) {
  const collectionPrefix = collectionName.split(' ')[0] + ' '
  return setName.replace(collectionPrefix, '').replace(' Set', '')
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
        {collections.map((c, i) => {
          const locked = c.comingSoon
          return (
            <Reveal key={c.id} delay={i * 80}>
              <button
                type="button"
                disabled={locked}
                aria-disabled={locked}
                onClick={() => !locked && start(c.id)}
                className={`group relative overflow-hidden bg-surface-container-low text-left w-full transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  locked ? 'cursor-not-allowed' : 'active:scale-[0.995]'
                }`}
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={c.name}
                    className={`w-full h-full object-cover transition-[filter,transform] duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                      locked
                        ? 'blur-md scale-110 grayscale opacity-50'
                        : 'grayscale group-hover:grayscale-0 group-hover:scale-[1.04]'
                    }`}
                    src={c.heroImage}
                  />
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-obsidian/30">
                      <div className="liquid-glass border border-heritage-gold/40 px-6 py-3">
                        <span className="text-label-caps text-heritage-gold tracking-[0.18em]">Coming Soon</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className={`p-8 md:p-12 liquid-glass border-t-0 ${locked ? 'opacity-60' : ''}`}>
                  <h3 className="text-headline-md text-white mb-6">{c.name}</h3>
                  <div className="flex flex-wrap gap-3 mb-10">
                    {c.sets.map((s) => (
                      <Tag key={s.id}>{shortLabel(s.name, c.name)}</Tag>
                    ))}
                  </div>
                  <div
                    className={`w-full py-5 border text-label-caps text-center transition-[background-color,color,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                      locked
                        ? 'border-white/5 text-ivory/40'
                        : 'border-white/10 text-white group-hover:bg-white group-hover:text-obsidian'
                    }`}
                  >
                    {locked ? 'Coming Soon' : 'Explore Sets'}
                  </div>
                </div>
              </button>
            </Reveal>
          )
        })}
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
            <span className="text-label-caps text-heritage-gold mb-4 block">COLLECTIONS</span>
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
