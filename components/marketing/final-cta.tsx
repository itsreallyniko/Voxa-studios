import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function FinalCTA() {
  return (
    <section className="py-[160px] bg-obsidian text-center border-t border-white/5">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <span className="text-label-caps text-heritage-gold mb-8 block tracking-[0.4em]">
          READY TO SCALE YOUR CONTENT?
        </span>
        <h2 className="text-display-lg-mobile md:text-headline-xl text-white mb-12">
          Find The Set That <br /> Matches Your Brand
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/book">
            <Button variant="primary" size="lg">Explore Studio Sets</Button>
          </Link>
          <Button variant="secondary" size="lg">Book A Studio Tour</Button>
        </div>
      </div>
    </section>
  )
}
