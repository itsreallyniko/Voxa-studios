export type Creation = {
  src: string
  alt: string
  aspect: '16:9' | '9:16'
  set: string
  byline: string
}

export const creations: Creation[] = [
  {
    src: '/creations/matt_thecloser.jpg',
    alt: 'Matt at the Authority Desk',
    aspect: '16:9',
    set: 'AUTHORITY DESK',
    byline: '@matt_thecloser',
  },
  {
    src: '/creations/NYT_Ross_Douthat.jpg',
    alt: 'Ross Douthat filming Interesting Times on the Executive Podcast Set',
    aspect: '16:9',
    set: 'EXECUTIVE PODCAST SET',
    byline: 'Interesting Times · NYT',
  },
  {
    src: '/creations/NYT_Anna_paulina_luna.jpg',
    alt: 'Anna Paulina Luna on Interesting Times at the Executive Podcast Set',
    aspect: '16:9',
    set: 'EXECUTIVE PODCAST SET',
    byline: 'Interesting Times · NYT',
  },
  {
    src: '/creations/julietteastor.jpg',
    alt: 'Juliette Astor on the Executive Creator Set',
    aspect: '9:16',
    set: 'EXECUTIVE CREATOR SET',
    byline: '@julietteastor',
  },
  {
    src: '/creations/mirandacohenfit.png',
    alt: 'Miranda Cohen on the Executive Creator Set',
    aspect: '9:16',
    set: 'EXECUTIVE CREATOR SET',
    byline: '@mirandacohenfit',
  },
  {
    src: '/creations/Jasonkalambay.jpg',
    alt: 'Jason Kalambay on the Executive Creator Set',
    aspect: '16:9',
    set: 'EXECUTIVE CREATOR SET',
    byline: '@jasonkalambay',
  },
]
