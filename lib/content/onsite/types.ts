export type PackageId = 'interview-session' | 'content-day' | 'commercial'

export type OnsitePackage = {
  id: PackageId
  name: string
  shape: string
  includes: string[]
  deliverables: string[]
}

export type FaqItem = { q: string; a: string }

export type ProofSlot =
  | { kind: 'logo'; placeholder: true; label?: string }
  | { kind: 'stat'; placeholder: true; label?: string }
  | { kind: 'quote'; placeholder: true; label?: string }
  | { kind: 'logo'; name: string; logo?: string; preview?: boolean; placeholder?: false }

export type CrewSlot =
  | { role: string; placeholder: true }
  | {
      role: string
      name: string
      subtitle?: string
      bio: string
      photo: string
      preview?: boolean
      placeholder?: false
    }

export type CaseSlot =
  | { title: string; placeholder: true }
  | {
      client: string
      title: string
      type: string
      description: string
      /** Optional override. YouTube and Vimeo thumbnails are looked up from href. */
      thumbnail?: string
      /** A YouTube or Vimeo link plays on the page; anything else links out. */
      href: string
      stills?: { src: string; alt: string }[]
      preview?: boolean
      placeholder?: false
    }

export type ProjectType =
  | 'interview'
  | 'content-day'
  | 'event'
  | 'commercial'
  | 'brand'
  | 'presentation'
  | 'not-sure'

export type HowItWorksStep = { title: string; body: string }

export type OnsitePage = {
  slug: string
  draft: boolean
  /** Short "FOR …" label used on the hub listing card. Keep it specific. */
  buyerLabel: string
  seo: {
    title: string
    description: string
    ogImage: string
  }
  hero: {
    eyebrow: string
    headline: string
    subline: string
    muteLoopVideo: string | null
    muteLoopPoster?: string
  }
  proof: ProofSlot[]
  problem: { heading: string; paragraphs: string[] }
  deliverables: {
    heading: string
    cards: { title: string; body: string }[]
  }
  packages: PackageId[]
  howItWorks: { heading: string; steps: HowItWorksStep[] }
  cases: CaseSlot[]
  crew: CrewSlot[]
  serviceArea: { cities: string[]; travelLine: string }
  faq: FaqItem[]
  form: { preselect: ProjectType }
}
