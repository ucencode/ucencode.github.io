# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server at localhost:4321
npm run build     # production build → dist/ (also the CI / predeploy check)
npm run preview   # serve the dist/ build locally
npm run lint      # ESLint over .ts/.tsx files
npm run deploy    # predeploy build, then push dist/ to the gh-pages branch
```

No test suite is wired up despite `vitest.config.ts` being present.

**Lint rules** — ESLint covers `.ts`/`.tsx` files only (`.astro` files are excluded; `dist` and `.astro` dirs are ignored). `@typescript-eslint/no-unused-vars` is off; `react-refresh/only-export-components` is a warning. Treat warnings as errors — run `npm run lint` before committing and fix everything.

## Guardrails

Two actions are gated behind a confirmation prompt by a PreToolUse hook (`.claude/hooks/gatekeep.sh`, wired in `.claude/settings.json`):
- **Committing while on `main`** — branch first; the gate prompts before any direct-to-`main` commit.
- **Deploying** (`npm run deploy` / `gh-pages`) — prompts before publishing the live site.

The hook only adds a confirmation step; it doesn't block. Other commands are unaffected. Editing the gate requires editing those two files (changes take effect after the config reloads — `/hooks` or restart).

## Development Workflow

This is the end-to-end flow for making a change. Follow it in order.

1. **Branch** — `main` is the deployed branch. Don't commit straight to `main` unless told to; create a feature branch.
2. **Decide where the change lives** — almost all content changes are data-only. See the "Where to make changes" map below before touching any component.
3. **Run the dev server** — `npm run dev` and verify at `localhost:4321`. Content changes hot-reload.
4. **Lint** — `npm run lint` and fix all errors/warnings (TS/TSX only; `.astro` is not linted, so review those by hand).
5. **Build** — `npm run build` must pass. This is exactly what CI runs, so a green build locally means green CI.
6. **Commit** — use Conventional Commits with a scope (see below).
7. **Push / PR** — CI (`.github/workflows/ci.yml`) runs lint + build on every push and PR to `main`.
8. **Deploy** — `npm run deploy` builds and pushes `dist/` to the `gh-pages` branch (manual; not automated by CI).

### Commit conventions

Conventional Commits with a parenthesized scope, matching existing history:

```
feat(projects): slide presentation carousel modal
fix(projects): bump interactive button sizes for better tap targets
refactor(projects): unify modal into single slide presentation
docs(data): refine professional profile details
chore(deps): update build dependencies structure
```

Common scopes: `projects`, `blog`, `header`, `layout`, `contact`, `footer`, `data`, `deps`, `site`. Keep the subject imperative and lowercase.

### Where to make changes (decision map)

| To change…                          | Edit…                                              | Component change needed? |
| ----------------------------------- | -------------------------------------------------- | ------------------------ |
| Bio / strengths / social links      | `src/data/about.ts`                                | No                       |
| Work history / experience summary   | `src/data/experience.ts`                           | No                       |
| Projects (cards, modals, slides)    | `src/data/projects.ts` + images in `public/`       | No                       |
| Blog posts                          | `src/content/blog/*.md`                             | No                       |
| Page section order                  | `src/pages/index.astro`                             | Yes                      |
| Site-wide `<head>` / meta / GA      | `src/layouts/BaseLayout.astro`                      | Yes                      |
| Design tokens / utility classes     | `src/styles/global.css`                             | Yes                      |

Prefer the data files. Only edit components for structural or behavioral changes.

## Architecture

Single-page portfolio site. `src/pages/index.astro` composes all sections inside `BaseLayout.astro`, in this order: Header → Hero → About → Projects → Experience → Testimonials → Blog → Contact → Footer.

**Astro vs React split** — most sections are static `.astro` components (Hero, About, Experience, Testimonials, Blog, Contact, Footer). Two are React Islands hydrated with `client:load`:
- `Header.tsx` — fixed nav with scroll-detection, active-section highlight, mobile hamburger, and homepage-vs-route active state.
- `Projects.tsx` + `ProjectModal.tsx` — project card grid opening a Radix Dialog modal with a slide carousel + an info slide.

Default to static `.astro`. Only reach for a React Island when a component needs client-side interactivity or state.

**Content is data-driven** — all portfolio content lives in `src/data/`:
- `about.ts` — `description` (bio paragraphs), `coreStrengths`, and a `socialLinks` object.
- `experience.ts` — work-history entries and summary blurb.
- `projects.ts` — exported `Project[]`. Each entry has `id`, `title`, `description`, `image: { src, alt }`, `slides: Slide[]`, `projectStack: string[]`, optional `links`, and optional `additionalInfo: Metadata[]` (deep-dive sections: Problem / My Role / What I Built / Outcome). Types are JSDoc-documented at the top of the file — follow them exactly.

### Projects & slides

- `id` is the slug — it's the React key AND the slide directory name: slides live at `public/slides/{id}/slide-NN.webp`.
- `slides` is an explicit `Slide[]` (`{ path, caption? }`) — **no glob inference**; every slide must be listed. `path` is relative to `public/` (e.g. `"slides/clinic-os/slide-01.webp"`). An optional `caption` renders as a gradient overlay at the bottom of the slide.
- `image.src` is the card preview (`.webp` in `public/projects/`, path like `/projects/clinicos-preview.webp`).
- `projectStack` labels render as `.tech-tag` pills on the card and in the modal.

### Blog

Markdown files in `src/content/blog/`, via Astro content collections (Zod schema in `src/content/config.ts`). Frontmatter:

```markdown
---
title: "Post Title"
description: "One-line summary — shown in link previews and the post list"
pubDate: 2026-05-09          # coerced to Date
tags: ["node", "typescript"] # optional, defaults to []
draft: true                  # optional, defaults to false; true hides from listings
---
```

- `Blog.astro` (homepage section) shows the latest 3 non-draft posts; `src/pages/blog/index.astro` is the full `/blog` listing; `src/pages/blog/[slug].astro` renders a post with prev/next nav (drafts excluded from `getStaticPaths`).
- Render post cards with `BlogCard.astro` — don't duplicate the card markup.
- Each post sets `ogType="article"` and its own OG title/description via `BaseLayout`.
- Open items are tracked in `TODO.md` (syntax highlighting, reading time, tag filter).

**`BaseLayout.astro`** owns the HTML shell: `<head>` meta/OG/Twitter tags, canonical URL, JSON-LD `Person` structured data, Google Analytics (`G-LS7KXT6E9R`), Inter + JetBrains Mono fonts, and the `IntersectionObserver` that drives scroll-reveal animations.

## Styling

Tailwind CSS v4 via PostCSS. Design tokens are CSS custom properties in `src/styles/global.css` (dark-only theme, emerald-green primary `hsl(160 84% 39%)`). Tailwind color names (`primary`, `muted`, `card`, etc.) map to those variables.

Custom utilities in `global.css`:
- `.section-alt` — alternating section background.
- `.tech-tag` — monospace pill for tech-stack labels.
- `.hero-grid` / `.hero-glow` — decorative hero background effects.
- `[data-reveal]` — scroll-reveal entry animation; add `data-reveal-delay="<ms>"` to stagger (read by the observer in `BaseLayout.astro`).

Path alias `@` → `./src` (configured in both `astro.config.mjs` and `tsconfig.json`).

## Deployment

`astro.config.mjs` sets `site: 'https://ucencode.github.io'`, static output, `assets/` build dir, and React + sitemap integrations.

`npm run deploy` runs `predeploy` (a full build) then `gh-pages -d dist -t`, pushing `dist/` to the `gh-pages` branch that GitHub Pages serves at `https://ucencode.github.io`. The `-t` flag includes dotfiles so `public/.nojekyll` (which disables Jekyll processing) is published. Deployment is manual — CI only lints and builds, it does not deploy.
