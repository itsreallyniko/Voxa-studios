import 'server-only'

function base(): string {
  return process.env.CAL_API_BASE ?? 'https://api.cal.com/v2'
}

// Cal.com v2 uses per-endpoint API versions. Slots and bookings are pinned
// independently so a version bump on one doesn't break the other.
const VERSION_SLOTS = '2024-09-04'
const VERSION_BOOKINGS = '2024-08-13'

function headers(version: string): Record<string, string> {
  const key = process.env.CAL_API_KEY
  if (!key) throw new Error('CAL_API_KEY is not set')
  return {
    Authorization: `Bearer ${key}`,
    'cal-api-version': version,
    'Content-Type': 'application/json',
  }
}

function hhmm(iso: string): string {
  // "2026-06-20T13:00:00-04:00" → "13:00"
  const t = iso.split('T')[1] ?? ''
  return t.slice(0, 5)
}

// Format the studio timezone's UTC offset for a given moment as "+HH:MM"
// or "-HH:MM" — DST aware via Intl.
function tzOffset(date: Date, tz: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'longOffset',
  }).formatToParts(date)
  const name = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT'
  const m = name.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/)
  if (!m) return '+00:00'
  const hh = m[1].padStart(3, m[1].startsWith('-') ? '-0' : '+0').slice(0, 3)
  const mm = (m[2] ?? '00').padStart(2, '0')
  return `${hh}:${mm}`
}

export function localISO(dateYmd: string, timeHm: string, tz: string): string {
  const utc = new Date(`${dateYmd}T${timeHm}:00Z`)
  return `${dateYmd}T${timeHm}:00${tzOffset(utc, tz)}`
}

export async function getSlots(args: {
  eventTypeId: number
  startISO: string
  endISO: string
  durationMinutes: number
  timeZone: string
}): Promise<{ slotsByDate: Record<string, string[]> }> {
  const params = new URLSearchParams({
    eventTypeId: String(args.eventTypeId),
    start: args.startISO,
    end: args.endISO,
    duration: String(args.durationMinutes),
    timeZone: args.timeZone,
  })
  const url = `${base()}/slots?${params.toString()}`
  const res = await fetch(url, { headers: headers(VERSION_SLOTS), method: 'GET', cache: 'no-store' })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Cal.com /slots ${res.status}: ${body}`)
  }
  const json = (await res.json()) as { data: Record<string, { start: string }[]> }
  const slotsByDate: Record<string, string[]> = {}
  for (const [date, items] of Object.entries(json.data ?? {})) {
    if (!Array.isArray(items)) continue
    slotsByDate[date] = items.map((s) => hhmm(s.start))
  }
  return { slotsByDate }
}

export async function createBooking(args: {
  eventTypeId: number
  startISO: string
  durationMinutes: number
  attendee: { name: string; email: string; timeZone: string }
  metadata?: Record<string, string>
  idempotencyKey: string
}): Promise<{ uid: string; id: number }> {
  const res = await fetch(`${base()}/bookings`, {
    method: 'POST',
    headers: { ...headers(VERSION_BOOKINGS), 'idempotency-key': args.idempotencyKey },
    body: JSON.stringify({
      eventTypeId: args.eventTypeId,
      start: args.startISO,
      lengthInMinutes: args.durationMinutes,
      attendee: args.attendee,
      metadata: args.metadata ?? {},
    }),
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    const err = new Error(`Cal.com /bookings ${res.status}: ${body}`) as Error & { status?: number }
    err.status = res.status
    throw err
  }
  const json = (await res.json()) as { data: { uid: string; id: number } }
  return { uid: json.data.uid, id: json.data.id }
}

export async function cancelBooking(uid: string, reason: string): Promise<void> {
  const res = await fetch(`${base()}/bookings/${encodeURIComponent(uid)}/cancel`, {
    method: 'POST',
    headers: headers(VERSION_BOOKINGS),
    body: JSON.stringify({ cancellationReason: reason }),
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Cal.com cancel ${res.status}: ${body}`)
  }
}
