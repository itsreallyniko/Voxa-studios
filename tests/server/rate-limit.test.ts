import { describe, it, expect, beforeEach, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-18T00:00:00Z'))
})

describe('rate-limit check', () => {
  it('allows up to limit in window, then blocks', async () => {
    const { check } = await import('@/lib/server/rate-limit')
    for (let i = 0; i < 10; i++) expect(check('1.1.1.1', 'k', { limit: 10, windowMs: 1000 }).ok).toBe(true)
    expect(check('1.1.1.1', 'k', { limit: 10, windowMs: 1000 }).ok).toBe(false)
  })

  it('resets after the window', async () => {
    const { check } = await import('@/lib/server/rate-limit')
    for (let i = 0; i < 10; i++) check('1.1.1.1', 'k', { limit: 10, windowMs: 1000 })
    expect(check('1.1.1.1', 'k', { limit: 10, windowMs: 1000 }).ok).toBe(false)
    vi.advanceTimersByTime(1001)
    expect(check('1.1.1.1', 'k', { limit: 10, windowMs: 1000 }).ok).toBe(true)
  })

  it('isolates per ip + per key', async () => {
    const { check } = await import('@/lib/server/rate-limit')
    for (let i = 0; i < 10; i++) check('1.1.1.1', 'a', { limit: 10, windowMs: 1000 })
    expect(check('1.1.1.1', 'a', { limit: 10, windowMs: 1000 }).ok).toBe(false)
    expect(check('1.1.1.1', 'b', { limit: 10, windowMs: 1000 }).ok).toBe(true)
    expect(check('2.2.2.2', 'a', { limit: 10, windowMs: 1000 }).ok).toBe(true)
  })
})
