import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NichePage } from '@/components/onsite/niche-page'
import { getPage, onsitePages } from '@/lib/content/onsite'

export function generateStaticParams() {
  // Include draft slugs so direct URLs work (noindex applied via metadata).
  return onsitePages.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getPage(params.slug)
  if (!page) return {}
  const robots = page.draft ? { index: false, follow: false } : undefined
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: `/onsite/${page.slug}` },
    robots,
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: `/onsite/${page.slug}`,
      images: [{ url: page.seo.ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seo.title,
      description: page.seo.description,
      images: [page.seo.ogImage],
    },
  }
}

export default function OnsiteNichePage({ params }: { params: { slug: string } }) {
  const page = getPage(params.slug)
  if (!page) notFound()
  return <NichePage page={page} />
}
