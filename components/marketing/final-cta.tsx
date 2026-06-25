import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'

export function FinalCTA() {
  return (
    <section className="py-[160px] bg-obsidian text-center border-t border-white/5">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal>
          <span className="text-label-caps text-heritage-gold mb-8 block tracking-[0.4em]">
            READY TO SCALE YOUR CONTENT?
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-display-lg-mobile md:text-headline-xl text-white mb-12">
            Find The Set That <br /> Matches Your Brand
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#book">
              <Button variant="primary" size="lg">Explore Studio Sets</Button>
            </a>
            <a
              href="https://cal.com/niko-torres-n4iwe3/studio-tour"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg">Book A Studio Tour</Button>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
