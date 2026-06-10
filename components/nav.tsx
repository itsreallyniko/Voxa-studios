'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { VoxaLogo } from '@/components/voxa-logo'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = original
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <nav
        className={`nav-mount fixed top-0 left-0 right-0 z-50 transition-[height,background-color,backdrop-filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          scrolled || open ? 'bg-obsidian/80 backdrop-blur-md h-16' : 'bg-transparent h-20'
        } flex items-center`}
      >
        <div className="max-w-container-max mx-auto w-full px-6 md:px-margin-edge flex items-center justify-between">
          <Link href="/" aria-label="Voxa Studios — Home" className="text-white" onClick={close}>
            <VoxaLogo className="h-9 w-auto md:h-10" />
          </Link>
          <div className="hidden md:flex items-center gap-12">
            <Link href="/#sets" className="text-label-caps text-ivory/60 hover:text-white transition-colors">
              STUDIO SETS
            </Link>
            <Link href="/#why" className="text-label-caps text-ivory/60 hover:text-white transition-colors">
              EXPERIENCE
            </Link>
            <a href="#book" className="text-label-caps text-heritage-gold hover:text-white transition-colors">
              BOOK A SESSION
            </a>
          </div>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative w-10 h-10 -mr-2 flex items-center justify-center text-white"
          >
            <span
              className={`absolute h-px w-6 bg-current transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                open ? 'rotate-45' : '-translate-y-1.5'
              }`}
            />
            <span
              className={`absolute h-px w-6 bg-current transition-opacity duration-200 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute h-px w-6 bg-current transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                open ? '-rotate-45' : 'translate-y-1.5'
              }`}
            />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`md:hidden fixed inset-0 z-40 bg-obsidian/95 backdrop-blur-md transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-6">
          <Link
            href="/#sets"
            onClick={close}
            className={`text-display-lg-mobile text-white border-b border-white/5 py-6 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transitionDelay: open ? '80ms' : '0ms' }}
          >
            Studio Sets
          </Link>
          <Link
            href="/#why"
            onClick={close}
            className={`text-display-lg-mobile text-white border-b border-white/5 py-6 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transitionDelay: open ? '140ms' : '0ms' }}
          >
            Experience
          </Link>
          <a
            href="#book"
            onClick={close}
            className={`text-display-lg-mobile text-heritage-gold border-b border-white/5 py-6 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transitionDelay: open ? '200ms' : '0ms' }}
          >
            Book a Session
          </a>
        </div>
      </div>
    </>
  )
}
