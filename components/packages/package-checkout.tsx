'use client'

import { useEffect, useRef, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Input, Textarea } from '@/components/ui/input'
import { FieldError } from '@/components/ui/field-error'
import { Button } from '@/components/ui/button'
import type { PackagePage } from '@/lib/content/packages'
import type { PackageConfig, PackageQuote } from '@/lib/packages/pricing'
import { parsePackageContact } from '@/lib/packages/contact'
import { trackPackageContactSubmit, trackPackageDepositPaid } from '@/lib/tracking/packages'
import { summarizePackage } from './package-summary'
import { PackageCall } from './package-call'
import { DepositForm } from './deposit-form'
import { PackageConfirmation } from './package-confirmation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

type Step = 'contact' | 'call' | 'deposit' | 'confirmed'

/** Page helper: true when Stripe redirected back after a successful payment. */
export function confirmationFromSearchParams(
  params: Record<string, string | string[] | undefined>
): boolean {
  return params.redirect_status === 'succeeded'
}

export function depositStatusFromSearchParams(
  params: Record<string, string | string[] | undefined>
): 'succeeded' | 'processing' | null {
  const s = params.redirect_status
  return s === 'succeeded' || s === 'processing' ? s : null
}

type Props = {
  page: PackagePage
  config: PackageConfig
  quote: PackageQuote
  intent: 'call' | 'deposit'
  onBack: () => void
}

export function PackageCheckout({ page, config, quote, intent, onBack }: Props) {
  const [step, setStep] = useState<Step>('contact')
  const [paidStatus, setPaidStatus] = useState<'succeeded' | 'processing'>('succeeded')
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '', website: '' })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [deposit, setDeposit] = useState(quote.deposit)
  const [depositError, setDepositError] = useState<{ message: string; unavailable: boolean } | null>(null)
  // One id per checkout: Stripe rejects reusing an idempotency key with different params.
  const sessionId = useRef<string>('')
  if (!sessionId.current) sessionId.current = crypto.randomUUID()

  const summary = summarizePackage(page, config, quote)
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    if (step === 'deposit' && !clientSecret) void startDeposit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  async function startDeposit() {
    setDepositError(null)
    const contact = parsePackageContact(form)
    try {
      const res = await fetch('/api/packages/deposit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ config, contact, sessionId: sessionId.current }),
      })
      if (res.status === 503) {
        setDepositError({
          message: "Online deposits aren't available right now — book a vision call instead.",
          unavailable: true,
        })
        return
      }
      if (!res.ok) throw new Error(String(res.status))
      const d = (await res.json()) as { clientSecret: string; paymentIntentId: string; deposit: number }
      setClientSecret(d.clientSecret)
      setPaymentIntentId(d.paymentIntentId)
      setDeposit(d.deposit)
    } catch {
      setDepositError({
        message: "We couldn't start the deposit. Please try again in a moment.",
        unavailable: false,
      })
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const contact = parsePackageContact(form)
    if (!contact) {
      setError('Please enter your name, a valid email and a phone number.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await fetch('/api/packages/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ config, contact, website: form.website }),
      })
    } catch {
      // A failed lead POST never blocks the visitor from the next step.
    }
    trackPackageContactSubmit(page.slug, quote.rangeLow)
    setSubmitting(false)
    setStep(intent === 'deposit' ? 'deposit' : 'call')
  }

  if (step === 'call') {
    return (
      <div className="flex flex-col gap-6">
        <h3 className="text-headline-md text-white">Book your free vision call</h3>
        <PackageCall pageType={page.slug} notes={summary} />
      </div>
    )
  }

  if (step === 'confirmed') {
    return <PackageConfirmation pageType={page.slug} notes={summary} status={paidStatus} />
  }

  if (step === 'deposit') {
    return (
      <div className="flex flex-col gap-6">
        <h3 className="text-headline-md text-white">Reserve with a deposit</h3>
        {depositError && (
          <div className="flex flex-col gap-4">
            <p role="alert" className="text-body-md text-red-400">
              {depositError.message}
            </p>
            {depositError.unavailable ? (
              <Button variant="gold" size="lg" onClick={() => setStep('call')}>
                Book a vision call
              </Button>
            ) : (
              <Button variant="gold" size="lg" onClick={() => void startDeposit()}>
                Try again
              </Button>
            )}
          </div>
        )}
        {clientSecret && paymentIntentId && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#C9A96E',
                  colorBackground: '#0D0D0D',
                  colorText: '#F5F0E8',
                  colorTextSecondary: '#888888',
                  borderRadius: '6px',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                },
              },
            }}
          >
            <DepositForm
              deposit={deposit}
              onPaid={(status) => {
                if (status === 'succeeded') {
                  trackPackageDepositPaid(page.slug, {
                    value: deposit,
                    rangeLow: quote.rangeLow,
                    rangeHigh: quote.rangeHigh,
                    paymentIntentId,
                  })
                }
                setPaidStatus(status)
                setStep('confirmed')
              }}
            />
          </Elements>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {/* Honeypot — hidden from humans; filled only by bots */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={set('website')}
          />
        </label>
      </div>
      <h3 className="text-headline-md text-white">Where should we reach you?</h3>
      <p className="text-metadata text-ivory/60">{summary}</p>
      <Input label="Name" type="text" autoComplete="name" value={form.name} onChange={set('name')} required />
      <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} required />
      <Input label="Phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} required />
      <Textarea label="Notes (optional)" rows={3} value={form.notes} onChange={set('notes')} />
      <FieldError>{error}</FieldError>
      <div className="flex items-center justify-between gap-4">
        <button type="button" onClick={onBack} className="text-label-caps text-ivory/60 hover:text-heritage-gold">
          ← BACK
        </button>
        <Button type="submit" variant="gold" size="lg" disabled={submitting}>
          {submitting ? 'One moment…' : 'Continue'}
        </Button>
      </div>
    </form>
  )
}
