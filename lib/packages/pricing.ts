import { getTotal } from '@/lib/pricing'

export type PackageType = 'course' | 'vsl' | 'demo'
export type LengthTier = 'short' | 'medium' | 'long'
export type EditLevel = 'clean' | 'text' | 'motion'

export type PackageConfig = {
  type: PackageType
  videos: number
  length: LengthTier
  level: EditLevel
  record: boolean
  recordMinutes: number | null
  clips: number
}

export type PackageQuote = {
  editing: number
  recordMinutes: number
  sessions: number[]
  recording: number
  clips: number
  total: number
  rangeLow: number
  rangeHigh: number
  deposit: number
  callFirst: boolean
  turnaroundDays: { low: number; high: number }
  revisionRounds: number
}

export const EDIT_GRID: Record<LengthTier, Record<EditLevel, number>> = {
  short: { clean: 75, text: 125, motion: 200 },
  medium: { clean: 150, text: 250, motion: 400 },
  long: { clean: 250, text: 400, motion: 600 },
}

export const LENGTH_MIDPOINT_MIN: Record<LengthTier, number> = { short: 5, medium: 20, long: 45 }
export const LENGTH_LABEL: Record<LengthTier, string> = {
  short: 'Up to 10 min',
  medium: '10–30 min',
  long: '30–60 min',
}
export const LEVEL_LABEL: Record<EditLevel, string> = {
  clean: 'Clean edit',
  text: 'Edit + on-screen text',
  motion: 'Full motion design',
}

export const CLIP_PRICE = 20
export const RANGE_HIGH_FACTOR = 1.1
export const DEPOSIT_RATE = 0.3
export const CALL_FIRST_THRESHOLD = 1500
export const REVISION_ROUNDS = 2
export const RECORD_FACTOR = 1.5
export const MAX_SESSION_MINUTES = 300
export const MIN_SESSION_MINUTES = 90
export const VIDEO_LIMITS: Record<PackageType, { min: 1; max: number }> = {
  course: { min: 1, max: 40 },
  vsl: { min: 1, max: 5 },
  demo: { min: 1, max: 10 },
}
export const MAX_CLIPS = 200
export const MAX_RECORD_MINUTES = 3000

export function round50(n: number): number {
  return Math.round(n / 50) * 50
}

export function suggestRecordMinutes(videos: number, length: LengthTier): number {
  const raw = videos * LENGTH_MIDPOINT_MIN[length] * RECORD_FACTOR
  return Math.max(MIN_SESSION_MINUTES, Math.ceil(raw / 30) * 30)
}

export function splitSessions(minutes: number): number[] {
  if (!(minutes > 0)) return []
  const sessions: number[] = []
  let remaining = minutes
  while (remaining > MAX_SESSION_MINUTES) {
    sessions.push(MAX_SESSION_MINUTES)
    remaining -= MAX_SESSION_MINUTES
  }
  sessions.push(Math.max(MIN_SESSION_MINUTES, remaining))
  return sessions
}

export function quotePackage(config: PackageConfig): PackageQuote {
  const editing = EDIT_GRID[config.length][config.level] * config.videos
  const recordMinutes = config.record
    ? config.recordMinutes ?? suggestRecordMinutes(config.videos, config.length)
    : 0
  const sessions = splitSessions(recordMinutes)
  const recording = sessions.reduce(
    (sum, s) => sum + getTotal({ durationMinutes: s, addonIds: [] }, []).total,
    0
  )
  const clips = config.clips * CLIP_PRICE
  const total = editing + recording + clips
  const rangeLow = round50(total)
  const low =
    5 +
    Math.ceil((config.videos * LENGTH_MIDPOINT_MIN[config.length]) / 60) +
    (config.level === 'motion' ? 3 : 0)
  return {
    editing,
    recordMinutes,
    sessions,
    recording,
    clips,
    total,
    rangeLow,
    rangeHigh: round50(total * RANGE_HIGH_FACTOR),
    deposit: Math.round(rangeLow * DEPOSIT_RATE),
    callFirst: rangeLow >= CALL_FIRST_THRESHOLD,
    turnaroundDays: { low, high: low + 3 },
    revisionRounds: REVISION_ROUNDS,
  }
}

const TYPES: PackageType[] = ['course', 'vsl', 'demo']
const LENGTHS: LengthTier[] = ['short', 'medium', 'long']
const LEVELS: EditLevel[] = ['clean', 'text', 'motion']

export function parsePackageConfig(raw: unknown): PackageConfig | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (!TYPES.includes(r.type as PackageType)) return null
  if (!LENGTHS.includes(r.length as LengthTier)) return null
  if (!LEVELS.includes(r.level as EditLevel)) return null
  if (typeof r.record !== 'boolean') return null
  const type = r.type as PackageType
  const { videos, clips } = r
  if (!Number.isInteger(videos)) return null
  if ((videos as number) < VIDEO_LIMITS[type].min || (videos as number) > VIDEO_LIMITS[type].max) return null
  if (!Number.isInteger(clips) || (clips as number) < 0 || (clips as number) > MAX_CLIPS) return null
  let recordMinutes: number | null = null
  if (r.record && r.recordMinutes !== null && r.recordMinutes !== undefined) {
    const m = r.recordMinutes
    if (
      !Number.isInteger(m) ||
      (m as number) % 30 !== 0 ||
      (m as number) < MIN_SESSION_MINUTES ||
      (m as number) > MAX_RECORD_MINUTES
    )
      return null
    recordMinutes = m as number
  }
  return {
    type,
    videos: videos as number,
    length: r.length as LengthTier,
    level: r.level as EditLevel,
    record: r.record,
    recordMinutes,
    clips: clips as number,
  }
}
