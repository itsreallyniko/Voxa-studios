import { describe, it, expect, beforeEach } from 'vitest'

describe('setIdToEventTypeId', () => {
  beforeEach(() => {
    process.env.CAL_EVENT_TYPE_EXECUTIVE_PODCAST = '111'
    process.env.CAL_EVENT_TYPE_AUTHORITY_DESK = '222'
    process.env.CAL_EVENT_TYPE_AUTHORITY_CREATOR = '333'
    process.env.CAL_EVENT_TYPE_HORIZON_PODCAST = '444'
    process.env.CAL_EVENT_TYPE_HORIZON_DESK = '555'
    process.env.CAL_EVENT_TYPE_HORIZON_CREATOR = '666'
  })

  it('maps each known set id to its env-var numeric id', async () => {
    const { setIdToEventTypeId } = await import('@/lib/server/set-event-types')
    expect(setIdToEventTypeId('executive-podcast')).toBe(111)
    expect(setIdToEventTypeId('authority-desk')).toBe(222)
    expect(setIdToEventTypeId('authority-creator')).toBe(333)
    expect(setIdToEventTypeId('horizon-podcast')).toBe(444)
    expect(setIdToEventTypeId('horizon-desk')).toBe(555)
    expect(setIdToEventTypeId('horizon-creator')).toBe(666)
  })

  it('returns null for unknown set ids', async () => {
    const { setIdToEventTypeId } = await import('@/lib/server/set-event-types')
    expect(setIdToEventTypeId('unknown-set')).toBeNull()
    expect(setIdToEventTypeId('')).toBeNull()
  })

  it('returns null when the env var is unset', async () => {
    delete process.env.CAL_EVENT_TYPE_HORIZON_PODCAST
    const { setIdToEventTypeId } = await import('@/lib/server/set-event-types')
    expect(setIdToEventTypeId('horizon-podcast')).toBeNull()
  })
})
