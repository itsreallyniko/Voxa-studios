import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReviewQuotes } from '@/components/marketing/review-quotes'
import { pageReviews } from '@/lib/content/reviews'

describe('homepage reviews', () => {
  it('shows four reviews and leaves Kyle for the service pages', () => {
    render(<ReviewQuotes limit={4} />)
    for (const name of ['Alex Cooper', 'J S', 'David Smith', 'Vanessa F']) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
    expect(screen.queryByText('Kyle Gregory')).toBeNull()
  })

  it('introduces the reviews in plain words', () => {
    render(<ReviewQuotes limit={4} />)
    expect(
      screen.getByRole('heading', { name: 'A few words from some of the people who’ve filmed here' }),
    ).toBeInTheDocument()
  })
})

describe('service page reviews', () => {
  it('mixes the reviews so no client repeats on most pages', () => {
    expect(pageReviews('vsl').map((r) => r.id)).toEqual(['kyle-gregory', 'alex-cooper'])
    expect(pageReviews('podcast').map((r) => r.id)).toEqual(['david-smith', 'j-s'])
    expect(pageReviews('youtube').map((r) => r.id)).toEqual(['alex-cooper', 'vanessa-f'])
    expect(pageReviews('course').map((r) => r.id)).toEqual(['vanessa-f', 'kyle-gregory'])
  })

  it('uses a heading that suits two reviews', () => {
    render(<ReviewQuotes tag="vsl" />)
    expect(screen.getByRole('heading', { name: 'What clients say about filming here' })).toBeInTheDocument()
    expect(screen.queryByText(/A few words/)).toBeNull()
  })

  it('credits Kyle with VSLs on the VSL page', () => {
    render(<ReviewQuotes tag="vsl" />)
    expect(screen.getByText('Recorded YouTube videos and VSLs')).toBeInTheDocument()
  })
})
