export type StudioSet = {
  id: string
  name: string
  description: string
  bestFor: string[]
  equipment: string[]
  capacity: { seats: number; label: string }
  heroImage: string
  gallery: string[]
  exampleContent: { thumb: string; label: string }[]
}

export type Collection = {
  id: 'executive' | 'horizon'
  name: string
  tagline: string
  audience: string[]
  visualTraits: string[]
  heroImage: string
  sets: StudioSet[]
  comingSoon?: boolean
}

const EXEC_DIR = '/executive'
const POD_PREVIEW = `${EXEC_DIR}/Gallery Images Podcast/Preview_Podcast.JPG`
const POD_PREVIEW_ALT = `${EXEC_DIR}/Gallery Images Podcast/Preview_Pod.JPG`
const POD_BTS = `${EXEC_DIR}/Gallery Images Podcast/BTS_Podcast_side2.JPG`
const DESK_PREVIEW = `${EXEC_DIR}/Gallery Images Desk/Preview_Desk.JPG`
const DESK_SIDE = `${EXEC_DIR}/Gallery Images Desk/Desk_Side.JPG`
const DESK_BTS = `${EXEC_DIR}/Gallery Images Desk/BTS_Desk.JPG`
const CREATOR_PREVIEW = `${EXEC_DIR}/Gallery Images Creator/Preview_Creator3.JPG`
const CREATOR_SIDE = `${EXEC_DIR}/Gallery Images Creator/Preview_Side_creator.JPG`
const CREATOR_BTS = `${EXEC_DIR}/Gallery Images Creator/BTS_Creator.JPG`

// TODO: Replace with real Horizon photography once the set is built.
const HORIZON_HERO = '/horizon/coming-soon.jpg'
const HORIZON_CLIP = '/horizon/coming-soon.jpg'

export const collections: Collection[] = [
  {
    id: 'executive',
    name: 'Executive Collection',
    tagline: 'Dark, cinematic, authority-focused environments.',
    audience: ['Founders', 'Consultants', 'Financial advisors', 'Attorneys', 'Coaches', 'Business owners'],
    visualTraits: [
      'Dark charcoal backgrounds',
      'Warm practical lighting',
      'Leather accents',
      'Black bookshelves',
      'Executive office aesthetic',
    ],
    heroImage: POD_PREVIEW,
    sets: [
      {
        id: 'executive-podcast',
        name: 'Executive Podcast Set',
        description:
          'A cinematic two-seat conversation set built for long-form interviews. Warm practical lighting, leather chairs, and a deep obsidian backdrop frame your guest with intentionality.',
        bestFor: ['Long-form interviews', 'Founder conversations', 'Business podcasts'],
        equipment: ['Three-camera coverage', 'Shure SM7B mics', 'Cinema lighting kit'],
        capacity: { seats: 2, label: 'Host + 1 guest' },
        heroImage: POD_PREVIEW,
        gallery: [POD_PREVIEW, POD_PREVIEW_ALT, POD_BTS],
        exampleContent: [
          { thumb: POD_PREVIEW, label: 'High-stakes business dialogue' },
          { thumb: POD_PREVIEW_ALT, label: 'Founder interviews' },
        ],
      },
      {
        id: 'authority-desk',
        name: 'Authority Desk Set',
        description:
          'A solo authority desk styled like a private office. Designed for direct-to-camera delivery — keynote talks, market commentary, expert breakdowns.',
        bestFor: ['VSLs', 'Expert commentary', 'Direct-to-camera talks'],
        equipment: ['Two-camera coverage', 'Lavalier or Shure SM7B mic', 'Teleprompter-ready'],
        capacity: { seats: 1, label: 'Solo presenter' },
        heroImage: DESK_PREVIEW,
        gallery: [DESK_PREVIEW, DESK_SIDE, DESK_BTS],
        exampleContent: [
          { thumb: DESK_PREVIEW, label: 'Modern VSL' },
          { thumb: DESK_SIDE, label: 'Authority shorts' },
        ],
      },
      {
        id: 'authority-creator',
        name: 'Authority Creator Set',
        description:
          'A versatile creator environment with the executive aesthetic — built for short-form, vertical, and horizontal output in the same session.',
        bestFor: ['Short-form clips', 'LinkedIn videos', 'Vertical + horizontal output'],
        equipment: ['Two-camera coverage', 'Lavalier or Shure SM7B mic', 'Teleprompter-ready'],
        capacity: { seats: 1, label: 'Solo creator' },
        heroImage: CREATOR_PREVIEW,
        gallery: [CREATOR_PREVIEW, CREATOR_SIDE, CREATOR_BTS],
        exampleContent: [
          { thumb: CREATOR_PREVIEW, label: 'Authority shorts' },
          { thumb: CREATOR_SIDE, label: 'LinkedIn clips' },
        ],
      },
    ],
  },
  {
    id: 'horizon',
    name: 'Horizon Collection',
    tagline: 'Bright, modern, approachable environments.',
    audience: ['Wellness brands', 'Creators', 'Educators', 'Lifestyle businesses', 'Coaches'],
    visualTraits: ['Bright atmosphere', 'Natural textures', 'Clean modern design', 'Lifestyle aesthetic'],
    heroImage: HORIZON_HERO,
    comingSoon: true,
    sets: [
      {
        id: 'horizon-podcast',
        name: 'Horizon Podcast Set',
        description:
          'A bright two-seat conversation set with natural textures and warm wood accents — designed to feel welcoming and conversational.',
        bestFor: ['Wellness podcasts', 'Lifestyle interviews', 'Educational conversations'],
        equipment: ['Four-camera coverage (4K)', 'Shure SM7B mics', 'Soft daylight lighting', 'Acoustic treatment'],
        capacity: { seats: 2, label: 'Host + 1 guest' },
        heroImage: HORIZON_HERO,
        gallery: [HORIZON_HERO, HORIZON_CLIP, HORIZON_HERO, HORIZON_CLIP],
        exampleContent: [
          { thumb: HORIZON_CLIP, label: 'Wellness shorts' },
          { thumb: HORIZON_HERO, label: 'Lifestyle interviews' },
        ],
      },
      {
        id: 'horizon-desk',
        name: 'Horizon Desk Set',
        description:
          'A bright solo desk with a modern wellness aesthetic. Built for teaching, course content, and lifestyle direct-to-camera delivery.',
        bestFor: ['Online courses', 'Wellness content', 'Educational direct-to-camera'],
        equipment: ['Three-camera coverage', 'Lavalier audio', 'Teleprompter-ready', 'Soft natural lighting'],
        capacity: { seats: 1, label: 'Solo presenter' },
        heroImage: HORIZON_HERO,
        gallery: [HORIZON_HERO, HORIZON_CLIP, HORIZON_HERO, HORIZON_CLIP],
        exampleContent: [
          { thumb: HORIZON_HERO, label: 'Course modules' },
          { thumb: HORIZON_CLIP, label: 'Wellness shorts' },
        ],
      },
      {
        id: 'horizon-creator',
        name: 'Horizon Creator Set',
        description:
          'A creator-friendly bright set with vertical and horizontal capture. Built for high-volume short-form content with a modern wellness feel.',
        bestFor: ['Lifestyle shorts', 'Wellness reels', 'Educational clips'],
        equipment: ['Vertical + horizontal cameras', 'Soft studio lighting', 'On-set monitor', 'Acoustic treatment'],
        capacity: { seats: 1, label: 'Solo creator' },
        heroImage: HORIZON_CLIP,
        gallery: [HORIZON_CLIP, HORIZON_HERO, HORIZON_CLIP, HORIZON_HERO],
        exampleContent: [
          { thumb: HORIZON_CLIP, label: 'Wellness reels' },
          { thumb: HORIZON_HERO, label: 'Lifestyle shorts' },
        ],
      },
    ],
  },
]

export function findCollection(id: string | null): Collection | undefined {
  return collections.find((c) => c.id === id)
}

export function findSet(collectionId: string | null, setId: string | null): StudioSet | undefined {
  if (!collectionId || !setId) return undefined
  return findCollection(collectionId)?.sets.find((s) => s.id === setId)
}
