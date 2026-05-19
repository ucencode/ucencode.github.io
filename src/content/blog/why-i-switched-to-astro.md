---
title: "Why I Moved Into Astro"
description: "I rebuilt my personal website a few times before landing on Astro. It gave me the simplicity of static HTML, reusable components, and just enough React when I need it."
pubDate: 2026-05-13
tags: ["astro", "web", "personal-site"]
---

I rebuilt my personal website a few times.

The first version was just plain HTML and CSS. It was simple, fast, and honestly good enough for a basic portfolio. But after a while, maintaining everything manually started to feel annoying. Every repeated section, every layout change, every small update became something I had to copy, paste, and carefully not break.

Then I tried adding Tailwind into the plain HTML version. It made styling faster, but the structure was still basically the same. I was still managing content manually, and when I started thinking about adding a blog, I realized the site needed something better.

At first, I considered using a headless CMS. Then I thought maybe I should keep it simple and use a small framework that could manage content without adding too much complexity.

## I wanted something easier to update

The main problem was not the design. It was maintainability.

I wanted my personal website to be easier to update over time. I wanted reusable sections, a cleaner project structure, and a blog system where I could write posts without manually editing HTML every time.

So I tried rebuilding it from scratch with React as a single-page app.

And to be fair, it looked nice. React made the component structure easier. Reusing sections felt much better. The developer experience was comfortable.

But then I realized something felt wrong.

Most of the content on my personal site is static. It does not need to be generated in the browser after JavaScript loads. A portfolio, an about section, experience, projects, and blog posts are mostly content that can already exist as HTML.

Using a full React SPA for that felt a bit too much.

## Then I found Astro

I still wanted to use React where it made sense, because React is familiar and useful. But I did not want the whole site to depend on client-side JavaScript just to display static content.

That is when I found Astro.

Astro felt like the middle ground I was looking for. It lets me build pages as static HTML by default, but I can still use React components when I need interactivity.

That model clicked for me.

The content-heavy parts of the site can stay simple and fast. The interactive parts can still use React. I do not have to choose between plain static files and a full client-side app.

## Migrating was surprisingly fast

I migrated the site with some help from AI, and honestly, it was fast enough to get the first version working quickly.

Of course, I still had to check the output, clean things up, test the behavior, and understand how Astro actually works. But once I saw the generated output and how the pages were built, it made a lot of sense.

The site felt like a normal static website again, but with a much better development experience.

I could write reusable components. I could manage blog posts with Markdown. I could keep the site fast. And when I needed interactivity, I could still bring in React.

## What I like about it so far

The biggest thing I like is that Astro does not force unnecessary JavaScript into the page.

For a personal website, most sections do not need hydration. The hero section, about section, experience, projects, and blog posts can just be HTML and CSS.

If something needs interactivity, Astro lets me opt in. That feels like the right default.

I also like that writing blog posts can be as simple as creating Markdown files. That makes the site feel easier to grow over time. I do not need a complicated CMS yet. I just need a simple way to write, organize, and publish content.

## Final thought

Moving to Astro made my personal website feel easier to maintain.

Plain HTML was simple but became repetitive. React SPA was comfortable but felt unnecessary for mostly static content. Astro gave me a balance between both: static output, reusable components, Markdown content, and React only when I actually need it.

For now, that is exactly what I want from a personal website.
