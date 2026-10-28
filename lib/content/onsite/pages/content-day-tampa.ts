// DRAFT COPY — awaiting Niko's review. See handoff list at end of session.
import type { OnsitePage } from '../types'

const SERVICE_CITIES = [
  'Tampa',
  'St. Petersburg',
  'Clearwater',
  'Brandon',
  'Wesley Chapel',
  'Sarasota',
]

export const contentDayTampa: OnsitePage = {
  slug: 'content-day-tampa',
  draft: false,
  buyerLabel: 'For brands that need to post every week',
  seo: {
    title: 'Content Day in Tampa — Social Video — Voxa On-Site',
    description:
      'One day on-site, weeks of social content filmed. Reels, day-in-the-life sequences, team-on-camera moments, and b-roll — captured in volume for brands with constant social demands.',
    ogImage: '/og/onsite/content-day-tampa.jpg',
  },
  hero: {
    eyebrow: 'VOXA ON-SITE · TAMPA',
    headline: 'A day on-site. Weeks of social, filmed.',
    subline:
      'Vertical-first content capture — reels, day-in-the-life, team on camera. One day with us, a library of pieces to post from for weeks without filming again.',
    muteLoopVideo: null,
  },
  proof: [
    { kind: 'logo', placeholder: true, label: 'Client logo' },
    { kind: 'logo', placeholder: true, label: 'Client logo' },
    { kind: 'logo', placeholder: true, label: 'Client logo' },
    { kind: 'stat', placeholder: true, label: 'Headline stat' },
  ],
  problem: {
    heading: 'Posting every week is a production problem.',
    paragraphs: [
      'The social calendar does not care that you shot one great thing in January. It wants fresh pieces every week — reels, team moments, product in use, something that looks like a human made it that morning.',
      'Trying to film it yourselves eats days you do not have. Hiring a crew for every post is impossible to budget. Most teams end up reposting the same three clips until engagement craters.',
      'Voxa On-Site runs a single day at your location and captures enough vertical content to fill the calendar for weeks. No scripted spot. No hero film. Just a library of pieces built for the feed.',
    ],
  },
  deliverables: {
    heading: 'What we film for you',
    cards: [
      {
        title: 'Short vertical reels',
        body: 'A set of reel-ready clips with your team, product, and space — caption-safe and sized for Instagram, TikTok, and Shorts.',
      },
      {
        title: 'Day-in-the-life sequences',
        body: 'Natural, on-the-move footage of your business doing its thing — the kind of thing that lands in the feed.',
      },
      {
        title: 'Short team-on-camera moments',
        body: 'Quick-hit interview blocks and talking-head clips sized for social, not for your homepage.',
      },
      {
        title: 'A b-roll library and raw selects',
        body: 'Everything we did not cut, organized and handed off so your editor or social lead can keep making pieces for weeks.',
      },
    ],
  },
  packages: ['content-day', 'interview-session', 'commercial'],
  howItWorks: {
    heading: 'How it works',
    steps: [
      {
        title: 'Brief call',
        body: 'A short conversation about what you post, where you post it, and what has worked lately.',
      },
      {
        title: 'Plan',
        body: 'A social-first shot list — reel ideas, team moments, product shots, and day-in-the-life sequences tailored to your calendar.',
      },
      {
        title: 'Shoot day',
        body: 'A producer and crew work through your space all day, capturing in volume for vertical and horizontal.',
      },
      {
        title: 'Edit and delivery',
        body: 'A batch of reels, sequences, and a b-roll library — delivered on a timeline agreed in your proposal.',
      },
    ],
  },
  cases: [
    { title: 'Case study slot', placeholder: true },
    { title: 'Case study slot', placeholder: true },
    { title: 'Case study slot', placeholder: true },
  ],
  crew: [
    { role: 'Producer', placeholder: true },
    {
      role: 'Director of photography',
      name: 'Tim Butt',
      bio:
        'Drexel Cinema & Television grad. Tampa-based cinematographer, director, and colorist with a decade-plus of interview, event, and brand work across Florida.',
      photo:
        'https://images.squarespace-cdn.com/content/v1/66289645e0a89b5429d7c0b9/b73b694c-2ab1-44ef-8223-405cb69bc098/20240825_IMG02437_2024-selfportrait-digital-1x1.jpg',
      preview: true,
    },
  ],
  serviceArea: {
    cities: SERVICE_CITIES,
    travelLine: 'Travel available beyond Tampa Bay.',
  },
  faq: [
    {
      q: 'How does pricing work?',
      a: 'Quoted per project after a short call. The scope depends on how many subjects, how much b-roll, and how many finished pieces you need.',
    },
    {
      q: 'How long until we get the finished videos?',
      a: 'The delivery timeline is set in the proposal for each project, based on scope and the number of pieces we are cutting.',
    },
    {
      q: 'What do you need on site?',
      a: 'A room with power and a reasonably quiet space to film. We bring everything else and work around your team.',
    },
    {
      q: 'Do we need a script?',
      a: 'No. We draft interview questions with you ahead of time and bring a teleprompter if anyone prefers one.',
    },
    {
      q: 'How many finished pieces do we leave with?',
      a: 'Enough to post from for weeks. The exact count depends on the day — we plan it in the proposal and lean on volume over polish.',
    },
    {
      q: 'Can we repeat this on a regular schedule?',
      a: 'Yes. Most teams book a recurring Content Day so there is always fresh vertical in the pipeline.',
    },
    {
      q: 'Can we get a long-form film from this day?',
      a: 'That is a different product. A Content Day is social-first — short, vertical, high-volume. If you need a cornerstone brand film or commercial, we scope it separately.',
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
      q: 'How many revisions are included?',
      a: 'Revisions are agreed in the proposal, with a clear scope so everyone knows what is in play.',
    },
  ],
  form: { preselect: 'content-day' },
}
