// DRAFT COPY — awaiting Niko's review. See handoff list at end of session.
import type { OnsitePackage } from './types'

export const ONSITE_PACKAGES: Record<string, OnsitePackage> = {
  'interview-session': {
    id: 'interview-session',
    name: 'On-Site Interview Session',
    shape: 'Scoped to your people and your location',
    includes: [
      'Producer-led session for the people you want on camera',
      'Multi-camera coverage with broadcast audio and lighting',
      'Teleprompter available on request',
    ],
    deliverables: [
      'An edited interview or testimonial film',
      'A set of short clips cut for vertical and horizontal',
    ],
  },
  'content-day': {
    id: 'content-day',
    name: 'On-Site Content Day',
    shape: 'A full day at your location — social-first',
    includes: [
      'Day-in-the-life, team-on-camera, and product-in-use coverage',
      'Vertical-first capture with producer and lighting',
      'Short interview blocks for reel-sized moments',
    ],
    deliverables: [
      'A set of short vertical and horizontal clips',
      'Day-in-the-life sequences ready for social',
      'B-roll library and raw selects for your team',
    ],
  },
  commercial: {
    id: 'commercial',
    name: 'On-Site Commercial',
    shape: 'Planned from concept, filmed at your location',
    includes: [
      'Script, shot list, locations, and talent planned together',
      'Multi-camera coverage with producer, lighting, and audio',
      'Direction on camera and off',
    ],
    deliverables: [
      'A finished spot, in the length your campaign needs',
      'Cutdowns sized for each platform',
    ],
  },
}

export function getPackage(id: string): OnsitePackage | undefined {
  return ONSITE_PACKAGES[id]
}
