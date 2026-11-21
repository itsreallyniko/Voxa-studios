import { NextResponse } from 'next/server'
import { check, ipFromRequest } from '@/lib/server/rate-limit'
import { parsePackageConfig, quotePackage } from '@/lib/packages/pricing'
import { parsePackageContact } from '@/lib/packages/contact'
import { createDepositIntent } from '@/lib/server/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function json(payload: unknown, status: number) {
  return NextResponse.json(payload, { status })
}

export async function POST(req: Request) {
  const rl = check(ipFromRequest(req), 'packages/deposit', { limit: 5, windowMs: 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'rate limited' },
      { status: 429, headers: { 'retry-after': Math.ceil(rl.retryAfterMs / 1000).toString() } }
    )
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid json' }, 400)
  }

  const config = parsePackageConfig(body?.config)
  if (!config) return json({ error: 'invalid config' }, 400)
  const contact = parsePackageContact(body?.contact)
  if (!contact) return json({ error: 'invalid contact' }, 400)
  const sessionId = typeof body?.sessionId === 'string' ? body.sessionId.trim() : ''
  if (!sessionId || sessionId.length > 100) return json({ error: 'invalid sessionId' }, 400)

  if (!process.env.STRIPE_SECRET_KEY) {
    return json({ error: 'payments_not_configured' }, 503)
  }

  // Amount is always recomputed here; any client-sent price is ignored.
  const quote = quotePackage(config)

  try {
    const intent = await createDepositIntent({
      amountCents: quote.deposit * 100,
      metadata: {
        kind: 'package_deposit',
        config: JSON.stringify(config),
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        notes: contact.notes.slice(0, 450),
        rangeLow: String(quote.rangeLow),
        rangeHigh: String(quote.rangeHigh),
      },
      idempotencyKey: `package-deposit:${sessionId}`,
      receiptEmail: contact.email,
      description: `Voxa package deposit (${config.type})`,
    })
    return json(
      { clientSecret: intent.clientSecret, paymentIntentId: intent.id, deposit: quote.deposit },
      200
    )
  } catch (err) {
    console.error('[packages-deposit] intent failed:', err instanceof Error ? err.message : err)
    return json({ error: 'payment_failed' }, 502)
  }
}
