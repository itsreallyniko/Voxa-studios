'use client'

import { createContext, useCallback, useContext, useState, ReactNode } from 'react'
import { TourModal } from '@/components/marketing/tour-modal'
import type { PackageType } from '@/lib/packages/pricing'

export type TourOpenOptions = {
  source: 'package'
  pageType: PackageType
  packageSummary: string
}

type Ctx = {
  isOpen: boolean
  open: (opts?: TourOpenOptions) => void
  close: () => void
  options: TourOpenOptions | null
}

const TourModalContext = createContext<Ctx | null>(null)

export function TourModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<TourOpenOptions | null>(null)
  const open = useCallback((opts?: TourOpenOptions) => {
    // Ignore anything that isn't real package options (e.g. a stray click event).
    setOptions(opts?.source === 'package' ? opts : null)
    setIsOpen(true)
  }, [])
  const close = useCallback(() => {
    setIsOpen(false)
    setOptions(null)
  }, [])
  return (
    <TourModalContext.Provider value={{ isOpen, open, close, options }}>
      {children}
      <TourModal />
    </TourModalContext.Provider>
  )
}

/** Same as useTourModal, but returns null outside a TourModalProvider (e.g. in isolated tests). */
export function useOptionalTourModal(): Ctx | null {
  return useContext(TourModalContext)
}

export function useTourModal(): Ctx {
  const ctx = useContext(TourModalContext)
  if (!ctx) throw new Error('useTourModal must be used within TourModalProvider')
  return ctx
}
