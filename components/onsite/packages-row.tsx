import type { PackageId } from '@/lib/content/onsite/types'
import { getPackage } from '@/lib/content/onsite/packages'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { OnsiteSection } from './onsite-section'

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 mt-1.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function PackagesRow({
  packageIds,
  formAnchor = '#quote',
}: {
  packageIds: PackageId[]
  formAnchor?: string
}) {
  const packages = packageIds.map(getPackage).filter(Boolean) as NonNullable<
    ReturnType<typeof getPackage>
  >[]

  return (
    <OnsiteSection
      eyebrow="PACKAGES THAT FIT"
      heading="Three ways to work with us on-site."
      tone="surface"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {packages.map((pkg, i) => (
          <Reveal key={pkg.id} delay={i * 80}>
            <article className="h-full flex flex-col bg-surface-container-low liquid-glass p-8">
              <h3 className="text-headline-md text-white mb-2 leading-tight">
                {pkg.name}
              </h3>
              <p className="text-metadata uppercase tracking-[0.2em] text-heritage-gold mb-6">
                {pkg.shape}
              </p>

              <div className="mb-6">
                <p className="text-label-caps text-ivory/50 mb-3">INCLUDES</p>
                <ul className="flex flex-col gap-3">
                  {pkg.includes.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-ivory/85 text-sm leading-relaxed"
                    >
                      <span className="text-heritage-gold">
                        <CheckIcon />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <p className="text-label-caps text-ivory/50 mb-3">YOU GET</p>
                <ul className="flex flex-col gap-3">
                  {pkg.deliverables.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-ivory/85 text-sm leading-relaxed"
                    >
                      <span className="text-heritage-gold">
                        <CheckIcon />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <a href={formAnchor} className="block">
                  <Button variant="gold" size="md" className="w-full">
                    Get a quote
                  </Button>
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </OnsiteSection>
  )
}
