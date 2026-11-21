'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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
import { claimPaidTracking, readDeposit } from '@/lib/packages/deposit-session'
import { trackPackageDepositPaid } from '@/lib/tracking/packages'
import { Advertorial } from './advertorial'
import { ONE_LINER } from './edit-level-cards'
import { PackageBuilder } from './package-builder'
import { PackageCheckout, depositStatusFromSearchParams } from './package-checkout'
import { PackageConfirmation } from './package-confirmation'
import { scrollToBuild } from './step-heading'

type Intent = 'call' | 'deposit'
type Pending = { config: PackageConfig; quote: PackageQuote; intent: Intent }

const LEVELS: EditLevel[] = ['clean', 'text', 'motion']

function BuildSection({ page }: { page: PackagePage }) {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const redirectStatus = params?.get('redirect_status') ?? undefined
  const paymentIntent = params?.get('payment_intent') ?? undefined
  // Read once, then the query is cleaned; state keeps the result on screen.
  const [returned] = useState(() => depositStatusFromSearchParams({ redirect_status: redirectStatus }))
  const [failed] = useState(redirectStatus === 'failed')
  const [pending, setPending] = useState<Pending | null>(null)

  useEffect(() => {
    if (!redirectStatus) return
    if (redirectStatus === 'succeeded' && paymentIntent) {
      const saved = readDeposit(paymentIntent)
      if (saved && claimPaidTracking(paymentIntent)) {
        trackPackageDepositPaid(page.slug, { ...saved, paymentIntentId: paymentIntent })
      }
    }
    router.replace(pathname ?? window.location.pathname, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (returned) {
    return (
      <div className="max-w-3xl">
        <PackageConfirmation pageType={page.slug} notes="" status={returned} />
      </div>
    )
  }
  // Conditional swap: checkout unmounts on back, so a changed package gets a
  // fresh deposit session. The builder restarts from the page defaults.
  return pending ? (
    <div className="max-w-3xl">
      <PackageCheckout page={page} {...pending} onBack={() => setPending(null)} />
    </div>
  ) : (
    <>
      {failed && (
        <p role="alert" className="mb-8 max-w-3xl border border-red-400/40 p-4 text-body-md text-red-400">
          Your payment didn&apos;t go through. You can try again or book a vision call.
        </p>
      )}
      <PackageBuilder page={page} onContinue={setPending} />
    </>
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
          <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
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
    </>
  )
}
