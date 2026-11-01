import { ComeVisitUs } from '@/components/marketing/come-visit-us'
import { FAQ } from '@/components/marketing/faq'
import { FinalCTA } from '@/components/marketing/final-cta'
import { Footer } from '@/components/marketing/footer'
import { ReviewQuotes } from '@/components/marketing/review-quotes'
import type { ServicePage } from '@/lib/content/services/types'
import { LOCAL_BUSINESS_ID, SITE_URL, jsonLd } from '@/lib/seo/site'

export function ServicePageView({ page }: { page: ServicePage }) {
  return (
    <>
      <main className="bg-obsidian pt-40 pb-section-gap">
        <div className="max-w-3xl mx-auto px-6 md:px-margin-edge">
          <h1 className="text-display-lg-mobile md:text-headline-xl text-white leading-[1.1] mb-8">
            {page.h1}
          </h1>
          <p className="text-body-lg text-ivory/85 leading-relaxed mb-20">{page.directAnswer}</p>

          {page.sections.map((s) => (
            <section key={s.heading} className="mb-16">
              <h2 className="text-headline-md text-white mb-6">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="text-body-md text-ivory/70 leading-relaxed mb-4">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <section className="bg-surface-container-low liquid-glass p-8 md:p-10">
            <h2 className="text-label-caps text-heritage-gold mb-4">WHAT YOU WALK OUT WITH</h2>
            <p className="text-body-md text-ivory/85 leading-relaxed">{page.delivery}</p>
          </section>
        </div>
      </main>

      <ReviewQuotes tag={page.reviewTag} />
      <FAQ items={page.faqs} />
      <ComeVisitUs />
      <FinalCTA />
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: page.h1,
            description: page.description,
            url: `${SITE_URL}/studios/${page.slug}`,
            areaServed: 'Tampa, FL',
            provider: { '@id': LOCAL_BUSINESS_ID },
          }),
        }}
      />
    </>
  )
}
