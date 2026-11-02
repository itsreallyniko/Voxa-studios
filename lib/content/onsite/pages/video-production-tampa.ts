// DRAFT COPY — awaiting Niko's review. See handoff list at end of session.
import { FILM_TYPES } from '../film-types'
import { onsiteHub } from '../hub'
import type { OnsitePage } from '../types'

const SERVICE_CITIES = [
  'Tampa',
  'St. Petersburg',
  'Clearwater',
  'Brandon',
  'Wesley Chapel',
  'Sarasota',
]

export const videoProductionTampa: OnsitePage = {
  slug: 'video-production-tampa',
  draft: true,
  buyerLabel: 'For businesses buying one polished piece that lasts',
  seo: {
    title: 'Commercial, Event & Brand Video in Tampa — Voxa On-Site',
    description:
      'Polished commercials, event films, testimonials, and brand films shot on-site across Tampa Bay. One cornerstone piece, scoped to fit the job it has to do.',
    ogImage: '/og/onsite/video-production-tampa.jpg',
  },
  hero: {
    eyebrow: 'VOXA ON-SITE · TAMPA',
    headline: 'One polished film, built for the job it has to do.',
    subline:
      'Commercials, event films, interviews, brand films, and on-camera presentations, filmed at your location and cut to do real work on your site, in your sales, and in your ads.',
    muteLoopVideo: onsiteHub.hero.muteLoopVideo,
    muteLoopPoster: onsiteHub.hero.muteLoopPoster,
  },
  proof: onsiteHub.proof,
  problem: {
    heading: 'The one piece that actually moves prospects.',
    paragraphs: [
      'Most buying decisions come down to a single piece of video — a client story, a founder on camera, an event worth remembering, a commercial that holds attention. The one you send when someone asks who you are.',
      'Making that piece well is a different job from making a lot of pieces. It needs a plan, a crew that can direct nervous people, lighting that does not look like a webcam, and an edit that respects the viewer.',
      'Voxa On-Site handles the whole day. A producer runs the shoot at your location, and you leave with one cornerstone film that earns its spot on your home page, in your sales conversations, and in your paid ads.',
    ],
  },
  deliverables: {
    heading: 'The films businesses ask for most.',
    cards: FILM_TYPES,
  },
  packages: ['interview-session', 'commercial'],
  howItWorks: {
    heading: 'How it works',
    steps: [
      {
        title: 'Brief call',
        body: 'A short conversation about who or what is on camera and what the finished piece needs to do.',
      },
      {
        title: 'Plan',
        body: 'A shot list, run of show, interview questions or script — whichever the piece calls for.',
      },
      {
        title: 'Shoot day',
        body: 'A producer and crew arrive, set up at your location, and run the day end to end.',
      },
      {
        title: 'Edit and delivery',
        body: 'One polished cornerstone piece plus cutdowns, delivered on a timeline agreed in your proposal.',
      },
    ],
  },
  cases: [
    {
      client: 'Grillsmith Sarasota',
      title: 'A restaurant commercial, told by the chef',
      type: 'Commercial',
      description:
        'A commercial filmed on location at the restaurant, with the chef on camera in the space.',
      thumbnail: '/onsite/cases/grillsmith-sarasota.webp',
      href: 'https://player.vimeo.com/video/706391172?h=74135374a5',
    },
    {
      client: 'Weylman',
      title: 'Speaking straight to the viewer',
      type: 'Presenter video',
      description:
        'A presenter delivering a message directly to camera against a clean studio backdrop.',
      thumbnail: '/onsite/cases/weylman.webp',
      href: 'https://player.vimeo.com/video/782731293?h=f0ac75ccd4',
    },
    {
      client: 'Common Spirit',
      title: 'A leadership address, filmed on two cameras',
      type: 'Leadership message',
      description:
        'A scripted address read from teleprompter, with a wide and a close angle cut together.',
      thumbnail: '/onsite/cases/common-spirit-wide.webp',
      href: 'https://player.vimeo.com/video/823915261?h=18e7682e90',
    },
  ],
  crew: [
    {
      role: 'Founder',
      name: 'Niko Torres',
      subtitle: 'Producer',
      bio:
        'Niko founded Voxa Studios after several years producing video independently, and is your direct point of contact from the first call through final delivery.',
      photo: '/onsite/crew-niko.jpg',
    },
    {
      role: 'Creative Director',
      name: 'Tim Buttner',
      subtitle: 'Cinematographer',
      bio:
        'Drexel Cinema & Television grad. Tampa-based cinematographer, director, and colorist with a decade-plus of interview, event, and brand work across Florida.',
      photo:
        'https://images.squarespace-cdn.com/content/v1/66289645e0a89b5429d7c0b9/b73b694c-2ab1-44ef-8223-405cb69bc098/20240825_IMG02437_2024-selfportrait-digital-1x1.jpg',
    },
  ],
  serviceArea: {
    cities: SERVICE_CITIES,
    travelLine: 'Travel available beyond Tampa Bay.',
  },
  faq: [
    {
      q: 'How does pricing work?',
      a: 'Quoted per project after a short call. Every shoot is a little different, so a flat rate rarely tells the real story.',
    },
    {
      q: 'How long until we get the finished videos?',
      a: 'The delivery timeline is set in the proposal for each project, based on scope and how many pieces you want cut.',
    },
    {
      q: 'Do we need a script?',
      a: 'No. We draft interview questions with you ahead of time and bring a teleprompter if anyone prefers one.',
    },
    {
      q: 'What do you need on site?',
      a: 'A room with power and a reasonably quiet space to film. We bring everything else.',
    },
    {
      q: 'Can you film HIPAA-sensitive settings?',
      a: 'Yes, with the usual care. We coordinate with your team on consents, signage, and what stays off-camera.',
    },
    {
      q: 'Who owns the footage?',
      a: 'Ownership and usage are spelled out in the proposal so there is no ambiguity.',
    },
    {
      q: 'Do you travel outside Tampa Bay?',
      a: 'Yes. Travel is included in the proposal when the location is outside our regular service area.',
    },
    {
      q: 'What about music licensing?',
      a: 'Any music used in the edits is licensed for the agreed use. We handle it.',
    },
    {
      q: 'How many revisions are included?',
      a: 'Revisions are agreed in the proposal, with a clear scope so everyone knows what is in play.',
    },
  ],
  form: { preselect: 'not-sure' },
}
