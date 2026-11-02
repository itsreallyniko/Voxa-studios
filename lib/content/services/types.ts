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
  // The first image leads the page; the rest sit after the sections.
  // `wide` keeps a landscape photo at full width instead of a portrait crop.
  images: { src: string; alt: string; caption?: string; wide?: boolean }[]
  sections: { heading: string; body: string[] }[]
  delivery: string
  related?: { href: string; label: string }
  reviewTag: ServiceTag
  faqs: { question: string; answer: string }[]
}
