import type { CrewSlot } from '@/lib/content/onsite/types'
import { OnsiteSection } from './onsite-section'
import { Reveal } from '@/components/ui/reveal'

export function CrewBlock({ crew }: { crew: CrewSlot[] }) {
  const anyFilled = crew.some((c) => !('placeholder' in c) || c.placeholder !== true)
  const anyPreview = crew.some(
    (c) => !('placeholder' in c && c.placeholder === true) && (c as any).preview === true
  )

  return (
    <OnsiteSection
      eyebrow="THE CREW"
      heading="A small team that knows the room."
      body="A Voxa producer and a creative director, joined by additional crew when the project needs it."
    >
      {!anyFilled && (
        <p className="text-label-caps text-ivory/40 mb-8">
          PLACEHOLDER — AWAITING CREW PHOTOS AND BIOS
        </p>
      )}
      {anyPreview && (
        <p className="text-label-caps text-heritage-gold mb-8 inline-block border border-heritage-gold/40 px-3 py-2">
          PREVIEW · PENDING APPROVAL BEFORE LAUNCH
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        {crew.map((c, i) => {
          const isPlaceholder = 'placeholder' in c && c.placeholder === true
          if (isPlaceholder) {
            const ph = c as Extract<CrewSlot, { placeholder: true }>
            return (
              <Reveal key={`${ph.role}-${i}`} delay={i * 60}>
                <div className="flex items-center gap-5 p-5 border border-white/10 bg-surface-container-low">
                  <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-label-caps text-heritage-gold">{ph.role.toUpperCase()}</p>
                    <p className="text-sm text-ivory/50 mt-1">Name coming soon</p>
                  </div>
                </div>
              </Reveal>
            )
          }
          const filled = c as Extract<CrewSlot, { name: string }>
          return (
            <Reveal key={`${filled.name}-${i}`} delay={i * 60} className="h-full">
              <div className="h-full flex items-start gap-5 p-5 border border-white/10 bg-surface-container-low">
                <div className="relative h-14 w-14 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={filled.photo}
                    alt={filled.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-label-caps text-heritage-gold">{filled.role.toUpperCase()}</p>
                  <p className="text-body-md text-white mt-1">{filled.name}</p>
                  {filled.subtitle && (
                    <p className="text-sm text-ivory/50 mt-0.5">{filled.subtitle}</p>
                  )}
                  <p className="text-sm text-ivory/55 mt-2 leading-relaxed">{filled.bio}</p>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </OnsiteSection>
  )
}
