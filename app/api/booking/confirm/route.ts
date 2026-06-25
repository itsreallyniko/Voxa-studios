import { NextResponse } from 'next/server'
import { createBooking, localISO } from '@/lib/server/cal'
import { recomputeTotalCents } from '@/lib/server/pricing'
import { setIdToEventTypeId } from '@/lib/server/set-event-types'
import { getStripe } from '@/lib/server/stripe'

export const runtime = 'nodejs'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^\d{2}:\d{2}$/
const MIN_PHONE = 7
const MAX_PHONE = 30

function json(payload: unknown, status: number) {
  return NextResponse.json(payload, { status })
}

async function tryCancel(id: string) {
  try {
    await getStripe().paymentIntents.cancel(id)
  } catch (e) {
    console.error('cancel failed', e)
  }
}

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid json' }, 400)
  }

  const paymentIntentId = String(body?.paymentIntentId ?? '')
  const setId = String(body?.setId ?? '')
  const durationMinutes = Number(body?.durationMinutes ?? 0)
  const addonIds: string[] = Array.isArray(body?.addonIds) ? body.addonIds.map(String) : []
  const date = String(body?.schedule?.date ?? '')
  const time = String(body?.schedule?.time ?? '')
  const name = String(body?.contact?.name ?? '').trim()
  const email = String(body?.contact?.email ?? '').trim()
  const phone = String(body?.contact?.phone ?? '').trim()
  const recordingType = String(body?.details?.recordingType ?? '').trim()
  const guests = String(body?.details?.guests ?? '').trim()
  const socials = String(body?.details?.socials ?? '').trim()
  const notes = String(body?.details?.notes ?? '').trim()

  if (!paymentIntentId) return json({ error: 'missing paymentIntentId' }, 400)
  const eventTypeId = setIdToEventTypeId(setId)
  if (eventTypeId === null) return json({ error: 'unknown setId' }, 400)
  if (!Number.isFinite(durationMinutes) || durationMinutes < 90) return json({ error: 'invalid duration' }, 400)
  if (!DATE.test(date) || !TIME.test(time)) return json({ error: 'invalid schedule' }, 400)
  if (!name || !EMAIL.test(email)) return json({ error: 'invalid contact' }, 400)
  if (phone.length < MIN_PHONE || phone.length > MAX_PHONE) return json({ error: 'invalid phone' }, 400)

  const stripe = getStripe()
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
  if (pi.status !== 'requires_capture') return json({ error: 'payment not authorized' }, 400)

  const expectedCents = recomputeTotalCents({ durationMinutes, addonIds })
  if (pi.amount !== expectedCents) {
    await tryCancel(paymentIntentId)
    return json({ error: 'amount mismatch' }, 400)
  }

  const tz = process.env.STUDIO_TIMEZONE ?? 'America/New_York'
  const startISO = localISO(date, time, tz)

  // Cal.com metadata: max 50 keys, max 500 chars/value. Truncate just in case.
  const cap = (s: string) => (s.length > 480 ? s.slice(0, 477) + '...' : s)
  const metadata: Record<string, string> = { paymentIntentId, setId, phone }
  if (recordingType) metadata.recordingType = cap(recordingType)
  if (guests) metadata.guests = cap(guests)
  if (socials) metadata.socials = cap(socials)
  if (notes) metadata.notes = cap(notes)
  if (addonIds.length) metadata.addonIds = addonIds.join(',')

  const summaryLines = [
    recordingType && `Recording: ${recordingType}`,
    guests && `Guests: ${guests}`,
    socials && `Socials: ${socials}`,
    notes && `Notes: ${notes}`,
    addonIds.length && `Add-ons: ${addonIds.join(', ')}`,
  ].filter(Boolean) as string[]
  const summary = summaryLines.join('\n')

  const attempt = async () =>
    createBooking({
      eventTypeId,
      startISO,
      durationMinutes,
      attendee: { name, email, timeZone: tz },
      metadata,
      // Cal.com event types include a default 'notes' booking field; phone is
      // the custom field configured on each session event type.
      bookingFieldsResponses: {
        phone,
        ...(summary ? { notes: summary } : {}),
      },
      idempotencyKey: paymentIntentId,
    })

  let booking: { uid: string; id: number } | undefined
  try {
    booking = await attempt()
  } catch (e: any) {
    const status: number | undefined = e?.status
    if (status === 409) {
      await tryCancel(paymentIntentId)
      return json({ error: 'slot taken' }, 409)
    }
    if (typeof status === 'number' && status >= 500) {
      try {
        booking = await attempt()
      } catch (e2) {
        console.error('Cal book retry failed', e2)
        await tryCancel(paymentIntentId)
        return json({ error: 'upstream' }, 502)
      }
    } else {
      console.error('Cal book failed', e)
      await tryCancel(paymentIntentId)
      return json({ error: 'upstream' }, 502)
    }
  }

  if (!booking) {
    await tryCancel(paymentIntentId)
    return json({ error: 'upstream' }, 502)
  }

  try {
    await stripe.paymentIntents.capture(paymentIntentId)
  } catch (e) {
    console.error('capture failed after Cal booking', e)
    return json({ paid: false, bookingUid: booking.uid, bookingId: booking.id, error: 'capture_failed' }, 500)
  }

  return json({ paid: true, bookingUid: booking.uid, bookingId: booking.id }, 200)
}
