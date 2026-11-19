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
| Projects (cards, case studies)      | `src/content/projects/*.md` + images in `public/`  | No                       |
| Blog posts                          | `src/content/blog/*.md`                             | No                       |
| Page section order                  | `src/pages/index.astro`                             | Yes                      |
| Site-wide `<head>` / meta / GA      | `src/layouts/BaseLayout.astro`                      | Yes                      |
| Design tokens / utility classes     | `src/styles/global.css`                             | Yes                      |

Prefer the data files. Only edit components for structural or behavioral changes.

## Architecture

Single-page portfolio site. `src/pages/index.astro` composes all sections inside `BaseLayout.astro`, in this order: Header → Hero → About → Projects → Experience → Testimonials → Blog → Contact → Footer.

**Astro vs React split** — most sections are static `.astro` components (Hero, About, Projects, Experience, Testimonials, Blog, Contact, Footer). Two React Islands remain:
- `Header.tsx` (`client:load`) — fixed nav with scroll-detection, active-section highlight, mobile hamburger, and homepage-vs-route active state.
- `ImageViewer.tsx` (`client:idle`) — fullscreen viewer for the figures on a project page, in a native `<dialog>` with wheel and pinch zoom, drag to pan and prev/next navigation.

**Project pages** — `Projects.astro` renders the homepage cards as links to `src/pages/projects/[id].astro`, which builds one static page per project at `/projects/{id}/` (title, description, stack and links, then the Markdown case study). Each page passes its own title, description and `ogImage` (the card image, or the first figure in the body) to `BaseLayout`, so link previews and crawlers see the full case study.

Default to static `.astro`. Only reach for a React Island when a component needs client-side interactivity or state.

**Content is data-driven** — profile content lives in `src/data/`, while projects and blog posts are Markdown content collections:
- `about.ts` — `description` (bio paragraphs), `coreStrengths`, and a `socialLinks` object.
- `experience.ts` — work-history entries and summary blurb.

### Projects

Each project is a Markdown file in `src/content/projects/`, loaded as the `projects` content collection (schema in `src/content.config.ts`). The file name is the project `id` and URL slug. Frontmatter:

```markdown
---
title: "ClinicOS"
description: "One-line summary — shown on the card, the page header and link previews"
order: 1                     # position on the homepage and in prev/next navigation
image:                       # optional card preview, path relative to this file
  src: "../../assets/projects/clinicos-preview.webp"
  alt: "ClinicOS project preview"
projectStack: ["Node.js", "PostgreSQL"]
links:                       # optional, defaults to []
  - label: "Website"
    url: "https://clinicos.de"
---
```

- The body is the case study, written as sections with `##` headings (Problem / My Role / What I Built / Outcome).
- Figures are written as `![alt](../../assets/projects/{id}/slide-NN.webp "Caption")`. The `rehype-figure` plugin in `src/lib/rehype-figure.mjs` (registered in `astro.config.mjs`) turns an image with a title on its own line into a `<figure>` numbered "Figure N." per page; an image without a title stays a plain image. The plugin runs on the unified processor, which requires `@astrojs/markdown-remark`. The first figure on a page loads eagerly and later ones lazily. Rendered Markdown is cached by the content layer, so after editing the plugin, delete `node_modules/.astro` and `.astro/data-store.json` (or restart the dev server after deleting them) to see the change.
- All project images live in `src/assets/projects/`: card previews at the top level, figures in `src/assets/projects/{id}/`. Astro optimizes both at build time and adds `width`/`height`; a wrong path fails the build. The `image()` schema helper validates card previews, and `Projects.astro` renders them with `<Image>` and a `srcset`. When a project has no card image, the project page resolves its first figure through `import.meta.glob` for `ogImage`.
- `projectStack` labels render as `.tech-tag` pills on the card and on the project page.

### Blog

Markdown files in `src/content/blog/`, via Astro content collections (`glob` loader and Zod schema in `src/content.config.ts`; the post slug is `post.id`). Frontmatter:

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

**`BaseLayout.astro`** owns the HTML shell: `<head>` meta/OG/Twitter tags (props: `title`, `description`, `ogType`, `ogImage`, `ogImageAlt`), canonical URL, JSON-LD `Person` structured data, Google Analytics (`G-LS7KXT6E9R`), Inter + JetBrains Mono fonts, and the `IntersectionObserver` that drives scroll-reveal animations.

## Styling

Tailwind CSS v4 via the `@tailwindcss/vite` plugin (registered in `astro.config.mjs`). Design tokens are CSS custom properties in `src/styles/global.css` (dark-only theme, emerald-green primary `hsl(160 84% 39%)`). Tailwind color names (`primary`, `muted`, `card`, etc.) map to those variables.

Custom utilities in `global.css`:
- `.section-alt` — alternating section background.
- `.tech-tag` — monospace pill for tech-stack labels.
- `.hero-grid` / `.hero-glow` — decorative hero background effects (the hero is text-only; there is no code/terminal window).
- `[data-reveal]` — scroll-reveal entry animation; add `data-reveal-delay="<ms>"` to stagger (read by the observer in `BaseLayout.astro`).

Path alias `@` → `./src` (configured in both `astro.config.mjs` and `tsconfig.json`).

## Deployment

`astro.config.mjs` sets `site: 'https://ucencode.github.io'`, static output, `assets/` build dir, and React + sitemap integrations.

`npm run deploy` runs `predeploy` (a full build) then `gh-pages -d dist -t`, pushing `dist/` to the `gh-pages` branch that GitHub Pages serves at `https://ucencode.github.io`. The `-t` flag includes dotfiles so `public/.nojekyll` (which disables Jekyll processing) is published. Deployment is manual — CI only lints and builds, it does not deploy.
