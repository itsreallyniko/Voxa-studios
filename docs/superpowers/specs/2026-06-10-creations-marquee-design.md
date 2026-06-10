# Creations Marquee — "See What Gets Created Here"

**Date:** 2026-06-10
**Component:** `components/marketing/example-content-slider.tsx` (renaming TBD during implementation; mounted in `app/page.tsx`)
**Status:** Design approved — pending implementation plan

## Goal

Replace the current 3-card manual slider with a constantly-scrolling marquee of real guest photos from Voxa's sets. The marquee must read as visually uniform despite mixing landscape and portrait source images, and each card must clearly identify which set the shot was filmed in.

## Source Material

Six photos in `Scrolling_Images/` (will be moved to `public/`):

| File | Native px | Aspect | Set (line 1) | Byline (line 2) |
|---|---|---|---|---|
| `Mirandacohenfit.jpg` | 1170×663 | 16:9 | EXECUTIVE CREATOR SET | @mirandacohenfit |
| `Jasonkalambay.jpg` | 1170×656 | 16:9 | EXECUTIVE CREATOR SET | @jasonkalambay |
| `julietteastor.jpg` | 1170×2084 | **9:16** | EXECUTIVE CREATOR SET | @julietteastor |
| `matt_thecloser.jpg` | 1170×679 | 16:9 | AUTHORITY DESK | @matt_thecloser |
| `NYT_Ross_Douthat.jpg` | 2084×1170 | 16:9 | EXECUTIVE PODCAST SET | Interesting Times · NYT |
| `NYT_Anna_paulina_luna.jpg` | 2084×1170 | 16:9 | EXECUTIVE PODCAST SET | Interesting Times · NYT |

Mix: 5 landscape (16:9-ish) + 1 portrait (9:16).

## Visual Design

### Card pattern — Editorial Polaroid

Each photo sits inside an identical outer card "chrome":

- Card surface: `bg-surface-container-low` (or equivalent dark glass) with `border-white/5` and `rounded-2xl`.
- Interior padding around the image: ~12–16px on all four sides (the "mat").
- Image area keeps its native aspect ratio — no cropping.
- A divider hairline (`border-white/5`) separates image from caption.
- Caption strip below image with two lines:
  - **Line 1:** Set name in `text-heritage-gold`, uppercase, tracked-out small caps (e.g. `text-[10px] tracking-[0.4em] uppercase`).
  - **Line 2:** Byline in `text-white/60`, lower-case, regular weight (e.g. `text-sm`).

### Card geometry — Variable width, same height

All cards share the **same total height** (image area + caption strip). Card **width flexes** with the image's native aspect:

- Landscape cards become wider.
- The single portrait card becomes narrower.

The eye locks onto the consistent height and the identical caption strip; the variable widths read as gallery rhythm, not chaos.

Target total card height: ~520px on desktop, ~360px on mobile. Tunable during implementation.

### Motion — Slow editorial drift

- Direction: right → left, continuous.
- Speed: full loop in ~60 seconds. Use a CSS `@keyframes` translateX animation on the track.
- Looping: duplicate the card list inline so the animation can translate by exactly half the track and snap back invisibly (standard CSS marquee pattern).
- Edge mask: section edges fade to the section background (`bg-surface-container-lowest`) via a horizontal CSS mask gradient (transparent at the very edge → opaque ~96px in). Cards appear to dissolve in/out of the void.
- Hover behavior:
  - The entire marquee pauses (`animation-play-state: paused`).
  - The hovered card raises slightly (`translate-y-[-4px]` or scale 1.02).
  - Sibling cards dim (`opacity-50` with a smooth transition).
- No manual nav buttons. No drag affordance text. The current `arrow_back` / `arrow_forward` buttons and "Drag to explore" strip are removed.

### Section frame (unchanged)

- Heading "See What Gets Created Here" stays.
- Section background, padding, and container width follow the existing implementation.

## Data Shape

```ts
type Creation = {
  src: string          // /creations/<filename>
  alt: string
  aspect: '16:9' | '9:16'
  set: string          // line 1
  byline: string       // line 2
}
```

Six entries hard-coded in the component module — no CMS, no fetch. Order in array = order in the marquee (then duplicated for the loop).

## File Layout

- Images moved from `Scrolling_Images/` → `public/creations/` (Next.js static asset convention).
- Existing component file `components/marketing/example-content-slider.tsx` is rewritten in place. Filename can stay — the export name and internal logic change. Decide during implementation whether renaming is worth the import churn in `app/page.tsx`.
- The original `Scrolling_Images/` directory is deleted once the move is verified.

## Accessibility

- Each `<img>` has a descriptive `alt` (e.g. `"Miranda Cohen on the Executive Creator Set"`).
- Respect `prefers-reduced-motion: reduce`: pause the marquee animation entirely, render cards as a static row that scrolls horizontally on overflow.
- Marquee is not keyboard-interactive in this version (no buttons). Anyone who needs to inspect cards closely can pause via hover or via reduced-motion.

## Out of Scope (explicit YAGNI)

- Click-to-lightbox / enlarge view.
- Manual prev/next nav buttons.
- Drag-to-scroll handler.
- CMS-driven content.
- Multi-language captions.
- Video cards (images only for this iteration).

## Implementation Notes for Plan Stage

- Use a single keyframe animation on a wrapping flex track; duplicate children inline. No JS for the animation itself.
- `aria-hidden="true"` on the duplicated set to avoid screen-reader repetition.
- `next/image` with `sizes` based on the card height; `priority` only on the first 2–3 cards.
- Edge mask: `mask-image: linear-gradient(to right, transparent, black 96px, black calc(100% - 96px), transparent)`. Provide a `-webkit-mask-image` fallback.
- Hover dim: handled via group hover on the marquee container — `group-hover:opacity-50` on each card, override to `opacity-100` on the hovered card itself via `hover:opacity-100 hover:!opacity-100`.
