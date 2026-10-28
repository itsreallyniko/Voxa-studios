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
    shape: 'A full day at your location',
    includes: [
      'Interviews, b-roll, and day-in-the-life or event coverage',
      'Two to three cameras with producer and lighting',
      'Teleprompter available on request',
    ],
    deliverables: [
      'A hero film built from the day',
      'A set of vertical clips',
      'Raw selects delivered to your team',
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
