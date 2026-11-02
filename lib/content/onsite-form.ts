// DRAFT COPY — awaiting Niko's review. See handoff list at end of session.
import type { ProjectType } from './onsite/types'

export const PROJECT_TYPE_OPTIONS: { value: ProjectType; label: string }[] = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'event', label: 'Event film' },
  { value: 'interview', label: 'Interview or testimonial' },
  { value: 'brand', label: 'Brand or founder film' },
  { value: 'presentation', label: 'On-camera presentation' },
  { value: 'not-sure', label: 'Not sure yet' },
]

export const BUDGET_RANGE_OPTIONS: { value: string; label: string }[] = [
  { value: 'band-1', label: 'Under $1k' },
  { value: 'band-2', label: '$1k to $3k' },
  { value: 'band-3', label: '$3k to $5k' },
  { value: 'band-4', label: '$5k and up' },
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
