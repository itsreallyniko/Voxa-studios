import type { Metadata } from 'next'
import Link from 'next/link'
import { OnsiteHero } from '@/components/onsite/onsite-hero'
import { HowItWorks } from '@/components/onsite/how-it-works'
import { PackagesRow } from '@/components/onsite/packages-row'
import { OnsiteFaq } from '@/components/onsite/onsite-faq'
import { QuoteForm } from '@/components/onsite/quote-form'
import { OnsiteSection } from '@/components/onsite/onsite-section'
import { Reveal } from '@/components/ui/reveal'
import { publishedPages } from '@/lib/content/onsite'
import { onsiteHub } from '@/lib/content/onsite/hub'

export const metadata: Metadata = {
  title: onsiteHub.seo.title,
  description: onsiteHub.seo.description,
  alternates: { canonical: '/onsite' },
  openGraph: {
    title: onsiteHub.seo.title,
    description: onsiteHub.seo.description,
    url: '/onsite',
    images: [{ url: onsiteHub.seo.ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: onsiteHub.seo.title,
    description: onsiteHub.seo.description,
    images: [onsiteHub.seo.ogImage],
  },
}

export default function OnsiteHubPage() {
  const pages = publishedPages()
  return (
    <>
      <OnsiteHero
        eyebrow={onsiteHub.hero.eyebrow}
        headline={onsiteHub.hero.headline}
        subline={onsiteHub.hero.subline}
        muteLoopVideo={onsiteHub.hero.muteLoopVideo}
      />

      <HowItWorks
        heading={onsiteHub.howItWorks.heading}
        steps={onsiteHub.howItWorks.steps}
      />

      <PackagesRow
        packageIds={['interview-session', 'content-day', 'commercial']}
      />

      <OnsiteSection
        id="niches"
        eyebrow="BUILT FOR"
        heading="Pages tailored to the shoot you have in mind."
        tone="surface"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pages.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <Link
                href={`/onsite/${p.slug}`}
                className="group block h-full p-8 border border-white/10 bg-surface-container-low hover:border-heritage-gold/60 transition-colors"
              >
                <span className="text-label-caps text-heritage-gold mb-4 block">
                  {p.hero.eyebrow}
                </span>
                <h3 className="text-headline-md text-white mb-3 leading-tight group-hover:text-heritage-gold transition-colors">
                  {p.hero.headline}
                </h3>
                <p className="text-sm text-ivory/60 leading-relaxed">
                  {p.hero.subline}
                </p>
                <span className="text-label-caps text-ivory/50 mt-6 inline-flex items-center gap-2 group-hover:text-heritage-gold transition-colors">
                  SEE THE PAGE
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </OnsiteSection>

      <OnsiteFaq items={onsiteHub.faq} />

      <QuoteForm pageSlug="hub" preselect="not-sure" />
    </>
  )
}
