import type { ServicePage } from './types'

export const youtubeStudio: ServicePage = {
  slug: 'youtube-studio-tampa',
  published: true,
  lastModified: '2026-11-01',
  navLabel: 'YouTube Videos',
  title: 'YouTube Studio in Tampa, FL | Voxa Studios',
  description:
    'Film YouTube videos in a professional Tampa studio with a teleprompter, two-camera coverage and an on-site producer. Sessions from $300 / 90 min.',
  h1: 'Film Your YouTube Videos in Tampa',
  directAnswer:
    'Voxa Studios is a Tampa studio where you can film YouTube videos on a professional desk or creator set, with two-camera coverage, a teleprompter, studio lighting, audio and an on-site producer included. Sessions start at $300 for 90 minutes.',
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
      src: '/horizon/Gallery Images Creator/Horizon_Creator_Vertical-1.jpg',
      alt: 'Horizon Creator Set with a light swivel chair and studio microphone by a fireplace',
      caption: 'Horizon Creator Set',
    },
    {
      src: '/executive/Gallery Images Creator/Preview_Side_creator.JPG',
      alt: 'Authority Creator Set with a leather chair and studio microphone against a slatted wall',
      caption: 'Authority Creator Set',
      wide: true,
    },
  ],
  sections: [
    {
      heading: 'Sets built for talking to camera',
      body: [
        'The Authority Desk Set is styled like a private office and built for solo, direct-to-camera delivery, such as expert breakdowns and commentary.',
        'The Authority Creator Set has the same executive look and is built for short-form, vertical and horizontal output in the same session, so you can film for YouTube and Shorts together.',
        'For a brighter look, the Horizon Desk Set is a solo desk with a modern, natural feel, and suits teaching and direct-to-camera videos. The Horizon Creator Set is also built for vertical and horizontal output in the same session.',
      ],
    },
    {
      heading: 'Skip the gear and setup',
      body: [
        'There are no cameras, lights or mics to buy or set up. All four sets offer two-camera coverage and are teleprompter-ready, and a producer is on-site to help with tech and direction.',
      ],
    },
    {
      heading: 'Screen recording and extra editing',
      body: [
        'Referencing something on your laptop? Screen recording is available, so you can capture what you are walking through during your session.',
        'You can also ask about additional editing, such as motion graphics, overlays or a floating-head overlay on top of your screen. Tell us what you have in mind and we can work out what fits your channel.',
      ],
    },
    {
      heading: 'Pricing and session length',
      body: [
        'Sessions start at $300 for 90 minutes. You can extend in 30-minute increments at $100 each, up to 5 hours, so you can flex the session to film one video or several.',
      ],
    },
  ],
  delivery:
    'Sessions include same-day delivery of broadcast-quality multi-cam files, with each camera angle as its own file, color-corrected and audio-synced, ready for your editor.',
  related: { href: '/studios/podcast-studio-tampa', label: 'Filming with a guest? See the podcast studio' },
  reviewTag: 'youtube',
  faqs: [
    {
      question: 'Is a teleprompter included?',
      answer: 'Yes. A teleprompter is available on all sets.',
    },
    {
      question: 'Can I film vertical and horizontal videos in one session?',
      answer:
        'Yes. The Authority Creator and Horizon Creator sets are built for vertical and horizontal output in the same session.',
    },
    {
      question: 'Will my YouTube video be edited?',
      answer:
        'Sessions include multi-cam files ready for your editor, with each camera angle as its own file, color-corrected and audio-synced.',
    },
    {
      question: 'Can I show what is on my laptop?',
      answer: 'Yes. Screen recording is available if you are referencing material on your laptop.',
    },
    {
      question: 'Can you add motion graphics or overlays?',
      answer:
        'Ask us about additional editing, such as motion graphics, overlays or a floating-head overlay on top of your screen.',
    },
    {
      question: 'Can I see the studio first?',
      answer: 'Yes. Free 15-minute tours are available by appointment.',
    },
  ],
}
