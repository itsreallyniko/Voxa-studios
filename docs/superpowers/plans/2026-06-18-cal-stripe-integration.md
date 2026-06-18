# Cal.com + Stripe Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace placeholder Schedule (step 06) and Checkout (step 07) wizard steps with a functioning flow: Cal.com supplies availability and persists the booking; Stripe takes payment via the "authorize, book, capture" pattern (manual capture).

**Architecture:** Next.js App Router. Custom UI talks to four new API routes under `app/api/` that wrap Cal.com REST v2 and Stripe Node SDK. Sensitive keys live in `lib/server/` modules. Booking total is recomputed server-side from `{setId, durationMinutes, addonIds}` and compared against the PaymentIntent amount to prevent client tampering. Cal.com booking uses `idempotency-key: <paymentIntentId>` to make `/api/booking/confirm` safe to retry.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind, Vitest, `stripe` (Node SDK), `@stripe/stripe-js` + `@stripe/react-stripe-js` (browser Elements). Cal.com via plain `fetch` against v2 REST API — no Cal SDK.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-06-18-cal-stripe-integration-design.md`
- **Timezone:** all Cal.com slot rendering and booking `start` values use `America/New_York`.
- **Currency:** USD. All Stripe amounts in cents (multiply dollars × 100).
- **Server-only modules:** anything under `lib/server/` must never be imported from a `'use client'` file. Add `import 'server-only'` at the top of each `lib/server/*.ts` file as a build-time guard.
- **No card data on our server:** Stripe Elements tokenizes in the browser. Server only ever sees PaymentIntent IDs.
- **Cal.com API key + Stripe secret key:** read at request time from `process.env`, never logged.
- **Idempotency:** Cal.com `POST /bookings` always sends `idempotency-key: <paymentIntentId>`. Stripe `paymentIntents.create()` always sends `idempotencyKey: <wizard-session-id>`.
- **Total recompute rule:** every server route that handles money MUST recompute the total from `{setId, durationMinutes, addonIds}` using `lib/server/pricing.ts` and compare it to the PaymentIntent amount. Mismatch → cancel PI + 400.
- **Cal.com v2 API base:** `https://api.cal.com/v2`. Auth header: `Authorization: Bearer <CAL_API_KEY>` plus `cal-api-version: 2024-09-04`.
- **TDD:** every task starts with a failing test, then implementation, then the test passes. Commit after each task.
- **No emoji** in code, comments, or commit messages unless the codebase already uses them (it doesn't).

---

### Task 1: Project bootstrap — deps, env example, contact fields in Booking type

**Files:**
- Modify: `package.json` (add deps)
- Create: `.env.local.example`
- Modify: `lib/steps.ts` (extend `Booking` type, update `initialBooking`, update `isStepComplete('details')`)
- Modify: `tests/booking-context.test.tsx` (update fixture to include new contact field)
- Test: `tests/steps.test.ts` (new)

**Interfaces:**
- Consumes: nothing
- Produces:
  ```ts
  // lib/steps.ts
  export type Booking = {
    collectionId: 'executive' | 'horizon' | null
    setId: string | null
    addonIds: string[]
    contact: { name: string; email: string }   // NEW
    details: { recordingType: string; guests: string; socials: string; notes: string }
    durationMinutes: number
    schedule: { date: string | null; time: string | null }
  }
  // isStepComplete('details') now requires recordingType AND contact.name AND valid contact.email
  ```

- [ ] **Step 1: Install Stripe deps**

Run:
```bash
cd /Users/nikotorres/Voxa_website
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
npm install --save-dev server-only
```
Expected: `package.json` shows three new runtime deps and `server-only` in devDependencies. No vulnerabilities reported beyond what's already there.

- [ ] **Step 2: Create `.env.local.example`**

Create file `.env.local.example` with exactly this content:
```
# Stripe (test mode keys for local; live keys in Vercel for prod)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Cal.com REST v2
CAL_API_KEY=cal_xxx
CAL_API_BASE=https://api.cal.com/v2
CAL_API_VERSION=2024-09-04

# One Cal.com numeric event-type ID per studio set. Values come from the
# Cal.com dashboard → Event Types after creating one per set in §8 of the spec.
CAL_EVENT_TYPE_EXECUTIVE_PODCAST=
CAL_EVENT_TYPE_AUTHORITY_DESK=
CAL_EVENT_TYPE_AUTHORITY_CREATOR=
CAL_EVENT_TYPE_HORIZON_PODCAST=
CAL_EVENT_TYPE_HORIZON_DESK=
CAL_EVENT_TYPE_HORIZON_CREATOR=

# Studio timezone used for all Cal.com slot rendering + booking start values.
STUDIO_TIMEZONE=America/New_York
```

- [ ] **Step 3: Add `.env.local` to .gitignore if not already**

Verify with:
```bash
grep -E '^\.env\.local$|^\.env\*\.local$|^\.env\*$' /Users/nikotorres/Voxa_website/.gitignore
```
Expected: at least one line matches. If empty, append `.env*.local` to `.gitignore`.

- [ ] **Step 4: Write a failing test for the extended Booking type**

Create `tests/steps.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { initialBooking, isStepComplete, type Booking } from '@/lib/steps'

const base: Booking = {
  ...initialBooking,
  collectionId: 'executive',
  setId: 'executive-podcast',
  details: { ...initialBooking.details, recordingType: 'Podcast' },
}

describe('isStepComplete(details)', () => {
  it('is incomplete when name + email are missing', () => {
    expect(isStepComplete('details', base)).toBe(false)
  })

  it('is incomplete when email is invalid', () => {
    const b: Booking = { ...base, contact: { name: 'Jane', email: 'not-an-email' } }
    expect(isStepComplete('details', b)).toBe(false)
  })

  it('is complete when recordingType, name, and valid email are all present', () => {
    const b: Booking = { ...base, contact: { name: 'Jane', email: 'jane@example.com' } }
    expect(isStepComplete('details', b)).toBe(true)
  })
})

describe('initialBooking', () => {
  it('includes an empty contact field', () => {
    expect(initialBooking.contact).toEqual({ name: '', email: '' })
  })
})
```

- [ ] **Step 5: Run the test — verify it fails**

Run:
```bash
npx vitest run tests/steps.test.ts
```
Expected: tests fail because `contact` doesn't exist on `Booking` (TypeScript error or runtime undefined access).

- [ ] **Step 6: Update `lib/steps.ts` to add the contact field**

Edit `lib/steps.ts`:

1. Add `contact: { name: string; email: string }` to the `Booking` type, between `addonIds` and `details`.
2. Add `contact: { name: '', email: '' }` to `initialBooking` in the same position.
3. Replace the `case 'details':` branch in `isStepComplete` with:

```ts
case 'details': {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.contact.email)
  return (
    b.details.recordingType.trim().length > 0 &&
    b.contact.name.trim().length > 0 &&
    emailOk
  )
}
```

- [ ] **Step 7: Update `tests/booking-context.test.tsx` if it asserts on Booking shape**

Run:
```bash
npx vitest run tests/booking-context.test.tsx
```
If it fails because of the new `contact` field, update the test fixture to include `contact: { name: '', email: '' }` wherever an explicit `Booking` is constructed.

- [ ] **Step 8: Run the full test suite — everything passes**

Run:
```bash
npx vitest run
```
Expected: all tests pass.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json .env.local.example .gitignore lib/steps.ts tests/steps.test.ts tests/booking-context.test.tsx
git commit -m "feat: add contact fields to Booking; scaffold Stripe deps + env example"
```

---

### Task 2: Details step — required Name + Email inputs

**Files:**
- Modify: `components/book/steps/details-step.tsx`
- Test: `tests/details-step.test.tsx` (new)

**Interfaces:**
- Consumes: `Booking.contact` from Task 1
- Produces: UI that writes to `booking.contact.{name,email}` via `setBooking`

- [ ] **Step 1: Write the failing test**

Create `tests/details-step.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run the test — verify it fails**

```bash
npx vitest run tests/details-step.test.tsx
```
Expected: "Unable to find a label" errors for both fields.

- [ ] **Step 3: Add the inputs to `details-step.tsx`**

In `components/book/steps/details-step.tsx`, add two new `<Input />` instances at the **top** of the form (before "WHAT ARE YOU RECORDING?"). Replace the `update` helper with one that handles `contact` too:

```tsx
const updateContact = (field: 'name' | 'email', value: string) => {
  setBooking((b) => ({ ...b, contact: { ...b.contact, [field]: value } }))
}
```

Then inside the `flex flex-col gap-8` wrapper, insert before the existing `recordingType` Input:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <Input
    label="YOUR NAME"
    placeholder="Jane Founder"
    value={booking.contact.name}
    onChange={(e) => updateContact('name', e.target.value)}
    autoComplete="name"
  />
  <Input
    label="EMAIL"
    type="email"
    placeholder="jane@example.com"
    value={booking.contact.email}
    onChange={(e) => updateContact('email', e.target.value)}
    autoComplete="email"
    inputMode="email"
  />
</div>
```

- [ ] **Step 4: Run the test — verify it passes**

```bash
npx vitest run tests/details-step.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Visually verify in dev**

Run:
```bash
npm run dev
```
Open http://localhost:3000/book, walk to step 04, confirm Name + Email appear at the top of the form, render with the obsidian/gold styling, and the Next button is disabled until both are filled with a valid email.

- [ ] **Step 6: Commit**

```bash
git add components/book/steps/details-step.tsx tests/details-step.test.tsx
git commit -m "feat: collect customer name + email in details step"
```

---

### Task 3: Server-side pricing module

**Files:**
- Create: `lib/server/pricing.ts`
- Test: `tests/server/pricing.test.ts` (new)

**Interfaces:**
- Consumes: `addons` from `lib/content/addons.ts`, constants from `lib/pricing.ts`
- Produces:
  ```ts
  // lib/server/pricing.ts
  export function recomputeTotalCents(input: {
    durationMinutes: number
    addonIds: string[]
  }): number
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/server/pricing.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { recomputeTotalCents } from '@/lib/server/pricing'

describe('recomputeTotalCents', () => {
  it('returns 30000 (=$300) for 90 min, no add-ons', () => {
    expect(recomputeTotalCents({ durationMinutes: 90, addonIds: [] })).toBe(30000)
  })

  it('adds 10000 (=$100) per extra hour above 90 min', () => {
    expect(recomputeTotalCents({ durationMinutes: 150, addonIds: [] })).toBe(40000)
    expect(recomputeTotalCents({ durationMinutes: 330, addonIds: [] })).toBe(70000)
  })

  it('adds known add-on prices', () => {
    expect(
      recomputeTotalCents({ durationMinutes: 90, addonIds: ['teleprompter', 'extra-camera'] })
    ).toBe(30000 + 15000 + 25000)
  })

  it('ignores unknown add-on ids', () => {
    expect(recomputeTotalCents({ durationMinutes: 90, addonIds: ['ghost-id'] })).toBe(30000)
  })

  it('combines extra time + add-ons', () => {
    expect(recomputeTotalCents({ durationMinutes: 210, addonIds: ['producer'] })).toBe(
      30000 + 20000 + 40000
    )
  })
})
```

- [ ] **Step 2: Run the test — verify it fails**

```bash
npx vitest run tests/server/pricing.test.ts
```
Expected: import resolution error (module doesn't exist).

- [ ] **Step 3: Create `lib/server/pricing.ts`**

```ts
import 'server-only'
import { getTotal } from '@/lib/pricing'
import { addons } from '@/lib/content/addons'

export function recomputeTotalCents(input: {
  durationMinutes: number
  addonIds: string[]
}): number {
  const r = getTotal(input, addons)
  return Math.round(r.total * 100)
}
```

- [ ] **Step 4: Run the test — verify it passes**

```bash
npx vitest run tests/server/pricing.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/server/pricing.ts tests/server/pricing.test.ts
git commit -m "feat: add server-side pricing recompute (cents)"
```

---

### Task 4: Set ID → Cal.com event-type ID mapping

**Files:**
- Create: `lib/server/set-event-types.ts`
- Test: `tests/server/set-event-types.test.ts` (new)

**Interfaces:**
- Consumes: env vars `CAL_EVENT_TYPE_*`
- Produces:
  ```ts
  // lib/server/set-event-types.ts
  export type StudioSetId =
    | 'executive-podcast' | 'authority-desk' | 'authority-creator'
    | 'horizon-podcast' | 'horizon-desk' | 'horizon-creator'

  export function setIdToEventTypeId(setId: string): number | null
  export const KNOWN_SET_IDS: readonly StudioSetId[]
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/server/set-event-types.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'

describe('setIdToEventTypeId', () => {
  beforeEach(() => {
    process.env.CAL_EVENT_TYPE_EXECUTIVE_PODCAST = '111'
    process.env.CAL_EVENT_TYPE_AUTHORITY_DESK = '222'
    process.env.CAL_EVENT_TYPE_AUTHORITY_CREATOR = '333'
    process.env.CAL_EVENT_TYPE_HORIZON_PODCAST = '444'
    process.env.CAL_EVENT_TYPE_HORIZON_DESK = '555'
    process.env.CAL_EVENT_TYPE_HORIZON_CREATOR = '666'
  })

  it('maps each known set id to its env-var numeric id', async () => {
    const { setIdToEventTypeId } = await import('@/lib/server/set-event-types')
    expect(setIdToEventTypeId('executive-podcast')).toBe(111)
    expect(setIdToEventTypeId('authority-desk')).toBe(222)
    expect(setIdToEventTypeId('authority-creator')).toBe(333)
    expect(setIdToEventTypeId('horizon-podcast')).toBe(444)
    expect(setIdToEventTypeId('horizon-desk')).toBe(555)
    expect(setIdToEventTypeId('horizon-creator')).toBe(666)
  })

  it('returns null for unknown set ids', async () => {
    const { setIdToEventTypeId } = await import('@/lib/server/set-event-types')
    expect(setIdToEventTypeId('unknown-set')).toBeNull()
    expect(setIdToEventTypeId('')).toBeNull()
  })

  it('returns null when the env var is unset', async () => {
    delete process.env.CAL_EVENT_TYPE_HORIZON_PODCAST
    const { setIdToEventTypeId } = await import('@/lib/server/set-event-types')
    expect(setIdToEventTypeId('horizon-podcast')).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test — verify it fails**

```bash
npx vitest run tests/server/set-event-types.test.ts
```
Expected: module not found.

- [ ] **Step 3: Create `lib/server/set-event-types.ts`**

```ts
import 'server-only'

export type StudioSetId =
  | 'executive-podcast'
  | 'authority-desk'
  | 'authority-creator'
  | 'horizon-podcast'
  | 'horizon-desk'
  | 'horizon-creator'

export const KNOWN_SET_IDS: readonly StudioSetId[] = [
  'executive-podcast',
  'authority-desk',
  'authority-creator',
  'horizon-podcast',
  'horizon-desk',
  'horizon-creator',
] as const

const ENV_VAR: Record<StudioSetId, string> = {
  'executive-podcast': 'CAL_EVENT_TYPE_EXECUTIVE_PODCAST',
  'authority-desk': 'CAL_EVENT_TYPE_AUTHORITY_DESK',
  'authority-creator': 'CAL_EVENT_TYPE_AUTHORITY_CREATOR',
  'horizon-podcast': 'CAL_EVENT_TYPE_HORIZON_PODCAST',
  'horizon-desk': 'CAL_EVENT_TYPE_HORIZON_DESK',
  'horizon-creator': 'CAL_EVENT_TYPE_HORIZON_CREATOR',
}

export function setIdToEventTypeId(setId: string): number | null {
  if (!(KNOWN_SET_IDS as readonly string[]).includes(setId)) return null
  const raw = process.env[ENV_VAR[setId as StudioSetId]]
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}
```

- [ ] **Step 4: Run the test — verify it passes**

```bash
npx vitest run tests/server/set-event-types.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/server/set-event-types.ts tests/server/set-event-types.test.ts
git commit -m "feat: map studio set ids to Cal.com event-type env vars"
```

---

### Task 5: Cal.com REST client + `/api/cal/slots` route

**Files:**
- Create: `lib/server/cal.ts`
- Create: `app/api/cal/slots/route.ts`
- Test: `tests/server/cal.test.ts` (new) — unit test the client with `fetch` mocked
- Test: `tests/api/cal-slots.test.ts` (new) — integration test the route

**Interfaces:**
- Consumes: `setIdToEventTypeId` (Task 4)
- Produces:
  ```ts
  // lib/server/cal.ts
  export async function getSlots(args: {
    eventTypeId: number
    startISO: string   // e.g. '2026-06-19T00:00:00-04:00'
    endISO: string
    durationMinutes: number
    timeZone: string
  }): Promise<{ slotsByDate: Record<string, string[]> }>

  export async function createBooking(args: {
    eventTypeId: number
    startISO: string
    durationMinutes: number
    attendee: { name: string; email: string; timeZone: string }
    metadata?: Record<string, string>
    idempotencyKey: string
  }): Promise<{ uid: string; id: number }>

  export async function cancelBooking(uid: string, reason: string): Promise<void>

  // app/api/cal/slots/route.ts
  // GET ?setId=…&start=YYYY-MM-DD&end=YYYY-MM-DD&duration=<minutes>
  // → 200 { slotsByDate: { "2026-06-20": ["09:00","13:00"], ... } }
  // → 400 if setId unknown, duration < 90, range > 60 days, or end < start
  ```

- [ ] **Step 1: Write failing test for `getSlots()`**

Create `tests/server/cal.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const realFetch = global.fetch

beforeEach(() => {
  process.env.CAL_API_KEY = 'test-key'
  process.env.CAL_API_BASE = 'https://api.cal.com/v2'
  process.env.CAL_API_VERSION = '2024-09-04'
})

afterEach(() => {
  global.fetch = realFetch
  vi.restoreAllMocks()
})

describe('getSlots', () => {
  it('calls Cal.com /slots with bearer token and version header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          slots: {
            '2026-06-20': [{ time: '2026-06-20T13:00:00-04:00' }],
            '2026-06-21': [{ time: '2026-06-21T09:00:00-04:00' }, { time: '2026-06-21T15:00:00-04:00' }],
          },
        },
      }),
    })
    global.fetch = fetchMock as unknown as typeof fetch

    const { getSlots } = await import('@/lib/server/cal')
    const r = await getSlots({
      eventTypeId: 42,
      startISO: '2026-06-20T00:00:00-04:00',
      endISO: '2026-07-04T00:00:00-04:00',
      durationMinutes: 90,
      timeZone: 'America/New_York',
    })

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('https://api.cal.com/v2/slots')
    expect(url).toContain('eventTypeId=42')
    expect(url).toContain('startTime=2026-06-20')
    expect(url).toContain('duration=90')
    expect(url).toContain('timeZone=America%2FNew_York')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer test-key')
    expect((init.headers as Record<string, string>)['cal-api-version']).toBe('2024-09-04')

    expect(r.slotsByDate['2026-06-20']).toEqual(['13:00'])
    expect(r.slotsByDate['2026-06-21']).toEqual(['09:00', '15:00'])
  })

  it('throws when Cal.com returns non-2xx', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'boom',
    }) as unknown as typeof fetch
    const { getSlots } = await import('@/lib/server/cal')
    await expect(
      getSlots({
        eventTypeId: 1,
        startISO: '2026-06-20T00:00:00-04:00',
        endISO: '2026-06-21T00:00:00-04:00',
        durationMinutes: 90,
        timeZone: 'America/New_York',
      })
    ).rejects.toThrow(/Cal.com.*500/)
  })
})
```

- [ ] **Step 2: Run the test — verify it fails**

```bash
npx vitest run tests/server/cal.test.ts
```
Expected: module not found.

- [ ] **Step 3: Create `lib/server/cal.ts`**

```ts
import 'server-only'

function base(): string {
  return process.env.CAL_API_BASE ?? 'https://api.cal.com/v2'
}

function headers(): Record<string, string> {
  const key = process.env.CAL_API_KEY
  if (!key) throw new Error('CAL_API_KEY is not set')
  return {
    Authorization: `Bearer ${key}`,
    'cal-api-version': process.env.CAL_API_VERSION ?? '2024-09-04',
    'Content-Type': 'application/json',
  }
}

function hhmm(iso: string): string {
  // "2026-06-20T13:00:00-04:00" → "13:00"
  const t = iso.split('T')[1] ?? ''
  return t.slice(0, 5)
}

export async function getSlots(args: {
  eventTypeId: number
  startISO: string
  endISO: string
  durationMinutes: number
  timeZone: string
}): Promise<{ slotsByDate: Record<string, string[]> }> {
  const params = new URLSearchParams({
    eventTypeId: String(args.eventTypeId),
    startTime: args.startISO,
    endTime: args.endISO,
    duration: String(args.durationMinutes),
    timeZone: args.timeZone,
  })
  const url = `${base()}/slots?${params.toString()}`
  const res = await fetch(url, { headers: headers(), method: 'GET', cache: 'no-store' })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Cal.com /slots ${res.status}: ${body}`)
  }
  const json = (await res.json()) as { data: { slots: Record<string, { time: string }[]> } }
  const slotsByDate: Record<string, string[]> = {}
  for (const [date, items] of Object.entries(json.data?.slots ?? {})) {
    slotsByDate[date] = items.map((s) => hhmm(s.time))
  }
  return { slotsByDate }
}

export async function createBooking(args: {
  eventTypeId: number
  startISO: string
  durationMinutes: number
  attendee: { name: string; email: string; timeZone: string }
  metadata?: Record<string, string>
  idempotencyKey: string
}): Promise<{ uid: string; id: number }> {
  const res = await fetch(`${base()}/bookings`, {
    method: 'POST',
    headers: { ...headers(), 'idempotency-key': args.idempotencyKey },
    body: JSON.stringify({
      eventTypeId: args.eventTypeId,
      start: args.startISO,
      lengthInMinutes: args.durationMinutes,
      attendee: args.attendee,
      metadata: args.metadata ?? {},
    }),
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    const err = new Error(`Cal.com /bookings ${res.status}: ${body}`) as Error & { status?: number }
    err.status = res.status
    throw err
  }
  const json = (await res.json()) as { data: { uid: string; id: number } }
  return { uid: json.data.uid, id: json.data.id }
}

export async function cancelBooking(uid: string, reason: string): Promise<void> {
  const res = await fetch(`${base()}/bookings/${encodeURIComponent(uid)}/cancel`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ cancellationReason: reason }),
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Cal.com cancel ${res.status}: ${body}`)
  }
}
```

- [ ] **Step 4: Run unit tests — they pass**

```bash
npx vitest run tests/server/cal.test.ts
```
Expected: PASS.

- [ ] **Step 5: Write failing test for the slots route**

Create `tests/api/cal-slots.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/server/cal', () => ({
  getSlots: vi.fn(),
}))

import { getSlots } from '@/lib/server/cal'

beforeEach(() => {
  vi.resetAllMocks()
  process.env.CAL_EVENT_TYPE_EXECUTIVE_PODCAST = '111'
  process.env.STUDIO_TIMEZONE = 'America/New_York'
})

async function call(qs: string) {
  const { GET } = await import('@/app/api/cal/slots/route')
  return GET(new Request(`http://localhost/api/cal/slots${qs}`))
}

describe('GET /api/cal/slots', () => {
  it('400s on unknown setId', async () => {
    const res = await call('?setId=fake&start=2026-06-20&end=2026-06-25&duration=90')
    expect(res.status).toBe(400)
  })

  it('400s on duration below 90', async () => {
    const res = await call('?setId=executive-podcast&start=2026-06-20&end=2026-06-25&duration=60')
    expect(res.status).toBe(400)
  })

  it('400s on range over 60 days', async () => {
    const res = await call('?setId=executive-podcast&start=2026-06-20&end=2026-09-20&duration=90')
    expect(res.status).toBe(400)
  })

  it('200 with slotsByDate from Cal.com', async () => {
    vi.mocked(getSlots).mockResolvedValue({
      slotsByDate: { '2026-06-20': ['13:00'] },
    })
    const res = await call('?setId=executive-podcast&start=2026-06-20&end=2026-06-25&duration=90')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.slotsByDate['2026-06-20']).toEqual(['13:00'])
    expect(vi.mocked(getSlots).mock.calls[0][0].eventTypeId).toBe(111)
    expect(vi.mocked(getSlots).mock.calls[0][0].timeZone).toBe('America/New_York')
  })

  it('502 when Cal.com client throws', async () => {
    vi.mocked(getSlots).mockRejectedValue(new Error('boom'))
    const res = await call('?setId=executive-podcast&start=2026-06-20&end=2026-06-25&duration=90')
    expect(res.status).toBe(502)
  })
})
```

- [ ] **Step 6: Run the route test — verify it fails**

```bash
npx vitest run tests/api/cal-slots.test.ts
```
Expected: route module not found.

- [ ] **Step 7: Create `app/api/cal/slots/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { getSlots } from '@/lib/server/cal'
import { setIdToEventTypeId } from '@/lib/server/set-event-types'

export const runtime = 'nodejs'

const ONE_DAY_MS = 86_400_000
const MAX_RANGE_DAYS = 60
const MIN_DURATION = 90

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const setId = searchParams.get('setId') ?? ''
  const start = searchParams.get('start') ?? ''
  const end = searchParams.get('end') ?? ''
  const duration = Number(searchParams.get('duration') ?? '0')

  const eventTypeId = setIdToEventTypeId(setId)
  if (eventTypeId === null) return bad('unknown setId')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) return bad('invalid date')
  if (!Number.isFinite(duration) || duration < MIN_DURATION) return bad('invalid duration')

  const startMs = Date.parse(`${start}T00:00:00Z`)
  const endMs = Date.parse(`${end}T23:59:59Z`)
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return bad('invalid range')
  if (endMs - startMs > MAX_RANGE_DAYS * ONE_DAY_MS) return bad('range too large')

  const tz = process.env.STUDIO_TIMEZONE ?? 'America/New_York'
  try {
    const r = await getSlots({
      eventTypeId,
      startISO: `${start}T00:00:00`,
      endISO: `${end}T23:59:59`,
      durationMinutes: duration,
      timeZone: tz,
    })
    return NextResponse.json(r)
  } catch (e) {
    console.error('/api/cal/slots', e)
    return bad('upstream', 502)
  }
}
```

- [ ] **Step 8: Run route tests — they pass**

```bash
npx vitest run tests/api/cal-slots.test.ts
```
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add lib/server/cal.ts app/api/cal/slots/route.ts tests/server/cal.test.ts tests/api/cal-slots.test.ts
git commit -m "feat: Cal.com REST client + /api/cal/slots route"
```

---

### Task 6: Stripe client + `/api/stripe/intent` route

**Files:**
- Create: `lib/server/stripe.ts`
- Create: `app/api/stripe/intent/route.ts`
- Test: `tests/server/stripe.test.ts` (new)
- Test: `tests/api/stripe-intent.test.ts` (new)

**Interfaces:**
- Consumes: `recomputeTotalCents` (Task 3), `setIdToEventTypeId` (Task 4)
- Produces:
  ```ts
  // lib/server/stripe.ts
  export function getStripe(): Stripe
  export async function createManualCaptureIntent(args: {
    amountCents: number
    metadata: Record<string, string>
    idempotencyKey: string
  }): Promise<{ id: string; clientSecret: string; amount: number; status: string }>

  // app/api/stripe/intent/route.ts
  // POST body: { setId, durationMinutes, addonIds, wizardSessionId, contact: { name, email } }
  // → 200 { clientSecret, paymentIntentId, amountCents }
  // → 400 if input invalid
  ```

- [ ] **Step 1: Write failing test for the Stripe helper**

Create `tests/server/stripe.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const piCreate = vi.fn()
vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      paymentIntents: { create: piCreate },
    })),
  }
})

beforeEach(() => {
  vi.resetAllMocks()
  process.env.STRIPE_SECRET_KEY = 'sk_test_123'
})

describe('createManualCaptureIntent', () => {
  it('creates a PI with manual capture and returns client secret', async () => {
    piCreate.mockResolvedValue({
      id: 'pi_abc',
      client_secret: 'pi_abc_secret',
      amount: 40000,
      status: 'requires_payment_method',
    })

    const { createManualCaptureIntent } = await import('@/lib/server/stripe')
    const r = await createManualCaptureIntent({
      amountCents: 40000,
      metadata: { setId: 'executive-podcast' },
      idempotencyKey: 'wiz-123',
    })

    expect(piCreate).toHaveBeenCalledOnce()
    const [args, opts] = piCreate.mock.calls[0]
    expect(args.amount).toBe(40000)
    expect(args.currency).toBe('usd')
    expect(args.capture_method).toBe('manual')
    expect(args.metadata.setId).toBe('executive-podcast')
    expect(opts.idempotencyKey).toBe('wiz-123')

    expect(r.clientSecret).toBe('pi_abc_secret')
    expect(r.id).toBe('pi_abc')
  })
})
```

- [ ] **Step 2: Run the test — verify it fails**

```bash
npx vitest run tests/server/stripe.test.ts
```
Expected: module not found.

- [ ] **Step 3: Create `lib/server/stripe.ts`**

```ts
import 'server-only'
import Stripe from 'stripe'

let _client: Stripe | null = null

export function getStripe(): Stripe {
  if (_client) return _client
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  _client = new Stripe(key, { apiVersion: '2024-06-20' })
  return _client
}

export async function createManualCaptureIntent(args: {
  amountCents: number
  metadata: Record<string, string>
  idempotencyKey: string
}): Promise<{ id: string; clientSecret: string; amount: number; status: string }> {
  const stripe = getStripe()
  const pi = await stripe.paymentIntents.create(
    {
      amount: args.amountCents,
      currency: 'usd',
      capture_method: 'manual',
      automatic_payment_methods: { enabled: true },
      metadata: args.metadata,
    },
    { idempotencyKey: args.idempotencyKey }
  )
  if (!pi.client_secret) throw new Error('Stripe returned no client_secret')
  return { id: pi.id, clientSecret: pi.client_secret, amount: pi.amount, status: pi.status }
}
```

- [ ] **Step 4: Run unit tests — they pass**

```bash
npx vitest run tests/server/stripe.test.ts
```
Expected: PASS.

- [ ] **Step 5: Write failing test for the intent route**

Create `tests/api/stripe-intent.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/server/stripe', () => ({
  createManualCaptureIntent: vi.fn(),
}))

import { createManualCaptureIntent } from '@/lib/server/stripe'

beforeEach(() => {
  vi.resetAllMocks()
  process.env.CAL_EVENT_TYPE_EXECUTIVE_PODCAST = '111'
})

async function post(body: unknown) {
  const { POST } = await import('@/app/api/stripe/intent/route')
  return POST(
    new Request('http://localhost/api/stripe/intent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

describe('POST /api/stripe/intent', () => {
  it('400s on unknown setId', async () => {
    const res = await post({
      setId: 'unknown',
      durationMinutes: 90,
      addonIds: [],
      wizardSessionId: 'wiz-1',
      contact: { name: 'Jane', email: 'jane@example.com' },
    })
    expect(res.status).toBe(400)
  })

  it('400s on invalid email', async () => {
    const res = await post({
      setId: 'executive-podcast',
      durationMinutes: 90,
      addonIds: [],
      wizardSessionId: 'wiz-1',
      contact: { name: 'Jane', email: 'nope' },
    })
    expect(res.status).toBe(400)
  })

  it('creates a $300 PI for 90-min base session', async () => {
    vi.mocked(createManualCaptureIntent).mockResolvedValue({
      id: 'pi_1',
      clientSecret: 'pi_1_secret',
      amount: 30000,
      status: 'requires_payment_method',
    })
    const res = await post({
      setId: 'executive-podcast',
      durationMinutes: 90,
      addonIds: [],
      wizardSessionId: 'wiz-1',
      contact: { name: 'Jane', email: 'jane@example.com' },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.clientSecret).toBe('pi_1_secret')
    expect(body.amountCents).toBe(30000)

    const args = vi.mocked(createManualCaptureIntent).mock.calls[0][0]
    expect(args.amountCents).toBe(30000)
    expect(args.idempotencyKey).toBe('wiz-1')
    expect(args.metadata.setId).toBe('executive-podcast')
    expect(args.metadata.email).toBe('jane@example.com')
  })
})
```

- [ ] **Step 6: Run the route test — verify it fails**

```bash
npx vitest run tests/api/stripe-intent.test.ts
```
Expected: route not found.

- [ ] **Step 7: Create `app/api/stripe/intent/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { createManualCaptureIntent } from '@/lib/server/stripe'
import { recomputeTotalCents } from '@/lib/server/pricing'
import { setIdToEventTypeId } from '@/lib/server/set-event-types'

export const runtime = 'nodejs'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return bad('invalid json')
  }

  const setId = String(body?.setId ?? '')
  const durationMinutes = Number(body?.durationMinutes ?? 0)
  const addonIds: string[] = Array.isArray(body?.addonIds) ? body.addonIds.map(String) : []
  const wizardSessionId = String(body?.wizardSessionId ?? '')
  const name = String(body?.contact?.name ?? '').trim()
  const email = String(body?.contact?.email ?? '').trim()

  if (setIdToEventTypeId(setId) === null) return bad('unknown setId')
  if (!Number.isFinite(durationMinutes) || durationMinutes < 90) return bad('invalid duration')
  if (!wizardSessionId) return bad('missing wizardSessionId')
  if (!name) return bad('missing name')
  if (!EMAIL.test(email)) return bad('invalid email')

  const amountCents = recomputeTotalCents({ durationMinutes, addonIds })

  try {
    const pi = await createManualCaptureIntent({
      amountCents,
      metadata: {
        setId,
        durationMinutes: String(durationMinutes),
        addonIds: addonIds.join(','),
        wizardSessionId,
        name,
        email,
      },
      idempotencyKey: wizardSessionId,
    })
    return NextResponse.json({
      clientSecret: pi.clientSecret,
      paymentIntentId: pi.id,
      amountCents: pi.amount,
    })
  } catch (e) {
    console.error('/api/stripe/intent', e)
    return bad('upstream', 502)
  }
}
```

- [ ] **Step 8: Run route tests — they pass**

```bash
npx vitest run tests/api/stripe-intent.test.ts
```
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add lib/server/stripe.ts app/api/stripe/intent/route.ts tests/server/stripe.test.ts tests/api/stripe-intent.test.ts
git commit -m "feat: Stripe client + /api/stripe/intent (manual capture PI)"
```

---

### Task 7: `/api/booking/confirm` — orchestrate Cal.com booking + Stripe capture

**Files:**
- Create: `app/api/booking/confirm/route.ts`
- Test: `tests/api/booking-confirm.test.ts` (new)

**Interfaces:**
- Consumes: `createBooking` (Task 5), `cancelBooking` (Task 5), `recomputeTotalCents` (Task 3), `setIdToEventTypeId` (Task 4), `getStripe` (Task 6)
- Produces:
  ```ts
  // POST body: {
  //   paymentIntentId, setId, durationMinutes, addonIds,
  //   schedule: { date: 'YYYY-MM-DD', time: 'HH:mm' },
  //   contact: { name, email },
  //   details: { recordingType, guests, socials, notes }
  // }
  // → 200 { paid: true, bookingUid, bookingId }
  // → 409 { error: 'slot taken' }    (after PI cancel)
  // → 400 { error: '...' }            (validation; PI canceled if it was requires_capture)
  // → 502 { error: 'upstream' }       (Cal/Stripe failure; PI canceled where possible)
  ```

- [ ] **Step 1: Write happy-path failing test**

Create `tests/api/booking-confirm.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/server/cal', () => ({
  createBooking: vi.fn(),
  cancelBooking: vi.fn(),
}))
const piRetrieve = vi.fn()
const piCapture = vi.fn()
const piCancel = vi.fn()
vi.mock('@/lib/server/stripe', () => ({
  getStripe: () => ({
    paymentIntents: { retrieve: piRetrieve, capture: piCapture, cancel: piCancel },
  }),
}))

import { createBooking, cancelBooking } from '@/lib/server/cal'

beforeEach(() => {
  vi.resetAllMocks()
  process.env.CAL_EVENT_TYPE_EXECUTIVE_PODCAST = '111'
  process.env.STUDIO_TIMEZONE = 'America/New_York'
})

async function post(body: unknown) {
  const { POST } = await import('@/app/api/booking/confirm/route')
  return POST(
    new Request('http://localhost/api/booking/confirm', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

const validBody = {
  paymentIntentId: 'pi_1',
  setId: 'executive-podcast',
  durationMinutes: 90,
  addonIds: [],
  schedule: { date: '2026-06-20', time: '13:00' },
  contact: { name: 'Jane', email: 'jane@example.com' },
  details: { recordingType: 'Podcast', guests: '', socials: '', notes: '' },
}

describe('POST /api/booking/confirm', () => {
  it('books Cal then captures PI on happy path', async () => {
    piRetrieve.mockResolvedValue({ id: 'pi_1', status: 'requires_capture', amount: 30000 })
    vi.mocked(createBooking).mockResolvedValue({ uid: 'cal_abc', id: 5 })
    piCapture.mockResolvedValue({ id: 'pi_1', status: 'succeeded' })

    const res = await post(validBody)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.paid).toBe(true)
    expect(body.bookingUid).toBe('cal_abc')

    expect(vi.mocked(createBooking).mock.calls[0][0].idempotencyKey).toBe('pi_1')
    expect(piCapture).toHaveBeenCalledWith('pi_1')
    expect(piCancel).not.toHaveBeenCalled()
  })

  it('cancels PI and returns 409 when Cal returns 409', async () => {
    piRetrieve.mockResolvedValue({ id: 'pi_1', status: 'requires_capture', amount: 30000 })
    const slotErr = new Error('slot') as Error & { status?: number }
    slotErr.status = 409
    vi.mocked(createBooking).mockRejectedValue(slotErr)
    piCancel.mockResolvedValue({ id: 'pi_1', status: 'canceled' })

    const res = await post(validBody)
    expect(res.status).toBe(409)
    expect(piCancel).toHaveBeenCalledWith('pi_1')
    expect(piCapture).not.toHaveBeenCalled()
  })

  it('rejects + cancels PI when amount mismatches recomputed total', async () => {
    piRetrieve.mockResolvedValue({ id: 'pi_1', status: 'requires_capture', amount: 999 })
    piCancel.mockResolvedValue({ id: 'pi_1', status: 'canceled' })

    const res = await post(validBody)
    expect(res.status).toBe(400)
    expect(piCancel).toHaveBeenCalledWith('pi_1')
    expect(createBooking).not.toHaveBeenCalled()
  })

  it('400s when PI is not requires_capture', async () => {
    piRetrieve.mockResolvedValue({ id: 'pi_1', status: 'requires_payment_method', amount: 30000 })
    const res = await post(validBody)
    expect(res.status).toBe(400)
    expect(createBooking).not.toHaveBeenCalled()
    expect(piCancel).not.toHaveBeenCalled()
  })

  it('retries once on Cal 5xx then cancels PI', async () => {
    piRetrieve.mockResolvedValue({ id: 'pi_1', status: 'requires_capture', amount: 30000 })
    const flaky = new Error('flake') as Error & { status?: number }
    flaky.status = 500
    vi.mocked(createBooking).mockRejectedValue(flaky)
    piCancel.mockResolvedValue({ id: 'pi_1', status: 'canceled' })

    const res = await post(validBody)
    expect(res.status).toBe(502)
    expect(createBooking).toHaveBeenCalledTimes(2)
    expect(piCancel).toHaveBeenCalledWith('pi_1')
  })
})
```

- [ ] **Step 2: Run the test — verify it fails**

```bash
npx vitest run tests/api/booking-confirm.test.ts
```
Expected: route not found.

- [ ] **Step 3: Create `app/api/booking/confirm/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { createBooking } from '@/lib/server/cal'
import { recomputeTotalCents } from '@/lib/server/pricing'
import { setIdToEventTypeId } from '@/lib/server/set-event-types'
import { getStripe } from '@/lib/server/stripe'

export const runtime = 'nodejs'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^\d{2}:\d{2}$/

function json(payload: unknown, status: number) {
  return NextResponse.json(payload, { status })
}

async function tryCancel(id: string) {
  try {
    await getStripe().paymentIntents.cancel(id)
  } catch (e) {
    console.error('cancel failed', e)
  }
}

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid json' }, 400)
  }

  const paymentIntentId = String(body?.paymentIntentId ?? '')
  const setId = String(body?.setId ?? '')
  const durationMinutes = Number(body?.durationMinutes ?? 0)
  const addonIds: string[] = Array.isArray(body?.addonIds) ? body.addonIds.map(String) : []
  const date = String(body?.schedule?.date ?? '')
  const time = String(body?.schedule?.time ?? '')
  const name = String(body?.contact?.name ?? '').trim()
  const email = String(body?.contact?.email ?? '').trim()

  if (!paymentIntentId) return json({ error: 'missing paymentIntentId' }, 400)
  const eventTypeId = setIdToEventTypeId(setId)
  if (eventTypeId === null) return json({ error: 'unknown setId' }, 400)
  if (!Number.isFinite(durationMinutes) || durationMinutes < 90) return json({ error: 'invalid duration' }, 400)
  if (!DATE.test(date) || !TIME.test(time)) return json({ error: 'invalid schedule' }, 400)
  if (!name || !EMAIL.test(email)) return json({ error: 'invalid contact' }, 400)

  const stripe = getStripe()
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
  if (pi.status !== 'requires_capture') return json({ error: 'payment not authorized' }, 400)

  const expectedCents = recomputeTotalCents({ durationMinutes, addonIds })
  if (pi.amount !== expectedCents) {
    await tryCancel(paymentIntentId)
    return json({ error: 'amount mismatch' }, 400)
  }

  const tz = process.env.STUDIO_TIMEZONE ?? 'America/New_York'
  // Cal.com accepts ISO with offset. We send the local wall-clock time + offset
  // for EST/EDT. June 2026 → EDT (UTC-4). For correctness across DST we let
  // Cal.com resolve via timeZone on the attendee + local start string.
  const startISO = `${date}T${time}:00`

  const attempt = async () =>
    createBooking({
      eventTypeId,
      startISO,
      durationMinutes,
      attendee: { name, email, timeZone: tz },
      metadata: { wizardSessionId: paymentIntentId },
      idempotencyKey: paymentIntentId,
    })

  let booking
  try {
    booking = await attempt()
  } catch (e: any) {
    const status: number | undefined = e?.status
    if (status === 409) {
      await tryCancel(paymentIntentId)
      return json({ error: 'slot taken' }, 409)
    }
    if (typeof status === 'number' && status >= 500) {
      try {
        booking = await attempt()
      } catch (e2) {
        console.error('Cal book retry failed', e2)
        await tryCancel(paymentIntentId)
        return json({ error: 'upstream' }, 502)
      }
    } else {
      console.error('Cal book failed', e)
      await tryCancel(paymentIntentId)
      return json({ error: 'upstream' }, 502)
    }
  }

  try {
    await stripe.paymentIntents.capture(paymentIntentId)
  } catch (e) {
    console.error('capture failed after Cal booking', e)
    return json({ paid: false, bookingUid: booking!.uid, bookingId: booking!.id, error: 'capture_failed' }, 500)
  }

  return json({ paid: true, bookingUid: booking!.uid, bookingId: booking!.id }, 200)
}
```

- [ ] **Step 4: Run route tests — they pass**

```bash
npx vitest run tests/api/booking-confirm.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/api/booking/confirm/route.ts tests/api/booking-confirm.test.ts
git commit -m "feat: /api/booking/confirm orchestrates Cal book + Stripe capture"
```

---

### Task 8: Stripe webhook receiver

**Files:**
- Create: `app/api/stripe/webhook/route.ts`
- Test: `tests/api/stripe-webhook.test.ts` (new)

**Interfaces:**
- Consumes: `getStripe` (Task 6), `cancelBooking` (Task 5)
- Produces:
  ```ts
  // POST raw body, header 'stripe-signature'
  // → 200 {} on verified + handled
  // → 400 on signature failure
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/api/stripe-webhook.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const constructEvent = vi.fn()
vi.mock('@/lib/server/stripe', () => ({
  getStripe: () => ({ webhooks: { constructEvent } }),
}))
vi.mock('@/lib/server/cal', () => ({ cancelBooking: vi.fn() }))

import { cancelBooking } from '@/lib/server/cal'

beforeEach(() => {
  vi.resetAllMocks()
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
})

async function post(body: string, sig = 'sig_ok') {
  const { POST } = await import('@/app/api/stripe/webhook/route')
  return POST(
    new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': sig },
      body,
    })
  )
}

describe('POST /api/stripe/webhook', () => {
  it('400s when signature verification fails', async () => {
    constructEvent.mockImplementation(() => {
      throw new Error('bad sig')
    })
    const res = await post('{}', 'bad')
    expect(res.status).toBe(400)
    expect(cancelBooking).not.toHaveBeenCalled()
  })

  it('200s and cancels Cal booking on charge.refunded', async () => {
    constructEvent.mockReturnValue({
      type: 'charge.refunded',
      data: {
        object: {
          payment_intent: 'pi_1',
          metadata: { bookingUid: 'cal_abc' },
        },
      },
    })
    const res = await post('{}')
    expect(res.status).toBe(200)
    expect(vi.mocked(cancelBooking)).toHaveBeenCalledWith('cal_abc', expect.any(String))
  })

  it('200s and no-ops on payment_intent.canceled', async () => {
    constructEvent.mockReturnValue({ type: 'payment_intent.canceled', data: { object: {} } })
    const res = await post('{}')
    expect(res.status).toBe(200)
    expect(cancelBooking).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run the test — verify it fails**

```bash
npx vitest run tests/api/stripe-webhook.test.ts
```
Expected: route not found.

- [ ] **Step 3: Create `app/api/stripe/webhook/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/server/stripe'
import { cancelBooking } from '@/lib/server/cal'

export const runtime = 'nodejs'
// Webhook needs the raw body for signature verification.
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') ?? ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('STRIPE_WEBHOOK_SECRET unset')
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 })
  }
  const rawBody = await req.text()

  let event
  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig, secret)
  } catch (e) {
    console.error('webhook signature failed', e)
    return NextResponse.json({ error: 'bad signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'charge.refunded': {
        const charge = event.data.object as any
        const bookingUid = charge?.metadata?.bookingUid as string | undefined
        if (bookingUid) {
          await cancelBooking(bookingUid, 'Stripe refund issued')
        }
        break
      }
      case 'payment_intent.succeeded':
      case 'payment_intent.canceled':
      case 'payment_intent.amount_capturable_updated':
        // logging only
        break
      default:
        break
    }
  } catch (e) {
    console.error('webhook handler error', e)
  }

  return NextResponse.json({})
}
```

- [ ] **Step 4: Run tests — they pass**

```bash
npx vitest run tests/api/stripe-webhook.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/api/stripe/webhook/route.ts tests/api/stripe-webhook.test.ts
git commit -m "feat: Stripe webhook receiver (signature verified)"
```

---

### Task 9: Rate-limit helper + apply to public routes

**Files:**
- Create: `lib/server/rate-limit.ts`
- Modify: `app/api/cal/slots/route.ts` (apply limiter)
- Modify: `app/api/stripe/intent/route.ts` (apply limiter)
- Test: `tests/server/rate-limit.test.ts` (new)

**Interfaces:**
- Produces:
  ```ts
  export function check(ip: string, key: string, opts?: { limit?: number; windowMs?: number }): { ok: boolean; retryAfterMs: number }
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/server/rate-limit.test.ts`:
```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-18T00:00:00Z'))
})

describe('rate-limit check', () => {
  it('allows up to limit in window, then blocks', async () => {
    const { check } = await import('@/lib/server/rate-limit')
    for (let i = 0; i < 10; i++) expect(check('1.1.1.1', 'k', { limit: 10, windowMs: 1000 }).ok).toBe(true)
    expect(check('1.1.1.1', 'k', { limit: 10, windowMs: 1000 }).ok).toBe(false)
  })

  it('resets after the window', async () => {
    const { check } = await import('@/lib/server/rate-limit')
    for (let i = 0; i < 10; i++) check('1.1.1.1', 'k', { limit: 10, windowMs: 1000 })
    expect(check('1.1.1.1', 'k', { limit: 10, windowMs: 1000 }).ok).toBe(false)
    vi.advanceTimersByTime(1001)
    expect(check('1.1.1.1', 'k', { limit: 10, windowMs: 1000 }).ok).toBe(true)
  })

  it('isolates per ip + per key', async () => {
    const { check } = await import('@/lib/server/rate-limit')
    for (let i = 0; i < 10; i++) check('1.1.1.1', 'a', { limit: 10, windowMs: 1000 })
    expect(check('1.1.1.1', 'a', { limit: 10, windowMs: 1000 }).ok).toBe(false)
    expect(check('1.1.1.1', 'b', { limit: 10, windowMs: 1000 }).ok).toBe(true)
    expect(check('2.2.2.2', 'a', { limit: 10, windowMs: 1000 }).ok).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test — verify it fails**

```bash
npx vitest run tests/server/rate-limit.test.ts
```
Expected: module not found.

- [ ] **Step 3: Create `lib/server/rate-limit.ts`**

```ts
import 'server-only'

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export function check(
  ip: string,
  key: string,
  opts: { limit?: number; windowMs?: number } = {}
): { ok: boolean; retryAfterMs: number } {
  const limit = opts.limit ?? 10
  const windowMs = opts.windowMs ?? 1000
  const id = `${ip}|${key}`
  const now = Date.now()
  const b = buckets.get(id)
  if (!b || b.resetAt <= now) {
    buckets.set(id, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfterMs: 0 }
  }
  if (b.count < limit) {
    b.count += 1
    return { ok: true, retryAfterMs: 0 }
  }
  return { ok: false, retryAfterMs: b.resetAt - now }
}

export function ipFromRequest(req: Request): string {
  const xff = req.headers.get('x-forwarded-for') ?? ''
  const first = xff.split(',')[0]?.trim()
  return first || req.headers.get('x-real-ip') || 'unknown'
}
```

- [ ] **Step 4: Apply to `app/api/cal/slots/route.ts`**

At the top of the `GET` handler, after parsing query params, before the `getSlots` call, add:
```ts
import { check, ipFromRequest } from '@/lib/server/rate-limit'
// ...
const rl = check(ipFromRequest(req), 'cal/slots')
if (!rl.ok) return NextResponse.json({ error: 'rate limited' }, { status: 429, headers: { 'retry-after': Math.ceil(rl.retryAfterMs / 1000).toString() } })
```

- [ ] **Step 5: Apply to `app/api/stripe/intent/route.ts`**

Same pattern at the top of `POST`:
```ts
import { check, ipFromRequest } from '@/lib/server/rate-limit'
// ...
const rl = check(ipFromRequest(req), 'stripe/intent')
if (!rl.ok) return NextResponse.json({ error: 'rate limited' }, { status: 429, headers: { 'retry-after': Math.ceil(rl.retryAfterMs / 1000).toString() } })
```

- [ ] **Step 6: Run all tests — they pass**

```bash
npx vitest run
```
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/server/rate-limit.ts app/api/cal/slots/route.ts app/api/stripe/intent/route.ts tests/server/rate-limit.test.ts
git commit -m "feat: in-memory rate limit on /api/cal/slots + /api/stripe/intent"
```

---

### Task 10: Schedule step — fetch real slots from `/api/cal/slots`

**Files:**
- Modify: `components/book/steps/schedule-step.tsx`
- Test: `tests/schedule-step.test.tsx` (new)

**Interfaces:**
- Consumes: `GET /api/cal/slots` (Task 5), `Booking` (Task 1)
- Produces: updates `booking.schedule.{date,time}` from real availability

- [ ] **Step 1: Write the failing test**

Create `tests/schedule-step.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingProvider, useBooking } from '@/lib/booking-context'
import { ScheduleStep } from '@/components/book/steps/schedule-step'

function Seed() {
  const { setBooking } = useBooking()
  setBooking((b) => ({ ...b, collectionId: 'executive', setId: 'executive-podcast' }))
  return null
}

beforeEach(() => {
  vi.restoreAllMocks()
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

    await waitFor(() => expect(global.fetch).toHaveBeenCalledOnce())
    const call = (global.fetch as any).mock.calls[0][0] as string
    expect(call).toContain('/api/cal/slots')
    expect(call).toContain('setId=executive-podcast')
    expect(call).toContain('duration=90')

    // After fetch, time column shows "Choose a date first"
    expect(screen.getByText(/choose a date first/i)).toBeInTheDocument()

    // Click a date with availability (the 2nd day forward — index i=2 → even → slots)
    const dayButtons = screen.getAllByRole('button')
    // pick the first enabled date tile (date tiles are labelled with day number)
    const enabled = dayButtons.find((b) => !b.hasAttribute('disabled') && b.textContent && /\d/.test(b.textContent))
    expect(enabled).toBeTruthy()
    await userEvent.click(enabled!)

    // Time options should be visible
    await waitFor(() => expect(screen.getByText('09:00')).toBeInTheDocument())
    expect(screen.getByText('13:00')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test — verify it fails**

```bash
npx vitest run tests/schedule-step.test.tsx
```
Expected: FAIL — current step doesn't call `fetch`.

- [ ] **Step 3: Rewrite `components/book/steps/schedule-step.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useBooking } from '@/lib/booking-context'

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

export function ScheduleStep() {
  const { booking, setBooking } = useBooking()
  const days = nextNDays(14)
  const [slotsByDate, setSlotsByDate] = useState<Record<string, string[]> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!booking.setId) return
    const ctrl = new AbortController()
    setLoading(true)
    setError(null)
    const start = days[0].iso
    const end = days[days.length - 1].iso
    const url = `/api/cal/slots?setId=${encodeURIComponent(booking.setId)}&start=${start}&end=${end}&duration=${booking.durationMinutes}`
    fetch(url, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<{ slotsByDate: Record<string, string[]> }>
      })
      .then((data) => setSlotsByDate(data.slotsByDate))
      .catch((e) => {
        if (e.name !== 'AbortError') setError('Could not load availability')
      })
      .finally(() => setLoading(false))
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.setId, booking.durationMinutes])

  const pickDate = (iso: string) =>
    setBooking((b) => ({ ...b, schedule: { ...b.schedule, date: iso, time: null } }))
  const pickTime = (t: string) =>
    setBooking((b) => ({ ...b, schedule: { ...b.schedule, time: t } }))

  const times = booking.schedule.date ? slotsByDate?.[booking.schedule.date] ?? [] : []

  return (
    <div>
      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 06 — SCHEDULE</span>
        <h2 className="text-headline-xl text-white">Pick a date &amp; time</h2>
        <p className="text-body-lg text-ivory/60 mt-6">
          Showing slots that fit your {Math.floor(booking.durationMinutes / 60)}h{' '}
          {booking.durationMinutes % 60 ? `${booking.durationMinutes % 60}m ` : ''}session.
        </p>
        {error && <p className="text-metadata text-red-400 mt-2">{error}</p>}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12">
        <div>
          <span className="text-label-caps text-ivory/60 mb-4 block">SELECT DATE</span>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {days.map((d) => {
              const active = booking.schedule.date === d.iso
              const available = (slotsByDate?.[d.iso]?.length ?? 0) > 0
              const disabled = !loading && slotsByDate !== null && !available
              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => available && pickDate(d.iso)}
                  disabled={disabled || loading}
                  className={`p-2 sm:p-3 border text-center transition-colors ${
                    active
                      ? 'border-heritage-gold bg-heritage-gold/10 text-heritage-gold'
                      : disabled
                      ? 'border-slate-gray/40 text-ivory/20 cursor-not-allowed'
                      : 'border-slate-gray text-ivory/70 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <div className="text-[10px] tracking-widest opacity-60">{d.weekday}</div>
                  <div className="text-2xl tabular-nums mt-1">{d.day}</div>
                  <div className="text-[10px] tracking-widest opacity-60 mt-1">{d.month}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <span className="text-label-caps text-ivory/60 mb-4 block">SELECT TIME</span>
          {!booking.schedule.date ? (
            <p className="text-body-md text-ivory/40">Choose a date first.</p>
          ) : times.length === 0 ? (
            <p className="text-body-md text-ivory/40">No times available — try another date.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {times.map((t) => {
                const active = booking.schedule.time === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => pickTime(t)}
                    className={`px-6 py-4 border text-left text-body-md tabular-nums transition-colors ${
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
    </div>
  )
}
```

- [ ] **Step 4: Run test — passes**

```bash
npx vitest run tests/schedule-step.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/book/steps/schedule-step.tsx tests/schedule-step.test.tsx
git commit -m "feat: schedule step fetches real availability from /api/cal/slots"
```

---

### Task 11: Checkout step — Stripe Payment Element + confirm flow

**Files:**
- Modify: `components/book/steps/checkout-step.tsx`
- Create: `components/book/checkout-form.tsx` (new — owns the Elements form)
- Modify: `lib/booking-context.tsx` (expose a stable `wizardSessionId`)
- Test: `tests/checkout-step.test.tsx` (new)

**Interfaces:**
- Consumes: `POST /api/stripe/intent` (Task 6), `POST /api/booking/confirm` (Task 7)
- Produces: wires Pay button to real Stripe + real booking

- [ ] **Step 1: Add `wizardSessionId` to `lib/booking-context.tsx`**

In `lib/booking-context.tsx`, generate a session id once per provider mount and expose it through the context:

```tsx
// at top
import { useMemo } from 'react'
// inside BookingProvider component body, before the return:
const wizardSessionId = useMemo(() => crypto.randomUUID(), [])
// extend Ctx type to include `wizardSessionId: string` and the provider value to pass it
```

Add `wizardSessionId: string` to the `Ctx` type and to the provider value.

- [ ] **Step 2: Write the failing test**

Create `tests/checkout-step.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingProvider, useBooking } from '@/lib/booking-context'
import { CheckoutStep } from '@/components/book/steps/checkout-step'

// Mock @stripe/react-stripe-js: render children, expose stubs for hooks.
const stripeConfirm = vi.fn()
vi.mock('@stripe/react-stripe-js', () => {
  return {
    Elements: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    PaymentElement: () => <div data-testid="payment-element" />,
    useStripe: () => ({ confirmPayment: stripeConfirm }),
    useElements: () => ({}),
  }
})
vi.mock('@stripe/stripe-js', () => ({ loadStripe: () => Promise.resolve({}) }))

function Seed() {
  const { setBooking } = useBooking()
  setBooking((b) => ({
    ...b,
    collectionId: 'executive',
    setId: 'executive-podcast',
    contact: { name: 'Jane', email: 'jane@example.com' },
    details: { ...b.details, recordingType: 'Podcast' },
    schedule: { date: '2026-06-20', time: '13:00' },
  }))
  return null
}

beforeEach(() => {
  vi.restoreAllMocks()
  stripeConfirm.mockReset()
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test'
})

async function setupHappyMocks() {
  let call = 0
  global.fetch = vi.fn().mockImplementation(async (url: string) => {
    call += 1
    if (url.endsWith('/api/stripe/intent')) {
      return { ok: true, json: async () => ({ clientSecret: 'pi_1_secret', paymentIntentId: 'pi_1', amountCents: 30000 }) }
    }
    if (url.endsWith('/api/booking/confirm')) {
      return { ok: true, json: async () => ({ paid: true, bookingUid: 'cal_abc', bookingId: 7 }) }
    }
    throw new Error('unexpected fetch ' + url)
  }) as any
  stripeConfirm.mockResolvedValue({ paymentIntent: { id: 'pi_1', status: 'requires_capture' } })
}

describe('CheckoutStep with real flow', () => {
  it('happy path: intent → confirm → book → paid screen', async () => {
    await setupHappyMocks()
    render(
      <BookingProvider>
        <Seed />
        <CheckoutStep />
      </BookingProvider>
    )

    await waitFor(() => expect(screen.getByTestId('payment-element')).toBeInTheDocument())

    const pay = await screen.findByRole('button', { name: /pay \$/i })
    await userEvent.click(pay)

    await waitFor(() => expect(screen.getByText(/you're booked/i)).toBeInTheDocument())
    expect(stripeConfirm).toHaveBeenCalledOnce()
  })

  it('slot-taken: confirm returns 409 → error UI with retry-from-schedule', async () => {
    global.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.endsWith('/api/stripe/intent')) {
        return { ok: true, json: async () => ({ clientSecret: 'pi_1_secret', paymentIntentId: 'pi_1', amountCents: 30000 }) }
      }
      if (url.endsWith('/api/booking/confirm')) {
        return { ok: false, status: 409, json: async () => ({ error: 'slot taken' }) }
      }
      throw new Error('unexpected fetch ' + url)
    }) as any
    stripeConfirm.mockResolvedValue({ paymentIntent: { id: 'pi_1', status: 'requires_capture' } })

    render(
      <BookingProvider>
        <Seed />
        <CheckoutStep />
      </BookingProvider>
    )
    const pay = await screen.findByRole('button', { name: /pay \$/i })
    await userEvent.click(pay)
    await waitFor(() => expect(screen.getByText(/slot was just taken/i)).toBeInTheDocument())
    expect(screen.getByRole('button', { name: /pick another time/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run the test — verify it fails**

```bash
npx vitest run tests/checkout-step.test.tsx
```
Expected: current checkout has no Elements / no real fetch — fails.

- [ ] **Step 4: Create `components/book/checkout-form.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { useBooking } from '@/lib/booking-context'

type Phase = 'idle' | 'authorizing' | 'booking' | 'paid' | 'error'

export function CheckoutForm({
  paymentIntentId,
  amountCents,
  onPaid,
  onSlotTaken,
}: {
  paymentIntentId: string
  amountCents: number
  onPaid: (info: { bookingUid: string; bookingId: number }) => void
  onSlotTaken: () => void
}) {
  const { booking } = useBooking()
  const stripe = useStripe()
  const elements = useElements()
  const [phase, setPhase] = useState<Phase>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const onPay = async () => {
    if (!stripe) return
    setErrorMsg(null)
    setPhase('authorizing')
    if (!elements) {
      setErrorMsg('Payment form not ready. Refresh and try again.')
      setPhase('error')
      return
    }
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })
    if (error || paymentIntent?.status !== 'requires_capture') {
      setErrorMsg(error?.message ?? 'Payment could not be authorized.')
      setPhase('error')
      return
    }

    setPhase('booking')
    try {
      const res = await fetch('/api/booking/confirm', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          setId: booking.setId,
          durationMinutes: booking.durationMinutes,
          addonIds: booking.addonIds,
          schedule: booking.schedule,
          contact: booking.contact,
          details: booking.details,
        }),
      })
      if (res.status === 409) {
        onSlotTaken()
        return
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `confirm ${res.status}`)
      }
      const body = (await res.json()) as { bookingUid: string; bookingId: number }
      setPhase('paid')
      onPaid({ bookingUid: body.bookingUid, bookingId: body.bookingId })
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Something went wrong booking your session. Your card was not charged.')
      setPhase('error')
    }
  }

  const label =
    phase === 'authorizing'
      ? 'Authorizing card…'
      : phase === 'booking'
      ? 'Confirming booking…'
      : phase === 'paid'
      ? 'Done'
      : `Pay $${(amountCents / 100).toLocaleString()}`

  return (
    <div className="flex flex-col gap-6">
      <PaymentElement />
      {errorMsg && <p className="text-metadata text-red-400">{errorMsg}</p>}
      <Button
        variant="gold"
        size="lg"
        onClick={onPay}
        disabled={!stripe || phase === 'authorizing' || phase === 'booking' || phase === 'paid'}
      >
        {label}
      </Button>
      <p className="text-metadata text-ivory/30 text-center">Secured by Stripe. Card not charged until your slot is confirmed.</p>
    </div>
  )
}
```

- [ ] **Step 5: Rewrite `components/book/steps/checkout-step.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useBooking } from '@/lib/booking-context'
import { findCollection, findSet } from '@/lib/content/collections'
import { CheckoutForm } from '@/components/book/checkout-form'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ivory/60">{k}</dt>
      <dd className="text-ivory text-right">{v || '—'}</dd>
    </div>
  )
}

export function CheckoutStep() {
  const { booking, totals, goTo, wizardSessionId } = useBooking()
  const collection = findCollection(booking.collectionId)
  const set = findSet(booking.collectionId, booking.setId)

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [amountCents, setAmountCents] = useState<number | null>(null)
  const [bootError, setBootError] = useState<string | null>(null)
  const [paid, setPaid] = useState<{ bookingUid: string } | null>(null)
  const [slotTaken, setSlotTaken] = useState(false)

  useEffect(() => {
    if (!booking.setId) return
    setBootError(null)
    fetch('/api/stripe/intent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        setId: booking.setId,
        durationMinutes: booking.durationMinutes,
        addonIds: booking.addonIds,
        wizardSessionId,
        contact: booking.contact,
      }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<{ clientSecret: string; paymentIntentId: string; amountCents: number }>
      })
      .then((d) => {
        setClientSecret(d.clientSecret)
        setPaymentIntentId(d.paymentIntentId)
        setAmountCents(d.amountCents)
      })
      .catch(() => setBootError('Could not start payment. Refresh and try again.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.setId, booking.durationMinutes, booking.addonIds.join(',')])

  if (paid) {
    return (
      <div className="flex flex-col items-center text-center py-24">
        <span className="material-symbols-outlined text-heritage-gold text-6xl mb-8">check_circle</span>
        <span className="text-label-caps text-heritage-gold mb-4 block">SESSION CONFIRMED</span>
        <h2 className="text-headline-xl text-white mb-6">You&apos;re booked.</h2>
        <p className="text-body-lg text-ivory/60 max-w-xl">
          A confirmation has been sent to {booking.contact.email}. Our team will reach out 24 hours before your session.
        </p>
        <div className="mt-12 frosted-glass p-8 max-w-md w-full text-left">
          <p className="text-label-caps text-ivory/60 mb-2">YOUR SESSION</p>
          <p className="text-body-lg text-white">{set?.name}</p>
          <p className="text-body-md text-ivory/60 mt-1">
            {booking.schedule.date} · {booking.schedule.time}
          </p>
          <p className="text-headline-md text-heritage-gold mt-6 tabular-nums">${totals.total.toLocaleString()}</p>
          <p className="text-metadata text-ivory/30 mt-4">Booking #{paid.bookingUid}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 07 — CHECKOUT</span>
        <h2 className="text-headline-xl text-white">Confirm &amp; Pay</h2>
        <p className="text-body-lg text-ivory/60 mt-6">
          Review your session below, then complete payment to reserve your slot.
        </p>
      </header>

      {slotTaken && (
        <div className="mb-8 border border-red-500/40 bg-red-500/5 p-6">
          <p className="text-body-md text-red-300">That slot was just taken. Your card was not charged.</p>
          <button
            type="button"
            onClick={() => goTo('schedule')}
            className="mt-4 text-label-caps text-heritage-gold underline"
          >
            Pick another time →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="frosted-glass p-8">
          <span className="text-label-caps text-ivory/60 mb-6 block">CONFIRMATION</span>
          <dl className="flex flex-col gap-4 text-body-md">
            <Row k="Collection" v={collection?.name ?? ''} />
            <Row k="Set" v={set?.name ?? ''} />
            <Row k="Date" v={booking.schedule.date ?? ''} />
            <Row k="Time" v={booking.schedule.time ?? ''} />
            <Row
              k="Duration"
              v={`${Math.floor(booking.durationMinutes / 60)}h ${
                booking.durationMinutes % 60 ? `${booking.durationMinutes % 60}m` : ''
              }`.trim()}
            />
          </dl>
          <div className="h-px bg-slate-gray my-6" />
          <div className="flex justify-between items-baseline">
            <span className="text-label-caps text-white">TOTAL</span>
            <span className="text-headline-md text-white tabular-nums">${totals.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="frosted-glass p-8 flex flex-col">
          <span className="text-label-caps text-ivory/60 mb-6 block">PAYMENT</span>
          {bootError && <p className="text-metadata text-red-400">{bootError}</p>}
          {clientSecret && paymentIntentId && amountCents !== null && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#C9A96E',
                    colorBackground: '#0D0D0D',
                    colorText: '#F5F0E8',
                    colorTextSecondary: '#888888',
                    borderRadius: '6px',
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                  },
                },
              }}
            >
              <CheckoutForm
                paymentIntentId={paymentIntentId}
                amountCents={amountCents}
                onPaid={(info) => setPaid({ bookingUid: info.bookingUid })}
                onSlotTaken={() => setSlotTaken(true)}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Run the checkout test — passes**

```bash
npx vitest run tests/checkout-step.test.tsx
```
Expected: PASS.

- [ ] **Step 7: Run full test suite — all green**

```bash
npx vitest run
```
Expected: PASS.

- [ ] **Step 8: Type check + build**

```bash
npx tsc --noEmit
npm run build
```
Expected: both succeed. Fix any type errors that surface from the new mock/types.

- [ ] **Step 9: Commit**

```bash
git add components/book/checkout-step.tsx components/book/checkout-form.tsx components/book/steps/checkout-step.tsx lib/booking-context.tsx tests/checkout-step.test.tsx
git commit -m "feat: real Stripe Payment Element + booking confirm in checkout step"
```

---

### Task 12: Manual end-to-end shakedown

This is **not** automated. Tasks 1–11 give us a green test suite; this task verifies the real flow against Stripe test mode and Cal.com.

**Files:**
- None — but produces hands-on evidence the integration works before merging to main.

**Pre-flight:**
- `.env.local` populated using `.env.local.example` as a template — all six Cal event-type IDs, Stripe test keys, Cal API key, `STUDIO_TIMEZONE=America/New_York`.
- Six event types created in the Cal.com dashboard, named to match `lib/content/collections.ts`.
- `stripe login` completed locally; `stripe listen --forward-to localhost:3000/api/stripe/webhook` running in a side terminal — copy the `whsec_…` it prints into `.env.local`.

- [ ] **Step 1: Happy path with test card**

Run `npm run dev` (and keep `stripe listen` running). Walk the wizard end-to-end:
- Collection: Executive
- Set: Executive Podcast Set
- Skip add-ons
- Details: type valid name + email + recording type
- Length: keep 90 min
- Schedule: pick a date showing availability + a time
- Checkout: card `4242 4242 4242 4242`, exp any future, any CVC, any ZIP

Verify:
- Success screen renders with booking UID.
- Cal.com dashboard shows the booking with the right time + attendee email.
- Stripe dashboard shows a captured PaymentIntent for $300.

- [ ] **Step 2: Authorization failure**

Same flow, card `4000 0000 0000 0002` (generic decline).

Verify:
- Stripe Elements shows inline decline message.
- No Cal.com booking created.
- No captured charge in Stripe.

- [ ] **Step 3: Force a Cal.com failure**

Temporarily set `CAL_EVENT_TYPE_EXECUTIVE_PODCAST` to a deleted/invalid event-type id and restart dev. Repeat happy-path with `4242…`.

Verify:
- UI shows the "something went wrong booking your session" error.
- Stripe dashboard shows the PaymentIntent transitioned to `canceled` (not `succeeded`).
- No Cal booking created.

Restore the env var when done.

- [ ] **Step 4: Refund propagation via webhook**

From the happy-path Step 1 booking, issue a refund in the Stripe dashboard.

Verify:
- `stripe listen` shows the `charge.refunded` event delivered to `/api/stripe/webhook`.
- Cal.com dashboard shows the booking cancelled.

- [ ] **Step 5: Document outcome**

Append a brief note to the spec (`docs/superpowers/specs/2026-06-18-cal-stripe-integration-design.md`) under a new `## 13. Shakedown results` section with date + outcome.

```bash
git add docs/superpowers/specs/2026-06-18-cal-stripe-integration-design.md
git commit -m "docs: record end-to-end shakedown for Cal/Stripe integration"
```

---

## Done

When all 12 tasks are checked off, the wizard goes from cosmetic to functioning. Production go-live then needs only: setting Cal.com + Stripe to live mode, populating Vercel env vars, and re-pointing the Stripe webhook endpoint URL.
