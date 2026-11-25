'use client'

import { useState } from 'react'
import { Input, Textarea } from '@/components/ui/input'
import { FieldError } from '@/components/ui/field-error'
import { Button } from '@/components/ui/button'
import type { PackagePage } from '@/lib/content/packages'
import type { PackageConfig, PackageQuote } from '@/lib/packages/pricing'
import { parsePackageContact } from '@/lib/packages/contact'
import { trackPackageContactSubmit } from '@/lib/tracking/packages'
import { summarizePackage } from './package-summary'
import { StepHeading } from './step-heading'
import { PackageCall } from './package-call'

type Step = 'contact' | 'call'

type Props = {
  page: PackagePage
  config: PackageConfig
  quote: PackageQuote
  onBack: () => void
}

export function PackageCheckout({ page, config, quote, onBack }: Props) {
  const [step, setStep] = useState<Step>('contact')
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '', website: '' })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const summary = summarizePackage(page, config, quote)
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const contact = parsePackageContact(form)
    if (!contact) {
      setError('Please enter your name, a valid email and a phone number.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await fetch('/api/packages/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ config, contact, website: form.website }),
      })
    } catch {
      // A failed lead POST never blocks the visitor from the next step.
    }
    trackPackageContactSubmit(page.slug, quote.rangeLow)
    setSubmitting(false)
    setStep('call')
  }

  if (step === 'call') {
    return (
      <div key="call" className="flex flex-col gap-6">
        <StepHeading>Book your free vision call</StepHeading>
        <PackageCall
          pageType={page.slug}
          notes={summary}
          name={form.name.trim()}
          email={form.email.trim()}
        />
      </div>
    )
  }

  return (
    <form key="contact" onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {/* Honeypot — hidden from humans; filled only by bots */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={set('website')}
          />
        </label>
      </div>
      <StepHeading>Where should we reach you?</StepHeading>
      <p className="text-metadata text-ivory/60">{summary}</p>
      <Input label="Name" type="text" autoComplete="name" value={form.name} onChange={set('name')} required />
      <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} required />
      <Input label="Phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} required />
      <Textarea label="Notes (optional)" rows={3} value={form.notes} onChange={set('notes')} />
      <FieldError>{error}</FieldError>
      <div className="flex items-center justify-between gap-4">
        <button type="button" onClick={onBack} className="text-label-caps text-ivory/60 hover:text-heritage-gold">
          ← BACK
        </button>
        <Button type="submit" variant="gold" size="lg" disabled={submitting}>
          {submitting ? 'One moment…' : 'Continue'}
        </Button>
      </div>
    </form>
  )
}
