import 'server-only'

function base(): string {
  return process.env.CAL_API_BASE ?? 'https://api.cal.com/v2'
}

function headers(): Record<string, string> {
  const key = process.env.CAL_API_KEY
  if (!key) throw new Error('CAL_API_KEY is not set')
  return {
    Authorization: `Bearer ${key}`,
    'cal-api-version': process.env.CAL_API_VERSION ?? '2024-09-04',
    'Content-Type': 'application/json',
  }
}

function hhmm(iso: string): string {
  // "2026-06-20T13:00:00-04:00" → "13:00"
  const t = iso.split('T')[1] ?? ''
  return t.slice(0, 5)
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
    startTime: args.startISO,
    endTime: args.endISO,
    duration: String(args.durationMinutes),
    timeZone: args.timeZone,
  })
  const url = `${base()}/slots?${params.toString()}`
  const res = await fetch(url, { headers: headers(), method: 'GET', cache: 'no-store' })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Cal.com /slots ${res.status}: ${body}`)
  }
  const json = (await res.json()) as { data: { slots: Record<string, { time: string }[]> } }
  const slotsByDate: Record<string, string[]> = {}
  for (const [date, items] of Object.entries(json.data?.slots ?? {})) {
    slotsByDate[date] = items.map((s) => hhmm(s.time))
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
    headers: { ...headers(), 'idempotency-key': args.idempotencyKey },
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
    headers: headers(),
    body: JSON.stringify({ cancellationReason: reason }),
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Cal.com cancel ${res.status}: ${body}`)
  }
}
