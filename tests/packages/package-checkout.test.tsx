import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { summarizePackage } from '@/components/packages/package-summary'
import { PACKAGE_PAGES } from '@/lib/content/packages'
import { quotePackage } from '@/lib/packages/pricing'

vi.mock('@calcom/embed-react', () => ({
  default: (props: any) => (
    <div
      data-testid="cal"
      data-link={props.calLink}
      data-notes={props.config?.notes}
      data-name={props.config?.name}
      data-email={props.config?.email}
    />
  ),
  getCalApi: vi.fn(async () => vi.fn()),
}))

import { PackageCheckout } from '@/components/packages/package-checkout'

const page = PACKAGE_PAGES.course
const config = page.defaults
const quote = quotePackage(config)
const events = (name: string) =>
  ((window as any).dataLayer as any[]).filter((e) => e.event === name)

function fill() {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada Lovelace' } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } })
  fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '8135550123' } })
}
const submit = () => fireEvent.click(screen.getByRole('button', { name: /continue/i }))

function setup() {
  return render(<PackageCheckout page={page} config={config} quote={quote} onBack={vi.fn()} />)
}

let fetchMock: ReturnType<typeof vi.fn>
beforeEach(() => {
  ;(window as any).dataLayer = []
  fetchMock = vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ quote }),
  }))
  vi.stubGlobal('fetch', fetchMock)
  vi.stubEnv('NEXT_PUBLIC_CAL_PACKAGE_LINK', 'https://cal.com/voxa/vision-call')
})
afterEach(() => vi.unstubAllEnvs())

describe('PackageCheckout', () => {
  it('rejects an invalid email without calling fetch', () => {
    setup()
    fill()
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'nope' } })
    submit()
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('posts the lead then shows Cal with prefilled notes', async () => {
    setup()
    fill()
    submit()
    const cal = await screen.findByTestId('cal')
    expect(fetchMock.mock.calls[0][0]).toBe('/api/packages/lead')
    expect(cal.getAttribute('data-link')).toBe('voxa/vision-call')
    expect(cal.getAttribute('data-notes')).toBe(summarizePackage(page, config, quote))
    expect(cal.getAttribute('data-name')).toBe('Ada Lovelace')
    expect(cal.getAttribute('data-email')).toBe('ada@example.com')
    expect(events('package_contact_submit')).toHaveLength(1)
  })

  it('shows fallback text and no Cal when no link is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_CAL_PACKAGE_LINK', '')
    setup()
    fill()
    submit()
    const link = await screen.findByRole('link', { name: '(813) 731-7075' })
    expect(link.parentElement!.textContent).toBe(
      "Email us at voxastudiosfl@gmail.com or call (813) 731-7075 and we'll set up your call."
    )
    expect(screen.getByRole('link', { name: '(813) 731-7075' }).getAttribute('href')).toBe('tel:+18137317075')
    expect(screen.queryByTestId('cal')).toBeNull()
  })

  it('still advances when the lead request fails', async () => {
    fetchMock.mockImplementationOnce(async () => {
      throw new Error('network')
    })
    setup()
    fill()
    submit()
    expect(await screen.findByTestId('cal')).toBeTruthy()
  })

  it('scrolls #build into view and focuses the step heading on each step', async () => {
    const scroll = vi.fn()
    const target = document.createElement('div')
    target.id = 'build'
    target.scrollIntoView = scroll
    document.body.appendChild(target)
    try {
      setup()
      expect(scroll).toHaveBeenCalledTimes(1)
      expect(document.activeElement?.textContent).toBe('Where should we reach you?')
      expect(document.activeElement?.getAttribute('tabindex')).toBe('-1')
      fill()
      submit()
      await screen.findByTestId('cal')
      expect(scroll).toHaveBeenCalledTimes(2)
      expect(document.activeElement?.textContent).toBe('Book your free vision call')
    } finally {
      target.remove()
    }
  })

  it('uses instant scrolling under prefers-reduced-motion', () => {
    const scroll = vi.fn()
    const target = document.createElement('div')
    target.id = 'build'
    target.scrollIntoView = scroll
    document.body.appendChild(target)
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: true, media: q }))
    try {
      setup()
      expect(scroll).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
    } finally {
      target.remove()
      vi.unstubAllGlobals()
      vi.stubGlobal('fetch', fetchMock)
    }
  })
})
