import { NextResponse } from 'next/server'
import { getSlots } from '@/lib/server/cal'
import { setIdToEventTypeId } from '@/lib/server/set-event-types'
import { check, ipFromRequest } from '@/lib/server/rate-limit'

export const runtime = 'nodejs'

const ONE_DAY_MS = 86_400_000
const MAX_RANGE_DAYS = 60
const MIN_DURATION = 90

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(req: Request) {
  const rl = check(ipFromRequest(req), 'cal/slots')
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'rate limited' },
      { status: 429, headers: { 'retry-after': Math.ceil(rl.retryAfterMs / 1000).toString() } }
    )
  }
  const { searchParams } = new URL(req.url)
  const setId = searchParams.get('setId') ?? ''
  const start = searchParams.get('start') ?? ''
  const end = searchParams.get('end') ?? ''
  const duration = Number(searchParams.get('duration') ?? '0')

  const eventTypeId = setIdToEventTypeId(setId)
  if (eventTypeId === null) return bad('unknown setId')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) return bad('invalid date')
  if (!Number.isFinite(duration) || duration < MIN_DURATION) return bad('invalid duration')

  const startMs = Date.parse(`${start}T00:00:00Z`)
  const endMs = Date.parse(`${end}T23:59:59Z`)
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return bad('invalid range')
  if (endMs - startMs > MAX_RANGE_DAYS * ONE_DAY_MS) return bad('range too large')

  const tz = process.env.STUDIO_TIMEZONE ?? 'America/New_York'
  try {
    const r = await getSlots({
      eventTypeId,
      startISO: `${start}T00:00:00`,
      endISO: `${end}T23:59:59`,
      durationMinutes: duration,
      timeZone: tz,
    })
    return NextResponse.json(r)
  } catch (e) {
    console.error('/api/cal/slots', e)
    return bad('upstream', 502)
  }
}
