# Implementation brief — E2 redesign (for a Claude Code session)

Repo: `ucencode/ucencode.github.io` (Astro 7 + React islands + Tailwind v4, data in `src/data/`, deploy via `npm run deploy`). Follow the repo's CLAUDE.md workflow: branch `redesign/bento-ui`, lint, build, Conventional Commits. Design source: canvas "Personal website redesign — homepage hub", artboard **E2 · Catppuccin accents**. Visual rules: `claude/DESIGN.md`. Decisions log: `claude/design-decisions.md`.

## Scope of v1 (build this)
Tokens, homepage grid (desktop/tablet/phone), new routes, data updates, header. **Leave for the owner to practise:** hover/focus polish, view transitions, Latte↔Mocha switcher, /blog + post page restyle.

## 1. Tokens (`src/styles/global.css`, CSS variables)
- `--bg #1e1e1e` (owner may replace with exact terminal grey), `--tile #262626`, `--border #333333`, `--border-strong #444444`
- `--text #cdd6f4`, `--subtext #a6adc8`, `--chip-text #bac2de`, `--track #333333`, `--muted-bar #585b70`
- Groups: `--peach #fab387` (About, Contact) · `--lavender #b4befe` (Work, Experience, Blog) · `--mauve #cba6f7` (Recommendations). No green anywhere. Pastels are accents only; the Email button is the only filled pastel (text `#11111b`).
- Type scale (fluid, `clamp()`): name `clamp(40px, 4.4vw, 64px)` / My Work `clamp(32px, 3.4vw, 48px)` / other tile titles `clamp(22px, 2vw, 28px)` / 16 body / 13 mono labels. Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (labels/data).
- Radius 6px tiles & buttons, 3px chips, 1px timeline bars. Gap 12px. Page padding `clamp(16px, 3.3vw, 48px)`. **No fixed px widths or heights on tiles** — canvas sizes are 1440px snapshots, not specs.

## 2. Homepage tiles (rule: show a signal, not everything)
Each tile: mono route label in its group colour top-left, arrow icon top-right if the whole tile is a link.
- **About** → `/about`: "Ahmad Husein Hambali" (display-xl), "Fullstack & Product Engineer" (mono, peach).
- **My Work** → `/projects`: title "My Work" (headline-lg), line "healthcare SaaS · ERP · AI". No screenshot, no stack chips.
- **Experience** → `/experience`: 5-lane timeline 2018–2025 (NoscAi bar lavender, others `--muted-bar`), "Founding Engineer" (headline-md), "NoscAi GmbH · 5 roles total". (Wording still open.)
- **Contact** (not a link): label `/contact` (still open), "Get in touch", **Email me** (peach filled, mailto), LinkedIn + GitHub outlined.
- **Recommendations** (not a whole-tile link; the "All recommendations →" link goes to `/recommendations`; on phone it becomes a link row "Recommendations · N people"): one sentence — "He was someone *others relied on* because of his strong understanding of the product, engineering, and quality." (phrase in mauve), "Trio Sutardi · Lead QA Engineer", "All recommendations →".
- **Blog** → `/blog`: "Writing" (headline-md), "N posts · backend · engineering · typescript", with N counted from the non-draft posts at build time.

## 3. Layout (fluid)
- **Desktop (≥1200):** CSS grid. Row 1 `grid-template-columns: 4fr 5fr minmax(280px, 3fr)` (About | My Work | Experience). Row 2 `minmax(280px, 3fr) 3fr 4.4fr` (Contact | Recommendations | Blog in the corner), placed with `grid-template-areas`. The two rows share the hub height equally. The hub fills the viewport up to 1920×900, with a 688px minimum height below which the page scrolls. Heading sizes on the hub scale with its width and stop at their full size. Beyond the maximum, the hub is centred horizontally and aligned to the top.
- **DOM order** follows the phone and tablet order (About, Work, Experience, Blog, Recommendations, Contact); only desktop row 2 is reordered by grid areas.
- **Tiles as containers:** `container-type: inline-size` on each tile; under ~220px of content width a tile hides its secondary line (keeps label, title, arrow).
- **Tablet (700–1199):** 2-col grid `1.2fr 1fr`, pairs: About|Work · Experience|Blog · Recommendations|Contact. Rows `minmax(260px, 1fr)` with the hub at least the viewport height, so portrait tablets have no empty area below the grid.
- **Phone (<700):** About block `min-height: clamp(185px, 28vh, 240px)`, then 5 equal-height navigation rows (84px; 92px under 360px) in order Work, Experience, Blog, Recommendations, Contact. Rows are navigation (label + short line + arrow), not shrunken tiles. Contact row: Email / LinkedIn / GitHub as 44px tap targets.
- Breakpoints only switch structure; everything between them is handled by fr / minmax / clamp / container queries.
- Prefer one `BentoGrid.astro` driven by a small `src/data/tiles.ts` config (id, group, href, size).

## 4. Routes
Existing: `/projects/[id]`, `/blog`, `/blog/[slug]`. Add: `/about`, `/projects` (index, page title "My Work"), `/experience`, `/recommendations`. Inner pages use the same tokens; structured "spec sheet" style (numbered sections, margin notes) — see canvas inner-page artboards for content structure.

## 5. Data (`src/data/testimonials.ts`)
Add a `highlight` line per person and two new people:
- Trio Sutardi — Lead QA Engineer, same team. Line: "[He] was someone **others relied on** because of his strong understanding of the product, engineering, and quality."
- Surya Surakhman — title now **Senior Software Engineer** (Ex-Coupang, HOOQ), managed him directly. Line: "[He] is the kind of engineer **you want in your corner** when building complex, high-performance systems." LinkedIn: https://www.linkedin.com/in/suryasurakhman/
- Abdurrahman Al Hanif — UI/UX Designer & Frontend Developer, different team. Line: "[He] dove in, found the issue in the database query, and optimized it. That **18-second lag dropped to just 1–2 seconds**." LinkedIn: https://www.linkedin.com/in/abdurrahman-alhanif/
- Aftar Fadilah — Frontend Engineer / QA, same team 2 years (original in Indonesian). Line (translated, label it): "He worked under heavy pressure, **stabilized the system**, and contributed greatly to saving the company." LinkedIn: https://www.linkedin.com/in/aftarfadilah/en/
/recommendations page: compact symmetric 2×2 (max-width ~772px), one line per person, key phrase in mauve, "full text ↗" to LinkedIn.

## 6. Header
Static `Header.astro` on inner pages only (the homepage has none): a "home" back link with a Lucide `ChevronLeft`, plus route links from `src/lib/routes.ts`, with the current section in its group colour. No React island.

## Constraints
No location anywhere on the site. Keep accessibility: real `<a>`/`<button>`, visible focus, 4.5:1 text contrast, `prefers-reduced-motion`.
