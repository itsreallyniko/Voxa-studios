'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

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
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={imgRef} className="absolute inset-0 will-change-transform">
          <Image
            alt="Voxa studio environment"
            src="/hero.jpg"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover opacity-65 scale-[0.85]"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_45%,_rgba(13,13,13,0.78)_0%,_rgba(13,13,13,0.35)_55%,_rgba(13,13,13,0.15)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/30 via-transparent to-obsidian/30" />
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
            Professional content
            <br className="hidden md:block" /> effortlessly
          </h1>

          <p className="fade-up text-body-lg text-ivory/85 leading-relaxed max-w-xl mx-auto mb-14 text-balance" style={{ animationDelay: '220ms' }}>
            Turnkey podcast, VSL, and content production, engineer included.
          </p>

          <div className="fade-up flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '300ms' }}>
            <a href="#book">
              <Button variant="primary" size="lg">
                Explore Studio Sets
              </Button>
            </a>
            <Button variant="secondary" size="lg">
              Book a Studio Tour
            </Button>
          </div>
        </div>
      </div>

      <div className="fade-up absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50" style={{ animationDelay: '500ms' }}>
        <span className="text-[10px] text-ivory/70 tracking-[0.4em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-ivory/50 to-transparent" />
      </div>
    </section>
  )
}
