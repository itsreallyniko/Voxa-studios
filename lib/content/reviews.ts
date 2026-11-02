import { REVIEWS } from './reviews-data'

export type ServiceTag = 'vsl' | 'podcast' | 'youtube' | 'course'

export type Review = {
  id: string
  quote: string
  name: string
  business?: string
  recorded: string
  source: 'google' | 'peerspace'
  sourceUrl?: string
  permissionConfirmed: boolean
  services: ServiceTag[]
}

export function usableReviews(tag?: ServiceTag): Review[] {
  return REVIEWS.filter(
    (r) => r.permissionConfirmed && (!tag || r.services.includes(tag)),
  )
}

// The two reviews on each service page, chosen by hand so the same client does
// not repeat across most pages. Captions say what each client really filmed.
const PAGE_REVIEW_IDS: Record<ServiceTag, [string, string]> = {
  vsl: ['kyle-gregory', 'alex-cooper'],
  podcast: ['david-smith', 'j-s'],
  youtube: ['alex-cooper', 'vanessa-f'],
  course: ['vanessa-f', 'kyle-gregory'],
}

export function pageReviews(tag: ServiceTag): Review[] {
  const usable = usableReviews()
  return PAGE_REVIEW_IDS[tag].flatMap((id) => usable.filter((r) => r.id === id))
}
