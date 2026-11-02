import type { CaseSlot } from '@/lib/content/onsite/types'
import { parseVideoUrl, videoThumbnail } from '@/lib/content/onsite/video'
import { OnsiteSection } from './onsite-section'
import { VideoPlayer } from './video-player'
import { Reveal } from '@/components/ui/reveal'

type FilledCase = Extract<CaseSlot, { client: string }>

async function FilledCaseCard({ filled }: { filled: FilledCase }) {
  const label = `${filled.client} — ${filled.title}`
  const video = parseVideoUrl(filled.href)
  const thumbnail =
    filled.thumbnail ?? (video ? await videoThumbnail(video, filled.href) : null)

  return (
    <article className="h-full bg-surface-container-low border border-white/10 hover:border-heritage-gold/60 transition-colors overflow-hidden">
      <div className="relative aspect-[16/9] bg-black overflow-hidden">
        {video ? (
          <VideoPlayer video={video} title={label} thumbnail={thumbnail} />
        ) : (
          <a
            href={filled.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch: ${label}`}
            className="block h-full w-full"
          >
            {thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail}
                alt=""
                className="h-full w-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            )}
          </a>
        )}
        {filled.preview && (
          <span className="pointer-events-none absolute top-3 left-3 text-[10px] tracking-[0.3em] uppercase bg-obsidian/80 text-heritage-gold px-2 py-1 border border-heritage-gold/40">
            PREVIEW
          </span>
        )}
      </div>
      {filled.stills && filled.stills.length > 0 && (
        <ul className={`grid gap-px bg-black ${filled.stills.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {filled.stills.map((still) => (
            <li key={still.src} className="aspect-[16/9] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={still.src}
                alt={still.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      )}
      <div className="p-6">
        <span className="text-label-caps text-heritage-gold mb-3 block">
          {filled.type.toUpperCase()}
        </span>
        <p className="text-metadata uppercase tracking-[0.2em] text-ivory/50 mb-2">
          {filled.client}
        </p>
        <h3 className="text-body-lg text-white mb-3 leading-snug">
          {filled.title}
        </h3>
        <p className="text-sm text-ivory/60 leading-relaxed">
          {filled.description}
        </p>
      </div>
    </article>
  )
}

export function CaseStudies({ cases }: { cases: CaseSlot[] }) {
  const anyFilled = cases.some((c) => !('placeholder' in c) || c.placeholder !== true)
  const anyPreview = cases.some(
    (c) => !('placeholder' in c && c.placeholder === true) && (c as any).preview === true
  )

  return (
    <OnsiteSection
      eyebrow="SELECTED WORK"
      heading="A few projects we're proud of."
      tone="surface"
    >
      {!anyFilled && (
        <p className="text-label-caps text-ivory/40 mb-8">
          PLACEHOLDER — AWAITING CASE STUDIES
        </p>
      )}
      {anyPreview && (
        <p className="text-label-caps text-heritage-gold mb-8 inline-block border border-heritage-gold/40 px-3 py-2">
          PREVIEW · OUR TEAM&apos;S PAST WORK · PENDING APPROVAL BEFORE LAUNCH
        </p>
      )}
      <div className={`grid grid-cols-1 gap-6 ${cases.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {cases.map((c, i) => {
          const isPlaceholder = 'placeholder' in c && c.placeholder === true
          if (isPlaceholder) {
            return (
              <Reveal key={`ph-${i}`} delay={i * 60}>
                <article className="aspect-[4/3] border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center">
                  <span className="text-label-caps text-ivory/40 mb-3">CASE STUDY</span>
                  <p className="text-sm text-ivory/40 leading-relaxed">
                    Client · goal · what we made · where it ran
                  </p>
                </article>
              </Reveal>
            )
          }
          const filled = c as FilledCase
          return (
            <Reveal key={`${filled.client}-${i}`} delay={i * 60}>
              <FilledCaseCard filled={filled} />
            </Reveal>
          )
        })}
      </div>
    </OnsiteSection>
  )
}
