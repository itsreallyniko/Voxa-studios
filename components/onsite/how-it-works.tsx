import type { HowItWorksStep } from '@/lib/content/onsite/types'
import { Reveal } from '@/components/ui/reveal'
import { OnsiteSection } from './onsite-section'

export function HowItWorks({
  heading,
  steps,
}: {
  heading: string
  steps: HowItWorksStep[]
}) {
  return (
    <OnsiteSection eyebrow="HOW IT WORKS" heading={heading}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/5 border border-white/5">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 60}>
            <div className="h-full p-8 bg-obsidian">
              <span className="text-label-caps text-heritage-gold mb-6 block tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-headline-md text-white mb-3 leading-tight">
                {s.title}
              </h3>
              <p className="text-sm text-ivory/60 leading-relaxed">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="text-sm text-ivory/40 mt-8 italic">
        Timing is agreed in the proposal for every project.
      </p>
    </OnsiteSection>
  )
}
