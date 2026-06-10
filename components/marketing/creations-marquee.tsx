'use client'

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

export function CreationsMarquee() {
  return (
    <section className="py-section-gap bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal className="text-center mb-24">
          <span className="text-label-caps text-heritage-gold mb-4 block">TRUSTED BY LEADERS</span>
          <h2 className="text-headline-xl text-white">See What Gets Created Here</h2>
        </Reveal>
      </div>
      <div className="creations-mask relative overflow-hidden">
        <div className="creations-track flex gap-6 w-max animate-drift">
          <Track half="primary" />
          <Track half="clone" />
        </div>
      </div>
    </section>
  )
}
