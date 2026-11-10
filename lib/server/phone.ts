import 'server-only'

// Cal.com's built-in phone booking field (slug `attendeePhoneNumber`) only
// accepts E.164 numbers. Visitors type all sorts of formats, so normalise the
// common US shapes and give up (return null) on anything we can't be sure of.
export function toE164(raw: string): string | null {
  const trimmed = raw.trim()
  const digits = trimmed.replace(/\D/g, '')
  if (trimmed.startsWith('+')) {
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null
  }
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}
