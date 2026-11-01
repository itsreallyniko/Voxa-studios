import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'
import { ServicePageView } from '@/components/marketing/service-page'
import { allServices } from '@/lib/content/services'
import { TourModalProvider } from '@/lib/tour-modal-context'

describe('service page images', () => {
  it.each(allServices())('$slug uses real files with descriptive alt text', (page) => {
    expect(page.images.length).toBeGreaterThanOrEqual(3)
    for (const image of page.images) {
      expect(existsSync(join(process.cwd(), 'public', image.src))).toBe(true)
      expect(image.alt.length).toBeGreaterThan(15)
    }
    expect(new Set(page.images.map((i) => i.src)).size).toBe(page.images.length)
  })

  it.each(allServices())('$slug renders every image', (page) => {
    render(
      <TourModalProvider>
        <ServicePageView page={page} />
      </TourModalProvider>,
    )
    for (const image of page.images) {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument()
    }
  })
})

describe('service image quality', () => {
  it('serves photos at high quality', () => {
    const page = allServices()[0]
    render(
      <TourModalProvider>
        <ServicePageView page={page} />
      </TourModalProvider>,
    )
    expect(screen.getByAltText(page.images[0].alt).getAttribute('src')).toContain('q=90')
  })
})

describe('podcast and YouTube pages', () => {
  const find = (slug: string) => allServices().find((p) => p.slug === slug)!

  it('YouTube page shows desk and creator sets, not podcast sets', () => {
    const srcs = find('youtube-studio-tampa').images.map((i) => i.src).join()
    expect(srcs).toMatch(/Desk/)
    expect(srcs).toMatch(/Creator/)
    expect(srcs).not.toMatch(/Podcast/)
  })

  it('YouTube page covers the Horizon desk and creator sets', () => {
    const page = find('youtube-studio-tampa')
    const srcs = page.images.map((i) => i.src).join()
    expect(srcs).toMatch(/horizon\/Gallery Images Desk/)
    expect(srcs).toMatch(/horizon\/Gallery Images Creator/)
    const text = JSON.stringify(page.sections)
    expect(text).toContain('Horizon Desk Set')
    expect(text).toContain('Horizon Creator Set')
  })

  it('podcast page no longer covers solo YouTube videos', () => {
    expect(JSON.stringify(find('podcast-studio-tampa'))).not.toMatch(/YouTube/)
  })

  it('YouTube page sends interview shows to the podcast page', () => {
    expect(JSON.stringify(find('youtube-studio-tampa'))).toContain('/studios/podcast-studio-tampa')
  })
})
