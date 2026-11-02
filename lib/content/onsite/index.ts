import type { OnsitePage } from './types'
import { videoProductionTampa } from './pages/video-production-tampa'
import { contentDayTampa } from './pages/content-day-tampa'
import { advocacyEducationVideo } from './pages/advocacy-education-video'

export const onsitePages: OnsitePage[] = [
  videoProductionTampa,
  contentDayTampa,
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
