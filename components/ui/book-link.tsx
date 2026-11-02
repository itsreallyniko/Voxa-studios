'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

// On the homepage this stays a same-page jump: a full reload would drop ad
// parameters, re-fire page tracking and lose booking wizard progress.
export function BookLink({ className, children }: { className?: string; children: ReactNode }) {
  const href = usePathname() === '/' ? '#book' : '/#book'
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
