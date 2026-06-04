'use client'

import { useEffect, useState } from 'react'
import { useBooking } from '@/lib/booking-context'
import { findCollection } from '@/lib/content/collections'

type TabKey = 'gallery' | 'equipment' | 'capacity' | 'examples'

export function SetStep() {
  const { booking, setBooking } = useBooking()
  const collection = findCollection(booking.collectionId)
  const [tab, setTab] = useState<TabKey>('gallery')
  const [heroSrc, setHeroSrc] = useState<string>('')

  const selectedSet = collection?.sets.find((s) => s.id === booking.setId) ?? collection?.sets[0]

  useEffect(() => {
    if (selectedSet) setHeroSrc(selectedSet.heroImage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSet?.id])

  if (!collection || !selectedSet) {
    return <div className="text-ivory/60">Select a collection first.</div>
  }

  const choose = (id: string) => {
    setBooking((b) => ({ ...b, setId: id }))
  }

  return (
    <div>
      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 02 — SET</span>
        <h2 className="text-headline-xl text-white">{collection.name}</h2>
        <p className="text-body-lg text-ivory/60 mt-6">Choose the exact environment you want to record in.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
        {/* Thumbnail rail */}
        <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar">
          {collection.sets.map((s) => {
            const active = s.id === selectedSet.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => choose(s.id)}
                className={`flex-none w-40 lg:w-full text-left transition-all border ${
                  active ? 'border-heritage-gold' : 'border-slate-gray hover:border-white/30'
                }`}
              >
                <div className="aspect-video overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={s.name}
                    src={s.heroImage}
                    className={`w-full h-full object-cover transition-all ${active ? '' : 'grayscale'}`}
                  />
                </div>
                <div className="p-4">
                  <p className="text-label-caps text-white whitespace-nowrap">
                    {s.name.replace(/^(Executive|Horizon|Authority)\s/, '')}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Preview */}
        <div>
          <div className="relative aspect-[16/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={heroSrc}
              alt={selectedSet.name}
              src={heroSrc}
              className="w-full h-full object-cover animate-[fadeIn_320ms_ease-out]"
            />
            <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
          </div>

          <div className="mt-8">
            <h3 className="text-headline-md text-white mb-4">{selectedSet.name}</h3>
            <p className="text-body-md text-ivory/70">{selectedSet.description}</p>
          </div>

          {/* Tabs */}
          <div className="mt-10 border-b border-slate-gray">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {(['gallery', 'equipment', 'capacity', 'examples'] as TabKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`pb-4 text-label-caps transition-colors ${
                    tab === k
                      ? 'text-heritage-gold border-b-2 border-heritage-gold'
                      : 'text-ivory/50 hover:text-white'
                  }`}
                >
                  {k.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 min-h-[140px]">
            {tab === 'gallery' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {selectedSet.gallery.map((src, i) => (
                  <div key={i} className="aspect-square overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="" src={src} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            {tab === 'equipment' && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-body-md text-ivory/80">
                {selectedSet.equipment.map((e) => (
                  <li key={e} className="flex items-baseline gap-3">
                    <span className="text-heritage-gold">·</span>
                    {e}
                  </li>
                ))}
              </ul>
            )}
            {tab === 'capacity' && (
              <div>
                <p className="text-headline-md text-white mb-2">{selectedSet.capacity.seats}</p>
                <p className="text-body-md text-ivory/70">{selectedSet.capacity.label}</p>
              </div>
            )}
            {tab === 'examples' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSet.exampleContent.map((ex, i) => (
                  <div key={i} className="aspect-video overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={ex.label} src={ex.thumb} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-label-caps text-white">{ex.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
