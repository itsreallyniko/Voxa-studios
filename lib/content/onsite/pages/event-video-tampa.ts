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

export const eventVideoTampa: OnsitePage = {
  slug: 'event-video-tampa',
  draft: false,
  seo: {
    title: 'Event Video in Tampa — Voxa On-Site',
    description:
      'Multi-camera event coverage across Tampa Bay. Keynotes, panels, galas, and company kickoffs — producer-led from the room.',
    ogImage: '/og/onsite/event-video-tampa.jpg',
  },
  hero: {
    eyebrow: 'VOXA ON-SITE · TAMPA',
    headline: 'Multi-camera coverage of your room, your speakers, and the day.',
    subline:
      'Keynotes, panels, and company kickoffs captured by a producer-led crew — plus a recap film and speaker clips to post afterward.',
    muteLoopVideo: null,
  },
  proof: [
    { kind: 'logo', placeholder: true, label: 'Association or sponsor logo' },
    { kind: 'logo', placeholder: true, label: 'Association or sponsor logo' },
    { kind: 'logo', placeholder: true, label: 'Association or sponsor logo' },
    { kind: 'stat', placeholder: true, label: 'Headline stat' },
  ],
  problem: {
    heading: 'An event lands once. The video is how it lasts.',
    paragraphs: [
      'The room sees the keynote once. Sponsors see the recap. Members see the clips in their feed. Prospective attendees see the sizzle before next year’s ticket goes on sale.',
      'Most event teams end up with a single wide-angle recording and no highlight reel. The talent that paid to be there, the stage design that cost real money, the moments that actually landed — none of it travels.',
      'Voxa On-Site shows up with a producer and a multi-camera plan built around your run of show, and leaves you with pieces you can actually use.',
    ],
  },
  deliverables: {
    heading: 'What we film for you',
    cards: [
      {
        title: 'Keynote and panel coverage',
        body: 'Multi-camera capture synchronized with your audio feed so talks edit cleanly.',
      },
      {
        title: 'A recap film',
        body: 'A short highlight piece that captures the arc of the day for sponsors, members, and next year’s promo.',
      },
      {
        title: 'Speaker clips',
        body: 'Standalone cuts of key moments, sized for the speakers and your social channels.',
      },
      {
        title: 'Room, atmosphere, and sponsors',
        body: 'B-roll of the venue, attendees, and sponsor activations captured on the floor.',
      },
    ],
  },
  packages: ['content-day', 'interview-session', 'commercial'],
  howItWorks: {
    heading: 'How it works',
    steps: [
      {
        title: 'Brief call',
        body: 'A short conversation about the event, the stage, and what the finished pieces are for.',
      },
      {
        title: 'Plan',
        body: 'A shot list and run of show, cam positions, and interview questions for green-room pulls.',
      },
      {
        title: 'Event day',
        body: 'A producer and crew work from your run of show, capture the room, and pull speakers between sessions.',
      },
      {
        title: 'Edit and delivery',
        body: 'Recap, speaker cuts, and selects delivered on a timeline agreed in your proposal.',
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
    { role: 'Director of photography', placeholder: true },
  ],
  serviceArea: {
    cities: SERVICE_CITIES,
    travelLine: 'Travel available beyond Tampa Bay.',
  },
  faq: [
    {
      q: 'How does pricing work?',
      a: 'Quoted per project after a short call. Scope depends on your run of show and how many pieces you want cut afterward.',
    },
    {
      q: 'How soon can we post the recap?',
      a: 'The delivery timeline is set in the proposal for each event, based on the pace you need afterward.',
    },
    {
      q: 'Do you work with our AV team?',
      a: 'Yes. We coordinate with your AV lead on audio feeds, stage positions, and timing so nothing gets in the way of the show.',
    },
    {
      q: 'Can we interview speakers between sessions?',
      a: 'Yes. We can run a small green-room setup for speaker pulls — plan it in during the brief call.',
    },
    {
      q: 'Do you provide a livestream?',
      a: 'Livestream is scoped per project. Let us know in the brief call and we will include it in the proposal.',
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
  form: { preselect: 'event' },
}
