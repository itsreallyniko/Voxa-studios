# Voxa Studios Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Voxa Studios landing page and 7-step showroom booking wizard as a Next.js app, matching the "Cinematic Obsidian" design system, with placeholder integrations for Stripe and Cal.com.

**Architecture:** Single Next.js App-Router project at the repo root. Landing page at `/`, single-page wizard at `/book` (no internal route changes — step state in React Context + URL hash + sessionStorage). Content is bundled static TypeScript. Stripe and Cal.com are stubs.

**Tech Stack:** Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion (step transitions only), Vitest + React Testing Library (for pricing + booking-state logic).

**Spec:** `docs/superpowers/specs/2026-06-04-voxa-showroom-booking-design.md`

---

## File Structure

```
voxa-website/
├── app/
│   ├── layout.tsx              # Global shell + nav + fonts
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Tailwind directives + tokens
│   └── book/
│       └── page.tsx            # Wizard shell
├── components/
│   ├── nav.tsx
│   ├── marketing/
│   │   ├── hero.tsx
│   │   ├── collections-preview.tsx
│   │   ├── example-content-slider.tsx
│   │   ├── why-voxa.tsx
│   │   ├── social-proof.tsx
│   │   ├── studio-tour-cta.tsx
│   │   ├── final-cta.tsx
│   │   └── footer.tsx
│   ├── book/
│   │   ├── step-rail.tsx
│   │   ├── booking-summary.tsx
│   │   ├── step-frame.tsx
│   │   ├── wizard-nav-buttons.tsx
│   │   └── steps/
│   │       ├── collection-step.tsx
│   │       ├── set-step.tsx
│   │       ├── addons-step.tsx
│   │       ├── details-step.tsx
│   │       ├── length-step.tsx
│   │       ├── schedule-step.tsx
│   │       └── checkout-step.tsx
│   └── ui/
│       ├── button.tsx
│       ├── tag.tsx
│       ├── input.tsx
│       └── checkbox-toggle.tsx
├── lib/
│   ├── booking-context.tsx     # React Context + sessionStorage + hash sync
│   ├── pricing.ts              # Pure pricing math
│   ├── steps.ts                # Step keys, order, completion rules
│   └── content/
│       ├── collections.ts
│       └── addons.ts
├── tests/
│   ├── pricing.test.ts
│   └── booking-context.test.tsx
├── public/                     # Optional local images (later)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
└── vitest.config.ts
```

**Testing strategy:** TDD for pure logic (pricing, step completion, context state transitions). For UI, build and verify in the dev server — no component snapshot tests.

---

## Phase 1: Project Foundation

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `next-env.d.ts`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Create: `.gitignore`

- [ ] **Step 1: Initialize Next.js with the recommended defaults**

Run from `/Users/nikotorres/Voxa_website/`:

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir false --import-alias "@/*" --eslint --no-turbopack
```

Answer prompts:
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **No**
- App Router: **Yes**
- Customize default import alias: **Yes** → `@/*`

If the script complains about non-empty directory, accept overwrite (existing `DESIGN.md`, `code.html`, `screen.png`, `docs/` are not overwritten because they don't conflict with Next.js files).

- [ ] **Step 2: Verify project structure**

Run:
```bash
ls -la
```

Expected files present: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `app/`, `node_modules/`, `.gitignore`. Existing `DESIGN.md`, `code.html`, `screen.png`, `docs/` still present.

- [ ] **Step 3: Verify dev server runs**

Run:
```bash
npm run dev
```

Open http://localhost:3000 — should show the Next.js welcome page. Kill the server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + TypeScript + Tailwind project"
```

---

### Task 2: Wire up "Cinematic Obsidian" design tokens

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts**

Write `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0D0D0D',
        ivory: '#F5F0E8',
        'heritage-gold': '#C9A96E',
        'slate-gray': '#333333',
        'muted-text': '#888888',
        surface: '#121414',
        'surface-dim': '#121414',
        'surface-bright': '#383939',
        'surface-container-lowest': '#0d0e0f',
        'surface-container-low': '#1b1c1c',
        'surface-container': '#1f2020',
        'surface-container-high': '#292a2a',
        'surface-container-highest': '#343535',
        'surface-variant': '#343535',
        outline: '#8e9192',
        'outline-variant': '#444748',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '9999px',
      },
      spacing: {
        'container-max': '1440px',
        'margin-edge': '64px',
        gutter: '40px',
        'section-gap': '120px',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['72px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-lg-mobile': ['40px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '400' }],
        'headline-xl': ['48px', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '400' }],
        'headline-md': ['32px', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'label-caps': ['12px', { lineHeight: '1.0', letterSpacing: '0.4em', fontWeight: '500' }],
        metadata: ['10px', { lineHeight: '1.2', letterSpacing: '0.1em', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Replace app/globals.css**

Write `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

html, body {
  background-color: #0D0D0D;
  color: #F5F0E8;
  overflow-x: hidden;
}

body {
  font-family: var(--font-dm-sans), system-ui, sans-serif;
}

::selection {
  background: #C9A96E;
  color: #0D0D0D;
}

.text-balance { text-wrap: balance; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.liquid-glass {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

.frosted-glass {
  background: rgba(245, 240, 232, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes scroll-progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
.animate-scroll-progress {
  animation: scroll-progress 3s infinite ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: wire Cinematic Obsidian design tokens into Tailwind"
```

---

### Task 3: Add DM Sans font + Material Symbols + base layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace app/layout.tsx**

Write `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Voxa Studios — Luxury Creative Showroom',
  description: 'Record podcasts, VSLs, and content in professionally designed studio environments.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} dark`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@200,0..1&display=swap"
        />
      </head>
      <body className="bg-obsidian text-ivory antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Add icon helper CSS in globals**

Append to `app/globals.css`:

```css
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24;
  font-family: 'Material Symbols Outlined', sans-serif;
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
}
```

- [ ] **Step 3: Replace app/page.tsx with a placeholder**

Write `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <span className="font-label-caps text-label-caps text-heritage-gold mb-4 block tracking-[0.4em]">
          VOXA STUDIOS
        </span>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white">
          Coming online
        </h1>
      </div>
    </main>
  )
}
```

Wait — `font-display-lg` isn't a class Tailwind generates from `fontSize`. The fontSize tokens generate `text-display-lg` only. Replace with:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <span className="text-label-caps text-heritage-gold mb-4 block tracking-[0.4em]">
          VOXA STUDIOS
        </span>
        <h1 className="text-display-lg-mobile md:text-display-lg text-white">
          Coming online
        </h1>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify in browser**

Run:
```bash
npm run dev
```

Open http://localhost:3000. Expect:
- Background: deep black (#0D0D0D)
- Heritage Gold label "VOXA STUDIOS" with wide letterspacing
- Large white headline "Coming online" in DM Sans

Kill server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/page.tsx app/globals.css
git commit -m "feat: add DM Sans, Material Symbols, base layout"
```

---

## Phase 2: Logic & Data (TDD)

### Task 4: Install Vitest + React Testing Library

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/node
```

- [ ] **Step 2: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

- [ ] **Step 3: Create tests/setup.ts**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Add test script to package.json**

In `package.json`, add to `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts tests/setup.ts
git commit -m "chore: install Vitest + React Testing Library"
```

---

### Task 5: Pricing function (TDD)

**Files:**
- Create: `tests/pricing.test.ts`
- Create: `lib/pricing.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/pricing.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getTotal, BASE_PRICE_USD, BASE_MINUTES, EXTRA_HOUR_PRICE } from '@/lib/pricing'

const addons = [
  { id: 'teleprompter', name: 'Teleprompter', description: '', price: 150, image: '' },
  { id: 'clip-repurposing', name: 'Clip Repurposing', description: '', price: 500, image: '' },
  { id: 'extra-camera', name: 'Additional Camera Angle', description: '', price: 250, image: '' },
  { id: 'producer', name: 'Producer Assistance', description: '', price: 400, image: '' },
]

describe('getTotal', () => {
  it('returns $300 base for 90 minutes with no add-ons', () => {
    const r = getTotal({ durationMinutes: 90, addonIds: [] }, addons)
    expect(r.base).toBe(300)
    expect(r.extraHours).toBe(0)
    expect(r.extraTimePrice).toBe(0)
    expect(r.addonTotal).toBe(0)
    expect(r.total).toBe(300)
  })

  it('adds $100 per extra hour above 90 min', () => {
    const r = getTotal({ durationMinutes: 150, addonIds: [] }, addons)
    expect(r.extraHours).toBe(1)
    expect(r.extraTimePrice).toBe(100)
    expect(r.total).toBe(400)
  })

  it('handles multiple extra hours', () => {
    const r = getTotal({ durationMinutes: 330, addonIds: [] }, addons)
    expect(r.extraHours).toBe(4)
    expect(r.extraTimePrice).toBe(400)
    expect(r.total).toBe(700)
  })

  it('adds add-on prices', () => {
    const r = getTotal({ durationMinutes: 90, addonIds: ['teleprompter', 'extra-camera'] }, addons)
    expect(r.addonTotal).toBe(400)
    expect(r.total).toBe(700)
  })

  it('combines extra time + add-ons', () => {
    const r = getTotal({ durationMinutes: 210, addonIds: ['producer'] }, addons)
    expect(r.extraHours).toBe(2)
    expect(r.extraTimePrice).toBe(200)
    expect(r.addonTotal).toBe(400)
    expect(r.total).toBe(900)
  })

  it('ignores unknown add-on ids', () => {
    const r = getTotal({ durationMinutes: 90, addonIds: ['fake-id'] }, addons)
    expect(r.addonTotal).toBe(0)
    expect(r.total).toBe(300)
  })

  it('treats durations below base as the base', () => {
    const r = getTotal({ durationMinutes: 30, addonIds: [] }, addons)
    expect(r.extraHours).toBe(0)
    expect(r.total).toBe(300)
  })

  it('exposes constants', () => {
    expect(BASE_PRICE_USD).toBe(300)
    expect(BASE_MINUTES).toBe(90)
    expect(EXTRA_HOUR_PRICE).toBe(100)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/pricing.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/pricing'`.

- [ ] **Step 3: Implement lib/pricing.ts**

Create `lib/pricing.ts`:

```ts
export const BASE_PRICE_USD = 300
export const BASE_MINUTES = 90
export const EXTRA_HOUR_PRICE = 100

export type Addon = {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export type PricingInput = {
  durationMinutes: number
  addonIds: string[]
}

export type PricingResult = {
  base: number
  extraHours: number
  extraTimePrice: number
  addonTotal: number
  total: number
}

export function getTotal(input: PricingInput, addons: Addon[]): PricingResult {
  const extraHours = Math.max(0, Math.floor((input.durationMinutes - BASE_MINUTES) / 60))
  const extraTimePrice = extraHours * EXTRA_HOUR_PRICE
  const addonTotal = input.addonIds
    .map((id) => addons.find((a) => a.id === id)?.price ?? 0)
    .reduce((a, b) => a + b, 0)
  return {
    base: BASE_PRICE_USD,
    extraHours,
    extraTimePrice,
    addonTotal,
    total: BASE_PRICE_USD + extraTimePrice + addonTotal,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/pricing.test.ts
```

Expected: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/pricing.ts tests/pricing.test.ts
git commit -m "feat: pricing function (90min base $300, +$100/hr, add-ons)"
```

---

### Task 6: Collections + Add-ons content files

**Files:**
- Create: `lib/content/collections.ts`
- Create: `lib/content/addons.ts`

- [ ] **Step 1: Create lib/content/collections.ts**

```ts
export type StudioSet = {
  id: string
  name: string
  description: string
  bestFor: string[]
  equipment: string[]
  capacity: { seats: number; label: string }
  heroImage: string
  gallery: string[]
  exampleContent: { thumb: string; label: string }[]
}

export type Collection = {
  id: 'executive' | 'horizon'
  name: string
  tagline: string
  audience: string[]
  visualTraits: string[]
  heroImage: string
  sets: StudioSet[]
}

// TODO: Replace these Google Stitch image URLs with real studio photos.
const EXEC_HERO = 'https://lh3.googleusercontent.com/aida/ADBb0uguU3aRNlIrIJ_xaLArr_tn0lICCAVvMdGJOqOFBvjLZoxCy5TE2mbBQlSc0jW7wkfWsrEvIuvyBGNzR83SYcflOe_0yZWu3cwd0MGh46fzNBco3iVIC7WEULB32bWF7Lr2H-8goZ4MpxTM64kJ0CdQNu5Bduojo9XdT6qnE7RNhKVT6-Td93dLUrIifsoQGhJNWjo174qsii9uRQkgzoD2ytr_wo4dfTcL_u2oYwod9ym8MKH8yHpOmN-6'
const EXEC_PODCAST = 'https://lh3.googleusercontent.com/aida/ADBb0ujLcrq63oSH9hG1W7Q80njg9KkTskwoS9XdZeNWyv_fl-TzzKJ9oNFquAxxNau5UOwo-dptHSCqX7mV6hLX5KSzYf1SrReRal2CxzPwHXUwVV2_NoFGG9Vf69fX5bRmtASsMRO66wCycTpT_nJlHm6CMf2mHUT8ajt6rvbRdtR8fali7VgKCD8OysURWNv12nsvNbTZ3PE1R8ipFOSBkCqxASsAVuMnCfGxy5s5TViftfox3hazK6CaUMoX'
const HORIZON_HERO = 'https://lh3.googleusercontent.com/aida/ADBb0ujOG5lOECLnhvFgTXRviMraX_PmwQ-wbztKdNrbLdhexTRjSvDVJ0GSNReX3GGiQkyKZTsDy6XofPCpnqTdrCrddPnSy1L-nlwXlHg2ioy91AWyRB_3pOYnT-JL8QRTV3UbRB4nyv4MweKnKrqqHMDpFDtxiU4vs_eWckBWuvpt9rW49nZOy2FDYKDzjGMMwXa5kf8TXb5l2dCJSSsEo1gPJXjcrk1yd-eaKX9bZRKVB4bxvV5JylTyHigb'
const HORIZON_CLIP = 'https://lh3.googleusercontent.com/aida/ADBb0ujkabd-Yg9HDPoXBdp7TCrj8S4AhRxU8pPjoC8xTNSwxfd7Fhpe_Ou_YT8G5HBPPTjwu7IIuuBBXHMj2ozpsqu42ivCQegGcn0p9CC7-JpnxzYE3ru4FFAGYuCy6JT8i4XE1wxMCRLi2hCrQydr7TpIAGOXh7xcrxh83TKruaZTjBMtzd8PYg9GXS12MbXcjmub6R9eF65to1FipzfGzj1E4wIDA3lZ9FI_IykSBzeiiLUrhIoWGNY8mnmk'
const VSL_CLIP = 'https://lh3.googleusercontent.com/aida/ADBb0ujh_-_KPb1gaBBupVqxJHlALCSqJQW_AJ__fgrBP1mcuvk9RDeXMfk9dxVjjJPwzaJaEMB0Xt40PZEHrasLoEddE8M_QUNwgidJghMh7c6HMgZRxlQ3HueIxCfyVgoLPlUHTRVQmOrxQjVbw8PRPYAFK4d9kQ42FUFsMgTUjsvkfv8DhSyGDZGdFo4jAyUmrnb08caYjQQQ44ogzJfmUe5TfwBgBT3xcdiFWrZwm8mNJJw6lhTHQ7mV5vf5'

export const collections: Collection[] = [
  {
    id: 'executive',
    name: 'Executive Collection',
    tagline: 'Dark, cinematic, authority-focused environments.',
    audience: ['Founders', 'Consultants', 'Financial advisors', 'Attorneys', 'Coaches', 'Business owners'],
    visualTraits: [
      'Dark charcoal backgrounds',
      'Warm practical lighting',
      'Leather accents',
      'Black bookshelves',
      'Executive office aesthetic',
    ],
    heroImage: EXEC_HERO,
    sets: [
      {
        id: 'executive-podcast',
        name: 'Executive Podcast Set',
        description:
          'A cinematic two-seat conversation set built for long-form interviews. Warm practical lighting, leather chairs, and a deep obsidian backdrop frame your guest with intentionality.',
        bestFor: ['Long-form interviews', 'Founder conversations', 'Business podcasts'],
        equipment: ['Four-camera coverage (4K)', 'Shure SM7B mics', 'Cinema lighting kit', 'Acoustic-treated room'],
        capacity: { seats: 2, label: 'Host + 1 guest' },
        heroImage: EXEC_PODCAST,
        gallery: [EXEC_PODCAST, EXEC_HERO, EXEC_PODCAST, EXEC_HERO],
        exampleContent: [
          { thumb: HORIZON_CLIP, label: 'High-stakes business dialogue' },
          { thumb: EXEC_HERO, label: 'Founder interviews' },
        ],
      },
      {
        id: 'authority-desk',
        name: 'Authority Desk Set',
        description:
          'A solo authority desk styled like a private office. Designed for direct-to-camera delivery — keynote talks, market commentary, expert breakdowns.',
        bestFor: ['VSLs', 'Expert commentary', 'Direct-to-camera talks'],
        equipment: ['Three-camera coverage', 'Lavalier + boom audio', 'Teleprompter-ready', 'Editorial lighting'],
        capacity: { seats: 1, label: 'Solo presenter' },
        heroImage: EXEC_HERO,
        gallery: [EXEC_HERO, EXEC_PODCAST, EXEC_HERO, EXEC_PODCAST],
        exampleContent: [
          { thumb: VSL_CLIP, label: 'Modern VSL' },
          { thumb: EXEC_HERO, label: 'Authority shorts' },
        ],
      },
      {
        id: 'authority-creator',
        name: 'Authority Creator Set',
        description:
          'A versatile creator environment with the executive aesthetic — built for short-form, vertical, and horizontal output in the same session.',
        bestFor: ['Short-form clips', 'LinkedIn videos', 'Vertical + horizontal output'],
        equipment: ['Vertical + horizontal cameras', 'Studio lighting', 'On-set monitor', 'Acoustic treatment'],
        capacity: { seats: 1, label: 'Solo creator' },
        heroImage: EXEC_PODCAST,
        gallery: [EXEC_PODCAST, EXEC_HERO, EXEC_PODCAST, EXEC_HERO],
        exampleContent: [
          { thumb: EXEC_HERO, label: 'Authority shorts' },
          { thumb: HORIZON_CLIP, label: 'LinkedIn clips' },
        ],
      },
    ],
  },
  {
    id: 'horizon',
    name: 'Horizon Collection',
    tagline: 'Bright, modern, approachable environments.',
    audience: ['Wellness brands', 'Creators', 'Educators', 'Lifestyle businesses', 'Coaches'],
    visualTraits: [
      'Bright atmosphere',
      'Natural textures',
      'Clean modern design',
      'Lifestyle aesthetic',
    ],
    heroImage: HORIZON_HERO,
    sets: [
      {
        id: 'horizon-podcast',
        name: 'Horizon Podcast Set',
        description:
          'A bright two-seat conversation set with natural textures and warm wood accents — designed to feel welcoming and conversational.',
        bestFor: ['Wellness podcasts', 'Lifestyle interviews', 'Educational conversations'],
        equipment: ['Four-camera coverage (4K)', 'Shure SM7B mics', 'Soft daylight lighting', 'Acoustic treatment'],
        capacity: { seats: 2, label: 'Host + 1 guest' },
        heroImage: HORIZON_HERO,
        gallery: [HORIZON_HERO, HORIZON_CLIP, HORIZON_HERO, HORIZON_CLIP],
        exampleContent: [
          { thumb: HORIZON_CLIP, label: 'Wellness shorts' },
          { thumb: HORIZON_HERO, label: 'Lifestyle interviews' },
        ],
      },
      {
        id: 'horizon-desk',
        name: 'Horizon Desk Set',
        description:
          'A bright solo desk with a modern wellness aesthetic. Built for teaching, course content, and lifestyle direct-to-camera delivery.',
        bestFor: ['Online courses', 'Wellness content', 'Educational direct-to-camera'],
        equipment: ['Three-camera coverage', 'Lavalier audio', 'Teleprompter-ready', 'Soft natural lighting'],
        capacity: { seats: 1, label: 'Solo presenter' },
        heroImage: HORIZON_HERO,
        gallery: [HORIZON_HERO, HORIZON_CLIP, HORIZON_HERO, HORIZON_CLIP],
        exampleContent: [
          { thumb: HORIZON_HERO, label: 'Course modules' },
          { thumb: HORIZON_CLIP, label: 'Wellness shorts' },
        ],
      },
      {
        id: 'horizon-creator',
        name: 'Horizon Creator Set',
        description:
          'A creator-friendly bright set with vertical and horizontal capture. Built for high-volume short-form content with a modern wellness feel.',
        bestFor: ['Lifestyle shorts', 'Wellness reels', 'Educational clips'],
        equipment: ['Vertical + horizontal cameras', 'Soft studio lighting', 'On-set monitor', 'Acoustic treatment'],
        capacity: { seats: 1, label: 'Solo creator' },
        heroImage: HORIZON_CLIP,
        gallery: [HORIZON_CLIP, HORIZON_HERO, HORIZON_CLIP, HORIZON_HERO],
        exampleContent: [
          { thumb: HORIZON_CLIP, label: 'Wellness reels' },
          { thumb: HORIZON_HERO, label: 'Lifestyle shorts' },
        ],
      },
    ],
  },
]

export function findCollection(id: string | null): Collection | undefined {
  return collections.find((c) => c.id === id)
}

export function findSet(collectionId: string | null, setId: string | null): StudioSet | undefined {
  if (!collectionId || !setId) return undefined
  return findCollection(collectionId)?.sets.find((s) => s.id === setId)
}
```

- [ ] **Step 2: Create lib/content/addons.ts**

```ts
import type { Addon } from '@/lib/pricing'

export const addons: Addon[] = [
  {
    id: 'teleprompter',
    name: 'Teleprompter',
    description: 'Pre-loaded scripts on a beam-splitter teleprompter for seamless eye-line delivery.',
    price: 150,
    image:
      'https://lh3.googleusercontent.com/aida/ADBb0ujh_-_KPb1gaBBupVqxJHlALCSqJQW_AJ__fgrBP1mcuvk9RDeXMfk9dxVjjJPwzaJaEMB0Xt40PZEHrasLoEddE8M_QUNwgidJghMh7c6HMgZRxlQ3HueIxCfyVgoLPlUHTRVQmOrxQjVbw8PRPYAFK4d9kQ42FUFsMgTUjsvkfv8DhSyGDZGdFo4jAyUmrnb08caYjQQQ44ogzJfmUe5TfwBgBT3xcdiFWrZwm8mNJJw6lhTHQ7mV5vf5',
  },
  {
    id: 'clip-repurposing',
    name: 'Clip Repurposing',
    description:
      'We cut your session into 8–12 short-form clips, formatted vertical and horizontal, ready to post across platforms.',
    price: 500,
    image:
      'https://lh3.googleusercontent.com/aida/ADBb0ujkabd-Yg9HDPoXBdp7TCrj8S4AhRxU8pPjoC8xTNSwxfd7Fhpe_Ou_YT8G5HBPPTjwu7IIuuBBXHMj2ozpsqu42ivCQegGcn0p9CC7-JpnxzYE3ru4FFAGYuCy6JT8i4XE1wxMCRLi2hCrQydr7TpIAGOXh7xcrxh83TKruaZTjBMtzd8PYg9GXS12MbXcjmub6R9eF65to1FipzfGzj1E4wIDA3lZ9FI_IykSBzeiiLUrhIoWGNY8mnmk',
  },
  {
    id: 'extra-camera',
    name: 'Additional Camera Angle',
    description: 'A fourth camera angle for cinematic B-roll, reverse shots, and more dynamic edits.',
    price: 250,
    image:
      'https://lh3.googleusercontent.com/aida/ADBb0uguU3aRNlIrIJ_xaLArr_tn0lICCAVvMdGJOqOFBvjLZoxCy5TE2mbBQlSc0jW7wkfWsrEvIuvyBGNzR83SYcflOe_0yZWu3cwd0MGh46fzNBco3iVIC7WEULB32bWF7Lr2H-8goZ4MpxTM64kJ0CdQNu5Bduojo9XdT6qnE7RNhKVT6-Td93dLUrIifsoQGhJNWjo174qsii9uRQkgzoD2ytr_wo4dfTcL_u2oYwod9ym8MKH8yHpOmN-6',
  },
  {
    id: 'producer',
    name: 'Producer Assistance',
    description:
      'A dedicated producer joins your session for direction, pacing, on-the-fly script work, and live coaching.',
    price: 400,
    image:
      'https://lh3.googleusercontent.com/aida/ADBb0ujOG5lOECLnhvFgTXRviMraX_PmwQ-wbztKdNrbLdhexTRjSvDVJ0GSNReX3GGiQkyKZTsDy6XofPCpnqTdrCrddPnSy1L-nlwXlHg2ioy91AWyRB_3pOYnT-JL8QRTV3UbRB4nyv4MweKnKrqqHMDpFDtxiU4vs_eWckBWuvpt9rW49nZOy2FDYKDzjGMMwXa5kf8TXb5l2dCJSSsEo1gPJXjcrk1yd-eaKX9bZRKVB4bxvV5JylTyHigb',
  },
]
```

- [ ] **Step 3: Commit**

```bash
git add lib/content/
git commit -m "feat: collections + add-ons content with placeholder imagery"
```

---

### Task 7: Step ordering + completion rules

**Files:**
- Create: `lib/steps.ts`
- Modify: `tests/booking-context.test.tsx` (created in Task 8)

- [ ] **Step 1: Create lib/steps.ts**

```ts
export type StepKey =
  | 'collection'
  | 'set'
  | 'addons'
  | 'details'
  | 'length'
  | 'schedule'
  | 'checkout'

export const STEPS: { key: StepKey; number: string; label: string }[] = [
  { key: 'collection', number: '01', label: 'Collection' },
  { key: 'set', number: '02', label: 'Set' },
  { key: 'addons', number: '03', label: 'Add-Ons' },
  { key: 'details', number: '04', label: 'Details' },
  { key: 'length', number: '05', label: 'Length' },
  { key: 'schedule', number: '06', label: 'Schedule' },
  { key: 'checkout', number: '07', label: 'Checkout' },
]

export type Booking = {
  collectionId: 'executive' | 'horizon' | null
  setId: string | null
  addonIds: string[]
  details: {
    recordingType: string
    guests: string
    socials: string
    notes: string
  }
  durationMinutes: number
  schedule: { date: string | null; time: string | null }
}

export const initialBooking: Booking = {
  collectionId: null,
  setId: null,
  addonIds: [],
  details: { recordingType: '', guests: '', socials: '', notes: '' },
  durationMinutes: 90,
  schedule: { date: null, time: null },
}

export function isStepComplete(step: StepKey, b: Booking): boolean {
  switch (step) {
    case 'collection': return b.collectionId !== null
    case 'set': return b.setId !== null
    case 'addons': return b.collectionId !== null && b.setId !== null // becomes available after set
    case 'details': return b.details.recordingType.trim().length > 0
    case 'length': return b.durationMinutes >= 90
    case 'schedule': return b.schedule.date !== null && b.schedule.time !== null
    case 'checkout': return false // payment not implemented
  }
}

export function nextStep(current: StepKey): StepKey | null {
  const idx = STEPS.findIndex((s) => s.key === current)
  if (idx === -1 || idx === STEPS.length - 1) return null
  return STEPS[idx + 1].key
}

export function prevStep(current: StepKey): StepKey | null {
  const idx = STEPS.findIndex((s) => s.key === current)
  if (idx <= 0) return null
  return STEPS[idx - 1].key
}

// Earliest step that is not complete. Used to recover from sessionStorage rehydration.
export function firstIncompleteStep(b: Booking): StepKey {
  for (const s of STEPS) {
    if (!isStepComplete(s.key, b)) return s.key
  }
  return 'checkout'
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/steps.ts
git commit -m "feat: step ordering, booking shape, completion rules"
```

---

### Task 8: BookingContext with sessionStorage + hash sync (TDD)

**Files:**
- Create: `tests/booking-context.test.tsx`
- Create: `lib/booking-context.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/booking-context.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { BookingProvider, useBooking } from '@/lib/booking-context'

function wrapper({ children }: { children: React.ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>
}

describe('BookingProvider', () => {
  beforeEach(() => {
    sessionStorage.clear()
    window.location.hash = ''
  })

  it('starts on collection step with empty booking', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    expect(result.current.currentStep).toBe('collection')
    expect(result.current.booking.collectionId).toBe(null)
    expect(result.current.booking.durationMinutes).toBe(90)
  })

  it('updates booking via setBooking', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    act(() => {
      result.current.setBooking((b) => ({ ...b, collectionId: 'executive' }))
    })
    expect(result.current.booking.collectionId).toBe('executive')
  })

  it('goTo moves between steps', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    act(() => result.current.goTo('set'))
    expect(result.current.currentStep).toBe('set')
  })

  it('next advances if current step is complete', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    act(() => {
      result.current.setBooking((b) => ({ ...b, collectionId: 'executive' }))
    })
    act(() => result.current.next())
    expect(result.current.currentStep).toBe('set')
  })

  it('next is blocked if current step is incomplete', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    act(() => result.current.next())
    expect(result.current.currentStep).toBe('collection')
  })

  it('back moves to previous step', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    act(() => result.current.goTo('addons'))
    act(() => result.current.back())
    expect(result.current.currentStep).toBe('set')
  })

  it('persists booking to sessionStorage', () => {
    const { result } = renderHook(() => useBooking(), { wrapper })
    act(() => {
      result.current.setBooking((b) => ({ ...b, collectionId: 'horizon' }))
    })
    const stored = JSON.parse(sessionStorage.getItem('voxa-booking') || '{}')
    expect(stored.booking.collectionId).toBe('horizon')
  })

  it('rehydrates booking from sessionStorage on mount', () => {
    sessionStorage.setItem(
      'voxa-booking',
      JSON.stringify({
        booking: {
          collectionId: 'executive',
          setId: 'executive-podcast',
          addonIds: [],
          details: { recordingType: '', guests: '', socials: '', notes: '' },
          durationMinutes: 90,
          schedule: { date: null, time: null },
        },
        currentStep: 'addons',
      })
    )
    const { result } = renderHook(() => useBooking(), { wrapper })
    expect(result.current.booking.collectionId).toBe('executive')
    expect(result.current.currentStep).toBe('addons')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/booking-context.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement lib/booking-context.tsx**

```tsx
'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  Booking,
  initialBooking,
  isStepComplete,
  nextStep,
  prevStep,
  StepKey,
  firstIncompleteStep,
  STEPS,
} from './steps'
import { addons } from './content/addons'
import { getTotal, PricingResult } from './pricing'

type Ctx = {
  booking: Booking
  setBooking: (updater: (b: Booking) => Booking) => void
  currentStep: StepKey
  goTo: (s: StepKey) => void
  next: () => void
  back: () => void
  totals: PricingResult
  isComplete: (s: StepKey) => boolean
}

const BookingContext = createContext<Ctx | null>(null)

const STORAGE_KEY = 'voxa-booking'

function isStepKey(s: string): s is StepKey {
  return STEPS.some((step) => step.key === s)
}

function hydrate(): { booking: Booking; currentStep: StepKey } {
  if (typeof window === 'undefined') {
    return { booking: initialBooking, currentStep: 'collection' }
  }
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      const booking: Booking = { ...initialBooking, ...parsed.booking }
      let currentStep: StepKey = isStepKey(parsed.currentStep) ? parsed.currentStep : 'collection'
      // Validate the step is reachable
      const ordered = STEPS.map((s) => s.key)
      const idx = ordered.indexOf(currentStep)
      for (let i = 0; i < idx; i++) {
        if (!isStepComplete(ordered[i], booking)) {
          currentStep = firstIncompleteStep(booking)
          break
        }
      }
      return { booking, currentStep }
    } catch {
      // fall through
    }
  }
  // Check URL hash
  const hash = window.location.hash.replace('#', '')
  const currentStep: StepKey = isStepKey(hash) ? hash : 'collection'
  return { booking: initialBooking, currentStep }
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const initial = useMemo(hydrate, [])
  const [booking, setBookingState] = useState<Booking>(initial.booking)
  const [currentStep, setCurrentStep] = useState<StepKey>(initial.currentStep)

  // Persist
  useEffect(() => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ booking, currentStep }))
  }, [booking, currentStep])

  // Reflect step into URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash.replace('#', '') !== currentStep) {
      history.replaceState(null, '', `#${currentStep}`)
    }
  }, [currentStep])

  const setBooking = useCallback((updater: (b: Booking) => Booking) => {
    setBookingState((prev) => updater(prev))
  }, [])

  const goTo = useCallback((s: StepKey) => setCurrentStep(s), [])

  const next = useCallback(() => {
    setCurrentStep((cur) => {
      if (!isStepComplete(cur, booking)) return cur
      return nextStep(cur) ?? cur
    })
  }, [booking])

  const back = useCallback(() => {
    setCurrentStep((cur) => prevStep(cur) ?? cur)
  }, [])

  const totals = useMemo(
    () => getTotal({ durationMinutes: booking.durationMinutes, addonIds: booking.addonIds }, addons),
    [booking.durationMinutes, booking.addonIds]
  )

  const isComplete = useCallback((s: StepKey) => isStepComplete(s, booking), [booking])

  return (
    <BookingContext.Provider value={{ booking, setBooking, currentStep, goTo, next, back, totals, isComplete }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider')
  return ctx
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/booking-context.test.tsx
```

Expected: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/booking-context.tsx tests/booking-context.test.tsx
git commit -m "feat: BookingContext with sessionStorage + step navigation"
```

---

## Phase 3: UI Primitives

### Task 9: Button component

**Files:**
- Create: `components/ui/button.tsx`

- [ ] **Step 1: Write components/ui/button.tsx**

```tsx
import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const baseClass =
  'inline-flex items-center justify-center text-label-caps font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed'

const sizeClass: Record<Size, string> = {
  sm: 'px-6 py-3',
  md: 'px-8 py-4',
  lg: 'px-12 py-6',
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-ivory text-obsidian hover:bg-white shadow-2xl',
  secondary: 'border border-white/10 text-white hover:bg-white/5 frosted-glass',
  ghost: 'border border-white/10 text-white hover:border-heritage-gold hover:text-heritage-gold',
  gold: 'bg-heritage-gold text-obsidian hover:bg-[#d4b478]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`${baseClass} ${sizeClass[size]} ${variantClass[variant]} ${className}`}
      {...rest}
    />
  )
})
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/button.tsx
git commit -m "feat: Button primitive (primary/secondary/ghost/gold)"
```

---

### Task 10: Tag, Input, CheckboxToggle primitives

**Files:**
- Create: `components/ui/tag.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/checkbox-toggle.tsx`

- [ ] **Step 1: Write components/ui/tag.tsx**

```tsx
import { HTMLAttributes } from 'react'

export function Tag({ className = '', ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex px-4 py-1.5 rounded-full border border-white/10 text-metadata text-ivory/60 ${className}`}
      {...rest}
    />
  )
}
```

- [ ] **Step 2: Write components/ui/input.tsx**

```tsx
import { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes } from 'react'

interface FieldProps {
  label: string
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement>, FieldProps {}
interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldProps {}

const baseField =
  'w-full bg-transparent border-0 border-b border-slate-gray text-ivory text-body-md py-3 outline-none transition-colors duration-200 focus:border-heritage-gold placeholder:text-ivory/30'

export const Input = forwardRef<HTMLInputElement, InputFieldProps>(function Input(
  { label, className = '', id, ...rest },
  ref
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={inputId} className="text-label-caps text-ivory/60">
        {label}
      </label>
      <input ref={ref} id={inputId} className={`${baseField} ${className}`} {...rest} />
    </div>
  )
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function Textarea(
  { label, className = '', id, ...rest },
  ref
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={inputId} className="text-label-caps text-ivory/60">
        {label}
      </label>
      <textarea ref={ref} id={inputId} rows={3} className={`${baseField} resize-none ${className}`} {...rest} />
    </div>
  )
})
```

- [ ] **Step 3: Write components/ui/checkbox-toggle.tsx**

```tsx
'use client'

interface CheckboxToggleProps {
  checked: boolean
  onChange: (next: boolean) => void
  children: React.ReactNode
  ariaLabel: string
}

export function CheckboxToggle({ checked, onChange, children, ariaLabel }: CheckboxToggleProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`text-left w-full transition-colors duration-200 border ${
        checked ? 'border-heritage-gold' : 'border-slate-gray hover:border-white/30'
      }`}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/tag.tsx components/ui/input.tsx components/ui/checkbox-toggle.tsx
git commit -m "feat: Tag, Input/Textarea, CheckboxToggle primitives"
```

---

## Phase 4: Landing Page (Marketing)

### Task 11: Navigation

**Files:**
- Create: `components/nav.tsx`

- [ ] **Step 1: Write components/nav.tsx**

```tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-obsidian/80 backdrop-blur-md h-16' : 'bg-transparent h-20'
      } flex items-center`}
    >
      <div className="max-w-container-max mx-auto w-full px-6 md:px-margin-edge flex items-center justify-between">
        <Link href="/" className="text-2xl text-white tracking-tight">
          VOXA
        </Link>
        <div className="hidden md:flex items-center gap-12">
          <Link href="/#sets" className="text-label-caps text-ivory/60 hover:text-white transition-colors">
            STUDIO SETS
          </Link>
          <Link href="/#why" className="text-label-caps text-ivory/60 hover:text-white transition-colors">
            EXPERIENCE
          </Link>
          <Link href="/book" className="text-label-caps text-heritage-gold hover:text-white transition-colors">
            BOOK A SESSION
          </Link>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/nav.tsx
git commit -m "feat: Nav component with scroll transition"
```

---

### Task 12: Marketing — Hero

**Files:**
- Create: `components/marketing/hero.tsx`

- [ ] **Step 1: Write components/marketing/hero.tsx**

```tsx
'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida/ADBb0uguU3aRNlIrIJ_xaLArr_tn0lICCAVvMdGJOqOFBvjLZoxCy5TE2mbBQlSc0jW7wkfWsrEvIuvyBGNzR83SYcflOe_0yZWu3cwd0MGh46fzNBco3iVIC7WEULB32bWF7Lr2H-8goZ4MpxTM64kJ0CdQNu5Bduojo9XdT6qnE7RNhKVT6-Td93dLUrIifsoQGhJNWjo174qsii9uRQkgzoD2ytr_wo4dfTcL_u2oYwod9ym8MKH8yHpOmN-6'

export function Hero() {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return
      imgRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="absolute inset-0 z-0">
        <img
          ref={imgRef}
          alt="Voxa studio environment"
          className="w-full h-full object-cover opacity-60"
          src={HERO_IMAGE}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-transparent to-obsidian/20" />
      </div>
      <div className="relative z-10 w-full max-w-container-max mx-auto px-6 md:px-margin-edge text-center flex flex-col items-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-label-caps text-heritage-gold mb-6 block tracking-[0.6em]">VOXA STUDIOS</span>
          <h1 className="text-display-lg-mobile md:text-display-lg leading-none text-white text-balance mb-12">
            Look Like The Expert You Already Are
          </h1>
          <p className="text-body-lg text-ivory/60 max-w-2xl text-balance mx-auto mb-24">
            Record podcasts, VSLs, and content in professionally designed studio environments. Every session includes
            an engineer and a streamlined process built to make content creation effortless.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/book">
              <Button variant="primary" size="lg">Explore Studio Sets</Button>
            </Link>
            <Button variant="secondary" size="lg">Book a Studio Tour</Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
        <span className="text-[10px] tracking-widest">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/marketing/hero.tsx
git commit -m "feat: Hero section with parallax + CTAs"
```

---

### Task 13: Marketing — Collections preview

**Files:**
- Create: `components/marketing/collections-preview.tsx`

- [ ] **Step 1: Write components/marketing/collections-preview.tsx**

```tsx
import Link from 'next/link'
import { Tag } from '@/components/ui/tag'
import { collections } from '@/lib/content/collections'

export function CollectionsPreview() {
  return (
    <section id="sets" className="py-section-gap bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-label-caps text-heritage-gold mb-4 block">COLLECTIONS</span>
            <h2 className="text-headline-xl text-white">
              Choose the Environment <br />
              That Fits Your Brand
            </h2>
          </div>
          <Link
            href="/book"
            className="text-label-caps text-heritage-gold flex items-center gap-2 group"
          >
            VIEW ALL SETS{' '}
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {collections.map((c) => (
            <Link
              key={c.id}
              href="/book"
              className="group relative overflow-hidden bg-surface-container-low block"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  alt={c.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  src={c.heroImage}
                />
              </div>
              <div className="p-12 liquid-glass border-t-0">
                <h3 className="text-headline-md text-white mb-6">{c.name}</h3>
                <div className="flex flex-wrap gap-3 mb-10">
                  {c.sets.map((s) => (
                    <Tag key={s.id}>{s.name.replace(c.name.split(' ')[0] + ' ', '').replace(' Set', '')}</Tag>
                  ))}
                </div>
                <div className="w-full py-5 border border-white/10 text-label-caps text-white text-center group-hover:bg-white group-hover:text-obsidian transition-all">
                  Explore Sets
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/marketing/collections-preview.tsx
git commit -m "feat: collections preview section"
```

---

### Task 14: Marketing — Example content slider

**Files:**
- Create: `components/marketing/example-content-slider.tsx`

- [ ] **Step 1: Write components/marketing/example-content-slider.tsx**

```tsx
'use client'

import { useRef } from 'react'

const SLIDES = [
  {
    image:
      'https://lh3.googleusercontent.com/aida/ADBb0ujkabd-Yg9HDPoXBdp7TCrj8S4AhRxU8pPjoC8xTNSwxfd7Fhpe_Ou_YT8G5HBPPTjwu7IIuuBBXHMj2ozpsqu42ivCQegGcn0p9CC7-JpnxzYE3ru4FFAGYuCy6JT8i4XE1wxMCRLi2hCrQydr7TpIAGOXh7xcrxh83TKruaZTjBMtzd8PYg9GXS12MbXcjmub6R9eF65to1FipzfGzj1E4wIDA3lZ9FI_IykSBzeiiLUrhIoWGNY8mnmk',
    category: 'PODCAST CLIPS',
    title: 'High-Stakes Business Dialogue',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida/ADBb0uguU3aRNlIrIJ_xaLArr_tn0lICCAVvMdGJOqOFBvjLZoxCy5TE2mbBQlSc0jW7wkfWsrEvIuvyBGNzR83SYcflOe_0yZWu3cwd0MGh46fzNBco3iVIC7WEULB32bWF7Lr2H-8goZ4MpxTM64kJ0CdQNu5Bduojo9XdT6qnE7RNhKVT6-Td93dLUrIifsoQGhJNWjo174qsii9uRQkgzoD2ytr_wo4dfTcL_u2oYwod9ym8MKH8yHpOmN-6',
    category: 'FOUNDER CONTENT',
    title: 'Authority Shorts',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida/ADBb0ujh_-_KPb1gaBBupVqxJHlALCSqJQW_AJ__fgrBP1mcuvk9RDeXMfk9dxVjjJPwzaJaEMB0Xt40PZEHrasLoEddE8M_QUNwgidJghMh7c6HMgZRxlQ3HueIxCfyVgoLPlUHTRVQmOrxQjVbw8PRPYAFK4d9kQ42FUFsMgTUjsvkfv8DhSyGDZGdFo4jAyUmrnb08caYjQQQ44ogzJfmUe5TfwBgBT3xcdiFWrZwm8mNJJw6lhTHQ7mV5vf5',
    category: 'MODERN VSL',
    title: 'Product Launches',
  },
]

export function ExampleContentSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }
  return (
    <section className="py-section-gap bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <div className="text-center mb-24">
          <h2 className="text-headline-xl text-white">See What Gets Created Here</h2>
        </div>
        <div className="relative group">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            {SLIDES.map((slide, i) => (
              <div key={i} className="flex-none w-[85vw] md:w-[600px] snap-center">
                <div className="aspect-video relative overflow-hidden rounded-xl group/card border border-white/5">
                  <img
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-70 group-hover/card:scale-105 transition-all duration-1000"
                    src={slide.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <span className="text-[10px] text-heritage-gold mb-2 tracking-[0.4em]">{slide.category}</span>
                    <h4 className="text-2xl text-white">{slide.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:flex justify-between items-center mt-12">
            <div className="flex gap-4">
              <button
                onClick={() => scroll('left')}
                className="liquid-glass w-14 h-14 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors border border-white/10"
                aria-label="Previous slide"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button
                onClick={() => scroll('right')}
                className="liquid-glass w-14 h-14 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors border border-white/10"
                aria-label="Next slide"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/30 tracking-widest uppercase">Drag to explore</span>
              <div className="w-24 h-px bg-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-heritage-gold w-1/3 animate-scroll-progress" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/marketing/example-content-slider.tsx
git commit -m "feat: example content slider with arrow controls"
```

---

### Task 15: Marketing — Why Voxa feature grid

**Files:**
- Create: `components/marketing/why-voxa.tsx`

- [ ] **Step 1: Write components/marketing/why-voxa.tsx**

```tsx
const FEATURES = [
  { icon: 'videocam', label: 'MULTI-CAMERA RECORDING', desc: 'Professional coverage without the setup.' },
  { icon: 'light_mode', label: 'PROFESSIONAL LIGHTING', desc: 'Optimized lighting designed to help you look your best on camera.' },
  { icon: 'mic', label: 'STUDIO AUDIO', desc: 'Broadcast quality sound treatment.' },
  { icon: 'notes', label: 'TELEPROMPTER', desc: 'Available on all sets for seamless delivery.' },
  { icon: 'auto_awesome', label: 'TURNKEY EXPERIENCE', desc: 'Show up, record, and leave with professionally captured content.' },
  { icon: 'bolt', label: 'MULTIPLE SET OPTIONS', desc: 'Choose the look that fits your brand.' },
  { icon: 'support_agent', label: 'PRODUCER SUPPORT', desc: 'On-site help with tech and direction.' },
]

export function WhyVoxa() {
  return (
    <section id="why" className="py-section-gap bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <div className="max-w-3xl mb-24">
          <span className="text-label-caps text-heritage-gold mb-4 block">THE EXPERIENCE</span>
          <h2 className="text-headline-xl text-white">Everything Is Already Ready</h2>
          <p className="text-body-lg text-ivory/60 mt-6">
            Forget the technical overhead. Our studios are engineered for immediate performance.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {FEATURES.map((f) => (
            <div key={f.label} className="p-10 bg-obsidian group hover:bg-white/[0.02] transition-colors">
              <span className="material-symbols-outlined text-heritage-gold text-3xl mb-6">{f.icon}</span>
              <h4 className="text-label-caps text-white mb-3">{f.label}</h4>
              <p className="text-sm text-ivory/40">{f.desc}</p>
            </div>
          ))}
          <div className="p-10 bg-obsidian group hover:bg-white/[0.02] transition-colors flex items-center justify-center">
            <a
              href="/book"
              className="text-[10px] text-heritage-gold border-b border-heritage-gold pb-1 hover:text-white hover:border-white transition-all tracking-[0.4em]"
            >
              VIEW ALL FEATURES
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/marketing/why-voxa.tsx
git commit -m "feat: Why Voxa feature grid"
```

---

### Task 16: Marketing — Social proof, Studio tour CTA, Final CTA, Footer

**Files:**
- Create: `components/marketing/social-proof.tsx`
- Create: `components/marketing/studio-tour-cta.tsx`
- Create: `components/marketing/final-cta.tsx`
- Create: `components/marketing/footer.tsx`

- [ ] **Step 1: Write components/marketing/social-proof.tsx**

```tsx
const TESTIMONIALS = [
  {
    name: 'DR. JULIAN VOSS',
    role: 'WELLNESS FOUNDER',
    quote:
      'The transition from my home office to Voxa changed how my audience perceives my brand. It\'s the highest production ROI I\'ve ever found.',
  },
  {
    name: 'SARAH CHENG',
    role: 'STRATEGY CONSULTANT',
    quote:
      'I batch an entire month of YouTube videos and LinkedIn shorts in one 4-hour block. The team here makes it effortless.',
  },
  {
    name: 'MARCUS REED',
    role: 'PODCAST HOST',
    quote:
      'Unmatched aesthetic. The Executive Set is exactly what I needed for my business interviews. Truly a luxury experience.',
  },
]

export function SocialProof() {
  return (
    <section className="py-section-gap bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <div className="text-center mb-24">
          <span className="text-label-caps text-heritage-gold mb-4 block">TRUSTED BY LEADERS</span>
          <h2 className="text-headline-xl text-white">
            Built For Professionals Creating <br /> Content Consistently
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="liquid-glass p-10 group hover:border-white/20 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-slate-gray" />
                <div>
                  <h5 className="text-label-caps text-white">{t.name}</h5>
                  <p className="text-[10px] text-heritage-gold tracking-[0.3em]">{t.role}</p>
                </div>
              </div>
              <p className="text-ivory/60 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Write components/marketing/studio-tour-cta.tsx**

```tsx
import { Button } from '@/components/ui/button'

const BG_IMAGE =
  'https://lh3.googleusercontent.com/aida/ADBb0ujOG5lOECLnhvFgTXRviMraX_PmwQ-wbztKdNrbLdhexTRjSvDVJ0GSNReX3GGiQkyKZTsDy6XofPCpnqTdrCrddPnSy1L-nlwXlHg2ioy91AWyRB_3pOYnT-JL8QRTV3UbRB4nyv4MweKnKrqqHMDpFDtxiU4vs_eWckBWuvpt9rW49nZOy2FDYKDzjGMMwXa5kf8TXb5l2dCJSSsEo1gPJXjcrk1yd-eaKX9bZRKVB4bxvV5JylTyHigb'

export function StudioTourCTA() {
  return (
    <section className="py-section-gap bg-surface-container-low relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img alt="" className="w-full h-full object-cover" src={BG_IMAGE} />
      </div>
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl">
          <h2 className="text-headline-xl text-white mb-6">Want To See The Studio First?</h2>
          <p className="text-body-lg text-ivory/60">
            Schedule a quick studio tour and see every set in person before booking. No pressure, just a walk-through
            of the possibilities.
          </p>
        </div>
        <Button variant="primary" size="lg" className="shrink-0">Book A Studio Tour</Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Write components/marketing/final-cta.tsx**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function FinalCTA() {
  return (
    <section className="py-[160px] bg-obsidian text-center border-t border-white/5">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <span className="text-label-caps text-heritage-gold mb-8 block tracking-[0.4em]">
          READY TO SCALE YOUR CONTENT?
        </span>
        <h2 className="text-display-lg-mobile md:text-headline-xl text-white mb-12">
          Find The Set That <br /> Matches Your Brand
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/book"><Button variant="primary" size="lg">Explore Studio Sets</Button></Link>
          <Button variant="secondary" size="lg">Book A Studio Tour</Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write components/marketing/footer.tsx**

```tsx
export function Footer() {
  return (
    <footer className="py-20 bg-obsidian border-t border-white/5">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <span className="text-2xl text-white">VOXA</span>
          <p className="text-ivory/30 text-xs tracking-widest">LUXURY CONTENT ENVIRONMENTS</p>
        </div>
        <div className="flex gap-12">
          <a href="#" className="text-label-caps text-ivory/40 hover:text-white transition-colors">INSTAGRAM</a>
          <a href="#" className="text-label-caps text-ivory/40 hover:text-white transition-colors">TWITTER</a>
          <a href="#" className="text-label-caps text-ivory/40 hover:text-white transition-colors">LINKEDIN</a>
        </div>
        <div className="text-[10px] text-ivory/20 tracking-[0.4em]">© 2026 VOXA STUDIOS. ALL RIGHTS RESERVED.</div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/marketing/social-proof.tsx components/marketing/studio-tour-cta.tsx components/marketing/final-cta.tsx components/marketing/footer.tsx
git commit -m "feat: social proof, studio tour CTA, final CTA, footer"
```

---

### Task 17: Compose landing page

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx` (add Nav)

- [ ] **Step 1: Update app/layout.tsx to include Nav**

```tsx
import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { Nav } from '@/components/nav'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Voxa Studios — Luxury Creative Showroom',
  description: 'Record podcasts, VSLs, and content in professionally designed studio environments.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} dark`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@200,0..1&display=swap"
        />
      </head>
      <body className="bg-obsidian text-ivory antialiased">
        <Nav />
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Replace app/page.tsx**

```tsx
import { Hero } from '@/components/marketing/hero'
import { CollectionsPreview } from '@/components/marketing/collections-preview'
import { ExampleContentSlider } from '@/components/marketing/example-content-slider'
import { WhyVoxa } from '@/components/marketing/why-voxa'
import { SocialProof } from '@/components/marketing/social-proof'
import { StudioTourCTA } from '@/components/marketing/studio-tour-cta'
import { FinalCTA } from '@/components/marketing/final-cta'
import { Footer } from '@/components/marketing/footer'

export default function Home() {
  return (
    <>
      <Hero />
      <CollectionsPreview />
      <ExampleContentSlider />
      <WhyVoxa />
      <SocialProof />
      <StudioTourCTA />
      <FinalCTA />
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Verify in browser**

Run:
```bash
npm run dev
```

Open http://localhost:3000. Expect the full landing page with:
- Hero with parallax bg + two CTAs
- Collections preview (Executive / Horizon cards)
- Example content slider with arrow controls
- Feature grid
- Three testimonials
- Studio tour CTA
- Final CTA
- Footer
- Nav fades from transparent to blurred on scroll

Test mobile: resize to ~375px width. All sections should reflow gracefully.

Kill server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: assemble landing page (/) with Nav + all marketing sections"
```

---

## Phase 5: Booking Wizard Shell

### Task 18: Install Framer Motion

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Framer Motion**

```bash
npm install framer-motion
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install Framer Motion for step transitions"
```

---

### Task 19: StepRail

**Files:**
- Create: `components/book/step-rail.tsx`

- [ ] **Step 1: Write components/book/step-rail.tsx**

```tsx
'use client'

import { STEPS, StepKey } from '@/lib/steps'
import { useBooking } from '@/lib/booking-context'

export function StepRail() {
  const { currentStep, goTo, isComplete } = useBooking()

  // A step is reachable if all prior steps are complete (or it's the current one)
  const reachable: Record<StepKey, boolean> = {} as never
  let blocked = false
  for (const s of STEPS) {
    reachable[s.key] = !blocked || s.key === currentStep
    if (!isComplete(s.key)) blocked = true
  }

  return (
    <div className="sticky top-20 z-30 bg-obsidian/95 backdrop-blur-md border-b border-slate-gray">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge py-6">
        {/* Mobile compact */}
        <div className="lg:hidden">
          {(() => {
            const cur = STEPS.find((s) => s.key === currentStep)!
            const idx = STEPS.findIndex((s) => s.key === currentStep)
            const pct = ((idx + 1) / STEPS.length) * 100
            return (
              <>
                <div className="flex items-baseline justify-between">
                  <span className="text-label-caps text-heritage-gold tabular-nums">
                    {cur.number} / 0{STEPS.length}
                  </span>
                  <span className="text-label-caps text-white">{cur.label}</span>
                </div>
                <div className="mt-3 h-px bg-white/10 relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-heritage-gold transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </>
            )
          })()}
        </div>

        {/* Desktop full rail */}
        <ol className="hidden lg:flex items-center justify-between gap-2">
          {STEPS.map((s, i) => {
            const isCurrent = s.key === currentStep
            const isDone = isComplete(s.key) && !isCurrent
            const canClick = reachable[s.key] && (isDone || isCurrent)
            return (
              <li
                key={s.key}
                aria-current={isCurrent ? 'step' : undefined}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <button
                  type="button"
                  disabled={!canClick}
                  onClick={() => goTo(s.key)}
                  className={`flex items-baseline gap-3 transition-colors duration-200 ${
                    isCurrent ? 'text-white' : isDone ? 'text-ivory/70 hover:text-white' : 'text-ivory/30 cursor-not-allowed'
                  }`}
                >
                  <span className={`text-metadata tabular-nums ${isCurrent ? 'text-heritage-gold' : ''}`}>
                    {s.number}
                  </span>
                  <span className="text-label-caps whitespace-nowrap">{s.label}</span>
                </button>
                {isCurrent && <span className="h-px w-6 bg-heritage-gold" />}
                {i < STEPS.length - 1 && <span className="h-px flex-1 bg-slate-gray min-w-4" />}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/book/step-rail.tsx
git commit -m "feat: step rail (desktop full + mobile compact)"
```

---

### Task 20: BookingSummary

**Files:**
- Create: `components/book/booking-summary.tsx`

- [ ] **Step 1: Write components/book/booking-summary.tsx**

```tsx
'use client'

import { useState } from 'react'
import { useBooking } from '@/lib/booking-context'
import { findCollection, findSet } from '@/lib/content/collections'
import { addons } from '@/lib/content/addons'

function formatDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function SummaryContent() {
  const { booking, totals } = useBooking()
  const collection = findCollection(booking.collectionId)
  const set = findSet(booking.collectionId, booking.setId)
  const selectedAddons = addons.filter((a) => booking.addonIds.includes(a.id))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-label-caps text-heritage-gold mb-3 block">YOUR SESSION</span>
        <h3 className="text-headline-md text-white">${totals.total.toLocaleString()}</h3>
        <p className="text-metadata text-ivory/40 mt-2">Tax calculated at checkout</p>
      </div>

      <div className="h-px bg-slate-gray" />

      <dl className="flex flex-col gap-4 text-body-md">
        <Line label="Collection" value={collection?.name ?? '—'} />
        <Line label="Set" value={set?.name ?? '—'} />
        <Line label="Length" value={formatDuration(booking.durationMinutes)} />
      </dl>

      {selectedAddons.length > 0 && (
        <>
          <div className="h-px bg-slate-gray" />
          <div>
            <span className="text-label-caps text-ivory/60 mb-4 block">ADD-ONS</span>
            <ul className="flex flex-col gap-3">
              {selectedAddons.map((a) => (
                <li key={a.id} className="flex justify-between text-body-md">
                  <span className="text-ivory/80">{a.name}</span>
                  <span className="text-ivory tabular-nums">+${a.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="h-px bg-slate-gray" />
      <dl className="flex flex-col gap-2 text-body-md">
        <Line label="Base (90 min)" value={`$${totals.base}`} />
        {totals.extraHours > 0 && <Line label={`Extra time (${totals.extraHours}h)`} value={`+$${totals.extraTimePrice}`} />}
        {totals.addonTotal > 0 && <Line label="Add-ons" value={`+$${totals.addonTotal}`} />}
      </dl>
      <div className="h-px bg-slate-gray" />
      <div className="flex justify-between items-baseline">
        <span className="text-label-caps text-white">TOTAL</span>
        <span className="text-headline-md text-white tabular-nums">${totals.total.toLocaleString()}</span>
      </div>
    </div>
  )
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ivory/60">{label}</dt>
      <dd className="text-ivory text-right">{value}</dd>
    </div>
  )
}

export function BookingSummaryPanel() {
  return (
    <aside className="hidden lg:block w-[360px] shrink-0 sticky top-32 self-start">
      <div className="liquid-glass p-8 rounded">
        <SummaryContent />
      </div>
    </aside>
  )
}

export function BookingSummaryBar() {
  const [open, setOpen] = useState(false)
  const { booking, totals } = useBooking()
  const selectedCount = booking.addonIds.length + (booking.setId ? 1 : 0) + (booking.collectionId ? 1 : 0)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-obsidian border-t border-slate-gray px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-baseline gap-3">
          <span className="text-headline-md text-white tabular-nums">${totals.total.toLocaleString()}</span>
          <span className="text-metadata text-ivory/40">{selectedCount} selected</span>
        </div>
        <span className="text-label-caps text-heritage-gold flex items-center gap-2">
          VIEW <span className="material-symbols-outlined text-base">expand_less</span>
        </span>
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md flex items-end" onClick={() => setOpen(false)}>
          <div className="w-full bg-obsidian border-t border-slate-gray p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-label-caps text-heritage-gold">YOUR SESSION</span>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <span className="material-symbols-outlined text-white">close</span>
              </button>
            </div>
            <SummaryContent />
          </div>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/book/booking-summary.tsx
git commit -m "feat: booking summary (desktop panel + mobile sheet)"
```

---

### Task 21: StepFrame motion wrapper + wizard nav buttons

**Files:**
- Create: `components/book/step-frame.tsx`
- Create: `components/book/wizard-nav-buttons.tsx`

- [ ] **Step 1: Write components/book/step-frame.tsx**

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { StepKey } from '@/lib/steps'

interface StepFrameProps {
  stepKey: StepKey
  children: React.ReactNode
}

export function StepFrame({ stepKey, children }: StepFrameProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Write components/book/wizard-nav-buttons.tsx**

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { useBooking } from '@/lib/booking-context'
import { STEPS } from '@/lib/steps'

const HINTS: Record<string, string> = {
  collection: 'Select a collection to continue',
  set: 'Select a set to continue',
  details: 'Tell us what you\'re recording',
  schedule: 'Pick a date and time to continue',
  checkout: 'Complete payment to confirm',
}

export function WizardNavButtons() {
  const { currentStep, next, back, isComplete } = useBooking()
  const idx = STEPS.findIndex((s) => s.key === currentStep)
  const isFirst = idx === 0
  const isLast = idx === STEPS.length - 1
  const canNext = isComplete(currentStep)

  if (isLast) return null

  return (
    <div className="mt-16 flex flex-col sm:flex-row gap-4 sm:justify-end items-stretch sm:items-center">
      {!canNext && <span className="text-metadata text-ivory/40 sm:mr-4">{HINTS[currentStep] ?? ''}</span>}
      {!isFirst && (
        <Button variant="secondary" size="md" onClick={back}>
          Back
        </Button>
      )}
      <Button variant="gold" size="md" onClick={next} disabled={!canNext}>
        Continue
      </Button>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/book/step-frame.tsx components/book/wizard-nav-buttons.tsx
git commit -m "feat: step frame motion wrapper + wizard nav buttons"
```

---

## Phase 6: Wizard Steps

### Task 22: Collection step

**Files:**
- Create: `components/book/steps/collection-step.tsx`

- [ ] **Step 1: Write components/book/steps/collection-step.tsx**

```tsx
'use client'

import { useBooking } from '@/lib/booking-context'
import { collections } from '@/lib/content/collections'

export function CollectionStep() {
  const { booking, setBooking, goTo } = useBooking()

  const choose = (id: 'executive' | 'horizon') => {
    setBooking((b) => ({
      ...b,
      collectionId: id,
      setId: b.collectionId === id ? b.setId : null, // reset set if switching
    }))
    setTimeout(() => goTo('set'), 220)
  }

  return (
    <div>
      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 01 — COLLECTION</span>
        <h2 className="text-headline-xl text-white">Choose the Aesthetic</h2>
        <p className="text-body-lg text-ivory/60 mt-6">
          Collections represent overall visual styles. Pick the one that matches your brand — every set inside it
          shares the same atmosphere.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {collections.map((c) => {
          const isSelected = booking.collectionId === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => choose(c.id)}
              className={`group relative overflow-hidden bg-surface-container-low text-left transition-all border ${
                isSelected ? 'border-heritage-gold' : 'border-transparent hover:border-white/20'
              }`}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  alt={c.name}
                  src={c.heroImage}
                  className={`w-full h-full object-cover transition-all duration-1000 ${
                    isSelected ? 'grayscale-0 scale-105' : 'grayscale group-hover:grayscale-0 group-hover:scale-105'
                  }`}
                />
              </div>
              <div className="p-8 lg:p-12 liquid-glass border-t-0">
                <h3 className="text-headline-md text-white mb-4">{c.name}</h3>
                <p className="text-body-md text-ivory/60 mb-8">{c.tagline}</p>
                <span className="text-label-caps text-ivory/40 mb-3 block">DESIGNED FOR</span>
                <p className="text-body-md text-ivory/70">{c.audience.join(' · ')}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/book/steps/collection-step.tsx
git commit -m "feat: collection step"
```

---

### Task 23: Set step (thumbnail rail + hero + tabs)

**Files:**
- Create: `components/book/steps/set-step.tsx`

- [ ] **Step 1: Write components/book/steps/set-step.tsx**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useBooking } from '@/lib/booking-context'
import { findCollection } from '@/lib/content/collections'

type TabKey = 'gallery' | 'equipment' | 'capacity' | 'examples'

export function SetStep() {
  const { booking, setBooking } = useBooking()
  const collection = findCollection(booking.collectionId)
  const [tab, setTab] = useState<TabKey>('gallery')
  const [heroSrc, setHeroSrc] = useState<string>('')

  const selectedSet = collection?.sets.find((s) => s.id === booking.setId) ?? collection?.sets[0]

  useEffect(() => {
    if (selectedSet) setHeroSrc(selectedSet.heroImage)
  }, [selectedSet?.id])

  if (!collection || !selectedSet) {
    return (
      <div className="text-ivory/60">
        Select a collection first.
      </div>
    )
  }

  const choose = (id: string) => {
    setBooking((b) => ({ ...b, setId: id }))
  }

  return (
    <div>
      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 02 — SET</span>
        <h2 className="text-headline-xl text-white">{collection.name}</h2>
        <p className="text-body-lg text-ivory/60 mt-6">Choose the exact environment you want to record in.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
        {/* Thumbnail rail */}
        <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar">
          {collection.sets.map((s) => {
            const active = s.id === selectedSet.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => choose(s.id)}
                className={`flex-none w-40 lg:w-full text-left transition-all border ${
                  active ? 'border-heritage-gold' : 'border-slate-gray hover:border-white/30'
                }`}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    alt={s.name}
                    src={s.heroImage}
                    className={`w-full h-full object-cover transition-all ${active ? '' : 'grayscale'}`}
                  />
                </div>
                <div className="p-4">
                  <p className="text-label-caps text-white whitespace-nowrap">{s.name.replace(/^(Executive|Horizon|Authority)\s/, '')}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Preview */}
        <div>
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              key={heroSrc}
              alt={selectedSet.name}
              src={heroSrc}
              className="w-full h-full object-cover animate-[fadeIn_320ms_ease-out]"
            />
            <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
          </div>

          <div className="mt-8">
            <h3 className="text-headline-md text-white mb-4">{selectedSet.name}</h3>
            <p className="text-body-md text-ivory/70">{selectedSet.description}</p>
          </div>

          {/* Tabs */}
          <div className="mt-10 border-b border-slate-gray">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {(['gallery', 'equipment', 'capacity', 'examples'] as TabKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`pb-4 text-label-caps transition-colors ${
                    tab === k ? 'text-heritage-gold border-b-2 border-heritage-gold' : 'text-ivory/50 hover:text-white'
                  }`}
                >
                  {k.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 min-h-[140px]">
            {tab === 'gallery' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {selectedSet.gallery.map((src, i) => (
                  <div key={i} className="aspect-square overflow-hidden">
                    <img alt="" src={src} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            {tab === 'equipment' && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-body-md text-ivory/80">
                {selectedSet.equipment.map((e) => (
                  <li key={e} className="flex items-baseline gap-3">
                    <span className="text-heritage-gold">·</span>
                    {e}
                  </li>
                ))}
              </ul>
            )}
            {tab === 'capacity' && (
              <div>
                <p className="text-headline-md text-white mb-2">{selectedSet.capacity.seats}</p>
                <p className="text-body-md text-ivory/70">{selectedSet.capacity.label}</p>
              </div>
            )}
            {tab === 'examples' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSet.exampleContent.map((ex, i) => (
                  <div key={i} className="aspect-video overflow-hidden relative">
                    <img alt={ex.label} src={ex.thumb} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-label-caps text-white">{ex.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/book/steps/set-step.tsx
git commit -m "feat: set step with thumbnail rail, hero preview, tabs"
```

---

### Task 24: Add-ons step

**Files:**
- Create: `components/book/steps/addons-step.tsx`

- [ ] **Step 1: Write components/book/steps/addons-step.tsx**

```tsx
'use client'

import { useBooking } from '@/lib/booking-context'
import { addons } from '@/lib/content/addons'
import { CheckboxToggle } from '@/components/ui/checkbox-toggle'

export function AddonsStep() {
  const { booking, setBooking } = useBooking()
  const toggle = (id: string) => {
    setBooking((b) => ({
      ...b,
      addonIds: b.addonIds.includes(id) ? b.addonIds.filter((x) => x !== id) : [...b.addonIds, id],
    }))
  }

  return (
    <div>
      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 03 — ADD-ONS</span>
        <h2 className="text-headline-xl text-white">Augment Your Session</h2>
        <p className="text-body-lg text-ivory/60 mt-6">Optional upgrades. Pick any combination — selections update your total instantly.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addons.map((a) => {
          const checked = booking.addonIds.includes(a.id)
          return (
            <CheckboxToggle key={a.id} checked={checked} onChange={() => toggle(a.id)} ariaLabel={`Toggle ${a.name}`}>
              <div className="bg-surface-container-low">
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img alt={a.name} src={a.image} className="w-full h-full object-cover grayscale" />
                  <div className="absolute inset-0 bg-obsidian/40" />
                  <div className="absolute top-4 right-4">
                    {checked ? (
                      <span className="text-label-caps text-heritage-gold bg-obsidian/80 px-3 py-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">check</span>
                        ADDED
                      </span>
                    ) : (
                      <span className="text-label-caps text-white bg-obsidian/80 px-3 py-1">+${a.price}</span>
                    )}
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-baseline justify-between mb-3 gap-4">
                    <h3 className="text-headline-md text-white">{a.name}</h3>
                    <span className="text-body-lg text-ivory tabular-nums whitespace-nowrap">${a.price}</span>
                  </div>
                  <p className="text-body-md text-ivory/60">{a.description}</p>
                </div>
              </div>
            </CheckboxToggle>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/book/steps/addons-step.tsx
git commit -m "feat: add-ons step with whole-card toggles"
```

---

### Task 25: Details step

**Files:**
- Create: `components/book/steps/details-step.tsx`

- [ ] **Step 1: Write components/book/steps/details-step.tsx**

```tsx
'use client'

import { useBooking } from '@/lib/booking-context'
import { Input, Textarea } from '@/components/ui/input'
import { findSet } from '@/lib/content/collections'

export function DetailsStep() {
  const { booking, setBooking } = useBooking()
  const set = findSet(booking.collectionId, booking.setId)

  const update = (field: keyof typeof booking.details, value: string) => {
    setBooking((b) => ({ ...b, details: { ...b.details, [field]: value } }))
  }

  return (
    <div className="relative">
      {set && (
        <div
          className="absolute inset-0 -z-10 opacity-[0.08]"
          style={{
            backgroundImage: `url(${set.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(40px)',
          }}
        />
      )}

      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 04 — DETAILS</span>
        <h2 className="text-headline-xl text-white">Tell Us About Your Session</h2>
        <p className="text-body-lg text-ivory/60 mt-6">
          The more we know, the smoother your session runs. We'll prep accordingly.
        </p>
      </header>

      <div className="frosted-glass max-w-3xl p-8 md:p-12">
        <div className="flex flex-col gap-8">
          <Input
            label="WHAT ARE YOU RECORDING?"
            placeholder="e.g., A 4-episode founder podcast, a VSL for a launch, weekly LinkedIn shorts"
            value={booking.details.recordingType}
            onChange={(e) => update('recordingType', e.target.value)}
          />
          <Input
            label="GUEST NAMES"
            placeholder="Comma-separated, if applicable"
            value={booking.details.guests}
            onChange={(e) => update('guests', e.target.value)}
          />
          <Input
            label="SOCIAL MEDIA LINKS"
            placeholder="LinkedIn, IG, X, YouTube — anything you'd like us to reference"
            value={booking.details.socials}
            onChange={(e) => update('socials', e.target.value)}
          />
          <Textarea
            label="SPECIAL REQUESTS"
            placeholder="Anything we should know in advance?"
            value={booking.details.notes}
            onChange={(e) => update('notes', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/book/steps/details-step.tsx
git commit -m "feat: project details step with blurred backdrop"
```

---

### Task 26: Session length step

**Files:**
- Create: `components/book/steps/length-step.tsx`

- [ ] **Step 1: Write components/book/steps/length-step.tsx**

```tsx
'use client'

import { useState } from 'react'
import { useBooking } from '@/lib/booking-context'

const MIN_MINUTES = 90
const MAX_MINUTES = 90 + 6 * 60 // 90 min + up to 6 extra hours

function fmt(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export function LengthStep() {
  const { booking, setBooking, totals } = useBooking()
  const [bump, setBump] = useState<{ id: number; sign: '+' | '-' } | null>(null)

  const change = (delta: number) => {
    const next = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, booking.durationMinutes + delta))
    if (next === booking.durationMinutes) return
    setBooking((b) => ({ ...b, durationMinutes: next }))
    setBump({ id: Date.now(), sign: delta > 0 ? '+' : '-' })
    setTimeout(() => setBump(null), 700)
  }

  return (
    <div>
      <header className="mb-12 max-w-3xl mx-auto text-center">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 05 — SESSION LENGTH</span>
        <h2 className="text-headline-xl text-white">How long do you need?</h2>
        <p className="text-body-lg text-ivory/60 mt-6">Sessions start at 90 minutes. Add hours as needed.</p>
      </header>

      <div className="flex flex-col items-center gap-12 mt-16">
        <div className="text-center">
          <div className="text-[120px] md:text-[180px] leading-none text-white tabular-nums tracking-tighter">
            {fmt(booking.durationMinutes)}
          </div>
          <div className="text-label-caps text-ivory/40 mt-4">HOURS : MINUTES</div>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={() => change(-60)}
            disabled={booking.durationMinutes <= MIN_MINUTES}
            aria-label="Subtract one hour"
            className="w-16 h-16 border border-slate-gray text-white hover:border-heritage-gold hover:text-heritage-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-3xl">remove</span>
          </button>

          <div className="relative">
            <div className="text-headline-md text-heritage-gold tabular-nums">${totals.total.toLocaleString()}</div>
            {bump && (
              <span
                key={bump.id}
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-label-caps text-heritage-gold animate-[bump_700ms_ease-out_forwards]"
              >
                {bump.sign}$100
              </span>
            )}
            <style>{`@keyframes bump { from { transform: translate(-50%, 0); opacity: 1 } to { transform: translate(-50%, -24px); opacity: 0 } }`}</style>
          </div>

          <button
            onClick={() => change(60)}
            disabled={booking.durationMinutes >= MAX_MINUTES}
            aria-label="Add one hour"
            className="w-16 h-16 border border-slate-gray text-white hover:border-heritage-gold hover:text-heritage-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>

        <p className="text-metadata text-ivory/40 max-w-md text-center">
          ${totals.base} for the first 90 minutes. Each additional hour is $100. Maximum {MAX_MINUTES / 60} hours.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/book/steps/length-step.tsx
git commit -m "feat: session length step with stepper + price ticker"
```

---

### Task 27: Schedule step (Cal.com placeholder)

**Files:**
- Create: `components/book/steps/schedule-step.tsx`

- [ ] **Step 1: Write components/book/steps/schedule-step.tsx**

```tsx
'use client'

import { useBooking } from '@/lib/booking-context'

// Generate 14 days starting today
function getDays() {
  const days: { iso: string; weekday: string; day: number; month: string }[] = []
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      iso: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    })
  }
  return days
}

const TIMES = ['09:00', '11:00', '13:00', '15:00', '17:00']

export function ScheduleStep() {
  const { booking, setBooking } = useBooking()
  const days = getDays()

  const pickDate = (iso: string) => setBooking((b) => ({ ...b, schedule: { ...b.schedule, date: iso, time: null } }))
  const pickTime = (t: string) => setBooking((b) => ({ ...b, schedule: { ...b.schedule, time: t } }))

  return (
    <div>
      <header className="mb-12 max-w-3xl">
        <span className="text-label-caps text-heritage-gold mb-4 block">STEP 06 — SCHEDULE</span>
        <h2 className="text-headline-xl text-white">Pick a date &amp; time</h2>
        <p className="text-body-lg text-ivory/60 mt-6">
          Showing slots that fit your {Math.floor(booking.durationMinutes / 60)}h{' '}
          {booking.durationMinutes % 60 ? `${booking.durationMinutes % 60}m ` : ''}session.
        </p>
        <p className="text-metadata text-ivory/30 mt-2">[Placeholder calendar — Cal.com embed wires in here later]</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12">
        {/* Date grid */}
        <div>
          <span className="text-label-caps text-ivory/60 mb-4 block">SELECT DATE</span>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => {
              const active = booking.schedule.date === d.iso
              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => pickDate(d.iso)}
                  className={`p-3 border text-center transition-colors ${
                    active
                      ? 'border-heritage-gold bg-heritage-gold/10 text-heritage-gold'
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

        {/* Times */}
        <div>
          <span className="text-label-caps text-ivory/60 mb-4 block">SELECT TIME</span>
          {!booking.schedule.date ? (
            <p className="text-body-md text-ivory/40">Choose a date first.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {TIMES.map((t) => {
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

- [ ] **Step 2: Commit**

```bash
git add components/book/steps/schedule-step.tsx
git commit -m "feat: schedule step (Cal.com placeholder UI)"
```

---

### Task 28: Checkout step (Stripe placeholder + success state)

**Files:**
- Create: `components/book/steps/checkout-step.tsx`

- [ ] **Step 1: Write components/book/steps/checkout-step.tsx**

```tsx
'use client'

import { useState } from 'react'
import { useBooking } from '@/lib/booking-context'
import { findCollection, findSet } from '@/lib/content/collections'
import { Button } from '@/components/ui/button'

export function CheckoutStep() {
  const { booking, totals } = useBooking()
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  const collection = findCollection(booking.collectionId)
  const set = findSet(booking.collectionId, booking.setId)

  const onPay = () => {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setPaid(true)
    }, 1100)
  }

  if (paid) {
    return (
      <div className="flex flex-col items-center text-center py-24">
        <span className="material-symbols-outlined text-heritage-gold text-6xl mb-8">check_circle</span>
        <span className="text-label-caps text-heritage-gold mb-4 block">SESSION CONFIRMED</span>
        <h2 className="text-headline-xl text-white mb-6">You're booked.</h2>
        <p className="text-body-lg text-ivory/60 max-w-xl">
          A confirmation has been sent to your email. Our team will reach out 24 hours before your session with arrival
          details and any preparation notes.
        </p>
        <div className="mt-12 frosted-glass p-8 max-w-md w-full text-left">
          <p className="text-label-caps text-ivory/60 mb-2">YOUR SESSION</p>
          <p className="text-body-lg text-white">{set?.name}</p>
          <p className="text-body-md text-ivory/60 mt-1">{booking.schedule.date} · {booking.schedule.time}</p>
          <p className="text-headline-md text-heritage-gold mt-6 tabular-nums">${totals.total.toLocaleString()}</p>
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
        <p className="text-metadata text-ivory/30 mt-2">[Placeholder checkout — Stripe Payment Element wires in here later]</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="frosted-glass p-8">
          <span className="text-label-caps text-ivory/60 mb-6 block">CONFIRMATION</span>
          <dl className="flex flex-col gap-4 text-body-md">
            <Row k="Collection" v={collection?.name ?? ''} />
            <Row k="Set" v={set?.name ?? ''} />
            <Row k="Date" v={booking.schedule.date ?? ''} />
            <Row k="Time" v={booking.schedule.time ?? ''} />
            <Row k="Duration" v={`${Math.floor(booking.durationMinutes / 60)}h ${booking.durationMinutes % 60 ? `${booking.durationMinutes % 60}m` : ''}`.trim()} />
          </dl>
          <div className="h-px bg-slate-gray my-6" />
          <div className="flex justify-between items-baseline">
            <span className="text-label-caps text-white">TOTAL</span>
            <span className="text-headline-md text-white tabular-nums">${totals.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="frosted-glass p-8 flex flex-col">
          <span className="text-label-caps text-ivory/60 mb-6 block">PAYMENT</span>
          <div className="flex flex-col gap-6 flex-1">
            <Field label="CARD NUMBER" placeholder="4242 4242 4242 4242" />
            <div className="grid grid-cols-2 gap-6">
              <Field label="EXPIRY" placeholder="MM / YY" />
              <Field label="CVC" placeholder="123" />
            </div>
            <Field label="NAME ON CARD" placeholder="Jane Founder" />
          </div>
          <Button variant="gold" size="lg" className="mt-8 w-full" onClick={onPay} disabled={paying}>
            {paying ? 'Processing...' : `Pay $${totals.total.toLocaleString()}`}
          </Button>
          <p className="text-metadata text-ivory/30 mt-4 text-center">Secure payment · placeholder only</p>
        </div>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ivory/60">{k}</dt>
      <dd className="text-ivory text-right">{v || '—'}</dd>
    </div>
  )
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-label-caps text-ivory/60">{label}</label>
      <input
        placeholder={placeholder}
        className="w-full bg-transparent border-0 border-b border-slate-gray text-ivory py-3 outline-none transition-colors focus:border-heritage-gold placeholder:text-ivory/30"
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/book/steps/checkout-step.tsx
git commit -m "feat: checkout step with placeholder Stripe UI + success state"
```

---

### Task 29: Assemble /book page

**Files:**
- Create: `app/book/page.tsx`

- [ ] **Step 1: Write app/book/page.tsx**

```tsx
'use client'

import { useEffect } from 'react'
import { BookingProvider, useBooking } from '@/lib/booking-context'
import { StepRail } from '@/components/book/step-rail'
import { BookingSummaryPanel, BookingSummaryBar } from '@/components/book/booking-summary'
import { StepFrame } from '@/components/book/step-frame'
import { WizardNavButtons } from '@/components/book/wizard-nav-buttons'
import { CollectionStep } from '@/components/book/steps/collection-step'
import { SetStep } from '@/components/book/steps/set-step'
import { AddonsStep } from '@/components/book/steps/addons-step'
import { DetailsStep } from '@/components/book/steps/details-step'
import { LengthStep } from '@/components/book/steps/length-step'
import { ScheduleStep } from '@/components/book/steps/schedule-step'
import { CheckoutStep } from '@/components/book/steps/checkout-step'

function CurrentStep() {
  const { currentStep } = useBooking()
  return (
    <StepFrame stepKey={currentStep}>
      {currentStep === 'collection' && <CollectionStep />}
      {currentStep === 'set' && <SetStep />}
      {currentStep === 'addons' && <AddonsStep />}
      {currentStep === 'details' && <DetailsStep />}
      {currentStep === 'length' && <LengthStep />}
      {currentStep === 'schedule' && <ScheduleStep />}
      {currentStep === 'checkout' && <CheckoutStep />}
    </StepFrame>
  )
}

function KeyboardShortcuts() {
  const { next, back } = useBooking()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); back() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, back])
  return null
}

export default function BookPage() {
  return (
    <BookingProvider>
      <KeyboardShortcuts />
      <StepRail />
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge pt-12 pb-32 lg:pb-12">
        <div className="flex gap-12">
          <main className="flex-1 min-w-0">
            <CurrentStep />
            <WizardNavButtons />
          </main>
          <BookingSummaryPanel />
        </div>
      </div>
      <BookingSummaryBar />
    </BookingProvider>
  )
}
```

- [ ] **Step 2: Verify end-to-end in browser**

Run:
```bash
npm run dev
```

Open http://localhost:3000/book. Walk through every step:

1. Pick a collection → auto-advances to Set
2. Pick a set → use thumbnail rail, tabs (Gallery/Equipment/Capacity/Examples)
3. Toggle add-ons → see summary update + total tick
4. Fill in details (recording type required)
5. Adjust session length → see `+$100` float up
6. Pick a date + time
7. Click pay → success screen

Check:
- Summary panel updates live as you select
- Step rail allows jumping back to completed steps
- Refresh on `/book#addons` → state restored from sessionStorage
- Resize to mobile (375px) → summary becomes bottom sheet, step rail compacts

Kill the server with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add app/book/page.tsx
git commit -m "feat: assemble /book wizard with all 7 steps + nav + summary"
```

---

## Phase 7: Polish

### Task 30: Accessibility + reduced-motion verification

**Files:**
- Modify: `components/book/step-frame.tsx`
- Modify: `app/book/page.tsx`

- [ ] **Step 1: Add focus management to StepFrame**

Replace `components/book/step-frame.tsx`:

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { StepKey } from '@/lib/steps'

interface StepFrameProps {
  stepKey: StepKey
  children: React.ReactNode
}

export function StepFrame({ stepKey, children }: StepFrameProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Move focus to the new step's heading on transition
    const h = ref.current?.querySelector('h2')
    if (h) {
      h.setAttribute('tabindex', '-1')
      ;(h as HTMLElement).focus({ preventScroll: false })
    }
  }, [stepKey])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        key={stepKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Verify reduced-motion**

In Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Navigate the wizard — transitions should be effectively instant. The CSS rule added in `app/globals.css` (Task 2) handles this globally.

- [ ] **Step 3: Verify keyboard navigation**

On desktop: Tab through the wizard. Press `→` and `←` to navigate steps (when nothing focused inside an input). Verify focus lands on the step's h2 after navigation.

- [ ] **Step 4: Commit**

```bash
git add components/book/step-frame.tsx
git commit -m "feat: focus management on step transitions for a11y"
```

---

### Task 31: Final tests pass + cleanup

**Files:** none

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: all tests pass (pricing + booking-context).

- [ ] **Step 2: Build production bundle**

```bash
npm run build
```

Expected: build succeeds with no errors. Note: warnings about using `<img>` instead of `next/image` are acceptable for placeholder content.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Fix any errors. Warnings about `<img>` are acceptable.

- [ ] **Step 4: Verify dev server one more time**

```bash
npm run dev
```

End-to-end walkthrough on `/` then `/book` once more.

- [ ] **Step 5: Final commit if any cleanup was needed**

```bash
git status
# if there are changes:
git add -A
git commit -m "chore: final polish + lint fixes"
```

---

## Self-Review

**Spec coverage:**
- Landing page (Nav + 8 sections) — Tasks 11–17 ✓
- 7-step wizard with persistent summary — Tasks 19–29 ✓
- URL hash sync + sessionStorage — Task 8 ✓
- Pricing ($300/90min, +$100/hr, add-ons) — Task 5 ✓
- Step completion rules — Task 7 ✓
- Step navigation (next/back, jump-back-only) — Tasks 8, 19, 21 ✓
- Motion (cross-fade + 8px slide) — Task 21 ✓
- Hover rules, gold border on toggles — Tasks 9–10, 22, 24 ✓
- Set step (thumbnails + hero + tabs) — Task 23 ✓
- Length stepper with `+$100` float — Task 26 ✓
- Cal.com / Stripe placeholders — Tasks 27–28 ✓
- Mobile responsive (rail compact + bottom sheet) — Tasks 19–20 ✓
- Accessibility (aria-current, focus on h2, real buttons) — Tasks 19, 30 ✓
- Reduced motion — Task 2 (CSS rule) ✓
- Keyboard navigation — Task 29 ✓
- Persistence resilience (fallback to first incomplete step) — Tasks 7–8 ✓

**Placeholder scan:** no "TBD" / "implement later" / vague directives. Every code step has full code. Image URLs are marked as TODO replacements but are functional placeholders.

**Type consistency:**
- `Booking` shape defined in `lib/steps.ts`, used in `booking-context.tsx`, all step components — consistent
- `Addon` type defined in `lib/pricing.ts`, imported by `lib/content/addons.ts` — consistent
- Pricing fields (`base`, `extraHours`, `extraTimePrice`, `addonTotal`, `total`) consistent across `pricing.ts` test and `booking-summary.tsx`
- `StepKey` union consistent across `steps.ts`, `booking-context.tsx`, `step-frame.tsx`, `step-rail.tsx`
