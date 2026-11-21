import { describe, it, expect } from 'vitest'
import { EDIT_GRID, suggestRecordMinutes, splitSessions, quotePackage, parsePackageConfig } from '@/lib/packages/pricing'

const course = { type: 'course', videos: 12, length: 'medium', level: 'text', record: true, recordMinutes: null, clips: 20 } as const

describe('pricing engine', () => {
  it('grid matches the spec', () => {
    expect(EDIT_GRID).toEqual({
      short: { clean: 75, text: 125, motion: 200 },
      medium: { clean: 150, text: 250, motion: 400 },
      long: { clean: 250, text: 400, motion: 600 },
    })
  })
  it('suggests recording time, rounded up to 30, minimum 90', () => {
    expect(suggestRecordMinutes(12, 'medium')).toBe(360)
    expect(suggestRecordMinutes(1, 'short')).toBe(90)
  })
  it('splits into 5-hour sessions with a final session of at least 90 min', () => {
    expect(splitSessions(600)).toEqual([300, 300])
    expect(splitSessions(360)).toEqual([300, 90])
    expect(splitSessions(330)).toEqual([300, 90])
    expect(splitSessions(120)).toEqual([120])
    expect(splitSessions(0)).toEqual([])
  })
  it('prices the spec worked example', () => {
    const q = quotePackage(course)
    expect(q.editing).toBe(3000)
    expect(q.sessions).toEqual([300, 90])
    expect(q.recording).toBe(1300)
    expect(q.clips).toBe(400)
    expect(q.total).toBe(4700)
    expect(q.rangeLow).toBe(4700)
    expect(q.rangeHigh).toBe(5150)
    expect(q.deposit).toBe(1410)
    expect(q.callFirst).toBe(true)
    expect(q.turnaroundDays).toEqual({ low: 9, high: 12 })
    expect(q.revisionRounds).toBe(2)
  })
  it('10 hours of recording costs $2,000', () => {
    expect(quotePackage({ ...course, recordMinutes: 600 }).recording).toBe(2000)
  })
  it('a single short motion VSL is deposit-first', () => {
    const q = quotePackage({ type: 'vsl', videos: 1, length: 'short', level: 'motion', record: true, recordMinutes: null, clips: 0 })
    expect(q.total).toBe(500)
    expect(q.callFirst).toBe(false)
    expect(q.turnaroundDays).toEqual({ low: 9, high: 12 })
  })
  it('editing-only ignores recordMinutes', () => {
    const q = quotePackage({ ...course, record: false, recordMinutes: 360 })
    expect(q.recording).toBe(0)
    expect(q.recordMinutes).toBe(0)
    expect(q.sessions).toEqual([])
  })
  it('parsePackageConfig rejects bad input', () => {
    expect(parsePackageConfig({ ...course, videos: 0 })).toBeNull()
    expect(parsePackageConfig({ ...course, videos: 41 })).toBeNull()
    expect(parsePackageConfig({ ...course, type: 'vsl', videos: 6 })).toBeNull()
    expect(parsePackageConfig({ ...course, videos: Number.NaN })).toBeNull()
    expect(parsePackageConfig({ ...course, level: 'fancy' })).toBeNull()
    expect(parsePackageConfig({ ...course, recordMinutes: 45 })).toBeNull()
    expect(parsePackageConfig({ ...course, recordMinutes: 60 })).toBeNull()
    expect(parsePackageConfig({ ...course, recordMinutes: 3030 })).toBeNull()
    expect(parsePackageConfig({ ...course, clips: -1 })).toBeNull()
    expect(parsePackageConfig('nope')).toBeNull()
  })
  it('parsePackageConfig accepts a valid config and nulls recordMinutes when not recording', () => {
    expect(parsePackageConfig(course)).toEqual(course)
    expect(parsePackageConfig({ ...course, record: false, recordMinutes: 360 })?.recordMinutes).toBeNull()
  })
})
