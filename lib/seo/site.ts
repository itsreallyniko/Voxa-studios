export const SITE_URL = 'https://voxastudios.com'
export const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`

export const SAME_AS: string[] = [
  'https://instagram.com/voxastudios.fl/',
  'https://www.linkedin.com/company/voxa-studios/',
]

// Serializes structured data for a <script> tag. Escaping "<" stops content
// from closing the tag early.
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
