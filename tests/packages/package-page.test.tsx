import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { PACKAGE_PAGES } from '@/lib/content/packages'

let search = ''
const replace = vi.fn()
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(search),
  useRouter: () => ({ replace }),
  usePathname: () => '/packages/course',
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
  replace.mockReset()
  sessionStorage.clear()
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

  it('renders confirmation instead of the builder on a redirect return and cleans the URL', () => {
    search = 'redirect_status=succeeded&payment_intent=pi_9'
    render(<PackagePageView page={PACKAGE_PAGES.course} />)
    expect(screen.getByText(/deposit received/i)).toBeTruthy()
    expect(replace).toHaveBeenCalledWith('/packages/course', { scroll: false })
    // nothing remembered for this intent: no event, never a zero-value one
    expect((window as any).dataLayer.some((e: any) => e.event === 'package_deposit_paid')).toBe(false)
  })

  it('fires package_deposit_paid once per payment intent on a succeeded return', () => {
    sessionStorage.setItem(
      'voxa:pkg-deposit:pi_9',
      JSON.stringify({ value: 750, rangeLow: 2500, rangeHigh: 2750 })
    )
    search = 'redirect_status=succeeded&payment_intent=pi_9'
    const first = render(<PackagePageView page={PACKAGE_PAGES.course} />)
    const paid = () =>
      (window as any).dataLayer.filter((e: any) => e.event === 'package_deposit_paid')
    expect(paid()).toHaveLength(1)
    expect(paid()[0]).toMatchObject({
      value: 750,
      range_low: 2500,
      range_high: 2750,
      transaction_id: 'pi_9',
      currency: 'USD',
      page_type: 'course',
    })
    first.unmount()
    render(<PackagePageView page={PACKAGE_PAGES.course} />)
    expect(paid()).toHaveLength(1)
  })

  it('does not track a processing return', () => {
    sessionStorage.setItem(
      'voxa:pkg-deposit:pi_9',
      JSON.stringify({ value: 750, rangeLow: 2500, rangeHigh: 2750 })
    )
    search = 'redirect_status=processing&payment_intent=pi_9'
    render(<PackagePageView page={PACKAGE_PAGES.course} />)
    expect((window as any).dataLayer.some((e: any) => e.event === 'package_deposit_paid')).toBe(false)
  })

  it('shows the builder with a message after a failed payment return', () => {
    search = 'redirect_status=failed&payment_intent=pi_9'
    render(<PackagePageView page={PACKAGE_PAGES.course} />)
    expect(
      screen.getByText("Your payment didn't go through. You can try again or book a vision call.")
    ).toBeTruthy()
    expect(screen.getAllByText('Your custom package').length).toBeGreaterThan(0)
    expect(replace).toHaveBeenCalledWith('/packages/course', { scroll: false })
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
