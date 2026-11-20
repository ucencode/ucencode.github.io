# Design decisions — personal website redesign

Updated 20 Nov 2026. Source of truth for what's settled. Canvas: "Personal website redesign — homepage hub". Visual rules: `claude/DESIGN.md`. Build handoff: `claude/implementation-brief.md`.

## Locked
- **Homepage:** tile hub, version **E2 · Catppuccin accents** (terminal style).
- **Palette:** neutral grey (equal RGB) background `#1e1e1e`, tiles `#262626`; Catppuccin Mocha text `#cdd6f4` / subtext `#a6adc8`. No green anywhere.
- **Colour groups:** Peach `#fab387` = identity (About, Contact) · Lavender `#b4befe` = proof (Work, Experience, Blog) · Mauve `#cba6f7` = others' voice (Recommendations). Pastels are accents only; the Email button is the only filled pastel.
- **Rule:** homepage shows *a signal, not everything*.
- **Size priority:** Work > Experience > Blog. About carries the largest text (name).
- **Type scale:** three heading sizes, fluid — name 40–64px, My Work / page titles 32–48px, other titles 22–28px.
- **Layout is fluid:** grid fractions + minmax, `clamp()` type, container queries; breakpoints only switch structure. Canvas mockups are 1440px snapshots, not specs.
- **Desktop hub sizing (20 Nov):** no fixed ratio. The hub fills the viewport up to 1920×900, with a 688px minimum height (page scrolls below it). Headings scale with the hub width and stop at 64 / 48 / 28px. Beyond the maximum, the hub is centred horizontally and aligned to the top. A fixed 16:10 ratio was tried first and left large side margins on common 1080p browser windows.
- **Homepage bottom row:** Contact · Recommendations · Blog (Blog in the wider corner slot).
- **Work tile:** title "My Work", route stays `/projects`, line "healthcare SaaS · ERP · AI". No screenshot or stack tags on the homepage.
- **Inner pages:** structured spec-sheet style (numbered sections, margin notes), recoloured to E2 (19 Nov). Exported as static references in `design/`.
- **Recommendations:** 4 people (Trio Sutardi, Surya Surakhman, Abdurrahman Al Hanif, Aftar Fadilah), one key line each, compact symmetric 2×2, name replaced with "[He]". Aftar's shown in English with a "translated from Indonesian" label.
- **No location** on the site.
- **Rejected:** filled pastel tiles (sticky-note feel), mint-on-dark (AI-made look), featured/hype testimonial layouts, copying reference designs literally.

## Open
- Flat vs shaded tiles (subtle gradient + 1px top highlight) — both exported.
- What the Experience and Recommendations tiles show (apply the signal rule).
- Contact label (`/contact` isn't a real page).
- "Founding Engineer" wording (role ended Dec 2025).
- Fonts (Space Grotesk + JetBrains Mono, or a neutral sans for headings).
- /blog and the post page still use the older layout (recoloured only) — owner practice task.
- Phone/tablet mockups for E2 (rules exist in DESIGN.md; no artboards yet).

## For the code phase
- Add the two new recommendations + each key line to `src/data/testimonials.ts`; Surya's title is now "Senior Software Engineer".
- Colours as CSS variables so a Catppuccin flavour switch (Latte ↔ Mocha) stays cheap.
