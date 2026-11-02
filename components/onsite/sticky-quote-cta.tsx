'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

/** Phone-only quote button. Steps aside once the form itself is on screen. */
export function StickyQuoteCta({ formAnchor = '#quote' }: { formAnchor?: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const form = document.querySelector(formAnchor)
      const reachedForm = form
        ? form.getBoundingClientRect().top < window.innerHeight
        : false
      setVisible(window.scrollY > window.innerHeight * 0.6 && !reachedForm)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [formAnchor])

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 bg-obsidian/90 backdrop-blur-md border-t border-white/10 px-6 py-3 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <a href={formAnchor} tabIndex={visible ? 0 : -1} className="flex">
        <Button variant="gold" size="md" className="w-full">
          Get a quote
        </Button>
      </a>
    </div>
  )
}
