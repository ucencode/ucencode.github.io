---
title: "Designing My Personal Website Around Visitor Intent"
description: "A design journal on shaping a personal website landing page around visitor goals, visual hierarchy, and responsive navigation."
pubDate: 2026-11-11
tags: ["design", "ux", "personal website"]
draft: false
---

## The problem

I'm redesigning my personal website, but I don't want to build another portfolio that simply looks good.

I want visitors to quickly see who I am, what I've built, and how I think about engineering.

**Design for what visitors want to accomplish, not merely for what I want to show them.**

That changes how I think about the landing page. Rather than treating it as a long introduction or a collection of impressive-looking sections, I want it to function as a **map of the website**. Visitors should arrive, understand their options, and choose where to go.

## Starting with content, not layout

I identified six destinations:

- **Identity / About:** Who I am, beyond a job title.
- **Projects:** What I've built and how I solve problems.
- **Experience:** Where I've worked and what I've contributed.
- **Writing:** My thoughts, observations, and technical explorations.
- **Recommendations:** What others have said about working with me.
- **Contact:** How to reach me.

These destinations don't have equal importance. Identity establishes context immediately; projects offer concrete evidence of engineering work. Experience adds professional context, while writing reveals how I think. Recommendations and contact matter but don't need identical amounts of space.

**Decision:** Visual hierarchy should communicate the importance of each destination, rather than distributing space equally.

## Exploring visual weight

Before drawing rectangles, I experimented with circles and ovals. They weren't intended as UI elements; they helped me compare relative sizes and positions without getting distracted by colors, typography, borders, or implementation.

The exercises revealed a problem: the gap between the largest and smallest destinations could become too extreme. Even a secondary destination needs enough visual presence to be discoverable.

I also explored grouping identity, recommendations, and contact separately from projects, experience, and writing. The grouping made conceptual sense but didn't automatically translate into a useful visual hierarchy.

A composition can be balanced while still failing to show visitors where to look first.

## Moving toward a block-based layout

The current desktop direction uses six blocks in two rows:

- **Row 1:** 5 – 4 – 3
- **Row 2:** 3 – 4 – 5

These are **relative proportions** inspired by a 12-column grid, not a mandate to use CSS Grid.

The changing widths create rhythm and shift visual emphasis between rows. A uniform grid would suggest equal importance; a highly irregular arrangement could undermine scanning. This is an attempt to establish structure with controlled variation, rather than asymmetry for decoration.

## The landing page as a navigation map

On a typical desktop viewport, the goal is for the primary destinations to be visible together. Visitors shouldn't have to scroll through a long introduction merely to discover where to go.

The identity block comes first in reading order. Contact is the most immediate action and is the only block currently intended to receive a distinctive accent treatment. The remaining blocks link to deeper pages where the content can breathe.

The concept also **removes the traditional top navigation bar from the landing page**. If the landing page itself is the navigation, repeating every destination in a header may be unnecessary.

But that choice introduces an obligation: navigation must still work on deeper pages, direct search-engine entries, browser back navigation, and unexpected user paths. Removing a landing-page header does not remove the navigation problem.

## Translating layout intent into CSS

The desktop content has a proposed maximum width of approximately **1500px**.

Flexbox is the current implementation direction because some blocks may benefit from fixed or minimum widths, while others can grow with the available space. A 12-column framework can guide proportions without dictating the CSS mechanism.

For example, the contact block needn't grow indefinitely just because the viewport gets wider. The exact rules should be tested with realistic copy and content.

**Principle:** The layout system should serve the content, not the reverse.

## Responsive design is not a shrunken desktop

Desktop can communicate hierarchy through simultaneous blocks of different sizes. Mobile cannot preserve that exact composition without sacrificing readability or tap targets.

The mobile direction is therefore:

1. One large **Identity / About** card.
2. Five compact, full-width destination rows.

The identity remains first, and navigation becomes straightforward to scan and tap.

**The hierarchy remains consistent even when the layout changes.**

Tablet behavior remains a design detail to evaluate between these two approaches.

## Decision record (November 10, 2026)

| Area | Current decision |
| --- | --- |
| Landing-page role | Navigation map |
| Destinations | Identity/About, Projects, Experience, Writing, Recommendations, Contact |
| Desktop composition | Two rows of three blocks |
| Desktop proportions | 5–4–3 / 3–4–5 |
| Maximum content width | Approximately 1500px |
| Layout implementation | Flexbox favored; some blocks may have fixed/minimum widths |
| Landing-page top bar | Removed from current concept |
| Mobile composition | Large Identity/About card, then five compact rows |
| Contact visual emphasis | Single accent-colored block |
| Visual direction | Structured / slightly rigid; dark aesthetic still a preference |

These are direction-setting decisions, **not a finished visual system**. Typography, colors, spacing, interaction states, content fit, accessibility, and final tablet sizing still need exploration.

The next test is to put real content in the blocks and see whether someone arriving on the homepage can find a project, or whether someone landing on an article can find their way back.

