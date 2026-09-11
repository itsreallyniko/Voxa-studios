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

const HORIZON_DIR = '/horizon'
const HORIZON_POD_HORIZONTAL = `${HORIZON_DIR}/Gallery Images Podcast/Horizon_Podcast_Horizontal-3.jpg`
const HORIZON_POD_1 = `${HORIZON_DIR}/Gallery Images Podcast/Horizon_Podcast.jpg`
const HORIZON_POD_2 = `${HORIZON_DIR}/Gallery Images Podcast/Horizon_Podcast-2.jpg`
const HORIZON_POD_3 = `${HORIZON_DIR}/Gallery Images Podcast/Horizon_Podcast-3.jpg`
const HORIZON_DESK_HORIZONTAL = `${HORIZON_DIR}/Gallery Images Desk/Horizon_Desk_Horizontal.jpg`
const HORIZON_DESK_VERTICAL = `${HORIZON_DIR}/Gallery Images Desk/Horizon_Desk_Vertical.jpg`
const HORIZON_CREATOR_1 = `${HORIZON_DIR}/Gallery Images Creator/Horizon_Creator_Vertical.jpg`
const HORIZON_CREATOR_2 = `${HORIZON_DIR}/Gallery Images Creator/Horizon_Creator_Vertical-1.jpg`
const HORIZON_CREATOR_3 = `${HORIZON_DIR}/Gallery Images Creator/Horizon_Creator_Vertical-2.jpg`

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
    heroImage: HORIZON_POD_HORIZONTAL,
    sets: [
      {
        id: 'horizon-podcast',
        name: 'Horizon Podcast Set',
        description:
          'A bright two-seat conversation set with natural textures and warm wood accents — designed to feel welcoming and conversational.',
        bestFor: ['Wellness podcasts', 'Lifestyle interviews', 'Educational conversations'],
        equipment: ['Three-camera coverage', 'Shure SM7B mics', 'Soft daylight lighting'],
        capacity: { seats: 2, label: 'Host + 1 guest' },
        heroImage: HORIZON_POD_HORIZONTAL,
        gallery: [HORIZON_POD_HORIZONTAL, HORIZON_POD_1, HORIZON_POD_2, HORIZON_POD_3],
        exampleContent: [
          { thumb: HORIZON_POD_HORIZONTAL, label: 'Lifestyle interviews' },
          { thumb: HORIZON_POD_2, label: 'Wellness shorts' },
        ],
      },
      {
        id: 'horizon-desk',
        name: 'Horizon Desk Set',
        description:
          'A bright solo desk with a modern wellness aesthetic. Built for teaching, course content, and lifestyle direct-to-camera delivery.',
        bestFor: ['Online courses', 'Wellness content', 'Educational direct-to-camera'],
        equipment: ['Two-camera coverage', 'Lavalier or Shure SM7B mic', 'Teleprompter-ready'],
        capacity: { seats: 1, label: 'Solo presenter' },
        heroImage: HORIZON_DESK_HORIZONTAL,
        gallery: [HORIZON_DESK_HORIZONTAL, HORIZON_DESK_VERTICAL],
        exampleContent: [
          { thumb: HORIZON_DESK_HORIZONTAL, label: 'Course modules' },
          { thumb: HORIZON_DESK_VERTICAL, label: 'Wellness shorts' },
        ],
      },
      {
        id: 'horizon-creator',
        name: 'Horizon Creator Set',
        description:
          'A versatile bright creator environment built for short-form, vertical, and horizontal output in the same session.',
        bestFor: ['Lifestyle shorts', 'Wellness reels', 'Educational clips'],
        equipment: ['Two-camera coverage', 'Lavalier or Shure SM7B mic', 'Teleprompter-ready'],
        capacity: { seats: 1, label: 'Solo creator' },
        heroImage: HORIZON_CREATOR_1,
        gallery: [HORIZON_CREATOR_1, HORIZON_CREATOR_2, HORIZON_CREATOR_3],
        exampleContent: [
          { thumb: HORIZON_CREATOR_1, label: 'Wellness reels' },
          { thumb: HORIZON_CREATOR_2, label: 'Lifestyle shorts' },
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
