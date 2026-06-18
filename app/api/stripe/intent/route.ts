import { NextResponse } from 'next/server'
import { createManualCaptureIntent } from '@/lib/server/stripe'
import { recomputeTotalCents } from '@/lib/server/pricing'
import { setIdToEventTypeId } from '@/lib/server/set-event-types'

export const runtime = 'nodejs'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return bad('invalid json')
  }

  const setId = String(body?.setId ?? '')
  const durationMinutes = Number(body?.durationMinutes ?? 0)
  const addonIds: string[] = Array.isArray(body?.addonIds) ? body.addonIds.map(String) : []
  const wizardSessionId = String(body?.wizardSessionId ?? '')
  const name = String(body?.contact?.name ?? '').trim()
  const email = String(body?.contact?.email ?? '').trim()

  if (setIdToEventTypeId(setId) === null) return bad('unknown setId')
  if (!Number.isFinite(durationMinutes) || durationMinutes < 90) return bad('invalid duration')
  if (!wizardSessionId) return bad('missing wizardSessionId')
  if (!name) return bad('missing name')
  if (!EMAIL.test(email)) return bad('invalid email')

  const amountCents = recomputeTotalCents({ durationMinutes, addonIds })

  try {
    const pi = await createManualCaptureIntent({
      amountCents,
      metadata: {
        setId,
        durationMinutes: String(durationMinutes),
        addonIds: addonIds.join(','),
        wizardSessionId,
        name,
        email,
      },
      idempotencyKey: wizardSessionId,
    })
    return NextResponse.json({
      clientSecret: pi.clientSecret,
      paymentIntentId: pi.id,
      amountCents: pi.amount,
    })
  } catch (e) {
    console.error('/api/stripe/intent', e)
    return bad('upstream', 502)
  }
}
