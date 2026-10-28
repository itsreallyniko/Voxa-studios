// DRAFT COPY — awaiting Niko's review. See handoff list at end of session.
import type { FaqItem, HowItWorksStep } from './types'

export const onsiteHub = {
  seo: {
    title: 'Voxa On-Site — Mobile Production in Tampa Bay',
    description:
      'The Voxa studio, wherever you are. Producer-led on-site video for Tampa Bay businesses — testimonials, events, and brand films.',
    ogImage: '/og/onsite/hub.jpg',
  },
  hero: {
    eyebrow: 'VOXA ON-SITE',
    headline: 'The Voxa studio, wherever you are.',
    subline:
      'Producer-led mobile production — multi-camera, broadcast audio, lighting, and teleprompter brought to your office, clinic, event, or job site.',
    muteLoopVideo: null as string | null,
  },
  howItWorks: {
    heading: 'How Voxa On-Site works',
    steps: [
      {
        title: 'Brief call',
        body: 'A short conversation about what you want to film and what the finished pieces are for.',
      },
      {
        title: 'Plan',
        body: 'A shot list, run of show, and interview questions tailored to your people and your space.',
      },
      {
        title: 'Shoot day',
        body: 'A producer and crew arrive, set up in your space, and run the day end to end.',
      },
      {
        title: 'Edit and delivery',
        body: 'Edits built and delivered on a timeline agreed in your proposal.',
      },
    ] satisfies HowItWorksStep[],
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
      q: 'What do you need on site?',
      a: 'A room with power and a reasonably quiet space to film. We bring everything else.',
    },
    {
      q: 'Do we need a script?',
      a: 'No. We draft interview questions with you ahead of time and bring a teleprompter if anyone prefers one.',
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
      q: 'How does this differ from the Voxa studio?',
      a: 'The studio is a fixed location in Tampa with built-in sets. On-Site is the same producer-led experience brought to your location.',
    },
  ] satisfies FaqItem[],
  finalCta: {
    heading: 'Tell us about your project.',
    body: 'A short brief gets you a tailored quote. Prefer to talk it through? Book a fifteen-minute call.',
  },
}
