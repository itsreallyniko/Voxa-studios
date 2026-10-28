import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'

export function OnsiteFinalCta({
  heading,
  body,
  formAnchor = '#quote',
}: {
  heading: string
  body: string
  formAnchor?: string
}) {
  return (
    <section className="py-[120px] bg-obsidian text-center border-t border-white/5">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal>
          <span className="text-label-caps text-heritage-gold mb-6 block">
            READY WHEN YOU ARE
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-headline-xl text-white mb-6 max-w-2xl mx-auto">
            {heading}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-body-lg text-ivory/70 mb-10 max-w-xl mx-auto">
            {body}
          </p>
        </Reveal>
        <Reveal delay={240}>
          <a href={formAnchor}>
            <Button variant="gold" size="lg">
              Get a quote
            </Button>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
