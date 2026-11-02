// DRAFT COPY — awaiting Niko's review. See handoff list at end of session.
import { FILM_TYPES } from './film-types'
import type { CrewSlot, FaqItem, HowItWorksStep, ProofSlot } from './types'


export const onsiteHub = {
  seo: {
    title: 'Voxa On-Site — Mobile Production in Tampa Bay',
    description:
      'The Voxa studio, wherever you are. Producer-led on-site video for Tampa Bay businesses — commercials, event films, testimonials, brand films, and more.',
    ogImage: '/og/onsite/hub.jpg',
  },
  hero: {
    eyebrow: 'VOXA ON-SITE',
    headline: 'Video production for Tampa Bay businesses.',
    subline:
      'We bring the crew to you: a producer, multiple cameras, broadcast audio, lighting, and teleprompter at your office, clinic, event, or job site.',
    muteLoopVideo: '/onsite/hero-reel.mp4' as string | null,
    muteLoopPoster: '/onsite/hero-reel-poster.jpg',
    secondaryCta: { label: 'See the work', href: '/onsite/work' },
  },
  proof: [
    { kind: 'logo', name: 'Byron Donalds' },
    { kind: 'logo', name: 'Florida Education News' },
    { kind: 'logo', name: 'Nothing\'s Off The Table' },
    { kind: 'logo', name: 'Friendship Cars' },
    { kind: 'logo', name: 'Songo Skateboards' },
    { kind: 'logo', name: 'White Water Life' },
    { kind: 'logo', name: 'Grillsmith' },
    { kind: 'logo', name: 'Common Spirit' },
    { kind: 'logo', name: 'Weylman' },
    { kind: 'logo', name: 'JKA Maine' },
  ] satisfies ProofSlot[],
  studioNote: {
    text: 'Voxa\'s Tampa studio has also hosted Rep. Anna Paulina Luna and Ross Douthat of The New York Times.',
    cta: 'See the studio',
    href: '/',
  },
  films: {
    eyebrow: 'ONE PIECE THAT LASTS',
    heading: 'One polished film, built for the job it has to do.',
    body: 'Every project is scoped to fit, and many land somewhere between these. Each film can also include short cutdowns sized for your site, ads, and social.',
    items: FILM_TYPES,
    cta: 'See the work',
    href: '/onsite/work',
    unsure: 'Not sure which fits? Tell us what you are after.',
  },
  gallery: {
    eyebrow: 'FROM THE FIELD',
    heading: 'Frames from our team\'s past shoots.',
    frames: [
      {
        src: '/onsite/cases/common-spirit-closeup.webp',
        alt: 'Close angle of a speaker in a blue blazer during an address',
      },
      {
        src: '/onsite/cases/jka-maine-closeup.jpg',
        alt: 'Karate instructor demonstrating a technique on a student, shot through the crowd',
      },
      {
        src: '/onsite/cases/spec-profiles.webp',
        alt: 'Two women in warm evening light, shot in close profile',
        label: 'SPEC',
      },
      {
        src: '/onsite/cases/spec-garden.webp',
        alt: 'A father and daughter planting flowers together, close on their hands',
        label: 'SPEC',
      },
      {
        src: '/onsite/cases/brand-painter-river.webp',
        alt: 'Artist Tricia Sham in a green sweater painting a portrait beside the Hillsborough River in Tampa',
      },
    ],
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
  ] satisfies CrewSlot[],
  faq: [
    {
      q: 'What does Voxa On-Site do?',
      a: 'Voxa On-Site is a Tampa Bay video production service that comes to you. We bring a producer, cameras, lighting, audio, and a teleprompter to your location to film commercials, event films, interviews and testimonials, brand and founder films, and on-camera presentations like sales videos, courses, and demos.',
    },
    {
      q: 'What areas of Tampa Bay do you serve?',
      a: 'We film across Tampa Bay, including Tampa, St. Petersburg, Clearwater, Brandon, Wesley Chapel, and Sarasota. Somewhere farther out? We travel too, and we\'ll include any travel in your proposal so there are no surprises.',
    },
    {
      q: 'How much does video production cost in Tampa?',
      a: 'It depends on what you\'re making, how much crew and filming it needs, and how many finished pieces you want. We quote each project individually after a short call. Share a rough budget in the form below and we\'ll tell you honestly what it can cover.',
    },
    {
      q: 'How long does it take to get my finished video?',
      a: 'It depends on the size of the project and how many pieces we\'re cutting. We agree on a delivery date in your proposal before filming starts. If you have a launch or event deadline, tell us up front and we\'ll plan around it.',
    },
    {
      q: 'What do I need to prepare for a shoot?',
      a: 'Not much. For most shoots, you just need power and a reasonably quiet space, and we bring all the gear. Before the shoot, we\'ll walk you through the plan so everyone knows what to expect.',
    },
    {
      q: 'Do I need a script?',
      a: 'Not necessarily. If you or your marketing team already have a script, talking points, or creative brief, we can work from those. If not, we draft interview questions with you ahead of time and plan scripts for commercials and presentations together. A teleprompter is available for anyone who wants one.',
    },
    {
      q: 'Can you work with our in-house marketing team or agency?',
      a: 'Yes. Voxa On-Site can work as an extension of your marketing team or agency, filming from your brief, brand guidelines, and campaign plan. Your team keeps the strategy and message, and we handle production at your location. Tell us what your team needs, whether that\'s a finished edit or footage to fit into a wider campaign, and we\'ll scope the project around it.',
    },
    {
      q: 'What if I\'m nervous on camera?',
      a: 'That\'s completely normal, and most people aren\'t professional presenters. Our producer guides you through the shoot, and you\'re welcome to take another pass at anything that doesn\'t feel right.',
    },
    {
      q: 'Can one shoot give me videos for my website, ads, and social media?',
      a: 'Yes. A film can also include short cutdowns sized for your site, ads, and social, so one shoot goes further. Tell us where the video will run and we\'ll plan the shoot and edit with those places in mind.',
    },
    {
      q: 'Who owns the footage?',
      a: 'Ownership and usage rights are written into your proposal, so you\'ll know exactly where you can use your videos before we film anything.',
    },
    {
      q: 'What\'s the difference between Voxa On-Site and the Voxa studio?',
      a: 'The Voxa studio is our Tampa location, with ready-to-use sets you can book for podcasts and content. On-Site brings the production to you, which is ideal when your space, your team, or your event is part of the story.',
    },
  ] satisfies FaqItem[],
  finalCta: {
    heading: 'Tell us about your project.',
    body: 'A short brief gets you a tailored quote. Prefer to talk it through? Book a fifteen-minute call.',
  },
}
