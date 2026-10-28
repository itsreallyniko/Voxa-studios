import type { CrewSlot } from '@/lib/content/onsite/types'
import { OnsiteSection } from './onsite-section'
import { Reveal } from '@/components/ui/reveal'

export function CrewBlock({ crew }: { crew: CrewSlot[] }) {
  return (
    <OnsiteSection
      eyebrow="THE CREW"
      heading="A small team that knows the room."
      body="A Voxa producer and an on-set director of photography — joined by additional crew when the project needs it."
    >
      <p className="text-label-caps text-ivory/40 mb-8">PLACEHOLDER — AWAITING CREW PHOTOS AND BIOS</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        {crew.map((c, i) => (
          <Reveal key={c.role + i} delay={i * 60}>
            <div className="flex items-center gap-5 p-5 border border-white/10 bg-surface-container-low">
              <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-label-caps text-heritage-gold">{c.role.toUpperCase()}</p>
                <p className="text-sm text-ivory/50 mt-1">Name coming soon</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </OnsiteSection>
  )
}
