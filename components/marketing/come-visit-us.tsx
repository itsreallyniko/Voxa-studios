import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'

const ADDRESS_QUERY = '4021+N+Armenia+Ave+Suite+102+Tampa+FL+33607'

export function ComeVisitUs() {
  return (
    <section className="py-section-gap bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <Reveal>
            <span className="text-label-caps text-heritage-gold mb-4 block">
              OUR LOCATION
            </span>
            <h2 className="text-headline-xl text-white mb-8">Come Visit Us</h2>
            <p className="text-body-lg text-ivory/70 mb-12 max-w-md leading-relaxed">
              Our studios are minutes from downtown Tampa. Stop by for a walk-through
              or arrive ready to record.
            </p>
            <address className="not-italic mb-12">
              <p className="text-body-lg text-white">4021 N Armenia Ave, Suite 102</p>
              <p className="text-body-lg text-white">Tampa, FL 33607</p>
            </address>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#book">
                <Button variant="primary" size="lg">
                  Book Now
                </Button>
              </a>
              <a
                href={`https://www.google.com/maps?q=${ADDRESS_QUERY}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg">
                  Get Directions
                </Button>
              </a>
            </div>
          </Reveal>
          <Reveal delay={120} className="relative overflow-hidden rounded-2xl border border-white/10 aspect-square md:aspect-[4/5] bg-surface-container-low">
            <iframe
              title="Voxa Studios on Google Maps"
              src={`https://www.google.com/maps?q=${ADDRESS_QUERY}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
