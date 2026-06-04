export const BASE_PRICE_USD = 300
export const BASE_MINUTES = 90
export const EXTRA_HOUR_PRICE = 100

export type Addon = {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export type PricingInput = {
  durationMinutes: number
  addonIds: string[]
}

export type PricingResult = {
  base: number
  extraHours: number
  extraTimePrice: number
  addonTotal: number
  total: number
}

export function getTotal(input: PricingInput, addons: Addon[]): PricingResult {
  const extraHours = Math.max(0, Math.floor((input.durationMinutes - BASE_MINUTES) / 60))
  const extraTimePrice = extraHours * EXTRA_HOUR_PRICE
  const addonTotal = input.addonIds
    .map((id) => addons.find((a) => a.id === id)?.price ?? 0)
    .reduce((a, b) => a + b, 0)
  return {
    base: BASE_PRICE_USD,
    extraHours,
    extraTimePrice,
    addonTotal,
    total: BASE_PRICE_USD + extraTimePrice + addonTotal,
  }
}
