import { REVIEWS } from './reviews-data'

export type ServiceTag = 'vsl' | 'podcast' | 'course'

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
