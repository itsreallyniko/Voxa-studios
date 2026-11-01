import Image from 'next/image'
import Link from 'next/link'
import { ComeVisitUs } from '@/components/marketing/come-visit-us'
import { FAQ } from '@/components/marketing/faq'
import { FinalCTA } from '@/components/marketing/final-cta'
import { Footer } from '@/components/marketing/footer'
import { ReviewQuotes } from '@/components/marketing/review-quotes'
import type { ServicePage } from '@/lib/content/services/types'
import { LOCAL_BUSINESS_ID, SITE_URL, jsonLd } from '@/lib/seo/site'

function ServiceImage({
  image,
  aspect,
  sizes,
  priority = false,
}: {
  image: ServicePage['images'][number]
  aspect: string
  sizes: string
  priority?: boolean
}) {
  return (
    <figure>
      <div className={`relative ${aspect} overflow-hidden bg-surface-container-low`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          quality={90}
          priority={priority}
          className="object-cover"
        />
      </div>
      {image.caption && (
        <figcaption className="text-sm text-ivory/50 mt-3">{image.caption}</figcaption>
      )}
    </figure>
  )
}

export function ServicePageView({ page }: { page: ServicePage }) {
  const [lead, ...rest] = page.images
  return (
    <>
      <main className="bg-obsidian pt-40 pb-section-gap">
        <div className="max-w-3xl mx-auto px-6 md:px-margin-edge">
          <h1 className="text-display-lg-mobile md:text-headline-xl text-white leading-[1.1] mb-8">
            {page.h1}
          </h1>
          <p className="text-body-lg text-ivory/85 leading-relaxed mb-4">{page.directAnswer}</p>
          <p className="text-body-md text-heritage-gold mb-12">
            One Tampa studio with six sets, so you can choose the look that fits your content.
          </p>

          {lead && <ServiceImage image={lead} aspect="aspect-video" sizes="(min-width: 768px) 768px, 100vw" priority />}

          <div className="mb-20" />

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

          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
              {rest.map((image) => (
                <div key={image.src} className={image.wide ? 'sm:col-span-2' : undefined}>
                  <ServiceImage
                    image={image}
                    aspect={image.wide ? 'aspect-video' : 'aspect-[4/5]'}
                    sizes={image.wide ? '(min-width: 768px) 768px, 100vw' : '(min-width: 640px) 640px, 100vw'}
                  />
                </div>
              ))}
            </div>
          )}

          <section className="bg-surface-container-low liquid-glass p-8 md:p-10">
            <h2 className="text-label-caps text-heritage-gold mb-4">WHAT YOU WALK OUT WITH</h2>
            <p className="text-body-md text-ivory/85 leading-relaxed">{page.delivery}</p>
          </section>

          {page.related && (
            <Link
              href={page.related.href}
              className="inline-block mt-10 text-body-md text-heritage-gold hover:text-white transition-colors"
            >
              {page.related.label}
            </Link>
          )}
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
            name: page.title.split(' | ')[0],
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
