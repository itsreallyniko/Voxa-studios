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

export const testimonialVideosTampa: OnsitePage = {
  slug: 'testimonial-videos-tampa',
  draft: false,
  seo: {
    title: 'Testimonial Videos in Tampa — Voxa On-Site',
    description:
      'Patient and client testimonial videos filmed on-site across Tampa Bay. Producer-led, multi-cam, broadcast audio. Quote per project.',
    ogImage: '/og/onsite/testimonial-videos-tampa.jpg',
  },
  hero: {
    eyebrow: 'VOXA ON-SITE · TAMPA',
    headline: 'Client stories, filmed where the work happens.',
    subline:
      'Producer-led testimonial shoots at your office or clinic — multi-camera, broadcast audio, teleprompter on request.',
    muteLoopVideo: null,
  },
  proof: [
    { kind: 'logo', placeholder: true, label: 'Client logo' },
    { kind: 'logo', placeholder: true, label: 'Client logo' },
    { kind: 'logo', placeholder: true, label: 'Client logo' },
    { kind: 'stat', placeholder: true, label: 'Headline stat' },
  ],
  problem: {
    heading: 'Trust is hard to build in a brochure.',
    paragraphs: [
      'Prospective clients want to hear from someone who sat in the chair before them. A real story, told plainly, outperforms every polished ad.',
      'Most teams know this and still never ship testimonials. Scheduling patients, finding a quiet room, running the gear, directing nervous people — it stalls out before anyone presses record.',
      'Voxa On-Site handles the whole day. You line up the people. A producer runs the shoot in a corner of your space, and you get stories that sound like your actual clients.',
    ],
  },
  deliverables: {
    heading: 'What we film for you',
    cards: [
      {
        title: 'Patient and client testimonials',
        body: 'Real stories told on camera, cut as polished films you can send to prospects.',
      },
      {
        title: 'Short vertical clips',
        body: 'Resized for Instagram, TikTok, and YouTube Shorts, caption-safe.',
      },
      {
        title: 'Horizontal cutdowns',
        body: 'For your website hero, YouTube, and paid ads.',
      },
      {
        title: 'A founder or practitioner interview',
        body: 'Shot on the same day so your voice is paired with your clients’.',
      },
    ],
  },
  packages: ['interview-session', 'content-day', 'commercial'],
  howItWorks: {
    heading: 'How it works',
    steps: [
      {
        title: 'Brief call',
        body: 'A short conversation about who you want to film and what the finished pieces are for.',
      },
      {
        title: 'Plan',
        body: 'A shot list, run of show, and interview questions tailored to your clients.',
      },
      {
        title: 'Shoot day',
        body: 'A producer and crew arrive, set up in a corner of your space, and run the day end to end.',
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
  form: { preselect: 'interview' },
}
