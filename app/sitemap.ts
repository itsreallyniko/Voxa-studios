import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: '2026-11-01',
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
