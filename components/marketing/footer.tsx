import Link from 'next/link'
import { VoxaLogo } from '@/components/voxa-logo'
import { publishedServices } from '@/lib/content/services'

// The On-Site link stays off studio pages until that service is promoted there.
export function Footer({ showOnsiteLink = false }: { showOnsiteLink?: boolean }) {
  const services = publishedServices()
  return (
    <footer className="py-20 bg-obsidian border-t border-white/5">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col gap-4 items-center md:items-start text-white">
          <VoxaLogo className="h-10 w-auto" />
          <p className="text-ivory/30 text-xs tracking-widest">PODCAST &amp; CONTENT STUDIO · TAMPA, FL</p>
        </div>
        {services.length > 0 && (
          <nav aria-label="What You Can Film at Voxa" className="flex flex-col items-center md:items-start gap-3">
            <p className="text-label-caps text-ivory/60">What You Can Film at Voxa</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/studios/${s.slug}`}
                  className="text-label-caps text-ivory/40 hover:text-white transition-colors"
                >
                  {s.navLabel}
                </Link>
              ))}
            </div>
          </nav>
        )}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
          {showOnsiteLink && (
            <Link
              href="/onsite"
              className="text-label-caps text-ivory/60 hover:text-white transition-colors"
            >
              ON-SITE
            </Link>
          )}
          <a
            href="tel:+18137317075"
            className="text-label-caps text-ivory/60 hover:text-white transition-colors tabular-nums"
          >
            (813) 731-7075
          </a>
          <a
            href="https://instagram.com/voxastudios.fl/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-label-caps text-ivory/40 hover:text-white transition-colors"
          >
            INSTAGRAM
          </a>
          <a
            href="https://www.linkedin.com/company/voxa-studios/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-label-caps text-ivory/40 hover:text-white transition-colors"
          >
            LINKEDIN
          </a>
        </div>
        <div className="text-[10px] text-ivory/20 tracking-[0.4em]">© 2026 VOXA STUDIOS. ALL RIGHTS RESERVED.</div>
      </div>
    </footer>
  )
}
