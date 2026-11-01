import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const nav = vi.hoisted(() => ({ pathname: '/' }))
vi.mock('next/navigation', () => ({
  usePathname: () => nav.pathname,
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
}))

import { Nav } from '@/components/nav'
import { FinalCTA } from '@/components/marketing/final-cta'
import { ComeVisitUs } from '@/components/marketing/come-visit-us'
import { ServicePageView } from '@/components/marketing/service-page'
import { allServices } from '@/lib/content/services'
import { TourModalProvider } from '@/lib/tour-modal-context'

function hrefs() {
  return [
    screen.getByText('BOOK A SESSION'),
    screen.getByRole('button', { name: 'Explore Studio Sets' }).closest('a')!,
    screen.getByRole('button', { name: 'Book Now' }).closest('a')!,
  ].map((el) => el.getAttribute('href'))
}

function renderAll() {
  render(
    <TourModalProvider>
      <Nav />
      <FinalCTA />
      <ComeVisitUs />
    </TourModalProvider>,
  )
}

describe('booking links', () => {
  beforeEach(() => {
    nav.pathname = '/'
  })

  it('stay on the same page on the homepage, so ad parameters survive', () => {
    renderAll()
    expect(hrefs()).toEqual(['#book', '#book', '#book'])
  })

  it('go to the homepage booking section from other pages', () => {
    nav.pathname = '/studios/live'
    renderAll()
    expect(hrefs()).toEqual(['/#book', '/#book', '/#book'])
  })

  it.each(allServices())('$slug has no dead booking link', (page) => {
    nav.pathname = `/studios/${page.slug}`
    const { container } = render(
      <TourModalProvider>
        <ServicePageView page={page} />
      </TourModalProvider>,
    )
    expect(container.querySelector('a[href="#book"]')).toBeNull()
  })
})
