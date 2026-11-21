import { NextResponse } from 'next/server'
import { check, ipFromRequest } from '@/lib/server/rate-limit'
import { parsePackageConfig, quotePackage } from '@/lib/packages/pricing'
import { parsePackageContact } from '@/lib/packages/contact'
import { leadEmailConfigured, sendPackageLeadEmail } from '@/lib/server/package-lead-email'

export const runtime = 'nodejs'

function json(payload: unknown, status: number) {
  return NextResponse.json(payload, { status })
}

export async function POST(req: Request) {
  const rl = check(ipFromRequest(req), 'packages/lead', { limit: 5, windowMs: 60_000 })
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

  if (typeof body?.website === 'string' && body.website.trim() !== '') {
    return json({ ok: true }, 200)
  }

  const config = parsePackageConfig(body?.config)
  if (!config) return json({ error: 'invalid config' }, 400)
  const contact = parsePackageContact(body?.contact)
  if (!contact) return json({ error: 'invalid contact' }, 400)

  const quote = quotePackage(config)

  if (leadEmailConfigured()) {
    try {
      await sendPackageLeadEmail({ contact, config, quote })
    } catch (err) {
      console.error('[packages-lead] lead email failed:', err instanceof Error ? err.message : err)
    }
  } else {
    console.info('[packages-lead] RESEND_API_KEY not set, lead not emailed')
  }

  return json({ quote }, 200)
}
