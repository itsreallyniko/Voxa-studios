// DRAFT COPY — awaiting Niko's review. See handoff list at end of session.
import type { ProjectType } from './onsite/types'

export const PROJECT_TYPE_OPTIONS: { value: ProjectType; label: string }[] = [
  { value: 'interview', label: 'Interview or testimonial' },
  { value: 'content-day', label: 'Content day' },
  { value: 'event', label: 'Event' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'not-sure', label: 'Not sure yet' },
]

// Placeholder bands — Niko to confirm final labels before launch.
// Kept non-numeric on purpose so the page respects the "no dollar amounts"
// rule until real bands are chosen.
export const BUDGET_RANGE_OPTIONS: { value: string; label: string }[] = [
  { value: 'band-1', label: 'Just getting started' },
  { value: 'band-2', label: 'Established budget' },
  { value: 'band-3', label: 'Significant initiative' },
  { value: 'band-4', label: 'Flagship project' },
  { value: 'not-sure', label: 'Not sure yet' },
]

export const REFERRAL_SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: 'google', label: 'Google' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'referral', label: 'Referral' },
  { value: 'event', label: 'Event' },
  { value: 'other', label: 'Other' },
]

export const INSTAGRAM_DM_URL = 'https://instagram.com/voxastudios.fl/'
export const INSTAGRAM_HANDLE = '@voxastudios.fl'

export function calOnsiteLink(): string | null {
  const v = process.env.NEXT_PUBLIC_CAL_ONSITE_LINK
  if (!v || v.trim() === '') return null
  return v.trim()
}
