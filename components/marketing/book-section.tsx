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
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id="book"
      className="bg-obsidian scroll-mt-20 py-section-gap"
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
      <Wizard inline activeInViewport={inView} />
    </section>
  )
}
