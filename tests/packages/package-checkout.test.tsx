import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { summarizePackage, formatMoney } from '@/components/packages/package-summary'
import { PACKAGE_PAGES, DEPOSIT_TERMS } from '@/lib/content/packages'
import { quotePackage } from '@/lib/packages/pricing'

const confirmPayment = vi.fn()
vi.mock('@stripe/stripe-js', () => ({ loadStripe: vi.fn(() => Promise.resolve({})) }))
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: any) => <div>{children}</div>,
  PaymentElement: () => <div data-testid="payment-element" />,
  useStripe: () => ({ confirmPayment }),
  useElements: () => ({}),
}))
vi.mock('@calcom/embed-react', () => ({
  default: (props: any) => (
    <div data-testid="cal" data-link={props.calLink} data-notes={props.config?.notes} />
  ),
  getCalApi: vi.fn(async () => vi.fn()),
}))

import {
  PackageCheckout,
  confirmationFromSearchParams,
  depositStatusFromSearchParams,
} from '@/components/packages/package-checkout'

const page = PACKAGE_PAGES.course
const config = page.defaults
const quote = quotePackage(config)
const events = (name: string) =>
  ((window as any).dataLayer as any[]).filter((e) => e.event === name)

function fill() {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada Lovelace' } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } })
  fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '8135550123' } })
}
const submit = () => fireEvent.click(screen.getByRole('button', { name: /continue/i }))

function setup(intent: 'call' | 'deposit') {
  return render(
    <PackageCheckout page={page} config={config} quote={quote} intent={intent} onBack={vi.fn()} />
  )
}

let fetchMock: ReturnType<typeof vi.fn>
beforeEach(() => {
  ;(window as any).dataLayer = []
  confirmPayment.mockReset()
  fetchMock = vi.fn(async (url: string) => ({
    ok: true,
    status: 200,
    json: async () =>
      url.includes('deposit')
        ? { clientSecret: 'cs_x', paymentIntentId: 'pi_1', deposit: quote.deposit }
        : { quote },
  }))
  vi.stubGlobal('fetch', fetchMock)
  vi.stubEnv('NEXT_PUBLIC_CAL_PACKAGE_LINK', 'https://cal.com/voxa/vision-call')
})
afterEach(() => vi.unstubAllEnvs())

describe('PackageCheckout', () => {
  it('rejects an invalid email without calling fetch', () => {
    setup('call')
    fill()
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'nope' } })
    submit()
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('posts the lead then shows Cal with prefilled notes (call intent)', async () => {
    setup('call')
    fill()
    submit()
    const cal = await screen.findByTestId('cal')
    expect(fetchMock.mock.calls[0][0]).toBe('/api/packages/lead')
    expect(cal.getAttribute('data-link')).toBe('voxa/vision-call')
    expect(cal.getAttribute('data-notes')).toBe(summarizePackage(page, config, quote))
    expect(events('package_contact_submit')).toHaveLength(1)
  })

  it('shows fallback text and no Cal when no link is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_CAL_PACKAGE_LINK', '')
    setup('call')
    fill()
    submit()
    expect(
      await screen.findByText(/Email us at voxastudiosfl@gmail.com and we'll set up your call\./)
    ).toBeTruthy()
    expect(screen.queryByTestId('cal')).toBeNull()
  })

  it('still advances when the lead request fails', async () => {
    fetchMock.mockImplementationOnce(async () => {
      throw new Error('network')
    })
    setup('call')
    fill()
    submit()
    expect(await screen.findByTestId('cal')).toBeTruthy()
  })

  it('deposit intent shows amount and terms, and confirms on success', async () => {
    confirmPayment.mockResolvedValue({ paymentIntent: { status: 'succeeded' } })
    setup('deposit')
    fill()
    submit()
    expect(await screen.findByTestId('payment-element')).toBeTruthy()
    expect(fetchMock.mock.calls[1][0]).toBe('/api/packages/deposit')
    const body = JSON.parse(fetchMock.mock.calls[1][1].body)
    expect(typeof body.sessionId).toBe('string')
    expect(screen.getAllByText(new RegExp(formatMoney(quote.deposit).replace('$', '\\$'))).length).toBeGreaterThan(0)
    expect(screen.getByText(DEPOSIT_TERMS)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /pay/i }))
    await waitFor(() => expect(events('package_deposit_paid')).toHaveLength(1))
    expect(events('package_deposit_paid')[0].transaction_id).toBe('pi_1')
    expect(await screen.findByRole('heading', { name: 'Book your vision call' })).toBeTruthy()
  })

  it('treats a processing payment as pending, not failed', async () => {
    confirmPayment.mockResolvedValue({ paymentIntent: { status: 'processing' } })
    setup('deposit')
    fill()
    submit()
    await screen.findByTestId('payment-element')
    fireEvent.click(screen.getByRole('button', { name: /pay/i }))
    expect(await screen.findByText('PAYMENT PROCESSING')).toBeTruthy()
    expect(screen.getByText(/Your deposit is processing/)).toBeTruthy()
    expect(screen.getByTestId('cal')).toBeTruthy()
    expect(events('package_deposit_paid')).toHaveLength(0)
    expect(screen.queryByRole('button', { name: /pay/i })).toBeNull()
  })

  it('offers the call when deposits are unavailable (503)', async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.includes('deposit')
        ? { ok: false, status: 503, json: async () => ({}) }
        : { ok: true, status: 200, json: async () => ({ quote }) }
    )
    setup('deposit')
    fill()
    submit()
    expect(await screen.findByText(/Online deposits aren't available right now/)).toBeTruthy()
    expect(screen.getByRole('button', { name: /book a vision call/i })).toBeTruthy()
  })
})

describe('confirmationFromSearchParams', () => {
  it('is true only for a succeeded redirect', () => {
    expect(confirmationFromSearchParams({ redirect_status: 'succeeded' })).toBe(true)
    expect(confirmationFromSearchParams({ redirect_status: 'failed' })).toBe(false)
    expect(confirmationFromSearchParams({})).toBe(false)
  })
})

describe('depositStatusFromSearchParams', () => {
  it('maps redirect_status', () => {
    expect(depositStatusFromSearchParams({ redirect_status: 'succeeded' })).toBe('succeeded')
    expect(depositStatusFromSearchParams({ redirect_status: 'processing' })).toBe('processing')
    expect(depositStatusFromSearchParams({ redirect_status: 'failed' })).toBeNull()
  })
})
