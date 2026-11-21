'use client'

import { useRef, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useTourModal } from '@/lib/tour-modal-context'
import { SCOPE_NOTE, SEND_FILES_NOTE, type PackagePage } from '@/lib/content/packages'
import {
  LENGTH_LABEL,
  MAX_CLIPS,
  MAX_RECORD_MINUTES,
  MIN_SESSION_MINUTES,
  REVISION_ROUNDS,
  VIDEO_LIMITS,
  quotePackage,
  suggestRecordMinutes,
  type EditLevel,
  type LengthTier,
  type PackageConfig,
  type PackageQuote,
} from '@/lib/packages/pricing'
import { trackPackageBuilderStart, trackPackageTourClick } from '@/lib/tracking/packages'
import { EditLevelCards } from './edit-level-cards'
import {
  PackageLineItems,
  formatHours,
  formatMoney,
  formatRange,
  summarizePackage,
} from './package-summary'

type Intent = 'call' | 'deposit'
type Props = {
  page: PackagePage
  onContinue: (args: { config: PackageConfig; quote: PackageQuote; intent: Intent }) => void
}

const LENGTHS: LengthTier[] = ['short', 'medium', 'long']
const CLIP_PICKS = [0, 5, 10, 20]
const STEP = 30

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-label-caps text-heritage-gold">{title}</h3>
      {children}
    </section>
  )
}

function Choice({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`border px-4 py-3 text-sm transition-colors ${
        selected
          ? 'border-heritage-gold bg-surface-container-high text-ivory'
          : 'border-white/10 bg-surface-container-low text-ivory/70 hover:border-white/30'
      }`}
    >
      {children}
    </button>
  )
}

function Stepper({
  label,
  value,
  display,
  onDec,
  onInc,
  decLabel,
  incLabel,
  decDisabled,
  incDisabled,
}: {
  label: string
  value: number
  display: string
  onDec: () => void
  onInc: () => void
  decLabel: string
  incLabel: string
  decDisabled: boolean
  incDisabled: boolean
}) {
  const btn =
    'h-11 w-11 border border-white/10 text-lg text-ivory hover:border-heritage-gold disabled:opacity-40 disabled:cursor-not-allowed'
  return (
    <div role="group" aria-label={label} className="flex items-center gap-4">
      <button type="button" className={btn} aria-label={decLabel} disabled={decDisabled} onClick={onDec}>
        −
      </button>
      <span className="min-w-[7rem] text-center text-ivory tabular-nums" data-value={value}>
        {display}
      </span>
      <button type="button" className={btn} aria-label={incLabel} disabled={incDisabled} onClick={onInc}>
        +
      </button>
    </div>
  )
}

export function PackageBuilder({ page, onContinue }: Props) {
  const { open } = useTourModal()
  const d = page.defaults
  const [videos, setVideos] = useState(d.videos)
  const [length, setLength] = useState<LengthTier>(d.length)
  const [level, setLevel] = useState<EditLevel>(d.level)
  const [record, setRecord] = useState(d.record)
  const [recordOverride, setRecordOverride] = useState<number | null>(d.recordMinutes)
  const [clips, setClips] = useState(d.clips)
  const [barOpen, setBarOpen] = useState(false)
  const started = useRef(false)

  const touch = () => {
    if (started.current) return
    started.current = true
    trackPackageBuilderStart(page.slug)
  }

  const suggested = suggestRecordMinutes(videos, length)
  const minutes = recordOverride ?? suggested
  const config: PackageConfig = {
    type: page.slug,
    videos,
    length,
    level,
    record,
    recordMinutes: record ? recordOverride : null,
    clips,
  }
  const quote = quotePackage(config)
  const limits = VIDEO_LIMITS[page.slug]
  const noun = videos === 1 ? page.videoNoun.one : page.videoNoun.many
  const nounMany = page.videoNoun.many

  const act = <T,>(set: (v: T) => void) => (v: T) => {
    touch()
    set(v)
  }
  const setClipsSafe = (n: number) => {
    touch()
    setClips(Number.isFinite(n) ? Math.min(MAX_CLIPS, Math.max(0, Math.floor(n))) : 0)
  }

  const handleTour = () => {
    trackPackageTourClick(page.slug, quote.rangeLow)
    open({
      source: 'package',
      pageType: page.slug,
      packageSummary: summarizePackage(page, config, quote),
    })
  }
  const go = (intent: Intent) => onContinue({ config, quote, intent })

  const callPrimary = quote.callFirst
  const buttons = (
    <div className="space-y-3">
      <Button
        className="w-full"
        variant="primary"
        onClick={() => go(callPrimary ? 'call' : 'deposit')}
      >
        {callPrimary ? 'Book a vision call' : 'Reserve with deposit'}
      </Button>
      {callPrimary ? (
        <Button className="w-full" variant="secondary" onClick={() => go('deposit')}>
          Reserve with deposit
        </Button>
      ) : (
        <Button className="w-full" variant="secondary" onClick={handleTour}>
          Book a free tour
        </Button>
      )}
      {callPrimary && (
        <button
          type="button"
          onClick={handleTour}
          className="block w-full text-center text-sm text-ivory/60 underline underline-offset-4 hover:text-heritage-gold"
        >
          Book a free tour
        </button>
      )}
    </div>
  )

  const details = (
    <div className="space-y-5">
      <PackageLineItems page={page} config={config} quote={quote} />
      <p className="text-sm text-ivory/70">
        Estimated delivery: {quote.turnaroundDays.low}–{quote.turnaroundDays.high} business days
      </p>
      <p className="text-sm text-ivory/70">
        {REVISION_ROUNDS} rounds of revisions included
      </p>
      <p className="text-xs text-ivory/50">Deposit to reserve: {formatMoney(quote.deposit)}</p>
      <p className="text-xs text-ivory/50">{SCOPE_NOTE}</p>
    </div>
  )

  return (
    <div className="pb-28 lg:pb-0">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="min-w-0 space-y-10">
          <Section title="What do you need?">
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice selected={record} onClick={() => act(setRecord)(true)}>
                I need to record
              </Choice>
              <Choice selected={!record} onClick={() => act(setRecord)(false)}>
                I already have footage
              </Choice>
            </div>
            {!record && (
              <>
                <p className="text-sm text-ivory/70">{SEND_FILES_NOTE}</p>
                <p className="text-sm text-ivory/50">{page.editingOnlyNote}</p>
              </>
            )}
          </Section>

          <Section title={`How many ${nounMany}?`}>
            <Stepper
              label={`Number of ${nounMany}`}
              value={videos}
              display={`${videos} ${noun}`}
              decLabel={`Decrease ${nounMany}`}
              incLabel={`Increase ${nounMany}`}
              decDisabled={videos <= limits.min}
              incDisabled={videos >= limits.max}
              onDec={() => act(setVideos)(Math.max(limits.min, videos - 1))}
              onInc={() => act(setVideos)(Math.min(limits.max, videos + 1))}
            />
          </Section>

          <Section title="How long is each one?">
            <div className="grid gap-3 sm:grid-cols-3">
              {LENGTHS.map((l) => (
                <Choice key={l} selected={length === l} onClick={() => act(setLength)(l)}>
                  {LENGTH_LABEL[l]}
                </Choice>
              ))}
            </div>
          </Section>

          <Section title="Editing level">
            <EditLevelCards value={level} previews={page.levelPreviews} onChange={act(setLevel)} />
          </Section>

          {record && (
            <Section title="Studio time">
              <Stepper
                label="Studio time"
                value={minutes}
                display={formatHours(minutes)}
                decLabel="Less recording time"
                incLabel="More recording time"
                decDisabled={minutes <= MIN_SESSION_MINUTES}
                incDisabled={minutes >= MAX_RECORD_MINUTES}
                onDec={() => act(setRecordOverride)(Math.max(MIN_SESSION_MINUTES, minutes - STEP))}
                onInc={() => act(setRecordOverride)(Math.min(MAX_RECORD_MINUTES, minutes + STEP))}
              />
              <p className="text-sm text-ivory/50">
                Suggested for your package: {formatHours(suggested)}. Adjust if you want more or
                less.
              </p>
            </Section>
          )}

          <Section title="Social clips">
            <div className="flex flex-wrap gap-3">
              {CLIP_PICKS.map((n) => (
                <Choice key={n} selected={clips === n} onClick={() => setClipsSafe(n)}>
                  {n === 0 ? 'No clips' : `${n} clips`}
                </Choice>
              ))}
            </div>
            <label className="flex items-center gap-3 text-sm text-ivory/70">
              <span>Custom number of clips</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={MAX_CLIPS}
                value={clips}
                onChange={(e) => setClipsSafe(Number(e.target.value))}
                className="w-24 border border-white/10 bg-surface-container-low px-3 py-2 text-ivory"
              />
            </label>
          </Section>
        </div>

        {/* Desktop output panel */}
        <aside
          aria-label="Your custom package"
          className="hidden lg:sticky lg:top-24 lg:block liquid-glass space-y-5 border border-white/10 p-6"
        >
          <h3 className="text-label-caps text-heritage-gold">Your custom package</h3>
          <p className="font-serif text-3xl text-ivory" aria-live="polite">
            {formatRange(quote)}
          </p>
          {details}
          {buttons}
        </aside>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-obsidian/95 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-lg px-4 py-3">
          <button
            type="button"
            aria-expanded={barOpen}
            onClick={() => setBarOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <span>
              <span className="block text-label-caps text-heritage-gold">Your custom package</span>
              <span className="block text-xl text-ivory">{formatRange(quote)}</span>
            </span>
            <span className="text-sm text-ivory/60">{barOpen ? 'Hide' : 'Details'}</span>
          </button>
          {barOpen && (
            <div className="mt-4 max-h-[60vh] space-y-5 overflow-y-auto pb-2">
              {details}
              {buttons}
            </div>
          )}
          {!barOpen && (
            <Button
              className="mt-3 w-full"
              size="sm"
              onClick={() => go(callPrimary ? 'call' : 'deposit')}
            >
              {callPrimary ? 'Book a vision call' : 'Reserve with deposit'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
