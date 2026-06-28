declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export type MetaEvent =
  | 'PageView'
  | 'Lead'
  | 'Schedule'
  | 'InitiateCheckout'
  | 'Purchase'

export function track(event: MetaEvent, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  if (params) {
    window.fbq('track', event, params)
  } else {
    window.fbq('track', event)
  }
}
