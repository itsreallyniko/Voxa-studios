# Voxa Studios — Landing Page & Showroom Booking Experience

**Date:** 2026-06-04
**Status:** Design / pre-implementation

## Goal

Port the existing Google Stitch HTML mockup (`code.html`) to a functioning Next.js app, and add a multi-step "showroom" booking experience that lives on `/book`. The booking flow must feel like configuring a premium product (Apple Mac Studio buy flow / private members club) rather than filling out a form — visual, intuitive, and focused on helping the user identify the environment that best matches their brand.

## Tech Stack

- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS, configured to match the existing `DESIGN.md` "Cinematic Obsidian" design system (DM Sans, Obsidian/Ivory/Heritage Gold palette, 8px spacing rhythm, soft 6px radii)
- **State:** React Context + `useState`, no external state library
- **Persistence:** `sessionStorage` for in-progress booking state, URL hash for current step
- **Animation:** CSS transitions + minimal Framer Motion (for `AnimatePresence`-style step transitions only)
- **No backend** in this pass — content is bundled as static TypeScript
- **Stripe & Cal.com:** Deferred. Stubs and placeholder components only, with clear interfaces for a future single-file swap-in.

## Routes

- `/` — marketing landing page (port of `code.html`)
- `/book` — single-page wizard with no internal route changes. Step state lives in React state + URL hash (`/book#set`, `/book#addons`, etc.) so browser back/forward and shareable links work.

## Landing Page

Composed of these sections, in order, from the existing mockup:
1. Navigation
2. Hero — full-bleed image, headline, primary "Explore Studio Sets" → `/book`, secondary "Book a Studio Tour"
3. Collections preview (Executive / Horizon cards)
4. Example content slider
5. Why Voxa feature grid
6. Social proof testimonials
7. Studio tour CTA
8. Final CTA
9. Footer

Each becomes its own React component under `components/marketing/`. All copy, classes, and image URLs preserve the existing mockup as closely as possible; only structural conversion to JSX + extraction to components.

## Booking Wizard Architecture

### Three persistent layers on `/book`

1. **Step rail** (sticky top, below the nav)
   - Horizontal stepper with 7 pips: `Collection → Set → Add-Ons → Details → Length → Schedule → Checkout`
   - Each pip shows: number (`01`–`07`), label, status (done / current / locked)
   - Clicking a *completed* step jumps back to it; locked steps are non-interactive
   - Active step number renders in Heritage Gold; completed steps show a 6px gold underline
   - Mobile: collapses to `03 / 07 — Add-Ons` + a thin progress bar; tap to reveal the full list as a dropdown

2. **Stage area** (the showroom)
   - Single `<main>` that swaps content per step via cross-fade + 8px vertical slide (~280ms ease-out)
   - Each step's content is short enough to fit a single viewport on desktop (no internal scroll)
   - No scroll-jacking

3. **Booking Summary** — always visible
   - Desktop: sticky right rail, 360px wide, in-flow (not floating)
   - Mobile: bottom bar (64px tall) showing total + selection count, tap to expand into a bottom sheet covering 80% of the viewport with drag-to-dismiss
   - Never empties — at Step 1 with nothing selected it shows `Session — 90 min — $300`. The total never starts at $0.

### Step flow

| # | Step | Stage content | Complete when |
|---|---|---|---|
| 01 | Collection | Two huge cinematic cards (Executive / Horizon), grayscale → color on hover, click to select | `collectionId` set |
| 02 | Set | Left rail of 3 set thumbnails from the chosen collection, right side = giant hero image + tabs (Gallery / Equipment / Capacity / Example Content). Selecting a thumbnail cross-fades the hero. *Combines original brief's Steps 2 + 3 — preview IS the selection screen.* | `setId` set |
| 03 | Add-Ons | Gallery of add-on cards with imagery, descriptions, and prices. Whole-card toggle. Live price tick. | Always complete (optional) |
| 04 | Project Details | Minimal editorial form (bottom-border inputs): "What are you recording?", guest names, social links, special requests. Backdrop = blurred image of chosen set at 8% opacity. | `recordingType` non-empty |
| 05 | Session Length | Centered editorial layout. Large duration display (`01:30` → `02:30`...). Stepper with `−` / `+` buttons. Minimum 90 minutes. Soft cap 8 hours. Live price preview underneath. Subtle hint: *"Sessions start at 90 minutes. Add hours as needed."* | Always complete (defaults to 90min / $300) |
| 06 | Schedule | Cal.com embed (placeholder in this pass) themed to Cinematic Obsidian. Receives `durationMinutes` so it only shows valid open windows. | `date && time` set |
| 07 | Checkout | Stripe Payment Element (placeholder in this pass) inline. Summary repeats as a confirmation column. | Payment success (deferred) |

### Navigation rules

- Each step has Next/Back buttons (sticky bottom-right on desktop, sticky full-width bottom on mobile)
- Next is disabled until the current step is complete; disabled state shows what's missing (`Select a set to continue`) — no toast, no modal
- Keyboard: `→`/`←` move between steps if valid; `Enter` advances on Details and Length steps; `Esc` collapses mobile summary sheet
- Refresh on `/book#schedule` after sessionStorage wipe falls back to `/book#collection` — never lands the user on a step they can't logically be on

## Data Model

```ts
type Booking = {
  collectionId: 'executive' | 'horizon' | null
  setId: string | null                  // e.g., 'executive-podcast'
  addonIds: string[]
  details: {
    recordingType: string
    guests: string
    socials: string
    notes: string
  }
  durationMinutes: number               // default 90, increments of 60
  schedule: {
    date: string | null                 // ISO date
    time: string | null                 // ISO time
  }
}
```

## Pricing

- **Base:** $300 for 90 minutes — flat across all 6 sets (set choice is purely aesthetic)
- **Extra time:** $100 per additional hour, in 1-hour increments above the 90-min base
- **Add-ons:** Flat fees on top
- **Soft cap:** 8 hours total (UI prevents going higher)

```ts
// lib/pricing.ts
const BASE_PRICE_USD = 300
const BASE_MINUTES = 90
const EXTRA_HOUR_PRICE = 100

function getTotal(booking, addons) {
  const extraHours = Math.max(0, (booking.durationMinutes - BASE_MINUTES) / 60)
  const timePrice = BASE_PRICE_USD + extraHours * EXTRA_HOUR_PRICE
  const addonTotal = booking.addonIds
    .map(id => addons.find(a => a.id === id)?.price ?? 0)
    .reduce((a, b) => a + b, 0)
  return {
    base: BASE_PRICE_USD,
    extraHours,
    extraTimePrice: extraHours * EXTRA_HOUR_PRICE,
    addonTotal,
    total: timePrice + addonTotal,
  }
}
```

## Content (Source of Truth)

Two static TypeScript files. No CMS, no fetch.

### `lib/content/collections.ts`

Two collections, three sets each. Per-set fields:

- `id` (e.g., `executive-podcast`)
- `name`
- `description`
- `bestFor: string[]`
- `equipment: string[]`
- `capacity: { seats: number, label: string }`
- `heroImage`
- `gallery: string[]` (4–6 images)
- `exampleContent: { thumb: string, label: string }[]`

Per-collection fields:

- `id`, `name`, `tagline`
- `audience: string[]`
- `visualTraits: string[]`
- `heroImage`
- `sets: Set[]`

**Initial 6 sets:** Executive Podcast, Authority Desk, Authority Creator, Horizon Podcast, Horizon Desk, Horizon Creator.

### `lib/content/addons.ts`

Four add-ons:

| ID | Name | Price |
|---|---|---|
| `teleprompter` | Teleprompter | $150 |
| `clip-repurposing` | Clip Repurposing | $500 |
| `extra-camera` | Additional Camera Angle | $250 |
| `producer` | Producer Assistance | $400 |

Each has: `id`, `name`, `description`, `price`, `image`.

### Placeholder content

- Images: reuse the Google Stitch URLs from `code.html` as initial placeholders, marked with `TODO` comments. Swapping in real photos is a single-file content edit.
- Copy: I'll write plausible descriptions, equipment lists, capacities for each set + each add-on. All editable in one place.

## Component & File Structure

```
voxa-website/
├── app/
│   ├── layout.tsx              # Nav, DM Sans, global theme
│   ├── page.tsx                # Landing page (composes marketing sections)
│   ├── globals.css             # Tailwind directives + design tokens
│   └── book/
│       └── page.tsx            # Wizard shell (rail + stage + summary)
├── components/
│   ├── nav.tsx
│   ├── marketing/
│   │   ├── hero.tsx
│   │   ├── collections-preview.tsx
│   │   ├── example-content-slider.tsx
│   │   ├── why-voxa.tsx
│   │   ├── social-proof.tsx
│   │   ├── studio-tour-cta.tsx
│   │   └── footer.tsx
│   ├── book/
│   │   ├── step-rail.tsx
│   │   ├── booking-summary.tsx
│   │   ├── step-frame.tsx      # Per-step enter/exit motion wrapper
│   │   └── steps/
│   │       ├── collection-step.tsx
│   │       ├── set-step.tsx
│   │       ├── addons-step.tsx
│   │       ├── details-step.tsx
│   │       ├── length-step.tsx
│   │       ├── schedule-step.tsx
│   │       └── checkout-step.tsx
│   └── ui/
│       ├── button.tsx          # Primary (gold), secondary (ivory + slate border)
│       ├── tag.tsx             # label-caps chip
│       ├── input.tsx           # Bottom-border editorial input
│       ├── checkbox-toggle.tsx
│       └── divider.tsx
├── lib/
│   ├── booking-context.tsx
│   ├── pricing.ts
│   └── content/
│       ├── collections.ts
│       └── addons.ts
└── public/
    └── studio/                 # Placeholder/real images
```

### Component contracts

- **`<BookingProvider>`** wraps `/book`. Exposes `{ booking, setBooking, currentStep, goTo(stepKey), next(), back(), totals }`.
- **`<StepRail>`** reads current step + completion state, renders 7 pips with labels.
- **`<StepFrame stepKey="set">`** handles enter/exit motion. The only place motion logic lives — steps themselves are static layouts.
- **`<BookingSummary>`** takes the booking object, renders line items. Two responsive shells (right panel / bottom sheet).
- **Set step internals:** `<SetThumbnailRail>`, `<SetHero>`, `<SetTabs>` (Gallery / Equipment / Capacity / Example Content). Selecting a thumbnail updates `<SetHero>` in place.

**Pattern:** Every step is a pure function of `booking` state + dispatcher. No step owns data. Jumping back to a completed step doesn't reset downstream state.

## Motion

| Element | Motion |
|---|---|
| Step transitions | Cross-fade 200ms + 8px vertical slide, `ease-out`. No spring — sharp, editorial. |
| Step rail pip → active | Width animates 8px → ~120px over 240ms. Gold fill animates last (60ms delay). |
| Collection / Set card hover | Grayscale → color over 1000ms (preserve existing). Scale 1 → 1.02. |
| Set hero swap on thumbnail click | Cross-fade between two `<img>` layers, 320ms. No scale, no slide. |
| Add-on toggle | Border slides Slate Gray → Heritage Gold. Whole card is the toggle. `+$150` badge swaps to `✓ ADDED`. |
| Summary panel updates | New line items slide in from top 4px + fade, 200ms. Total uses `tabular-nums`. |
| Inputs (details step) | Border Slate Gray → Heritage Gold on focus, 160ms. No floating labels. |
| Session Length `+` click | Tiny `+$100` floats up from the price and fades. |
| Set step idle | After 3s without interaction, hero performs a 20s slow scale 1.00 → 1.04 → 1.00 (ken-burns). Stops on any interaction. |
| Checkout summary lock | On entering Checkout, summary briefly highlights with 1px gold border that fades after 600ms. |

**No motion** on layout shifts, step rail position, or summary panel position. These never move once mounted.

**Hover rule (Emil):** Everything clickable changes *something* on hover — usually a border-color shift to gold, or opacity bump. Anything that doesn't change on hover is treated as non-interactive.

**Reduced motion:** Respect `prefers-reduced-motion`. All transitions collapse to instant opacity swaps. No slides, no scale.

## Mobile Behavior

Mobile breakpoint: `< 1024px` (Tailwind `lg`).

| Region | Desktop | Mobile (`< lg`) |
|---|---|---|
| Step rail | Horizontal sticky bar with full labels | Compact: `03 / 07 — Add-Ons` + thin progress bar; tap reveals full list |
| Stage area | Centered, max ~1080px wide, right-padded for summary | Full width, 24px edge margins |
| Summary panel | 360px sticky right rail | Bottom bar (64px), tap → bottom sheet (80% viewport, drag-to-dismiss) |
| Next/Back | Bottom-right of stage | Sticky full-width above summary bar. Back = ghost, Next = gold primary |

**Per-step mobile adjustments:**

- **Collection** — cards stack vertically, full-bleed at 75vh
- **Set** — thumbnail rail moves *below* hero, becomes a horizontal scrolling row. Tabs become a horizontal scrolling tab bar.
- **Add-Ons** — 1-column grid
- **Session Length** — typography scales to `display-lg-mobile` token
- **Schedule** / **Checkout** — embeds render natively single-column

## Accessibility

- Step rail uses `<ol>` with `aria-current="step"` on the active item
- Each step heading is the page's `<h2>` and grabs focus on transition (announces the new step to screen readers)
- All interactive cards use real `<button>` elements (no `div + onClick`)
- Inputs have visible `<label>` per design system (label-caps above the bottom-border field)
- Color contrast: Heritage Gold on Obsidian = 7.1:1 (AAA for normal text). Ivory at 60% opacity on Obsidian = 5.4:1 (AA for normal, AAA for large). Avoid 30%-opacity ivory for anything informational.

## Persistence & Resilience

- All booking state persists to `sessionStorage` under key `voxa-booking`
- URL hash mirrors current step (`/book#set`)
- On mount: hydrate from sessionStorage, then validate against current state. If user lands on a step they can't logically be on (e.g., `#schedule` with no `setId`), fall back to the earliest incomplete step.
- No 404 / no error boundary needed for the wizard — the worst case is "start over from collection."

## What's Deferred (Out of Scope for This Pass)

- **Real Stripe Payment Element wiring.** Placeholder Checkout component with a fake "Pay" button → success screen. Component interface designed so the swap-in later is one file.
- **Real Cal.com embed wiring.** Placeholder calendar grid with mock slots. Receives `durationMinutes`. Same swap-in shape as above.
- Authentication / user accounts
- Email confirmations / standalone booking confirmation page
- Admin / studio-operator view
- Analytics instrumentation
- Image optimization beyond Next.js `<Image>` defaults

## Success Criteria

1. `/` renders the landing page matching the existing mockup, responsive, no console errors.
2. `/book` renders the 7-step wizard with the persistent summary panel.
3. User can complete the flow end-to-end with the placeholder Cal.com and Stripe stubs and reach a "booking confirmed" screen.
4. State persists across refresh (sessionStorage).
5. Browser back/forward navigates between completed steps via the URL hash.
6. The flow respects `prefers-reduced-motion`.
7. Mobile flow is fully usable at 375px width with all 7 steps reachable.
8. Total price updates live as user changes set / add-ons / duration.
9. Design tokens from `DESIGN.md` are honored (DM Sans, Obsidian/Ivory/Heritage Gold, 8px rhythm, soft 6px radii, label-caps tracking).
