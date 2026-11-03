// DRAFT COPY — awaiting Niko's review.
export type WorkVideo = {
  client: string
  type: string
  title: string
  href: string
  thumbnail: string
  /** Vertical cut, shown at 9:16 instead of 16:9. */
  portrait?: boolean
}

export type WorkProject = {
  type: string
  client: string
  body: string
  image: { src: string; alt: string; focus?: string }
  detail: { src: string; alt: string }
}

export const onsiteWork = {
  seo: {
    title: 'Our Work: Video Production in Tampa — Voxa On-Site',
    description:
      'Watch commercials, event films, interviews, and on-camera presentations by members of the Voxa On-Site team, shot on location across Florida and beyond.',
    ogImage: '/og/onsite/work.jpg',
  },
  header: {
    eyebrow: 'THE WORK',
    headline: 'Judge us by the footage.',
    body: 'Real shoots by members of our team, in kitchens, on rooftops, and in front of people with a lot riding on how they come across.',
  },
  featured: {
    client: 'Grillsmith Sarasota',
    type: 'Commercial',
    title: 'A restaurant commercial, told by the chef',
    href: 'https://player.vimeo.com/video/706391172?h=74135374a5',
    thumbnail: '/onsite/cases/grillsmith-sarasota.webp',
  } satisfies WorkVideo,
  videos: [
    {
      client: 'Friendship Cars',
      type: 'Commercial',
      title: 'Friendship\'s Got It',
      href: 'https://www.youtube.com/watch?v=2Wmb3GtCrNc',
      thumbnail: 'https://i.ytimg.com/vi/2Wmb3GtCrNc/maxresdefault.jpg',
    },
    {
      client: 'White Water Life',
      type: 'Social ad',
      title: 'A vertical product ad',
      href: 'https://player.vimeo.com/video/1021343460?h=19c6a74143',
      thumbnail:
        'https://i.vimeocdn.com/video/1940090748-ce3c74e949c059263ff66fc416ca90410e54a29eeb451c42f4361ee1ad337420-d_640x1138?region=us',
      portrait: true,
    },
  ] satisfies WorkVideo[],
  range: {
    eyebrow: 'THE RANGE',
    heading: 'Different rooms. Same standard.',
  },
  projects: [
    {
      type: 'Commercials',
      client: 'Grillsmith',
      body: 'Filmed in a working restaurant kitchen, from the people on the line to the food on the plate.',
      image: {
        src: '/onsite/cases/grillsmith-chefs.webp',
        alt: 'Two chefs in a restaurant kitchen looking over finished plates of food',
      },
      detail: {
        src: '/onsite/cases/grillsmith-grill.webp',
        alt: 'Flames rising from a grill as chefs work a restaurant kitchen line',
      },
    },
    {
      type: 'Event films',
      client: 'Rooftop gathering and JKA Maine',
      body: 'From a packed rooftop to a karate gasshuku in a school gym, capturing the moments without getting in the way of them.',
      image: {
        src: '/onsite/cases/event-rooftop-megaphone.jpg',
        alt: 'A host with a megaphone addressing a smiling crowd at a rooftop event',
      },
      detail: {
        src: '/onsite/cases/jka-maine-seiza.jpg',
        alt: 'Karate students kneeling in a formal bow on a gym floor, with the JKA Maine logo over the frame',
      },
    },
    {
      type: 'Interviews and testimonials',
      client: 'Byron Donalds and Tim Donaghy',
      body: 'Byron Donalds for Florida Education News was a fast, on-the-go shoot with very little time and almost no setup. Tim Donaghy, the former NBA referee, sat down for Nothing\'s Off The Table on a fully composed set.',
      image: {
        src: '/onsite/cases/interview-donalds-table.webp',
        alt: 'Byron Donalds seated at a small table during an interview for Florida Education News',
      },
      detail: {
        src: '/onsite/cases/interview-donaghy.webp',
        alt: 'A podcast interview with Tim Donaghy for Nothing\'s Off The Table, two guests in armchairs on a styled set',
      },
    },
    {
      type: 'Brand and founder films',
      client: 'Tricia Sham x Songo Skateboards',
      body: 'A collaboration between Songo Skateboards and Tampa Bay painter Tricia Sham, one of the artists behind its decks. Filmed on the Tampa riverfront, showing the artist and the craft together.',
      image: {
        src: '/onsite/cases/brand-painter-tampa.webp',
        alt: 'Artist Tricia Sham painting a colorful portrait on the Tampa riverfront, with the University of Tampa minarets behind',
      },
      detail: {
        src: '/onsite/cases/brand-painter-river.webp',
        alt: 'Tricia Sham, seen from behind in a green sweater, painting beside the Hillsborough River',
      },
    },
    {
      type: 'On-camera presentations',
      client: 'Weylman and Common Spirit',
      body: 'One person speaking directly to the viewer, whether on a clean studio backdrop or in their own office.',
      image: {
        src: '/onsite/cases/common-spirit-wide.webp',
        alt: 'A speaker in a blue blazer addressing the camera in a bright office',
      },
      detail: {
        src: '/onsite/cases/weylman.webp',
        alt: 'A presenter speaking directly to camera against a blue studio backdrop',
      },
    },
  ] satisfies WorkProject[],
  credit:
    'Selected work by members of the Voxa team, including projects produced with other companies. All footage and trademarks belong to their respective owners.',
  cta: {
    heading: 'Seen enough? Tell us what you need filmed.',
    body: 'A short brief gets you a tailored quote.',
  },
}
