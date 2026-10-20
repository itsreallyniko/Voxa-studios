'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { track } from '@/lib/meta-pixel'
import { pushDataLayer, sha256Hex } from '@/lib/data-layer'

type StashedBooking = {
  uid: string
  value: number
  currency: string
  setId?: string
  setName?: string
  date?: string
  time?: string
  email?: string
}

const STASH_KEY = 'voxa:lastBooking'
const firedKey = (uid: string) => `voxa:fired:${uid}`

function readStash(): StashedBooking | null {
  try {
    const raw = window.sessionStorage.getItem(STASH_KEY)
    return raw ? (JSON.parse(raw) as StashedBooking) : null
  } catch {
    return null
  }
}

export function ConfirmedClient() {
  const params = useSearchParams()
  const uid = params.get('booking') ?? ''
  const [data, setData] = useState<StashedBooking | null>(null)

  useEffect(() => {
    const stash = readStash()
    setData(stash)

    if (!uid) return
    // Dedup across refresh / back-button / React StrictMode double-mount.
    // Set the flag SYNCHRONOUSLY before any async work so the second mount bails cleanly.
    if (window.localStorage.getItem(firedKey(uid))) return
    window.localStorage.setItem(firedKey(uid), '1')
    window.sessionStorage.removeItem(STASH_KEY)

    const value = stash?.value ?? 0
    const currency = stash?.currency ?? 'USD'

    track('Purchase', {
      value,
      currency,
      content_ids: stash?.setId ? [stash.setId] : undefined,
      content_name: stash?.setName,
      content_type: 'product',
      num_items: 1,
    })

    const fire = async () => {
      const emailHash = stash?.email ? await sha256Hex(stash.email) : undefined

      // GA4 ecommerce purchase event — GTM can route this to GA4 + Google Ads conversion.
      // For Enhanced Conversions: in GTM, map `user_data.sha256_email_address` on the
      // Google Ads conversion tag.
      pushDataLayer({
        event: 'purchase',
        ecommerce: {
          transaction_id: uid,
          value,
          currency,
          items: stash?.setId
            ? [{ item_id: stash.setId, item_name: stash?.setName, quantity: 1, price: value }]
            : [],
        },
        user_data: emailHash ? { sha256_email_address: emailHash } : undefined,
      })
    }
    void fire()
  }, [uid])

  const sessionLabel = data?.setName ?? 'Your session'
  const when = [data?.date, data?.time].filter(Boolean).join(' · ')
  const total = typeof data?.value === 'number' ? `$${data.value.toLocaleString()}` : null

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-32">
      <div className="flex flex-col items-center text-center max-w-2xl">
        <span className="material-symbols-outlined text-heritage-gold text-6xl mb-8">check_circle</span>
        <span className="text-label-caps text-heritage-gold mb-4 block">SESSION CONFIRMED</span>
        <h1 className="text-headline-xl text-white mb-6">You&apos;re booked.</h1>
        <p className="text-body-lg text-ivory/60">
          {data?.email
            ? <>A confirmation has been sent to <span className="text-ivory">{data.email}</span>. Our team will reach out 24 hours before your session.</>
            : <>A confirmation is on its way to your inbox. Our team will reach out 24 hours before your session.</>}
        </p>

        <div className="mt-12 frosted-glass p-8 w-full text-left">
          <p className="text-label-caps text-ivory/60 mb-2">YOUR SESSION</p>
          <p className="text-body-lg text-white">{sessionLabel}</p>
          {when && <p className="text-body-md text-ivory/60 mt-1">{when}</p>}
          {total && <p className="text-headline-md text-heritage-gold mt-6 tabular-nums">{total}</p>}
          {uid && <p className="text-metadata text-ivory/30 mt-4">Booking #{uid}</p>}
        </div>

        <Link
          href="/"
          className="mt-12 text-label-caps text-heritage-gold underline underline-offset-4"
        >
          Back to home →
        </Link>
      </div>
    </main>
  )
}
