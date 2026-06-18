import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingProvider, useBooking } from '@/lib/booking-context'
import { ScheduleStep } from '@/components/book/steps/schedule-step'

function Seed() {
  const { setBooking } = useBooking()
  // Run only once on mount
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = (Seed as any)._
  if (!_) {
    ;(Seed as any)._ = true
    setBooking((b) => ({ ...b, collectionId: 'executive', setId: 'executive-podcast' }))
  }
  return null
}

beforeEach(() => {
  vi.restoreAllMocks()
  ;(Seed as any)._ = false
})

describe('ScheduleStep with real fetch', () => {
  it('renders dates returned by /api/cal/slots and disables empties', async () => {
    const slotsByDate: Record<string, string[]> = {}
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const iso = d.toISOString().slice(0, 10)
      slotsByDate[iso] = i % 2 === 0 ? ['09:00', '13:00'] : []
    }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ slotsByDate }),
    }) as any

    render(
      <BookingProvider>
        <Seed />
        <ScheduleStep />
      </BookingProvider>
    )

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    const call = (global.fetch as any).mock.calls[0][0] as string
    expect(call).toContain('/api/cal/slots')
    expect(call).toContain('setId=executive-podcast')
    expect(call).toContain('duration=90')

    // Time column initially: "Choose a date first"
    expect(screen.getByText(/choose a date first/i)).toBeInTheDocument()

    // Find the first enabled date tile and click it.
    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const enabled = buttons.find((b) => !b.hasAttribute('disabled') && b.textContent && /\d/.test(b.textContent))
      expect(enabled).toBeTruthy()
    })
    const buttons = screen.getAllByRole('button')
    const enabled = buttons.find((b) => !b.hasAttribute('disabled') && b.textContent && /\d/.test(b.textContent))!
    await userEvent.click(enabled)

    await waitFor(() => expect(screen.getByText('09:00')).toBeInTheDocument())
    expect(screen.getByText('13:00')).toBeInTheDocument()
  })
})
