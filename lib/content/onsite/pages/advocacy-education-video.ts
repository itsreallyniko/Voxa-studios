// DRAFT COPY — awaiting Niko's review. See handoff list at end of session.
// NOTE: draft page. Excluded from nav, hub listing, and sitemap. Set to noindex.
import type { OnsitePage } from '../types'

const SERVICE_CITIES = [
  'Tampa',
  'St. Petersburg',
  'Clearwater',
  'Brandon',
  'Wesley Chapel',
  'Sarasota',
]

export const advocacyEducationVideo: OnsitePage = {
  slug: 'advocacy-education-video',
  draft: true,
  seo: {
    title: 'Advocacy & Education Video — Voxa On-Site',
    description:
      'On-site video for school districts, education nonprofits, and foundations. Student, teacher, and leader stories captured where the work happens.',
    ogImage: '/og/onsite/advocacy-education-video.jpg',
  },
  hero: {
    eyebrow: 'VOXA ON-SITE',
    headline: 'Education and advocacy stories, told where the work happens.',
    subline:
      'Producer-led on-site video for school districts, education nonprofits, and foundations — classrooms, campuses, and community spaces.',
    muteLoopVideo: null,
  },
  proof: [
    { kind: 'logo', placeholder: true, label: 'Partner logo' },
    { kind: 'logo', placeholder: true, label: 'Partner logo' },
    { kind: 'logo', placeholder: true, label: 'Partner logo' },
    { kind: 'stat', placeholder: true, label: 'Impact stat' },
  ],
  problem: {
    heading: 'The programs are the proof.',
    paragraphs: [
      'Funders, board members, and families want to see what the work actually looks like. Classroom moments, student voice, program leaders explaining what changed and why — that is the story that moves people.',
      'Most teams know this and still rely on photos and stock footage. Filming inside schools and programs needs trust, scheduling, consent forms, and a crew that reads the room.',
      'Voxa On-Site shows up as a small, calm presence, follows your protocols, and comes back with pieces you can use in reports, campaigns, and board meetings.',
    ],
  },
  deliverables: {
    heading: 'What we film for you',
    cards: [
      {
        title: 'Student, teacher, and leader interviews',
        body: 'Program voices on camera, cut as polished films for reports and campaigns.',
      },
      {
        title: 'Classroom and program footage',
        body: 'B-roll of the program in motion, captured with care around consents and routines.',
      },
      {
        title: 'Short clips',
        body: 'Resized for social, email, and board decks.',
      },
      {
        title: 'A hero piece',
        body: 'A longer film that holds the arc of the program for funders and galas.',
      },
    ],
  },
  packages: ['content-day', 'interview-session', 'commercial'],
  howItWorks: {
    heading: 'How it works',
    steps: [
      {
        title: 'Brief call',
        body: 'A conversation about the program, the people involved, and what the finished pieces are for.',
      },
      {
        title: 'Plan',
        body: 'A shot list, run of show, interview questions, and the consent process agreed with your team.',
      },
      {
        title: 'Shoot day',
        body: 'A small crew works inside your spaces, following your protocols and routines.',
      },
      {
        title: 'Edit and delivery',
        body: 'Edits built and delivered on a timeline agreed in your proposal.',
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
      a: 'Quoted per project after a short call. Nonprofit, foundation, and district budgets are all different, so we price to the scope you need.',
    },
    {
      q: 'How long until we get the finished videos?',
      a: 'The delivery timeline is set in the proposal for each project, based on scope and how many pieces you want cut.',
    },
    {
      q: 'How do you handle consent for minors?',
      a: 'We follow your consent process. Signed releases are collected before filming and we only capture what is cleared.',
    },
    {
      q: 'What does the crew look like inside a school?',
      a: 'Small and calm. Typically a producer and a director of photography, moving quietly between spaces.',
    },
    {
      q: 'Can we use the footage in grant applications?',
      a: 'Yes. Ownership and usage are spelled out in the proposal so your reports and applications are covered.',
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
  form: { preselect: 'content-day' },
}
