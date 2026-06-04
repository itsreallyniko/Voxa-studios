'use client'

import { useRef } from 'react'

const SLIDES = [
  {
    image:
      'https://lh3.googleusercontent.com/aida/ADBb0ujkabd-Yg9HDPoXBdp7TCrj8S4AhRxU8pPjoC8xTNSwxfd7Fhpe_Ou_YT8G5HBPPTjwu7IIuuBBXHMj2ozpsqu42ivCQegGcn0p9CC7-JpnxzYE3ru4FFAGYuCy6JT8i4XE1wxMCRLi2hCrQydr7TpIAGOXh7xcrxh83TKruaZTjBMtzd8PYg9GXS12MbXcjmub6R9eF65to1FipzfGzj1E4wIDA3lZ9FI_IykSBzeiiLUrhIoWGNY8mnmk',
    category: 'PODCAST CLIPS',
    title: 'High-Stakes Business Dialogue',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida/ADBb0uguU3aRNlIrIJ_xaLArr_tn0lICCAVvMdGJOqOFBvjLZoxCy5TE2mbBQlSc0jW7wkfWsrEvIuvyBGNzR83SYcflOe_0yZWu3cwd0MGh46fzNBco3iVIC7WEULB32bWF7Lr2H-8goZ4MpxTM64kJ0CdQNu5Bduojo9XdT6qnE7RNhKVT6-Td93dLUrIifsoQGhJNWjo174qsii9uRQkgzoD2ytr_wo4dfTcL_u2oYwod9ym8MKH8yHpOmN-6',
    category: 'FOUNDER CONTENT',
    title: 'Authority Shorts',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida/ADBb0ujh_-_KPb1gaBBupVqxJHlALCSqJQW_AJ__fgrBP1mcuvk9RDeXMfk9dxVjjJPwzaJaEMB0Xt40PZEHrasLoEddE8M_QUNwgidJghMh7c6HMgZRxlQ3HueIxCfyVgoLPlUHTRVQmOrxQjVbw8PRPYAFK4d9kQ42FUFsMgTUjsvkfv8DhSyGDZGdFo4jAyUmrnb08caYjQQQ44ogzJfmUe5TfwBgBT3xcdiFWrZwm8mNJJw6lhTHQ7mV5vf5',
    category: 'MODERN VSL',
    title: 'Product Launches',
  },
]

export function ExampleContentSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }
  return (
    <section className="py-section-gap bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <div className="text-center mb-24">
          <h2 className="text-headline-xl text-white">See What Gets Created Here</h2>
        </div>
        <div className="relative group">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            {SLIDES.map((slide) => (
              <div key={slide.title} className="flex-none w-[85vw] md:w-[600px] snap-center">
                <div className="aspect-video relative overflow-hidden rounded-xl group/card border border-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-70 group-hover/card:scale-105 transition-all duration-1000"
                    src={slide.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <span className="text-[10px] text-heritage-gold mb-2 tracking-[0.4em]">{slide.category}</span>
                    <h4 className="text-2xl text-white">{slide.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:flex justify-between items-center mt-12">
            <div className="flex gap-4">
              <button
                onClick={() => scroll('left')}
                className="liquid-glass w-14 h-14 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors border border-white/10"
                aria-label="Previous slide"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button
                onClick={() => scroll('right')}
                className="liquid-glass w-14 h-14 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors border border-white/10"
                aria-label="Next slide"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/30 tracking-widest uppercase">Drag to explore</span>
              <div className="w-24 h-px bg-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-heritage-gold w-1/3 animate-scroll-progress" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
