import { OnsiteSection } from './onsite-section'

export function ServiceArea({
  cities,
  travelLine,
}: {
  cities: string[]
  travelLine: string
}) {
  return (
    <OnsiteSection
      eyebrow="SERVICE AREA"
      heading="Based in Tampa. Working across the bay."
      tone="surface"
    >
      <div className="max-w-3xl">
        <ul className="flex flex-wrap gap-x-6 gap-y-3 mb-6">
          {cities.map((c) => (
            <li
              key={c}
              className="text-body-lg text-white border-b border-heritage-gold/40 pb-1"
            >
              {c}
            </li>
          ))}
        </ul>
        <p className="text-body-md text-ivory/55">{travelLine}</p>
      </div>
    </OnsiteSection>
  )
}
