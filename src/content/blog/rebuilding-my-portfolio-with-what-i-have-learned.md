---
title: "Rebuilding My Portfolio With What I Have Learned"
description: "I rebuilt my personal site as a tile hub. Most of the decisions were not about how it looked, but about who reads it, what they need in the first few seconds, and what I was tempted to add for the wrong reasons."
pubDate: 2026-11-20
tags: ["design", "ux", "frontend", "css", "responsive", "personal website", "engineering"]
draft: true
---

My previous site was a single long page. A hero section at the top, then about, projects, experience, testimonials, blog and contact, one after another, with a scroll-spy navigation bar following the reader down. It worked, but I built it before most of the projects I now write about, and it showed. It described what I did rather than letting the work speak, and it asked every visitor to read it the same way from top to bottom.

When I rebuilt it, I wanted to apply what those projects had taught me: to start from the people using something, to be clear about what it should achieve, and to drop ideas that served me rather than them. This post is a record of those decisions, including the ones I got wrong first.

## The Plan, Briefly

I wrote about the plan in [Designing My Personal Website Around Visitor Intent](/blog/designing-my-personal-website-around-visitor-intent/). In short, the homepage would stop being a long introduction and become a map of the site: six destinations visible at once, each sized by how much it matters to a visitor, with the full content one click away. The rule I used for every tile was "a signal, not everything". A tile should say just enough to make someone curious and leave the rest to the page behind it.

The cost of that choice is that visitors have to click, so every tile has to earn the click. Most of what follows is about the places where the plan met real content and real screens.

## What Changed From the Plan

The plan proposed two rows with mirrored proportions, 5–4–3 on top and 3–4–5 below. Once the tiles held real content, the mirrored rhythm mattered less than a plain priority order. My work now gets the widest tile, followed by experience and then writing, and my name carries the largest text because a visitor should know whose site it is before anything else.

I had expected to build the layout with flexbox, because some tiles needed fixed or minimum widths while others grew. CSS Grid handled that more directly. Fractional columns with `minmax()` give each tile a floor and let the rest share the remaining space, without extra wrappers.

The plan also reserved the only accent colour for the contact block. In the build, colour became a way to group destinations instead: one colour for identity, one for evidence such as work, experience and writing, and one for other people's words in the recommendations. The only filled element on the page is the "Email me" button, so the most direct action still stands out.

The maximum width of roughly 1500px did not survive either, for reasons that deserve their own section.

## Fitting the Screen Was Harder Than Choosing the Layout

The part that took the most iterations was not the layout itself, but how it behaved on real screens.

My first approach was to give the grid a fixed ratio and let it scale down to fit the window, the way an image behaves with `object-fit: scale-down`. On paper it was clean: the layout would always look exactly like the mockup, and an ultrawide monitor would simply get margins on the sides.

On my own monitor, it left a large empty area. The ratio I had chosen matched the screen, but not the browser window, because the browser's toolbars take height away. A 1920×1080 screen gives a viewport that is much closer to 2:1 than to 16:9, so a 16:10 grid was always limited by height and never used the full width. I had designed for the screen I imagined rather than the one people actually look at.

So I changed the rule. The grid now fills the window up to a maximum width and height, with a minimum height below which the page scrolls instead of squeezing the tiles. When I tried a generous maximum height, the tiles became so tall that each one looked empty inside, so I lowered it again. Every one of these changes came from looking at the result on an actual screen, not from reasoning about it.

## The Things I Decided Not to Add

Some of the more useful decisions were about what I left out.

When the grid stopped growing on tall windows, there was some space left below it, and I considered adding a top bar with a logo to fill it. The honest reason for that bar was filler. My name is already the largest thing on the page, so a logo would only repeat it, and the empty space only appears on unusually tall windows. A component whose main job is to hide a gap that most visitors never see is not worth building.

I also considered centring the grid vertically so the space would look like a margin. That works on a normal monitor and fails on a portrait one, where the grid would start halfway down the screen. Keeping it aligned to the top makes the page behave like a normal page, and leftover space at the bottom looks natural.

The same thinking applied to content. I removed my location from the site, because it gives people a reason to filter me out before they have read anything else. Recommendations show one line per person, with a link to the full text, rather than a large featured quote that reads like marketing. Where a quote was originally written in Indonesian, it is labelled as a translation.

## What I Still Want to Improve

Writing this down made a few gaps obvious. My work tile currently lists domains, which tells you where I have worked but not what changed because of it. A single outcome would say more. My blog tile shows tags, while the post titles themselves say much more about how I approach problems. My case studies describe what I built, but not always who used it or which trade-offs I made along the way, and those trade-offs are often the most interesting part of the story.

Those are the next changes. The site is never going to be finished, and I think that is fine, as long as each change starts from what the reader needs rather than from what would look impressive in a screenshot.
