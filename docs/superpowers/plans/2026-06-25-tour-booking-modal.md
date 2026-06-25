# Tour Booking Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the external Cal.com tour link with an on-page two-step modal (details → schedule → success) so cold Meta traffic completes the tour booking without leaving the site.

**Architecture:** Two thin Next.js App Router API routes (`GET /api/tour/slots`, `POST /api/tour/book`) reuse the existing `lib/server/cal.ts` Cal.com v2 client — no Stripe coupling since tours are free. A client-side React context (`TourModalProvider`) opens a portal-rendered modal from both `FinalCTA` and each `BookSection` PreviewCard. The modal pre-fetches slots on open, captures name/email/phone in step 1, lets the user pick date/time in step 2, and shows an inline success state with a client-generated `.ics` download in step 3.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind, Vitest + Testing Library, Cal.com v2 API (already wired via `lib/server/cal.ts`).

## Global Constraints

- Cal.com event type ID for tour: **`6123370`** (set as `CAL_EVENT_TYPE_TOUR` env var)
- Tour duration: **15 minutes** (hardcoded constant `TOUR_DURATION_MINUTES = 15`)
- Studio timezone: `process.env.STUDIO_TIMEZONE ?? 'America/New_York'` (matches session flow)
- API routes use `runtime = 'nodejs'`, rate-limit via `check(ipFromRequest(req), '<bucket>')` from `lib/server/rate-limit.ts`
- Email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (mirrors `app/api/booking/confirm/route.ts`)
- Date regex: `/^\d{4}-\d{2}-\d{2}$/`, time regex: `/^\d{2}:\d{2}$/`
- Idempotency key for booking: `tour:${email}:${date}:${time}` (deterministic, prevents double-submit)
- Test runner: `pnpm test` (or `npx vitest run`) — Vitest config in `vitest.config.ts`
- All new client components use `'use client'` directive
- Brand tokens: `bg-obsidian`, `text-heritage-gold`, `text-ivory`, `liquid-glass`, `border-slate-gray`, `text-headline-xl`, `text-label-caps`, `text-body-md`

---

### Task 1: Tour event-type env lookup helper

**Files:**
- Create: `lib/server/tour-event-type.ts`
- Create: `tests/server/tour-event-type.test.ts`
- Modify: `.env.local.example`

**Interfaces:**
- Produces: `getTourEventTypeId(): number | null` — reads `process.env.CAL_EVENT_TYPE_TOUR`, returns numeric ID or `null` if missing/invalid.

- [ ] **Step 1: Write the failing test**

Create `tests/server/tour-event-type.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

const original = process.env.CAL_EVENT_TYPE_TOUR

beforeEach(() => {
  delete process.env.CAL_EVENT_TYPE_TOUR
})

afterEach(() => {
  if (original === undefined) delete process.env.CAL_EVENT_TYPE_TOUR
  else process.env.CAL_EVENT_TYPE_TOUR = original
})

describe('getTourEventTypeId', () => {
  it('returns numeric id when env var is set', async () => {
    process.env.CAL_EVENT_TYPE_TOUR = '6123370'
    const { getTourEventTypeId } = await import('@/lib/server/tour-event-type')
    expect(getTourEventTypeId()).toBe(6123370)
  })

  it('returns null when env var is missing', async () => {
    const { getTourEventTypeId } = await import('@/lib/server/tour-event-type')
    expect(getTourEventTypeId()).toBeNull()
  })

  it('returns null when env var is non-numeric', async () => {
    process.env.CAL_EVENT_TYPE_TOUR = 'abc'
    const { getTourEventTypeId } = await import('@/lib/server/tour-event-type')
    expect(getTourEventTypeId()).toBeNull()
  })

  it('returns null when env var is zero or negative', async () => {
    process.env.CAL_EVENT_TYPE_TOUR = '0'
    const { getTourEventTypeId } = await import('@/lib/server/tour-event-type')
    expect(getTourEventTypeId()).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/server/tour-event-type.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

Create `lib/server/tour-event-type.ts`:
```ts
import 'server-only'

export function getTourEventTypeId(): number | null {
  const raw = process.env.CAL_EVENT_TYPE_TOUR
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}
```

- [ ] **Step 4: Update `.env.local.example`**

Append to `.env.local.example` (after the other `CAL_EVENT_TYPE_*` lines, around line 18):
```
CAL_EVENT_TYPE_TOUR=6123370
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/server/tour-event-type.test.ts`
Expected: 4 passing tests.

- [ ] **Step 6: Commit**

```bash
git add lib/server/tour-event-type.ts tests/server/tour-event-type.test.ts .env.local.example
git commit -m "feat(server): add tour event-type env lookup helper"
```

---

### Task 2: GET /api/tour/slots route

**Files:**
- Create: `app/api/tour/slots/route.ts`
- Create: `tests/api/tour-slots.test.ts`

**Interfaces:**
- Consumes: `getTourEventTypeId()` from Task 1, `getSlots()` from `lib/server/cal.ts`, `check()` + `ipFromRequest()` from `lib/server/rate-limit.ts`
- Produces: `GET /api/tour/slots?start=YYYY-MM-DD&end=YYYY-MM-DD` returning `{ slotsByDate: Record<string, string[]> }`

- [ ] **Step 1: Write the failing test**

Create `tests/api/tour-slots.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/server/cal', () => ({
  getSlots: vi.fn(),
}))

import { getSlots } from '@/lib/server/cal'

beforeEach(() => {
  vi.resetAllMocks()
  process.env.CAL_EVENT_TYPE_TOUR = '6123370'
  process.env.STUDIO_TIMEZONE = 'America/New_York'
})

async function call(qs: string) {
  const { GET } = await import('@/app/api/tour/slots/route')
  return GET(new Request(`http://localhost/api/tour/slots${qs}`))
}

describe('GET /api/tour/slots', () => {
  it('400s on invalid date format', async () => {
    const res = await call('?start=bad&end=2026-06-25')
    expect(res.status).toBe(400)
  })

  it('400s when end is before start', async () => {
    const res = await call('?start=2026-06-25&end=2026-06-20')
    expect(res.status).toBe(400)
  })

  it('400s on range over 60 days', async () => {
    const res = await call('?start=2026-06-20&end=2026-09-20')
    expect(res.status).toBe(400)
  })

  it('503 when CAL_EVENT_TYPE_TOUR is not configured', async () => {
    delete process.env.CAL_EVENT_TYPE_TOUR
    const res = await call('?start=2026-06-20&end=2026-06-25')
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body.error).toBe('tour_not_configured')
  })

  it('200 with slotsByDate from Cal.com', async () => {
    vi.mocked(getSlots).mockResolvedValue({
      slotsByDate: { '2026-06-20': ['13:00', '13:30'] },
    })
    const res = await call('?start=2026-06-20&end=2026-06-25')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.slotsByDate['2026-06-20']).toEqual(['13:00', '13:30'])
    expect(vi.mocked(getSlots).mock.calls[0][0].eventTypeId).toBe(6123370)
    expect(vi.mocked(getSlots).mock.calls[0][0].durationMinutes).toBe(15)
    expect(vi.mocked(getSlots).mock.calls[0][0].timeZone).toBe('America/New_York')
  })

  it('502 when Cal.com client throws', async () => {
    vi.mocked(getSlots).mockRejectedValue(new Error('boom'))
    const res = await call('?start=2026-06-20&end=2026-06-25')
    expect(res.status).toBe(502)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/api/tour-slots.test.ts`
Expected: FAIL — route module not found.

- [ ] **Step 3: Write minimal implementation**

Create `app/api/tour/slots/route.ts`:
```ts
import { NextResponse } from 'next/server'
import { getSlots } from '@/lib/server/cal'
import { getTourEventTypeId } from '@/lib/server/tour-event-type'
import { check, ipFromRequest } from '@/lib/server/rate-limit'

export const runtime = 'nodejs'

const ONE_DAY_MS = 86_400_000
const MAX_RANGE_DAYS = 60
const TOUR_DURATION_MINUTES = 15

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(req: Request) {
  const rl = check(ipFromRequest(req), 'tour/slots')
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'rate limited' },
      { status: 429, headers: { 'retry-after': Math.ceil(rl.retryAfterMs / 1000).toString() } }
    )
  }

  const eventTypeId = getTourEventTypeId()
  if (eventTypeId === null) return bad('tour_not_configured', 503)

  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start') ?? ''
  const end = searchParams.get('end') ?? ''

  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) return bad('invalid date')

  const startMs = Date.parse(`${start}T00:00:00Z`)
  const endMs = Date.parse(`${end}T23:59:59Z`)
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return bad('invalid range')
  if (endMs - startMs > MAX_RANGE_DAYS * ONE_DAY_MS) return bad('range too large')

  const tz = process.env.STUDIO_TIMEZONE ?? 'America/New_York'
  try {
    const r = await getSlots({
      eventTypeId,
      startISO: `${start}T00:00:00.000Z`,
      endISO: `${end}T23:59:59.999Z`,
      durationMinutes: TOUR_DURATION_MINUTES,
      timeZone: tz,
    })
    return NextResponse.json(r)
  } catch (e) {
    console.error('/api/tour/slots', e)
    return bad('upstream', 502)
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/api/tour-slots.test.ts`
Expected: 6 passing tests.

- [ ] **Step 5: Commit**

```bash
git add app/api/tour/slots/route.ts tests/api/tour-slots.test.ts
git commit -m "feat(api): GET /api/tour/slots — tour availability route"
```

---

### Task 3: POST /api/tour/book route

**Files:**
- Create: `app/api/tour/book/route.ts`
- Create: `tests/api/tour-book.test.ts`

**Interfaces:**
- Consumes: `getTourEventTypeId()` from Task 1, `createBooking()` + `localISO()` from `lib/server/cal.ts`, `check()` + `ipFromRequest()` from `lib/server/rate-limit.ts`
- Produces: `POST /api/tour/book` accepting `{ name, email, phone, date, time }`, returning `{ uid: string; startISO: string; durationMinutes: number }`

- [ ] **Step 1: Write the failing test**

Create `tests/api/tour-book.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/server/cal', () => ({
  createBooking: vi.fn(),
  localISO: vi.fn((d: string, t: string) => `${d}T${t}:00-04:00`),
}))

import { createBooking } from '@/lib/server/cal'

beforeEach(() => {
  vi.resetAllMocks()
  process.env.CAL_EVENT_TYPE_TOUR = '6123370'
  process.env.STUDIO_TIMEZONE = 'America/New_York'
})

async function call(body: unknown) {
  const { POST } = await import('@/app/api/tour/book/route')
  return POST(new Request('http://localhost/api/tour/book', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }))
}

const valid = {
  name: 'Jane Founder',
  email: 'jane@example.com',
  phone: '+15555555555',
  date: '2026-07-08',
  time: '14:00',
}

describe('POST /api/tour/book', () => {
  it('400 on bad email', async () => {
    const res = await call({ ...valid, email: 'not-an-email' })
    expect(res.status).toBe(400)
  })

  it('400 on missing name', async () => {
    const res = await call({ ...valid, name: '' })
    expect(res.status).toBe(400)
  })

  it('400 on short phone', async () => {
    const res = await call({ ...valid, phone: '123' })
    expect(res.status).toBe(400)
  })

  it('400 on bad date format', async () => {
    const res = await call({ ...valid, date: '07/08/2026' })
    expect(res.status).toBe(400)
  })

  it('400 on bad time format', async () => {
    const res = await call({ ...valid, time: '2pm' })
    expect(res.status).toBe(400)
  })

  it('503 when CAL_EVENT_TYPE_TOUR is missing', async () => {
    delete process.env.CAL_EVENT_TYPE_TOUR
    const res = await call(valid)
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body.error).toBe('tour_not_configured')
  })

  it('200 with booking on success and passes phone via bookingFieldsResponses', async () => {
    vi.mocked(createBooking).mockResolvedValue({ uid: 'cal-uid-1', id: 999 })
    const res = await call(valid)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.uid).toBe('cal-uid-1')
    expect(body.startISO).toBe('2026-07-08T14:00:00-04:00')
    expect(body.durationMinutes).toBe(15)

    const callArgs = vi.mocked(createBooking).mock.calls[0][0]
    expect(callArgs.eventTypeId).toBe(6123370)
    expect(callArgs.durationMinutes).toBe(15)
    expect(callArgs.attendee.name).toBe('Jane Founder')
    expect(callArgs.attendee.email).toBe('jane@example.com')
    expect(callArgs.bookingFieldsResponses?.phone).toBe('+15555555555')
    expect(callArgs.idempotencyKey).toBe('tour:jane@example.com:2026-07-08:14:00')
  })

  it('409 when slot is taken', async () => {
    const err = new Error('boom') as Error & { status: number }
    err.status = 409
    vi.mocked(createBooking).mockRejectedValue(err)
    const res = await call(valid)
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toBe('slot_taken')
  })

  it('retries once on 5xx and succeeds', async () => {
    const err = new Error('boom') as Error & { status: number }
    err.status = 502
    vi.mocked(createBooking)
      .mockRejectedValueOnce(err)
      .mockResolvedValueOnce({ uid: 'cal-uid-retry', id: 1000 })
    const res = await call(valid)
    expect(res.status).toBe(200)
    expect(vi.mocked(createBooking)).toHaveBeenCalledTimes(2)
  })

  it('502 when retry also fails', async () => {
    const err = new Error('boom') as Error & { status: number }
    err.status = 502
    vi.mocked(createBooking).mockRejectedValue(err)
    const res = await call(valid)
    expect(res.status).toBe(502)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/api/tour-book.test.ts`
Expected: FAIL — route module not found.

- [ ] **Step 3: Write minimal implementation**

Create `app/api/tour/book/route.ts`:
```ts
import { NextResponse } from 'next/server'
import { createBooking, localISO } from '@/lib/server/cal'
import { getTourEventTypeId } from '@/lib/server/tour-event-type'
import { check, ipFromRequest } from '@/lib/server/rate-limit'

export const runtime = 'nodejs'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^\d{2}:\d{2}$/
const TOUR_DURATION_MINUTES = 15
const MIN_PHONE = 7
const MAX_PHONE = 30
const MAX_NAME = 120

function json(payload: unknown, status: number) {
  return NextResponse.json(payload, { status })
}

export async function POST(req: Request) {
  const rl = check(ipFromRequest(req), 'tour/book')
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'rate limited' },
      { status: 429, headers: { 'retry-after': Math.ceil(rl.retryAfterMs / 1000).toString() } }
    )
  }

  const eventTypeId = getTourEventTypeId()
  if (eventTypeId === null) return json({ error: 'tour_not_configured' }, 503)

  let body: any
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid json' }, 400)
  }

  const name = String(body?.name ?? '').trim()
  const email = String(body?.email ?? '').trim()
  const phone = String(body?.phone ?? '').trim()
  const date = String(body?.date ?? '')
  const time = String(body?.time ?? '')

  if (!name || name.length > MAX_NAME) return json({ error: 'invalid name' }, 400)
  if (!EMAIL.test(email)) return json({ error: 'invalid email' }, 400)
  if (phone.length < MIN_PHONE || phone.length > MAX_PHONE) return json({ error: 'invalid phone' }, 400)
  if (!DATE.test(date)) return json({ error: 'invalid date' }, 400)
  if (!TIME.test(time)) return json({ error: 'invalid time' }, 400)

  const tz = process.env.STUDIO_TIMEZONE ?? 'America/New_York'
  const startISO = localISO(date, time, tz)
  const idempotencyKey = `tour:${email}:${date}:${time}`

  const attempt = () =>
    createBooking({
      eventTypeId,
      startISO,
      durationMinutes: TOUR_DURATION_MINUTES,
      attendee: { name, email, timeZone: tz },
      bookingFieldsResponses: { phone },
      idempotencyKey,
    })

  let booking: { uid: string; id: number } | undefined
  try {
    booking = await attempt()
  } catch (e: any) {
    const status: number | undefined = e?.status
    if (status === 409) return json({ error: 'slot_taken' }, 409)
    if (typeof status === 'number' && status >= 500) {
      try {
        booking = await attempt()
      } catch (e2) {
        console.error('tour book retry failed', e2)
        return json({ error: 'upstream' }, 502)
      }
    } else {
      console.error('tour book failed', e)
      return json({ error: 'upstream' }, 502)
    }
  }

  if (!booking) return json({ error: 'upstream' }, 502)
  return json({ uid: booking.uid, startISO, durationMinutes: TOUR_DURATION_MINUTES }, 200)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/api/tour-book.test.ts`
Expected: 10 passing tests.

- [ ] **Step 5: Commit**

```bash
git add app/api/tour/book/route.ts tests/api/tour-book.test.ts
git commit -m "feat(api): POST /api/tour/book — tour booking creation route"
```

---

### Task 4: Tour modal context + provider

**Files:**
- Create: `lib/tour-modal-context.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces:
  - `TourModalProvider({ children })` — wraps app, renders `<TourModal />` once
  - `useTourModal(): { isOpen: boolean; open: () => void; close: () => void }`

Note: `<TourModal />` itself is empty/placeholder this task. Tasks 5–7 build it out. This task isolates the context wiring so the modal can be developed incrementally without breaking the build.

- [ ] **Step 1: Create the tour modal placeholder**

Create `components/marketing/tour-modal.tsx`:
```tsx
'use client'

import { useTourModal } from '@/lib/tour-modal-context'

export function TourModal() {
  const { isOpen, close } = useTourModal()
  if (!isOpen) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80"
      onClick={close}
    >
      <div className="liquid-glass p-12 max-w-md" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={close} className="text-ivory">Close (placeholder)</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create the context provider**

Create `lib/tour-modal-context.tsx`:
```tsx
'use client'

import { createContext, useCallback, useContext, useState, ReactNode } from 'react'
import { TourModal } from '@/components/marketing/tour-modal'

type Ctx = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const TourModalContext = createContext<Ctx | null>(null)

export function TourModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  return (
    <TourModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      <TourModal />
    </TourModalContext.Provider>
  )
}

export function useTourModal(): Ctx {
  const ctx = useContext(TourModalContext)
  if (!ctx) throw new Error('useTourModal must be used within TourModalProvider')
  return ctx
}
```

- [ ] **Step 3: Wire the provider into the root layout**

Read `app/layout.tsx` to find the body/children wrapping. Wrap `{children}` with `<TourModalProvider>`:

```tsx
import { TourModalProvider } from '@/lib/tour-modal-context'
// ...existing imports

// Inside the layout's return, wrap children:
<TourModalProvider>{children}</TourModalProvider>
```

- [ ] **Step 4: Verify build still passes**

Run: `npx tsc --noEmit`
Expected: No type errors.

Run: `pnpm dev` (or `npm run dev`) and load the homepage in a browser. The page should render unchanged. (The modal isn't triggered yet.)

- [ ] **Step 5: Commit**

```bash
git add lib/tour-modal-context.tsx components/marketing/tour-modal.tsx app/layout.tsx
git commit -m "feat(tour): add TourModalProvider context + placeholder modal"
```

---

### Task 5: Tour modal — Step 1 (Details)

**Files:**
- Modify: `components/marketing/tour-modal.tsx`

**Interfaces:**
- Consumes: `useTourModal()` from Task 4
- Produces: Working step 1 of the modal — details form with name/email/phone, Continue button, ESC + click-outside + X to close, focus trap, scroll lock. Step 2/3 will be added in tasks 6 and 7.

- [ ] **Step 1: Replace the placeholder modal with the details step**

Rewrite `components/marketing/tour-modal.tsx`:
```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTourModal } from '@/lib/tour-modal-context'
import { Input } from '@/components/ui/input'

type Step = 'details' | 'schedule' | 'success'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validDetails(name: string, email: string, phone: string): boolean {
  return name.trim().length > 0 && EMAIL_RE.test(email.trim()) && phone.trim().length >= 7
}

export function TourModal() {
  const { isOpen, close } = useTourModal()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<Step>('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Portal mount guard for SSR
  useEffect(() => setMounted(true), [])

  // Reset state when modal opens
  useEffect(() => {
    if (!isOpen) return
    setStep('details')
    setName('')
    setEmail('')
    setPhone('')
  }, [isOpen])

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  // ESC to close + initial focus
  useEffect(() => {
    if (!isOpen) return
    firstInputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  if (!mounted || !isOpen) return null

  const detailsValid = validDetails(name, email, phone)

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-modal-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-obsidian/85 backdrop-blur-md p-4 overflow-y-auto"
      onClick={close}
    >
      <div
        className="liquid-glass relative w-full max-w-xl p-8 md:p-12 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-ivory/60 hover:text-white transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {step === 'details' && (
          <div>
            <header className="mb-10">
              <span className="text-label-caps text-heritage-gold mb-3 block">STEP 1 OF 2</span>
              <h2 id="tour-modal-title" className="text-headline-xl text-white">
                Book a Studio Tour
              </h2>
              <p className="text-body-md text-ivory/60 mt-3">15 min · Tampa, FL</p>
            </header>

            <div className="flex flex-col gap-8 mb-12">
              <Input
                ref={firstInputRef}
                label="NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Jane Founder"
              />
              <Input
                label="EMAIL"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                placeholder="jane@example.com"
              />
              <Input
                label="PHONE"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+1 555 555 5555"
              />
            </div>

            <button
              type="button"
              disabled={!detailsValid}
              onClick={() => setStep('schedule')}
              className={`w-full py-5 border text-label-caps text-center transition-colors duration-200 ${
                detailsValid
                  ? 'border-heritage-gold/60 text-heritage-gold hover:bg-heritage-gold hover:text-obsidian hover:border-heritage-gold'
                  : 'border-white/10 text-ivory/30 cursor-not-allowed'
              }`}
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
```

- [ ] **Step 2: Manually verify step 1 renders**

Temporarily add a debug trigger to test before tasks 6–8 wire the real triggers. In `components/marketing/final-cta.tsx`, replace the existing tour `<a>` wrapper (around line 19) with a `<button>` calling `useTourModal().open()`:
```tsx
'use client'
// add at top, replacing the line-1 import line if needed
import { useTourModal } from '@/lib/tour-modal-context'
// inside the component (mark FinalCTA as a client component if it isn't)
const { open } = useTourModal()
// ...then in JSX:
<button type="button" onClick={open}>
  <Button variant="secondary" size="lg">Book A Studio Tour</Button>
</button>
```

**Important:** This wiring will be revisited in Task 8 with proper structure. The temporary change here is just to verify the modal renders during dev.

Run `pnpm dev`, scroll to the FinalCTA, click "Book A Studio Tour." Verify:
- Modal opens centered with backdrop blur
- All 3 fields render with labels and placeholders
- Tab order: NAME → EMAIL → PHONE → CONTINUE → CLOSE
- Continue stays disabled until name + valid email + 7+ char phone
- ESC closes the modal
- Clicking the backdrop closes the modal
- Clicking the X closes the modal
- Body scroll is locked while open

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/tour-modal.tsx
git commit -m "feat(tour): modal step 1 — details form with validation + a11y plumbing"
```

(The temporary FinalCTA debug edit from Step 2 will be properly wired in Task 8 and committed there. Leave it uncommitted for now, or revert it if you prefer a clean state between tasks.)

---

### Task 6: Tour modal — Step 2 (Schedule) + slot pre-fetch + Confirm submit

**Files:**
- Modify: `components/marketing/tour-modal.tsx`

**Interfaces:**
- Consumes: `GET /api/tour/slots` (Task 2), `POST /api/tour/book` (Task 3)
- Produces: Working schedule step with date strip + time chips, Back button (preserves details), Confirm button that submits to `/api/tour/book` and transitions to step 3 on success.

- [ ] **Step 1: Add state for slots, schedule selection, and submission**

In `components/marketing/tour-modal.tsx`, expand the imports and state block:

Update the imports at the top:
```tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
```

Add new types and constants below the existing `Step` type:
```tsx
type Status = 'idle' | 'loading-slots' | 'submitting' | 'error'

type BookingResult = { uid: string; startISO: string; durationMinutes: number }

function nextNDays(n: number): { iso: string; weekday: string; day: number; month: string }[] {
  const out: { iso: string; weekday: string; day: number; month: string }[] = []
  const today = new Date()
  for (let i = 1; i <= n; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    out.push({
      iso: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    })
  }
  return out
}
```

Add new state declarations alongside the existing `useState` calls:
```tsx
const [date, setDate] = useState<string | null>(null)
const [time, setTime] = useState<string | null>(null)
const [slotsByDate, setSlotsByDate] = useState<Record<string, string[]> | null>(null)
const [status, setStatus] = useState<Status>('idle')
const [errorMsg, setErrorMsg] = useState<string | null>(null)
const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)
```

Update the reset effect that runs when `isOpen` becomes true so it resets the new state too:
```tsx
useEffect(() => {
  if (!isOpen) return
  setStep('details')
  setName('')
  setEmail('')
  setPhone('')
  setDate(null)
  setTime(null)
  setSlotsByDate(null)
  setStatus('idle')
  setErrorMsg(null)
  setBookingResult(null)
}, [isOpen])
```

- [ ] **Step 2: Add slot pre-fetch effect that fires on modal open**

Add this effect below the existing effects, before `if (!mounted || !isOpen) return null`:
```tsx
const days = useMemo(() => nextNDays(14), [])

useEffect(() => {
  if (!isOpen) return
  const ctrl = new AbortController()
  setStatus('loading-slots')
  setErrorMsg(null)
  const start = days[0].iso
  const end = days[days.length - 1].iso
  fetch(`/api/tour/slots?start=${start}&end=${end}`, { signal: ctrl.signal })
    .then(async (r) => {
      if (!r.ok) throw new Error(String(r.status))
      return r.json() as Promise<{ slotsByDate: Record<string, string[]> }>
    })
    .then((data) => {
      setSlotsByDate(data.slotsByDate)
      setStatus('idle')
    })
    .catch((e) => {
      if (e.name !== 'AbortError') {
        setStatus('error')
        setErrorMsg('Could not load availability')
      }
    })
  return () => ctrl.abort()
}, [isOpen, days])
```

- [ ] **Step 3: Add the submit handler**

Add below the slot pre-fetch effect:
```tsx
const submit = useCallback(async () => {
  if (!date || !time) return
  setStatus('submitting')
  setErrorMsg(null)
  try {
    const res = await fetch('/api/tour/book', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), date, time }),
    })
    const body = await res.json()
    if (res.status === 409) {
      setStatus('error')
      setErrorMsg('That time was just booked — please pick another.')
      setTime(null)
      // Refetch slots so the UI reflects current state
      const r = await fetch(`/api/tour/slots?start=${days[0].iso}&end=${days[days.length - 1].iso}`)
      if (r.ok) {
        const data = (await r.json()) as { slotsByDate: Record<string, string[]> }
        setSlotsByDate(data.slotsByDate)
      }
      return
    }
    if (!res.ok) {
      setStatus('error')
      setErrorMsg("Couldn't reach our calendar — try again in a moment.")
      return
    }
    setBookingResult(body as BookingResult)
    setStep('success')
    setStatus('idle')
  } catch {
    setStatus('error')
    setErrorMsg("Couldn't reach our calendar — try again in a moment.")
  }
}, [date, time, name, email, phone, days])
```

- [ ] **Step 4: Render the schedule step**

Inside the existing JSX, immediately after the `{step === 'details' && (...)}` block, add:
```tsx
{step === 'schedule' && (
  <div>
    <header className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-label-caps text-heritage-gold block">STEP 2 OF 2</span>
        <button
          type="button"
          onClick={() => setStep('details')}
          className="text-label-caps text-ivory/60 hover:text-white transition-colors"
        >
          ← Back
        </button>
      </div>
      <h2 id="tour-modal-title" className="text-headline-xl text-white">
        Pick a Time
      </h2>
      <p className="text-body-md text-ivory/60 mt-3">15 min · Tampa, FL</p>
      {errorMsg && <p className="text-metadata text-red-400 mt-3">{errorMsg}</p>}
    </header>

    <div className="flex flex-col gap-10 mb-10">
      <div>
        <span className="text-label-caps text-ivory/60 mb-4 block">SELECT DATE</span>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {days.map((d) => {
            const active = date === d.iso
            const available = (slotsByDate?.[d.iso]?.length ?? 0) > 0
            const disabled = status !== 'loading-slots' && slotsByDate !== null && !available
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => {
                  if (!available) return
                  setDate(d.iso)
                  setTime(null)
                }}
                disabled={disabled || status === 'loading-slots'}
                className={`p-2 border text-center transition-colors ${
                  active
                    ? 'border-heritage-gold bg-heritage-gold/10 text-heritage-gold'
                    : disabled
                    ? 'border-slate-gray/40 text-ivory/20 cursor-not-allowed'
                    : 'border-slate-gray text-ivory/70 hover:border-white/30 hover:text-white'
                }`}
              >
                <div className="text-[10px] tracking-widest opacity-60">{d.weekday}</div>
                <div className="text-xl tabular-nums mt-1">{d.day}</div>
                <div className="text-[10px] tracking-widest opacity-60 mt-1">{d.month}</div>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <span className="text-label-caps text-ivory/60 mb-4 block">SELECT TIME</span>
        {!date ? (
          <p className="text-body-md text-ivory/40">
            {status === 'loading-slots' ? 'Loading availability…' : 'Choose a date first.'}
          </p>
        ) : (slotsByDate?.[date]?.length ?? 0) === 0 ? (
          <p className="text-body-md text-ivory/40">No times available — try another date.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {(slotsByDate?.[date] ?? []).map((t) => {
              const active = time === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={`px-4 py-3 border text-body-md tabular-nums transition-colors ${
                    active
                      ? 'border-heritage-gold bg-heritage-gold/10 text-heritage-gold'
                      : 'border-slate-gray text-ivory/70 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>

    <button
      type="button"
      disabled={!date || !time || status === 'submitting'}
      onClick={submit}
      className={`w-full py-5 border text-label-caps text-center transition-colors duration-200 ${
        date && time && status !== 'submitting'
          ? 'border-heritage-gold/60 text-heritage-gold hover:bg-heritage-gold hover:text-obsidian hover:border-heritage-gold'
          : 'border-white/10 text-ivory/30 cursor-not-allowed'
      }`}
    >
      {status === 'submitting' ? 'Booking…' : 'Confirm Tour'}
    </button>
  </div>
)}
```

- [ ] **Step 5: Manually verify step 2**

Run `pnpm dev`. With the debug trigger from Task 5 still in place, click the FinalCTA tour button. Fill in details. Click Continue. Verify:
- Date strip shows next 14 days
- Days with no slots are dim and disabled
- Picking a date populates the time grid
- Picking a time enables Confirm Tour
- Clicking Confirm submits — check the network tab for `POST /api/tour/book`
- 409 path: book the same slot twice in a row — second submit shows the "just booked" error and refetches
- ← Back returns to step 1 with name/email/phone still populated

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 7: Commit**

```bash
git add components/marketing/tour-modal.tsx
git commit -m "feat(tour): modal step 2 — schedule + submit with slot pre-fetch + 409 recovery"
```

---

### Task 7: Tour modal — Step 3 (Success) + ICS download

**Files:**
- Modify: `components/marketing/tour-modal.tsx`

**Interfaces:**
- Consumes: `bookingResult` state set in Task 6
- Produces: Success view showing booked date/time, Add to Calendar (.ics download), Close button

- [ ] **Step 1: Add the ICS generator helper**

Add this helper above the `TourModal` function declaration in `components/marketing/tour-modal.tsx`:
```tsx
function isoToICSDate(iso: string): string {
  // "2026-07-08T14:00:00-04:00" → UTC YYYYMMDDTHHMMSSZ
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  )
}

function buildICS(args: { uid: string; startISO: string; durationMinutes: number }): string {
  const start = new Date(args.startISO)
  const end = new Date(start.getTime() + args.durationMinutes * 60_000)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Voxa Studios//Tour//EN',
    'BEGIN:VEVENT',
    `UID:${args.uid}`,
    `DTSTAMP:${isoToICSDate(new Date().toISOString())}`,
    `DTSTART:${isoToICSDate(args.startISO)}`,
    `DTEND:${isoToICSDate(end.toISOString())}`,
    'SUMMARY:Voxa Studios Tour',
    'LOCATION:4021 N Armenia Ave\\, Suite 102\\, Tampa\\, FL 33607',
    "DESCRIPTION:Studio tour at Voxa Studios. We'll meet you at the door.",
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

function downloadICS(result: { uid: string; startISO: string; durationMinutes: number }) {
  const ics = buildICS(result)
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'voxa-studio-tour.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function formatBookingTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }) + ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
```

- [ ] **Step 2: Render the success step**

Inside the existing JSX, immediately after the `{step === 'schedule' && (...)}` block, add:
```tsx
{step === 'success' && bookingResult && (
  <div className="text-center">
    <div className="mx-auto mb-8 w-14 h-14 rounded-full border border-heritage-gold/60 flex items-center justify-center text-heritage-gold">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <span className="text-label-caps text-heritage-gold mb-3 block">TOUR BOOKED</span>
    <h2 id="tour-modal-title" className="text-headline-md text-white mb-4">
      {formatBookingTime(bookingResult.startISO)}
    </h2>
    <p className="text-body-md text-ivory/60 mb-10">
      Confirmation sent to <span className="text-ivory/90">{email}</span>
    </p>

    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => downloadICS(bookingResult)}
        className="w-full py-5 border border-heritage-gold/60 text-label-caps text-heritage-gold hover:bg-heritage-gold hover:text-obsidian hover:border-heritage-gold transition-colors duration-200"
      >
        + Add to Calendar
      </button>
      <button
        type="button"
        onClick={close}
        className="w-full py-4 text-label-caps text-ivory/60 hover:text-white transition-colors"
      >
        Close
      </button>
    </div>
  </div>
)}
```

- [ ] **Step 3: Manually verify**

Run `pnpm dev`. Complete a full tour booking. Verify:
- After confirm, modal swaps to the success view
- Date/time formatted nicely ("Wednesday, July 8 at 2:00 PM")
- Email shows the address the user entered
- + Add to Calendar downloads `voxa-studio-tour.ics`
- Open the downloaded file — confirms in Apple Calendar / Outlook / Google Calendar with correct title, location, time window
- Close returns to closed state; next open resets all fields

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add components/marketing/tour-modal.tsx
git commit -m "feat(tour): modal step 3 — success state + .ics calendar download"
```

---

### Task 8: Wire up FinalCTA and BookSection to open the modal

**Files:**
- Modify: `components/marketing/final-cta.tsx`
- Modify: `components/marketing/book-section.tsx`

**Interfaces:**
- Consumes: `useTourModal().open()` from Task 4

This task replaces the two external `https://cal.com/...` links with modal triggers. If you left a temporary debug edit in `final-cta.tsx` from Task 5, this task supersedes it.

- [ ] **Step 1: Update FinalCTA**

Currently `components/marketing/final-cta.tsx` has the tour button wrapped in an `<a>` to the Cal.com URL. Make `FinalCTA` a client component and use `useTourModal`:

Replace the entire file contents with:
```tsx
'use client'

import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { useTourModal } from '@/lib/tour-modal-context'

export function FinalCTA() {
  const { open } = useTourModal()
  return (
    <section className="py-[160px] bg-obsidian text-center border-t border-white/5">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <Reveal>
          <span className="text-label-caps text-heritage-gold mb-8 block tracking-[0.4em]">
            READY TO SCALE YOUR CONTENT?
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-display-lg-mobile md:text-headline-xl text-white mb-12">
            Find The Set That <br /> Matches Your Brand
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#book">
              <Button variant="primary" size="lg">Explore Studio Sets</Button>
            </a>
            <button type="button" onClick={open}>
              <Button variant="secondary" size="lg">Book A Studio Tour</Button>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update BookSection PreviewCard soft link**

Currently `components/marketing/book-section.tsx` has an `<a href="https://cal.com/...">` rendered under each non-locked PreviewCard CTA (around line 137). Replace it with a `<button>` calling `useTourModal().open()`.

In `components/marketing/book-section.tsx`, add this import at the top with the other imports:
```tsx
import { useTourModal } from '@/lib/tour-modal-context'
```

Inside the `PreviewCard` component (around the `const locked = !!c.comingSoon` line), add:
```tsx
const { open: openTour } = useTourModal()
```

Then replace the existing `<a>` element (the "Not ready to book?" link) with:
```tsx
{!locked && (
  <button
    type="button"
    onClick={openTour}
    className="mt-4 block w-full text-center text-xs text-ivory/45 hover:text-ivory/80 transition-colors"
  >
    Not ready to book? Tour the studio first →
  </button>
)}
```

- [ ] **Step 3: Manually verify both triggers**

Run `pnpm dev`. Test both entry points:
- Scroll to FinalCTA → click "Book A Studio Tour" → modal opens at step 1
- Scroll to BookSection → click the soft "Not ready to book?" link under each card → modal opens at step 1
- Complete a booking → success state shows → close → reopen → state cleanly resets

Also confirm Horizon (locked) cards still don't show the tour link.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 5: Run the full test suite**

Run: `npx vitest run`
Expected: All existing tests + the new Task 1/2/3 tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/marketing/final-cta.tsx components/marketing/book-section.tsx
git commit -m "feat(tour): wire FinalCTA + BookSection triggers to open tour modal"
```

---

## Final smoke test

After all 8 tasks, do one full end-to-end smoke test:

1. Local dev: `pnpm dev`, set `CAL_EVENT_TYPE_TOUR=6123370` in `.env.local`.
2. Click "Book A Studio Tour" in FinalCTA → modal opens → enter real name/email/phone → continue → pick a date/time → submit.
3. Verify Cal.com receives the booking (check Cal.com bookings dashboard).
4. Check that Cal.com sent a confirmation email to the test address.
5. Click + Add to Calendar → confirm the `.ics` opens in your calendar app with the correct details.
6. Reopen the modal → fields are clean.
7. Repeat the same test from the BookSection PreviewCard soft link → same result.

If all 7 smoke-test checkpoints pass: the feature is shippable.

---

## Deployment

After merging:
1. Set `CAL_EVENT_TYPE_TOUR=6123370` in Vercel production environment.
2. Confirm the Studio Tour event type on Cal.com has a `phone` booking field enabled.
3. Trigger a redeploy if env var was added post-deploy.
4. Smoke test the live URL.
