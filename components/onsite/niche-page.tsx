import type { OnsitePage } from '@/lib/content/onsite/types'
import { OnsiteHero } from './onsite-hero'
import { ProofStrip } from './proof-strip'
import { ProblemBlock } from './problem-block'
import { DeliverablesGrid } from './deliverables-grid'
import { PackagesRow } from './packages-row'
import { HowItWorks } from './how-it-works'
import { CaseStudies } from './case-studies'
import { CrewBlock } from './crew-block'
import { ServiceArea } from './service-area'
import { OnsiteFaq } from './onsite-faq'
import { OnsiteFinalCta } from './final-cta'
import { QuoteForm } from './quote-form'

const SITE_URL = 'https://voxastudios.com'

function serviceJsonLd(page: OnsitePage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.seo.title,
    description: page.seo.description,
    provider: { '@id': `${SITE_URL}/#localbusiness` },
    areaServed: [
      ...page.serviceArea.cities.map((c) => ({
        '@type': 'City',
        name: c,
      })),
      { '@type': 'Place', name: 'Tampa Bay area' },
    ],
    url: `${SITE_URL}/onsite/${page.slug}`,
  }
}

export function NichePage({ page }: { page: OnsitePage }) {
  return (
    <>
      <OnsiteHero
        eyebrow={page.hero.eyebrow}
        headline={page.hero.headline}
        subline={page.hero.subline}
        muteLoopVideo={page.hero.muteLoopVideo}
      />
      <ProofStrip slots={page.proof} />
      <ProblemBlock
        heading={page.problem.heading}
        paragraphs={page.problem.paragraphs}
      />
      <DeliverablesGrid
        heading={page.deliverables.heading}
        cards={page.deliverables.cards}
      />
      <PackagesRow packageIds={page.packages} />
      <HowItWorks heading={page.howItWorks.heading} steps={page.howItWorks.steps} />
      <CaseStudies cases={page.cases} />
      <CrewBlock crew={page.crew} />
      <ServiceArea
        cities={page.serviceArea.cities}
        travelLine={page.serviceArea.travelLine}
      />
      <OnsiteFaq items={page.faq} />
      <OnsiteFinalCta
        heading="Tell us about your project."
        body="A short brief gets you a tailored quote. Prefer to talk? Book a fifteen-minute call."
      />
      <QuoteForm pageSlug={page.slug} preselect={page.form.preselect} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(page)) }}
      />
    </>
  )
}
