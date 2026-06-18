import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingProvider } from '@/lib/booking-context'
import { DetailsStep } from '@/components/book/steps/details-step'

function renderStep() {
  return render(
    <BookingProvider>
      <DetailsStep />
    </BookingProvider>
  )
}

describe('DetailsStep contact inputs', () => {
  it('renders YOUR NAME and EMAIL fields', () => {
    renderStep()
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('accepts typing into name and email', async () => {
    const user = userEvent.setup()
    renderStep()
    const name = screen.getByLabelText(/your name/i) as HTMLInputElement
    const email = screen.getByLabelText(/email/i) as HTMLInputElement
    await user.type(name, 'Jane Founder')
    await user.type(email, 'jane@example.com')
    expect(name.value).toBe('Jane Founder')
    expect(email.value).toBe('jane@example.com')
  })
})
