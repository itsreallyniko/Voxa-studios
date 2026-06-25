import { Reveal } from '@/components/ui/reveal'

type Deliverable = {
  eyebrow: string
  headline: string
  subhead: string
  icon: string
  bullets: string[]
  aside: string
}

const DELIVERABLES: Deliverable[] = [
  {
    eyebrow: 'EXECUTIVE PODCAST SET',
    headline: 'Edited. Delivered in 48 hours.',
    subhead: 'Ready to post the same week.',
    icon: 'movie',
    bullets: [
      'Live-switched program edit',
      'Color-graded and audio-cleaned',
      'Delivered via Google Drive',
    ],
    aside: 'Short-form vertical clips available as an add-on.',
  },
  {
    eyebrow: 'AUTHORITY DESK + CREATOR SETS',
    headline: 'Production handled. Files in your hands same day.',
    subhead: 'Hand them to your editor and start cutting.',
    icon: 'video_library',
    bullets: [
      'Broadcast-quality multi-cam — each camera angle as its own file',
      'Color-corrected and audio-synced on delivery',
      'Delivered via Google Drive',
    ],
    aside: 'Skip the crew, lighting, mics, and setup — just direct and perform.',
  },
]

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 mt-1.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function WhatYouGet() {
  return (
    <section className="py-section-gap bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal className="max-w-3xl mb-20">
          <span className="text-label-caps text-heritage-gold mb-4 block">DELIVERABLES</span>
          <h2 className="text-headline-xl text-white">
            Show Up. Record. <br />
            Leave With Your Footage.
          </h2>
          <p className="text-body-lg text-ivory/60 mt-6">
            Each set has its own deliverable — here&apos;s exactly what you walk out with.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {DELIVERABLES.map((d, i) => (
            <Reveal key={d.eyebrow} delay={i * 80}>
              <article className="relative h-full flex flex-col bg-surface-container-low liquid-glass p-8 md:p-12">
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-px bg-heritage-gold/50"
                />
                <div className="flex items-center gap-3 mb-8">
                  <span className="material-symbols-outlined text-heritage-gold text-[26px] leading-none">
                    {d.icon}
                  </span>
                  <span className="text-label-caps text-heritage-gold/80">
                    {d.eyebrow}
                  </span>
                </div>
                <h3 className="text-headline-md text-white mb-4 leading-[1.15]">
                  {d.headline}
                </h3>
                <p className="text-body-lg text-ivory/70 mb-10">{d.subhead}</p>
                <ul className="flex flex-col gap-4 mb-10">
                  {d.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-ivory/85 text-base leading-relaxed"
                    >
                      <span className="text-heritage-gold">
                        <CheckIcon />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6 border-t border-white/5">
                  <p className="text-sm italic text-ivory/45 leading-relaxed">
                    {d.aside}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
