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

  it('picks the primary button by callFirst', () => {
    const first = setup(vsl)
    expect(screen.getAllByRole('button', { name: 'Reserve with deposit' }).length).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { name: 'Book a vision call' })).toBeNull()
    first.unmount()
    setup()
    fireEvent.click(screen.getByRole('button', { name: /Increase lessons/i }))
    fireEvent.click(screen.getByRole('button', { name: /Increase lessons/i }))
    expect(screen.getAllByRole('button', { name: 'Book a vision call' }).length).toBeGreaterThan(0)
  })

  it('calls onContinue with the intent', () => {
    const { onContinue } = setup(vsl)
    fireEvent.click(screen.getAllByRole('button', { name: 'Reserve with deposit' })[0])
    expect(onContinue.mock.calls[0][0].intent).toBe('deposit')
    expect(onContinue.mock.calls[0][0].quote.rangeLow).toBe(quotePackage(vsl.defaults).rangeLow)
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
      'Course · 12 lessons · 10–30 min · Edit + on-screen text · record ~6 hrs · 20 clips · ~$4,700–$5,150'
    )
  })
})
