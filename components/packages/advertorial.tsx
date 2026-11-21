'use client'

import type { PackagePage } from '@/lib/content/packages'
import { useDeepRead } from './use-deep-read'

export function Advertorial({ page }: { page: PackagePage }) {
  const ref = useDeepRead(page.slug)
  const paragraphs = [
    ...page.story.anonymous,
    ...(page.story.useNamed && page.story.named ? page.story.named : []),
  ]
  return (
    <header className="bg-obsidian pt-40 pb-16 md:pb-24">
      <div ref={ref} className="max-w-3xl mx-auto px-6 md:px-margin-edge">
        <span className="text-label-caps text-heritage-gold mb-6 block">{page.eyebrow}</span>
        <h1 className="text-display-lg-mobile md:text-headline-xl text-white leading-[1.1] mb-10">
          {page.headline}
        </h1>
        <div className="flex flex-col gap-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-body-lg text-ivory/85 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    </header>
  )
}
