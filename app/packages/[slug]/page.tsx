import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PackagePageView } from '@/components/packages/package-page'
import { PACKAGE_PAGES, getPackagePage } from '@/lib/content/packages'
import { SITE_URL } from '@/lib/seo/site'

type Props = { params: { slug: string } }

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(PACKAGE_PAGES).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const page = getPackagePage(params.slug)
  if (!page) return {}
  const path = `/packages/${page.slug}`
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
      images: [{ url: '/hero.jpg', width: 1200, height: 630, alt: page.headline }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: ['/hero.jpg'],
    },
  }
}

export default function PackageRoute({ params }: Props) {
  const page = getPackagePage(params.slug)
  if (!page) notFound()
  return <PackagePageView page={page} />
}
