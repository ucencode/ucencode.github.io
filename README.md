# ucencode.github.io

Personal portfolio site for Ahmad Husein Hambali — Backend Engineer.

Built with [Astro](https://astro.build), [React](https://react.dev), and [Tailwind CSS v4](https://tailwindcss.com). Deployed to [GitHub Pages](https://ucencode.github.io).

## Stack

- **Astro** — static site framework, zero-JS by default
- **React Islands** — interactive components (Header, Projects modal) hydrate with `client:load`
- **Tailwind CSS v4** — utility-first styling via PostCSS
- **TypeScript** — type-safe data and components
- **shadcn/ui** — Radix Dialog for project modals

## Project Structure

```
src/
  layouts/
    BaseLayout.astro      # HTML shell, GA, fonts, scroll-reveal observer
  pages/
    index.astro           # Main page
    404.astro             # Custom 404
  components/
    Header.tsx            # React Island — scroll detection, mobile menu
    Projects.tsx          # React Island — project cards + modal
    ProjectModal.tsx      # Radix Dialog modal
    Hero.astro            # Static hero section
    About.astro           # Static about section
    Experience.astro      # Static experience timeline
    Testimonials.astro    # Static testimonials
    Contact.astro         # Static contact section
    Footer.astro          # Static footer
  data/
    about.ts              # Bio, strengths, social links
    experience.ts         # Work history
    projects.ts           # Project metadata
  content/
    config.ts             # Content collection schema (Zod)
    blog/                 # Blog posts as Markdown files
  pages/
    blog/
      index.astro         # Post listing at /blog
      [slug].astro        # Individual post at /blog/<slug>
  styles/
    global.css            # Tailwind + CSS variables + animations
public/
  projects/               # Project preview images (.webp)
  og-image.png            # OG image for link previews (1200x630, not yet created)
  .nojekyll               # Disables Jekyll on GitHub Pages
```

## Development

```bash
npm install
npm run dev       # start dev server at localhost:4321
npm run build     # build to dist/
npm run preview   # preview production build
```

## Blog

Posts live in `src/content/blog/` as `.md` files. Frontmatter schema:

```markdown
---
title: "Post Title"
description: "One-line summary — shown in link previews and the post list"
pubDate: 2026-05-09
tags: ["node", "typescript"]   # optional
draft: true                    # optional — hides from listing when true
---
```

Each post gets its own OG metadata (`og:title`, `og:description`, `og:type: article`) via `BaseLayout`. See `TODO.md` for planned improvements.

### Add a post through GitHub Issues

1. In the repository, choose **Issues → New issue → New Blog Post**. The template supplies the required fields and the `blog-post` label. Only issues authored by the repository owner are processed; issues from other authors are ignored.
2. Fill in the title, short description, optional comma-separated tags, draft choice (`false` to publish, `true` to keep it hidden), and the full post body in Markdown.
3. Submit the issue. The **Publish Blog Post** workflow creates `src/content/blog/<title-slug>.md` on the `content/blog-writings` branch. The title must not already exist as a post.
4. After the workflow succeeds, merge `content/blog-writings` into `main` to publish the post on the site. The workflow comments on and closes the issue after committing.

If you create an issue without the template, its body must contain these exact Markdown headings, each followed by a blank line. The workflow requires non-empty `Title` and `Content` sections:

```markdown
### Title

Your post title

### Description

A short summary

### Tags

engineering, debugging

### Publish as draft?

false

### Content

Write the full post in Markdown.
```

Add the `blog-post` label to trigger the workflow. Only the repository owner's issues are eligible. A regular issue body without these headings will fail validation; the workflow does not infer the title or content from free-form text.

## Deploy

```bash
npm run deploy    # build + push to gh-pages branch via gh-pages
```
