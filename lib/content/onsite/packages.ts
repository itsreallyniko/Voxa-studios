// DRAFT COPY — awaiting Niko's review. See handoff list at end of session.
import type { OnsitePackage } from './types'

export const ONSITE_PACKAGES: Record<string, OnsitePackage> = {
  'interview-session': {
    id: 'interview-session',
    name: 'On-Site Interview Session',
    shape: 'Half day at your location',
    includes: [
      'Producer-led session for one to three people on camera',
      'Two-camera coverage with broadcast audio and lighting',
      'Teleprompter available on request',
    ],
    deliverables: [
      'One edited interview or testimonial film',
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
      'A 30- or 60-second spot',
      'Cutdowns sized for each platform',
    ],
  },
}

export function getPackage(id: string): OnsitePackage | undefined {
  return ONSITE_PACKAGES[id]
}
