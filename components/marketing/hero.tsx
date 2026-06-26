'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const USE_CASES: { icon: string; label: string }[] = [
  { icon: 'mic', label: 'Podcasts' },
  { icon: 'smart_display', label: 'VSLs' },
  { icon: 'groups', label: 'Webinars' },
  { icon: 'school', label: 'Courses' },
  { icon: 'phone_iphone', label: 'Social' },
]

export function Hero() {
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return
      imgRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-36 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={imgRef} className="absolute inset-0 will-change-transform">
          <Image
            alt="Voxa studio environment"
            src="/hero.jpg"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover opacity-85 md:opacity-65 scale-[0.85]"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_75%_at_50%_45%,_rgba(13,13,13,0.45)_0%,_rgba(13,13,13,0.18)_55%,_rgba(13,13,13,0.06)_100%)] md:bg-[radial-gradient(ellipse_60%_70%_at_50%_45%,_rgba(13,13,13,0.78)_0%,_rgba(13,13,13,0.35)_55%,_rgba(13,13,13,0.15)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/25 to-transparent md:from-obsidian md:via-obsidian/40 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/10 via-transparent to-obsidian/10 md:from-obsidian/30 md:to-obsidian/30" />
      </div>

      <div className="relative z-10 w-full max-w-container-max mx-auto px-6 md:px-margin-edge flex flex-col items-center">
        <div className="max-w-3xl mx-auto text-center">
          <div className="fade-up flex items-center justify-center gap-4 mb-10" style={{ animationDelay: '60ms' }}>
            <span className="hidden sm:block h-px w-10 bg-heritage-gold/50" />
            <span className="text-[11px] text-heritage-gold tracking-[0.6em] uppercase">
              Voxa Studios
            </span>
            <span className="hidden sm:block h-px w-10 bg-heritage-gold/50" />
          </div>

          <h1 className="fade-up text-display-lg-mobile md:text-display-lg leading-[1.05] tracking-tight text-white text-balance mb-8 [text-shadow:0_2px_24px_rgba(13,13,13,0.55)]" style={{ animationDelay: '140ms' }}>
            Professional Content
            <br className="hidden md:block" /> Effortlessly
          </h1>

          <p className="fade-up text-body-lg text-ivory/85 leading-relaxed max-w-xl mx-auto mb-14 text-balance" style={{ animationDelay: '220ms' }}>
            Podcast, VSL, and content production — engineer on-site.
          </p>

          <div className="fade-up flex justify-center" style={{ animationDelay: '300ms' }}>
            <a href="/book">
              <Button variant="primary" size="lg">
                Book Your Session
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom strip — use cases (left) + pricing (right). Mirrors the ad's
          bottom bar so cold ad traffic feels message-match continuity. */}
      <div
        className="fade-up absolute bottom-0 left-0 right-0 z-10 border-t border-slate-gray/60 backdrop-blur-md bg-obsidian/55"
        style={{ animationDelay: '420ms' }}
      >
        <div className="max-w-container-max mx-auto px-6 md:px-margin-edge py-5 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          <ul className="flex items-center gap-x-5 md:gap-x-7 gap-y-2 flex-wrap justify-center">
            {USE_CASES.map((uc) => (
              <li key={uc.label} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-heritage-gold text-[18px] leading-none">
                  {uc.icon}
                </span>
                <span className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-white whitespace-nowrap">
                  {uc.label}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-ivory/80 whitespace-nowrap">
            <span>
              From <span className="text-heritage-gold">$300</span> / 90 min
            </span>
            <span aria-hidden className="text-ivory/30">·</span>
            <span>Tampa, FL</span>
          </div>
        </div>
      </div>
    </section>
  )
}
