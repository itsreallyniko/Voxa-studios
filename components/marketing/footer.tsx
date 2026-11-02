import Link from 'next/link'
import { VoxaLogo } from '@/components/voxa-logo'
import { publishedServices } from '@/lib/content/services'

const HEADING = 'text-[11px] tracking-[0.12em] lg:text-label-caps text-ivory/60'
const FOOTER_LINK =
  'text-[11px] tracking-[0.12em] lg:text-label-caps text-ivory/40 hover:text-white transition-colors whitespace-nowrap'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/voxastudios.fl/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/voxa-studios/' },
  { label: 'Google Profile', href: 'https://www.google.com/search?kgmid=/g/11ysvny0qr' },
]

// The On-Site column stays off studio pages until that service is promoted there.
export function Footer({ showOnsiteLink = false }: { showOnsiteLink?: boolean }) {
  const services = publishedServices()
  return (
    <footer className="py-16 md:py-20 bg-obsidian border-t border-white/5">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <div
          className={`grid grid-cols-2 gap-x-8 gap-y-10 ${
            showOnsiteLink
              ? 'lg:grid-cols-[1.5fr_repeat(3,1fr)]'
              : 'lg:grid-cols-[1.5fr_repeat(2,1fr)]'
          }`}
        >
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4 text-white">
            <VoxaLogo className="h-10 w-auto self-start" />
            <p className="text-ivory/30 text-xs tracking-widest">PODCAST &amp; CONTENT STUDIO · TAMPA, FL</p>
          </div>
          {services.length > 0 && (
            <nav aria-label="What You Can Film at Voxa" className="flex flex-col items-start gap-3">
              <p className={HEADING}>What You Can Film at Voxa</p>
              {services.map((s) => (
                <Link key={s.slug} href={`/studios/${s.slug}`} className={FOOTER_LINK}>
                  {s.navLabel}
                </Link>
              ))}
            </nav>
          )}
          {showOnsiteLink && (
            <nav aria-label="Voxa On-Site" className="flex flex-col items-start gap-3">
              <p className={HEADING}>On-Site</p>
              <Link href="/onsite" className={FOOTER_LINK}>
                Video Production
              </Link>
              <Link href="/onsite/work" className={FOOTER_LINK}>
                Our Work
              </Link>
              <Link href="/onsite#quote" className={FOOTER_LINK}>
                Get a Quote
              </Link>
            </nav>
          )}
          <div className="flex flex-col items-start gap-3">
            <p className={HEADING}>Contact</p>
            <a href="tel:+18137317075" className={`${FOOTER_LINK} tabular-nums`}>
              (813) 731-7075
            </a>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={FOOTER_LINK}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/5 text-[10px] text-ivory/20 tracking-[0.4em]">
          © 2026 VOXA STUDIOS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  )
}
