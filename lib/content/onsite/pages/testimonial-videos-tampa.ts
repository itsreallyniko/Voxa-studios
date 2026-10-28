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
  buyerLabel: 'For businesses buying one polished piece that lasts',
  seo: {
    title: 'Testimonial, Brand & Commercial Video in Tampa — Voxa On-Site',
    description:
      'Polished testimonial, brand, and commercial films shot on-site across Tampa Bay. One cornerstone piece per project, cut to carry your brand.',
    ogImage: '/og/onsite/testimonial-videos-tampa.jpg',
  },
  hero: {
    eyebrow: 'VOXA ON-SITE · TAMPA',
    headline: 'Polished films that carry your brand.',
    subline:
      'Testimonials, brand films, and commercial spots — one cornerstone piece per project, filmed at your location and cut to do real work on your site and in your ads.',
    muteLoopVideo: null,
  },
  proof: [
    { kind: 'logo', placeholder: true, label: 'Client logo' },
    { kind: 'logo', placeholder: true, label: 'Client logo' },
    { kind: 'logo', placeholder: true, label: 'Client logo' },
    { kind: 'stat', placeholder: true, label: 'Headline stat' },
  ],
  problem: {
    heading: 'The one piece that actually moves prospects.',
    paragraphs: [
      'Most buying decisions come down to a single piece of video — a client story, a founder on camera, a commercial that stops the scroll. The one you send when someone asks who you are.',
      'Making that piece well is a different job from making a lot of pieces. It needs a plan, a crew that can direct nervous people, lighting that does not look like a webcam, and an edit that respects the viewer.',
      'Voxa On-Site handles the whole day. A producer runs the shoot at your location, and you leave with one cornerstone piece — testimonial, brand film, or commercial — that earns its spot on your home page and in your paid ads.',
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
        title: 'Brand films',
        body: 'A founder, a team, a mission — captured as a short film that explains who you are and who you serve.',
      },
      {
        title: 'Commercial spots',
        body: 'Scripted and produced from concept — a 30- or 60-second spot built for paid campaigns.',
      },
      {
        title: 'Vertical and horizontal cutdowns',
        body: 'Short cuts from any of the above, sized for your site, ads, and social.',
      },
    ],
  },
  packages: ['interview-session', 'commercial', 'content-day'],
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
      client: 'TrueLimb',
      title: 'Meet Jessica — a patient story',
      type: 'Patient testimonial',
      description:
        'A patient tells her prosthetic journey on camera, cut as a short film for the brand site and clinics.',
      thumbnail: 'https://i.ytimg.com/vi/p681WHF3s1I/hqdefault.jpg',
      href: 'https://www.youtube.com/watch?v=p681WHF3s1I',
      preview: true,
    },
    {
      client: 'Piper Family Dentistry',
      title: 'Welcome to Piper Family Dentistry',
      type: 'Small-practice intro',
      description:
        'A dentist and team on camera for a prospective-patient welcome film shot inside the practice.',
      thumbnail: 'https://i.ytimg.com/vi/8bBxKGRrmTM/hqdefault.jpg',
      href: 'https://www.youtube.com/watch?v=8bBxKGRrmTM',
      preview: true,
    },
    {
      client: 'Instant Leverage',
      title: '"I thought I could build a sales team myself." — JR Rivas',
      type: 'Business owner testimonial',
      description:
        'A client testimonial about outsourcing growth — captured on-site in a single morning.',
      thumbnail: 'https://i.ytimg.com/vi/fUjoVG7xoFA/hqdefault.jpg',
      href: 'https://www.youtube.com/watch?v=fUjoVG7xoFA',
      preview: true,
    },
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
