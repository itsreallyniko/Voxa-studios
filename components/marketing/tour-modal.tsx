'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTourModal } from '@/lib/tour-modal-context'
import { Input } from '@/components/ui/input'

type Step = 'details' | 'schedule' | 'success'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validDetails(name: string, email: string, phone: string): boolean {
  return name.trim().length > 0 && EMAIL_RE.test(email.trim()) && phone.trim().length >= 7
}

export function TourModal() {
  const { isOpen, close } = useTourModal()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<Step>('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!isOpen) return
    setStep('details')
    setName('')
    setEmail('')
    setPhone('')
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
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
