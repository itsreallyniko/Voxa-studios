import type { EditLevel, PackageConfig, PackageType } from '@/lib/packages/pricing'
import type { ServiceTag } from '@/lib/content/reviews'

export type PackagePage = {
  slug: PackageType
  title: string
  description: string
  eyebrow: string
  headline: string
  story: { anonymous: string[]; named?: string[]; useNamed: boolean }
  whatYouGet: { heading: string; body: string }[]
  videoNoun: { one: string; many: string }
  defaults: PackageConfig
  levelPreviews: Record<EditLevel, string | null>
  editingOnlyNote: string
  reviewTag: ServiceTag
  faqs: { question: string; answer: string }[]
}
