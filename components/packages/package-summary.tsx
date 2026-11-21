import type { PackagePage } from '@/lib/content/packages'
import {
  LENGTH_LABEL,
  LEVEL_LABEL,
  type PackageConfig,
  type PackageQuote,
} from '@/lib/packages/pricing'

export function formatMoney(n: number): string {
  return `$${n.toLocaleString('en-US')}`
}

export function formatRange(quote: Pick<PackageQuote, 'rangeLow' | 'rangeHigh'>): string {
  return `${formatMoney(quote.rangeLow)}–${formatMoney(quote.rangeHigh)}`
}

export function formatHours(minutes: number): string {
  const hrs = Math.round((minutes / 60) * 10) / 10
  return `${Number.isInteger(hrs) ? hrs : hrs.toFixed(1)} hrs`
}

function noun(page: PackagePage, n: number): string {
  return n === 1 ? page.videoNoun.one : page.videoNoun.many
}

export function summarizePackage(
  page: PackagePage,
  config: PackageConfig,
  quote: PackageQuote
): string {
  const parts = [
    page.slug.charAt(0).toUpperCase() + page.slug.slice(1),
    `${config.videos} ${noun(page, config.videos)}`,
    LENGTH_LABEL[config.length],
    LEVEL_LABEL[config.level],
    config.record ? `record ~${formatHours(quote.recordMinutes)}` : 'own footage',
  ]
  if (config.clips > 0) parts.push(`${config.clips} ${config.clips === 1 ? 'clip' : 'clips'}`)
  parts.push(`~${formatRange(quote)}`)
  return parts.join(' · ')
}

export function PackageLineItems({
  page,
  config,
  quote,
}: {
  page: PackagePage
  config: PackageConfig
  quote: PackageQuote
}) {
  const rows: { label: string; amount: number }[] = [
    {
      label: `Editing · ${config.videos} ${noun(page, config.videos)}`,
      amount: quote.editing,
    },
  ]
  if (config.record) {
    rows.push({ label: `Recording · ${formatHours(quote.recordMinutes)}`, amount: quote.recording })
  }
  if (config.clips > 0) {
    rows.push({ label: `Social clips · ${config.clips}`, amount: quote.clips })
  }
  return (
    <ul className="space-y-2 text-sm text-ivory/80">
      {rows.map((r) => (
        <li key={r.label} className="flex justify-between gap-4">
          <span>{r.label}</span>
          <span className="tabular-nums">{formatMoney(r.amount)}</span>
        </li>
      ))}
    </ul>
  )
}
