import { Reveal } from '@/components/ui/reveal'
import { usableReviews, type ServiceTag } from '@/lib/content/reviews'

const SOURCE_LABEL = { google: 'Google', peerspace: 'Peerspace' } as const

export function ReviewQuotes({ tag }: { tag?: ServiceTag }) {
  const reviews = usableReviews(tag)
  if (reviews.length === 0) return null

  return (
    <section className="py-section-gap bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal className="max-w-3xl mb-16">
          <span className="text-label-caps text-heritage-gold mb-4 block">CLIENT REVIEWS</span>
          <h2 className="text-headline-xl text-white">In Their Words</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 80}>
              <figure className="h-full flex flex-col bg-surface-container-low liquid-glass p-8 md:p-10">
                <blockquote className="text-body-lg text-ivory/85 leading-relaxed mb-8">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto text-sm text-ivory/60 leading-relaxed">
                  <span className="text-white">{r.name}</span>
                  {r.business && <>, {r.business}</>}
                  <span className="block">
                    Recorded {r.recorded}
                    {r.sourceUrl ? (
                      <>
                        {' · '}
                        <a
                          href={r.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-white transition-colors"
                        >
                          {SOURCE_LABEL[r.source]} review
                        </a>
                      </>
                    ) : (
                      <> · {SOURCE_LABEL[r.source]} review</>
                    )}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
