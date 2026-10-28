import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function OnsiteNotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center pt-28 pb-16 bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge text-center">
        <span className="text-label-caps text-heritage-gold mb-4 block">
          VOXA ON-SITE
        </span>
        <h1 className="text-headline-xl text-white mb-6">
          That page is not here.
        </h1>
        <p className="text-body-lg text-ivory/70 mb-10 max-w-md mx-auto">
          Head back to the hub or send us a note about what you had in mind.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/onsite">
            <Button variant="gold" size="md">Back to Voxa On-Site</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="md">Visit the studio site</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
