import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { FAQ } from '@/components/marketing/faq'
import { allServices } from '@/lib/content/services'
import { EXTRA_INCREMENT_PRICE } from '@/lib/pricing'

const price = `$${EXTRA_INCREMENT_PRICE} each`

describe('extension price in copy', () => {
  it('homepage FAQ matches what checkout charges', () => {
    const { container } = render(<FAQ />)
    expect(container.textContent).toContain(`30-minute increments at ${price}`)
  })

  it.each(allServices())('$slug matches what checkout charges', (page) => {
    const text = JSON.stringify(page)
    expect(text).toContain(`30-minute increments at ${price}`)
    expect(text).not.toContain('$50')
  })
})

describe('podcast page photos', () => {
  it('leads with the wide Horizon photo, then the wide Executive photo', () => {
    const page = allServices().find((p) => p.slug === 'podcast-studio-tampa')!
    expect(page.images[0].src).toBe('/horizon/Gallery Images Podcast/Horizon_Podcast_Horizontal-4.jpg')
    expect(page.images[1].src).toBe('/executive/Gallery Images Podcast/Preview_Podcast.JPG')
    expect(page.images[1].wide).toBe(true)
  })
})
