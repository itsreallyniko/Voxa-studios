# Handoff — `feature/voxa-onsite`

Last session: 2026-10-28. Read this before touching code.

## State of the branch

- **Branch:** `feature/voxa-onsite` (off `main`)
- **Last commit:** `397cdaf feat(onsite): introduce Voxa On-Site section (hub + niche pages)` — the initial scaffold.
- **Working tree is dirty by design.** Niko explicitly said: *"dont commit yet until fully completed with visuals and funnels setup."* Everything after `397cdaf` is in-progress and uncommitted. Do **not** `git stash`, `git reset`, or auto-commit without asking.

Confirm state on startup:

```
git status                 # branch feature/voxa-onsite, modified files present
git log -1 --oneline       # 397cdaf feat(onsite): …
PORT=3123 npm run dev      # dev server (port 3000 often in use)
```

Pages to open:
- http://localhost:3123/onsite — hub
- http://localhost:3123/onsite/testimonial-videos-tampa — polished-films bucket
- http://localhost:3123/onsite/content-day-tampa — social-first bucket
- http://localhost:3123/onsite/advocacy-education-video — draft, noindex, not in hub

Verification before any claim of "done":

```
npx tsc --noEmit
npm run lint
npm run check:onsite   # custom script in scripts/check-onsite-copy.mjs
npm run build
```

## What changed in this session (uncommitted)

- **Replaced the event-video niche with content-day.** `lib/content/onsite/pages/event-video-tampa.ts` deleted; `lib/content/onsite/pages/content-day-tampa.ts` created. Index updated.
- **Reshaped the two live niches so they feel like different products:**
  - *Testimonial page* broadened to **Testimonial / Brand / Commercial** (polished-films bucket). Headline: *"Polished films that carry your brand."* Lead package: Interview, then Commercial, then Content Day.
  - *Content Day page* positioned as **social-first** (reels, day-in-the-life, bulk short-form; **no hero film**). Headline: *"A day on-site. Weeks of social, filmed."*
- **Content Day *package definition*** in `lib/content/onsite/packages.ts` updated to drop hero film from its deliverables — hero film output lives in Commercial now, so there's no cross-page overlap.
- **Hub niche cards:** eyebrow dropped (was redundantly "VOXA ON-SITE · TAMPA"); new `buyerLabel` field in `OnsitePage` type populates a per-page "FOR …" label on the hub cards.
- **Types extended** (`lib/content/onsite/types.ts`): `CaseSlot` and `CrewSlot` are now discriminated unions — placeholder OR filled. Filled cases get thumbnail + href + preview badge. Filled crew get photo + name + bio + preview badge.
- **Preview examples wired in** (gold "PREVIEW · PENDING APPROVAL BEFORE LAUNCH" banners wherever used):
  - Testimonial page cases: TrueLimb (`p681WHF3s1I`), Piper Family Dentistry (`8bBxKGRrmTM`), JR Rivas / Instant Leverage (`fUjoVG7xoFA`). **Niko flagged many YouTube links came back broken** from a WebFetch pass — he'll verify + swap.
  - Testimonial + Content Day pages: Tim Butt wired as DP (preview). Advocacy page untouched (still fully placeholder).
- **Packages section** heading softened: eyebrow is now `EXAMPLE PACKAGES`, heading is `Common shapes projects take.`, with a body line about scoping to fit. Inside each card, `INCLUDES` is now `TYPICALLY INCLUDES` and `YOU GET` is `TYPICAL DELIVERABLES`.

Files touched since `397cdaf`:
- `lib/content/onsite/types.ts`
- `lib/content/onsite/index.ts`
- `lib/content/onsite/packages.ts`
- `lib/content/onsite/pages/testimonial-videos-tampa.ts`
- `lib/content/onsite/pages/content-day-tampa.ts` *(new)*
- `lib/content/onsite/pages/event-video-tampa.ts` *(deleted)*
- `lib/content/onsite/pages/advocacy-education-video.ts` *(only added `buyerLabel`)*
- `components/onsite/case-studies.tsx`
- `components/onsite/crew-block.tsx`
- `components/onsite/packages-row.tsx`
- `app/onsite/page.tsx`

## Open work (what Niko is likely to pick up next)

1. **Form backend.** `/api/onsite/quote` validates + rate-limits + logs server-side; **no delivery wired.** Niko to pick webhook / Resend / Formspree / Sheets.
2. **Env var.** `NEXT_PUBLIC_CAL_ONSITE_LINK` not set → Cal.com inline embed in the quote-form success state renders a placeholder box. Example added to `.env.local.example`.
3. **Case examples on Content Day page** — all placeholders. Blocked on Niko verifying video links.
4. **Case trimming on Testimonial page** — Niko said he'll pick/replace from the three I wired in.
5. **Hero visuals.** All heroes use the gold-tinted radial-gradient fallback (`muteLoopVideo: null`). Niko plans to shoot real promo video/pictures later. Each page's `hero.muteLoopVideo` accepts a path to an MP4 in `/public`.
6. **Media still missing:** `/public/og/onsite/<slug>.jpg` for each page, hero MP4s, proof-strip assets, case thumbnails, crew photos (Tim's current photo loads directly from his Squarespace CDN — swap to a local `/public/crew/tim-butt-dp.jpg` once he OKs it).
7. **Budget band labels** in `lib/content/onsite-form.ts` are non-dollar placeholders ("Just getting started", "Established budget", …). Niko to confirm real bands — likely non-dollar still, per the no-prices rule.
8. **Advocacy-education-video page** is `draft: true`, noindex, excluded from hub + sitemap. Still all placeholders. Needs client approval before any work can be shown.
9. **Nothing in `/public/onsite/` yet.** When wiring images, prefer `/public/onsite-hero/<slug>.mp4` and `/public/og/onsite/<slug>.jpg` conventions.

## Hard rules — don't let these slip

Enforced partly by `scripts/check-onsite-copy.mjs`:

- **No prices anywhere in `/onsite/*`** — no `$` with a digit, no "starting at". Includes `lib/content/onsite-form.ts`.
- **No turnaround/timing claims** — no `\d+\s*(hrs?|hours?|days?|weeks?)`. Package names "Content Day" / "Interview Session" / "Commercial" are allowlisted but still flagged for human review.
- **Name is always "Voxa On-Site"** (capital O, capital S, hyphen).
- **No section/headline starts with "We" or "At Voxa."** Watch this when writing new copy.
- **No invented claims** — stats, awards, logos, testimonials, client names, crew with real photos must be gated behind client approval and marked PREVIEW until confirmed.

## Niko's voice preferences surfaced this session

- Reacts hard against two pages that read as "the same thing with slight nuances." Push for genuinely distinct **who's on camera / why they need it / outcome** when differentiating niches, not just reworded sublines.
- Dislikes copy that reads as a locked menu. Signal flexibility: "example packages," "typically includes," "common shapes projects take," "every project is scoped to fit."
- Prefers **inline previews** over long explanations when iterating. Make the change, show it in the dev server, then explain in 2–3 sentences. He'll react.
- Keeps hero visuals as placeholder gold gradient on purpose until he shoots real material. Don't push for stand-in imagery unless asked.

## Related files you'll want to glance at

- `/Users/nikotorres/Voxa_website/notes/onsite-tim-portfolio.md` — Tim Butt's reel inventory, which pieces fit which page, caveats about hallucinated Vimeo URLs from the WebFetch pass.
- `/Users/nikotorres/.claude/plans/eventual-tumbling-dijkstra.md` — the original plan file.

## If you need to resume mid-iteration

The dev server was running on 3123 last session; it has been stopped. Restart with `PORT=3123 npm run dev`. The content-day FAQ now includes an explicit "Can we get a long-form film from this day?" → *that's a different product* note that reinforces the split between the two niche pages — treat that as load-bearing, don't delete it.
