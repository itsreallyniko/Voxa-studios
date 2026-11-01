import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/marketing/footer'
import { ServicePageView } from '@/components/marketing/service-page'
import { allServices } from '@/lib/content/services'
import { TourModalProvider } from '@/lib/tour-modal-context'

const service = (slug: string) => allServices().find((s) => s.slug === slug)!

describe('one studio, not several', () => {
  it('uses labels that describe what you film', () => {
    expect(service('podcast-studio-tampa').navLabel).toBe('Podcasts')
    expect(service('youtube-studio-tampa').navLabel).toBe('YouTube Videos')
    expect(service('vsl-meta-ads-tampa').navLabel).toBe('VSLs & Ads')
    expect(service('course-webinar-tampa').navLabel).toBe('Courses & Webinars')
  })

  it('uses headlines that do not name a separate studio', () => {
    expect(service('podcast-studio-tampa').h1).toBe('Record Your Podcast in Tampa')
    expect(service('youtube-studio-tampa').h1).toBe('Film Your YouTube Videos in Tampa')
  })

  it('keeps the search wording in titles and addresses', () => {
    expect(service('podcast-studio-tampa').title).toContain('Podcast Studio in Tampa')
    expect(service('youtube-studio-tampa').title).toContain('YouTube Studio in Tampa')
  })

  it('groups the footer links under one heading', () => {
    render(<Footer />)
    expect(screen.getByText('What You Can Film at Voxa')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'VSLs & Ads' })).toHaveAttribute('href', '/studios/vsl-meta-ads-tampa')
  })

  it('says it is one studio on each page and keeps the search name in structured data', () => {
    const { container } = render(
      <TourModalProvider>
        <ServicePageView page={service('podcast-studio-tampa')} />
      </TourModalProvider>,
    )
    expect(
      screen.getByText('One Tampa studio with six sets, so you can choose the look that fits your content.'),
    ).toBeInTheDocument()
    const scripts = [...container.querySelectorAll('script[type="application/ld+json"]')]
    const data = scripts.map((s) => JSON.parse(s.innerHTML)).find((d) => d['@type'] === 'Service')
    expect(data.name).toBe('Podcast Studio in Tampa, FL')
  })
})
