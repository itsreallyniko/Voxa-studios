'use client'

import { useState } from 'react'
import { Reveal } from '@/components/ui/reveal'

type FAQItem = {
  question: string
  answer: string
}

const FAQS: FAQItem[] = [
  {
    question: "What's included in a session?",
    answer:
      'Every session includes multi-cam recording, studio lighting, broadcast audio, teleprompter, on-site producer, and access to the green room — from $300 for a 90-minute session.',
  },
  {
    question: 'Do you edit my video?',
    answer:
      'Podcast set sessions are delivered as a 48-hour edited switched program, color-graded and audio-cleaned. Authority Desk and Authority Creator sets are delivered as broadcast-quality multi-cam files — each camera angle as its own file, color-corrected and audio-synced, ready for your editor.',
  },
  {
    question: 'How long is a session and how much does it cost?',
    answer:
      'Sessions start at 90 minutes for $300. You can extend in 30-minute increments at $50 each, up to a 5-hour cap.',
  },
  {
    question: 'Can I tour the studio before booking?',
    answer:
      'Yes — free 15-minute tours are available by appointment. Use the "Tour the studio first" link under any booking card to grab a slot.',
  },
  {
    question: 'Where are you located and is there parking?',
    answer:
      '4021 N Armenia Ave, Suite 102, Tampa, FL 33607 — minutes from downtown Tampa, with parking on site.',
  },
  {
    question: 'What if I need to reschedule or cancel?',
    answer:
      "Your confirmation email includes a reschedule link. You can also call us at (813) 731-7075 and we'll get you sorted.",
  },
]

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

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section id="faq" className="py-section-gap bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal className="max-w-3xl mx-auto mb-16 text-center">
          <span className="text-label-caps text-heritage-gold mb-4 block">FAQ</span>
          <h2 className="text-headline-xl text-white">Common Questions</h2>
        </Reveal>

        <Reveal className="max-w-3xl mx-auto">
          <div className="bg-surface-container-low liquid-glass">
            {FAQS.map((f, i) => {
              const isOpen = openIdx === i
              const isLast = i === FAQS.length - 1
              return (
                <div
                  key={f.question}
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
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className={`w-full flex items-center justify-between gap-6 px-6 py-5 md:px-8 md:py-6 text-left transition-colors duration-200 ${
                      isOpen ? 'bg-white/[0.02]' : 'hover:bg-white/[0.015]'
                    }`}
                  >
                    <h3 className="text-body-lg text-white">{f.question}</h3>
                    <span
                      className={`shrink-0 transition-colors duration-200 ${
                        isOpen ? 'text-heritage-gold' : 'text-ivory/50'
                      }`}
                    >
                      <ChevronIcon open={isOpen} />
                    </span>
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-hidden={!isOpen}
                    className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-body-md text-ivory/70 leading-relaxed px-6 pb-6 md:px-8 md:pb-8 md:pr-16">
                        {f.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          }),
        }}
      />
    </section>
  )
}
