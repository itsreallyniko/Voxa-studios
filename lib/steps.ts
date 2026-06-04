export type StepKey =
  | 'collection'
  | 'set'
  | 'addons'
  | 'details'
  | 'length'
  | 'schedule'
  | 'checkout'

export const STEPS: { key: StepKey; number: string; label: string }[] = [
  { key: 'collection', number: '01', label: 'Collection' },
  { key: 'set', number: '02', label: 'Set' },
  { key: 'addons', number: '03', label: 'Add-Ons' },
  { key: 'details', number: '04', label: 'Details' },
  { key: 'length', number: '05', label: 'Length' },
  { key: 'schedule', number: '06', label: 'Schedule' },
  { key: 'checkout', number: '07', label: 'Checkout' },
]

export type Booking = {
  collectionId: 'executive' | 'horizon' | null
  setId: string | null
  addonIds: string[]
  details: {
    recordingType: string
    guests: string
    socials: string
    notes: string
  }
  durationMinutes: number
  schedule: { date: string | null; time: string | null }
}

export const initialBooking: Booking = {
  collectionId: null,
  setId: null,
  addonIds: [],
  details: { recordingType: '', guests: '', socials: '', notes: '' },
  durationMinutes: 90,
  schedule: { date: null, time: null },
}

export function isStepComplete(step: StepKey, b: Booking): boolean {
  switch (step) {
    case 'collection':
      return b.collectionId !== null
    case 'set':
      return b.setId !== null
    case 'addons':
      return b.collectionId !== null && b.setId !== null
    case 'details':
      return b.details.recordingType.trim().length > 0
    case 'length':
      return b.durationMinutes >= 90
    case 'schedule':
      return b.schedule.date !== null && b.schedule.time !== null
    case 'checkout':
      return false
  }
}

export function nextStep(current: StepKey): StepKey | null {
  const idx = STEPS.findIndex((s) => s.key === current)
  if (idx === -1 || idx === STEPS.length - 1) return null
  return STEPS[idx + 1].key
}

export function prevStep(current: StepKey): StepKey | null {
  const idx = STEPS.findIndex((s) => s.key === current)
  if (idx <= 0) return null
  return STEPS[idx - 1].key
}

export function firstIncompleteStep(b: Booking): StepKey {
  for (const s of STEPS) {
    if (!isStepComplete(s.key, b)) return s.key
  }
  return 'checkout'
}
