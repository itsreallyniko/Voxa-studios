import { describe, it, expect, beforeEach, afterEach } from 'vitest'

const original = process.env.CAL_EVENT_TYPE_TOUR

beforeEach(() => {
  delete process.env.CAL_EVENT_TYPE_TOUR
})

afterEach(() => {
  if (original === undefined) delete process.env.CAL_EVENT_TYPE_TOUR
  else process.env.CAL_EVENT_TYPE_TOUR = original
})

describe('getTourEventTypeId', () => {
  it('returns numeric id when env var is set', async () => {
    process.env.CAL_EVENT_TYPE_TOUR = '6123370'
    const { getTourEventTypeId } = await import('@/lib/server/tour-event-type')
    expect(getTourEventTypeId()).toBe(6123370)
  })

  it('returns null when env var is missing', async () => {
    const { getTourEventTypeId } = await import('@/lib/server/tour-event-type')
    expect(getTourEventTypeId()).toBeNull()
  })

  it('returns null when env var is non-numeric', async () => {
    process.env.CAL_EVENT_TYPE_TOUR = 'abc'
    const { getTourEventTypeId } = await import('@/lib/server/tour-event-type')
    expect(getTourEventTypeId()).toBeNull()
  })

  it('returns null when env var is zero or negative', async () => {
    process.env.CAL_EVENT_TYPE_TOUR = '0'
    const { getTourEventTypeId } = await import('@/lib/server/tour-event-type')
    expect(getTourEventTypeId()).toBeNull()
  })
})
