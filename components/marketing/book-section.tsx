'use client'

import { useEffect, useRef, useState } from 'react'
import { Wizard } from '@/components/book/wizard'

export function BookSection() {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      // Treat the section as "in view" once any part of it crosses the viewport
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id="book"
      className="bg-obsidian border-t border-slate-gray scroll-mt-20"
    >
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge pt-section-gap">
        <div className="max-w-3xl mb-8">
          <span className="text-label-caps text-heritage-gold mb-4 block">CONFIGURE YOUR SESSION</span>
          <h2 className="text-headline-xl text-white">Build the experience.</h2>
          <p className="text-body-lg text-ivory/60 mt-6">
            Walk through the showroom — pick an aesthetic, choose a set, add what you need, and lock in your slot.
          </p>
        </div>
      </div>
      <Wizard inline activeInViewport={inView} />
    </section>
  )
}
