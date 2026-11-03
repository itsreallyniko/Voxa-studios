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
    <section aria-label="Team credits" className="py-10 md:py-16 bg-obsidian border-y border-white/5">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal>
          {anyPlaceholder ? (
            <p className="text-label-caps text-ivory/40 mb-8 text-center">
              PLACEHOLDER — AWAITING ASSETS
            </p>
          ) : (
            <p className="text-[10px] md:text-label-caps tracking-[0.3em] text-ivory/50 mb-5 md:mb-8 text-center">
              PAST WORK BY MEMBERS OF OUR TEAM
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
                : 'flex flex-wrap items-center justify-center gap-x-5 md:gap-x-12 gap-y-3 md:gap-y-4'
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
                <li key={s.name} className={`flex items-center justify-center ${s.logo ? 'h-16' : 'md:h-16'}`}>
                  {s.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.logo}
                      alt={s.name}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[10px] md:text-metadata uppercase tracking-[0.15em] md:tracking-[0.2em] text-ivory/60 text-center">
                      {s.name}
                    </span>
                  )}
                </li>
              )
            )}
          </ul>
          {!anyPlaceholder && (
            <p className="mt-4 md:mt-6 text-[11px] md:text-xs text-ivory/40 text-center">
              Credits from our team members&apos; individual careers, including projects produced with other companies.
            </p>
          )}
          {studioNote && (
            <p className="mt-5 md:mt-8 text-xs md:text-sm text-ivory/60 text-center">
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
