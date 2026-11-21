'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FAQ } from '@/components/marketing/faq'
import { ReviewQuotes } from '@/components/marketing/review-quotes'
import { Button } from '@/components/ui/button'
import type { PackagePage } from '@/lib/content/packages'
import {
  LEVEL_LABEL,
  type EditLevel,
  type PackageConfig,
  type PackageQuote,
} from '@/lib/packages/pricing'
import { Advertorial } from './advertorial'
import { ONE_LINER } from './edit-level-cards'
import { PackageBuilder } from './package-builder'
import { PackageCheckout, depositStatusFromSearchParams } from './package-checkout'
import { PackageConfirmation } from './package-confirmation'

type Intent = 'call' | 'deposit'
type Pending = { config: PackageConfig; quote: PackageQuote; intent: Intent }

const LEVELS: EditLevel[] = ['clean', 'text', 'motion']

function scrollToBuild() {
  document.getElementById('build')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function BuildSection({ page }: { page: PackagePage }) {
  const params = useSearchParams()
  const returned = depositStatusFromSearchParams({
    redirect_status: params?.get('redirect_status') ?? undefined,
  })
  const [pending, setPending] = useState<Pending | null>(null)

  if (returned) {
    return <PackageConfirmation pageType={page.slug} notes="" status={returned} />
  }
  // Conditional swap: checkout unmounts on back, so a changed package gets a
  // fresh deposit session. The builder restarts from the page defaults.
  return pending ? (
    <PackageCheckout page={page} {...pending} onBack={() => setPending(null)} />
  ) : (
    <PackageBuilder page={page} onContinue={setPending} />
  )
}

export function PackagePageView({ page }: { page: PackagePage }) {
  return (
    <>
      <main className="bg-obsidian">
        <Advertorial page={page} />

        <section className="py-16 md:py-section-gap">
          <div className="max-w-3xl mx-auto px-6 md:px-margin-edge">
            <h2 className="text-headline-md text-white mb-10">What you get</h2>
            <div className="flex flex-col gap-8">
              {page.whatYouGet.map((item) => (
                <div key={item.heading}>
                  <h3 className="text-xl text-white mb-2">{item.heading}</h3>
                  <p className="text-body-md text-ivory/70">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-6 md:px-margin-edge">
            <h2 className="text-headline-md text-white mb-4">Three ways to edit</h2>
            <p className="text-body-md text-ivory/70 mb-8">{page.editingOnlyNote}</p>
            <ul className="grid gap-4 sm:grid-cols-3">
              {LEVELS.map((level) => (
                <li key={level} className="border border-white/10 bg-surface-container-low p-4">
                  <h3 className="text-label-caps text-heritage-gold mb-2">{LEVEL_LABEL[level]}</h3>
                  <p className="text-sm text-ivory/70">{ONE_LINER[level]}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="build" className="py-16 md:py-section-gap border-t border-white/5 scroll-mt-24">
          <div className="max-w-3xl mx-auto px-6 md:px-margin-edge">
            <h2 className="text-headline-md text-white mb-8">Build your package</h2>
            <Suspense fallback={null}>
              <BuildSection page={page} />
            </Suspense>
          </div>
        </section>

        <ReviewQuotes tag={page.reviewTag} />
        <FAQ items={page.faqs} />

        <section className="py-24 text-center border-t border-white/5">
          <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
            <h2 className="text-headline-md text-white mb-8">Ready to see your number?</h2>
            <Button variant="primary" size="lg" onClick={scrollToBuild}>
              Build your package
            </Button>
          </div>
        </section>
      </main>

      <div className="md:hidden sticky bottom-0 z-40 bg-obsidian/90 backdrop-blur-md border-t border-white/10 px-6 py-3">
        <Button variant="gold" size="md" className="w-full" onClick={scrollToBuild}>
          Build your package
        </Button>
      </div>
    </>
  )
}
