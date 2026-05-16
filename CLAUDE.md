# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server at localhost:4321
npm run build     # production build → dist/
npm run preview   # serve the dist/ build locally
npm run lint      # ESLint (TS/TSX files only)
npm run deploy    # build then push dist/ to the gh-pages branch
```

No test suite is wired up despite `vitest.config.ts` being present.

**Lint rules** — ESLint covers `.ts`/`.tsx` files only (`.astro` files are excluded). Always run `npm run lint` before committing and fix all errors. Zero warnings policy: treat warnings as errors.

## Architecture

Single-page portfolio site. The page is assembled in `src/pages/index.astro`, which composes all sections inside `BaseLayout.astro`.

**Astro vs React split** — most sections are static `.astro` components (Hero, About, Experience, Testimonials, Blog, Contact, Footer). Two components are React Islands hydrated with `client:load`:
- `Header.tsx` — fixed nav with scroll-detection, active-section highlight, mobile hamburger, and page-route active state
- `Projects.tsx` + `ProjectModal.tsx` — project card grid with a Radix Dialog modal

**Content is data-driven** — all portfolio content lives in `src/data/`:
- Blog posts are Markdown files in `src/content/blog/` using Astro content collections (schema in `src/content/config.ts`). Frontmatter fields: `title`, `description`, `pubDate`, `tags[]`, `draft`.
- Use `BlogCard.astro` for rendering post cards — do not duplicate the card markup.
- `about.ts` — bio paragraphs, core strengths, social links
- `experience.ts` — work history entries and summary blurb
- `projects.ts` — `Project[]` typed array; each entry has `id`, `title`, `description`, `image`, `techStack`, `links`, and optional `additionalInfo` sections (Problem / My Role / What I Built / Outcome)

To add or update content, edit only these data files — no component changes needed.

**`BaseLayout.astro`** owns the HTML shell: `<head>` meta/OG tags, Google Analytics (`G-LS7KXT6E9R`), Inter + JetBrains Mono fonts, and the IntersectionObserver that drives scroll-reveal animations.

## Styling

Tailwind CSS v4 via PostCSS. Design tokens are CSS custom properties defined in `src/styles/global.css` (dark-only theme, emerald green primary `hsl(160 84% 39%)`). Tailwind color names (`primary`, `muted`, `card`, etc.) map to those variables.

Custom utility classes defined in `global.css`:
- `.section-alt` — alternating section background
- `.tech-tag` — monospace pill for tech stack labels
- `.hero-grid` / `.hero-glow` — decorative hero background effects
- `[data-reveal]` — scroll-reveal entry animation; add `data-reveal-delay="<ms>"` to stagger

Path alias `@` resolves to `./src` (configured in both `astro.config.mjs` and `tsconfig.json`).

## Deployment

`npm run deploy` runs `gh-pages -d dist`, pushing the built output to the `gh-pages` branch which GitHub Pages serves at `https://ucencode.github.io`. The `public/.nojekyll` file disables Jekyll processing.

Project preview images are `.webp` files stored in `public/projects/` and referenced by path in `src/data/projects.ts`.
