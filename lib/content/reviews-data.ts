import type { Review } from './reviews'

// Quotes are copied word for word. Set permissionConfirmed only after the
// client has agreed to appear on the site.
export const REVIEWS: Review[] = [
  {
    id: 'j-s',
    quote:
      'I’ve worked with several studios in the area, and Voxa Studios is easily one of the most well-rounded and professional experiences I’ve had.',
    name: 'J S',
    recorded: 'at Voxa Studios',
    source: 'google',
    permissionConfirmed: true,
    services: [],
  },
  {
    id: 'david-smith',
    quote:
      'Niko has become an invaluable and trusted partner to The Skittle Squad Podcast, consistently going above and beyond to make every recording experience exceptional.',
    name: 'David Smith',
    business: 'The Skittle Squad Podcast',
    recorded: 'a podcast',
    source: 'google',
    permissionConfirmed: true,
    services: ['podcast'],
  },
  {
    id: 'vanessa-f',
    quote:
      'As a busy business owner, Niko at Voxa Studios has made creating video content incredibly easy.',
    name: 'Vanessa F',
    recorded: 'an e-course and YouTube videos',
    source: 'google',
    permissionConfirmed: true,
    services: ['course', 'youtube'],
  },
]
