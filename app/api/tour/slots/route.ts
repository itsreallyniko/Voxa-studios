import { NextResponse } from 'next/server'
import { getSlots } from '@/lib/server/cal'
import { getTourEventTypeId } from '@/lib/server/tour-event-type'
import { check, ipFromRequest } from '@/lib/server/rate-limit'

export const runtime = 'nodejs'

const ONE_DAY_MS = 86_400_000
const MAX_RANGE_DAYS = 60
const TOUR_DURATION_MINUTES = 15

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(req: Request) {
  const rl = check(ipFromRequest(req), 'tour/slots')
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'rate limited' },
      { status: 429, headers: { 'retry-after': Math.ceil(rl.retryAfterMs / 1000).toString() } }
    )
  }

  const eventTypeId = getTourEventTypeId()
  if (eventTypeId === null) return bad('tour_not_configured', 503)

  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start') ?? ''
  const end = searchParams.get('end') ?? ''

  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) return bad('invalid date')

  const startMs = Date.parse(`${start}T00:00:00Z`)
  const endMs = Date.parse(`${end}T23:59:59Z`)
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return bad('invalid range')
  if (endMs - startMs > MAX_RANGE_DAYS * ONE_DAY_MS) return bad('range too large')

  const tz = process.env.STUDIO_TIMEZONE ?? 'America/New_York'
  try {
    const r = await getSlots({
      eventTypeId,
      startISO: `${start}T00:00:00.000Z`,
      endISO: `${end}T23:59:59.999Z`,
      durationMinutes: TOUR_DURATION_MINUTES,
      timeZone: tz,
    })
    return NextResponse.json(r)
  } catch (e) {
    console.error('/api/tour/slots', e)
    return bad('upstream', 502)
  }
}
