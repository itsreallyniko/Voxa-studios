'use client'

import { useBooking } from '@/lib/booking-context'

function getDays() {
  const days: { iso: string; weekday: string; day: number; month: string }[] = []
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      iso: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    })
  }
  return days
}

const TIMES = ['09:00', '11:00', '13:00', '15:00', '17:00']

export function ScheduleStep() {
  const { booking, setBooking } = useBooking()
  const days = getDays()

  const pickDate = (iso: string) =>
    setBooking((b) => ({ ...b, schedule: { ...b.schedule, date: iso, time: null } }))
  const pickTime = (t: string) =>
    setBooking((b) => ({ ...b, schedule: { ...b.schedule, time: t } }))

  return (
    <div>
      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 06 — SCHEDULE</span>
        <h2 className="text-headline-xl text-white">Pick a date &amp; time</h2>
        <p className="text-body-lg text-ivory/60 mt-6">
          Showing slots that fit your {Math.floor(booking.durationMinutes / 60)}h{' '}
          {booking.durationMinutes % 60 ? `${booking.durationMinutes % 60}m ` : ''}session.
        </p>
        <p className="text-metadata text-ivory/30 mt-2">[Placeholder calendar — Cal.com embed wires in here later]</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12">
        <div>
          <span className="text-label-caps text-ivory/60 mb-4 block">SELECT DATE</span>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => {
              const active = booking.schedule.date === d.iso
              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => pickDate(d.iso)}
                  className={`p-3 border text-center transition-colors ${
                    active
                      ? 'border-heritage-gold bg-heritage-gold/10 text-heritage-gold'
                      : 'border-slate-gray text-ivory/70 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <div className="text-[10px] tracking-widest opacity-60">{d.weekday}</div>
                  <div className="text-2xl tabular-nums mt-1">{d.day}</div>
                  <div className="text-[10px] tracking-widest opacity-60 mt-1">{d.month}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <span className="text-label-caps text-ivory/60 mb-4 block">SELECT TIME</span>
          {!booking.schedule.date ? (
            <p className="text-body-md text-ivory/40">Choose a date first.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {TIMES.map((t) => {
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
