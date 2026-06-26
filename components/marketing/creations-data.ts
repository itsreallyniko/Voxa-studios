export type Creation = {
  src: string
  alt: string
  aspect: '16:9' | '9:16'
  set: string
  byline: string
  credential?: string
  // Overrides the default object-position (center) for object-cover on the
  // mobile snap carousel. Use 'left' when the source image has important
  // content on its left edge that center-cropping would lose (e.g., NYT logo).
  objectPosition?: 'left' | 'center' | 'right'
}

export const creations: Creation[] = [
  {
    src: '/creations/matt_thecloser.jpg',
    alt: 'Matt at the Authority Desk',
    aspect: '16:9',
    set: 'AUTHORITY DESK',
    byline: '@matt_thecloser',
    credential: 'Founder, Novations',
  },
  {
    src: '/creations/NYT_Anna_paulina_luna.jpg',
    alt: 'Anna Paulina Luna on Interesting Times at the Executive Podcast Set',
    aspect: '16:9',
    set: 'EXECUTIVE PODCAST SET',
    byline: 'Interesting Times · NYT',
    credential: 'U.S. Rep. · Florida',
  },
  {
    src: '/creations/NYT_Ross_Douthat.jpg',
    alt: 'Ross Douthat filming Interesting Times on the Executive Podcast Set',
    aspect: '16:9',
    set: 'EXECUTIVE PODCAST SET',
    byline: 'Interesting Times · NYT',
    credential: 'NYT Columnist',
  },
  {
    src: '/creations/julietteastor.jpg',
    alt: 'Juliette Astor on the Executive Creator Set',
    aspect: '9:16',
    set: 'EXECUTIVE CREATOR SET',
    byline: '@julietteastor',
    credential: 'MD · Founder, Terra Wellness',
  },
  {
    src: '/creations/mirandacohenfit.png',
    alt: 'Miranda Cohen on the Executive Creator Set',
    aspect: '9:16',
    set: 'EXECUTIVE CREATOR SET',
    byline: '@mirandacohenfit',
    credential: '5M+ followers',
  },
  {
    src: '/creations/Jasonkalambay.jpg',
    alt: 'Jason Kalambay on the Executive Creator Set',
    aspect: '16:9',
    set: 'EXECUTIVE CREATOR SET',
    byline: '@jasonkalambay',
    credential: 'Founder · 1M+ followers',
  },
]
