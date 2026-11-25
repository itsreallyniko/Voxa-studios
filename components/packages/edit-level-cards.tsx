import type { PackagePage } from '@/lib/content/packages'
import { LEVEL_LABEL, type EditLevel } from '@/lib/packages/pricing'

export const ONE_LINER: Record<EditLevel, string> = {
  clean: 'Cuts, color, audio, slides or screen recording placed in.',
  text: 'Adds titles, lower thirds, text callouts, captions, intro/outro.',
  motion: 'Animated graphics, b-roll, zooms, music and sound design.',
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
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
      {LEVELS.map((level) => {
        const selected = value === level
        const src = previews[level]
        return (
          <button
            key={level}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(level)}
            className={`flex flex-col border p-3 text-left transition-colors ${
              selected
                ? 'border-heritage-gold bg-surface-container-high'
                : 'border-white/10 bg-surface-container-low hover:border-white/30'
            }`}
          >
            {src ? (
              <video
                className="mb-3 aspect-video w-full shrink-0 object-cover lg:aspect-[21/9] xl:aspect-video"
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
                className="mb-3 flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden whitespace-nowrap bg-gradient-to-br from-surface-container-highest to-surface-container-lowest text-[10px] uppercase tracking-widest text-ivory/30 lg:aspect-[21/9] xl:aspect-video"
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
