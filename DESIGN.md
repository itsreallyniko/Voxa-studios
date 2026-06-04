---
name: Cinematic Obsidian
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#383939'
  surface-container-lowest: '#0d0e0f'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#292a2a'
  surface-container-highest: '#343535'
  on-surface: '#e3e2e2'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e3e2e2'
  inverse-on-surface: '#303031'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c9c6c5'
  primary: '#c9c6c5'
  on-primary: '#313030'
  primary-container: '#0d0d0d'
  on-primary-container: '#7c7a7a'
  inverse-primary: '#5f5e5e'
  secondary: '#cac6be'
  on-secondary: '#32302b'
  secondary-container: '#494741'
  on-secondary-container: '#b9b5ad'
  tertiary: '#e4c285'
  on-tertiary: '#412d00'
  tertiary-container: '#140c00'
  on-tertiary-container: '#937741'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e7e2da'
  secondary-fixed-dim: '#cac6be'
  on-secondary-fixed: '#1d1c17'
  on-secondary-fixed-variant: '#494741'
  tertiary-fixed: '#ffdea4'
  tertiary-fixed-dim: '#e4c285'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5a4312'
  background: '#121414'
  on-background: '#e3e2e2'
  surface-variant: '#343535'
  obsidian: '#0D0D0D'
  ivory: '#F5F0E8'
  heritage-gold: '#C9A96E'
  slate-gray: '#333333'
  muted-text: '#888888'
typography:
  display-lg:
    fontFamily: DM Sans
    fontSize: 72px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: DM Sans
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: DM Sans
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  headline-md:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
    letterSpacing: 0.02em
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-caps:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.4em
  metadata:
    fontFamily: DM Sans
    fontSize: 10px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 40px
  margin-edge: 64px
  section-gap: 120px
---

## Brand & Style

The design system embodies the intersection of a high-end creative agency and a premium financial institution. It is tailored for founders and professionals who value precision, discretion, and excellence. The aesthetic is **Cinematic Minimalism**—prioritizing extreme clarity, significant negative space, and an editorial composition that feels both spacious and authoritative.

The emotional response should be one of "quiet luxury." Unlike aggressive tech brands, this system uses "Obsidian Black" and "Warm Ivory" to create a high-contrast environment that feels like a gallery or a private members' club. Motion should be subtle and purposeful, utilizing ease-in-out transitions that mimic the dampened feel of premium hardware.

## Colors

The palette is anchored by **Obsidian Black (#0D0D0D)**, which serves as the primary canvas. **Warm Ivory (#F5F0E8)** provides a sophisticated alternative to pure white, softening the visual vibration of high-contrast text. 

**Heritage Gold (#C9A96E)** is the sole chromatic accent. It must be used sparingly to denote premium status—typically for brand marks, primary calls to action, or subtle underlines. Secondary text utilizes a muted gray to maintain hierarchy and prevent the Ivory from overwhelming the viewer in dense information blocks. Use the "Slate Gray" (#333333) specifically for structural elements like borders and dividers to keep them almost invisible against the Obsidian background.

## Typography

The system relies on **DM Sans** to achieve a geometric yet approachable character. The defining characteristic of the typography is the aggressive use of **letter-spacing (tracking)** for headlines and labels. 

Large display type should be set with slight negative tracking for a "tight" editorial feel, while all labels and category markers must be set in uppercase with significant tracking (0.4em) to evoke luxury branding. Body text should remain clean and unaltered for maximum readability. Avoid bold weights; use size and tracking to establish hierarchy rather than thickness.

## Layout & Spacing

This design system uses a **Fixed Grid** model for desktop to maintain the "editorial" feel of a physical magazine. Content is centered within a 1440px container. 

The rhythm is based on a strict 8px increment, but the defining feature is "Over-spacing." Sections are separated by large gaps (120px+) to allow the content to breathe. Use a 12-column grid with wide 40px gutters. On mobile, margins reduce to 24px and the grid collapses to a single column, but vertical spacing must remain generous to preserve the premium feel.

## Elevation & Depth

Depth is achieved through **Tonal Layering** rather than traditional drop shadows. In a dark environment, surfaces closer to the user are subtly lighter (e.g., #1A1A1A) rather than floating with shadows.

For a cinematic feel, use **Glassmorphism** for navigation bars and overlays. Apply a 20px backdrop blur with a 5% Ivory fill to create a "frosted obsidian" effect. If borders are required for definition, use 1px "Slate Gray" strokes. Avoid heavy shadows; if a shadow is necessary for a floating modal, use a large, 0%-opacity-to-20%-opacity diffused glow tinted with #000000.

## Shapes

The shape language is **Soft Rectangular**. We use a 6px (`0.25rem` or `Soft`) base radius for all containers, cards, and buttons. This creates a refined, custom-tailored look that avoids the playfulness of pill shapes or the harshness of sharp corners. 

Buttons and input fields should strictly follow the 6px rule. The brand mark "V" is the only element allowed to be perfectly sharp and angular, acting as a technical contrast to the softened UI elements.

## Components

### Buttons
Primary buttons use a **Heritage Gold** background with **Obsidian Black** text. No border. On hover, the background should transition to a slightly brighter gold. Secondary buttons are Ivory text with a 1px Slate Gray border.

### Cards
Cards are flat Obsidian surfaces with a 1px Slate Gray border. There is no elevation. Content within the card should follow the 40px padding rule. Use the `label-caps` typography for category tags at the top of the card.

### Input Fields
Fields are transparent with a bottom-only border (1px Slate Gray). Focus states transition the border color to Heritage Gold. Labels always use the `label-caps` style and sit above the field.

### Hero Sections
Hero sections should feature a "Cinematic" height (minimum 80vh). Text should be center-aligned or dramatically left-aligned with a minimum of 64px edge margins. Backgrounds should favor high-quality, desaturated photography or deep obsidian gradients.

### Dividers
Use ultra-thin (0.8px to 1px) vertical and horizontal lines in Slate Gray to separate content blocks, mimicking the structure of a technical architectural drawing.