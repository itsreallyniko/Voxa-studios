import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingProvider, useBooking } from '@/lib/booking-context'
import { CheckoutStep } from '@/components/book/steps/checkout-step'

const stripeConfirm = vi.fn()
vi.mock('@stripe/react-stripe-js', () => {
  return {
    Elements: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    PaymentElement: () => <div data-testid="payment-element" />,
    useStripe: () => ({ confirmPayment: stripeConfirm }),
    useElements: () => ({}),
  }
})
vi.mock('@stripe/stripe-js', () => ({ loadStripe: () => Promise.resolve({}) }))

function Seed() {
  const { setBooking } = useBooking()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = (Seed as any)._
  if (!_) {
    ;(Seed as any)._ = true
    setBooking((b) => ({
      ...b,
      collectionId: 'executive',
      setId: 'executive-podcast',
      contact: { name: 'Jane', email: 'jane@example.com', phone: '+15555555555' },
      details: { ...b.details, recordingType: 'Podcast' },
      schedule: { date: '2026-06-20', time: '13:00' },
    }))
  }
  return null
}

beforeEach(() => {
  vi.restoreAllMocks()
  stripeConfirm.mockReset()
  ;(Seed as any)._ = false
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test'
})

async function setupHappyMocks() {
  global.fetch = vi.fn().mockImplementation(async (url: string) => {
    if (url.endsWith('/api/stripe/intent')) {
      return { ok: true, json: async () => ({ clientSecret: 'pi_1_secret', paymentIntentId: 'pi_1', amountCents: 30000 }) }
    }
    if (url.endsWith('/api/booking/confirm')) {
      return { ok: true, json: async () => ({ paid: true, bookingUid: 'cal_abc', bookingId: 7 }) }
    }
    throw new Error('unexpected fetch ' + url)
  }) as any
  stripeConfirm.mockResolvedValue({ paymentIntent: { id: 'pi_1', status: 'requires_capture' } })
}

describe('CheckoutStep with real flow', () => {
  it('happy path: intent → confirm → book → paid screen', async () => {
    await setupHappyMocks()
    render(
      <BookingProvider>
        <Seed />
        <CheckoutStep />
      </BookingProvider>
    )

    await waitFor(() => expect(screen.getByTestId('payment-element')).toBeInTheDocument())

    const pay = await screen.findByRole('button', { name: /pay \$/i })
    await userEvent.click(pay)

    await waitFor(() => expect(screen.getByText(/you're booked/i)).toBeInTheDocument())
    expect(stripeConfirm).toHaveBeenCalledOnce()
  })

  it('slot-taken: confirm returns 409 → error UI with retry-from-schedule', async () => {
    global.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.endsWith('/api/stripe/intent')) {
        return { ok: true, json: async () => ({ clientSecret: 'pi_1_secret', paymentIntentId: 'pi_1', amountCents: 30000 }) }
      }
      if (url.endsWith('/api/booking/confirm')) {
        return { ok: false, status: 409, json: async () => ({ error: 'slot taken' }) }
      }
      throw new Error('unexpected fetch ' + url)
    }) as any
    stripeConfirm.mockResolvedValue({ paymentIntent: { id: 'pi_1', status: 'requires_capture' } })

    render(
      <BookingProvider>
        <Seed />
        <CheckoutStep />
      </BookingProvider>
    )
    const pay = await screen.findByRole('button', { name: /pay \$/i })
    await userEvent.click(pay)
    await waitFor(() => expect(screen.getByText(/slot was just taken/i)).toBeInTheDocument())
    expect(screen.getByRole('button', { name: /pick another time/i })).toBeInTheDocument()
  })
})
