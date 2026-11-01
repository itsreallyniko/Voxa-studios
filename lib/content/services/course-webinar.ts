import type { ServicePage } from './types'

export const courseWebinar: ServicePage = {
  slug: 'course-webinar-tampa',
  published: false,
  lastModified: '2026-11-01',
  navLabel: 'Courses & Webinars',
  title: 'Course & Webinar Filming Studio in Tampa, FL | Voxa Studios',
  description:
    'Film online courses and webinars in a professional Tampa studio with a teleprompter, multi-cam recording and an on-site producer. Sessions from $300 / 90 min.',
  h1: 'A Tampa Studio for Filming Courses and Webinars',
  directAnswer:
    'Voxa Studios is a Tampa studio where coaches, consultants and business owners can film online courses and webinars on a professional set, with a teleprompter, multi-camera recording, lighting, audio and an on-site producer included. Sessions start at $300 for 90 minutes.',
  images: [
    {
      src: '/horizon/Gallery Images Desk/Horizon_Desk_Horizontal.jpg',
      alt: 'Horizon Desk Set with a studio microphone at a bright wooden desk',
      caption: 'Horizon Desk Set',
    },
    {
      src: '/executive/Gallery Images Desk/Preview_Desk.JPG',
      alt: 'Authority Desk Set with a studio microphone in front of a bookshelf',
      caption: 'Authority Desk Set',
    },
    {
      src: '/executive/Gallery Images Desk/BTS_Desk.JPG',
      alt: 'Studio light above the Authority Desk Set, behind the scenes',
      caption: 'Behind the scenes on the Authority Desk Set',
    },
  ],
  sections: [
    {
      heading: 'Sets for teaching on camera',
      body: [
        'The Horizon Desk Set is a bright solo desk built for teaching and course content. The Authority Desk Set is styled like a private office and suits expert breakdowns and direct-to-camera talks.',
        'Both offer two-camera coverage and are teleprompter-ready.',
      ],
    },
    {
      heading: 'Focus on your material',
      body: [
        'There is no gear to buy or set up. A producer is on-site to help with tech and direction, and a private green room gives you somewhere to prepare between takes.',
      ],
    },
    {
      heading: 'Pricing and session length',
      body: [
        'Sessions start at $300 for 90 minutes. You can extend in 30-minute increments at $50 each, up to 5 hours. A free 15-minute tour is a good way to work out how to approach your course.',
      ],
    },
  ],
  delivery:
    'Authority Desk sessions deliver multi-cam files the same day, with each camera angle as its own file, color-corrected and audio-synced, ready for your editor.',
  reviewTag: 'course',
  faqs: [
    {
      question: 'Do I need a script?',
      answer:
        'You bring your own material. A teleprompter is available on all sets if you want to read from a script.',
    },
    {
      question: 'Can I see the studio first?',
      answer: 'Yes. Free 15-minute tours are available by appointment.',
    },
  ],
}
