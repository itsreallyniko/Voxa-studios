import type { ReactNode } from 'react'
import { Reveal } from '@/components/ui/reveal'

export function OnsiteSection({
  id,
  eyebrow,
  heading,
  body,
  children,
  tone = 'obsidian',
}: {
  id?: string
  eyebrow?: string
  heading?: string
  body?: string
  children: ReactNode
  tone?: 'obsidian' | 'surface'
}) {
  const bg = tone === 'surface' ? 'bg-surface-container-lowest' : 'bg-obsidian'
  return (
    <section id={id} className={`py-section-gap ${bg}`}>
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        {(eyebrow || heading || body) && (
          <Reveal className="max-w-3xl mb-16">
            {eyebrow && (
              <span className="text-label-caps text-heritage-gold mb-4 block">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="text-headline-xl text-white">{heading}</h2>
            )}
            {body && (
              <p className="text-body-lg text-ivory/60 mt-6">{body}</p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
