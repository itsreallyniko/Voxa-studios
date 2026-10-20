declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function pushDataLayer(event: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  // Reset ecommerce object between pushes to avoid stale data (Google-recommended).
  if ('ecommerce' in event) {
    window.dataLayer.push({ ecommerce: null })
  }
  window.dataLayer.push(event)
}

export async function sha256Hex(input: string): Promise<string | undefined> {
  if (typeof crypto === 'undefined' || !crypto.subtle) return undefined
  const bytes = new TextEncoder().encode(input.trim().toLowerCase())
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
