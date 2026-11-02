import { OnsiteSection } from './onsite-section'
import { Reveal } from '@/components/ui/reveal'

export function DeliverablesGrid({
  heading,
  cards,
}: {
  heading: string
  cards: { title: string; body: string }[]
}) {
  return (
    <OnsiteSection eyebrow="WHAT WE FILM FOR YOU" heading={heading}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 60}>
            <div className="h-full p-6 sm:p-8 bg-obsidian hover:bg-white/[0.02] transition-[background-color] duration-200">
              <h3 className="text-label-caps text-white mb-4">{c.title}</h3>
              <p className="text-sm text-ivory/55 leading-relaxed">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </OnsiteSection>
  )
}
