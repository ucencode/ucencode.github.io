---
version: alpha
name: Signal Engineered — Catppuccin
description: Personal site of Ahmad Husein Hambali. A dark, neutral-grey tile hub with Catppuccin Mocha accents, borrowed from the owner's own terminal setup.
colors:
  primary: "#b4befe"        # Catppuccin Lavender — proof (Work, Experience, Blog)
  secondary: "#fab387"      # Catppuccin Peach — identity (About, Contact)
  tertiary: "#cba6f7"       # Catppuccin Mauve — other people's voice (Recommendations)
  on-accent: "#11111b"      # Catppuccin Crust — text on any filled pastel
  neutral:
    background: "#1e1e1e"   # pure grey (equal RGB); replace with exact terminal grey
    surface: "#262626"      # tiles
    surface-raised: "#333333" # chips, timeline track
    border: "#333333"
    border-strong: "#444444" # outlined buttons
    text: "#cdd6f4"         # Catppuccin Text
    text-muted: "#a6adc8"   # Catppuccin Subtext0
    text-chip: "#bac2de"    # Catppuccin Subtext1
    bar-muted: "#585b70"    # Catppuccin Surface2 — past roles in timelines
typography:
  display-xl:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: -0.045em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: -0.045em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.03em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
  caption-mono:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
  sm:
    display-xl:
      fontFamily: Space Grotesk
      fontSize: 40px
      fontWeight: 700
      lineHeight: 0.95
      letterSpacing: -0.045em
    headline-lg:
      fontFamily: Space Grotesk
      fontSize: 32px
      fontWeight: 700
      lineHeight: 1
      letterSpacing: -0.04em
    headline-md:
      fontFamily: Space Grotesk
      fontSize: 22px
      fontWeight: 700
      lineHeight: 1.1
      letterSpacing: -0.03em
rounded:
  bar: 1px
  chip: 3px
  md: 6px
spacing:
  gap: 12px
  tile-padding: 24px
  tile-padding-lg: 32px
  page-margin: 48px
  side-tile-min: 280px      # Experience and Contact never narrower than this
  tile-min-height: 260px    # tablet rows; they grow to share the viewport height
  hub-max-width: 1920px     # desktop hub fills the viewport up to this width
  hub-max-height: 900px     # and up to this height
  hub-min-height: 688px     # below this viewport height the page scrolls
  row1-about: 4             # grid fr ratios (desktop)
  row1-work: 5
  row1-experience: 3
  row2-contact: 3
  row2-recommendations: 3
  row2-blog: 4.4
  tile-container-compact: 220px  # container-query content width below which a tile drops its secondary line
  phone-row: 84px
  phone-row-narrow: 92px
  tap-target: 44px
motion:
  hover:
    duration: 150ms
    timingFunction: ease-out
  page-transition:
    duration: 250ms
    timingFunction: ease-in-out
components:
  tile:
    backgroundColor: "{colors.neutral.surface}"
    borderColor: "{colors.neutral.border}"
    rounded: "{rounded.md}"
    padding: "{spacing.tile-padding}"
  tile-label:
    typography: "{typography.label-mono}"
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    height: 50px
  button-secondary:
    backgroundColor: transparent
    borderColor: "{colors.neutral.border-strong}"
    textColor: "{colors.neutral.text}"
    rounded: "{rounded.md}"
    height: "{spacing.tap-target}"
  chip:
    backgroundColor: "{colors.neutral.surface-raised}"
    textColor: "{colors.neutral.text-chip}"
    rounded: "{rounded.chip}"
    typography: "{typography.caption-mono}"
---

# DESIGN.md — ucencode.github.io

## Overview

A calm, engineering-flavoured personal site for a Fullstack & Product Engineer. The homepage is a **tile hub**: six destinations on one screen, each tile showing **a signal, not everything** — just enough to make a visitor curious, with the full story on the inner page.

The look comes from the owner's real setup: a terminal running **Catppuccin** on a **neutral grey** background. Pastels appear the way syntax colours do in a terminal — as accents on a dark grey surface, never as filled blocks.

It should feel structured, quiet and credible to recruiters and engineering leads; personal without being playful; nothing that reads as a generated "AI dark mode" template.

## Colors

Three accent groups, each with a meaning. Colour always signals group, never decoration.

- **Lavender (#b4befe) — Primary, "proof":** Work, Experience, Blog. Route labels, the current role in timelines, key data.
- **Peach (#fab387) — Secondary, "identity":** About and Contact. The role line under the name, and the **Email me** button — the only filled pastel element on the page.
- **Mauve (#cba6f7) — Tertiary, "other people's voice":** Recommendations. Quote marks and the highlighted phrase in a quote.
- **Neutrals:** pure greys (equal R, G and B) for background, tiles and borders; Catppuccin Text and Subtext for type.

Text placed on a filled pastel always uses Crust (#11111b). No green anywhere.

## Typography

Three heading sizes only; size follows priority, not taste. Sizes are **fluid**: each scales with viewport width between its `sm` minimum and its desktop maximum using `clamp()` — e.g. `clamp(40px, 4.4vw, 64px)`, `clamp(32px, 3.4vw, 48px)`, `clamp(22px, 2vw, 28px)` — so the three steps stay proportional at every width. On the desktop homepage the headings scale with the hub width instead of the viewport (hub width × 64/1440, 48/1440 and 28/1440) and stop at their full size, so text shrinks together with the tiles but does not grow past 64 / 48 / 28px on wide hubs.

- **Display XL (64px):** the owner's name — used once.
- **Headline LG (48px):** the top-priority destination (My Work).
- **Headline MD (28px):** every other tile or section title.
- **Body (16 / 14px, Inter):** reading text and supporting lines.
- **Labels (JetBrains Mono, 13 / 11px):** route labels (`/projects`), dates, stack names and other data — the engineering voice.

## Layout

Destination priority sets tile size: **Work > Experience > Blog**. About carries the largest type because the name comes first.

**Fluid, not fixed.** No pixel widths on tiles. Widths are grid fractions with minimums; heights are ranges; type uses `clamp()`; breakpoints only switch structure.

- **Desktop (≥1200px):** two CSS-grid rows of equal height, 12px gap, page margin `clamp(16px, 3.3vw, 48px)`. Row 1: `4fr 5fr minmax(280px, 3fr)` (About · My Work · Experience). Row 2: `minmax(280px, 3fr) 3fr 4.4fr` (Contact · Recommendations · Blog in the corner). The hub has no fixed ratio: it fills the viewport up to 1920px wide and 900px tall, and its tile shapes follow the window. Below a viewport height of 688px the page scrolls rather than squeezing the tiles. Beyond the maximum, as on ultrawide screens or very tall windows, the hub is centred horizontally and aligned to the top.
- **Tiles adapt to their own size:** each tile is a container (`container-type: inline-size`); below ~220px of content width it drops its secondary line and keeps only label, title and arrow.
- **Tablet (700–1199px):** two-column grid (1.2fr / 1fr) in pairs: About|Work · Experience|Blog · Recommendations|Contact. The three rows share the viewport height (`minmax(260px, 1fr)`), so a portrait tablet has no empty area below the grid; a landscape tablet scrolls.
- **Phone (<700px):** a taller About block (`min-height: clamp(185px, 28vh, 240px)`), then five equal-height navigation rows (84px; 92px under 360px) in priority order: Work, Experience, Blog, Recommendations, Contact. Rows are navigation — label, one line, arrow — not shrunken tiles.
- DOM order follows the phone and tablet order. Desktop row 2 places its tiles with `grid-template-areas`, so Blog comes first in the DOM but sits in the right corner.

## Elevation & Depth

Flat. Depth comes only from the step between background (#1e1e1e) and tile surface (#262626) plus a 1px border. No shadows, glows, gradients or glass.

## Shapes

Tight, near-sharp corners: 6px for tiles and buttons, 3px for chips, 1px for timeline bars. Icons come from Lucide (`lucide-react`) at its default 2px stroke, with no circular or boxed backgrounds; tile corners use `ArrowUpRight`.

## Motion & Micro-interaction

Minimal and purposeful.

- **Hover/focus on tiles:** border brightens and the corner arrow nudges up-right (150ms ease-out). Visible keyboard focus everywhere.
- **Tile → page:** a view transition where the tile expands into its page (250ms).
- No scroll-reveal on the homepage, no parallax, no custom cursors. Everything respects `prefers-reduced-motion`.

## Voice & Content Strategy

- Show a signal, not everything. One line per tile.
- Concrete over clever: real numbers and real artefacts (build time −25%, 18s → 1–2s) beat adjectives.
- Recommendations quote one line per person, name replaced with "[He]", with a link to the full text. Translations are labelled.
- No taglines that make claims the content doesn't prove. No location anywhere on the site.

## Components

- **Tile:** surface, 1px border, 6px radius, mono route label top-left in its group colour, arrow top-right only if the whole tile is a link.
- **Button, primary:** Peach fill, Crust text, 50px tall. One per view (Email me).
- **Button, secondary:** transparent, 1px #444 border, 44px tall (LinkedIn, GitHub).
- **Chip:** raised surface, mono 11–12px, 3px radius.
- **Timeline:** one 6px lane per role on a #333 track; past roles #585b70, current/latest role in Lavender.

## Do's and Don'ts

**Do**
- Use a group colour only for its own group's tiles and pages.
- Keep pastels as accents; Email me is the only filled pastel.
- Keep to the three heading sizes.
- Size tiles by priority (Work > Experience > Blog).
- Use `fr`, `minmax()`, `clamp()` and container queries; let breakpoints change structure only.
- Use real data; leave clearly marked placeholders where content is missing.

**Don't**
- Don't fill tiles with pastel colour (reads as sticky notes).
- Don't use green, mint, neon, glow, glass or gradient washes.
- Don't add featured or hype layouts (oversized hero testimonials, "trusted by" claims).
- Don't copy reference designs literally.
- Don't show location, or anything that invites filtering people out.
- Don't hard-code tile widths or heights in px (the canvas mockups are 1440px snapshots, not specs). The only fixed sizes are the desktop hub's maximum and minimum and the phone row heights.
