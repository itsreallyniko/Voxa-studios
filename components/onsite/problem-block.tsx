import { OnsiteSection } from './onsite-section'

export function ProblemBlock({
  heading,
  paragraphs,
}: {
  heading: string
  paragraphs: string[]
}) {
  return (
    <OnsiteSection eyebrow="THE PROBLEM" heading={heading}>
      <div className="max-w-3xl flex flex-col gap-6">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-body-lg text-ivory/75 leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </OnsiteSection>
  )
}
