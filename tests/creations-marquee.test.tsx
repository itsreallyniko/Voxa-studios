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
      expect(c.src).toMatch(/^\/creations\/.+\.(jpg|png)$/)
      expect(c.alt.length).toBeGreaterThan(0)
      expect(['16:9', '9:16']).toContain(c.aspect)
      expect(c.set.length).toBeGreaterThan(0)
      expect(c.byline.length).toBeGreaterThan(0)
    }
  })

  it('renders julietteastor and mirandacohenfit as 9:16 portraits', () => {
    const portraitSrcs = creations
      .filter((c) => c.aspect === '9:16')
      .map((c) => c.src)
    expect(portraitSrcs).toEqual(
      expect.arrayContaining([
        '/creations/julietteastor.jpg',
        '/creations/mirandacohenfit.png',
      ]),
    )
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

  it('renders all six images with descriptive alt text across desktop marquee (primary + clone) and mobile carousel', () => {
    // Each unique creation renders 3x: once in the desktop primary track, once
    // in the cloned track for the seamless loop, and once in the mobile snap
    // carousel. JSDOM doesn't apply responsive CSS so both surfaces mount.
    render(<CreationsMarquee />)
    expect(screen.getAllByAltText(/Executive Creator Set/i)).toHaveLength(3 * 3)
    expect(screen.getAllByAltText(/Authority Desk/i)).toHaveLength(1 * 3)
    expect(screen.getAllByAltText(/Executive Podcast Set/i)).toHaveLength(2 * 3)
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
    // Each card renders 3x total (desktop primary + clone + mobile carousel).
    render(<CreationsMarquee />)
    expect(screen.getAllByText('EXECUTIVE CREATOR SET')).toHaveLength(3 * 3)
    expect(screen.getAllByText('AUTHORITY DESK')).toHaveLength(1 * 3)
    expect(screen.getAllByText('EXECUTIVE PODCAST SET')).toHaveLength(2 * 3)
    expect(screen.getAllByText('@mirandacohenfit')).toHaveLength(3)
    expect(screen.getAllByText('@julietteastor')).toHaveLength(3)
    expect(screen.getAllByText('Interesting Times · NYT')).toHaveLength(2 * 3)
  })
})
