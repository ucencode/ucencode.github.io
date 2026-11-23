---
title: "Rebuilding My Portfolio With What I Have Learned"
description: "I tried a tile-based rebuild of my portfolio and adjusted the layout once I put real content in it."
pubDate: 2026-11-20
tags: ["design", "ux", "frontend", "css", "responsive", "personal website", "engineering"]
draft: false
---

My previous site was a single long page. A hero section at the top, then about, projects, experience, testimonials, blog and contact, one after another, with a scroll-spy navigation bar following the reader down. It worked, but I built it before most of the projects I now write about, and it showed. It described what I did rather than letting the work speak, and it asked every visitor to read it the same way from top to bottom.

I built a tile-based version to try a different approach. This post records decisions from that version of the redesign.

## The Plan, Briefly

I planned the homepage as a map of the site. Six tiles would show visitors where to find my work, experience, writing, and the rest of the portfolio. Each tile would give a preview, with the full content one click away.

The cost of that choice is that visitors have to click, so every tile has to earn the click. Most of what follows is about the places where the plan met real content and real screens.

## What Changed From the Plan

The plan proposed two rows with mirrored proportions, 5–4–3 on top and 3–4–5 below. Once the tiles held real content, I gave my work the widest tile, followed by experience and then writing. I set my name in the largest text so a visitor could see whose site it was at a glance.

I had expected to build the layout with flexbox, because some tiles needed fixed or minimum widths while others grew. CSS Grid handled that more directly. Fractional columns with `minmax()` give each tile a floor and let the rest share the remaining space, without extra wrappers.

The plan also reserved the only accent colour for the contact block. In the build, I used one colour for identity, another for work, experience, and writing, and a third for recommendations. I filled only the "Email me" button so it would stand out.

The maximum width of roughly 1500px did not survive either, for reasons that deserve their own section.

## Fitting the Screen Was Harder Than Choosing the Layout

The part that took the most iterations was not the layout itself, but how it behaved on real screens.

My first approach was to give the grid a fixed ratio and let it scale down to fit the window, the way an image behaves with `object-fit: scale-down`. On paper it was clean: the layout would always look exactly like the mockup, and an ultrawide monitor would simply get margins on the sides.

On my monitor, the browser toolbars left less height for the grid than I had planned for. With the grid locked to 16:10, it reached the height limit before it could fill the available width.

I let the grid fill the window up to a maximum width and height, with a minimum height below which the page scrolls. My first maximum made the tiles look empty inside, so I lowered it.

## The Things I Decided Not to Add

Some of the more useful decisions were about what I left out.

When the grid stopped growing on tall windows, there was some space left below it, and I considered adding a top bar with a logo to fill it. The honest reason for that bar was filler. My name is already the largest thing on the page, so a logo would only repeat it, and the empty space only appears on unusually tall windows. A component whose main job is to hide a gap that most visitors never see is not worth building.

I also considered centring the grid vertically so the space would look like a margin. That works on a normal monitor and fails on a portrait one, where the grid would start halfway down the screen. Keeping it aligned to the top makes the page behave like a normal page, and leftover space at the bottom looks natural.

The same thinking applied to content. I removed my location from the site, because it gives people a reason to filter me out before they have read anything else. Recommendations show one line per person, with a link to the full text, rather than a large featured quote that reads like marketing. Where a quote was originally written in Indonesian, it is labelled as a translation.

## What I Still Want to Improve

In that version, the work tile listed domains. I'd give it a project outcome instead. I'd also show post titles in the writing tile, so readers can choose an article by the problem it covers.

Those are the next changes. The site is never going to be finished, and I think that is fine, as long as each change starts from what the reader needs rather than from what would look impressive in a screenshot.
