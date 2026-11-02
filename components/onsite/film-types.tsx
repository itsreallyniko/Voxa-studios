'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { FilmType } from '@/lib/content/onsite/film-types'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { OnsiteSection } from './onsite-section'

function FilmFrame({ film, className = '' }: { film: FilmType; className?: string }) {
  if (film.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={film.image}
        alt={film.imageAlt}
        className={`h-full w-full object-cover ${className}`}
        style={film.imageFocus ? { objectPosition: film.imageFocus } : undefined}
        loading="lazy"
      />
    )
  }
  return (
    <div
      className={`h-full w-full flex items-center justify-center bg-[radial-gradient(ellipse_80%_80%_at_50%_30%,_rgba(201,169,110,0.14)_0%,_rgba(13,13,13,0)_70%)] ${className}`}
    >
      <span className="text-label-caps text-ivory/40">PLACEHOLDER — FRAME COMING</span>
    </div>
  )
}

export function FilmTypes({
  eyebrow,
  heading,
  body,
  items,
  cta,
  href,
  unsure,
  formAnchor = '#quote',
}: {
  eyebrow: string
  heading: string
  body: string
  items: FilmType[]
  cta: string
  href: string
  unsure: string
  formAnchor?: string
}) {
  const [active, setActive] = useState(0)

  return (
    <OnsiteSection id="films" eyebrow={eyebrow} heading={heading} body={body} tone="surface">
      {/* Pick a film type and its frame fills the stage. Phones stack the stage above the list. */}
      <Reveal className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-stretch">
        <div className="md:col-span-7 md:order-2 flex flex-col">
          <div className="relative aspect-video md:aspect-auto md:flex-1 md:min-h-[380px] lg:min-h-[520px] bg-black overflow-hidden border border-white/10">
            {items.map((film, i) => (
              <div
                key={film.title}
                aria-hidden={active !== i}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  active === i ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <FilmFrame film={film} />
                <div className="hidden md:block absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent p-6 lg:p-8 pt-20">
                  <p className="text-sm lg:text-base text-ivory/90 leading-relaxed max-w-md">
                    {film.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Reserves room for the longest description so the list doesn't jump on tap. */}
          <p className="md:hidden mt-4 min-h-[4.5rem] text-sm text-ivory/70 leading-relaxed">
            {items[active].body}
          </p>
          <p className="md:hidden mt-2 text-xs text-heritage-gold/80">
            Tap a category below to see an example.
          </p>
        </div>

        <ul className="md:col-span-5 md:order-1 flex flex-col justify-between border-t border-white/10">
          {items.map((film, i) => (
            <li key={film.title} className="flex-1 border-b border-white/10">
              <button
                type="button"
                aria-pressed={active === i}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group flex h-full min-h-[44px] w-full items-center gap-4 md:gap-5 py-3 md:py-5 text-left"
              >
                <span
                  className={`text-metadata tracking-[0.2em] transition-colors ${
                    active === i ? 'text-heritage-gold' : 'text-ivory/30'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={`text-body-md md:text-body-lg lg:text-headline-md leading-tight transition-[color,transform] duration-300 ${
                    active === i
                      ? 'text-white translate-x-1'
                      : 'text-ivory/45 group-hover:text-ivory/70'
                  }`}
                >
                  {film.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
          {/* Phones already have the sticky quote button at this point. */}
          <a href={formAnchor} className="hidden md:flex">
            <Button variant="gold" size="md" className="w-full sm:w-auto">
              Get a quote
            </Button>
          </a>
          <Link
            href={href}
            className="text-label-caps text-heritage-gold inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            {cta.toUpperCase()} <span aria-hidden="true">→</span>
          </Link>
          <a
            href={formAnchor}
            className="text-sm text-ivory/60 underline underline-offset-4 decoration-heritage-gold/50 hover:text-heritage-gold transition-colors"
          >
            {unsure}
          </a>
        </div>
      </Reveal>
    </OnsiteSection>
  )
}
