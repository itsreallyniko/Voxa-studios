'use client'

import { useEffect, useMemo, useState } from 'react'
import { useBooking } from '@/lib/booking-context'

const WEEKDAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function toIsoDate(year: number, monthIndex: number, day: number): string {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`
}

function todayIso(): string {
  const t = new Date()
  return toIsoDate(t.getFullYear(), t.getMonth(), t.getDate())
}

type Cell = { iso: string; day: number; inMonth: boolean }

function monthGrid(year: number, monthIndex: number): Cell[] {
  const firstDow = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay()
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
  const prevMonthDays = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate()
  const prevYear = monthIndex === 0 ? year - 1 : year
  const prevMonth = monthIndex === 0 ? 11 : monthIndex - 1
  const nextYear = monthIndex === 11 ? year + 1 : year
  const nextMonth = monthIndex === 11 ? 0 : monthIndex + 1

  const cells: Cell[] = []
  for (let i = firstDow - 1; i >= 0; i--) {
    const day = prevMonthDays - i
    cells.push({ iso: toIsoDate(prevYear, prevMonth, day), day, inMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ iso: toIsoDate(year, monthIndex, d), day: d, inMonth: true })
  }
  let trailing = 1
  while (cells.length < 42) {
    cells.push({ iso: toIsoDate(nextYear, nextMonth, trailing), day: trailing, inMonth: false })
    trailing++
  }
  return cells
}

export function ScheduleStep() {
  const { booking, setBooking } = useBooking()
  const now = useMemo(() => new Date(), [])
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const cells = useMemo(() => monthGrid(viewYear, viewMonth), [viewYear, viewMonth])
  const rangeStart = useMemo(() => toIsoDate(viewYear, viewMonth, 1), [viewYear, viewMonth])
  const rangeEnd = useMemo(() => {
    const lastDay = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate()
    return toIsoDate(viewYear, viewMonth, lastDay)
  }, [viewYear, viewMonth])

  const [slotsByDate, setSlotsByDate] = useState<Record<string, string[]> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const todayStr = todayIso()
  const atCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth()

  useEffect(() => {
    if (!booking.setId) return
    const ctrl = new AbortController()
    setLoading(true)
    setError(null)
    setSlotsByDate(null)
    const url = `/api/cal/slots?setId=${encodeURIComponent(booking.setId)}&start=${rangeStart}&end=${rangeEnd}&duration=${booking.durationMinutes}`
    fetch(url, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<{ slotsByDate: Record<string, string[]> }>
      })
      .then((data) => setSlotsByDate(data.slotsByDate))
      .catch((e) => {
        if (e.name !== 'AbortError') setError('Could not load availability')
      })
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [booking.setId, booking.durationMinutes, rangeStart, rangeEnd])

  const pickDate = (iso: string) =>
    setBooking((b) => ({ ...b, schedule: { ...b.schedule, date: iso, time: null } }))
  const pickTime = (t: string) =>
    setBooking((b) => ({ ...b, schedule: { ...b.schedule, time: t } }))

  const goPrev = () => {
    if (atCurrentMonth) return
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }
  const goNext = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const times = booking.schedule.date ? slotsByDate?.[booking.schedule.date] ?? [] : []

  return (
    <div>
      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 06 — SCHEDULE</span>
        <h2 className="text-headline-xl text-white">Pick a date &amp; time</h2>
        <p className="text-body-lg text-ivory/60 mt-6">
          Showing slots that fit your {Math.floor(booking.durationMinutes / 60)}h{' '}
          {booking.durationMinutes % 60 ? `${booking.durationMinutes % 60}m ` : ''}session.
        </p>
        {error && <p className="text-metadata text-red-400 mt-2">{error}</p>}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-label-caps text-ivory/60 block">SELECT DATE</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={atCurrentMonth}
                aria-label="Previous month"
                className={`w-8 h-8 flex items-center justify-center border transition-colors ${
                  atCurrentMonth
                    ? 'border-slate-gray/40 text-ivory/20 cursor-not-allowed'
                    : 'border-slate-gray text-ivory/70 hover:border-white/30 hover:text-white'
                }`}
              >
                ‹
              </button>
              <span className="text-body-md text-ivory tabular-nums min-w-[9rem] text-center">
                {MONTH_LABELS[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next month"
                className="w-8 h-8 flex items-center justify-center border border-slate-gray text-ivory/70 hover:border-white/30 hover:text-white transition-colors"
              >
                ›
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {WEEKDAY_LABELS.map((w) => (
              <div
                key={w}
                className="text-[10px] tracking-widest text-ivory/40 text-center py-2"
              >
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {cells.map((c, idx) => {
              if (!c.inMonth) {
                return <div key={idx} aria-hidden="true" />
              }
              const isPast = c.iso <= todayStr
              const active = booking.schedule.date === c.iso
              const available = (slotsByDate?.[c.iso]?.length ?? 0) > 0
              const disabled = isPast || (!loading && slotsByDate !== null && !available)
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => available && !isPast && pickDate(c.iso)}
                  disabled={disabled || loading}
                  className={`aspect-square border text-center transition-colors flex items-center justify-center ${
                    active
                      ? 'border-heritage-gold bg-heritage-gold/10 text-heritage-gold'
                      : disabled
                        ? 'border-slate-gray/40 text-ivory/20 cursor-not-allowed'
                        : 'border-slate-gray text-ivory/70 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span className="text-xl tabular-nums">{c.day}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <span className="text-label-caps text-ivory/60 mb-4 block">SELECT TIME</span>
          {!booking.schedule.date ? (
            <p className="text-body-md text-ivory/40">Choose a date first.</p>
          ) : times.length === 0 ? (
            <p className="text-body-md text-ivory/40">No times available — try another date.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {times.map((t) => {
                const active = booking.schedule.time === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => pickTime(t)}
                    className={`px-6 py-4 border text-left text-body-md tabular-nums transition-colors ${
                      active
                        ? 'border-heritage-gold bg-heritage-gold/10 text-heritage-gold'
                        : 'border-slate-gray text-ivory/70 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
