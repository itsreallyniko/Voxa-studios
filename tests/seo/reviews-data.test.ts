import { describe, it, expect } from 'vitest'
import { REVIEWS } from '@/lib/content/reviews-data'
import { usableReviews } from '@/lib/content/reviews'

describe('published review quotes', () => {
  it('shows the approved reviews on the homepage', () => {
    expect(usableReviews().map((r) => r.id)).toEqual([
      'alex-cooper',
      'j-s',
      'david-smith',
      'vanessa-f',
      'kyle-gregory',
    ])
  })

  it('shows the podcast client on the podcast page', () => {
    expect(usableReviews('podcast').map((r) => r.id)).toEqual(['david-smith'])
  })

  it('shows Vanessa on the course page and Alex and Vanessa on the YouTube page', () => {
    expect(usableReviews('course').map((r) => r.id)).toEqual(['vanessa-f'])
    expect(usableReviews('youtube').map((r) => r.id)).toEqual([
      'alex-cooper',
      'vanessa-f',
      'kyle-gregory',
    ])
  })

  it('keeps quotes short enough for a compact card', () => {
    for (const r of REVIEWS) expect(r.quote.length).toBeLessThanOrEqual(170)
  })

  it('tags only Kyle as a VSL client', () => {
    expect(usableReviews('vsl').map((r) => r.id)).toEqual(['kyle-gregory'])
  })

  it('leaves out wording that promises editing on every session', () => {
    for (const r of REVIEWS) expect(r.quote).not.toMatch(/done-for-you|handle the filming/i)
  })
})
