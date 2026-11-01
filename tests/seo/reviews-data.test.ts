import { describe, it, expect } from 'vitest'
import { REVIEWS } from '@/lib/content/reviews-data'
import { usableReviews } from '@/lib/content/reviews'

describe('published review quotes', () => {
  it('shows the approved reviews on the homepage', () => {
    expect(usableReviews().map((r) => r.id)).toEqual(['j-s', 'david-smith', 'vanessa-f'])
  })

  it('shows the podcast client on the podcast page', () => {
    expect(usableReviews('podcast').map((r) => r.id)).toEqual(['david-smith'])
  })

  it('shows Vanessa on the course and YouTube pages', () => {
    expect(usableReviews('course').map((r) => r.id)).toEqual(['vanessa-f'])
    expect(usableReviews('youtube').map((r) => r.id)).toEqual(['vanessa-f'])
  })

  it('keeps quotes short enough for a compact card', () => {
    for (const r of REVIEWS) expect(r.quote.length).toBeLessThanOrEqual(170)
  })

  it('claims no VSL review until a client is confirmed to have filmed one', () => {
    expect(usableReviews('vsl')).toEqual([])
  })

  it('leaves out wording that promises editing on every session', () => {
    for (const r of REVIEWS) expect(r.quote).not.toMatch(/done-for-you|handle the filming/i)
  })
})
