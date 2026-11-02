// DRAFT COPY — awaiting Niko's review.
export type FilmType = {
  title: string
  body: string
  image: string | null
  imageAlt: string
  /** CSS object-position, for frames whose subject sits off-center. */
  imageFocus?: string
}

export const FILM_TYPES: FilmType[] = [
  {
    title: 'Commercials',
    body: 'A spot planned from concept, built to run in paid campaigns and hold attention.',
    image: '/onsite/cases/grillsmith-chefs.webp',
    imageAlt: 'Two chefs in a restaurant kitchen looking over finished plates of food',
    imageFocus: '30% 50%',
  },
  {
    title: 'Event films',
    body: 'One event, captured and cut into a film that keeps working long after the room clears.',
    image: '/onsite/cases/event-rooftop-megaphone.jpg',
    imageAlt: 'A host with a megaphone addressing a smiling crowd at a rooftop event',
  },
  {
    title: 'Interviews/Testimonials',
    body: 'Client testimonials, expert conversations, and sit-downs with leaders, lit and framed to hold attention.',
    image: '/onsite/cases/interview-donalds-wide.webp',
    imageAlt: 'Byron Donalds in a navy Donalds for Florida jacket during a seated on-camera interview',
    imageFocus: '20% 50%',
  },
  {
    title: 'Brand and founder films',
    body: 'Who you are and who you serve, told by the people behind the business.',
    image: '/onsite/cases/brand-painter-tampa.webp',
    imageAlt: 'Artist Tricia Sham painting a colorful portrait on the Tampa riverfront, with the University of Tampa minarets behind',
    imageFocus: '12% 50%',
  },
  {
    title: 'On-camera presentations',
    body: 'Leadership messages, sales videos, courses, and demos, delivered straight to camera with teleprompter support.',
    image: '/onsite/cases/weylman.webp',
    imageAlt: 'A presenter speaking directly to camera against a blue studio backdrop',
  },
]
