---
title: "Why I Switched to Astro for My Portfolio"
description: "After trying Next.js and plain HTML, Astro hit the sweet spot — static by default, islands when needed."
pubDate: 2026-05-13
tags: ["astro", "web"]
---

I've rebuilt my portfolio three times. The first was plain HTML and CSS — simple, fast, but painful to maintain. The second was Next.js — powerful, but shipping a React runtime to display a static page felt like overkill. The third is this one, built with Astro.

## What clicked

Astro's mental model is straightforward: pages are static by default. If a component needs interactivity, you opt in with a `client:` directive. Everything else ships as zero-JS HTML.

For a portfolio site, that's exactly the right default. The header needs scroll detection and a mobile menu — so it's a React island with `client:load`. The rest (hero, about, experience, projects) are `.astro` components that render to plain HTML. No hydration cost, no layout shift.

## Content collections

The blog is powered by Astro content collections. Each post is a Markdown file with a typed frontmatter schema. Astro validates the schema at build time, so a missing `pubDate` or a wrong type fails the build rather than silently producing bad output.

```ts
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});
```

Draft posts are filtered out at query time — no separate branch, no file naming convention, just a flag.

## The tradeoff

Astro's island architecture means React state doesn't cross component boundaries easily. If two islands need to share state, you reach for a store (nanostores works well). For this site that hasn't come up, but it's worth knowing before you commit to the pattern.

For a content-heavy site that needs occasional interactivity, Astro is the right tool. I don't miss the Next.js bundle.
