'use client'

import { useEffect, useRef } from 'react'
import { trackPackageDeepRead } from '@/lib/tracking/packages'
import type { PackageType } from '@/lib/packages/pricing'

const THRESHOLD = 0.75

/** Fires package_deep_read once, when the bottom of the viewport has passed 75% of the element. */
export function useDeepRead(pageType: PackageType) {
  const ref = useRef<HTMLDivElement>(null)
  const fired = useRef(false)

  useEffect(() => {
    const check = () => {
      const el = ref.current
      if (!el || fired.current) return
      const { top, height } = el.getBoundingClientRect()
      if (height <= 0) return
      if ((window.innerHeight - top) / height >= THRESHOLD) {
        fired.current = true
        trackPackageDeepRead(pageType)
        window.removeEventListener('scroll', check)
        window.removeEventListener('resize', check)
      }
    }
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    check()
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [pageType])

  return ref
}
