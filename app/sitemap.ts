import type { MetadataRoute } from 'next'
import { publishedPages } from '@/lib/content/onsite'

const SITE_URL = 'https://voxastudios.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const onsite = publishedPages().map((p) => ({
    url: `${SITE_URL}/onsite/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/onsite`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/onsite/work`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...onsite,
  ]
}
