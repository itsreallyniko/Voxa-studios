'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { calOnsiteLink } from '@/lib/content/onsite-form'

export function OnsiteHero({
  eyebrow,
  headline,
  subline,
  muteLoopVideo,
  muteLoopPoster,
  secondaryCta,
  formAnchor = '#quote',
}: {
  eyebrow: string
  headline: string
  subline: string
  muteLoopVideo: string | null
  muteLoopPoster?: string
  secondaryCta?: { label: string; href: string }
  formAnchor?: string
}) {
  const calLink = calOnsiteLink()
  const videoRef = useRef<HTMLVideoElement>(null)

  // React leaves the muted attribute out of server HTML, and iOS Safari won't
  // autoplay without it, so mute and start the loop once the page hydrates.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.setAttribute('muted', '')
    video.play().catch(() => {})

    // iOS refuses autoplay in Low Power Mode but allows play from a touch.
    const playOnTouch = () => {
      video.play().catch(() => {})
    }
    document.addEventListener('touchend', playOnTouch, { once: true, passive: true })
    return () => document.removeEventListener('touchend', playOnTouch)
  }, [])

  return (
    <section className="relative min-h-[88vh] md:min-h-screen flex items-center justify-center pt-28 pb-24 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {muteLoopVideo ? (
          <video
            ref={videoRef}
            className="hero-loop absolute inset-0 h-full w-full object-cover opacity-50"
            src={muteLoopVideo}
            poster={muteLoopPoster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_30%,_rgba(201,169,110,0.08)_0%,_rgba(13,13,13,0)_60%)]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/40" />
      </div>

      <div className="relative z-10 w-full max-w-container-max mx-auto px-6 md:px-margin-edge">
        <div className="max-w-3xl">
          <div
            className="fade-up flex items-center gap-4 mb-8"
            style={{ animationDelay: '60ms' }}
          >
            <span className="h-px w-10 bg-heritage-gold/50" />
            <span className="text-[11px] text-heritage-gold tracking-[0.6em] uppercase">
              {eyebrow}
            </span>
          </div>

          <h1
            className="fade-up text-display-lg-mobile md:text-display-lg leading-[1.05] tracking-tight text-white text-balance mb-8"
            style={{ animationDelay: '140ms' }}
          >
            {headline}
          </h1>

          <p
            className="fade-up text-body-lg text-ivory/80 leading-relaxed max-w-2xl mb-12 text-balance"
            style={{ animationDelay: '220ms' }}
          >
            {subline}
          </p>

          <div
            className="fade-up flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            style={{ animationDelay: '300ms' }}
          >
            <a href={formAnchor} className="flex">
              <Button variant="gold" size="lg" className="w-full sm:w-auto">
                Get a quote
              </Button>
            </a>
            {secondaryCta ? (
              <a href={secondaryCta.href} className="flex">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  {secondaryCta.label}
                </Button>
              </a>
            ) : calLink ? (
              <a
                href={calLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex"
              >
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Book a 15-min call
                </Button>
              </a>
            ) : (
              <a href={formAnchor} className="flex">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Book a 15-min call
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
