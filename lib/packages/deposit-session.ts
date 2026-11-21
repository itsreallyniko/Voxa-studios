// Remembers a deposit's value and range across Stripe's redirect return, and
// guards the paid event so it fires once per payment intent. Storage can be
// blocked, so every access is wrapped.

export type RememberedDeposit = { value: number; rangeLow: number; rangeHigh: number }

const dataKey = (id: string) => `voxa:pkg-deposit:${id}`
const trackedKey = (id: string) => `voxa:pkg-deposit-tracked:${id}`

export function rememberDeposit(paymentIntentId: string, data: RememberedDeposit): void {
  try {
    sessionStorage.setItem(dataKey(paymentIntentId), JSON.stringify(data))
  } catch {
    // storage unavailable: the return page just skips the event
  }
}

export function readDeposit(paymentIntentId: string): RememberedDeposit | null {
  try {
    const raw = sessionStorage.getItem(dataKey(paymentIntentId))
    if (!raw) return null
    const d = JSON.parse(raw) as Partial<RememberedDeposit>
    if (
      typeof d.value === 'number' &&
      typeof d.rangeLow === 'number' &&
      typeof d.rangeHigh === 'number'
    ) {
      return { value: d.value, rangeLow: d.rangeLow, rangeHigh: d.rangeHigh }
    }
  } catch {
    // fall through
  }
  return null
}

/** True the first time it is called for a payment intent in this session. */
export function claimPaidTracking(paymentIntentId: string): boolean {
  try {
    if (sessionStorage.getItem(trackedKey(paymentIntentId))) return false
    sessionStorage.setItem(trackedKey(paymentIntentId), '1')
  } catch {
    // can't guard without storage; allow the event
  }
  return true
}
