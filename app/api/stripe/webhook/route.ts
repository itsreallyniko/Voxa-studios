import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/server/stripe'
import { cancelBooking } from '@/lib/server/cal'
import { parsePackageConfig, quotePackage } from '@/lib/packages/pricing'
import { parsePackageContact } from '@/lib/packages/contact'
import { leadEmailConfigured, sendPackageLeadEmail } from '@/lib/server/package-lead-email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') ?? ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('STRIPE_WEBHOOK_SECRET unset')
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 })
  }
  const rawBody = await req.text()

  let event
  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig, secret)
  } catch (e) {
    console.error('webhook signature failed', e)
    return NextResponse.json({ error: 'bad signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'charge.refunded': {
        const charge = event.data.object as any
        const bookingUid = charge?.metadata?.bookingUid as string | undefined
        if (bookingUid) {
          await cancelBooking(bookingUid, 'Stripe refund issued')
        }
        break
      }
      case 'payment_intent.succeeded': {
        const pi = event.data.object as any
        if (pi?.metadata?.kind === 'package_deposit') {
          try {
            const meta = pi.metadata as Record<string, string>
            let rawConfig: unknown = null
            try {
              rawConfig = JSON.parse(meta.config ?? '')
            } catch {}
            const config = parsePackageConfig(rawConfig)
            const contact = parsePackageContact({
              name: meta.name,
              email: meta.email,
              phone: meta.phone,
              notes: meta.notes,
            })
            if (!config || !contact) {
              console.error('package deposit metadata invalid', pi.id)
            } else if (leadEmailConfigured()) {
              await sendPackageLeadEmail({
                stage: 'deposit_paid',
                contact,
                config,
                quote: quotePackage(config),
                paymentIntentId: pi.id,
              })
            } else {
              console.warn('package deposit paid but RESEND_API_KEY unset', pi.id)
            }
          } catch (e) {
            console.error('package deposit email failed', pi?.id, e instanceof Error ? e.message : e)
          }
        }
        break
      }
      case 'payment_intent.canceled':
      case 'payment_intent.amount_capturable_updated':
        break
      default:
        break
    }
  } catch (e) {
    console.error('webhook handler error', e)
  }

  return NextResponse.json({})
}
