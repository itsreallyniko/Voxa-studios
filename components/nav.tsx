'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { VoxaLogo } from '@/components/voxa-logo'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`nav-mount fixed top-0 left-0 right-0 z-50 transition-[height,background-color,backdrop-filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        scrolled ? 'bg-obsidian/80 backdrop-blur-md h-16' : 'bg-transparent h-20'
      } flex items-center`}
    >
      <div className="max-w-container-max mx-auto w-full px-6 md:px-margin-edge flex items-center justify-between gap-4">
        <Link href="/" aria-label="Voxa Studios — Home" className="text-white shrink-0">
          <VoxaLogo className="h-9 w-auto md:h-10" />
        </Link>
        <div className="flex items-center gap-5 sm:gap-7">
          <Link
            href="/onsite"
            className="text-label-caps text-ivory/60 hover:text-white transition-colors whitespace-nowrap"
          >
            ON-SITE
          </Link>
          <a
            href="/#book"
            className="text-label-caps text-heritage-gold hover:text-white transition-colors whitespace-nowrap"
          >
            BOOK A SESSION
          </a>
        </div>
      </div>
    </nav>
  )
}
