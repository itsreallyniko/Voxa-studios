import type { ServiceTag } from '@/lib/content/reviews'

export type ServicePage = {
  slug: string
  published: boolean
  lastModified: string
  navLabel: string
  title: string
  description: string
  h1: string
  directAnswer: string
  sections: { heading: string; body: string[] }[]
  delivery: string
  reviewTag: ServiceTag
  faqs: { question: string; answer: string }[]
}
