import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServicePageView } from '@/components/marketing/service-page'
import { getPublishedService, publishedServices } from '@/lib/content/services'
import { SITE_URL } from '@/lib/seo/site'

type Props = { params: { slug: string } }

export const dynamicParams = false

export function generateStaticParams() {
  return publishedServices().map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const page = getPublishedService(params.slug)
  if (!page) return {}
  const path = `/studios/${page.slug}`
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${path}`,
      siteName: 'Voxa Studios',
      title: page.title,
      description: page.description,
      images: [{ url: '/hero.jpg', width: 1200, height: 630, alt: page.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: ['/hero.jpg'],
    },
  }
}

export default function ServiceRoute({ params }: Props) {
  const page = getPublishedService(params.slug)
  if (!page) notFound()
  return <ServicePageView page={page} />
}
