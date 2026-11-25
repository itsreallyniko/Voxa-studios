import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TourModalProvider, useTourModal } from '@/lib/tour-modal-context'

function Opener({ withOptions }: { withOptions: boolean }) {
  const { open } = useTourModal()
  return (
    <button
      onClick={() =>
        withOptions
          ? open({ source: 'package', pageType: 'course', packageSummary: '12 lessons…' })
          : open()
      }
    >
      open-tour
    </button>
  )
}

let bookingBody: any

beforeEach(() => {
  window.dataLayer = []
  bookingBody = undefined
  const slots = new Proxy({}, { get: () => ['10:00'] })
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      if (String(url).startsWith('/api/tour/slots')) {
        return { ok: true, status: 200, json: async () => ({ slotsByDate: slots }) }
      }
      bookingBody = JSON.parse(String(init?.body))
      return {
        ok: true,
        status: 200,
        json: async () => ({ uid: 'uid-1', startISO: '2026-12-01T10:00:00-05:00', durationMinutes: 15 }),
      }
    })
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

async function bookTour(withOptions: boolean) {
  render(
    <TourModalProvider>
      <Opener withOptions={withOptions} />
    </TourModalProvider>
  )
  fireEvent.click(screen.getByText('open-tour'))
  fireEvent.change(await screen.findByPlaceholderText('Jane Founder'), { target: { value: 'Jane' } })
  fireEvent.change(screen.getByPlaceholderText('jane@example.com'), { target: { value: 'jane@example.com' } })
  fireEvent.change(screen.getByPlaceholderText('+1 555 555 5555'), { target: { value: '+15555555555' } })
  fireEvent.click(screen.getByText(/Continue/))
  await screen.findByText('Pick a Time')
  const firstDay = () => document.querySelector('div.grid button') as HTMLButtonElement
  await waitFor(() => expect(firstDay()).not.toBeDisabled())
  fireEvent.click(firstDay())
  fireEvent.click(await screen.findByText('10:00'))
  fireEvent.click(screen.getByText('Confirm Tour'))
  await screen.findByText('TOUR BOOKED')
  await waitFor(() =>
    expect(window.dataLayer!.some((e) => e.event === (withOptions ? 'package_tour_booked' : 'tour_booked'))).toBe(true)
  )
}

const events = () => (window.dataLayer ?? []).map((e) => e.event)

describe('source-aware tour modal', () => {
  it('package source fires package_tour_booked and no studio conversions', async () => {
    await bookTour(true)
    expect(events()).not.toContain('generate_lead')
    expect(events()).not.toContain('tour_booked')
    expect(events()).toContain('package_tour_booked')
    expect(bookingBody.packageSummary).toBe('12 lessons…')
  })

  it('no options keeps the studio events and sends no packageSummary', async () => {
    await bookTour(false)
    expect(events()).toContain('generate_lead')
    expect(events()).toContain('tour_booked')
    expect(events()).not.toContain('package_tour_booked')
    expect(bookingBody.packageSummary).toBeUndefined()
  })
})
