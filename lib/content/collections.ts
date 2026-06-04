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
}

// TODO: Replace these Google Stitch image URLs with real studio photos.
const EXEC_HERO = 'https://lh3.googleusercontent.com/aida/ADBb0uguU3aRNlIrIJ_xaLArr_tn0lICCAVvMdGJOqOFBvjLZoxCy5TE2mbBQlSc0jW7wkfWsrEvIuvyBGNzR83SYcflOe_0yZWu3cwd0MGh46fzNBco3iVIC7WEULB32bWF7Lr2H-8goZ4MpxTM64kJ0CdQNu5Bduojo9XdT6qnE7RNhKVT6-Td93dLUrIifsoQGhJNWjo174qsii9uRQkgzoD2ytr_wo4dfTcL_u2oYwod9ym8MKH8yHpOmN-6'
const EXEC_PODCAST = 'https://lh3.googleusercontent.com/aida/ADBb0ujLcrq63oSH9hG1W7Q80njg9KkTskwoS9XdZeNWyv_fl-TzzKJ9oNFquAxxNau5UOwo-dptHSCqX7mV6hLX5KSzYf1SrReRal2CxzPwHXUwVV2_NoFGG9Vf69fX5bRmtASsMRO66wCycTpT_nJlHm6CMf2mHUT8ajt6rvbRdtR8fali7VgKCD8OysURWNv12nsvNbTZ3PE1R8ipFOSBkCqxASsAVuMnCfGxy5s5TViftfox3hazK6CaUMoX'
const HORIZON_HERO = 'https://lh3.googleusercontent.com/aida/ADBb0ujOG5lOECLnhvFgTXRviMraX_PmwQ-wbztKdNrbLdhexTRjSvDVJ0GSNReX3GGiQkyKZTsDy6XofPCpnqTdrCrddPnSy1L-nlwXlHg2ioy91AWyRB_3pOYnT-JL8QRTV3UbRB4nyv4MweKnKrqqHMDpFDtxiU4vs_eWckBWuvpt9rW49nZOy2FDYKDzjGMMwXa5kf8TXb5l2dCJSSsEo1gPJXjcrk1yd-eaKX9bZRKVB4bxvV5JylTyHigb'
const HORIZON_CLIP = 'https://lh3.googleusercontent.com/aida/ADBb0ujkabd-Yg9HDPoXBdp7TCrj8S4AhRxU8pPjoC8xTNSwxfd7Fhpe_Ou_YT8G5HBPPTjwu7IIuuBBXHMj2ozpsqu42ivCQegGcn0p9CC7-JpnxzYE3ru4FFAGYuCy6JT8i4XE1wxMCRLi2hCrQydr7TpIAGOXh7xcrxh83TKruaZTjBMtzd8PYg9GXS12MbXcjmub6R9eF65to1FipzfGzj1E4wIDA3lZ9FI_IykSBzeiiLUrhIoWGNY8mnmk'
const VSL_CLIP = 'https://lh3.googleusercontent.com/aida/ADBb0ujh_-_KPb1gaBBupVqxJHlALCSqJQW_AJ__fgrBP1mcuvk9RDeXMfk9dxVjjJPwzaJaEMB0Xt40PZEHrasLoEddE8M_QUNwgidJghMh7c6HMgZRxlQ3HueIxCfyVgoLPlUHTRVQmOrxQjVbw8PRPYAFK4d9kQ42FUFsMgTUjsvkfv8DhSyGDZGdFo4jAyUmrnb08caYjQQQ44ogzJfmUe5TfwBgBT3xcdiFWrZwm8mNJJw6lhTHQ7mV5vf5'

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
    heroImage: EXEC_HERO,
    sets: [
      {
        id: 'executive-podcast',
        name: 'Executive Podcast Set',
        description:
          'A cinematic two-seat conversation set built for long-form interviews. Warm practical lighting, leather chairs, and a deep obsidian backdrop frame your guest with intentionality.',
        bestFor: ['Long-form interviews', 'Founder conversations', 'Business podcasts'],
        equipment: ['Four-camera coverage (4K)', 'Shure SM7B mics', 'Cinema lighting kit', 'Acoustic-treated room'],
        capacity: { seats: 2, label: 'Host + 1 guest' },
        heroImage: EXEC_PODCAST,
        gallery: [EXEC_PODCAST, EXEC_HERO, EXEC_PODCAST, EXEC_HERO],
        exampleContent: [
          { thumb: HORIZON_CLIP, label: 'High-stakes business dialogue' },
          { thumb: EXEC_HERO, label: 'Founder interviews' },
        ],
      },
      {
        id: 'authority-desk',
        name: 'Authority Desk Set',
        description:
          'A solo authority desk styled like a private office. Designed for direct-to-camera delivery — keynote talks, market commentary, expert breakdowns.',
        bestFor: ['VSLs', 'Expert commentary', 'Direct-to-camera talks'],
        equipment: ['Three-camera coverage', 'Lavalier + boom audio', 'Teleprompter-ready', 'Editorial lighting'],
        capacity: { seats: 1, label: 'Solo presenter' },
        heroImage: EXEC_HERO,
        gallery: [EXEC_HERO, EXEC_PODCAST, EXEC_HERO, EXEC_PODCAST],
        exampleContent: [
          { thumb: VSL_CLIP, label: 'Modern VSL' },
          { thumb: EXEC_HERO, label: 'Authority shorts' },
        ],
      },
      {
        id: 'authority-creator',
        name: 'Authority Creator Set',
        description:
          'A versatile creator environment with the executive aesthetic — built for short-form, vertical, and horizontal output in the same session.',
        bestFor: ['Short-form clips', 'LinkedIn videos', 'Vertical + horizontal output'],
        equipment: ['Vertical + horizontal cameras', 'Studio lighting', 'On-set monitor', 'Acoustic treatment'],
        capacity: { seats: 1, label: 'Solo creator' },
        heroImage: EXEC_PODCAST,
        gallery: [EXEC_PODCAST, EXEC_HERO, EXEC_PODCAST, EXEC_HERO],
        exampleContent: [
          { thumb: EXEC_HERO, label: 'Authority shorts' },
          { thumb: HORIZON_CLIP, label: 'LinkedIn clips' },
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
