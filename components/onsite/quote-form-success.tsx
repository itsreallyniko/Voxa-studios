'use client'

import { useEffect } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import {
  INSTAGRAM_DM_URL,
  INSTAGRAM_HANDLE,
  calOnsiteLink,
} from '@/lib/content/onsite-form'
import { trackOnsiteCallBooked } from '@/lib/tracking/onsite'

function toCalLinkSlug(link: string | null): string | null {
  if (!link) return null
  try {
    const u = new URL(link)
    // Cal expects "username/event-slug"
    return u.pathname.replace(/^\/+/, '').replace(/\/+$/, '') || null
  } catch {
    // Allow passing just the slug ("voxastudios/15min")
    return link.replace(/^\/+/, '').replace(/\/+$/, '')
  }
}

export function QuoteFormSuccess({
  pageSlug,
  projectType,
}: {
  pageSlug: string
  projectType: string
}) {
  const calLink = calOnsiteLink()
  const calSlug = toCalLinkSlug(calLink)

  useEffect(() => {
    if (!calSlug) return
    let mounted = true
    ;(async () => {
      // Must match the <Cal namespace> below, or booking events never arrive.
      const cal = await getCalApi({ namespace: 'onsite' })
      if (!mounted) return
      cal('on', {
        action: 'bookingSuccessful',
        callback: () => {
          trackOnsiteCallBooked({ pageSlug, projectType })
        },
      })
    })()
    return () => {
      mounted = false
    }
  }, [calSlug, pageSlug, projectType])

  return (
    <div className="flex flex-col gap-10">
      <div>
        <span className="text-label-caps text-heritage-gold mb-4 block">
          THANKS — WE&apos;LL BE IN TOUCH
        </span>
        <h3 className="text-headline-md text-white mb-4 leading-tight">
          Request received. Want to talk sooner?
        </h3>
        <p className="text-body-md text-ivory/70 max-w-xl">
          {calSlug
            ? 'Grab a fifteen-minute slot below, or send a quick DM. Either works.'
            : 'Send a quick DM and we can pick it up from there.'}
        </p>
      </div>

      {calSlug ? (
        <div className="bg-surface-container-low liquid-glass p-2 md:p-4 min-h-[640px]">
          <Cal
            namespace="onsite"
            calLink={calSlug}
            style={{ width: '100%', height: '100%', overflow: 'scroll' }}
            config={{ layout: 'month_view', theme: 'dark' }}
          />
        </div>
      ) : process.env.NODE_ENV === 'production' ? null : (
        // Dev-only reminder; visitors never see a placeholder.
        <div className="border border-dashed border-white/10 p-6 text-ivory/60 text-sm">
          <p className="mb-2 text-label-caps text-ivory/40">PLACEHOLDER</p>
          Cal.com embed appears here once <code className="text-ivory/70">NEXT_PUBLIC_CAL_ONSITE_LINK</code> is set.
        </div>
      )}

      <a
        href={INSTAGRAM_DM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-label-caps text-ivory/60 hover:text-heritage-gold transition-colors inline-flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[16px]">chat</span>
        PREFER A DM? MESSAGE {INSTAGRAM_HANDLE.toUpperCase()}
      </a>
    </div>
  )
}
