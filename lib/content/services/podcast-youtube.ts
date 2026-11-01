import type { ServicePage } from './types'

export const podcastYoutube: ServicePage = {
  slug: 'podcast-youtube-tampa',
  published: false,
  lastModified: '2026-11-01',
  navLabel: 'Podcast & YouTube',
  title: 'Podcast & YouTube Studio in Tampa, FL | Voxa Studios',
  description:
    'A turnkey Tampa podcast and YouTube studio with multi-cam recording, studio audio, lighting and an on-site producer. Sessions from $300 / 90 min.',
  h1: 'A Podcast and YouTube Studio in Tampa',
  directAnswer:
    'Voxa Studios is a turnkey podcast and video studio in Tampa, FL, with multi-camera recording, studio lighting, broadcast audio and an on-site producer included in every session. Sessions start at $300 for 90 minutes, so you can try a show without buying any gear.',
  images: [
    {
      src: '/horizon/Gallery Images Podcast/Horizon_Podcast_Horizontal-4.jpg',
      alt: 'Horizon Podcast Set with two light chairs and microphones beside a fireplace',
      caption: 'Horizon Podcast Set',
    },
    {
      src: '/executive/Gallery Images Podcast/Preview_Podcast.JPG',
      alt: 'Executive Podcast Set with two leather chairs and studio microphones',
      caption: 'Executive Podcast Set',
      wide: true,
    },
    {
      src: '/horizon/Gallery Images Podcast/Horizon_Podcast.jpg',
      alt: 'Horizon Podcast Set with a light chair and studio microphone beside a fireplace',
      caption: 'Horizon Podcast Set',
    },
    {
      src: '/executive/Gallery Images Podcast/BTS_Podcast_side2.JPG',
      alt: 'Studio lighting and microphones set up around the Executive Podcast Set',
      caption: 'Behind the scenes on the Executive Podcast Set',
    },
  ],
  sections: [
    {
      heading: 'Choose the look that fits your brand',
      body: [
        'The Executive Podcast Set is a dark, cinematic two-seat set for long-form interviews, with three-camera coverage and Shure SM7B mics.',
        'The Horizon Podcast Set is a bright two-seat set with natural textures and warm wood accents, also with three-camera coverage, and suits a more welcoming, conversational feel.',
      ],
    },
    {
      heading: 'Solo YouTube videos',
      body: [
        'For direct-to-camera videos, the desk and creator sets offer two-camera coverage and a teleprompter. The creator sets can capture vertical and horizontal output in the same session.',
      ],
    },
    {
      heading: 'New to podcasting?',
      body: [
        'You do not need your own equipment or technical experience. A producer is on-site to help with tech and direction, and a free 15-minute tour lets you see the sets and talk through your idea before you book.',
      ],
    },
    {
      heading: 'Pricing and session length',
      body: [
        'Sessions start at $300 for 90 minutes. You can extend in 30-minute increments at $100 each, up to 5 hours, so the session can flex with your show.',
      ],
    },
  ],
  delivery:
    'Executive Podcast Set sessions are delivered within 48 hours as an edited, live-switched program, color-graded and audio-cleaned. Authority Desk and Authority Creator sessions deliver multi-cam files the same day, ready for your editor.',
  reviewTag: 'podcast',
  faqs: [
    {
      question: 'Do I need my own podcast equipment?',
      answer:
        'No. Every session includes multi-camera recording, studio lighting, broadcast audio and an on-site producer.',
    },
    {
      question: 'Do you edit my podcast?',
      answer:
        'Executive Podcast Set sessions are delivered as a 48-hour edited switched program, color-graded and audio-cleaned.',
    },
    {
      question: 'Where is the studio?',
      answer:
        '4021 N Armenia Ave, Suite 102, Tampa, FL 33607, minutes from downtown Tampa, with parking on site.',
    },
    {
      question: 'Can I tour the studio before booking?',
      answer: 'Yes. Free 15-minute tours are available by appointment.',
    },
  ],
}
