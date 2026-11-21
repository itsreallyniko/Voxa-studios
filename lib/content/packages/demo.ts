import type { PackagePage } from './types'
import { DEPOSIT_TERMS, EDITING_ONLY_NOTE, levelPreviewsEmpty } from './shared'

export const demoPackage: PackagePage = {
  slug: 'demo',
  title: 'Product Demo Video Production in Tampa | Voxa Studios',
  description:
    'Plan your product demo package: a presenter on a Tampa studio set with screen recording, edited with on-screen text so your product is easy to follow.',
  eyebrow: 'Product demo package',
  headline: 'Show your product the way you would in person',
  story: {
    anonymous: [
      'A software team could explain their product well in a meeting, but their website demos were screen recordings with no face and no pace.',
      'They came to the studio, walked through the product with screen recording running and a presenter on camera, and recorded a couple of demos in one session.',
      'Each demo was edited with on-screen text pointing at what mattered, so a visitor could follow the product without a call.',
    ],
    useNamed: false,
  },
  whatYouGet: [
    {
      heading: 'A presenter and the product, together',
      body: 'Screen recording sits alongside a two-camera studio setup, so viewers see you and the product at once.',
    },
    {
      heading: 'Easy to follow',
      body: 'On-screen text and callouts guide the eye to what matters, with audio and colour taken care of.',
    },
    {
      heading: 'Teleprompter and a producer',
      body: 'Walk through features without losing your place. A producer is on-site to direct and keep the pace.',
    },
    {
      heading: 'Clips for social',
      body: 'Short clips of a feature or a single idea can be cut for social, if you want them.',
    },
  ],
  videoNoun: { one: 'video', many: 'videos' },
  defaults: { type: 'demo', videos: 2, length: 'short', level: 'text', record: true, recordMinutes: null, clips: 0 },
  levelPreviews: { ...levelPreviewsEmpty },
  editingOnlyNote: EDITING_ONLY_NOTE,
  reviewTag: 'youtube',
  faqs: [
    {
      question: 'How long does a demo package take?',
      answer:
        'It depends on how many demos you want and how much on-screen guidance each needs. We confirm a timeline on the vision call.',
    },
    {
      question: 'How many revisions are included?',
      answer:
        'Every package includes 2 rounds of revisions. Sending notes together keeps each round focused.',
    },
    {
      question: 'Can you edit a demo I already recorded?',
      answer:
        'Yes. Send your recording as a shared Google Drive or Dropbox link after your deposit. Home recordings with weak audio or lighting can be improved, but not fully rescued, and we will be straightforward about what we can do.',
    },
    {
      question: 'How does the deposit work?',
      answer: DEPOSIT_TERMS,
    },
  ],
}
