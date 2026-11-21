import type { PackagePage } from './types'
import { DEPOSIT_TERMS, EDITING_ONLY_NOTE, levelPreviewsEmpty } from './shared'

export const vslPackage: PackagePage = {
  slug: 'vsl',
  title: 'Video Sales Letter Production in Tampa | Voxa Studios',
  description:
    'Plan your video sales letter package: bring your script, read it from a teleprompter in a Tampa studio with two cameras, and get an edit with motion design that holds attention.',
  eyebrow: 'VSL package',
  headline: 'A sales video that makes the offer clear',
  story: {
    anonymous: [
      'A founder had a good offer and a long page that explained it. What was missing was the video that said it plainly, in his own voice, on a set that looked as serious as the business.',
      'He recorded his VSL in a studio session, reading the script he had written from the teleprompter, with two cameras and a producer helping keep the delivery natural.',
      'The finished video came back edited with motion design and a clean color grade, ready for his sales page.',
    ],
    useNamed: false,
  },
  whatYouGet: [
    {
      heading: 'Your script, delivered well',
      body: 'You bring the script, or an outline you have written. Voxa does not write it for you, but the teleprompter and a producer on-site help you deliver it well while you look straight into the lens.',
    },
    {
      heading: 'Filmed to look credible',
      body: 'Two cameras, studio lighting and clean audio on a set that suits your brand, with a producer on-site.',
    },
    {
      heading: 'Motion design that serves the message',
      body: 'On-screen text, graphics and pacing that keep the argument moving, with color grading and 2 rounds of revisions.',
    },
    {
      heading: 'Cut-downs for ads and social',
      body: 'Short clips can be cut from the main video for social.',
    },
  ],
  videoNoun: { one: 'video', many: 'videos' },
  defaults: { type: 'vsl', videos: 1, length: 'short', level: 'motion', record: true, recordMinutes: null, clips: 0 },
  levelPreviews: { ...levelPreviewsEmpty },
  editingOnlyNote: EDITING_ONLY_NOTE,
  reviewTag: 'vsl',
  faqs: [
    {
      question: 'How long does a VSL take?',
      answer:
        'Most of the time goes into the motion design and revisions. We give you a timeline on the vision call, once we know your scope and how the video should look.',
    },
    {
      question: 'How many revisions are included?',
      answer:
        'Every package includes 2 rounds of revisions. Gather your notes in one place so each round can cover everything at once.',
    },
    {
      question: 'Can you edit a VSL I already filmed?',
      answer:
        'Yes. Send your footage as a shared Google Drive or Dropbox link after your deposit. Home recordings with weak audio or lighting can be improved, but not fully rescued, and we will say plainly what is realistic.',
    },
    {
      question: 'How does the deposit work?',
      answer: DEPOSIT_TERMS,
    },
  ],
}
