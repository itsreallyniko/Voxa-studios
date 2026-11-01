import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { FAQ } from '@/components/marketing/faq'
import { EXTRA_INCREMENT_PRICE } from '@/lib/pricing'

describe('FAQ pricing', () => {
  it('states the same extension price that checkout charges', () => {
    const { container } = render(<FAQ />)
    expect(container.textContent).toContain(`30-minute increments at $${EXTRA_INCREMENT_PRICE} each`)
  })
})
