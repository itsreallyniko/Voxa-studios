import { describe, it, expect } from 'vitest'
import { parsePackageContact } from '@/lib/packages/contact'

const ok = { name: 'Ada', email: 'ada@example.com', phone: '8135550123', notes: '' }

describe('parsePackageContact', () => {
  it('accepts a normal contact', () => {
    expect(parsePackageContact(ok)).toEqual(ok)
  })
  it('rejects an email over 254 characters', () => {
    const long = `${'a'.repeat(250)}@example.com`
    expect(parsePackageContact({ ...ok, email: long })).toBeNull()
    const edge = `${'a'.repeat(254 - '@e.co'.length)}@e.co`
    expect(edge).toHaveLength(254)
    expect(parsePackageContact({ ...ok, email: edge })).not.toBeNull()
  })
})
