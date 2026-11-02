'use client'

import { useState } from 'react'
import { Input, Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FieldError } from '@/components/ui/field-error'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { QuoteFormSuccess } from './quote-form-success'
import { trackOnsiteQuoteSubmit } from '@/lib/tracking/onsite'
import {
  BUDGET_RANGE_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
} from '@/lib/content/onsite-form'
import type { ProjectType } from '@/lib/content/onsite/types'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormState = {
  name: string
  email: string
  phone: string
  company: string
  projectType: ProjectType
  budgetRange: string
  shootDate: string
  locationCity: string
  referralSource: string
  message: string
  website: string // honeypot
}

type Errors = Partial<Record<keyof FormState, string>>

export function QuoteForm({
  pageSlug,
  preselect,
}: {
  pageSlug: string
  preselect: ProjectType
}) {
  const [state, setState] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: preselect,
    budgetRange: '',
    shootDate: '',
    locationCity: '',
    referralSource: '',
    message: '',
    website: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')

  const set = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setState((s) => ({ ...s, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  function validate(): Errors {
    const e: Errors = {}
    if (!state.name.trim()) e.name = 'Please add your name.'
    if (!EMAIL.test(state.email.trim())) e.email = 'That email looks off.'
    if (state.phone.trim().length < 7) e.phone = 'Add a phone we can reach you on.'
    if (!state.budgetRange) e.budgetRange = 'Pick a range (or Not sure).'
    return e
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    const v = validate()
    if (Object.keys(v).length) {
      setErrors(v)
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/onsite/quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...state, pageSlug }),
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt || `HTTP ${res.status}`)
      }
      trackOnsiteQuoteSubmit({ pageSlug, projectType: state.projectType })
      setStatus('done')
    } catch (err) {
      setStatus('idle')
      setServerError(
        'Something went wrong sending that. Try again, or DM us on Instagram.'
      )
    }
  }

  if (status === 'done') {
    return (
      <section id="quote" className="py-section-gap bg-obsidian">
        <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
          <div className="max-w-3xl mx-auto">
            <QuoteFormSuccess
              pageSlug={pageSlug}
              projectType={state.projectType}
            />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="quote" className="py-section-gap bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal className="max-w-3xl mx-auto mb-12">
          <span className="text-label-caps text-heritage-gold mb-4 block">
            GET A QUOTE
          </span>
          <h2 className="text-headline-xl text-white mb-6">
            Tell us about your project.
          </h2>
          <p className="text-body-lg text-ivory/70">
            A few quick fields — enough to put together a tailored quote and a
            short call.
          </p>
        </Reveal>

        <Reveal className="max-w-3xl mx-auto">
          <form
            onSubmit={onSubmit}
            noValidate
            className="bg-surface-container-low liquid-glass p-8 md:p-12 flex flex-col gap-8"
          >
            {/* Honeypot — hidden from humans; filled only by bots */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={state.website}
                  onChange={set('website')}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Name"
                  type="text"
                  autoComplete="name"
                  value={state.name}
                  onChange={set('name')}
                  required
                />
                <FieldError>{errors.name}</FieldError>
              </div>
              <div>
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={state.email}
                  onChange={set('email')}
                  required
                />
                <FieldError>{errors.email}</FieldError>
              </div>
              <div>
                <Input
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  value={state.phone}
                  onChange={set('phone')}
                  required
                />
                <FieldError>{errors.phone}</FieldError>
              </div>
              <div>
                <Input
                  label="Company (optional)"
                  type="text"
                  autoComplete="organization"
                  value={state.company}
                  onChange={set('company')}
                />
                <FieldError>{errors.company}</FieldError>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="What are you making?"
                  options={PROJECT_TYPE_OPTIONS}
                  value={state.projectType}
                  onChange={set('projectType')}
                />
              </div>
              <div>
                <Select
                  label="Budget range"
                  options={BUDGET_RANGE_OPTIONS}
                  placeholder="Pick a range"
                  value={state.budgetRange}
                  onChange={set('budgetRange')}
                />
                <FieldError>{errors.budgetRange}</FieldError>
              </div>
              <div>
                <Input
                  label="Shoot date or deadline"
                  type="text"
                  placeholder="e.g. Nov 14, or 'flexible'"
                  value={state.shootDate}
                  onChange={set('shootDate')}
                />
              </div>
              <div>
                <Input
                  label="Location (optional)"
                  type="text"
                  value={state.locationCity}
                  onChange={set('locationCity')}
                />
                <FieldError>{errors.locationCity}</FieldError>
              </div>
              <div className="md:col-span-2">
                <Select
                  label="How did you hear about us? (optional)"
                  options={REFERRAL_SOURCE_OPTIONS}
                  placeholder="Pick one"
                  value={state.referralSource}
                  onChange={set('referralSource')}
                />
                <FieldError>{errors.referralSource}</FieldError>
              </div>
            </div>

            <div>
              <Textarea
                label="Anything else we should know?"
                rows={4}
                value={state.message}
                onChange={set('message')}
              />
            </div>

            {serverError && (
              <p role="alert" className="text-sm text-red-400">
                {serverError}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <p className="text-metadata text-ivory/40">
                We&apos;ll reply within one business day.
              </p>
              <Button
                type="submit"
                variant="gold"
                size="md"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending…' : 'Get a quote'}
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
