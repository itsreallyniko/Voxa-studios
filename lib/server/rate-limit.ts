import 'server-only'

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export function check(
  ip: string,
  key: string,
  opts: { limit?: number; windowMs?: number } = {}
): { ok: boolean; retryAfterMs: number } {
  const limit = opts.limit ?? 10
  const windowMs = opts.windowMs ?? 1000
  const id = `${ip}|${key}`
  const now = Date.now()
  const b = buckets.get(id)
  if (!b || b.resetAt <= now) {
    buckets.set(id, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfterMs: 0 }
  }
  if (b.count < limit) {
    b.count += 1
    return { ok: true, retryAfterMs: 0 }
  }
  return { ok: false, retryAfterMs: b.resetAt - now }
}

export function ipFromRequest(req: Request): string {
  const xff = req.headers.get('x-forwarded-for') ?? ''
  const first = xff.split(',')[0]?.trim()
  return first || req.headers.get('x-real-ip') || 'unknown'
}
