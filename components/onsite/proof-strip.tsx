import type { ProofSlot } from '@/lib/content/onsite/types'
import { Reveal } from '@/components/ui/reveal'

export function ProofStrip({ slots }: { slots: ProofSlot[] }) {
  if (!slots.length) return null
  return (
    <section aria-label="Trusted by" className="py-16 bg-obsidian border-y border-white/5">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal>
          <p className="text-label-caps text-ivory/40 mb-8 text-center">
            PLACEHOLDER — AWAITING ASSETS
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
            {slots.map((s, i) => (
              <li
                key={i}
                className="h-16 flex items-center justify-center border border-dashed border-white/10 text-ivory/30 text-metadata uppercase tracking-[0.3em]"
              >
                {s.label ?? s.kind}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
