'use client'

import { useEffect } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { calPackageLink } from '@/lib/content/packages'
import { toCalLinkSlug } from '@/lib/content/cal-link'
import { trackPackageCallBooked } from '@/lib/tracking/packages'
import type { PackageType } from '@/lib/packages/pricing'

export function PackageCall({ pageType, notes }: { pageType: PackageType; notes: string }) {
  const calSlug = toCalLinkSlug(calPackageLink())

  useEffect(() => {
    if (!calSlug) return
    let mounted = true
    ;(async () => {
      // Must match the <Cal namespace> below, or booking events never arrive.
      const cal = await getCalApi({ namespace: 'package' })
      if (!mounted) return
      cal('on', {
        action: 'bookingSuccessful',
        callback: () => trackPackageCallBooked(pageType),
      })
    })()
    return () => {
      mounted = false
    }
  }, [calSlug, pageType])

  if (!calSlug) {
    return (
      <p className="text-body-md text-ivory/70">
        Email us at voxastudiosfl@gmail.com and we&apos;ll set up your call.
      </p>
    )
  }

  return (
    <div className="bg-surface-container-low liquid-glass p-2 md:p-4 min-h-[640px]">
      <Cal
        namespace="package"
        calLink={calSlug}
        style={{ width: '100%', height: '100%', overflow: 'scroll' }}
        config={{ layout: 'month_view', theme: 'dark', notes }}
      />
    </div>
  )
}
