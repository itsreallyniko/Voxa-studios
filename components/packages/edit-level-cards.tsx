import type { PackagePage } from '@/lib/content/packages'
import { LEVEL_LABEL, type EditLevel } from '@/lib/packages/pricing'

export const ONE_LINER: Record<EditLevel, string> = {
  clean: 'Cuts, pacing, audio cleanup and color. Clean and ready to publish.',
  text: 'Everything in a clean edit, plus titles, lower thirds and on-screen text.',
  motion: 'Animated graphics, transitions and motion design throughout.',
}

const LEVELS: EditLevel[] = ['clean', 'text', 'motion']

export function EditLevelCards({
  value,
  previews,
  onChange,
}: {
  value: EditLevel
  previews: PackagePage['levelPreviews']
  onChange: (level: EditLevel) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {LEVELS.map((level) => {
        const selected = value === level
        const src = previews[level]
        return (
          <button
            key={level}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(level)}
            className={`border p-3 text-left transition-colors ${
              selected
                ? 'border-heritage-gold bg-surface-container-high'
                : 'border-white/10 bg-surface-container-low hover:border-white/30'
            }`}
          >
            {src ? (
              <video
                className="mb-3 aspect-video w-full object-cover"
                src={src}
                muted
                loop
                playsInline
                autoPlay
                aria-hidden="true"
              />
            ) : (
              <div
                aria-hidden="true"
                className="mb-3 flex aspect-video w-full items-center justify-center bg-gradient-to-br from-surface-container-highest to-surface-container-lowest text-label-caps text-ivory/30"
              >
                Preview soon
              </div>
            )}
            <span className="block font-medium text-ivory">{LEVEL_LABEL[level]}</span>
            <span className="mt-1 block text-sm text-ivory/60">{ONE_LINER[level]}</span>
          </button>
        )
      })}
    </div>
  )
}
