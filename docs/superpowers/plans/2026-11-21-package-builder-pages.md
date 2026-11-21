# Package Builder Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three new pages (`/packages/course`, `/packages/vsl`, `/packages/demo`), each an advertorial story followed by a shared package builder that prices recording, editing and clips, then leads into a vision call, a Stripe deposit or a studio tour.

**Architecture:** A pure pricing engine (`lib/packages/pricing.ts`) is the single source of prices and is used on both client and server. Page copy and builder defaults live in content files per page. Two API routes (`/api/packages/lead`, `/api/packages/deposit`) recompute the quote on the server. The existing Stripe webhook sends the "deposit paid" email. The existing tour modal becomes source-aware so package tours never fire studio conversions.

**Tech Stack:** Next.js 14 app router, React 18, Tailwind (Cinematic Obsidian tokens in `DESIGN.md`), Stripe (`stripe`, `@stripe/react-stripe-js`), Cal (`@calcom/embed-react`), Resend HTTP API, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-21-package-builder-pages-design.md`

**Branch:** create `feature/package-builder` from `main` (not from `feature/voxa-onsite`).

## Global Constraints

- Package pages never push `generate_lead`, `tour_booked`, or any studio purchase event.
- All prices, thresholds, rates and turnaround numbers live only in `lib/packages/pricing.ts`. Studio time is priced by the existing `getTotal` from `lib/pricing.ts`, never re-implemented.
- Editing grid: short (up to 10 min) 75 / 125 / 200; medium (10–30) 150 / 250 / 400; long (30–60) 250 / 400 / 600 for clean / text / motion.
- Clips $20 each. Range high = total × 1.10. Both ends rounded to the nearest $50. Deposit = 30% of range low, rounded to the dollar. Call-first when range low ≥ $1,500. Revisions: 2 rounds.
- The price shows as a range, labeled "Your custom package," with "Final scope confirmed on a quick call." No copy that reads as a fixed menu.
- Deposit copy (verbatim meaning): credited toward the package total; fully refundable if you cancel after the vision call and before any work starts; non-refundable once recording or editing starts.
- The server recomputes every amount from the configuration. It never trusts a client price.
- The Vega II launch video and its client never appear anywhere.
- Package pages are not added to `app/sitemap.ts`.
- Phone width first: no horizontal scroll at 375px.
- Edit level labels: "Clean edit", "Edit + on-screen text", "Full motion design".

## Review Focus

1. **Tampered or odd configuration posted to the API** (videos 0 or 999, NaN, `recordMinutes` 45 or 10,000, unknown level): expect 400, and Stripe is never called. Tests in Task 5.
2. **Editing-only after adjusting recording:** the visitor sets recording to 6 hrs, then picks "I already have footage." Expect recording $0 on both client and server, with `recordMinutes` ignored. Tests in Tasks 1 and 6.
3. **Email not configured (`RESEND_API_KEY` missing) or Resend down:** the lead route still returns the quote with 200 and the visitor can carry on. The webhook still returns 200. Tests in Task 5.
4. **`NEXT_PUBLIC_CAL_PACKAGE_LINK` not set:** the confirmation and call step show a fallback (email and phone) instead of crashing or showing an empty box. Test in Task 7.
5. **Payment needs a redirect (3-D Secure) or the tab closes after paying:** returning to the page with `?payment_intent=…&redirect_status=succeeded` shows the confirmation. The deposit email still arrives via the webhook. Tests in Tasks 5 and 7.

---

### Task 1: Pricing engine

**Files:**
- Create: `lib/packages/pricing.ts`
- Test: `tests/packages/pricing.test.ts`

**Interfaces:**
- Consumes: `getTotal`, `PricingResult` from `lib/pricing.ts`.
- Produces:
  - `type PackageType = 'course' | 'vsl' | 'demo'`
  - `type LengthTier = 'short' | 'medium' | 'long'`
  - `type EditLevel = 'clean' | 'text' | 'motion'`
  - `type PackageConfig = { type: PackageType; videos: number; length: LengthTier; level: EditLevel; record: boolean; recordMinutes: number | null; clips: number }`
  - `type PackageQuote = { editing: number; recordMinutes: number; sessions: number[]; recording: number; clips: number; total: number; rangeLow: number; rangeHigh: number; deposit: number; callFirst: boolean; turnaroundDays: { low: number; high: number }; revisionRounds: number }`
  - Constants: `EDIT_GRID`, `LENGTH_MIDPOINT_MIN = { short: 5, medium: 20, long: 45 }`, `LENGTH_LABEL`, `LEVEL_LABEL`, `CLIP_PRICE = 20`, `RANGE_HIGH_FACTOR = 1.1`, `DEPOSIT_RATE = 0.3`, `CALL_FIRST_THRESHOLD = 1500`, `REVISION_ROUNDS = 2`, `RECORD_FACTOR = 1.5`, `MAX_SESSION_MINUTES = 300`, `MIN_SESSION_MINUTES = 90`, `VIDEO_LIMITS: Record<PackageType, { min: 1; max: number }>` = course 40, vsl 5, demo 10, `MAX_CLIPS = 200`, `MAX_RECORD_MINUTES = 3000`
  - `suggestRecordMinutes(videos: number, length: LengthTier): number`
  - `splitSessions(minutes: number): number[]`
  - `quotePackage(config: PackageConfig): PackageQuote`
  - `parsePackageConfig(raw: unknown): PackageConfig | null`
  - `round50(n: number): number`

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from 'vitest'
import { EDIT_GRID, suggestRecordMinutes, splitSessions, quotePackage, parsePackageConfig } from '@/lib/packages/pricing'

const course = { type: 'course', videos: 12, length: 'medium', level: 'text', record: true, recordMinutes: null, clips: 20 } as const

describe('pricing engine', () => {
  it('grid matches the spec', () => {
    expect(EDIT_GRID).toEqual({
      short: { clean: 75, text: 125, motion: 200 },
      medium: { clean: 150, text: 250, motion: 400 },
      long: { clean: 250, text: 400, motion: 600 },
    })
  })
  it('suggests recording time, rounded up to 30, minimum 90', () => {
    expect(suggestRecordMinutes(12, 'medium')).toBe(360)
    expect(suggestRecordMinutes(1, 'short')).toBe(90)
  })
  it('splits into 5-hour sessions with a final session of at least 90 min', () => {
    expect(splitSessions(600)).toEqual([300, 300])
    expect(splitSessions(360)).toEqual([300, 90])
    expect(splitSessions(330)).toEqual([300, 90])
    expect(splitSessions(120)).toEqual([120])
    expect(splitSessions(0)).toEqual([])
  })
  it('prices the spec worked example', () => {
    const q = quotePackage(course)
    expect(q.editing).toBe(3000)
    expect(q.sessions).toEqual([300, 90])
    expect(q.recording).toBe(1300)
    expect(q.clips).toBe(400)
    expect(q.total).toBe(4700)
    expect(q.rangeLow).toBe(4700)
    expect(q.rangeHigh).toBe(5150)
    expect(q.deposit).toBe(1410)
    expect(q.callFirst).toBe(true)
    expect(q.turnaroundDays).toEqual({ low: 9, high: 12 })
    expect(q.revisionRounds).toBe(2)
  })
  it('10 hours of recording costs $2,000', () => {
    expect(quotePackage({ ...course, recordMinutes: 600 }).recording).toBe(2000)
  })
  it('a single short motion VSL is deposit-first', () => {
    const q = quotePackage({ type: 'vsl', videos: 1, length: 'short', level: 'motion', record: true, recordMinutes: null, clips: 0 })
    expect(q.total).toBe(500)
    expect(q.callFirst).toBe(false)
    expect(q.turnaroundDays).toEqual({ low: 9, high: 12 })
  })
  it('editing-only ignores recordMinutes', () => {
    const q = quotePackage({ ...course, record: false, recordMinutes: 360 })
    expect(q.recording).toBe(0)
    expect(q.recordMinutes).toBe(0)
    expect(q.sessions).toEqual([])
  })
  it('parsePackageConfig rejects bad input', () => {
    expect(parsePackageConfig({ ...course, videos: 0 })).toBeNull()
    expect(parsePackageConfig({ ...course, videos: 41 })).toBeNull()
    expect(parsePackageConfig({ ...course, type: 'vsl', videos: 6 })).toBeNull()
    expect(parsePackageConfig({ ...course, videos: Number.NaN })).toBeNull()
    expect(parsePackageConfig({ ...course, level: 'fancy' })).toBeNull()
    expect(parsePackageConfig({ ...course, recordMinutes: 45 })).toBeNull()
    expect(parsePackageConfig({ ...course, recordMinutes: 60 })).toBeNull()
    expect(parsePackageConfig({ ...course, recordMinutes: 3030 })).toBeNull()
    expect(parsePackageConfig({ ...course, clips: -1 })).toBeNull()
    expect(parsePackageConfig('nope')).toBeNull()
  })
  it('parsePackageConfig accepts a valid config and nulls recordMinutes when not recording', () => {
    expect(parsePackageConfig(course)).toEqual(course)
    expect(parsePackageConfig({ ...course, record: false, recordMinutes: 360 })?.recordMinutes).toBeNull()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run tests/packages/pricing.test.ts`
Expected: FAIL, cannot resolve `@/lib/packages/pricing`.

- [ ] **Step 3: Implement `lib/packages/pricing.ts`**

Rules the tests don't fully pin:
- Recording minutes used = `config.record ? (config.recordMinutes ?? suggestRecordMinutes(...)) : 0`.
- `splitSessions`: take 300-minute sessions while more than 300 remain. The remainder becomes the last session, raised to 90 if below.
- `recording` = the sum of `getTotal({ durationMinutes: s, addonIds: [] }, []).total` over the sessions.
- Turnaround low = `5 + ceil(videos × midpoint / 60) + (level === 'motion' ? 3 : 0)`, high = low + 3.
- `parsePackageConfig` requires integers, `recordMinutes` either null or a multiple of 30 within 90–3000, and returns a fresh object.

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run tests/packages/pricing.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/packages/pricing.ts tests/packages/pricing.test.ts
git commit -m "feat(packages): add package pricing engine"
```

---

### Task 2: Page content

**Files:**
- Create: `lib/content/packages/types.ts`, `lib/content/packages/course.ts`, `lib/content/packages/vsl.ts`, `lib/content/packages/demo.ts`, `lib/content/packages/index.ts`, `lib/content/packages/cal.ts`
- Test: `tests/packages/content.test.ts`

**Interfaces:**
- Consumes: `PackageType`, `PackageConfig`, `EditLevel` from Task 1; `ServiceTag` from `lib/content/reviews`.
- Produces:
  - `type PackagePage = { slug: PackageType; title: string; description: string; eyebrow: string; headline: string; story: { anonymous: string[]; named?: string[]; useNamed: boolean }; whatYouGet: { heading: string; body: string }[]; videoNoun: { one: string; many: string }; defaults: PackageConfig; levelPreviews: Record<EditLevel, string | null>; editingOnlyNote: string; reviewTag: ServiceTag; faqs: { question: string; answer: string }[] }`
  - `PACKAGE_PAGES: Record<PackageType, PackagePage>`, `getPackagePage(slug: string): PackagePage | undefined`
  - `calPackageLink(): string | null` (reads `NEXT_PUBLIC_CAL_PACKAGE_LINK`, trimmed, empty → null)
  - `SEND_FILES_NOTE: string`, `DEPOSIT_TERMS: string`, `SCOPE_NOTE = 'Final scope confirmed on a quick call.'`

Defaults (from the spec): course `{ videos: 10, length: 'medium', level: 'clean', record: true }`; vsl `{ videos: 1, length: 'short', level: 'motion', record: true }`; demo `{ videos: 2, length: 'short', level: 'text', record: true }`; all `recordMinutes: null, clips: 0`. `videoNoun`: course lesson/lessons, vsl video/videos, demo video/videos. `levelPreviews` are all `null` (placeholders). Stories are anonymous drafts ("a Tampa coach…") based on Vanessa (course), Kyle Gregory (VSL), Alex Cooper (demo) with `useNamed: false`. Copy is written in the Voxa voice: editorial, no clickbait, and nothing that reads as a fixed menu. Each FAQ covers turnaround, the 2 revisions, own footage (what can and can't be fixed in home recordings), and the deposit (`DEPOSIT_TERMS`). `reviewTag` uses the existing tags (check `lib/content/reviews.ts`): course → `course`, vsl and demo → the closest existing tag.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from 'vitest'
import { PACKAGE_PAGES, getPackagePage, calPackageLink, DEPOSIT_TERMS } from '@/lib/content/packages'
import { parsePackageConfig } from '@/lib/packages/pricing'

const all = Object.values(PACKAGE_PAGES)
const text = (p: (typeof all)[number]) => JSON.stringify(p)

describe('package page content', () => {
  it('has exactly course, vsl and demo', () => {
    expect(Object.keys(PACKAGE_PAGES).sort()).toEqual(['course', 'demo', 'vsl'])
    expect(getPackagePage('nope')).toBeUndefined()
  })
  it('defaults are valid configs matching the spec', () => {
    for (const p of all) expect(parsePackageConfig(p.defaults)).toEqual(p.defaults)
    expect(PACKAGE_PAGES.course.defaults).toMatchObject({ videos: 10, length: 'medium', level: 'clean' })
    expect(PACKAGE_PAGES.vsl.defaults).toMatchObject({ videos: 1, length: 'short', level: 'motion' })
    expect(PACKAGE_PAGES.demo.defaults).toMatchObject({ videos: 2, length: 'short', level: 'text' })
  })
  it('never mentions Vega', () => {
    for (const p of all) expect(text(p)).not.toMatch(/vega/i)
  })
  it('stories launch anonymous', () => {
    for (const p of all) expect(p.story.useNamed).toBe(false)
  })
  it('FAQ covers revisions and the deposit terms', () => {
    for (const p of all) {
      expect(text(p)).toMatch(/2 rounds of revisions/i)
      expect(p.faqs.some((f) => f.answer.includes(DEPOSIT_TERMS))).toBe(true)
    }
    expect(DEPOSIT_TERMS).toMatch(/credited toward/i)
    expect(DEPOSIT_TERMS).toMatch(/refundable/i)
  })
  it('calPackageLink is null when unset or blank', () => {
    delete process.env.NEXT_PUBLIC_CAL_PACKAGE_LINK
    expect(calPackageLink()).toBeNull()
    process.env.NEXT_PUBLIC_CAL_PACKAGE_LINK = '  '
    expect(calPackageLink()).toBeNull()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run tests/packages/content.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Write the content files** with the types and values above.

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run tests/packages/content.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/content/packages tests/packages/content.test.ts
git commit -m "feat(packages): add course, VSL and demo page content"
```

---

### Task 3: Tracking events

**Files:**
- Create: `lib/tracking/packages.ts`
- Test: `tests/packages/tracking.test.ts`

**Interfaces:**
- Consumes: `pushDataLayer` from `lib/data-layer.ts`; `PackageType` from Task 1.
- Produces:
  - `trackPackageBuilderStart(pageType: PackageType)` → `package_builder_start`
  - `trackPackageTourClick(pageType, rangeLow: number)` → `package_tour_click`
  - `trackPackageTourBooked(pageType, uid: string)` → `package_tour_booked`
  - `trackPackageContactSubmit(pageType, rangeLow: number)` → `package_contact_submit`
  - `trackPackageCallBooked(pageType)` → `package_call_booked`
  - `trackPackageDepositPaid(pageType, opts: { value: number; rangeLow: number; rangeHigh: number; paymentIntentId: string })` → `package_deposit_paid` with `transaction_id`
  - `trackPackageDeepRead(pageType)` → `package_deep_read`

Every event carries `page_type`. Add a comment like the one in `lib/tracking/onsite.ts` explaining why these aren't `generate_lead`.

- [ ] **Step 1: Write the failing test.** Call each function, then assert `window.dataLayer` holds the seven event names in order with `page_type` set. Assert no entry has `event === 'generate_lead'` or `'tour_booked'`. Assert the deposit event has `value`, `range_low`, `range_high` and `transaction_id`.

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run tests/packages/tracking.test.ts` → FAIL, module not found.

- [ ] **Step 3: Implement `lib/tracking/packages.ts`.**

- [ ] **Step 4: Run to verify it passes** → PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/tracking/packages.ts tests/packages/tracking.test.ts
git commit -m "feat(packages): add package tracking events"
```

---

### Task 4: Source-aware tour modal

**Files:**
- Modify: `lib/tour-modal-context.tsx` (context type, `open`)
- Modify: `components/marketing/tour-modal.tsx` (lines ~180–230 submit, ~335–345 details "next" button)
- Modify: `app/api/tour/book/route.ts` (accept `packageSummary`, append to notes)
- Test: `tests/tour-modal-source.test.tsx`, extend `tests/api/tour-book.test.ts`

**Interfaces:**
- Consumes: `trackPackageTourBooked` (Task 3), `PackageType` (Task 1).
- Produces:
  - `type TourOpenOptions = { source: 'package'; pageType: PackageType; packageSummary: string }`
  - `useTourModal()` returns `{ isOpen; open: (opts?: TourOpenOptions) => void; close; options: TourOpenOptions | null }`. `close` clears `options`.
  - `/api/tour/book` accepts an optional `packageSummary: string`. Trimmed and cut to 1,000 characters, it's added to notes as `Package: <summary>` (its own line). Absent → notes unchanged.

Behavior: when `options?.source === 'package'`, the details "next" button pushes no `generate_lead`, and a successful booking calls `trackPackageTourBooked(pageType, uid)` instead of pushing `tour_booked`. The Meta `track('Schedule', …)` call stays. With no options, behavior is byte-for-byte the same as today. (The package summary reaches Niko in the Cal booking notes, which replaces the spec's separate "tour with package" email; a visitor who books a tour never filled in the package contact step, so there's no package lead to email.)

- [ ] **Step 1: Write the failing tests.**
  - `tests/tour-modal-source.test.tsx`: render `TourModalProvider` with a test button that calls `open({ source: 'package', pageType: 'course', packageSummary: '12 lessons…' })`. Fill in the details, mock `fetch` for slots and booking, complete the booking. Assert `window.dataLayer` has no `generate_lead` and no `tour_booked`, does have `package_tour_booked`, and that the booking request body has `packageSummary`. A second test opens with no options and asserts `generate_lead` and `tour_booked` are both still pushed.
  - `tests/api/tour-book.test.ts`: a new case posts `packageSummary: 'x'.repeat(1200)` and asserts the notes passed to the mocked `createBooking` contain `Package: ` followed by exactly 1,000 characters. An existing-style case without `packageSummary` asserts no `Package:` line.

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run tests/tour-modal-source.test.tsx tests/api/tour-book.test.ts` → the new cases FAIL.

- [ ] **Step 3: Implement the changes in the three files.**

- [ ] **Step 4: Run the full suite** (the studio wizard and modal tests must still pass)

Run: `npx vitest run` → PASS

- [ ] **Step 5: Commit**

```bash
git add lib/tour-modal-context.tsx components/marketing/tour-modal.tsx app/api/tour/book/route.ts tests/tour-modal-source.test.tsx tests/api/tour-book.test.ts
git commit -m "feat(tour): let package pages open the tour modal without studio conversions"
```

---

### Task 5: Lead email, lead and deposit APIs, webhook

**Files:**
- Create: `lib/server/package-lead-email.ts`, `lib/packages/contact.ts`, `app/api/packages/lead/route.ts`, `app/api/packages/deposit/route.ts`
- Modify: `lib/server/stripe.ts` (add `createDepositIntent`), `app/api/stripe/webhook/route.ts` (handle `payment_intent.succeeded` with package metadata)
- Test: `tests/api/packages-lead.test.ts`, `tests/api/packages-deposit.test.ts`, extend `tests/api/stripe-webhook.test.ts`

**Interfaces:**
- Consumes: `parsePackageConfig`, `quotePackage`, `PackageConfig`, `PackageQuote`, `LENGTH_LABEL`, `LEVEL_LABEL` (Task 1); `check`, `ipFromRequest`; `leadEmailConfigured` pattern from `lib/server/onsite-lead-email.ts`.
- Produces:
  - `type PackageContact = { name: string; email: string; phone: string; notes: string }`
  - `parsePackageContact(raw: unknown): PackageContact | null` in `lib/packages/contact.ts` (name 1–120, email regex as in other routes, phone 7–30, notes ≤ 2,000). It's shared by the client form, so there's no `server-only` import.
  - `type PackageLeadStage = 'started' | 'deposit_paid'`
  - `sendPackageLeadEmail(args: { stage: PackageLeadStage; contact: PackageContact; config: PackageConfig; quote: PackageQuote; paymentIntentId?: string }): Promise<void>`. Subject: `Package lead (<stage label>): <name> — <type> ~$<rangeLow>–$<rangeHigh>`. Body lists readable labels for every config field, line items, deposit, turnaround, and the payment intent id. It uses the same Resend env vars and defaults as On-Site (`ONSITE_LEAD_FROM`, `ONSITE_LEAD_EMAIL`), with `reply_to` set to the contact email.
  - `createDepositIntent(args: { amountCents: number; metadata: Record<string, string>; idempotencyKey: string }): Promise<{ id: string; clientSecret: string }>`, with automatic capture.
  - `POST /api/packages/lead` body `{ config, contact, website? }` → 200 `{ quote }`; 400 on bad config or contact; 429 rate-limited; honeypot filled → 200 `{ ok: true }` with no email. Sends the `started` email if configured. A send failure is logged and still returns 200.
  - `POST /api/packages/deposit` body `{ config, contact, sessionId }` → 200 `{ clientSecret, paymentIntentId, deposit }`; 400 on bad input or missing `sessionId`; 503 `{ error: 'payments_not_configured' }` when `STRIPE_SECRET_KEY` is unset. Metadata: `kind: 'package_deposit'`, `config` (JSON), `name`, `email`, `phone`, `notes` (cut to 450 characters to fit Stripe's 500-character metadata value limit), `rangeLow`, `rangeHigh`. Idempotency key: `package-deposit:${sessionId}`.
  - Webhook: on `payment_intent.succeeded` where `metadata.kind === 'package_deposit'`, it re-parses the config from metadata, re-quotes, and sends the `deposit_paid` email with the payment intent id. Errors are logged and it still returns 200. Only the webhook sends the deposit email (that's the duplicate protection).

- [ ] **Step 1: Write the failing tests** (mock `@/lib/server/stripe` and `global.fetch` the way the existing API tests do)
  - lead: valid post → 200 with `quote.total === 4700` for the Task 1 course config, and Resend `fetch` called once with a body containing `Package lead (started)`. Each Review Focus #1 input (`videos: 0`, `videos: 999`, `recordMinutes: 45`, `level: 'x'`) → 400 and no `fetch`. `RESEND_API_KEY` unset → 200 and no `fetch`. Resend returns 500 → still 200. Honeypot → 200 and no `fetch`.
  - deposit: valid → `createDepositIntent` called with `amountCents: 141000` and `idempotencyKey: 'package-deposit:s1'`. A client-sent `amount: 1` is ignored. Bad config → 400 and not called. `STRIPE_SECRET_KEY` unset → 503.
  - webhook: a `payment_intent.succeeded` event with package metadata → Resend called with `Package lead (deposit paid)` and the intent id. The same event without `kind` → no email. Resend throws → still 200.

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run tests/api/packages-lead.test.ts tests/api/packages-deposit.test.ts tests/api/stripe-webhook.test.ts` → the new cases FAIL.

- [ ] **Step 3: Implement the files listed above.**

- [ ] **Step 4: Run to verify they pass**

Run: `npx vitest run tests/api` → PASS

- [ ] **Step 5: Commit**

```bash
git add lib/server/package-lead-email.ts lib/packages/contact.ts lib/server/stripe.ts app/api/packages app/api/stripe/webhook/route.ts tests/api
git commit -m "feat(packages): add lead and deposit APIs with server-side pricing"
```

---

### Task 6: Package builder component

**Files:**
- Create: `components/packages/package-builder.tsx`, `components/packages/edit-level-cards.tsx`, `components/packages/package-summary.tsx`
- Test: `tests/packages/package-builder.test.tsx`

**Interfaces:**
- Consumes: Task 1 engine and labels; `PackagePage` (Task 2); `trackPackageBuilderStart`, `trackPackageTourClick` (Task 3); `useTourModal().open` (Task 4).
- Produces:
  - `PackageBuilder({ page, onContinue }: { page: PackagePage; onContinue: (args: { config: PackageConfig; quote: PackageQuote; intent: 'call' | 'deposit' }) => void })`
  - `summarizePackage(page: PackagePage, config: PackageConfig, quote: PackageQuote): string`, the plain one-line summary used for the tour notes and the Cal notes, for example `Course · 12 lessons · 10–30 min · Edit + on-screen text · record ~6 hrs · 20 clips · ~$4,700–$5,150`.

UI (inside the spec's structure): a first choice, "I need to record" / "I already have footage" (the footage choice hides recording and shows `SEND_FILES_NOTE`); a videos stepper within `VIDEO_LIMITS` using `videoNoun`; length choice; `EditLevelCards` (label, one-liner, preview `<video muted loop playsInline>` when the src is non-null, otherwise a styled placeholder); a recording stepper (30-min steps, minimum 90, starts at the suggestion and follows the suggestion until the visitor adjusts it); clips quick picks 0/5/10/20 plus a number input. Output panel: "Your custom package," range, line items, "Estimated delivery: X–Y business days," "2 rounds of revisions included," `SCOPE_NOTE`. Buttons: when `quote.callFirst`, the primary is "Book a vision call" (intent `call`) and the secondary is "Reserve with deposit"; otherwise the primary is "Reserve with deposit" and the secondary is "Book a free tour." A "Book a free tour" text link is always present. The tour calls `trackPackageTourClick` then `open({ source: 'package', pageType, packageSummary })`. The output panel is sticky on desktop and a collapsible bottom bar under `md`.

- [ ] **Step 1: Write the failing tests** (render inside `TourModalProvider`)
  - The course defaults (10 × $150 editing + one 300-min session at $1,000) show `$2,500–$2,750`.
  - Changing the level to "Full motion design" updates the range to the engine's value for that config.
  - Review Focus #2: raising recording by two steps, then choosing "I already have footage," means the recording line item is gone, the range equals `quotePackage({ ...config, record: false })`, and the send-files note is visible.
  - VSL defaults (callFirst false): the first button reads "Reserve with deposit." Course with 12 lessons medium: the first button reads "Book a vision call."
  - The first interaction pushes `package_builder_start` exactly once across three interactions.
  - Clicking "Book a free tour" pushes `package_tour_click` and opens the modal.
  - `summarizePackage` for the Task 1 course config equals the example string above.

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run tests/packages/package-builder.test.tsx` → FAIL

- [ ] **Step 3: Implement the three components.**

- [ ] **Step 4: Run to verify they pass** → PASS

- [ ] **Step 5: Commit**

```bash
git add components/packages tests/packages/package-builder.test.tsx
git commit -m "feat(packages): add the package builder"
```

---

### Task 7: Contact, deposit and call flow

**Files:**
- Create: `components/packages/package-checkout.tsx`, `components/packages/deposit-form.tsx`, `components/packages/package-call.tsx`, `components/packages/package-confirmation.tsx`
- Test: `tests/packages/package-checkout.test.tsx`

**Interfaces:**
- Consumes: `PackageBuilder` `onContinue` args (Task 6); `parsePackageContact` (Task 5); `POST /api/packages/lead`, `POST /api/packages/deposit` (Task 5); `calPackageLink`, `DEPOSIT_TERMS` (Task 2); `trackPackageContactSubmit`, `trackPackageCallBooked`, `trackPackageDepositPaid` (Task 3); `summarizePackage` (Task 6).
- Produces: `PackageCheckout({ page, config, quote, intent, onBack }: …)`, a step machine `contact → (call | deposit) → confirmed`.

Behavior:
- **Contact step:** name, email, phone, notes, plus a hidden `website` honeypot. Validated with `parsePackageContact`. On submit it POSTs to `/api/packages/lead` and calls `trackPackageContactSubmit`. A network failure doesn't block the next step.
- **Call:** `PackageCall` embeds Cal with `namespace: 'package'`, `calLink` from `calPackageLink()` (strip to `user/slug` like `toCalLinkSlug` in `components/onsite/quote-form-success.tsx`; move that helper to `lib/content/cal-link.ts` and import it in both places), and `config: { notes: summarizePackage(...) }` (prefill notes). `bookingSuccessful` → `trackPackageCallBooked`. With no link, it shows the fallback text: "Email us at voxastudiosfl@gmail.com and we'll set up your call."
- **Deposit:** POST `/api/packages/deposit` with a `sessionId` (from `crypto.randomUUID()`, kept for the whole checkout). Then Stripe `Elements` (the `loadStripe` pattern from `components/book/steps/checkout-step.tsx`) shows the deposit amount, `DEPOSIT_TERMS`, and a pay button. `confirmPayment` uses `redirect: 'if_required'` and `return_url` = the current page URL. Status `succeeded` → `trackPackageDepositPaid` → confirmed.
- **Confirmed:** `PackageConfirmation` explains what happens next and embeds `PackageCall` ("Book your vision call").
- **Redirect return (Review Focus #5):** the package page reads `payment_intent`, `payment_intent_client_secret` and `redirect_status` from the URL. When `redirect_status === 'succeeded'`, it renders `PackageConfirmation` directly.

- [ ] **Step 1: Write the failing tests** (mock `fetch`, `@stripe/react-stripe-js` and `@calcom/embed-react`)
  - An invalid email shows an error and no `fetch`.
  - A valid contact with intent `call` POSTs `/api/packages/lead`, pushes `package_contact_submit`, and renders the Cal mock with notes equal to `summarizePackage(...)`.
  - Review Focus #4: with no `NEXT_PUBLIC_CAL_PACKAGE_LINK`, the call step shows the fallback text and no Cal mock.
  - Intent `deposit` POSTs `/api/packages/deposit`, shows the formatted deposit and `DEPOSIT_TERMS`. A mocked `confirmPayment` → `succeeded` pushes `package_deposit_paid` and shows the confirmation.
  - The lead POST rejecting (network error) still moves on to the next step.
  - Review Focus #5: rendering `PackageConfirmation` through the page helper `confirmationFromSearchParams({ redirect_status: 'succeeded' })` returns true. `'failed'` returns false. Export this helper from `package-checkout.tsx`.

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run tests/packages/package-checkout.test.tsx` → FAIL

- [ ] **Step 3: Implement the components and move `toCalLinkSlug`.**

- [ ] **Step 4: Run the full suite** (the On-Site success test must still pass after the move)

Run: `npx vitest run` → PASS

- [ ] **Step 5: Commit**

```bash
git add components/packages lib/content/cal-link.ts components/onsite/quote-form-success.tsx tests/packages/package-checkout.test.tsx
git commit -m "feat(packages): add contact, deposit and vision call flow"
```

---

### Task 8: Package pages

**Files:**
- Create: `app/packages/layout.tsx` (with `Footer`, like `app/onsite/layout.tsx`), `app/packages/[slug]/page.tsx`, `components/packages/package-page.tsx`, `components/packages/advertorial.tsx`, `components/packages/use-deep-read.ts`
- Test: `tests/packages/package-page.test.tsx`, extend `tests/seo/foundations.test.ts` (or whichever existing test covers the sitemap)

**Interfaces:**
- Consumes: everything above; existing `FAQ`, review components (`components/marketing/review-quotes.tsx`, filter by `reviewTag`), final CTA pattern, `sticky-quote-cta` pattern from On-Site.
- Produces: routes `/packages/course`, `/packages/vsl`, `/packages/demo` (`generateStaticParams`, `dynamicParams = false`); `generateMetadata` with title, description, canonical, and Open Graph using `/hero.jpg` like `app/studios/[slug]/page.tsx`. `PackagePageView({ page })` is a client component holding the builder ↔ checkout state. `useDeepRead(pageType)` fires `trackPackageDeepRead` once when 75% of the advertorial has been scrolled past.

Section order (from the spec): advertorial (eyebrow, headline, story paragraphs, `named` when `useNamed`), what you get, edit levels, builder / checkout, reviews, FAQ, final CTA, plus a mobile sticky "Build your package" button that scrolls to the builder.

- [ ] **Step 1: Write the failing tests**
  - Each slug renders its headline and the builder. An unknown slug calls `notFound`.
  - `useDeepRead` (mock `IntersectionObserver`, or test it as scroll math) fires once.
  - The sitemap contains no URL with `/packages`.

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run tests/packages/package-page.test.tsx tests/seo` → the new cases FAIL

- [ ] **Step 3: Implement the routes and components.**

- [ ] **Step 4: Run the full suite and the build**

Run: `npx vitest run && npm run build` → PASS, and the build lists the three `/packages/*` pages as static.

- [ ] **Step 5: Commit**

```bash
git add app/packages components/packages tests/packages/package-page.test.tsx tests/seo
git commit -m "feat(packages): add course, VSL and demo package pages"
```

---

### Task 9: Links from existing service pages

**Files:**
- Modify: `lib/content/services/types.ts` (add `packageLink?: { href: string; label: string }`), `components/marketing/service-page.tsx` (render a small block above or below "What you walk out with"), `lib/content/services/course-webinar.ts`, `lib/content/services/vsl-meta-ads.ts`
- Test: extend `tests/seo/services.test.tsx`

Block copy: heading "Need it edited too?" and a link labeled "Build your package". Course → `/packages/course`, VSL → `/packages/vsl`. Leave the existing `related` field alone (YouTube uses it). No other copy changes.

- [ ] **Step 1: Write the failing test.** Render the course and VSL service pages and assert a link to `/packages/course` and `/packages/vsl` respectively. The podcast page has no `/packages` link.

- [ ] **Step 2: Run** `npx vitest run tests/seo/services.test.tsx` → FAIL

- [ ] **Step 3: Implement.**

- [ ] **Step 4: Run** `npx vitest run` → PASS

- [ ] **Step 5: Commit**

```bash
git add lib/content/services components/marketing/service-page.tsx tests/seo/services.test.tsx
git commit -m "feat(services): link course and VSL pages to their package builders"
```

---

### Task 10: Verify in the browser

- [ ] **Step 1:** Start the dev server with `preview_start` (add a `.claude/launch.json` entry for `npm run dev` on port 3000 if none exists).
- [ ] **Step 2:** On each of `/packages/course`, `/packages/vsl` and `/packages/demo`, at 375px and desktop width: no horizontal scroll, the range updates as inputs change, "already have footage" hides recording, the primary button switches at the $1,500 cutoff, and the console has no errors.
- [ ] **Step 3:** Open the tour from a package page and confirm in the console (dev logs `[dataLayer]`) that only `package_tour_click` fires. No `generate_lead`.
- [ ] **Step 4:** Deposit path with Stripe test mode keys and a published Stripe test card on localhost: confirmation shows and `package_deposit_paid` is logged. (The webhook email is checked in Task 5's tests. A live email check needs the Stripe CLI and is optional.)
- [ ] **Step 5:** Take screenshots of each page (mobile and desktop) for Niko.

## Manual steps for Niko (not code)

- Create the "Package vision call" Cal event and set `NEXT_PUBLIC_CAL_PACKAGE_LINK` in Vercel.
- Pick preview clips for the three edit levels (never Vega II).
- Make sure the Stripe webhook endpoint in the dashboard sends `payment_intent.succeeded`.
- After launch: GTM / GA4 / Google Ads setup for the `package_*` events.
