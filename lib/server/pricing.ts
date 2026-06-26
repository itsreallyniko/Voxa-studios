import 'server-only'
import { getTotal } from '@/lib/pricing'
import { addonsForSet } from '@/lib/content/addons'

export function recomputeTotalCents(input: {
  durationMinutes: number
  addonIds: string[]
  setId?: string | null
}): number {
  const allowed = addonsForSet(input.setId ?? null)
  const allowedIds = new Set(allowed.map((a) => a.id))
  const filteredAddonIds = input.addonIds.filter((id) => allowedIds.has(id))
  const r = getTotal({ durationMinutes: input.durationMinutes, addonIds: filteredAddonIds }, allowed)
  return Math.round(r.total * 100)
}
