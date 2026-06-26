'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Reveal } from '@/components/ui/reveal'
import { creations, type Creation } from './creations-data'

function CreationCard({ c, priority }: { c: Creation; priority?: boolean }) {
  const isPortrait = c.aspect === '9:16'
  return (
    <figure className="creations-card relative inline-flex flex-col shrink-0 rounded-2xl bg-surface-container-low border border-white/5 p-3 transition-[opacity,transform] duration-500 ease-out will-change-transform">
      <div className="relative overflow-hidden rounded-xl bg-black">
        <Image
          src={c.src}
          alt={c.alt}
          width={isPortrait ? 1080 : 1920}
          height={isPortrait ? 1920 : 1080}
          priority={priority}
          quality={90}
          sizes={isPortrait ? '220px' : '(max-width: 768px) 500px, 700px'}
          className="block h-[280px] md:h-[360px] w-auto object-cover"
        />
      </div>
      <figcaption className="border-t border-white/5 mt-3 pt-3 px-1 pb-1">
        <div className="text-heritage-gold text-[10px] tracking-[0.4em] uppercase">
          {c.set}
        </div>
        <div className="text-white/60 text-sm mt-1 lowercase">
          {c.byline}
        </div>
      </figcaption>
    </figure>
  )
}

function Track({ half }: { half: 'primary' | 'clone' }) {
  return (
    <div
      data-marquee-half={half}
      aria-hidden={half === 'clone' ? true : undefined}
      className="flex gap-6 shrink-0"
    >
      {creations.map((c, i) => (
        <CreationCard
          key={`${half}-${c.src}`}
          c={c}
          priority={half === 'primary' && i < 2}
        />
      ))}
    </div>
  )
}

function MobileCreationCard({ c, active }: { c: Creation; active: boolean }) {
  return (
    <figure
      className={`relative shrink-0 w-[72vw] snap-center transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        active ? 'opacity-100' : 'opacity-40'
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-black border border-white/5 aspect-[4/5]">
        <Image
          src={c.src}
          alt={c.alt}
          fill
          sizes="72vw"
          quality={90}
          className="object-cover"
        />
      </div>
      <figcaption className="border-t border-white/5 mt-3 pt-3 px-1">
        <div className="text-heritage-gold text-[10px] tracking-[0.4em] uppercase">
          {c.set}
        </div>
        <div className="text-white/70 text-sm mt-1 lowercase">{c.byline}</div>
      </figcaption>
    </figure>
  )
}

function MobileSnapCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let raf: number | null = null
    const onScroll = () => {
      if (raf !== null) return
      raf = requestAnimationFrame(() => {
        raf = null
        const center = el.scrollLeft + el.clientWidth / 2
        const children = Array.from(el.children) as HTMLElement[]
        let best = 0
        let bestDist = Infinity
        children.forEach((child, i) => {
          const childCenter = child.offsetLeft + child.offsetWidth / 2
          const dist = Math.abs(childCenter - center)
          if (dist < bestDist) {
            bestDist = dist
            best = i
          }
        })
        setActiveIdx(best)
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  const goTo = (idx: number) => {
    const el = scrollRef.current
    if (!el) return
    const child = el.children[idx] as HTMLElement | undefined
    if (!child) return
    const target = child.offsetLeft + child.offsetWidth / 2 - el.clientWidth / 2
    el.scrollTo({ left: target, behavior: 'smooth' })
  }

  return (
    <div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-[14vw] no-scrollbar"
      >
        {creations.map((c, i) => (
          <MobileCreationCard key={c.src} c={c} active={i === activeIdx} />
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Creator previews">
        {creations.map((c, i) => (
          <button
            key={c.src}
            type="button"
            role="tab"
            aria-selected={i === activeIdx}
            aria-label={`Show creator ${i + 1} of ${creations.length}`}
            onClick={() => goTo(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              i === activeIdx ? 'bg-heritage-gold' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export function CreationsMarquee() {
  return (
    <section className="py-section-gap bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal className="text-center mb-24">
          <span className="text-label-caps text-heritage-gold mb-4 block">TRUSTED BY LEADERS</span>
          <h2 className="text-headline-xl text-white">See What Gets Created Here</h2>
        </Reveal>
      </div>

      {/* Mobile: snap carousel with peek + dots */}
      <div className="md:hidden">
        <MobileSnapCarousel />
      </div>

      {/* Desktop: continuous marquee */}
      <div className="hidden md:block creations-mask relative overflow-hidden">
        <div className="creations-track flex gap-6 w-max animate-drift">
          <Track half="primary" />
          <Track half="clone" />
        </div>
      </div>
    </section>
  )
}
