import type { Metadata } from 'next'
import { OnsiteHero } from '@/components/onsite/onsite-hero'
import { HowItWorks } from '@/components/onsite/how-it-works'
import { FilmTypes } from '@/components/onsite/film-types'
import { ProofStrip } from '@/components/onsite/proof-strip'
import { CrewBlock } from '@/components/onsite/crew-block'
import { OnsiteFaq } from '@/components/onsite/onsite-faq'
import { QuoteForm } from '@/components/onsite/quote-form'
import { StickyQuoteCta } from '@/components/onsite/sticky-quote-cta'
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

const SITE_URL = 'https://voxastudios.com'

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: onsiteHub.seo.title,
  description: onsiteHub.seo.description,
  serviceType: 'Video production',
  provider: { '@id': `${SITE_URL}/#localbusiness` },
  areaServed: [
    ...['Tampa', 'St. Petersburg', 'Clearwater', 'Brandon', 'Wesley Chapel', 'Sarasota'].map(
      (name) => ({ '@type': 'City', name })
    ),
    { '@type': 'Place', name: 'Tampa Bay area' },
  ],
  url: `${SITE_URL}/onsite`,
}

export default function OnsiteHubPage() {
  return (
    <>
      <OnsiteHero
        eyebrow={onsiteHub.hero.eyebrow}
        headline={onsiteHub.hero.headline}
        subline={onsiteHub.hero.subline}
        muteLoopVideo={onsiteHub.hero.muteLoopVideo}
        muteLoopPoster={onsiteHub.hero.muteLoopPoster}
        secondaryCta={onsiteHub.hero.secondaryCta}
      />

      <ProofStrip slots={onsiteHub.proof} studioNote={onsiteHub.studioNote} />

      <FilmTypes {...onsiteHub.films} />

      <HowItWorks
        heading={onsiteHub.howItWorks.heading}
        steps={onsiteHub.howItWorks.steps}
      />

      <CrewBlock crew={onsiteHub.crew} />

      <OnsiteFaq items={onsiteHub.faq} />

      <QuoteForm pageSlug="hub" preselect="not-sure" />

      <StickyQuoteCta />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
    </>
  )
}
