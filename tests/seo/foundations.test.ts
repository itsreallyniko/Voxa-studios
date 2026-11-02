import { describe, it, expect } from 'vitest'
import sitemap from '@/app/sitemap'
import robots from '@/app/robots'
import { SITE_URL, SAME_AS, LOCAL_BUSINESS_ID, jsonLd } from '@/lib/seo/site'

describe('crawl foundations', () => {
  it('sitemap lists the homepage and never /book, /booking or /onsite', () => {
    const urls = sitemap().map((e) => e.url)
    expect(urls).toContain(SITE_URL)
    expect(urls.some((u) => /\/(book|booking|onsite)(\/|$)/.test(u))).toBe(false)
  })

  it('robots allows crawling, blocks /api/, links the sitemap', () => {
    const r = robots()
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules
    expect(rule).toMatchObject({ userAgent: '*', allow: '/', disallow: '/api/' })
    expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
  })

  it('jsonLd escapes < so content cannot close the script tag', () => {
    expect(jsonLd({ a: '</script>' })).not.toContain('<')
    expect(JSON.parse(jsonLd({ a: '</script>' }))).toEqual({ a: '</script>' })
  })

  it('SAME_AS holds only valid unique https URLs', () => {
    expect(new Set(SAME_AS).size).toBe(SAME_AS.length)
    for (const u of SAME_AS) expect(u).toMatch(/^https:\/\//)
  })

  it('SAME_AS links the Google profile and Peerspace listing', () => {
    expect(SAME_AS).toContain('https://www.google.com/search?kgmid=/g/11ysvny0qr')
    expect(SAME_AS).toContain('https://www.peerspace.com/pages/listings/693b578462b47a0349a047de')
  })

  it('business id is anchored to the site', () => {
    expect(LOCAL_BUSINESS_ID).toBe(`${SITE_URL}/#localbusiness`)
  })
})
