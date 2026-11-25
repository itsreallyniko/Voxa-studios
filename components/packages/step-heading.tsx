'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export function scrollToBuild() {
  const el = document.getElementById('build')
  if (!el || typeof el.scrollIntoView !== 'function') return
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

/** Step heading: on mount, brings #build into view and moves focus here. */
export function StepHeading({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    scrollToBuild()
    ref.current?.focus({ preventScroll: true })
  }, [])
  return (
    <h3 ref={ref} tabIndex={-1} className="text-headline-md text-white leading-tight focus:outline-none">
      {children}
    </h3>
  )
}
