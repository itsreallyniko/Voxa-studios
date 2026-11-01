import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

// /booking/confirmed stays crawlable on purpose: crawlers must reach the page
// to see its noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
