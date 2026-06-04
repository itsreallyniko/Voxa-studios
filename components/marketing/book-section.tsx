'use client'

import { useEffect, useRef, useState } from 'react'
import { BookingProvider, useBooking } from '@/lib/booking-context'
import { Wizard } from '@/components/book/wizard'
import { collections } from '@/lib/content/collections'
import { Tag } from '@/components/ui/tag'

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
        {collections.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => start(c.id)}
            className="group relative overflow-hidden bg-surface-container-low text-left transition-all"
          >
            <div className="aspect-[16/10] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={c.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                src={c.heroImage}
              />
            </div>
            <div className="p-12 liquid-glass border-t-0">
              <h3 className="text-headline-md text-white mb-6">{c.name}</h3>
              <div className="flex flex-wrap gap-3 mb-10">
                {c.sets.map((s) => (
                  <Tag key={s.id}>{shortLabel(s.name, c.name)}</Tag>
                ))}
              </div>
              <div className="w-full py-5 border border-white/10 text-label-caps text-white text-center group-hover:bg-white group-hover:text-obsidian transition-all">
                Explore Sets
              </div>
            </div>
          </button>
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
          <div className="mb-16 max-w-3xl">
            <span className="text-label-caps text-heritage-gold mb-4 block">COLLECTIONS</span>
            <h2 className="text-headline-xl text-white">
              Choose the Environment <br />
              That Fits Your Brand
            </h2>
          </div>
        </div>
        <SectionContent inView={inView} />
      </section>
    </BookingProvider>
  )
}
