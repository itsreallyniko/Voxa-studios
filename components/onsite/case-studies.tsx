import type { CaseSlot } from '@/lib/content/onsite/types'
import { OnsiteSection } from './onsite-section'
import { Reveal } from '@/components/ui/reveal'

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          const filled = c as Extract<CaseSlot, { client: string }>
          return (
            <Reveal key={`${filled.client}-${i}`} delay={i * 60}>
              <a
                href={filled.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full bg-surface-container-low border border-white/10 hover:border-heritage-gold/60 transition-colors overflow-hidden"
              >
                <div className="relative aspect-[16/9] bg-black overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={filled.thumbnail}
                    alt={`${filled.client} — ${filled.title}`}
                    className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                  {filled.preview && (
                    <span className="absolute top-3 left-3 text-[10px] tracking-[0.3em] uppercase bg-obsidian/80 text-heritage-gold px-2 py-1 border border-heritage-gold/40">
                      PREVIEW
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-label-caps text-heritage-gold mb-3 block">
                    {filled.type.toUpperCase()}
                  </span>
                  <p className="text-metadata uppercase tracking-[0.2em] text-ivory/50 mb-2">
                    {filled.client}
                  </p>
                  <h3 className="text-body-lg text-white mb-3 leading-snug group-hover:text-heritage-gold transition-colors">
                    {filled.title}
                  </h3>
                  <p className="text-sm text-ivory/60 leading-relaxed">
                    {filled.description}
                  </p>
                  <span className="text-label-caps text-ivory/40 mt-6 inline-flex items-center gap-2 group-hover:text-heritage-gold transition-colors">
                    WATCH <span aria-hidden="true">→</span>
                  </span>
                </div>
              </a>
            </Reveal>
          )
        })}
      </div>
    </OnsiteSection>
  )
}
