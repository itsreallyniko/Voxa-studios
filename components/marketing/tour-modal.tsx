'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTourModal } from '@/lib/tour-modal-context'
import { Input } from '@/components/ui/input'

type Step = 'details' | 'schedule' | 'success'
type Status = 'idle' | 'loading-slots' | 'submitting' | 'error'
type BookingResult = { uid: string; startISO: string; durationMinutes: number }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validDetails(name: string, email: string, phone: string): boolean {
  return name.trim().length > 0 && EMAIL_RE.test(email.trim()) && phone.trim().length >= 7
}

function nextNDays(n: number): { iso: string; weekday: string; day: number; month: string }[] {
  const out: { iso: string; weekday: string; day: number; month: string }[] = []
  const today = new Date()
  for (let i = 1; i <= n; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    out.push({
      iso: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    })
  }
  return out
}

export function TourModal() {
  const { isOpen, close } = useTourModal()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<Step>('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [slotsByDate, setSlotsByDate] = useState<Record<string, string[]> | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const days = useMemo(() => nextNDays(14), [])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!isOpen) return
    setStep('details')
    setName('')
    setEmail('')
    setPhone('')
    setDate(null)
    setTime(null)
    setSlotsByDate(null)
    setStatus('idle')
    setErrorMsg(null)
    setBookingResult(null)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    firstInputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  useEffect(() => {
    if (!isOpen) return
    const ctrl = new AbortController()
    setStatus('loading-slots')
    setErrorMsg(null)
    const start = days[0].iso
    const end = days[days.length - 1].iso
    fetch(`/api/tour/slots?start=${start}&end=${end}`, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<{ slotsByDate: Record<string, string[]> }>
      })
      .then((data) => {
        setSlotsByDate(data.slotsByDate)
        setStatus('idle')
      })
      .catch((e) => {
        if (e.name !== 'AbortError') {
          setStatus('error')
          setErrorMsg('Could not load availability')
        }
      })
    return () => ctrl.abort()
  }, [isOpen, days])

  const submit = useCallback(async () => {
    if (!date || !time) return
    setStatus('submitting')
    setErrorMsg(null)
    try {
      const res = await fetch('/api/tour/book', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), date, time }),
      })
      const body = await res.json()
      if (res.status === 409) {
        setStatus('error')
        setErrorMsg('That time was just booked — please pick another.')
        setTime(null)
        const r = await fetch(`/api/tour/slots?start=${days[0].iso}&end=${days[days.length - 1].iso}`)
        if (r.ok) {
          const data = (await r.json()) as { slotsByDate: Record<string, string[]> }
          setSlotsByDate(data.slotsByDate)
        }
        return
      }
      if (!res.ok) {
        setStatus('error')
        setErrorMsg("Couldn't reach our calendar — try again in a moment.")
        return
      }
      setBookingResult(body as BookingResult)
      setStep('success')
      setStatus('idle')
    } catch {
      setStatus('error')
      setErrorMsg("Couldn't reach our calendar — try again in a moment.")
    }
  }, [date, time, name, email, phone, days])

  if (!mounted || !isOpen) return null

  const detailsValid = validDetails(name, email, phone)

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-modal-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-obsidian/85 backdrop-blur-md p-4 overflow-y-auto"
      onClick={close}
    >
      <div
        className="liquid-glass relative w-full max-w-xl p-8 md:p-12 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-ivory/60 hover:text-white transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {step === 'details' && (
          <div>
            <header className="mb-10">
              <span className="text-label-caps text-heritage-gold mb-3 block">STEP 1 OF 2</span>
              <h2 id="tour-modal-title" className="text-headline-xl text-white">
                Book a Studio Tour
              </h2>
              <p className="text-body-md text-ivory/60 mt-3">15 min · Tampa, FL</p>
            </header>

            <div className="flex flex-col gap-8 mb-12">
              <Input
                ref={firstInputRef}
                label="NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Jane Founder"
              />
              <Input
                label="EMAIL"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                placeholder="jane@example.com"
              />
              <Input
                label="PHONE"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+1 555 555 5555"
              />
            </div>

            <button
              type="button"
              disabled={!detailsValid}
              onClick={() => setStep('schedule')}
              className={`w-full py-5 border text-label-caps text-center transition-colors duration-200 ${
                detailsValid
                  ? 'border-heritage-gold/60 text-heritage-gold hover:bg-heritage-gold hover:text-obsidian hover:border-heritage-gold'
                  : 'border-white/10 text-ivory/30 cursor-not-allowed'
              }`}
            >
              Continue →
            </button>
          </div>
        )}

        {step === 'schedule' && (
          <div>
            <header className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-label-caps text-heritage-gold block">STEP 2 OF 2</span>
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-label-caps text-ivory/60 hover:text-white transition-colors"
                >
                  ← Back
                </button>
              </div>
              <h2 id="tour-modal-title" className="text-headline-xl text-white">
                Pick a Time
              </h2>
              <p className="text-body-md text-ivory/60 mt-3">15 min · Tampa, FL</p>
              {errorMsg && <p className="text-metadata text-red-400 mt-3">{errorMsg}</p>}
            </header>

            <div className="flex flex-col gap-10 mb-10">
              <div>
                <span className="text-label-caps text-ivory/60 mb-4 block">SELECT DATE</span>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {days.map((d) => {
                    const active = date === d.iso
                    const available = (slotsByDate?.[d.iso]?.length ?? 0) > 0
                    const disabled = status !== 'loading-slots' && slotsByDate !== null && !available
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => {
                          if (!available) return
                          setDate(d.iso)
                          setTime(null)
                        }}
                        disabled={disabled || status === 'loading-slots'}
                        className={`p-2 border text-center transition-colors ${
                          active
                            ? 'border-heritage-gold bg-heritage-gold/10 text-heritage-gold'
                            : disabled
                            ? 'border-slate-gray/40 text-ivory/20 cursor-not-allowed'
                            : 'border-slate-gray text-ivory/70 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <div className="text-[10px] tracking-widest opacity-60">{d.weekday}</div>
                        <div className="text-xl tabular-nums mt-1">{d.day}</div>
                        <div className="text-[10px] tracking-widest opacity-60 mt-1">{d.month}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <span className="text-label-caps text-ivory/60 mb-4 block">SELECT TIME</span>
                {!date ? (
                  <p className="text-body-md text-ivory/40">
                    {status === 'loading-slots' ? 'Loading availability…' : 'Choose a date first.'}
                  </p>
                ) : (slotsByDate?.[date]?.length ?? 0) === 0 ? (
                  <p className="text-body-md text-ivory/40">No times available — try another date.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {(slotsByDate?.[date] ?? []).map((t) => {
                      const active = time === t
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTime(t)}
                          className={`px-4 py-3 border text-body-md tabular-nums transition-colors ${
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

            <button
              type="button"
              disabled={!date || !time || status === 'submitting'}
              onClick={submit}
              className={`w-full py-5 border text-label-caps text-center transition-colors duration-200 ${
                date && time && status !== 'submitting'
                  ? 'border-heritage-gold/60 text-heritage-gold hover:bg-heritage-gold hover:text-obsidian hover:border-heritage-gold'
                  : 'border-white/10 text-ivory/30 cursor-not-allowed'
              }`}
            >
              {status === 'submitting' ? 'Booking…' : 'Confirm Tour'}
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
