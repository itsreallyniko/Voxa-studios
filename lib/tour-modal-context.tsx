'use client'

import { createContext, useCallback, useContext, useState, ReactNode } from 'react'
import { TourModal } from '@/components/marketing/tour-modal'

type Ctx = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const TourModalContext = createContext<Ctx | null>(null)

export function TourModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  return (
    <TourModalContext.Provider value={{ isOpen, open, close }}>
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
