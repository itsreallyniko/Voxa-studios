import 'server-only'

export function getTourEventTypeId(): number | null {
  const raw = process.env.CAL_EVENT_TYPE_TOUR
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}
