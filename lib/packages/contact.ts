export type PackageContact = { name: string; email: string; phone: string; notes: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME = 120
const MIN_PHONE = 7
const MAX_PHONE = 30
const MAX_NOTES = 2000

export function parsePackageContact(raw: unknown): PackageContact | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : v == null ? '' : null)
  const name = str(r.name)
  const email = str(r.email)
  const phone = str(r.phone)
  const notes = str(r.notes)
  if (name === null || email === null || phone === null || notes === null) return null
  if (!name || name.length > MAX_NAME) return null
  if (!EMAIL.test(email)) return null
  if (phone.length < MIN_PHONE || phone.length > MAX_PHONE) return null
  if (notes.length > MAX_NOTES) return null
  return { name, email, phone, notes }
}
