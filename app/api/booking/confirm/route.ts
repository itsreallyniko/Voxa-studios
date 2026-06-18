import { NextResponse } from 'next/server'
import { createBooking, localISO } from '@/lib/server/cal'
import { recomputeTotalCents } from '@/lib/server/pricing'
import { setIdToEventTypeId } from '@/lib/server/set-event-types'
import { getStripe } from '@/lib/server/stripe'

export const runtime = 'nodejs'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^\d{2}:\d{2}$/

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

  if (!paymentIntentId) return json({ error: 'missing paymentIntentId' }, 400)
  const eventTypeId = setIdToEventTypeId(setId)
  if (eventTypeId === null) return json({ error: 'unknown setId' }, 400)
  if (!Number.isFinite(durationMinutes) || durationMinutes < 90) return json({ error: 'invalid duration' }, 400)
  if (!DATE.test(date) || !TIME.test(time)) return json({ error: 'invalid schedule' }, 400)
  if (!name || !EMAIL.test(email)) return json({ error: 'invalid contact' }, 400)

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

  const attempt = async () =>
    createBooking({
      eventTypeId,
      startISO,
      durationMinutes,
      attendee: { name, email, timeZone: tz },
      metadata: { wizardSessionId: paymentIntentId },
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
