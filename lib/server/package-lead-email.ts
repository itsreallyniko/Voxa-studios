// Emails package-builder leads through Resend's HTTP API (same env as On-Site).
import { LENGTH_LABEL, LEVEL_LABEL } from '@/lib/packages/pricing'
import type { PackageConfig, PackageQuote } from '@/lib/packages/pricing'
import type { PackageContact } from '@/lib/packages/contact'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const DEFAULT_TO = 'voxastudiosfl@gmail.com'
const DEFAULT_FROM = 'Voxa Package Leads <onboarding@resend.dev>'

export type PackageLeadStage = 'started' | 'deposit_paid'

const STAGE_LABEL: Record<PackageLeadStage, string> = {
  started: 'started',
  deposit_paid: 'deposit paid',
}
const TYPE_LABEL = { course: 'Course', vsl: 'VSL', demo: 'Demo' } as const

const usd = (n: number) => `$${n.toLocaleString('en-US')}`

export function leadEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim())
}

export async function sendPackageLeadEmail(args: {
  stage: PackageLeadStage
  contact: PackageContact
  config: PackageConfig
  quote: PackageQuote
  paymentIntentId?: string
}): Promise<void> {
  const { stage, contact, config, quote, paymentIntentId } = args
  const type = TYPE_LABEL[config.type]
  const lines = [
    `Stage: ${STAGE_LABEL[stage]}`,
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Phone: ${contact.phone}`,
    '',
    `Package: ${type}`,
    `Videos: ${config.videos}`,
    `Length: ${LENGTH_LABEL[config.length]}`,
    `Edit level: ${LEVEL_LABEL[config.level]}`,
    `Recording: ${config.record ? `yes, ${quote.recordMinutes} min (sessions: ${quote.sessions.join(', ')} min)` : 'no'}`,
    `Short clips: ${config.clips}`,
    '',
    `Editing: ${usd(quote.editing)}`,
    `Recording: ${usd(quote.recording)}`,
    `Clips: ${usd(quote.clips)}`,
    `Total: ${usd(quote.total)}`,
    `Range: ${usd(quote.rangeLow)}–${usd(quote.rangeHigh)}`,
    `Deposit (30%): ${usd(quote.deposit)}`,
    `Call first: ${quote.callFirst ? 'yes' : 'no'}`,
    `Turnaround: ${quote.turnaroundDays.low}–${quote.turnaroundDays.high} days`,
    `Revision rounds: ${quote.revisionRounds}`,
    `Payment intent: ${paymentIntentId ?? '-'}`,
    '',
    contact.notes || '(no notes)',
  ]
  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.ONSITE_LEAD_FROM?.trim() || DEFAULT_FROM,
      to: process.env.ONSITE_LEAD_EMAIL?.trim() || DEFAULT_TO,
      reply_to: contact.email,
      subject: `Package lead (${STAGE_LABEL[stage]}): ${contact.name} — ${type} ~${usd(quote.rangeLow)}–${usd(quote.rangeHigh)}`,
      text: lines.join('\n'),
    }),
  })
  if (!res.ok) throw new Error(`Resend responded ${res.status}`)
}
