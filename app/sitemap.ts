import type { MetadataRoute } from 'next'
import { publishedServices } from '@/lib/content/services'
import { SITE_URL } from '@/lib/seo/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: '2026-11-01',
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...publishedServices().map((p) => ({
      url: `${SITE_URL}/studios/${p.slug}`,
      lastModified: p.lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
