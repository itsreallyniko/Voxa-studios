# Tim Butt 2 — portfolio inventory for Voxa On-Site landing pages

Source: https://www.timbutt2.com/ (video-work, photography, about, services pages).

## Rules of the road

- These are **Tim's past projects**, not Voxa On-Site projects. Use requires Tim's permission, and in some cases the original client's permission. Label honestly ("selected work from our team" rather than "Voxa On-Site case studies") until a project is actually shot under the Voxa On-Site banner.
- **Vimeo URLs**: trust only ones that end in a numeric ID (e.g. `vimeo.com/2089454540`). Any URL with a long random-looking slug in this doc should be verified against the real link on timbutt2.com before using — those came back from an automated fetch and may be hallucinated.
- **YouTube IDs** below are reliable.
- No assets have been downloaded. Pulling anything into `/public/` is a separate step that needs Tim's sign-off.

---

## `/onsite` hub

**Hero muted-loop candidate (interim, until Voxa-shot reel exists):**

- Tim Butt 2 Productions Reel (mid-2019 → Q1 2023). Pull real URL from timbutt2.com /video-work. Thumbnail: `images.squarespace-cdn.com/content/v1/66289645e0a89b5429d7c0b9/5127086b-c393-4e33-8d08-3c1a74042b3c/thumb.png`.

---

## `/onsite/testimonial-videos-tampa`

Buyer: clinics, med spas, law firms, financial advisors, real estate.

**Case study slots (3):**

1. **Dedicated Senior Medical Center — FINAL CUT 2022** — healthcare facility with interviews. Archetype. (Vimeo URL — verify on site.)
2. **TrueLimb Prosthetic Arm Journey — Meet Jessica** — patient story for prosthetics company. YouTube: `https://www.youtube.com/watch?v=p681WHF3s1I`
3. **Welcome to Piper Family Dentistry** — small dental practice. YouTube: `https://www.youtube.com/watch?v=8bBxKGRrmTM`

**Secondary / b-roll / stills:**

- Common Spirit — Marvin O'Quinn Address (healthcare exec interview)
- Common Spirit — 2023-05-04 Address (healthcare exec interview)
- JR Rivas / Instant Leverage — business-owner testimonial. YouTube: `https://www.youtube.com/watch?v=fUjoVG7xoFA` (if we want a financial / advisor example)
- Weylman — generic corporate (lower priority)

---

## `/onsite/event-video-tampa`

Buyer: associations, conferences, company kickoffs, galas.

**Case study slots (3):**

1. **Splitt'n Clays for Charity 2021** — multi-cut charity event (3-min + 1-min). Association / charity archetype.
2. **Luxe Lingerie Fashion Show 2020** — multi-cam runway. YouTube: `https://www.youtube.com/watch?v=Dx4jdAr0MD4`
3. **Project Dark Arts 2019** — arts event coverage. YouTube: `https://www.youtube.com/watch?v=OYtNOG7fmQo`

**Hero muted-loop candidate:**

- Cinephiliac's Social Club — Pool Party at Dolphin House Promo (atmosphere-forward)

**Secondary / b-roll / stills:**

- Breeze Brazilian Bikini Fashion Show 2019. YouTube: `https://www.youtube.com/watch?v=raUa0P4uYro`
- The Constant Live from the Canal Room (live music / stage visuals)
- 2016 Killington Stage Race (useful if we want to show multi-day event coverage)
- 2017 Veterans Day at Harley-Davidson
- Killington THE BEAST Spartan Race 2014

---

## `/onsite/advocacy-education-video` (draft — keep behind the current gate)

Buyer: school districts, education nonprofits, foundations.

**Case study slots (3):**

1. **Woodstock Union High School — "We Are Woodstock"** — school identity video. Archetype.
2. **Garden Club of America Centennial Video Tour** — institutional nonprofit.
3. **L&D "Detective Kit for Solving Impact Mysteries"** — education / learning. YouTube: `https://www.youtube.com/watch?v=-a-Gy4nVAmA`

**Overlap note:**

- TrueLimb — Meet Jessica reads as both testimonial and advocacy. Pick one page or the other, not both, so each page has distinct examples.

---

## Crew block (Tim)

**Photo candidates from his About page:**

- `https://images.squarespace-cdn.com/content/v1/66289645e0a89b5429d7c0b9/70ec8ff4-84cf-45f8-a4d4-c2f31a4424cc/20211121_165447.jpg`
- `https://images.squarespace-cdn.com/content/v1/66289645e0a89b5429d7c0b9/b73b694c-2ab1-44ef-8223-405cb69bc098/20240825_IMG02437_2024-selfportrait-digital-1x1.jpg` ← cleaner 1:1 crop, likely best for the circular avatar slot
- `https://images.squarespace-cdn.com/content/v1/66289645e0a89b5429d7c0b9/0536ed9f-5293-46b2-a7b9-81f0e44f7afb/IMG_3945.jpeg`

**Bio draft (voice-adjusted, condensed from his About):**

> Drexel Cinema & Television grad. First feature-film credit at seventeen. Based in Tampa, working across Florida — cinematography, direction, and color.

Save the chosen photo to `/public/crew/tim-butt-dp.jpg` after Tim OKs it, then wire into `lib/content/onsite/pages/*.ts` under `crew`.

---

## Proof strip — do NOT use Tim's thumbnails

The proof strip wants real client marks or verifiable stats, not reel thumbnails.

**Logos to try to source (with permission):**

- Dedicated Senior Medical Center
- Common Spirit Health
- TrueLimb
- Piper Family Dentistry
- Garden Club of America
- Woodstock Union High School

**Easier near-term alternative:** a 2–3 stat row instead of logos. Only populate with numbers Tim and you can both verify (e.g. "60+ interviews filmed in-field", "N projects across Tampa Bay"). Don't invent.

---

## What NOT to pull from Tim's reel for these pages

- All the model / fashion portfolio work (vast majority of his library). Different buyer, dilutes the message.
- Camera / lens tests.
- Music videos.
- Narrative shorts (Virago, Falling Foliage, Star Wars fan film).

---

## Next-step checklist

- [ ] Share this file with Tim and confirm which pieces he's OK to feature.
- [ ] Confirm labeling: "Tim's past work" vs. "Voxa On-Site case studies" (recommend the former until Voxa-shot work exists).
- [ ] Pull real Vimeo URLs from timbutt2.com for anything that will be embedded.
- [ ] Request original clients' permission for the healthcare / education / nonprofit pieces where their name is on screen.
- [ ] Decide where TrueLimb — Meet Jessica lands (testimonial OR advocacy, not both).
- [ ] Pick Tim's headshot, drop into `/public/crew/`, wire into `lib/content/onsite/pages/*.ts`.
- [ ] Once Tim gives OK, update each page's `cases` and `crew` in content files — no code changes needed.
