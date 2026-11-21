'use client'

import { useState } from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { DEPOSIT_TERMS } from '@/lib/content/packages'
import { formatMoney } from './package-summary'

export function DepositForm({
  deposit,
  onPaid,
}: {
  deposit: number
  onPaid: (status: 'succeeded' | 'processing') => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onPay = async () => {
    if (!stripe || !elements) {
      setError('Payment form not ready. Refresh and try again.')
      return
    }
    setError(null)
    setBusy(true)
    const { error: err, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })
    if (!err && paymentIntent?.status === 'processing') {
      onPaid('processing')
      return
    }
    if (err || paymentIntent?.status !== 'succeeded') {
      setError(err?.message ?? 'Payment could not be completed.')
      setBusy(false)
      return
    }
    onPaid('succeeded')
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-baseline">
        <span className="text-label-caps text-white">DEPOSIT</span>
        <span className="text-headline-md text-white tabular-nums">{formatMoney(deposit)}</span>
      </div>
      <PaymentElement />
      <p className="text-metadata text-ivory/60">{DEPOSIT_TERMS}</p>
      {error && (
        <p role="alert" className="text-metadata text-red-400">
          {error}
        </p>
      )}
      <Button variant="gold" size="lg" onClick={onPay} disabled={!stripe || busy}>
        {busy ? 'Processing…' : `Pay ${formatMoney(deposit)} deposit`}
      </Button>
      <p className="text-metadata text-ivory/30 text-center">Secured by Stripe.</p>
    </div>
  )
}
