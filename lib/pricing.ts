export const BASE_PRICE_USD = 300
export const BASE_MINUTES = 90
export const EXTRA_INCREMENT_MINUTES = 30
export const EXTRA_INCREMENT_PRICE = 50

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
  extraIncrements: number
  extraTimePrice: number
  addonTotal: number
  total: number
}

export function getTotal(input: PricingInput, addons: Addon[]): PricingResult {
  const extraIncrements = Math.max(
    0,
    Math.floor((input.durationMinutes - BASE_MINUTES) / EXTRA_INCREMENT_MINUTES)
  )
  const extraTimePrice = extraIncrements * EXTRA_INCREMENT_PRICE
  const addonTotal = input.addonIds
    .map((id) => addons.find((a) => a.id === id)?.price ?? 0)
    .reduce((a, b) => a + b, 0)
  return {
    base: BASE_PRICE_USD,
    extraIncrements,
    extraTimePrice,
    addonTotal,
    total: BASE_PRICE_USD + extraTimePrice + addonTotal,
  }
}
