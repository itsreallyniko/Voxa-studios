import { Reveal } from '@/components/ui/reveal'
import { usableReviews, type ServiceTag } from '@/lib/content/reviews'

const SOURCE_LABEL = { google: 'Google', peerspace: 'Peerspace' } as const

// Both profiles are rated 5.0 across every review, so each card shows five stars.
function Stars() {
  return (
    <span role="img" aria-label="Rated 5 out of 5 stars" className="flex gap-0.5 text-[#fbbc04]">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z" />
        </svg>
      ))}
    </span>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.5z" />
      <path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3a11.5 11.5 0 0 0 10.2 6.3z" />
      <path fill="#FBBC05" d="M5.6 14.2a6.900 6.900 0 0 1 0-4.400v-3H1.800a11.500 11.500 0 0 0 0 10.400z" />
      <path fill="#EA4335" d="M12 5.100c1.700 0 3.200.6 4.400 1.700l3.300-3.300A11.500 11.500 0 0 0 1.800 6.800l3.800 3c.9-2.700 3.400-4.700 6.400-4.700z" />
    </svg>
  )
}

export function ReviewQuotes({ tag }: { tag?: ServiceTag }) {
  const reviews = usableReviews(tag)
  if (reviews.length === 0) return null

  return (
    <section className="py-16 md:py-20 bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal className="mb-8">
          <span className="text-label-caps text-heritage-gold mb-2 block">CLIENT REVIEWS</span>
          <h2 className="text-3xl text-white">In Their Words</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 80}>
              <figure className="h-full bg-surface-container-low border border-white/10 rounded-lg p-5">
                <figcaption className="flex items-center gap-3 mb-3">
                  <span
                    aria-hidden="true"
                    className="w-9 h-9 shrink-0 rounded-full bg-heritage-gold/20 text-heritage-gold flex items-center justify-center text-sm font-medium"
                  >
                    {r.name.charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-white truncate">{r.name}</span>
                    <span className="block text-xs text-ivory/60">
                      {r.business ?? `Recorded ${r.recorded}`}
                    </span>
                  </span>
                  {r.source === 'google' && <GoogleMark />}
                </figcaption>
                <div className="flex items-center gap-2 mb-2">
                  <Stars />
                  {r.sourceUrl ? (
                    <a
                      href={r.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-ivory/60 underline hover:text-white transition-colors"
                    >
                      {SOURCE_LABEL[r.source]} review
                    </a>
                  ) : (
                    <span className="text-xs text-ivory/60">{SOURCE_LABEL[r.source]} review</span>
                  )}
                </div>
                <blockquote className="text-sm text-ivory/85 leading-relaxed">{r.quote}</blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
