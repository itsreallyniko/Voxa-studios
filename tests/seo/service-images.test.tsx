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
