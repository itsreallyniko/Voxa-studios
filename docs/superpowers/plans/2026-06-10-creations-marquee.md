# Creations Marquee Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current "See What Gets Created Here" slider with a constantly-drifting marquee of six real guest photos rendered as same-height, variable-width editorial polaroid cards.

**Architecture:** A single client component (`components/marketing/creations-marquee.tsx`) renders an outer "frame" with an edge-fade mask and inside it a horizontal "track" that contains two copies of the card list. A pure-CSS keyframe animation translates the track by `-50%` in 60s, producing an infinite loop. Hover pauses the animation and dims sibling cards via `group-hover`. Card geometry uses `inline-flex flex-col` so each card's width tracks its image's native aspect while heights stay fixed. The data lives in a separate typed module so the marquee body stays declarative. Reduced-motion users get a static, horizontally-scrollable row via a CSS media query — no JS branch.

**Tech Stack:** Next.js 14 (app router), React 18 client component, Tailwind 3.4, pure CSS keyframes in `app/globals.css`, `next/image` for asset optimization, Vitest + React Testing Library for unit tests.

---

## File Structure (locked before tasks)

- **Create** `public/creations/Mirandacohenfit.jpg` (moved from `Scrolling_Images/`)
- **Create** `public/creations/Jasonkalambay.jpg` (moved)
- **Create** `public/creations/julietteastor.jpg` (moved)
- **Create** `public/creations/matt_thecloser.jpg` (moved)
- **Create** `public/creations/NYT_Ross_Douthat.jpg` (moved)
- **Create** `public/creations/NYT_Anna_paulina_luna.jpg` (moved)
- **Create** `components/marketing/creations-data.ts` — typed array of six `Creation` records
- **Create** `components/marketing/creations-marquee.tsx` — the section component (exports `CreationsMarquee`)
- **Create** `tests/creations-marquee.test.tsx` — Vitest + RTL tests
- **Modify** `app/globals.css` — add `@keyframes drift`, `.animate-drift`, `.creations-mask` utility class
- **Modify** `app/page.tsx:3,15` — swap import + JSX from `ExampleContentSlider` → `CreationsMarquee`
- **Delete** `components/marketing/example-content-slider.tsx` (old component)
- **Delete** `Scrolling_Images/` (whole directory once images verified in `public/creations/`)

---

## Task 1: Move guest photos into the Next.js `public/` directory

**Files:**
- Create: `public/creations/` (directory containing 6 image files moved from `Scrolling_Images/`)
- Delete: `Scrolling_Images/`

- [ ] **Step 1: Create the destination directory**

Run: `mkdir -p public/creations`
Expected: command succeeds, no output.

- [ ] **Step 2: Move all six image files**

Run:
```bash
mv Scrolling_Images/Mirandacohenfit.jpg \
   Scrolling_Images/Jasonkalambay.jpg \
   Scrolling_Images/julietteastor.jpg \
   Scrolling_Images/matt_thecloser.jpg \
   Scrolling_Images/NYT_Ross_Douthat.jpg \
   Scrolling_Images/NYT_Anna_paulina_luna.jpg \
   public/creations/
```
Expected: command succeeds, no output.

- [ ] **Step 3: Verify all six files landed**

Run: `ls public/creations/`
Expected output (alphabetical):
```
Jasonkalambay.jpg
Mirandacohenfit.jpg
NYT_Anna_paulina_luna.jpg
NYT_Ross_Douthat.jpg
julietteastor.jpg
matt_thecloser.jpg
```

- [ ] **Step 4: Remove the empty source directory**

Run: `rm -rf Scrolling_Images`
Expected: command succeeds, no output. Note `.DS_Store` is fine to remove with the directory.

- [ ] **Step 5: Commit**

```bash
git add public/creations Scrolling_Images
git commit -m "chore: move guest photos to public/creations for marquee"
```

---

## Task 2: Create the typed creations data module

**Files:**
- Create: `components/marketing/creations-data.ts`
- Test: `tests/creations-marquee.test.tsx`

- [ ] **Step 1: Write the failing data-shape test**

Create `tests/creations-marquee.test.tsx` with this content:

```tsx
import { describe, it, expect } from 'vitest'
import { creations } from '@/components/marketing/creations-data'

describe('creations data', () => {
  it('contains six entries', () => {
    expect(creations).toHaveLength(6)
  })

  it('every entry has src under /creations/, alt, aspect, set, byline', () => {
    for (const c of creations) {
      expect(c.src).toMatch(/^\/creations\/.+\.jpg$/)
      expect(c.alt.length).toBeGreaterThan(0)
      expect(['16:9', '9:16']).toContain(c.aspect)
      expect(c.set.length).toBeGreaterThan(0)
      expect(c.byline.length).toBeGreaterThan(0)
    }
  })

  it('exposes the one 9:16 portrait (julietteastor)', () => {
    const portraits = creations.filter((c) => c.aspect === '9:16')
    expect(portraits).toHaveLength(1)
    expect(portraits[0].src).toContain('julietteastor')
  })

  it('groups three creators under EXECUTIVE CREATOR SET', () => {
    const creators = creations.filter((c) => c.set === 'EXECUTIVE CREATOR SET')
    expect(creators).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- creations-marquee`
Expected: FAIL — `Cannot find module '@/components/marketing/creations-data'`.

- [ ] **Step 3: Create the data module**

Create `components/marketing/creations-data.ts`:

```ts
export type Creation = {
  src: string
  alt: string
  aspect: '16:9' | '9:16'
  set: string
  byline: string
}

export const creations: Creation[] = [
  {
    src: '/creations/Mirandacohenfit.jpg',
    alt: 'Miranda Cohen on the Executive Creator Set',
    aspect: '16:9',
    set: 'EXECUTIVE CREATOR SET',
    byline: '@mirandacohenfit',
  },
  {
    src: '/creations/Jasonkalambay.jpg',
    alt: 'Jason Kalambay on the Executive Creator Set',
    aspect: '16:9',
    set: 'EXECUTIVE CREATOR SET',
    byline: '@jasonkalambay',
  },
  {
    src: '/creations/julietteastor.jpg',
    alt: 'Juliette Astor on the Executive Creator Set',
    aspect: '9:16',
    set: 'EXECUTIVE CREATOR SET',
    byline: '@julietteastor',
  },
  {
    src: '/creations/matt_thecloser.jpg',
    alt: 'Matt at the Authority Desk',
    aspect: '16:9',
    set: 'AUTHORITY DESK',
    byline: '@matt_thecloser',
  },
  {
    src: '/creations/NYT_Ross_Douthat.jpg',
    alt: 'Ross Douthat filming Interesting Times on the Executive Podcast Set',
    aspect: '16:9',
    set: 'EXECUTIVE PODCAST SET',
    byline: 'Interesting Times · NYT',
  },
  {
    src: '/creations/NYT_Anna_paulina_luna.jpg',
    alt: 'Anna Paulina Luna on Interesting Times at the Executive Podcast Set',
    aspect: '16:9',
    set: 'EXECUTIVE PODCAST SET',
    byline: 'Interesting Times · NYT',
  },
]
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- creations-marquee`
Expected: PASS (4 tests in `creations data` describe block).

- [ ] **Step 5: Commit**

```bash
git add components/marketing/creations-data.ts tests/creations-marquee.test.tsx
git commit -m "feat: add typed creations data module with six guest entries"
```

---

## Task 3: Build the CreationsMarquee component and its tests

**Files:**
- Create: `components/marketing/creations-marquee.tsx`
- Modify: `tests/creations-marquee.test.tsx` (append render tests)

- [ ] **Step 1: Append failing render tests**

Append to `tests/creations-marquee.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
import { CreationsMarquee } from '@/components/marketing/creations-marquee'

describe('CreationsMarquee', () => {
  it('renders the section heading', () => {
    render(<CreationsMarquee />)
    expect(
      screen.getByRole('heading', { name: /see what gets created here/i }),
    ).toBeInTheDocument()
  })

  it('renders all six images with descriptive alt text', () => {
    render(<CreationsMarquee />)
    expect(screen.getAllByAltText(/Executive Creator Set/i)).toHaveLength(3 * 2) // duplicated
    expect(screen.getAllByAltText(/Authority Desk/i)).toHaveLength(1 * 2)
    expect(screen.getAllByAltText(/Executive Podcast Set/i)).toHaveLength(2 * 2)
  })

  it('renders two track halves: one visible, one aria-hidden for the loop', () => {
    const { container } = render(<CreationsMarquee />)
    const visible = container.querySelector('[data-marquee-half="primary"]')
    const duplicate = container.querySelector('[data-marquee-half="clone"]')
    expect(visible).not.toBeNull()
    expect(duplicate).not.toBeNull()
    expect(duplicate?.getAttribute('aria-hidden')).toBe('true')
    expect(within(visible as HTMLElement).getAllByRole('img')).toHaveLength(6)
    expect(within(duplicate as HTMLElement).getAllByRole('img')).toHaveLength(6)
  })

  it('shows the set name and byline for each unique creation', () => {
    render(<CreationsMarquee />)
    // Each set label appears once per card per track half (2 halves)
    expect(screen.getAllByText('EXECUTIVE CREATOR SET')).toHaveLength(3 * 2)
    expect(screen.getAllByText('AUTHORITY DESK')).toHaveLength(1 * 2)
    expect(screen.getAllByText('EXECUTIVE PODCAST SET')).toHaveLength(2 * 2)
    expect(screen.getAllByText('@mirandacohenfit')).toHaveLength(2)
    expect(screen.getAllByText('@julietteastor')).toHaveLength(2)
    expect(screen.getAllByText('Interesting Times · NYT')).toHaveLength(2 * 2)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- creations-marquee`
Expected: FAIL — `Cannot find module '@/components/marketing/creations-marquee'`.

- [ ] **Step 3: Create the component**

Create `components/marketing/creations-marquee.tsx`:

```tsx
'use client'

import Image from 'next/image'
import { creations, type Creation } from './creations-data'

function CreationCard({ c, priority }: { c: Creation; priority?: boolean }) {
  const isPortrait = c.aspect === '9:16'
  return (
    <figure className="group/card relative inline-flex flex-col shrink-0 rounded-2xl bg-surface-container-low border border-white/5 p-3 transition-opacity duration-500">
      <div className="relative overflow-hidden rounded-xl bg-black">
        <Image
          src={c.src}
          alt={c.alt}
          width={isPortrait ? 1080 : 1920}
          height={isPortrait ? 1920 : 1080}
          priority={priority}
          sizes="(max-width: 768px) 320px, 600px"
          className="block h-[320px] md:h-[420px] w-auto object-cover"
        />
      </div>
      <figcaption className="border-t border-white/5 mt-3 pt-3 px-1 pb-1">
        <div className="text-heritage-gold text-[10px] tracking-[0.4em] uppercase">
          {c.set}
        </div>
        <div className="text-white/60 text-sm mt-1 lowercase">
          {c.byline}
        </div>
      </figcaption>
    </figure>
  )
}

function Track({ half }: { half: 'primary' | 'clone' }) {
  return (
    <div
      data-marquee-half={half}
      aria-hidden={half === 'clone' ? true : undefined}
      className="flex gap-6 shrink-0"
    >
      {creations.map((c, i) => (
        <CreationCard
          key={`${half}-${c.src}`}
          c={c}
          priority={half === 'primary' && i < 2}
        />
      ))}
    </div>
  )
}

export function CreationsMarquee() {
  return (
    <section className="py-section-gap bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <div className="text-center mb-24">
          <h2 className="text-headline-xl text-white">See What Gets Created Here</h2>
        </div>
      </div>
      <div className="creations-mask relative overflow-hidden">
        <div className="creations-track group flex gap-6 w-max animate-drift">
          <Track half="primary" />
          <Track half="clone" />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- creations-marquee`
Expected: PASS (4 data tests + 4 component tests = 8 total).

- [ ] **Step 5: Commit**

```bash
git add components/marketing/creations-marquee.tsx tests/creations-marquee.test.tsx
git commit -m "feat: add CreationsMarquee component rendering all six guest cards"
```

---

## Task 4: Add the drift animation, edge-fade mask, and reduced-motion fallback to globals.css

**Files:**
- Modify: `app/globals.css` (append a new section after the existing `.animate-scroll-progress` block, before `.material-symbols-outlined`)

- [ ] **Step 1: Append the marquee CSS block**

Open `app/globals.css`. After the existing `.animate-scroll-progress` definition (around line 54) and before `.material-symbols-outlined`, insert:

```css
@keyframes drift {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}

.animate-drift {
  animation: drift 60s linear infinite;
  will-change: transform;
}

.creations-track:hover { animation-play-state: paused; }
.creations-track:hover > div > .group\/card { opacity: 0.4; }
.creations-track > div > .group\/card:hover { opacity: 1; transform: translateY(-4px); }

.creations-mask {
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0,
    black 96px,
    black calc(100% - 96px),
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0,
    black 96px,
    black calc(100% - 96px),
    transparent 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .animate-drift { animation: none !important; }
  .creations-mask { overflow-x: auto; }
}
```

- [ ] **Step 2: Verify no existing tests broke**

Run: `npm test -- creations-marquee`
Expected: PASS (8 tests, unchanged from Task 3).

- [ ] **Step 3: Smoke-test in the browser**

Run: `npm run dev`
Open: http://localhost:3000

Verify visually:
- The "See What Gets Created Here" section shows six cards drifting right-to-left.
- All six cards have identical height; widths vary (Juliette's portrait card is narrowest, NYT landscape cards are widest).
- Each card has the gold uppercase set name on line 1 and the lowercase byline on line 2.
- Section edges fade to the page background — no hard edge where cards enter/exit.
- Hovering any card pauses the marquee, raises that card slightly, and dims its neighbors.
- In macOS System Settings → Accessibility → Display → Reduce Motion (toggle ON, refresh the page): the marquee stops moving and you can scroll the row horizontally with trackpad/mouse wheel.

Stop the dev server with Ctrl+C when done.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: add drift keyframe, edge-fade mask, and reduced-motion fallback"
```

---

## Task 5: Wire CreationsMarquee into the homepage and delete the old slider

**Files:**
- Modify: `app/page.tsx:3,15`
- Delete: `components/marketing/example-content-slider.tsx`

- [ ] **Step 1: Swap the import and the JSX in `app/page.tsx`**

In `app/page.tsx`:

Replace line 3:
```ts
import { ExampleContentSlider } from '@/components/marketing/example-content-slider'
```
with:
```ts
import { CreationsMarquee } from '@/components/marketing/creations-marquee'
```

Replace line 15:
```tsx
      <ExampleContentSlider />
```
with:
```tsx
      <CreationsMarquee />
```

- [ ] **Step 2: Delete the old component file**

Run: `rm components/marketing/example-content-slider.tsx`
Expected: command succeeds, no output.

- [ ] **Step 3: Verify the build compiles cleanly**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors and no missing-import warnings related to the removed file.

- [ ] **Step 4: Re-run the test suite to confirm nothing else broke**

Run: `npm test`
Expected: all suites PASS (including pre-existing `booking-context` and `pricing` tests plus the 8 new marquee tests).

- [ ] **Step 5: Final smoke test in the browser**

Run: `npm run dev`
Open: http://localhost:3000

Scroll to the "See What Gets Created Here" section and confirm the experience matches Task 4 Step 3.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx components/marketing/example-content-slider.tsx
git commit -m "feat: replace ExampleContentSlider with CreationsMarquee on homepage"
```

---

## Self-Review (run by author before handoff)

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Editorial polaroid pattern (chrome + mat + caption strip) | Task 3 Step 3 (`CreationCard`) |
| Variable-width same-height cards | Task 3 (`inline-flex flex-col` + fixed image height) |
| Two-line caption: gold set name + faint byline | Task 3 (`figcaption`) |
| Slow drift ~60s, infinite, right-to-left | Task 4 (`@keyframes drift` + `.animate-drift`) |
| Edge-fade mask | Task 4 (`.creations-mask`) |
| Pause on hover + neighbor dim + raise hovered | Task 4 (`.creations-track:hover` rules) |
| Reduced-motion fallback | Task 4 (`@media prefers-reduced-motion: reduce`) |
| Six images, native filenames, in `public/creations/` | Task 1 + Task 2 |
| Metadata mapping (set + byline per file) | Task 2 (`creations-data.ts`) |
| Descriptive alt text | Task 2 (alt fields) |
| `next/image` with sizes + priority on first 2–3 cards | Task 3 (`priority={half === 'primary' && i < 2}`) |
| Replace existing slider on homepage; delete old file | Task 5 |
| Keep section heading "See What Gets Created Here" | Task 3 Step 3 |
| Remove manual nav buttons + "Drag to explore" strip | Task 5 deletes the file that contained them |

All requirements covered.

**Placeholder scan:** No TBDs, no "implement later", no "similar to Task N". Every code block is complete and pasteable.

**Type consistency:** `Creation` defined in `creations-data.ts` Task 2 is imported and used by name in `creations-marquee.tsx` Task 3. Property names (`src`, `alt`, `aspect`, `set`, `byline`) match across data, component, and tests. The `data-marquee-half` attribute values (`'primary'`, `'clone'`) match between component (Task 3) and tests (Task 3).
