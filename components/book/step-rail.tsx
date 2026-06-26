'use client'

import { applicableSteps, StepKey } from '@/lib/steps'
import { useBooking } from '@/lib/booking-context'

export function StepRail() {
  const { booking, currentStep, goTo, isComplete } = useBooking()
  const steps = applicableSteps(booking.setId)

  const reachable: Record<StepKey, boolean> = {} as never
  let blocked = false
  for (const s of steps) {
    reachable[s.key] = !blocked || s.key === currentStep
    if (!isComplete(s.key)) blocked = true
  }

  const cur = steps.find((s) => s.key === currentStep) ?? steps[0]
  const idx = Math.max(0, steps.findIndex((s) => s.key === currentStep))
  const pct = ((idx + 1) / steps.length) * 100
  const pad2 = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="sticky top-20 z-30 bg-obsidian/95 backdrop-blur-md border-b border-slate-gray">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge py-6">
        {/* Mobile compact */}
        <div className="lg:hidden">
          <div className="flex items-baseline justify-between">
            <span className="text-label-caps text-heritage-gold tabular-nums">
              {pad2(idx + 1)} / {pad2(steps.length)}
            </span>
            <span className="text-label-caps text-white">{cur.label}</span>
          </div>
          <div className="mt-3 h-px bg-white/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-heritage-gold transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Desktop full rail */}
        <ol className="hidden lg:flex items-center justify-between gap-2">
          {steps.map((s, i) => {
            const isCurrent = s.key === currentStep
            const isDone = isComplete(s.key) && !isCurrent
            const canClick = reachable[s.key] && (isDone || isCurrent)
            return (
              <li
                key={s.key}
                aria-current={isCurrent ? 'step' : undefined}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <button
                  type="button"
                  disabled={!canClick}
                  onClick={() => goTo(s.key)}
                  className={`flex items-baseline gap-3 transition-colors duration-200 ${
                    isCurrent
                      ? 'text-white'
                      : isDone
                        ? 'text-ivory/70 hover:text-white'
                        : 'text-ivory/30 cursor-not-allowed'
                  }`}
                >
                  <span className={`text-metadata tabular-nums ${isCurrent ? 'text-heritage-gold' : ''}`}>
                    {pad2(i + 1)}
                  </span>
                  <span className="text-label-caps whitespace-nowrap">{s.label}</span>
                </button>
                {isCurrent && <span className="h-px w-6 bg-heritage-gold" />}
                {i < steps.length - 1 && <span className="h-px flex-1 bg-slate-gray min-w-4" />}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
