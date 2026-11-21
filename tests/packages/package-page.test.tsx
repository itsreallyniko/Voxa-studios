import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { PACKAGE_PAGES } from '@/lib/content/packages'

let search = ''
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(search),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))
vi.mock('@/lib/tour-modal-context', () => ({ useTourModal: () => ({ open: vi.fn() }) }))
vi.mock('@stripe/stripe-js', () => ({ loadStripe: vi.fn(() => Promise.resolve({})) }))
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: any) => <div>{children}</div>,
  PaymentElement: () => <div />,
  useStripe: () => ({}),
  useElements: () => ({}),
}))
vi.mock('@calcom/embed-react', () => ({
  default: () => <div data-testid="cal" />,
  getCalApi: vi.fn(async () => vi.fn()),
}))

import { PackagePageView } from '@/components/packages/package-page'
import PackageRoute, { generateStaticParams, dynamicParams } from '@/app/packages/[slug]/page'
import { notFound } from 'next/navigation'
import { useDeepRead } from '@/components/packages/use-deep-read'

beforeEach(() => {
  search = ''
  ;(window as any).dataLayer = []
})

describe('package pages', () => {
  it.each(Object.values(PACKAGE_PAGES))('$slug renders headline and builder', (page) => {
    render(<PackagePageView page={page} />)
    expect(screen.getByRole('heading', { level: 1, name: page.headline })).toBeTruthy()
    expect(document.getElementById('build')).toBeTruthy()
    expect(screen.getAllByRole('button', { name: /build your package/i }).length).toBeGreaterThan(0)
  })

  it('renders confirmation instead of the builder on a redirect return', () => {
    search = 'redirect_status=succeeded'
    render(<PackagePageView page={PACKAGE_PAGES.course} />)
    expect(screen.getByText(/deposit received/i)).toBeTruthy()
    expect((window as any).dataLayer.some((e: any) => e.event === 'package_deposit_paid')).toBe(false)
  })

  it('shows processing confirmation', () => {
    search = 'redirect_status=processing'
    render(<PackagePageView page={PACKAGE_PAGES.vsl} />)
    expect(screen.getByText(/payment processing/i)).toBeTruthy()
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
