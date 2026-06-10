---
title: "I Proposed a Gradual Refactor. They Chose a Big Bang. I Built It Anyway."
description: "I proposed a gradual refactor for a duplicated billing system. The team chose a big bang rewrite. I built it anyway — and here's what that looked like."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

# I Proposed a Gradual Refactor. They Chose a Big Bang. I Built It Anyway.

## Summary

The billing system had four services — draft, invoice, extern, and correction — each doing roughly similar things: CRUD, PDF generation, totals calculation, event emission. The duplication wasn't subtle. The same logic for calculating totals appeared in three places. The same pattern for handling line items was written four times, slightly differently each time. The codebase had accumulated this debt gradually, and it showed.

Ahmad's read: the problem was the redundancy, not the separation. His proposal was to go gradual — first extract the shared logic into utilities both services could use, eliminate the duplication, and make each service's actual responsibility clear. Once the noise was gone, you'd see what really needed to be restructured. Clean first, then decide.

What got handed down instead was a unified BillingDocument architecture — consolidate all four entities into one table, one service layer, one handler per document type. On paper it looked clean: fewer tables, fewer API endpoints, one place to make changes.

Ahmad disagreed. Not because the goal was wrong, but because the four entities aren't actually the same thing wearing different hats. A draft is a mutable workspace — it can be edited freely, it has no legal weight. A finalized invoice is a legal document — it must be immutable, it carries payment status, it gets sent to patients. An extern is a third-party billing submission with its own numbering rules and no payment tracking. A correction is always anchored to an existing invoice and can chain onto itself. Putting them in the same table doesn't make them the same thing — it just hides their differences inside nullable columns, branching enumerations, and handler conditionals that end up recreating the original separation at the application layer instead of the schema layer. His framing: it's like putting four different personalities in the same room and expecting them to behave as one.

The concern with the big bang approach was also practical. The tech debt — the redundant logic, the unclear boundaries — was still there. Merging the entities without resolving it first meant carrying that debt into the new architecture, just harder to see. A gradual refactor would have surfaced each piece of shared logic explicitly, letting you decide consciously whether to extract it or remove it. The unified approach submerged it.

The proposal was heard. The decision went the other way.

So Ahmad built it — wrote the architecture doc, implemented the abstract base services, scaffolded the handlers, wrote the data migration that transformed six different ID prefixes across thousands of rows, tracked progress in a living status document, wrote the tests. Did the work properly. And then left.

While building it, Ahmad was also pair programming with the person who would eventually own the codebase — working through the important parts of the refactor together in real time, not in a debrief after the fact. Teaching someone to navigate a codebase you're actively disagreeing with, on an architecture you didn't choose, requires a specific kind of discipline. You can't say "this is wrong" to the person who has to maintain it. You explain the decisions, the tradeoffs, the places where the implementation diverged from the plan and why — and you let them form their own view. The work of leaving well started before the leaving did.


The lesson isn't that big bang refactors are always wrong or that gradual is always right. It's that tech debt should be resolved before  restructuring, not after — because restructuring on top of debt just relocates it. And it's that building something you disagree with doesn't mean building it badly. The disagreement and the craftsmanship can coexist.

---


Original situation: Four billing services with significant redundant logic and unclear boundaries between their responsibilities.
Ahmad's proposal: Gradual refactor — extract shared logic first, eliminate redundancy, then evaluate whether structural changes were still
needed.
What was decided: Unified BillingDocument architecture — consolidate all four entities into one.
The core objection: The four entities have fundamentally different lifecycles and contracts. Unification pushes their differences from the
schema layer into the application layer, making them invisible rather than resolved.
What he built anyway: The full implementation — abstract services, handlers, factory, data migration, tests, status tracking.
How it ended: Left the job. Did a thorough handover before leaving.
Lessons: Resolve tech debt before restructuring. Entities with different lifecycles have different identities — forcing them into one shape
doesn't unify them, it obscures them. You can disagree with a design and still execute it with integrity.

Educational value: 10/10 | Authenticity as diary: 10/10
Audience: Engineers who've been overruled on a design, anyone facing a large-scale refactor decision | Reading time: 9 min
Recommended structure: The redundancy problem → the gradual proposal → what got decided instead → the "four personalities" argument →
building it anyway → the exit and handover → the lesson about tech debt before restructuring