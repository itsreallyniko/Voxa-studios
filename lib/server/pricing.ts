import 'server-only'
import { getTotal } from '@/lib/pricing'
import { addons } from '@/lib/content/addons'

export function recomputeTotalCents(input: {
  durationMinutes: number
  addonIds: string[]
}): number {
  const r = getTotal(input, addons)
  return Math.round(r.total * 100)
}
