'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida/ADBb0uguU3aRNlIrIJ_xaLArr_tn0lICCAVvMdGJOqOFBvjLZoxCy5TE2mbBQlSc0jW7wkfWsrEvIuvyBGNzR83SYcflOe_0yZWu3cwd0MGh46fzNBco3iVIC7WEULB32bWF7Lr2H-8goZ4MpxTM64kJ0CdQNu5Bduojo9XdT6qnE7RNhKVT6-Td93dLUrIifsoQGhJNWjo174qsii9uRQkgzoD2ytr_wo4dfTcL_u2oYwod9ym8MKH8yHpOmN-6'

export function Hero() {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return
      imgRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          alt="Voxa studio environment"
          className="w-full h-full object-cover opacity-60"
          src={HERO_IMAGE}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-transparent to-obsidian/20" />
      </div>
      <div className="relative z-10 w-full max-w-container-max mx-auto px-6 md:px-margin-edge text-center flex flex-col items-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-label-caps text-heritage-gold mb-6 block tracking-[0.6em]">VOXA STUDIOS</span>
          <h1 className="text-display-lg-mobile md:text-display-lg leading-none text-white text-balance mb-12">
            Look Like The Expert You Already Are
          </h1>
          <p className="text-body-lg text-ivory/60 max-w-2xl text-balance mx-auto mb-24">
            Record podcasts, VSLs, and content in professionally designed studio environments. Every session includes
            an engineer and a streamlined process built to make content creation effortless.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/book">
              <Button variant="primary" size="lg">
                Explore Studio Sets
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              Book a Studio Tour
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
        <span className="text-[10px] tracking-widest">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  )
}
