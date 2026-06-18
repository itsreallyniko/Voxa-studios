# Cal.com + Stripe Integration — Design

**Date:** 2026-06-18
**Status:** Draft (pending implementation plan)
**Goal:** Replace the placeholder Schedule (step 06) and Checkout (step 07) wizard steps with a functioning booking + payment flow backed by Cal.com and Stripe.

---

## 1. Summary

The Voxa booking wizard currently ends in two placeholder steps: a hard-coded date/time grid and a fake card-form checkout. This spec wires both to real services:

- **Cal.com** owns studio-set availability and the eventual booking record.
- **Stripe** owns the payment.
- We keep the existing custom UI (Cinematic Obsidian aesthetic) — both integrations are API-only / Elements-embedded.

The integration uses a **"authorize, book, capture"** sequence (Stripe manual capture) so a customer is never charged for a slot that Cal.com couldn't confirm.

---

## 2. Constraints & decisions

| Decision | Choice | Rationale |
|---|---|---|
| Booking flow | Hold slot → charge → confirm via Stripe manual capture | No orphan charges. No double-bookings. Clean failure modes. |
| Cal.com integration | API-only (REST v2), custom UI | Preserve the studio's visual brand. No iframe / Cal.com chrome. |
| Stripe integration | Embedded Payment Element | User never leaves the site. Card + Apple Pay + Google Pay + Link out of the box. |
| Event-type granularity | One Cal.com event type per studio set (6 total) | Per-set availability (equipment maintenance, room conflicts). Cleaner reporting. |
| Hosting | Vercel | Native Next.js, easy env vars + webhook URL. |
| Account state | User already has Cal.com + Stripe accounts; not yet configured for Voxa | Setup checklist included in §8. |

---

## 3. High-level flow

```
Step 06 (Schedule)
  ── GET /api/cal/slots?eventTypeId=…&start=…&end=…&duration=… → slot map
  ── user picks date+time
       ↓
Step 07 (Checkout) on mount
  ── POST /api/stripe/intent { setId, durationMinutes, addonIds }
     → server recomputes total, creates PaymentIntent { capture_method: 'manual' }
     → returns { client_secret, paymentIntentId }
  ── Stripe Payment Element renders inline
       ↓
User clicks Pay
  ── stripe.confirmPayment(client_secret)
     → card AUTHORIZED (not yet charged); PI status: requires_capture
       ↓
  ── POST /api/booking/confirm { paymentIntentId, bookingDetails }
     Server:
       1. Verify PI status === 'requires_capture'
       2. Recompute total, assert PI.amount matches
       3. POST Cal.com /v2/bookings (idempotency-key: paymentIntentId)
       4a. Cal.com 201 → stripe.paymentIntents.capture(pi) → return { paid: true, bookingId }
       4b. Cal.com 409/4xx → stripe.paymentIntents.cancel(pi) → return { error: 'slot taken' }
       4c. Cal.com 5xx → retry once → if still fails, cancel PI
       ↓
UI renders success screen (existing layout, real data)
```

---

## 4. Architecture

### 4.1 New files

```
app/api/cal/slots/route.ts            GET   available slots for a set+range
app/api/stripe/intent/route.ts        POST  create PaymentIntent (manual capture)
app/api/booking/confirm/route.ts      POST  Cal.com book → capture (or cancel)
app/api/stripe/webhook/route.ts       POST  signature-verified webhook handler

lib/server/cal.ts                     Cal.com REST client (fetch wrapper, typed)
lib/server/stripe.ts                  Stripe SDK singleton + helpers
lib/server/set-event-types.ts         setId → CAL_EVENT_TYPE_* env-var lookup
lib/server/pricing.ts                 Authoritative total computation
lib/server/rate-limit.ts              Simple in-memory token-bucket per IP

.env.local.example                    Documents required env vars
```

### 4.2 Modified files

```
components/book/steps/schedule-step.tsx   Fetch real slots; loading/empty states; remove TODO
components/book/steps/checkout-step.tsx   Mount Stripe Elements; confirm flow; remove fake setTimeout
components/book/steps/details-step.tsx    Add required Name + Email fields
lib/booking-context.tsx                   Extend Booking type with contact { name, email }
lib/steps.ts                              `isStepComplete('details')` requires name + email
package.json                              + stripe, @stripe/stripe-js, @stripe/react-stripe-js
```

### 4.3 Module responsibilities

- **`lib/server/cal.ts`** — typed `fetch` wrapper for Cal.com v2: `getSlots()`, `createBooking()`, `cancelBooking()`. Accepts API key from env. No business logic.
- **`lib/server/stripe.ts`** — exports a Stripe SDK singleton and two helpers: `createManualCaptureIntent({ amount, metadata })` and `verifyWebhook(rawBody, signature)`.
- **`lib/server/pricing.ts`** — server-side recompute that mirrors `lib/pricing.ts` but reads add-on prices from a server-trusted source (the same `lib/content/addons.ts` module). Single source of truth.
- **`lib/server/set-event-types.ts`** — pure function `setIdToEventTypeId(setId): number | null` reading the 6 env vars. Returns `null` for unknown sets (caller must 400).
- **Each API route** — input validation (Zod or hand-rolled) → call services → return JSON. Routes contain orchestration only; they delegate to `lib/server/*` modules.

### 4.4 Environment variables

```
STRIPE_SECRET_KEY=sk_test_…
STRIPE_WEBHOOK_SECRET=whsec_…
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…

CAL_API_KEY=cal_live_…
CAL_API_BASE=https://api.cal.com/v2

CAL_EVENT_TYPE_EXECUTIVE_PODCAST=…
CAL_EVENT_TYPE_AUTHORITY_DESK=…
CAL_EVENT_TYPE_AUTHORITY_CREATOR=…
CAL_EVENT_TYPE_HORIZON_PODCAST=…
CAL_EVENT_TYPE_HORIZON_DESK=…
CAL_EVENT_TYPE_HORIZON_CREATOR=…
```

---

## 5. Data flow detail

### 5.1 Step 06 (Schedule)

- On mount and whenever `booking.setId` or `booking.durationMinutes` changes, fetch `/api/cal/slots?eventTypeId=<derived>&start=<today+1>&end=<today+30>&duration=<durationMinutes>`.
- Server response shape: `{ slotsByDate: { "2026-06-20": ["09:00","13:00", …], … } }` (ISO date keys, HH:mm time strings in studio-local tz).
- Component renders the existing 14-day grid using the same visual treatment, but a date is **disabled** if its key is missing or its array is empty.
- Time column renders only the available times for the selected date.
- Loading: skeleton tiles styled with `border-slate-gray` and a low-opacity pulse (matches the rest of the wizard's loading idiom).
- Empty: "No availability in this range — try another set, or contact us."

### 5.2 Step 07 (Checkout) — state machine

```
idle ──► authorizing ──► booking ──► capturing ──► paid     (success)
                              └────► cancelling ──► error   (slot taken / Cal.com fail)
            └────► error  (Stripe decline / network)
```

- **`idle`**: PaymentIntent fetched and Stripe Payment Element mounted. "Pay $X" button enabled.
- **`authorizing`**: `stripe.confirmPayment()` in flight. Button disabled, label "Processing payment...".
- **`booking`**: server is calling Cal.com. Label "Confirming your booking..."
- **`capturing`**: card capture in flight. Label "Finalizing..."
- **`paid`**: render the existing success screen.
- **`error`**: inline error message; on "slot taken" provide a "Pick another time" button that calls `goTo('schedule')`.

### 5.3 Idempotency

- Cal.com booking POST uses `idempotency-key: <paymentIntentId>` — a retried `/api/booking/confirm` call cannot create a second Cal.com booking for the same intent.
- Stripe `paymentIntents.create()` uses `idempotency-key: <stable client-generated wizard-session-id>` so React StrictMode re-mounts (and accidental double clicks of an earlier mount) don't create two intents.

### 5.4 Webhooks

`/api/stripe/webhook` verifies the signature and handles:

| Event | Action |
|---|---|
| `payment_intent.amount_capturable_updated` | Log (we capture in foreground, but useful for ops). |
| `payment_intent.canceled` | Log; nothing to do (we initiated it). |
| `payment_intent.succeeded` | Log (this confirms capture). |
| `charge.refunded` | Look up the Cal.com booking via `metadata.bookingId` and cancel it via Cal.com API. |

Webhooks are a safety net, not the primary path. The booking is confirmed synchronously in `/api/booking/confirm`.

---

## 6. Error handling

| Failure | User sees | Server does |
|---|---|---|
| `/api/cal/slots` 5xx | "Can't load times right now" + retry button | Log; client retries on click |
| Slot taken at confirm (Cal 409) | Inline error: "That slot was just taken. Pick another time →" | Cancel PI; user goes back to step 06 |
| Stripe card declined | Stripe Elements inline error (default UX) | PI stays `requires_payment_method`; user retries |
| Cal.com 5xx during confirm | "Couldn't book your session. Your card was not charged. Try again." | Retry once; if still fails, cancel PI |
| Capture fails after Cal book succeeds | "Payment couldn't be completed. We've held your slot — our team will reach out." | Cal booking exists; PI stuck `requires_capture`. Resolved manually + via webhook. Rare. |
| User abandons after authorization | n/a | Auth expires automatically after ~7 days. Out-of-scope cron can cancel earlier (not in v1). |

---

## 7. Security

- `STRIPE_SECRET_KEY` and `CAL_API_KEY` are imported only from `lib/server/*` (server-only modules). Any accidental import from a `'use client'` file would surface as a build-time error (Next.js server-only enforcement).
- Webhook receiver verifies signatures using `stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)`. Unverified requests → 400.
- `/api/booking/confirm` recomputes the total from `{setId, durationMinutes, addonIds}` server-side and asserts `paymentIntent.amount === recomputedTotal * 100`. Mismatch → cancel PI + 400.
- `/api/cal/slots` accepts only known `setId` values (allowlist from `collections.ts`); requests with arbitrary numeric `eventTypeId` are rejected.
- Rate limit `/api/cal/slots` and `/api/stripe/intent` via a simple in-memory token bucket (10 req/sec per IP) — `lib/server/rate-limit.ts`. Sufficient for a single-instance Vercel deployment; revisit when scaling.
- No PII beyond customer email + booking ID is logged. Card data never reaches our server — Stripe.js tokenizes in the browser.

---

## 8. Setup checklist (manual, in dashboards)

**Cal.com**
1. Create one event type per studio set (6 total). Titles should match `collections.ts`:
   - Executive Podcast Set
   - Authority Desk Set
   - Authority Creator Set
   - Horizon Podcast Set
   - Horizon Desk Set
   - Horizon Creator Set
2. For each, configure availability and buffer time. Default duration 90 min; allow extending via Cal.com's variable-length feature (or create multiple length variants if v2 doesn't support per-booking duration override).
3. Copy each event-type's numeric ID into the corresponding `.env.local` var.
4. Settings → Developer → API keys → generate a Personal Access Token. Set as `CAL_API_KEY`.

**Stripe**
1. Account onboarding to the point where API keys are issued.
2. Copy publishable + secret keys (test mode for development).
3. Webhooks → add endpoint `https://<your-vercel-domain>/api/stripe/webhook`, subscribed to:
   - `payment_intent.succeeded`
   - `payment_intent.canceled`
   - `payment_intent.amount_capturable_updated`
   - `charge.refunded`
4. Copy the signing secret as `STRIPE_WEBHOOK_SECRET`.
5. For local dev: `stripe listen --forward-to localhost:3000/api/stripe/webhook` and use the temporary `whsec_…` it prints.

**Vercel**
- Add all env vars to the project settings for both Preview and Production.

---

## 9. Testing

**Unit (Vitest)**
- `lib/server/pricing.ts`: parity with `lib/pricing.ts` across a matrix of inputs.
- `lib/server/set-event-types.ts`: known sets resolve; unknown returns `null`.
- API route input validation: malformed bodies → 400.
- Cal.com and Stripe SDKs are mocked; no live network.

**Integration (Vitest)**
- `/api/booking/confirm` happy path: mock Cal.com 201 → assert `stripe.paymentIntents.capture` was called → returns `{ paid: true }`.
- `/api/booking/confirm` slot-taken: mock Cal.com 409 → assert `stripe.paymentIntents.cancel` was called → returns 409.
- `/api/booking/confirm` amount mismatch: client total ≠ recomputed total → assert PI cancelled + 400.
- `/api/stripe/webhook` signature failure: returns 400 and does nothing.

**Manual end-to-end (before shipping)**
1. Wizard with test card `4242 4242 4242 4242` → confirm booking visible in Cal.com dashboard and captured charge in Stripe dashboard.
2. Test card `4000 0000 0000 9995` (insufficient funds at confirm step) → assert graceful error UI and no Cal.com booking created.
3. Force Cal.com failure by temporarily deleting the event type → retry → assert PI was cancelled (Stripe dashboard shows `canceled` status, not `succeeded`).
4. Trigger a refund via Stripe dashboard on a real test booking → assert the Cal.com booking is cancelled by the webhook.

---

## 10. Out of scope (v1)

- Customer accounts / saved cards.
- In-app refund UI (refunds happen via Stripe dashboard; webhook propagates to Cal.com).
- Custom email templates (Cal.com's default confirmation is fine for v1).
- SMS reminders.
- Cron job to clean up stale `requires_capture` PaymentIntents.
- Deposit / partial payment flows.
- Multi-currency.
- Coupons / promo codes.

---

## 11. Open questions for the user

- **Studio time zone:** Cal.com slots are returned in UTC; we need to render in studio-local. Confirm the timezone (e.g. `America/New_York`) so we can hard-code it in slot rendering. *(If not specified, default to `America/New_York` in implementation.)*
- **Event-type duration model:** does Cal.com v2 allow variable duration per booking on a single event type, or do we need a length variant per length we offer? *(Implementation will detect and adapt; resolution may add a small event-type-per-length matrix.)*
