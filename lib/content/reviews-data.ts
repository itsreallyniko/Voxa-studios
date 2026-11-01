import type { Review } from './reviews'

// Quotes are copied word for word. Set permissionConfirmed only after the
// client has agreed to appear on the site.
export const REVIEWS: Review[] = [
  {
    id: 'alex-cooper',
    quote:
      'I love shooting at this studio. It’s hands down the best one in Tampa. The space looks great on camera and the whole experience just feels smooth. Thank you Niko!!',
    name: 'Alex Cooper',
    recorded: 'YouTube videos and product demos',
    source: 'google',
    permissionConfirmed: true,
    services: ['youtube'],
  },
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
  {
    id: 'kyle-gregory',
    quote:
      'Excellent studio with all the equipment you could need for a professional setup. Niko is also fantastic with service and helping it be a seamless experience',
    name: 'Kyle Gregory',
    recorded: 'YouTube videos and VSLs',
    source: 'google',
    permissionConfirmed: true,
    services: ['vsl', 'youtube'],
  },
]
