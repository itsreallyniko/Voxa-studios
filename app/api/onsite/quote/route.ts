// TODO(onsite): backend delivery not yet wired. Pick webhook / Resend / Formspree /
// Google Sheets; see /Users/nikotorres/.claude/plans/eventual-tumbling-dijkstra.md.
// Until wired, this route validates + rate-limits and logs the payload server-side
// so the UI works end-to-end but leads do not actually ship anywhere.
import { NextResponse } from 'next/server'
import { check, ipFromRequest } from '@/lib/server/rate-limit'

export const runtime = 'nodejs'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME = 120
const MAX_COMPANY = 160
const MAX_CITY = 120
const MIN_PHONE = 7
const MAX_PHONE = 30
const MAX_MESSAGE = 2000

const PROJECT_TYPES = new Set([
  'interview',
  'content-day',
  'event',
  'commercial',
  'not-sure',
])
const BUDGET_VALUES = new Set(['band-1', 'band-2', 'band-3', 'band-4', 'not-sure'])
const REFERRAL_VALUES = new Set([
  'google',
  'instagram',
  'referral',
  'event',
  'other',
])

function json(payload: unknown, status: number) {
  return NextResponse.json(payload, { status })
}

export async function POST(req: Request) {
  const rl = check(ipFromRequest(req), 'onsite/quote')
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'rate limited' },
      {
        status: 429,
        headers: { 'retry-after': Math.ceil(rl.retryAfterMs / 1000).toString() },
      }
    )
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid json' }, 400)
  }

  // Honeypot: if filled, pretend success (don't tip off bots).
  if (typeof body?.website === 'string' && body.website.trim() !== '') {
    return json({ ok: true }, 200)
  }

  const name = String(body?.name ?? '').trim()
  const email = String(body?.email ?? '').trim()
  const phone = String(body?.phone ?? '').trim()
  const company = String(body?.company ?? '').trim()
  const projectType = String(body?.projectType ?? '').trim()
  const budgetRange = String(body?.budgetRange ?? '').trim()
  const shootDate = String(body?.shootDate ?? '').trim()
  const locationCity = String(body?.locationCity ?? '').trim()
  const referralSource = String(body?.referralSource ?? '').trim()
  const message = String(body?.message ?? '').trim()
  const pageSlug = String(body?.pageSlug ?? 'hub').trim().slice(0, 80)

  if (!name || name.length > MAX_NAME) return json({ error: 'invalid name' }, 400)
  if (!EMAIL.test(email)) return json({ error: 'invalid email' }, 400)
  if (phone.length < MIN_PHONE || phone.length > MAX_PHONE)
    return json({ error: 'invalid phone' }, 400)
  if (!company || company.length > MAX_COMPANY)
    return json({ error: 'invalid company' }, 400)
  if (!PROJECT_TYPES.has(projectType))
    return json({ error: 'invalid projectType' }, 400)
  if (!BUDGET_VALUES.has(budgetRange))
    return json({ error: 'invalid budgetRange' }, 400)
  if (!locationCity || locationCity.length > MAX_CITY)
    return json({ error: 'invalid locationCity' }, 400)
  if (!REFERRAL_VALUES.has(referralSource))
    return json({ error: 'invalid referralSource' }, 400)
  if (message.length > MAX_MESSAGE)
    return json({ error: 'invalid message' }, 400)

  const payload = {
    name,
    email,
    phone,
    company,
    projectType,
    budgetRange,
    shootDate,
    locationCity,
    referralSource,
    message,
    pageSlug,
    receivedAt: new Date().toISOString(),
  }

  // eslint-disable-next-line no-console
  console.info('[onsite-quote] lead received (delivery backend not yet wired):', payload)

  return json({ ok: true }, 200)
}
