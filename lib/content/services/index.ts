import { SERVICE_PAGES } from './pages'
import type { ServicePage } from './types'

export function allServices(): ServicePage[] {
  return SERVICE_PAGES
}

export function publishedServices(): ServicePage[] {
  return SERVICE_PAGES.filter((p) => p.published)
}

export function getPublishedService(slug: string): ServicePage | undefined {
  return publishedServices().find((p) => p.slug === slug)
}
