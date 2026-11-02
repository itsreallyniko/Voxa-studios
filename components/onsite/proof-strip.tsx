import Link from 'next/link'
import type { ProofSlot } from '@/lib/content/onsite/types'
import { Reveal } from '@/components/ui/reveal'

export function ProofStrip({
  slots,
  studioNote,
}: {
  slots: ProofSlot[]
  studioNote?: { text: string; cta: string; href: string }
}) {
  if (!slots.length) return null
  const anyPlaceholder = slots.some((s) => s.placeholder === true)
  const anyPreview = slots.some((s) => s.placeholder !== true && s.preview === true)
  return (
    <section aria-label="Trusted by" className="py-16 bg-obsidian border-y border-white/5">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal>
          {anyPlaceholder ? (
            <p className="text-label-caps text-ivory/40 mb-8 text-center">
              PLACEHOLDER — AWAITING ASSETS
            </p>
          ) : (
            <p className="text-label-caps text-ivory/50 mb-8 text-center">
              WHO OUR TEAM HAS WORKED WITH
              {anyPreview && (
                <span className="block mt-2 text-heritage-gold">
                  PREVIEW · PENDING APPROVAL BEFORE LAUNCH
                </span>
              )}
            </p>
          )}
          <ul
            className={
              anyPlaceholder
                ? 'grid grid-cols-2 sm:grid-cols-4 gap-6 items-center'
                : 'flex flex-wrap items-center justify-center gap-x-12 gap-y-4'
            }
          >
            {slots.map((s, i) =>
              s.placeholder === true ? (
                <li
                  key={i}
                  className="h-16 flex items-center justify-center border border-dashed border-white/10 text-ivory/30 text-metadata uppercase tracking-[0.3em]"
                >
                  {s.label ?? s.kind}
                </li>
              ) : (
                <li key={s.name} className="h-16 flex items-center justify-center">
                  {s.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.logo}
                      alt={s.name}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-metadata uppercase tracking-[0.2em] text-ivory/60 text-center">
                      {s.name}
                    </span>
                  )}
                </li>
              )
            )}
          </ul>
          {studioNote && (
            <p className="mt-8 text-sm text-ivory/60 text-center">
              {studioNote.text}{' '}
              <Link
                href={studioNote.href}
                className="whitespace-nowrap underline underline-offset-4 decoration-heritage-gold/50 hover:text-heritage-gold transition-colors"
              >
                {studioNote.cta}
              </Link>
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
