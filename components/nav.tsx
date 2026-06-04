'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-obsidian/80 backdrop-blur-md h-16' : 'bg-transparent h-20'
      } flex items-center`}
    >
      <div className="max-w-container-max mx-auto w-full px-6 md:px-margin-edge flex items-center justify-between">
        <Link href="/" className="text-2xl text-white tracking-tight">
          VOXA
        </Link>
        <div className="hidden md:flex items-center gap-12">
          <Link href="/#sets" className="text-label-caps text-ivory/60 hover:text-white transition-colors">
            STUDIO SETS
          </Link>
          <Link href="/#why" className="text-label-caps text-ivory/60 hover:text-white transition-colors">
            EXPERIENCE
          </Link>
          <Link href="/book" className="text-label-caps text-heritage-gold hover:text-white transition-colors">
            BOOK A SESSION
          </Link>
        </div>
      </div>
    </nav>
  )
}
