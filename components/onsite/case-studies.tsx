import type { CaseSlot } from '@/lib/content/onsite/types'
import { OnsiteSection } from './onsite-section'
import { Reveal } from '@/components/ui/reveal'

export function CaseStudies({ cases }: { cases: CaseSlot[] }) {
  return (
    <OnsiteSection
      eyebrow="SELECTED WORK"
      heading="A few projects we're proud of."
      tone="surface"
    >
      <p className="text-label-caps text-ivory/40 mb-8">PLACEHOLDER — AWAITING CASE STUDIES</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cases.map((c, i) => (
          <Reveal key={i} delay={i * 60}>
            <article className="aspect-[4/3] border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center">
              <span className="text-label-caps text-ivory/40 mb-3">CASE STUDY</span>
              <p className="text-sm text-ivory/40 leading-relaxed">
                Client · goal · what we made · where it ran
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </OnsiteSection>
  )
}
