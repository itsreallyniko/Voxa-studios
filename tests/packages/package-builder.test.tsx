import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TourModalProvider } from '@/lib/tour-modal-context'
import { PackageBuilder } from '@/components/packages/package-builder'
import { summarizePackage } from '@/components/packages/package-summary'
import { PACKAGE_PAGES, SEND_FILES_NOTE } from '@/lib/content/packages'
import { quotePackage, type PackageConfig } from '@/lib/packages/pricing'

const course = PACKAGE_PAGES.course
const vsl = PACKAGE_PAGES.vsl

function setup(page = course, onContinue = vi.fn()) {
  const utils = render(
    <TourModalProvider>
      <PackageBuilder page={page} onContinue={onContinue} />
    </TourModalProvider>
  )
  return { onContinue, ...utils }
}

const money = (n: number) => `$${n.toLocaleString('en-US')}`
const range = (c: PackageConfig) => {
  const q = quotePackage(c)
  return `${money(q.rangeLow)}–${money(q.rangeHigh)}`
}
const events = (name: string) =>
  ((window as any).dataLayer as any[]).filter((e) => e.event === name)

beforeEach(() => {
  ;(window as any).dataLayer = []
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ slotsByDate: {} }) }))
  )
})

describe('PackageBuilder', () => {
  it('shows the course default range', () => {
    setup()
    expect(screen.getAllByText('$2,500–$2,750').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Your custom package').length).toBeGreaterThan(0)
  })

  it('updates the range when the level changes', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: /Full motion design/ }))
    expect(
      screen.getAllByText(range({ ...course.defaults, level: 'motion' })).length
    ).toBeGreaterThan(0)
  })

  it('drops recording when switching to existing footage', () => {
    setup()
    const plus = screen.getByRole('button', { name: /more recording time/i })
    fireEvent.click(plus)
    fireEvent.click(plus)
    expect(screen.getAllByText(/^Recording/).length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: /I already have footage/ }))
    expect(screen.queryByText(/^Recording/)).toBeNull()
    expect(
      screen.getAllByText(range({ ...course.defaults, record: false })).length
    ).toBeGreaterThan(0)
    expect(screen.getByText(SEND_FILES_NOTE)).toBeTruthy()
  })

  it('always offers Book a vision call as the primary button, never a deposit', () => {
    const first = setup(vsl)
    expect(screen.getAllByRole('button', { name: 'Book a vision call' }).length).toBeGreaterThan(0)
    expect(screen.queryByText(/deposit/i)).toBeNull()
    first.unmount()
    setup()
    fireEvent.click(screen.getByRole('button', { name: /Increase lessons/i }))
    expect(screen.getAllByRole('button', { name: 'Book a vision call' }).length).toBeGreaterThan(0)
    expect(screen.queryByText(/deposit/i)).toBeNull()
  })

  it('calls onContinue with config and quote only', () => {
    const { onContinue } = setup(vsl)
    fireEvent.click(screen.getAllByRole('button', { name: 'Book a vision call' })[0])
    const arg = onContinue.mock.calls[0][0]
    expect(Object.keys(arg).sort()).toEqual(['config', 'quote'])
    expect(arg.quote.rangeLow).toBe(quotePackage(vsl.defaults).rangeLow)
  })

  it('pushes package_builder_start once', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: /Full motion design/ }))
    fireEvent.click(screen.getByRole('button', { name: /Increase lessons/i }))
    fireEvent.click(screen.getByRole('button', { name: /I already have footage/ }))
    expect(events('package_builder_start')).toHaveLength(1)
  })

  it('tour link tracks and opens the modal', async () => {
    setup()
    fireEvent.click(screen.getAllByRole('button', { name: 'Book a free tour' })[0])
    expect(events('package_tour_click')).toHaveLength(1)
    expect(await screen.findByRole('dialog')).toBeTruthy()
  })
})

describe('builder layout and copy', () => {
  it('shows exactly one tour action in each primary mode', () => {
    const first = setup(vsl)
    expect(screen.getAllByRole('button', { name: 'Book a free tour' })).toHaveLength(1)
    first.unmount()
    setup()
    fireEvent.click(screen.getByRole('button', { name: /Increase lessons/i }))
    fireEvent.click(screen.getByRole('button', { name: /Increase lessons/i }))
    expect(screen.getAllByRole('button', { name: 'Book a free tour' })).toHaveLength(1)
  })

  it('switches aside and mobile bar at the same breakpoint', () => {
    const { container } = setup()
    const aside = container.querySelector('aside')!
    expect(aside.className).toContain('lg:block')
    expect(aside.className).not.toContain('md:')
    const bar = container.querySelector('.fixed')!
    expect(bar.className).toContain('lg:hidden')
    expect(bar.className).not.toContain('md:hidden')
  })

  it('shows billed session time on the recording line', () => {
    const config: PackageConfig = { ...course.defaults, record: true, recordMinutes: 390 }
    const { container } = setup(
      { ...course, defaults: config } as typeof course
    )
    expect(container.querySelector('aside')!.textContent).toContain('Recording · 2 sessions (5 + 1.5 hrs)')
  })

  it('shows a single session as plain hours', () => {
    const config: PackageConfig = { ...course.defaults, record: true, recordMinutes: 90 }
    const { container } = setup({ ...course, defaults: config } as typeof course)
    expect(container.querySelector('aside')!.textContent).toContain('Recording · 1.5 hrs')
  })

  it('edit level one-liners name what each level adds', () => {
    setup()
    expect(screen.getByText(/cuts, color, audio, slides or screen recording placed in/i)).toBeTruthy()
    expect(screen.getByText(/titles, lower thirds, text callouts, captions, intro\/outro/i)).toBeTruthy()
    expect(screen.getByText(/animated graphics, b-roll, zooms, music and sound design/i)).toBeTruthy()
  })
})

describe('summarizePackage', () => {
  it('formats the one-line summary', () => {
    const config: PackageConfig = {
      type: 'course',
      videos: 12,
      length: 'medium',
      level: 'text',
      record: true,
      recordMinutes: 360,
      clips: 20,
    }
    expect(summarizePackage(course, config, quotePackage(config))).toBe(
      'Course · 12 lessons · 10–30 min · Edit + on-screen text · record ~6.5 hrs · 20 clips · ~$4,700–$5,150'
    )
  })
})
