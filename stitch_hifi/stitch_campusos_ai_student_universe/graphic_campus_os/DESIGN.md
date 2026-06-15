---
name: Graphic Campus OS
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#4d4732'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#7e775f'
  outline-variant: '#d0c6ab'
  surface-tint: '#705d00'
  primary: '#705d00'
  on-primary: '#ffffff'
  primary-container: '#ffd700'
  on-primary-container: '#705e00'
  inverse-primary: '#e9c400'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#00668a'
  on-tertiary: '#ffffff'
  tertiary-container: '#aee0ff'
  on-tertiary-container: '#00668a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe16d'
  primary-fixed-dim: '#e9c400'
  on-primary-fixed: '#221b00'
  on-primary-fixed-variant: '#544600'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#c3e8ff'
  tertiary-fixed-dim: '#7ad0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e1'
typography:
  display-lg:
    fontFamily: Anton
    fontSize: 72px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
  label-sm:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.2'
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  border-width: 4px
  shadow-offset: 8px
---

## Brand & Style
This design system is built on a high-octane "Comic Book" aesthetic, designed to transform a campus operating system into an energetic, narrative-driven experience. The style draws heavily from pop-art and manga influences, utilizing "The Gutters" (negative space) and "Panels" (containers) to organize information.

The visual mood is **dynamic, tactile, and authoritative**. It rejects the sterile, flat trends of modern SaaS in favor of a "printed-on-paper" feel. It aims to evoke the excitement of a new volume release—using bold outlines, expressive typography, and hard-edge shadows to create a UI that feels physically punched out of the screen. The target audience is a youthful, creative student body that values personality over corporate transparency.

## Colors
The palette is dominated by **Hero Yellow**, a high-energy primary used for calls-to-action, active states, and critical highlights. To ground the digital experience, we utilize a **Paper Neutral** (#F4F4F2) background, which mimics the slight off-white of newsprint or manga tankōbon pages.

- **Primary (Hero Yellow):** Used for primary buttons and status indicators.
- **Secondary (Inked Black):** Used for all structural outlines, heavy shadows, and primary text.
- **Tertiary (Action Cyan):** Reserved for secondary accents or link states to provide a cooling contrast to the yellow.
- **Paper Background:** Used for the main canvas. Pure white (#FFFFFF) is reserved strictly for the interior of "Panels" (cards) to make them pop against the paper background.

## Typography
Typography is treated as a graphic element. **Anton** is used for headlines to provide a bold, condensed, and impactful "shouting" effect typical of comic titles. It should always be used in uppercase for display levels.

**Hanken Grotesk** provides a clean, highly legible counterpoint for body text, ensuring that dense campus information remains readable. **Space Mono** is used for functional labels, metadata, and "captions," nodding to the technical/monospaced aesthetic of comic book indicia and production notes.

## Layout & Spacing
The layout follows a **Panel-Based Grid**. Surfaces are treated as comic panels, separated by wide gutters (24px). 

- **Desktop:** A 12-column fluid grid with 40px outer margins. Panels should span at least 3 columns.
- **Mobile:** A 4-column grid with 16px margins.
- **Dynamic Tilts:** On desktop, larger feature cards should occasionally use a slight rotation (between -1deg and 1deg) to break the "perfect" digital grid and add kinetic energy.
- **Rhythm:** Spacing should be generous. Avoid cramped clusters; treat the negative space as the "gutter" between story beats.

## Elevation & Depth
This system abandons Z-axis blurs. Depth is achieved through **Hard Offset Shadows** and **Tonal Stacking**.

1.  **Level 0 (Base):** The Paper Background.
2.  **Level 1 (Panels):** White fill, 4px black border, 8px 8px 0px black shadow.
3.  **Level 2 (Active/Hover):** When a panel or button is interacted with, the shadow offset increases to 12px or the element shifts -4px / -4px to simulate a "pop" toward the reader.
4.  **Halftone Overlays:** Use a subtle halftone dot pattern on secondary surfaces or sidebars to create visual texture without increasing structural "weight."

## Shapes
The shape language is strictly **Geometric and Sharp**. 

All containers, buttons, and input fields must use **0px border-radius**. This reinforces the "cut-paper" aesthetic. The only exception to the sharp-edge rule is for **Speech Bubbles** (tooltips) and **Action Bursts** (badges), which use clipped paths or SVG shapes to create jagged, explosive borders. 

All primary containers must feature a thick **4px solid black stroke**.

## Components
- **Buttons:** Rectangular with a 4px black border. Primary buttons have a Hero Yellow fill. On hover, they "push down" (translate 4px, 4px) and the shadow disappears to simulate a physical mechanical press.
- **Cards (Panels):** Always white background. Headers within cards should be separated by a 4px horizontal black line.
- **Input Fields:** White background, 4px black border. On focus, the border changes to Action Cyan or Hero Yellow, and the hard shadow appears.
- **Tooltips:** Styled as speech bubbles with a triangular "tail" pointing to the trigger.
- **Chips/Badges:** Use a "Burst" shape (zigzag edges) for alerts or high-priority notifications. For standard tags, use a simple black box with white Space Mono text.
- **Progress Bars:** Blocky and segmented. Instead of a smooth fill, use a series of black and yellow slanted stripes (caution tape style) or solid blocks.
- **Navigation:** Use heavy vertical borders to separate sidebar links, resembling the vertical gutters in manga.