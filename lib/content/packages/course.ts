import type { PackagePage } from './types'
import { DEPOSIT_TERMS, EDITING_ONLY_NOTE, levelPreviewsEmpty } from './shared'

export const coursePackage: PackagePage = {
  slug: 'course',
  title: 'Online Course Video Production in Tampa | Voxa Studios',
  description:
    'Plan your course package: lessons recorded in a Tampa studio with a teleprompter, two cameras and screen recording, then edited and delivered with your slides.',
  eyebrow: 'Course package',
  headline: 'Record your whole course in a few studio sessions',
  story: {
    anonymous: [
      'A Tampa coach had a course outline, a folder of slides and no good way to teach from them on camera. Recording at home meant echo, uneven light and a lot of starting over.',
      'She came into the studio with her slides loaded, read from the teleprompter and recorded her lessons across a few sessions. A producer handled the cameras and sound, so she only had to teach.',
      'The lessons came back edited, color graded and paired with her slides, ready to upload to her course platform.',
    ],
    useNamed: false,
  },
  whatYouGet: [
    {
      heading: 'A studio that is ready when you are',
      body: 'Two-camera coverage, teleprompter, lighting and audio are set up before you arrive, with a producer on-site to direct.',
    },
    {
      heading: 'Your slides, on screen',
      body: 'Screen recording is part of the session, so the material you teach from is captured alongside you.',
    },
    {
      heading: 'Edited and graded',
      body: 'Each lesson is cut, color graded and delivered with 2 rounds of revisions. Add on-screen text or motion design where a lesson calls for it.',
    },
    {
      heading: 'Clips for social',
      body: 'Short clips can be cut from your lessons for social, if you want a few to promote the course.',
    },
  ],
  videoNoun: { one: 'lesson', many: 'lessons' },
  defaults: { type: 'course', videos: 10, length: 'medium', level: 'clean', record: true, recordMinutes: null, clips: 0 },
  levelPreviews: { ...levelPreviewsEmpty },
  editingOnlyNote: EDITING_ONLY_NOTE,
  reviewTag: 'course',
  faqs: [
    {
      question: 'How long does a course package take?',
      answer:
        'It depends on how many lessons you have and how much editing they need. We give you a realistic timeline on the vision call, once we know your scope, and keep you posted as it moves.',
    },
    {
      question: 'How many revisions are included?',
      answer:
        'Every package includes 2 rounds of revisions. Send your notes together so each round covers everything you want changed.',
    },
    {
      question: 'Can you edit lessons I already recorded?',
      answer:
        'Yes. Send your files as a shared Google Drive or Dropbox link after your deposit. Home recordings with weak audio or lighting can be improved, but not fully rescued, so we will tell you honestly what to expect before we start.',
    },
    {
      question: 'How does the deposit work?',
      answer: DEPOSIT_TERMS,
    },
  ],
}
