'use client'

import { useBooking } from '@/lib/booking-context'
import { Input, Textarea } from '@/components/ui/input'
import { findSet } from '@/lib/content/collections'

export function DetailsStep() {
  const { booking, setBooking } = useBooking()
  const set = findSet(booking.collectionId, booking.setId)

  const update = (field: keyof typeof booking.details, value: string) => {
    setBooking((b) => ({ ...b, details: { ...b.details, [field]: value } }))
  }
  const updateContact = (field: 'name' | 'email', value: string) => {
    setBooking((b) => ({ ...b, contact: { ...b.contact, [field]: value } }))
  }

  return (
    <div className="relative">
      {set && (
        <div
          className="absolute inset-0 -z-10 opacity-[0.08]"
          style={{
            backgroundImage: `url(${set.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(40px)',
          }}
        />
      )}

      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 04 — DETAILS</span>
        <h2 className="text-headline-xl text-white">Tell Us About Your Session</h2>
        <p className="text-body-lg text-ivory/60 mt-6">
          The more we know, the smoother your session runs. We&apos;ll prep accordingly.
        </p>
      </header>

      <div className="frosted-glass max-w-3xl p-8 md:p-12">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label="YOUR NAME"
              placeholder="Jane Founder"
              value={booking.contact.name}
              onChange={(e) => updateContact('name', e.target.value)}
              autoComplete="name"
            />
            <Input
              label="EMAIL"
              type="email"
              placeholder="jane@example.com"
              value={booking.contact.email}
              onChange={(e) => updateContact('email', e.target.value)}
              autoComplete="email"
              inputMode="email"
            />
          </div>
          <Input
            label="WHAT ARE YOU RECORDING?"
            placeholder="e.g., A 4-episode founder podcast, a VSL for a launch, weekly LinkedIn shorts"
            value={booking.details.recordingType}
            onChange={(e) => update('recordingType', e.target.value)}
          />
          <Input
            label="GUEST NAMES"
            placeholder="Comma-separated, if applicable"
            value={booking.details.guests}
            onChange={(e) => update('guests', e.target.value)}
          />
          <Input
            label="SOCIAL MEDIA LINKS"
            placeholder="LinkedIn, IG, X, YouTube — anything you'd like us to reference"
            value={booking.details.socials}
            onChange={(e) => update('socials', e.target.value)}
          />
          <Textarea
            label="SPECIAL REQUESTS"
            placeholder="Anything we should know in advance?"
            value={booking.details.notes}
            onChange={(e) => update('notes', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
