# Voxa SEO + AEO Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Voxa crawlable foundations, data-driven service pages and articles, and a monthly Search Console routine that proposes the next work for Niko's approval.

**Architecture:** Shared site facts move into `lib/seo/site.ts`. Pages and articles are typed content files rendered by static Next routes, with a `published` flag controlling routes, the sitemap and footer links together. The monthly loop is a written runbook and log, not software.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind, Vitest with Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-01-seo-aeo-engine-design.md`

## Global Constraints

- Branch from `main`. No On-Site code, links, audits or recommendations.
- Nothing goes live without Niko's approval; every page starts `published: false`.
- Every claim traces to Niko or an existing source. No invented clients, results, reviews, prices or statistics.
- Voxa is "the setup, not the scriptwriter". Copy must not imply scripting, funnel strategy or ad-buying services.
- Copy must signal that scope is flexible, not a locked menu.
- No self-serving review star markup (`aggregateRating` or `review`).
- No `llms.txt`, custom dashboard, neighborhood doorway pages or Google Ads changes.
- AI answer checks stay on hold; do not build them.
- Booking, tracking and the homepage's ad message match must keep working.
- Match existing components and `DESIGN.md`. Add no dependencies.

## Inputs Needed From Niko

Tasks ship without these, but the affected item stays out until they arrive:

| Input | Used in | Without it |
|---|---|---|
| Google Business Profile and Peerspace URLs | Task 1 | Those `sameAs` links are omitted |
| Homepage headline approval | Task 2 | Headline is not changed |
| Review quotes and client permission; Peerspace reuse terms | Task 3 | Quotes don't render |
| Approval of each page's copy | Tasks 5, 6 | Page stays unpublished |
| Search Console access | Task 7 | Monthly loop can't start |

## Review Focus

- A new page inheriting the layout's `canonical: '/'` would tell Google it is a duplicate of the homepage; each page must declare its own canonical (Task 4).
- `#book` links in the nav and `FinalCTA` go nowhere on a non-home page; they must reach the booking section from any page (Task 4).
- An unpublished page reached by URL should return 404 and stay out of the sitemap and footer (Task 4).
- A review with `permissionConfirmed: false` must not render anywhere (Task 3).
- A `<` in content must not break out of JSON-LD script tags (Task 1).

---

### Task 0: Create the branch

**Files:** the existing untracked spec and this plan.

- [ ] **Step 1: Branch from `main` and commit the docs only**

`notes/` stays untracked and uncommitted.

```bash
git switch -c feature/seo-engine main
git add docs/superpowers/specs/2026-11-01-seo-aeo-engine-design.md docs/superpowers/plans/2026-11-01-seo-aeo-engine.md
git commit -m "docs(seo): add SEO and AEO engine design and plan"
```

- [ ] **Step 2: Run the baseline tests**

Run: `npm test`
Expected: all tests pass.

### Task 1: Crawl foundations and structured data

**Files:**
- Create: `lib/seo/site.ts`, `app/sitemap.ts`, `app/robots.ts`, `tests/seo/foundations.test.ts`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `SITE_URL: string`; `LOCAL_BUSINESS_ID: string` (`${SITE_URL}/#localbusiness`); `SAME_AS: string[]`; `jsonLd(data: unknown): string`

- [ ] **Step 1: Write failing tests**

```ts
it('sitemap lists the homepage and never /book, /booking or /onsite', () => {
  const urls = sitemap().map((e) => e.url)
  expect(urls).toContain(SITE_URL)
  expect(urls.some((u) => /\/(book|booking|onsite)(\/|$)/.test(u))).toBe(false)
})
it('robots allows crawling, blocks /api/, links the sitemap', () => {
  const r = robots()
  const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules
  expect(rule).toMatchObject({ userAgent: '*', allow: '/', disallow: '/api/' })
  expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
})
it('jsonLd escapes < so content cannot close the script tag', () => {
  expect(jsonLd({ a: '</script>' })).not.toContain('<')
})
it('SAME_AS holds only valid unique https URLs', () => {
  expect(new Set(SAME_AS).size).toBe(SAME_AS.length)
  for (const u of SAME_AS) expect(u).toMatch(/^https:\/\//)
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/seo/foundations.test.ts`
Expected: FAIL, modules not found.

- [ ] **Step 3: Implement**

- `robots()` must not disallow `/booking/confirmed`: crawlers have to reach it to see its `noindex`.
- `sitemap()` uses a fixed `lastModified` per entry, not the build time. Homepage value: `2026-11-01`.
- `SAME_AS` holds Instagram and LinkedIn from the layout, plus the Google Business Profile and Peerspace URLs once supplied.
- `layout.tsx` imports `SITE_URL`, `LOCAL_BUSINESS_ID` and `SAME_AS`, and renders through `jsonLd`.

- [ ] **Step 4: Verify and commit**

Run: `npm test && npm run build`
Expected: tests pass, and the build lists `/sitemap.xml` and `/robots.txt`.

```bash
git add lib/seo/site.ts app/sitemap.ts app/robots.ts app/layout.tsx tests/seo/foundations.test.ts
git commit -m "feat(seo): add sitemap, robots and shared site facts"
```

### Task 2: Homepage headline

**Files:** Modify `components/marketing/hero.tsx:58-65`; Create `tests/seo/hero.test.tsx`.

- [ ] **Step 1: Get Niko's approval of the wording**

Proposed H1: "Tampa Podcast & Video Studio". Proposed subline: "Professional content, effortlessly. Podcast, VSL, and content production — engineer on-site." Confirm that it still matches the ads before continuing.

- [ ] **Step 2: Write a failing test**

Render `Hero` inside `TourModalProvider`. Assert that the level-1 heading matches `/tampa/i` and `/podcast/i`.

- [ ] **Step 3: Update the copy, check desktop and mobile in the browser, then commit**

Run: `npm test`
Expected: pass; the headline fits on phone width.

```bash
git add components/marketing/hero.tsx tests/seo/hero.test.tsx
git commit -m "feat(seo): say what Voxa does and where in the homepage headline"
```

### Task 3: Review quotes

**Files:** Create `lib/content/reviews.ts`, `components/marketing/review-quotes.tsx`, `tests/seo/reviews.test.tsx`; Modify `app/page.tsx`.

**Interfaces:**
- Produces: `type Review = { id: string; quote: string; name: string; business?: string; recorded: string; source: 'google' | 'peerspace'; sourceUrl?: string; permissionConfirmed: boolean; services: ServiceTag[] }`; `type ServiceTag = 'vsl' | 'podcast' | 'course'`; `usableReviews(tag?: ServiceTag): Review[]`; `<ReviewQuotes tag?: ServiceTag />`

- [ ] **Step 1: Write failing tests**

Using a fixture passed by `vi.mock`:

```tsx
it('drops reviews without permission', () => {
  expect(usableReviews().every((r) => r.permissionConfirmed)).toBe(true)
})
it('renders nothing with no usable reviews', () => {
  const { container } = render(<ReviewQuotes tag="course" />)
  expect(container).toBeEmptyDOMElement()
})
it('adds no star markup', () => {
  const { container } = render(<ReviewQuotes />)
  expect(container.innerHTML).not.toMatch(/aggregateRating|"review"/i)
})
```

- [ ] **Step 2: Run to verify they fail, then implement**

Quotes are copied word for word. Render the name, business if agreed, what they recorded, and a source link when present. Place `<ReviewQuotes />` between `WhatYouGet` and `BookSection` on the homepage. Ship with an empty list until Niko supplies quotes.

- [ ] **Step 3: Verify and commit**

Run: `npm test`
Expected: pass.

```bash
git add lib/content/reviews.ts components/marketing/review-quotes.tsx app/page.tsx tests/seo/reviews.test.tsx
git commit -m "feat(seo): add permission-gated review quotes"
```

### Task 4: Service page system

**Files:**
- Create: `lib/content/services/types.ts`, `lib/content/services/index.ts`, `app/studios/[slug]/page.tsx`, `components/marketing/service-page.tsx`, `tests/seo/services.test.tsx`
- Modify: `app/sitemap.ts`, `components/marketing/faq.tsx`, `components/marketing/footer.tsx`, `components/marketing/final-cta.tsx`, `components/nav.tsx`

**Interfaces:**
- Consumes: Task 1 site facts and `jsonLd`; Task 3 `ReviewQuotes`, `ServiceTag`
- Produces:

```ts
type ServicePage = {
  slug: string; published: boolean; lastModified: string; navLabel: string
  title: string; description: string; h1: string
  directAnswer: string
  sections: { heading: string; body: string[] }[]
  delivery: string
  reviewTag: ServiceTag
  faqs: { question: string; answer: string }[]
}
allServices(): ServicePage[]
publishedServices(): ServicePage[]
getPublishedService(slug: string): ServicePage | undefined
```

`FAQ` gains the prop `items?: FAQItem[]`, defaulting to the current `FAQS`.

- [ ] **Step 1: Write failing tests**

Using a fixture with one published and one unpublished page:

```tsx
it('hides unpublished pages from lookup and sitemap', () => {
  expect(getPublishedService('draft')).toBeUndefined()
  expect(sitemap().map((e) => e.url).join()).not.toContain('draft')
})
it('each page sets its own canonical', async () => {
  const m = await generateMetadata({ params: { slug: 'live' } })
  expect(m.alternates?.canonical).toBe('/studios/live')
})
it('unknown or unpublished slugs call notFound', () => {
  expect(() => Page({ params: { slug: 'draft' } })).toThrow()
})
it('nav and final CTA booking links work from any page', () => {
  render(<Nav />)
  expect(screen.getByText('BOOK A SESSION')).toHaveAttribute('href', '/#book')
})
it('footer links only published pages', () => {
  render(<Footer />)
  expect(screen.queryByRole('link', { name: 'Draft' })).toBeNull()
})
it('service JSON-LD references the business and has no star markup', () => {
  const { container } = render(<ServicePageView page={live} />)
  const html = container.innerHTML
  expect(html).toContain(LOCAL_BUSINESS_ID)
  expect(html).not.toMatch(/aggregateRating/)
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run tests/seo/services.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Implement**

- Route: `generateStaticParams` from `publishedServices()`, `dynamicParams = false`, `notFound()` for anything else.
- Metadata sets the title, description, canonical and matching Open Graph URL and title.
- Page order: H1, `directAnswer` as the first paragraph, sections, `delivery`, `ReviewQuotes`, `FAQ items`, `ComeVisitUs`, `FinalCTA`, `Footer`.
- JSON-LD: `Service` with `provider: { '@id': LOCAL_BUSINESS_ID }` and `areaServed: 'Tampa, FL'`.
- Change `#book` to `/#book` in the nav and `FinalCTA`, and confirm the home page still scrolls to booking.

- [ ] **Step 4: Verify and commit**

Run: `npm test && npm run build`
Expected: pass. With no published pages, the build still succeeds.

```bash
git add lib/content/services app/studios app/sitemap.ts components/marketing components/nav.tsx tests/seo/services.test.tsx
git commit -m "feat(seo): add publishable service page system"
```

### Task 5: VSL and Meta ads page

**Files:** Create `lib/content/services/vsl-meta-ads.ts`, `tests/seo/service-copy.test.ts`; Modify `lib/content/services/index.ts`.

Slug: `vsl-meta-ads-tampa`. H1 direction: a Tampa studio for filming VSLs and Meta ad videos.

- [ ] **Step 1: Write the failing copy guard for all service pages**

```ts
const banned = /(we|our team)\s+(write|craft|script)|scriptwriting service|funnel strategy|media buying|ad management|\/onsite|guaranteed/i
it.each(allServices())('$slug stays within what Voxa sells', (page) => {
  expect(JSON.stringify(page)).not.toMatch(banned)
})
it.each(allServices())('$slug answers first and is substantive', (page) => {
  expect(page.directAnswer.length).toBeGreaterThan(80)
  expect(page.sections.length).toBeGreaterThanOrEqual(3)
  expect(page.delivery.length).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run to verify it fails, then draft with `published: false`**

Use only these sourced facts:
- Authority Desk is a solo, direct-to-camera set with two-camera coverage, teleprompter-ready (`lib/content/collections.ts`).
- Most Authority Desk sessions are VSLs and Meta ads; Voxa provides the setup, and the client brings their own script (Niko).
- Sessions start at $300 for 90 minutes, with 30-minute extensions at $50, up to 5 hours; an on-site producer is included (`faq.tsx`).
- Delivery is multi-cam files, each angle its own file, color-corrected and audio-synced, ready for an editor, the same day (`what-you-get.tsx`).

Also include: a short section for funnel builders and ad agencies whose clients need somewhere to film, and wording that shows sessions can flex to the project.

- [ ] **Step 3: Verify, get approval, publish**

Run: `npm test`
Expected: pass. Niko approves the copy and any client names, then set `published: true` and confirm the page, sitemap entry and footer link in the browser.

- [ ] **Step 4: Commit**

```bash
git add lib/content/services tests/seo/service-copy.test.ts
git commit -m "feat(seo): add VSL and Meta ads studio page"
```

### Task 6: Podcast/YouTube and course/webinar pages

**Files:** Create `lib/content/services/podcast-youtube.ts`, `lib/content/services/course-webinar.ts`; Modify `lib/content/services/index.ts`.

Slugs: `podcast-youtube-tampa`, `course-webinar-tampa`. The Ads plan's `/podcast-studio-tampa` URL stays free and is not used here.

- [ ] **Step 1: Draft both with `published: false`**

Use sourced facts only, from `collections.ts`, `faq.tsx` and `what-you-get.tsx`. State each set's delivery accurately: the Podcast set gets a 48-hour edited program, while Desk and Creator get multi-cam files. Exclude "Coming Soon" collections from anything described as bookable today. Ask Niko which sets suit courses and webinars if the sources don't say.

- [ ] **Step 2: Verify, get approval, publish one at a time**

Run: `npm test`
Expected: the Task 5 guards pass for both pages.

- [ ] **Step 3: Commit**

```bash
git add lib/content/services
git commit -m "feat(seo): add podcast and course studio pages"
```

### Task 7: Search Console and the monthly routine

**Files:** Create `docs/seo/setup-checklist.md`, `docs/seo/monthly-loop.md`, `docs/seo/log.md`.

- [ ] **Step 1: Write the setup checklist for Niko**

Plain-language steps: verify the domain in Search Console, submit `https://voxastudios.com/sitemap.xml`, confirm whether the site is indexed for "Voxa Studios", and check Google Business Profile, Peerspace and key directories for complete details and a matching name, address and phone. Niko does the account steps; do not enter his credentials.

- [ ] **Step 2: Write the runbook**

Input is a Search Console CSV export, so no stored credentials are needed. Steps follow the spec: check, compare, decide, prepare, approve, log. Use the spec's two Search Console rules now. Keep the AI rules listed as inactive, with a note that they apply once Niko restarts the checks. Output is a brief with one or two content items plus review and listing tasks. Include the anti-goals as a pre-publish checklist.

- [ ] **Step 3: Start the log and commit**

`log.md` records date, data window, findings and what shipped. Add the 2026-11-01 audit baseline from the spec as the first entry.

```bash
git add docs/seo
git commit -m "docs(seo): add Search Console setup and monthly routine"
```

- [ ] **Step 4: Offer a monthly reminder**

Ask Niko whether he wants a scheduled monthly reminder; create it only if he says yes.

### Task 8: Article section

**Blocked until:** the first service page is live and the first Search Console baseline suggests topics.

**Files:** Create `lib/content/guides/types.ts`, `lib/content/guides/index.ts`, `lib/content/guides/<first-topic>.ts`, `app/guides/[slug]/page.tsx`, `tests/seo/guides.test.tsx`; Modify `app/sitemap.ts`.

**Interfaces:**
- Consumes: Task 1 `jsonLd`, `SITE_URL`
- Produces: `type Guide = { slug: string; published: boolean; lastModified: string; title: string; description: string; h1: string; directAnswer: string; sections: { heading: string; body: string[] }[]; relatedService: string }`; `publishedGuides(): Guide[]`; `getPublishedGuide(slug: string): Guide | undefined`

- [ ] **Step 1: Write failing tests**

Apply the Task 4 canonical, 404 and sitemap tests to `/guides/<slug>`. Add:

```ts
it.each(allGuides())('$slug links to a published service', (g) => {
  expect(getPublishedService(g.relatedService)).toBeDefined()
})
```

Run the Task 5 `banned` guard over guides too.

- [ ] **Step 2: Implement the route the same way as Task 4, with `Article` JSON-LD**

Do not add an index page until there are at least three guides.

- [ ] **Step 3: Draft the first guide, get approval, publish, commit**

Stay close to filming, such as preparing a VSL script for a teleprompter. Teaching people to prepare their own script is fine; offering to write it is not.

Run: `npm test && npm run build`
Expected: pass.

```bash
git add lib/content/guides app/guides app/sitemap.ts tests/seo/guides.test.tsx
git commit -m "feat(seo): add guides section and first article"
```

## Merging With On-Site

`feature/voxa-onsite` also changes `app/sitemap.ts`, `components/nav.tsx` and `components/marketing/footer.tsx`. When it merges, keep both sets of sitemap entries and links, and keep the nav's `/#book` fix.
