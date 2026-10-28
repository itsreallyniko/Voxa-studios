import type { OnsitePage } from './types'
import { testimonialVideosTampa } from './pages/testimonial-videos-tampa'
import { eventVideoTampa } from './pages/event-video-tampa'
import { advocacyEducationVideo } from './pages/advocacy-education-video'

export const onsitePages: OnsitePage[] = [
  testimonialVideosTampa,
  eventVideoTampa,
  advocacyEducationVideo,
]

export function publishedPages(): OnsitePage[] {
  return onsitePages.filter((p) => !p.draft)
}

export function getPage(slug: string): OnsitePage | undefined {
  return onsitePages.find((p) => p.slug === slug)
}

export function isPublishedSlug(slug: string): boolean {
  const p = getPage(slug)
  return Boolean(p && !p.draft)
}

export type { OnsitePage } from './types'
