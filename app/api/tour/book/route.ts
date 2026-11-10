import { NextResponse } from 'next/server'
import { createBooking, localISO } from '@/lib/server/cal'
import { getTourEventTypeId } from '@/lib/server/tour-event-type'
import { check, ipFromRequest } from '@/lib/server/rate-limit'
import { toE164 } from '@/lib/server/phone'
import { collections } from '@/lib/content/collections'

export const runtime = 'nodejs'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^\d{2}:\d{2}$/
const TOUR_DURATION_MINUTES = 15
const MIN_PHONE = 7
const MAX_PHONE = 30
const MAX_NAME = 120
const NOT_SURE = 'not-sure'

const SET_NAMES: Record<string, string> = Object.fromEntries(
  collections.flatMap((c) => c.sets.map((s) => [s.id, s.name] as const))
)

function json(payload: unknown, status: number) {
  return NextResponse.json(payload, { status })
}

export async function POST(req: Request) {
  const rl = check(ipFromRequest(req), 'tour/book')
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'rate limited' },
      { status: 429, headers: { 'retry-after': Math.ceil(rl.retryAfterMs / 1000).toString() } }
    )
  }

  const eventTypeId = getTourEventTypeId()
  if (eventTypeId === null) return json({ error: 'tour_not_configured' }, 503)

  let body: any
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid json' }, 400)
  }

  const name = String(body?.name ?? '').trim()
  const email = String(body?.email ?? '').trim()
  const phone = String(body?.phone ?? '').trim()
  const date = String(body?.date ?? '')
  const time = String(body?.time ?? '')
  const rawSets: unknown[] = Array.isArray(body?.interestedSets) ? body.interestedSets : []
  const interestedSets = Array.from(new Set(rawSets.map(String))).filter(
    (id) => id === NOT_SURE || id in SET_NAMES
  )

  if (!name || name.length > MAX_NAME) return json({ error: 'invalid name' }, 400)
  if (!EMAIL.test(email)) return json({ error: 'invalid email' }, 400)
  if (phone.length < MIN_PHONE || phone.length > MAX_PHONE) return json({ error: 'invalid phone' }, 400)
  if (!DATE.test(date)) return json({ error: 'invalid date' }, 400)
  if (!TIME.test(time)) return json({ error: 'invalid time' }, 400)

  const tz = process.env.STUDIO_TIMEZONE ?? 'America/New_York'
  const startISO = localISO(date, time, tz)
  const idempotencyKey = `tour:${email}:${date}:${time}`

  const interestLabel = interestedSets.length
    ? interestedSets.map((id) => (id === NOT_SURE ? 'Not sure yet' : SET_NAMES[id])).join(', ')
    : 'Not specified'
  const notes = [`Interested in: ${interestLabel}`, `Phone: ${phone}`].join('\n')

  // Cal.com's built-in phone field is `attendeePhoneNumber` and must be E.164.
  // The raw number also goes into notes so it's visible even if Cal rejects it.
  const e164 = toE164(phone)
  const attempt = (withPhoneField = true) =>
    createBooking({
      eventTypeId,
      startISO,
      attendee: { name, email, timeZone: tz },
      metadata: interestedSets.length ? { interestedSets: interestedSets.join(',') } : {},
      bookingFieldsResponses: {
        ...(withPhoneField && e164 ? { attendeePhoneNumber: e164 } : {}),
        notes,
      },
      idempotencyKey,
    })

  let booking: { uid: string; id: number } | undefined
  try {
    booking = await attempt().catch((e: any) => {
      if (e?.status === 400 && e164) return attempt(false)
      throw e
    })
  } catch (e: any) {
    const status: number | undefined = e?.status
    if (status === 409) return json({ error: 'slot_taken' }, 409)
    if (typeof status === 'number' && status >= 500) {
      try {
        booking = await attempt()
      } catch (e2) {
        console.error('tour book retry failed', e2)
        return json({ error: 'upstream' }, 502)
      }
    } else {
      console.error('tour book failed', e)
      return json({ error: 'upstream' }, 502)
    }
  }

  if (!booking) return json({ error: 'upstream' }, 502)
  return json({ uid: booking.uid, startISO, durationMinutes: TOUR_DURATION_MINUTES }, 200)
}
