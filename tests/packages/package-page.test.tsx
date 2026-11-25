import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { PACKAGE_PAGES } from '@/lib/content/packages'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))
vi.mock('@/lib/tour-modal-context', () => ({ useTourModal: () => ({ open: vi.fn() }) }))
vi.mock('@calcom/embed-react', () => ({
  default: () => <div data-testid="cal" />,
  getCalApi: vi.fn(async () => vi.fn()),
}))

import { PackagePageView } from '@/components/packages/package-page'
import PackageRoute, { generateStaticParams, dynamicParams } from '@/app/packages/[slug]/page'
import { notFound } from 'next/navigation'
import { useDeepRead } from '@/components/packages/use-deep-read'

beforeEach(() => {
  ;(window as any).dataLayer = []
})

describe('package pages', () => {
  it.each(Object.values(PACKAGE_PAGES))('$slug renders headline and builder', (page) => {
    render(<PackagePageView page={page} />)
    expect(screen.getByRole('heading', { level: 1, name: page.headline })).toBeTruthy()
    expect(document.getElementById('build')).toBeTruthy()
    expect(screen.getAllByText('Your custom package').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: /clean/i }).length).toBeGreaterThan(0)
    // only the final CTA; no page-level sticky button over the builder's own bar
    expect(screen.getAllByRole('button', { name: /^build your package$/i })).toHaveLength(1)
  })

  it('unknown slug calls notFound; static params cover the three slugs', () => {
    expect(() => PackageRoute({ params: { slug: 'nope' } })).toThrow('NEXT_NOT_FOUND')
    expect(notFound).toHaveBeenCalled()
    expect(generateStaticParams().map((p) => p.slug).sort()).toEqual(['course', 'demo', 'vsl'])
    expect(dynamicParams).toBe(false)
  })
})

function Probe({ type }: { type: 'course' }) {
  const ref = useDeepRead(type)
  return <div ref={ref}>story</div>
}

describe('useDeepRead', () => {
  it('fires once when 75% has been scrolled past', () => {
    const rect = { top: 800, height: 1000, bottom: 1800 } as any
    Object.defineProperty(window, 'innerHeight', { value: 900, configurable: true })
    const { container } = render(<Probe type="course" />)
    container.firstElementChild!.getBoundingClientRect = () => rect
    const fired = () =>
      (window as any).dataLayer.filter((e: any) => e.event === 'package_deep_read').length
    act(() => { window.dispatchEvent(new Event('scroll')) })
    expect(fired()).toBe(0)
    rect.top = -100 // viewport bottom is 1000px into a 1000px element -> past 75%
    act(() => { window.dispatchEvent(new Event('scroll')) })
    act(() => { window.dispatchEvent(new Event('scroll')) })
    expect(fired()).toBe(1)
  })
})
