# Package Builder Pages — Design

Date: 2026-11-21
Status: draft, awaiting Niko's approval

## Intent and why

Voxa sells studio time today ($300 / 90 min, +$100 per 30 min, up to 5 hours, color grading, audio and screen recording included). About half of studio bookings are VSLs, courses and product demos, and the buyers are coaches and business owners. Editing on the current service pages is only "ask us about it."

Voxa now edits quickly and well (Claude-assisted workflow: about 1–2 hours to edit a 1-hour course lesson). Niko wants to sell **finished videos**, not just footage, by giving each video type its own page. Each page opens with an advertorial-style story in Voxa's voice and ends with a **package builder**: the visitor picks what they need, sees a "Your custom package" price, and either reserves with a deposit or books the free studio tour.

Why it matters: it turns a $300 session into a $2–3k package for buyers who are already coming in, it puts prices in front of people (most studios hide them), and it speaks to the half of the market that the "podcast studio" framing misses.

## Goals

- Three new pages: **Course**, **VSL**, **Product demo**, each with its own advertorial story followed by the shared builder.
- One shared pricing engine and one price file, so prices change in one place and a fourth page (YouTube editing) can be added later without new math.
- Two ways out of the builder: **Reserve with deposit** (Stripe) or **Book a free tour** (existing tour modal).
- Package leads arrive to Niko by email with the full configuration.
- Separate tracking events so package leads never mix with studio or On-Site conversions.
- Existing service pages link to the matching package page.

## Non-goals

- Funnel build-out, landing pages, email sequences, scriptwriting.
- YouTube editing page (later; the engine must support it, but the page is not built now). The planned shape is a monthly editing plan for YouTube/podcast, the editing-only product worth advertising nationally once local editing-only jobs prove out.
- National advertising of editing-only services. At launch, editing-only is sold to the existing local audience (past clients, tour visitors, Tampa coaches).
- File uploads on the site.
- On-Site (mobile) recording inside the builder. Recording option is studio only.
- Paying the full package up front, accounts or client portals, revision tracking.
- Changing the homepage, the studio booking wizard (`/book`) or the existing service page copy beyond adding a link block.

## Anti-goals (failure even if it works)

- Disturbing the studio funnel or its Google Ads bidding: no `generate_lead` or studio purchase events from these pages.
- Copy that reads as a fixed, locked menu. Per the "signal flexibility" rule, the price shows as a range, and the copy says the final scope is confirmed on a short call.
- Promising more capacity than one person can deliver (turnaround and revisions must be stated).
- Using footage without client permission. The Vega II launch video must never appear.

## Approaches considered

- **A. Add the builder to the existing service pages** (`/studios/course-webinar-tampa`, `/studios/vsl-meta-ads-tampa`, plus a new demo page). Fewest pages, but those pages are short SEO/AEO pages selling studio sessions. A long advertorial and an editing builder would muddy what they tell Google and studio buyers.
- **B. New dedicated package pages, linked from the existing ones.** *Chosen by Niko.* SEO pages stay clean, each page can carry a full sales story, ads can land directly on them, and they get their own tracking. Doubles as the cold-traffic landing page on the known follow-ups list.
- **C. One `/build` page with a type picker.** Cheapest, but loses the per-type story that makes the idea work and is weaker as an ad destination.

## Pages

| Page | Path (my call) | Builder starts on | Story candidate |
|---|---|---|---|
| Course | `/packages/course` | lessons: 10, length 10–30 min, Clean edit, recording on | Vanessa F (course / coach) |
| VSL | `/packages/vsl` | 1 video, up to 10 min, Full motion, recording on | Kyle Gregory (VSL) |
| Product demo | `/packages/demo` | 2 videos, up to 10 min, On-screen text, recording on | Alex Cooper (YouTube / product demos) |

Story candidates come from the case-study list in the Meta ads plan. Each needs the client's permission before their name, quote or footage is used. **Launch (my call; Niko said either is fine):** each page launches with an unnamed story ("a Tampa coach…") built from the real job. The story content has a `named` version that's turned on once the client gives permission. Pages don't wait on permission.

### Page structure (each page)

1. **Advertorial opening.** Headline in story form ("How a Tampa coach turned X hours of recording into a finished course"), short narrative: the problem, what Voxa did, the result. Editorial feel, Voxa's dark Cinematic Obsidian style (`DESIGN.md`), not "breaking news" clickbait.
2. **What you get.** Recording, editing, clips, in plain words.
3. **Edit levels shown, not told.** Three cards, each with a 5–10 s looping preview clip and a one-line description (see Edit levels). Placeholders until clips are chosen.
4. **The package builder** (below).
5. **Proof.** Reviews filtered by type (existing `reviews-data.ts` / `reviewTag`).
6. **FAQ.** Turnaround, revisions, own footage (including what Voxa can and can't fix in home recordings, such as poor audio or lighting), what the deposit covers.
7. **Final CTA**, plus a sticky "Build your package" button on mobile (same pattern as On-Site's `sticky-quote-cta`).

## Pricing

All prices live in one file (for example `lib/content/packages/pricing.ts`) and are starting prices for Niko to adjust.

### Editing grid (per finished video)

| Finished length | Clean edit | Edit + on-screen text | Full motion design |
|---|---|---|---|
| Up to 10 min | $75 | $125 | $200 |
| 10–30 min | $150 | $250 | $400 |
| 30–60 min | $250 | $400 | $600 |

### Edit levels (plain-language labels)

- **Clean edit:** tight cuts, color, audio, slides or screen recording placed in.
- **Edit + on-screen text:** adds titles, lower thirds, text callouts, captions, intro/outro.
- **Full motion design:** animated graphics, b-roll, zooms, music and sound design.

### Add-ons

- **Studio recording (optional):** existing rates from `lib/pricing.ts` (`getTotal`), reused, not duplicated.
- **Short clips:** $20 each. Quick picks 0 / 5 / 10 / 20, plus a custom number. (Separate from the $50 podcast clip add-on in the studio wizard.)

### Recording estimate (my call)

- The builder suggests recording time from the plan: `videos × finished-length midpoint × 1.5`, rounded up to the next 30 min, minimum 90 min. Length midpoints: 5 / 20 / 45 min. (Vanessa's data point, about 1 recorded hour per hour-long lesson, sits inside this.)
- The visitor can adjust the suggested hours with a stepper (30-min steps).
- Studio sessions max out at 5 hours, so the time is split into sessions: fill 5-hour sessions first, and the remainder becomes a final session of at least 90 min. Each session is priced with `getTotal` and summed. Example: 10 hours = 2 × $1,000 = $2,000.
- Unchecking "Record at Voxa" makes it an editing-only package (their own footage).

### Shown price (my call)

- `total` = editing + recording + clips.
- Shown as a range: **total to total × 1.10, each rounded to the nearest $50**, labeled "Your custom package" with "Final scope confirmed on a quick call."
- Line items are shown under the range so the visitor sees what drives it.

### Worked example (course page)

12 lessons, 10–30 min, Edit + on-screen text, recording on, 20 clips:
- Editing 12 × $250 = $3,000
- Recording suggestion: 12 × 20 × 1.5 = 360 min → 6 h → sessions 5 h ($1,000) + 1 h → bumped to 90 min ($300) = $1,300
- Clips 20 × $20 = $400
- Total $4,700 → shown as ~$4,700–$5,150

## Turnaround and revisions

- **2 rounds of revisions included** on every video (Niko's call). Shown in the output panel and the FAQ.
- **Turnaround depends on the package** (Niko: it depends on length and amount of editing). It's calculated by the pricing engine, shown in the output panel as "Estimated delivery," and counted from when the footage is in hand. Starting values (my proposal, in the price file):
  - Base: 5 business days.
  - Plus 1 business day for every 60 finished minutes (the length midpoint × videos), rounded up.
  - Plus 3 business days if the level is Full motion design.
  - Shown as a range: estimate to estimate + 3 business days. Example: a 12-lesson, 10–30 min course (240 finished min) with on-screen text → 9–12 business days.
- Copy says "estimated," and the final timeline is confirmed on the call.

## The builder

Shared React component, configured per page (which inputs show, defaults, labels).

Inputs:
- **Already recorded?** The first choice in the builder: "I need to record" / "I already have footage." Picking "already have footage" turns off and hides the recording option, and adds a short "How to send your files" note (shared Google Drive or Dropbox link, sent after the deposit; no uploads on the site). It's also stated near the top of each page so editing-only visitors know the page is for them.
- **Number of videos** (course: "lessons", 1–40; VSL: "videos / versions", 1–5; demo: "videos", 1–10).
- **Typical finished length:** three choices from the grid. One choice applies to all videos (a mixed-length course is settled on the call).
- **Edit level:** three cards with preview clips.
- **Record at Voxa?** checkbox with suggested hours and a stepper.
- **Short clips:** quick picks plus custom.

Output panel (sticky on desktop, collapsible bar on mobile): range, line items, two buttons.

**Book a free tour:** opens the existing tour modal (`lib/tour-modal-context.tsx`) and passes the package summary along so Niko sees it with the tour request if the modal supports notes. If it doesn't, the summary is sent via the package lead email.

The tour modal currently fires `generate_lead` (past the details step) and `tour_booked` (on success), and both feed studio Google Ads bidding. **My call:** make the modal source-aware. When it's opened from a package page it fires `package_tour_booked` instead and suppresses the studio events. Studio behavior is unchanged when no source is passed, and a test covers that.

**Which button leads (Niko: high-ticket packages should start with a call to get the vision):**
- **Packages under $1,500 (low end of range)**, such as a single VSL or a couple of demos: primary button **Reserve with deposit**, secondary **Book a free tour**.
- **Packages of $1,500 and up**, such as most courses: primary button **Book a vision call** (free, through the new Cal event), secondary **Reserve with deposit**. The tour stays available as a text link.
- The $1,500 threshold lives in the price file (my proposal; easy to change).

**Book a vision call:** contact step (below), then the new Cal event opens with the package summary in the booking notes. Niko gets the package lead email.

**Reserve with deposit:**
1. Contact step: name, email, phone (required, as in the On-Site form), optional notes. Honeypot field like the On-Site quote form.
2. Payment step: Stripe Payment Element for the deposit amount.
3. Confirmation page: what happens next, plus the new Cal event embedded so they book the vision call right away. Every deposit is followed by a call; work starts after it.

## Deposit and payment

- Deposit = **30% of the low end of the range** (my proposal), rounded to the dollar.
- **Credited toward the package total** (Niko's call).
- **Refund (my call, for Niko to check):** fully refundable if they cancel after the vision call and before any work starts. Once recording or editing starts, it's non-refundable. If the confirmed scope comes in under the range, the deposit is still credited in full. Stated next to the pay button, on the confirmation page and in the FAQ.
- Refunds are issued by hand in the Stripe dashboard; no refund automation in this build.
- Charged immediately (automatic capture), **not** the manual-capture hold the studio flow uses. Holds expire after about 7 days, and a package can run weeks.
- New route (for example `/api/packages/deposit`) recomputes the price on the server from the configuration. It never trusts the client amount, the same rule as `/api/stripe/intent`. Rate-limited with `lib/server/rate-limit.ts`.
- Stripe metadata holds the page type, configuration, contact and range.
- Studio sessions are **not** booked automatically. They're scheduled on the scope call, because a course often needs several sessions.

## Lead notification

- **My call:** when the contact step is submitted (before payment), send Niko a "started, not paid" lead email, so drop-offs at payment aren't lost. The contact step is its own API call.
- On deposit success and on tour-with-package, send Niko an email through Resend, reusing the pattern in `lib/server/onsite-lead-email.ts`: readable labels, full configuration, range, deposit paid yes/no.
- The confirmation page is shown only after Stripe confirms the payment on the client. A webhook for `payment_intent.succeeded` sends the email so it isn't lost if the visitor closes the tab (the existing webhook currently ignores this event). The builder decides how to avoid duplicate emails.

## Tracking

New events through `pushDataLayer`, in a new `lib/tracking/packages.ts`, mirroring `lib/tracking/onsite.ts`. **Not** `generate_lead`.

- `package_builder_start`: first interaction with the builder (`page_type`)
- `package_tour_click`: `page_type`, `range_low`
- `package_tour_booked`: tour booked from a package page (replaces studio `tour_booked` / `generate_lead` there)
- `package_contact_submit`: contact step done, before payment or call booking
- `package_call_booked`: vision call booked through the new Cal event
- `package_deposit_paid`: `page_type`, `value` (deposit), `range_low`, `range_high`
- `package_deep_read`: 75% scroll on the advertorial (matches the Meta plan's "deep read" idea)

GTM, GA4 and the Google Ads conversion setup for these events are a separate manual step for Niko (not part of this build), the same way On-Site was done.

## Links from existing pages

- `/studios/course-webinar-tampa` → `/packages/course`, and `/studios/vsl-meta-ads-tampa` → `/packages/vsl`, through a small "Need it edited too? Build your package" block. Existing copy stays as is. (`ServicePage` already has an optional `related` field the builder can use or extend.)
- No homepage or header changes in this build.

## SEO (my call)

Package pages are **left out of the sitemap at launch** (ads first, the same choice as On-Site). They still get proper titles, descriptions and Open Graph images. Adding them to `app/sitemap.ts` later is a small change.

## Constraints

- Next.js app router, Tailwind, existing design tokens (`DESIGN.md`), existing components where they fit (FAQ, reviews, final CTA, tour modal).
- Stripe is already set up (`lib/server/stripe.ts`); the same keys apply.
- Must work at phone width; most ad traffic is mobile.
- Vitest is set up: the pricing engine (grid lookup, recording estimate, session split, range rounding, deposit) gets unit tests.

## Left to the builder

- Component breakdown, file names beyond those suggested, animation details.
- Exact placement of the output panel and the mobile collapse behavior.
- How the tour modal carries the package summary.
- Duplicate-email protection between the client confirmation and the webhook.

## Manual steps for Niko (block launch)

- Create a new Cal event ("Package vision call"). Its link goes in a new env var `NEXT_PUBLIC_CAL_PACKAGE_LINK` in Vercel.
- Pick the preview clips for each edit level (never Vega II). Placeholders until then.
- After launch: GTM / GA4 / Google Ads setup for the package events.

## Decisions log

- Approach B, dedicated pages (Niko).
- One price grid by finished length × edit level (Niko's direction, starting numbers mine).
- Clips $20 each (Niko).
- Deposit credited toward the total (Niko). 30% and the refund terms are my proposal.
- Call first for high-ticket packages (Niko). $1,500 threshold is mine.
- 2 revision rounds (Niko). Turnaround formula is mine.
- Unnamed stories at launch (my call; Niko indifferent).
- New Cal event for the vision call (Niko).
- Tour modal made source-aware, and "started, not paid" lead email (my calls after the reviewer check).

## Update 2026-11-21: no online deposit

Decision: the website takes no deposit. The only next step from the builder is booking the free vision call on Cal.com (a Google Meet video call); the studio tour stays as the secondary option. Any deposit is handled after the call, outside the site. This supersedes the Deposit and payment section above.

Removed:
- Builder: the deposit button, "Deposit to reserve" line and call-first branching. One primary button, "Book a vision call", plus "Book a free tour". `onContinue` now receives `{ config, quote }`.
- Checkout: the deposit and confirmation steps, Stripe Elements and the `intent` prop. The flow is contact, then call.
- Package page: Stripe redirect-return handling (confirmation, failed-payment message, URL cleanup).
- Deleted files: `components/packages/deposit-form.tsx`, `components/packages/package-confirmation.tsx`, `lib/packages/deposit-session.ts`, `app/api/packages/deposit/route.ts`, and the deposit API test.
- Pricing: `deposit`, `callFirst`, `DEPOSIT_RATE` and `CALL_FIRST_THRESHOLD`.
- Server: `createDepositIntent`, the package-deposit branch of the Stripe webhook, and the email stage concept. One lead email remains (contact submitted).
- Tracking: `package_deposit_paid`.
- Copy: `DEPOSIT_TERMS` and the deposit FAQ, replaced by "What happens after the call?".
