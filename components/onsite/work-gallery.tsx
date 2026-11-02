import { Reveal } from '@/components/ui/reveal'
import { OnsiteSection } from './onsite-section'

export function WorkGallery({
  eyebrow,
  heading,
  frames,
}: {
  eyebrow: string
  heading: string
  frames: { src: string; alt: string; label?: string }[]
}) {
  if (!frames.length) return null
  return (
    <OnsiteSection eyebrow={eyebrow} heading={heading}>
      {/* First frame runs large; with five, the last runs wide so desktop rows stay full. */}
      <div className="grid grid-cols-2 md:grid-cols-3 grid-flow-dense auto-rows-[140px] md:auto-rows-[220px] lg:auto-rows-[280px] gap-2">
        {frames.map((frame, i) => (
          <Reveal
            key={frame.src}
            delay={i * 60}
            className={
              i === 0
                ? 'col-span-2 row-span-2'
                : frames.length === 5 && i === 4
                  ? 'md:col-span-2'
                  : ''
            }
          >
            <div className="relative h-full w-full overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={frame.src}
                alt={frame.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {frame.label && (
                <span className="absolute top-2 left-2 text-[10px] tracking-[0.3em] uppercase bg-obsidian/80 text-ivory/80 px-2 py-1">
                  {frame.label}
                </span>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </OnsiteSection>
  )
}
