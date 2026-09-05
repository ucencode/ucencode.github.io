---
title: "I Proposed a Gradual Refactor. They Chose a Big Bang. I Built It Anyway."
description: "I proposed a gradual refactor for a duplicated billing system. The team chose a big bang rewrite. I built it anyway — and here's what that looked like."
pubDate: 2026-06-10
tags: ["engineering", "backend", "need assessment"]
draft: true
---

At first i had doing several refactors that vibe coded development at core level, the flow how code processes it so redundant as fuck

but i cant simplify it simply in one change. it will affect ALL domain

when we all proposed to stakeholder to have a time stabilize the development environment. but again it still new requirement and so on. even clearly new feature that violates his own what he said at the beginning

then i proposed for untangle logic at core before it goes worse, because its already terrible and consuming so much resources such as unused value after db fetches, like select all in sql query producing a lot of nested data. but what they made a risky move. such as merging table with item is merged too. 

since i dont have power for that and too junior to join opinion war. i did it anyway. and after that i quitted my job bcs too stressful

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

recap: "I saw a codebase accumulating complexity. I wanted to reduce it incrementally. The team chose structural consolidation instead. I disagreed, couldn't change the decision, implemented it anyway, and years later I can finally articulate what bothered me about it."

---

POLISHED

I had already done several smaller refactors around our billing system before we decided to restructure it.

The code had accumulated quickly during development, and some of the core flows had become unnecessarily complicated. There were redundant transformations, repeated calculations, large database queries fetching nested structures only for a small portion of the result to actually be used, and similar business logic implemented separately across several services.

Some of it was exactly the kind of code you get when the priority for a long time is simply to keep delivering.

That was understandable. but the problem was that we never really stopped delivering.

## We Kept Building on Top of It

At one point, several of us proposed having some time to stabilize the development environment and deal with the complexity that had accumulated.

New requirements kept arriving instead.

Some were normal extensions of the product. Others changed assumptions that had been established earlier, including features that contradicted constraints we had previously been told to design around.

The code changed every time.

Another requirement meant another condition. Another exception meant another branch. Existing data had to travel through another layer because some new behavior needed a small part of it later.

Eventually, the billing system had four major concepts: drafts, invoices, external billing documents, and corrections.

Their implementations contained a significant amount of duplicated logic. Totals were calculated in several places. Line items were handled repeatedly with slightly different implementations. CRUD operations followed similar patterns. PDF generation and event emission appeared across multiple services.

The duplication was obvious.

What was less obvious was what we should do about it.

## I Wanted to Remove the Noise First

My preferred approach was gradual.

Before changing the structure of the billing domain, I wanted to untangle the shared logic that already existed inside it.

If three services calculated totals in almost the same way, extract that calculation first. If four services processed line items using variations of the same flow, identify what was genuinely shared and move it somewhere explicit.

Then simplify the database access.

If a query fetched an entire nested structure and most of that data was never used, stop fetching it. If values travelled through several layers without contributing to the final result, remove them.

My reasoning was that the duplication itself was hiding the actual boundaries of the domain.

Once the repeated logic was gone, each service would contain mostly the behavior that made it different from the others. At that point, we could look at what remained and make a better decision about whether those services should still exist separately.

Clean the implementation first.

Then restructure what was actually left.

That was the direction I proposed.

It was not the direction we chose.

## The Decision Was to Unify the Billing Documents

Instead, the decision was to consolidate the billing architecture around a unified `BillingDocument`.

Drafts, invoices, external billing documents, and corrections would move toward a shared representation. Tables would be consolidated, common behavior would move into shared service layers, and individual document types would be handled through specialized handlers.

On paper, there were obvious advantages.

There would be fewer places to implement common behavior. Similar endpoints could be consolidated. Shared operations could live behind common abstractions. Future changes that genuinely applied to every billing document would have one obvious place to go.

I understood why the architecture was attractive.

I still disagreed with it.

The problem, to me, was that the four things we were combining were similar primarily when viewed from the implementation we already had.

Their actual lifecycles were different.

## A Draft Is Not an Invoice

A draft is a workspace.

It is supposed to change. A user can modify its line items, update information, recalculate values, and continue working on it until it is ready.

An invoice is different.

Once finalized, it represents a billing document with legal and financial consequences. It has payment state. It can be sent to a patient. Some parts of it should no longer behave like mutable draft data.

External billing documents had another lifecycle. They were submitted through third-party billing systems, followed different numbering and submission rules, and did not necessarily share the same payment tracking behavior.

Corrections were different again. A correction existed in relation to another billing document. It could not be understood independently from the document it corrected, and corrections could themselves form chains.

They certainly shared data.

Patient information, line items, totals, physician information, dates, and other billing fields appeared repeatedly.

But sharing fields did not necessarily mean sharing identity.

Putting those concepts into one representation did not remove their differences. It moved those differences somewhere else.

A column could become nullable because only two document types used it. An enum could determine which lifecycle applied. A handler could branch depending on the document type. A service could check whether an operation was legal for a draft but forbidden for an invoice.

Eventually, the separation that had previously existed in the database could reappear as conditions in the application layer.

That was what bothered me.

We could make four different things look structurally similar without actually making them behave the same.

## My Bigger Concern Was the Existing Debt

Even then, the unified model itself was not my largest concern.

The old code still contained the redundancy that had motivated the refactor in the first place.

We were changing the structure while simultaneously trying to understand which parts of the existing behavior were accidental duplication and which parts represented genuine differences between the document types.

That made the migration much larger.

My gradual proposal had been an attempt to separate those questions.

First, remove the obvious redundancy.

Then inspect what remains.

Then decide whether the remaining boundaries are wrong.

The approach we chose answered the structural question first. We had decided what the new architecture should look like, and now the existing behavior had to be moved into it.

That is a much bigger commitment.

## I Wasn't Going to Win an Architecture War

At that point in my career, I was still relatively junior.

I could raise concerns. I could explain why I preferred another approach. I could point at specific pieces of code and show where I thought the actual complexity was coming from.

But I did not have the authority to make the final architectural decision, and I also did not have enough experience to confidently turn the disagreement into a prolonged fight with people who had more influence over the system than I did.

The proposal had been discussed.

The decision had been made.

So I built it.

Not because I suddenly agreed with it, but because disagreement with an architectural decision did not change my responsibility for implementing it properly.

## Building the Architecture I Had Argued Against

The refactor was large.

I wrote parts of the architecture documentation so we could keep track of what the new system was supposed to become. I implemented abstract service layers and the handlers responsible for different billing document types. I worked through the migration from the old entities into the unified representation.

The database migration alone had to deal with existing data across several structures, including different ID prefixes that had accumulated around the billing domain.

There were thousands of rows that could not simply disappear because we had decided the new schema looked cleaner.

The migration had to preserve them.

Tests had to continue proving that the behavior survived the structural changes. I maintained a living status document because the refactor was too large to reliably keep its progress in my head.

And while doing all of this, the product did not freeze around us.

Development continued.

That was exactly the kind of situation I had originally hoped a gradual approach would make easier.

## I Also Had to Make Sure Someone Else Could Own It

During the refactor, I pair programmed with the engineer who would eventually take over much of the codebase.

That became more important than I initially realized.

It is one thing to write code you disagree with.

It is another thing to teach someone else how that code works without turning the handover into a speech about why you think the architecture should never have existed.

The person maintaining it afterward needed useful information, not my frustration.

So we worked through the important parts together while the refactor was still happening. I explained the intended architecture, the implementation decisions, the places where reality had forced us away from the original plan, and the assumptions that were important to understand before changing things again.

They could form their own opinion about the architecture later.

My responsibility was to make sure they were not inheriting a black box.

## Then the Job Ended Before I Resigned

By the beginning of December, I had already lost most of the energy I had for the job.

The refactor itself was not the only reason. It came after a longer period of continuous requirements, accumulated technical debt, architectural disagreement, and the feeling that we were restructuring systems while still moving at the same pace that had created much of the complexity in the first place.

By December 1, I had already decided internally that I would resign. My plan was to send the resignation letter in January. I never told the company that, although I think the change in my behavior during that month was probably noticeable.

I never got to send the letter.

On 3rd week of December, I was told that my employment would end. My final working day was December 31.

In a strange way, the decision had already happened on my side before the company made theirs. I had stopped imagining myself staying there long-term; they simply reached the ending before I formally did.

But I still had two weeks of work left, and by then another engineer was taking over ownership of the codebase.

I did not want those final weeks to become a countdown where I simply stopped caring. We continued pair programming through the important parts of the refactor, and I focused more heavily on transferring context: how the billing architecture was structured, which decisions had been deliberate, where the implementation had diverged from the original plan, and which parts were likely to cause trouble later.

The implementation still needed to be understandable. The migrations still needed to be safe. The tests still needed to work. The engineer taking over still needed enough context to continue without reconstructing months of decisions from Git history.

By then, I had already decided I did not want to stay, and the company had already decided I would not.

I still wanted the code I left behind to be maintainable.

Those things were never contradictory to me.

## What I Would Do Differently Now

Years later, I can articulate my objection better than I could at the time.

I do not think the lesson is that a big-bang refactor is always wrong. There are systems where an incremental migration would preserve so many old constraints that replacing the structure directly is the better decision.

I also do not think unifying similar entities is inherently wrong. Sometimes several domain concepts really are variations of one underlying abstraction, and representing them that way removes enormous amounts of unnecessary complexity.

My concern was about the order of operations.

We had substantial implementation debt: duplicated logic, expensive data flows, unclear responsibilities, and behavior that had accumulated under continuous feature pressure.

I wanted to reduce that noise before deciding which domain boundaries were unnecessary.

Instead, we restructured while carrying much of that noise with us.

That experience made me much more cautious about architectural changes that promise simplicity primarily by reducing the number of visible components.

Four tables becoming one table is measurable.

Four services becoming one abstraction is measurable.

Four endpoints becoming one is measurable.

But fewer components do not automatically mean fewer concepts.

Sometimes the complexity has genuinely disappeared.

Sometimes it has only moved.

## I Would Still Build It Properly

There is another lesson from that period that has stayed with me.

Engineers are going to lose design arguments.

Sometimes the other proposal is genuinely better. Sometimes there is business context you do not have. Sometimes the decision maker values a different trade-off. Sometimes you still believe the decision is wrong after everyone has explained themselves.

You document your concern. You make sure the important risks are understood.

Then, if the decision is made and it is still your responsibility, you build it properly.

I could disagree with consolidating the billing architecture and still write the migration carefully. I could dislike the abstraction and still test it. I could think the gradual approach was safer and still make sure the engineer inheriting the chosen approach understood how it worked.

Craftsmanship does not require agreement.

If I faced the same architectural problem now, I would still start by asking the question I was trying to answer back then:

How much of this complexity comes from the domain, and how much comes from the way we currently implemented it?

I would want to remove the second one before redesigning the first.

Because restructuring technical debt does not necessarily remove it.

Sometimes you just give it a nicer address.
