export const SITE_URL = 'https://voxastudios.com'
export const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`

export const SAME_AS: string[] = [
  'https://instagram.com/voxastudios.fl/',
  'https://www.linkedin.com/company/voxa-studios/',
  'https://www.google.com/search?kgmid=/g/11ysvny0qr',
  'https://www.peerspace.com/pages/listings/693b578462b47a0349a047de',
]

// Serializes structured data for a <script> tag. Escaping "<" stops content
// from closing the tag early.
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
