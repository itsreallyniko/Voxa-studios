import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/lib/content/reviews-data', () => ({
  REVIEWS: [
    {
      id: 'ok',
      quote: 'The teleprompter made it easy.',
      name: 'Sam',
      business: 'Sam Coaching',
      recorded: 'a VSL',
      source: 'google',
      sourceUrl: 'https://example.com/review',
      permissionConfirmed: true,
      services: ['vsl'],
    },
    {
      id: 'no-permission',
      quote: 'Private quote.',
      name: 'Alex',
      recorded: 'a podcast',
      source: 'peerspace',
      permissionConfirmed: false,
      services: ['vsl', 'podcast'],
    },
  ],
}))

import { usableReviews } from '@/lib/content/reviews'
import { ReviewQuotes } from '@/components/marketing/review-quotes'

describe('review quotes', () => {
  it('drops reviews without permission', () => {
    expect(usableReviews().map((r) => r.id)).toEqual(['ok'])
  })

  it('filters by service', () => {
    expect(usableReviews('vsl').map((r) => r.id)).toEqual(['ok'])
    expect(usableReviews('podcast')).toEqual([])
  })

  it('never renders a quote without permission', () => {
    render(<ReviewQuotes />)
    expect(screen.getByText(/teleprompter made it easy/)).toBeInTheDocument()
    expect(screen.queryByText(/Private quote/)).toBeNull()
  })

  it('renders nothing with no usable reviews', () => {
    const { container } = render(<ReviewQuotes tag="course" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('adds no star markup', () => {
    const { container } = render(<ReviewQuotes />)
    expect(container.innerHTML).not.toMatch(/aggregateRating|"review"/i)
  })
})
