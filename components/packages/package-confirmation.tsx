'use client'

import { PackageCall } from './package-call'
import { StepHeading } from './step-heading'
import type { PackageType } from '@/lib/packages/pricing'

export function PackageConfirmation({
  pageType,
  notes,
  status = 'succeeded',
  name,
  email,
}: {
  pageType: PackageType
  notes: string
  status?: 'succeeded' | 'processing'
  name?: string
  email?: string
}) {
  const processing = status === 'processing'
  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-label-caps text-heritage-gold mb-4 block">{processing ? 'PAYMENT PROCESSING' : 'DEPOSIT RECEIVED'}</span>
        <div className="mb-4">
          <StepHeading>{processing ? 'Almost there.' : "You're in. Here's what happens next."}</StepHeading>
        </div>
        {processing && (
          <p className="text-body-md text-ivory/70 max-w-xl mb-4">
            Your deposit is processing. We&apos;ll email you once it clears — you can book your vision call now.
          </p>
        )}
        <ol className="text-body-md text-ivory/70 max-w-xl list-decimal pl-5 flex flex-col gap-2">
          <li>
            {processing
              ? 'Your receipt arrives by email once the payment clears.'
              : 'A receipt is on its way to your inbox.'}
          </li>
          <li>Book your vision call below so we can lock the scope and the schedule.</li>
          <li>We confirm your final quote after that call. Nothing is locked before then.</li>
        </ol>
      </div>
      <div>
        <h4 className="text-label-caps text-white mb-4">Book your vision call</h4>
        <PackageCall pageType={pageType} notes={notes} name={name} email={email} />
      </div>
    </div>
  )
}
