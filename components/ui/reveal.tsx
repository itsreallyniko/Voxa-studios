'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

export function Reveal({
  children,
  delay = 0,
  className = '',
  style,
}: {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          obs.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-shown={shown ? '' : undefined}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms`, ...style } : style}
    >
      {children}
    </div>
  )
}
