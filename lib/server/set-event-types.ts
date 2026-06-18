import 'server-only'

export type StudioSetId =
  | 'executive-podcast'
  | 'authority-desk'
  | 'authority-creator'
  | 'horizon-podcast'
  | 'horizon-desk'
  | 'horizon-creator'

export const KNOWN_SET_IDS: readonly StudioSetId[] = [
  'executive-podcast',
  'authority-desk',
  'authority-creator',
  'horizon-podcast',
  'horizon-desk',
  'horizon-creator',
] as const

const ENV_VAR: Record<StudioSetId, string> = {
  'executive-podcast': 'CAL_EVENT_TYPE_EXECUTIVE_PODCAST',
  'authority-desk': 'CAL_EVENT_TYPE_AUTHORITY_DESK',
  'authority-creator': 'CAL_EVENT_TYPE_AUTHORITY_CREATOR',
  'horizon-podcast': 'CAL_EVENT_TYPE_HORIZON_PODCAST',
  'horizon-desk': 'CAL_EVENT_TYPE_HORIZON_DESK',
  'horizon-creator': 'CAL_EVENT_TYPE_HORIZON_CREATOR',
}

export function setIdToEventTypeId(setId: string): number | null {
  if (!(KNOWN_SET_IDS as readonly string[]).includes(setId)) return null
  const raw = process.env[ENV_VAR[setId as StudioSetId]]
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}
