import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ServicePage } from '@/lib/content/services/types'

function page(slug: string, published: boolean, navLabel: string): ServicePage {
  return {
    slug,
    published,
    lastModified: '2026-11-01',
    navLabel,
    title: `${navLabel} title`,
    description: `${navLabel} description`,
    h1: `${navLabel} heading`,
    directAnswer: 'A direct answer.',
    images: [],
    sections: [{ heading: 'Section', body: ['Body text.'] }],
    delivery: 'Delivery details.',
    reviewTag: 'vsl',
    faqs: [{ question: 'A question?', answer: 'An answer.' }],
  }
}

vi.mock('@/lib/content/services/pages', () => ({
  SERVICE_PAGES: [page('live', true, 'Live'), page('draft', false, 'Draft')],
}))
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
  usePathname: () => '/studios/live',
}))

import { getPublishedService, publishedServices } from '@/lib/content/services'
import sitemap from '@/app/sitemap'
import ServiceRoute, { generateMetadata, generateStaticParams } from '@/app/studios/[slug]/page'
import { ServicePageView } from '@/components/marketing/service-page'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/marketing/footer'
import { FinalCTA } from '@/components/marketing/final-cta'
import { TourModalProvider } from '@/lib/tour-modal-context'
import { LOCAL_BUSINESS_ID, SITE_URL } from '@/lib/seo/site'

const live = page('live', true, 'Live')

describe('service pages', () => {
  it('hides unpublished pages from lookup, params and sitemap', () => {
    expect(getPublishedService('draft')).toBeUndefined()
    expect(publishedServices().map((p) => p.slug)).toEqual(['live'])
    expect(generateStaticParams()).toEqual([{ slug: 'live' }])
    const urls = sitemap().map((e) => e.url)
    expect(urls).toContain(`${SITE_URL}/studios/live`)
    expect(urls.join()).not.toContain('draft')
  })

  it('each page sets its own canonical and Open Graph url', () => {
    const m = generateMetadata({ params: { slug: 'live' } })
    expect(m.alternates?.canonical).toBe('/studios/live')
    expect(m.openGraph?.url).toBe(`${SITE_URL}/studios/live`)
  })

  it('unknown or unpublished slugs are not found', () => {
    expect(() => ServiceRoute({ params: { slug: 'draft' } })).toThrow('NEXT_NOT_FOUND')
    expect(() => ServiceRoute({ params: { slug: 'nope' } })).toThrow('NEXT_NOT_FOUND')
  })

  it('nav booking link works from any page', () => {
    render(<Nav />)
    expect(screen.getByText('BOOK A SESSION')).toHaveAttribute('href', '/#book')
  })

  it('final CTA booking link works from any page', () => {
    render(
      <TourModalProvider>
        <FinalCTA />
      </TourModalProvider>,
    )
    expect(screen.getByRole('button', { name: 'Explore Studio Sets' }).closest('a')).toHaveAttribute(
      'href',
      '/#book',
    )
  })

  it('footer links only published pages', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Live' })).toHaveAttribute('href', '/studios/live')
    expect(screen.queryByRole('link', { name: 'Draft' })).toBeNull()
  })

  it('leads with the direct answer and links the business without star markup', () => {
    const { container } = render(
      <TourModalProvider>
        <ServicePageView page={live} />
      </TourModalProvider>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Live heading')
    expect(screen.getByText('A direct answer.')).toBeInTheDocument()
    expect(container.innerHTML).toContain(LOCAL_BUSINESS_ID)
    expect(container.innerHTML).not.toMatch(/aggregateRating/)
  })
})
