import 'server-only'
import Stripe from 'stripe'

let _client: Stripe | null = null

export function getStripe(): Stripe {
  if (_client) return _client
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  _client = new Stripe(key)
  return _client
}

export async function createManualCaptureIntent(args: {
  amountCents: number
  metadata: Record<string, string>
  idempotencyKey: string
}): Promise<{ id: string; clientSecret: string; amount: number; status: string }> {
  const stripe = getStripe()
  const pi = await stripe.paymentIntents.create(
    {
      amount: args.amountCents,
      currency: 'usd',
      capture_method: 'manual',
      automatic_payment_methods: { enabled: true },
      metadata: args.metadata,
    },
    { idempotencyKey: args.idempotencyKey }
  )
  if (!pi.client_secret) throw new Error('Stripe returned no client_secret')
  return { id: pi.id, clientSecret: pi.client_secret, amount: pi.amount, status: pi.status }
}

export async function createDepositIntent(args: {
  amountCents: number
  metadata: Record<string, string>
  idempotencyKey: string
  receiptEmail: string
  description: string
}): Promise<{ id: string; clientSecret: string }> {
  const stripe = getStripe()
  const pi = await stripe.paymentIntents.create(
    {
      amount: args.amountCents,
      currency: 'usd',
      // Card only: Apple Pay and Google Pay come with it.
      payment_method_types: ['card'],
      receipt_email: args.receiptEmail,
      description: args.description,
      metadata: args.metadata,
    },
    { idempotencyKey: args.idempotencyKey }
  )
  if (!pi.client_secret) throw new Error('Stripe returned no client_secret')
  return { id: pi.id, clientSecret: pi.client_secret }
}
