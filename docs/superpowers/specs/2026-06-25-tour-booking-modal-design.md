# Tour Booking Modal — Design

**Status:** Approved (design phase) — pending spec review.
**Date:** 2026-06-25
**Context:** Cold Meta ad traffic landing on Voxa Studios currently hits an external Cal.com link for the studio tour CTA (`https://cal.com/niko-torres-n4iwe3/studio-tour`). The off-page handoff loses some converters and breaks pixel-tracking continuity. This spec replaces the external link with an on-page tour booking modal.

## Goal

Keep cold paid traffic on the Voxa Studios domain through the entire tour booking. Capture name, email, phone, and a confirmed time slot via the Cal.com v2 API, then show an inline success state with a calendar-add option. Cal.com sends its own confirmation email automatically; SMS reminders (if configured on the event type) reduce no-shows.

## Out of Scope

- Payment (tours are free).
- Multi-step wizard (single-screen modal is intentional — tour has only 4 inputs).
- Replacing the existing paid-session booking flow at `book-section.tsx`. That flow stays as-is.
- Tour rescheduling/cancellation from the modal. Users use the Cal.com confirmation email link for that.

## Architecture

### New API routes

Two thin routes that reuse `lib/server/cal.ts`. They run on the existing `nodejs` runtime, share rate-limiting middleware with the session flow.

#### `GET /api/tour/slots`

**Purpose:** Returns availability for the tour event type.

**Query params:**
- `start` (YYYY-MM-DD, required) — inclusive
- `end` (YYYY-MM-DD, required) — inclusive
- Validation: same date-format regex as `/api/cal/slots`, 14-day window default, max 60 days.

**Why no `setId` param:** The tour has a fixed event type. Reading from `process.env.CAL_EVENT_TYPE_TOUR`.

**Behavior:**
- Rate-limit via `check(ipFromRequest(req), 'tour/slots')`.
- 400 on bad params, 429 on rate limit, 502 on Cal.com upstream error.
- Returns `{ slotsByDate: { '2026-07-08': ['09:00', '09:30', ...] } }` matching the session route shape so the UI helpers stay symmetric.
- Duration is read from the Cal.com event type itself (set by the event configuration, typically 15 min). We pass the duration into `getSlots()` from a server-side constant or by querying Cal.com for the event type's length. **Decision: hardcode the duration to a `TOUR_DURATION_MINUTES = 15` constant in the route** — it matches the configured event type and avoids an extra API roundtrip.

#### `POST /api/tour/book`

**Purpose:** Create the Cal.com booking for the chosen slot.

**Request body:**
```json
{
  "name": "Jane Founder",
  "email": "jane@example.com",
  "phone": "+1 555 555 5555",
  "date": "2026-07-08",
  "time": "14:00"
}
```

**Validation:**
- `name`: non-empty, trimmed, max 120 chars.
- `email`: regex match (same `EMAIL` regex as `/api/booking/confirm`).
- `phone`: trimmed, min 7 chars, max 30 chars. No regex enforcement — international formats vary; we trust Cal.com's normalization.
- `date`: matches `^\d{4}-\d{2}-\d{2}$`.
- `time`: matches `^\d{2}:\d{2}$`.

**Behavior:**
- Rate-limit via `check(ipFromRequest(req), 'tour/book')`.
- 400 on validation fail, 429 on rate limit.
- Build `startISO` from `localISO(date, time, STUDIO_TIMEZONE)` exactly like the session confirm route.
- Call `createBooking()` with `eventTypeId = CAL_EVENT_TYPE_TOUR`, `durationMinutes = 15`, attendee = `{ name, email, timeZone: STUDIO_TIMEZONE }`, idempotency-key = a hash of `email + date + time` so duplicate clicks don't create duplicate bookings.
- Phone is passed via `bookingFieldsResponses: { phone }` (Cal.com booking fields). The event type must have a `phone` booking field configured.
- On 409 from Cal.com (slot taken between fetch and submit): return `{ error: 'slot_taken' }` with status 409.
- On 5xx from Cal.com: retry once, then return `{ error: 'upstream' }` with status 502.
- On success: return `{ uid: '<cal-booking-uid>', startISO: '<iso-with-offset>', durationMinutes: 15 }`.

### Reused server library

No changes to `lib/server/cal.ts`. The existing `getSlots()` and `createBooking()` functions cover both routes.

## Frontend

### `components/marketing/tour-modal.tsx`

Client component. Single file. No external deps beyond what's already in the project (React, Tailwind, the existing `Input` component).

**Local state:**
```ts
type Status = 'idle' | 'loading-slots' | 'submitting' | 'success' | 'error'
{
  name: string
  email: string
  phone: string
  date: string | null
  time: string | null
  slotsByDate: Record<string, string[]> | null
  status: Status
  errorMsg: string | null
  bookingResult: { startISO: string; uid: string; durationMinutes: number } | null
}
```

**Layout (single screen):**

```
┌───────────────────────────────────────┐
│ [×]                                   │
│                                       │
│ BOOK A STUDIO TOUR                    │
│ 15 min · Tampa, FL                    │
│                                       │
│ [NAME] [EMAIL] [PHONE]                │  3-col on desktop, stack on mobile
│                                       │
│ SELECT DATE                           │
│ [date strip — 14 days]                │
│                                       │
│ SELECT TIME                           │
│ [time chips grid]                     │
│                                       │
│        [ CONFIRM TOUR ]               │  Disabled until valid
└───────────────────────────────────────┘
```

**On success the modal content swaps in place:**

```
┌───────────────────────────────────────┐
│ [×]                                   │
│                                       │
│  ✓ TOUR BOOKED                        │
│                                       │
│ Wednesday, July 8 at 2:00 PM          │
│                                       │
│ Confirmation sent to                  │
│ jane@example.com                      │
│                                       │
│ [ + Add to calendar ]                 │
│ [ Close ]                             │
└───────────────────────────────────────┘
```

**Visual language:** `liquid-glass` panel on `bg-obsidian/95` backdrop, heritage-gold accents on labels and CTAs, ivory text. Matches the existing wizard step styling so it feels native to the site.

**Accessibility:**
- Rendered via `createPortal` to body so it sits above the nav and all sections.
- `role="dialog"` and `aria-modal="true"` on the panel.
- Focus-trapped: focus moves to the first input on open, returns to the trigger element on close.
- ESC closes. Click on backdrop closes. The X button closes.
- Body scroll-locked while open (same `document.body.style.overflow` pattern as `nav.tsx`).
- All inputs have associated labels (using the existing `Input` component's pattern).

### `lib/tour-modal-context.tsx`

Small React context for opening the modal from multiple components without prop drilling:

```ts
export function TourModalProvider({ children }: { children: React.ReactNode })
export function useTourModal(): { open: () => void; close: () => void; isOpen: boolean }
```

The provider also renders `<TourModal />`. Mounted once in `app/layout.tsx` so the modal is available everywhere.

### Updates to existing components

**`components/marketing/final-cta.tsx`**: Replace the `<a href="https://cal.com/...">` wrapping the tour button with a `<button>` calling `useTourModal().open()`.

**`components/marketing/book-section.tsx`**: Replace the soft `<a>` link under each PreviewCard's CTA with a `<button>` calling `useTourModal().open()`. Same text ("Not ready to book? Tour the studio first →"), same styling — the only change is the underlying element and the click handler.

### Date strip + time chips

Reuse the visual treatment from `components/book/steps/schedule-step.tsx` but as a slimmer version (no separate side panel — date strip on top, time chips below, stacked for the modal width). I'll write a fresh implementation in the modal rather than extracting a shared component — a shared `<DateStrip>` would couple two unrelated flows and YAGNI says no until there's a third caller.

## Environment

**Required new env var:**
```
CAL_EVENT_TYPE_TOUR=<numeric event type ID from Cal.com>
```

How to find it: edit the "Studio Tour" event type on Cal.com; the numeric ID appears in the edit URL path, or fetch via the Cal.com API.

**Files to update:**
- `.env.local.example` — add `CAL_EVENT_TYPE_TOUR=` placeholder
- (Production) Vercel/host environment variables — must be set before merge to prevent runtime 500s

Without the env var: `/api/tour/slots` and `/api/tour/book` should return a clear 503 with `{ error: 'tour_not_configured' }`. The modal renders this as "Tours are temporarily unavailable — please email us instead" so it fails gracefully.

## Calendar add (`.ics`)

After a successful booking, the modal generates an `.ics` file client-side from the booking result (no API call needed). Format:

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Voxa Studios//Tour//EN
BEGIN:VEVENT
UID:<bookingUid>
DTSTART:<startISO converted to UTC YYYYMMDDTHHMMSSZ>
DTEND:<startISO + 15 min in UTC>
SUMMARY:Voxa Studios Tour
LOCATION:4021 N Armenia Ave, Suite 102, Tampa, FL 33607
DESCRIPTION:Studio tour at Voxa Studios. We'll meet you at the door.
END:VEVENT
END:VCALENDAR
```

Generated as a Blob, exposed via `URL.createObjectURL`, downloaded via an `<a download="voxa-studio-tour.ics">` click. No server roundtrip.

## Edge cases

| Case | Behavior |
|---|---|
| Slot taken between fetch and submit (Cal.com 409) | Modal shows "Time just got booked — please pick another." Refetches slots. Clears selected time. User stays in flow. |
| Cal.com upstream 5xx | Modal shows "Couldn't reach our calendar — try again in a moment" with a retry button. |
| Rate limit (429) | Modal shows "Too many requests — wait a moment and try again." |
| Validation fail (bad email, missing field) | Inline field errors. No API call. CONFIRM TOUR stays disabled. |
| `CAL_EVENT_TYPE_TOUR` missing | API returns 503 with `tour_not_configured`. Modal shows "Tours are temporarily unavailable — please email us instead." |
| Modal closed mid-flow | State resets on next open. Inputs cleared. |
| Duplicate submit clicks | Server-side idempotency-key (hash of `email + date + time`) prevents double-booking. UI also disables the button while `status === 'submitting'`. |
| User on mobile with autofill | All inputs have correct `autoComplete` attrs (`name`, `email`, `tel`) and `inputMode` where appropriate. |

## Testing

- Unit tests for the two API routes covering: success, validation errors, slot-taken (409), upstream 5xx with retry, rate limit. Mirror the patterns in `tests/server/cal.test.ts`.
- No e2e — the existing session-flow integration tests cover the broader booking integration. Tour reuses the same Cal.com client so the integration surface is already validated.

## Deployment notes

1. Create/confirm the Studio Tour event type on Cal.com (15 min, in-person, with a `phone` booking field configured).
2. Add `CAL_EVENT_TYPE_TOUR` to Vercel production env.
3. Add to `.env.local` for local dev.
4. Merge.
5. Smoke-test by booking a real tour through the modal, verifying confirmation email arrives.
