'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { StepKey } from '@/lib/steps'

interface StepFrameProps {
  stepKey: StepKey
  children: React.ReactNode
}

export function StepFrame({ stepKey, children }: StepFrameProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = ref.current?.querySelector('h2')
    if (h) {
      h.setAttribute('tabindex', '-1')
      ;(h as HTMLElement).focus({ preventScroll: false })
    }
  }, [stepKey])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        key={stepKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
