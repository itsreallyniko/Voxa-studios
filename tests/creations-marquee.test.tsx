import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { creations } from '@/components/marketing/creations-data'
import { CreationsMarquee } from '@/components/marketing/creations-marquee'

describe('creations data', () => {
  it('contains six entries', () => {
    expect(creations).toHaveLength(6)
  })

  it('every entry has src under /creations/, alt, aspect, set, byline', () => {
    for (const c of creations) {
      expect(c.src).toMatch(/^\/creations\/.+\.jpg$/)
      expect(c.alt.length).toBeGreaterThan(0)
      expect(['16:9', '9:16']).toContain(c.aspect)
      expect(c.set.length).toBeGreaterThan(0)
      expect(c.byline.length).toBeGreaterThan(0)
    }
  })

  it('exposes the one 9:16 portrait (julietteastor)', () => {
    const portraits = creations.filter((c) => c.aspect === '9:16')
    expect(portraits).toHaveLength(1)
    expect(portraits[0].src).toContain('julietteastor')
  })

  it('groups three creators under EXECUTIVE CREATOR SET', () => {
    const creators = creations.filter((c) => c.set === 'EXECUTIVE CREATOR SET')
    expect(creators).toHaveLength(3)
  })
})

describe('CreationsMarquee', () => {
  it('renders the section heading', () => {
    render(<CreationsMarquee />)
    expect(
      screen.getByRole('heading', { name: /see what gets created here/i }),
    ).toBeInTheDocument()
  })

  it('renders all six images with descriptive alt text, duplicated for the loop', () => {
    render(<CreationsMarquee />)
    expect(screen.getAllByAltText(/Executive Creator Set/i)).toHaveLength(3 * 2)
    expect(screen.getAllByAltText(/Authority Desk/i)).toHaveLength(1 * 2)
    expect(screen.getAllByAltText(/Executive Podcast Set/i)).toHaveLength(2 * 2)
  })

  it('renders two track halves: one visible, one aria-hidden for the loop', () => {
    const { container } = render(<CreationsMarquee />)
    const primary = container.querySelector('[data-marquee-half="primary"]')
    const clone = container.querySelector('[data-marquee-half="clone"]')
    expect(primary).not.toBeNull()
    expect(clone).not.toBeNull()
    expect(clone?.getAttribute('aria-hidden')).toBe('true')
    expect(within(primary as HTMLElement).getAllByRole('img')).toHaveLength(6)
    expect(
      within(clone as HTMLElement).getAllByRole('img', { hidden: true }),
    ).toHaveLength(6)
  })

  it('shows the set name and byline for each unique creation', () => {
    render(<CreationsMarquee />)
    expect(screen.getAllByText('EXECUTIVE CREATOR SET')).toHaveLength(3 * 2)
    expect(screen.getAllByText('AUTHORITY DESK')).toHaveLength(1 * 2)
    expect(screen.getAllByText('EXECUTIVE PODCAST SET')).toHaveLength(2 * 2)
    expect(screen.getAllByText('@mirandacohenfit')).toHaveLength(2)
    expect(screen.getAllByText('@julietteastor')).toHaveLength(2)
    expect(screen.getAllByText('Interesting Times · NYT')).toHaveLength(2 * 2)
  })
})
