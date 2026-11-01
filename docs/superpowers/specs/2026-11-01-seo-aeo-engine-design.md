# Voxa SEO + AEO Engine: Design

**Date:** 2026-11-01
**Status:** Draft for Niko's review

## Intent

Voxa Studios is a Tampa podcast and content studio. About half its work is podcasts; the other half is VSLs, courses and demos for business owners and coaches.

Niko already spends $25 a day on Google Ads, so paid search covers immediate demand. He wants to start appealing to answer engines (ChatGPT, Gemini, Perplexity, Google's AI answers) early, and capture clients there, while also improving organic search presence.

The "engine" is a repeating process that finds out where Voxa is missing, proposes the next most useful work, and lets Niko approve it quickly. It is a routine with some automation, not a product.

## Decisions Niko made

- **AEO is the main goal.** Better SEO is wanted too, but Google Ads lowers its urgency.
- **Start with SEO foundations.** They also serve AEO, and they are the easier place to begin.
- **Existing reviews should be used** (7 on Google, 6 on Peerspace at the time of writing), and he is actively collecting more.
- **Exclude On-Site for now.** That section is still being built, so the engine must not create, audit, or recommend work on it.
- **Voxa is the setup, not the scriptwriter.** For VSLs and Meta ad videos, Voxa doesn't offer scripting. It offers the convenience of a professional studio: a teleprompter and different sets, so people can film their own material with ease. Copy must not imply scripting, funnel strategy or ad-buying services.

## Who the site needs to reach

Niko named the first two paths. The other three are Claude's suggestions, which he did not object to.

| Path | Example question | What it needs |
|---|---|---|
| **Learner** | "How do I make a VSL?" "How do I run a funnel in Tampa?" | Useful teaching content that leads to Voxa |
| **Shopper** | "Podcast or YouTube studio in Tampa?" | Clear facts: services, location, price, proof |
| **Comparer** | "Rent a studio or set up at home?" | Honest comparison content |
| **Niche professional** | "How can a Tampa coach use video?" | Audience-specific content, excluding On-Site pages for now |
| **Course creator or coach** | "How do I film a professional course?" | Service page plus guidance |

Priority is the shopper first because they are closest to buying, with Tampa VSL as the first new page (see Audit).

## Goals

1. Voxa appears more often, and is described correctly, in AI answers to the target questions.
2. Voxa ranks organically for Tampa service searches, across both podcast and non-podcast work.
3. The site clearly explains the full range of work to people and machines.
4. Niko gets a short list of next actions each month, without having to work out what to do.
5. Inquiries and bookings from organic and AI sources can be seen, as far as tracking allows.

## Non-goals

- Active PR, such as pitching journalists. Revisit it only when the monthly check shows third-party sources are what's holding Voxa back.
- Replacing Google Ads, or making changes to the campaign.
- A custom dashboard or standalone software product.
- `llms.txt`, for now. No solid evidence was found that it affects recommendations.
- Speed or technical work beyond the fixes listed here, unless Search Console shows a real problem.

## Anti-goals: failure even if it technically works

- **Publishing unreviewed content.** Nothing goes live without Niko's approval.
- **Invented facts or proof.** No made-up clients, results, reviews, prices or statistics. Every claim must trace back to Niko or an existing source.
- **Fake engagement.** No written or incentivized fake reviews, and no undisclosed promotional forum posts. The engine may draft review requests, but the words of a review must be the client's.
- **Filler content.** No thin near-duplicate pages made only to catch keyword variations, such as one per neighborhood.
- **Copy that reads as a locked menu.** Voxa's scope is custom, and the copy should signal that flexibility.
- **Breaking what earns money.** Booking, tracking and the paid-traffic homepage must keep working.

## Audit baseline (2026-11-01)

These results come from the live site and one search tool. They are not live Google rankings or real ChatGPT answers, and part of Phase 2 is to capture those.

**Working:** AI and Google crawlers received normal responses. The title names Tampa and podcasts. LocalBusiness and FAQ structured data exist, and FAQ answers are readable in the page's HTML. A third-party [Web Tonic roundup](https://www.webtonic.io/blog/best-podcast-production-agencies-tampa) lists Voxa at #2 and links to the site, though it is self-promotional.

**Gaps:**
- The homepage is the only live page that can rank.
- The H1, "Professional Content Effortlessly", doesn't say what Voxa does or where.
- The page has about 770 words, mentioning "podcast" 14 times, "VSL" twice, "course" once, and "YouTube" and "funnel" not at all.
- `sitemap.xml` and `robots.txt` return 404 in production.
- No reviews appear on the site.
- Structured data links only Instagram and LinkedIn.
- A search for "Voxa Studios" Tampa did not surface voxastudios.com, and other companies called Voxa appeared. This needs confirming in Search Console.
- One search found no Tampa-based VSL production company. That says little about Voxa's actual position as a studio for filming VSLs, so the baseline must test studio searches directly.

## How it works

### Phase 1: Quick fixes (one-time)

- Add a sitemap and `robots.txt` that do not depend on On-Site content.
- Rewrite the homepage H1 so it says what Voxa does and where. The ads rely on message match with this page, so Niko approves the wording.
- Extend the structured data with the Google Business Profile and Peerspace links.
- Add real review quotes with client permission, after checking Peerspace's terms on reuse. Do not add self-serving review star markup.
- Make sure notable client names shown in images are also visible as text, if Niko wants them featured.

### Phase 2: Measurement (one-time setup)

- Connect Google Search Console and submit the sitemap.
- Capture the first real baseline from Search Console. The AI answer baseline waits until those checks restart.
- Check the Google Business Profile and key directories for completeness and matching name, address and phone.

### Phase 3: New service pages

In this order: **a Tampa studio for filming VSLs and Meta ad videos**, then **podcast and YouTube studio in Tampa**, then **course and webinar filming**. Niko says most Authority Desk sessions are VSLs and Meta ads, so that proof exists; naming clients or showing their work needs their permission.

The VSL page must state plainly what's delivered for each set, such as multi-cam files ready for an editor where that applies, so buyers don't expect a finished ad. *Claude's suggestion, untested:* include a short section for funnel builders and ad agencies whose clients need somewhere to film.

Each page leads with a direct answer, states real facts, includes relevant proof and a booking route, and appears in the sitemap. *Claude's call:* the podcast and YouTube page is built for organic search and AI answers, and does not change where ads point. The Ads plan's possible `/podcast-studio-tampa` page stays on its own timeline, after 30+ days of baseline data. If it is built as a separate page, it is set to noindex so the two don't compete; using this page instead is decided then.

*Claude's call:* learner articles start after the first service page ships, through a simple article section. The first topics come from the baseline check, and the monthly loop continues them. Service pages come first because they are closest to a booking.

### Phase 4: The monthly loop (ongoing)

1. **Check.** Pull Search Console data. *AI answer checks are on hold by Niko's decision.* When he restarts them, they run a fixed set of target questions across the AI tools, multiple times each because answers vary, and record whether Voxa appears, how it's described, and what sources are cited.
2. **Compare.** Compare against previous months and look for trends, not one-off results.
3. **Decide.** Choose work using these rules:
   - Search Console shows impressions with few clicks: improve the page's title or answer.
   - Searches relevant to Voxa have no strong page: add or improve a page or article.
   - Once AI checks restart, Voxa is described wrongly: fix the site or the profiles.
   - Once AI checks restart, Voxa is missing and answers mostly cite other sites: pursue listings or reviews, and consider active PR.
4. **Prepare.** Draft a short brief with one or two content items plus any review and listing tasks.
5. **Approve.** Niko reviews, edits and approves. Approved site changes go through normal review and deploy.
6. **Log.** Record what shipped, so later checks can be compared against it.

### Effort split

Claude's recommendation: about 80% website and 20% reviews and listings for now, with no active PR. The monthly check can change this. It is a judgment call, not a proven ratio.

## Constraints

- **Stack:** Next.js 14 on Vercel, with Tailwind. New pages should match the existing components and design (`DESIGN.md`).
- **Branching:** `main` has no sitemap and no On-Site code, while `feature/voxa-onsite` has On-Site plus a sitemap that imports it. This work should branch from `main` so it can ship without On-Site, and the conflict in `app/sitemap.ts` will need resolving when On-Site merges.
- **Owner:** Niko is a solo founder with a non-marketing background, so outputs must be plain-language and action-ready.
- **Timing:** SEO results may take months. Google Ads keeps producing leads in the meantime.

## Success measures

Too little data exists to set honest numeric targets, so targets are set after the first baseline. Measures to track:

- Share of target questions where Voxa appears, by AI tool, and whether descriptions are accurate. Not measured while AI checks are on hold, so AEO progress stays unknown until they restart.
- Search Console impressions, clicks and positions for non-brand Tampa searches.
- Number of Google reviews.
- Inquiries or bookings attributable to organic or AI sources, recognizing that some AI referrals won't be visible in analytics.

## Left to the builder

- Exact URLs, page layouts and internal linking.
- How the monthly run is scheduled, and where its records are stored, provided it stays simple and needs no custom dashboard.

## Deferred

- AI answer checks: the question set, how answers are collected, and their budget are all decided when Niko restarts them.
