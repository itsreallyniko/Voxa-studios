'use client'

import { useTourModal } from '@/lib/tour-modal-context'

export function TourModal() {
  const { isOpen, close } = useTourModal()
  if (!isOpen) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80"
      onClick={close}
    >
      <div className="liquid-glass p-12 max-w-md" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={close} className="text-ivory">Close (placeholder)</button>
      </div>
    </div>
  )
}
