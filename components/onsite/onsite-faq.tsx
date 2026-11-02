'use client'

import { useState } from 'react'
import type { FaqItem } from '@/lib/content/onsite/types'
import { Reveal } from '@/components/ui/reveal'

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        open ? 'rotate-180' : ''
      }`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function OnsiteFaq({
  items,
  injectJsonLd = true,
}: {
  items: FaqItem[]
  injectJsonLd?: boolean
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  if (!items.length) return null

  return (
    <section id="faq" className="py-section-gap bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal className="max-w-3xl mx-auto mb-16 text-center">
          <span className="text-label-caps text-heritage-gold mb-4 block">FAQ</span>
          <h2 className="text-headline-xl text-white">On-site video production questions, answered.</h2>
        </Reveal>

        <Reveal className="max-w-3xl mx-auto">
          <div className="bg-surface-container-low liquid-glass">
            {items.map((f, i) => {
              const isOpen = openIdx === i
              const isLast = i === items.length - 1
              return (
                <div
                  key={f.q}
                  className={`relative ${isLast ? '' : 'border-b border-white/5'}`}
                >
                  {isOpen && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 bottom-0 w-px bg-heritage-gold"
                    />
                  )}
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`onsite-faq-answer-${i}`}
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className={`w-full flex items-center justify-between gap-6 px-6 py-5 md:px-8 md:py-6 text-left transition-colors duration-200 ${
                      isOpen ? 'bg-white/[0.02]' : 'hover:bg-white/[0.015]'
                    }`}
                  >
                    <h3 className="text-body-lg text-white">{f.q}</h3>
                    <span
                      className={`shrink-0 transition-colors duration-200 ${
                        isOpen ? 'text-heritage-gold' : 'text-ivory/50'
                      }`}
                    >
                      <ChevronIcon open={isOpen} />
                    </span>
                  </button>
                  <div
                    id={`onsite-faq-answer-${i}`}
                    role="region"
                    aria-hidden={!isOpen}
                    className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-body-md text-ivory/70 leading-relaxed px-6 pb-6 md:px-8 md:pb-8 md:pr-16">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>

      {injectJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: items.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.a,
                },
              })),
            }),
          }}
        />
      )}
    </section>
  )
}
