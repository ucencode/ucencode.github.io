---
title: "I Wanted to Clean the Code Before Changing the Architecture"
description: "The billing system had accumulated duplicated logic, expensive data flows, and unclear boundaries. I wanted to clean those problems up first, but we chose a larger architectural refactor instead."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: false
---

Before we decided to restructure our billing system, I had already done several refactors around it.

A lot of the code had been written while we were moving fast and trying to keep delivering. Over time, the core flow became more complicated than it needed to be. We had repeated calculations, similar logic implemented in different services, and database queries that fetched large nested structures even though we only used a small part of the result.

Some queries did not explicitly select the columns we actually needed, so TypeORM defaulted to fetching the columns defined by the entity, sometimes together with nested relations. We would get a lot of data back, pass it through several layers, and then use only a few values from it. Some of that data was not even used at all.

There was also business logic that had been implemented separately in different places. It was the kind of code that happens when the priority for a long time is simply to keep delivering. That was understandable, but the problem was that we never really stopped delivering.

## We Kept Adding More

At some point, several of us proposed taking some time to stabilize the development environment and clean up what had accumulated, but new requirements kept coming. I also understood why. There were client commitments, revenue targets, deadlines, certifications, and other business reasons why development could not simply stop while engineering cleaned everything up.

I did not expect the business to wait until the codebase was perfect before we built another feature. What concerned me was that stabilization kept being postponed while the complexity continued growing. We were still delivering, but we were also spending more time dealing with problems created by the way the system had grown.

Some requirements were normal product changes, while others changed things we had already built around. There were even new features that went against constraints we had been given earlier, so something we had designed around one assumption suddenly had to support the opposite.

Every change added something else to the existing flow. We would add another condition, another exception, or another piece of data that had to pass through several layers because something might need it later. This was happening while bugs were already common, which made me more concerned about continuing to add changes without first stabilizing some of the core flow.

The billing system eventually had four main parts: draft, invoice, external billing, and correction. They were separate, but they also had a lot of duplicated logic between them. Totals were calculated in several places, line items were processed in similar ways, CRUD operations followed almost the same patterns, and things like PDF generation and events appeared across multiple services.

It was already difficult to work with, but I also knew we could not simplify everything in one small change. Anything we changed at the core could affect almost the entire billing domain, so I wanted to reduce that complexity in smaller steps.

## I Wanted to Untangle the Logic First

My proposal was to do it gradually. Before changing the whole structure, I wanted to clean up the logic we already had and understand which parts were actually shared.

If three services calculated totals in almost the same way, we could start there and extract the common calculation. If several services handled line items similarly, we could identify which parts were really the same instead of maintaining several slightly different implementations.

I also wanted to simplify how we fetched and moved data around. If a query fetched a large nested structure and we only needed a few fields, we should fetch only those fields. If some values traveled through several layers without contributing anything to the final result, we should remove them.

Once the duplicated and unnecessary logic was reduced, each service would mostly contain the behavior that actually made it different. We could then look at what remained and decide whether having separate services was still necessary.

Maybe after cleaning everything up, we would find that some of those services really should be merged. I was not against restructuring or abstraction. I just wanted us to understand what was actually shared before deciding which boundaries should be removed.

My preferred order was to clean the implementation first, understand the remaining responsibilities, and then restructure what still needed to be restructured. The decision we made went in a different direction.

## We Unified the Billing Documents Instead

The decision was to move toward one `BillingDocument` architecture. Drafts, invoices, external billing, and corrections would use a shared representation. Their tables and items would be consolidated, common behavior would move into shared services, and different document types would be handled by their own handlers.

I understood the reason for doing this. There would be fewer tables and fewer places containing similar logic. Common operations could live in one place, and changes that really applied to every billing document would be easier to make.

I was not against the idea of unifying common behavior either. The duplicated behavior was already one of the problems I wanted to fix. What I disagreed with was starting from the data structure instead of starting from the service and business flow.

I would rather have extracted the calculations, line item processing, PDF generation, event handling, and other behavior that was genuinely shared. Draft, invoice, external billing, and correction could still keep their own boundaries while using those shared abstractions.

After those flows became clearer and the system was more stable, we could evaluate the data model again. If consolidating the tables still made sense at that point, I would have been more comfortable doing it because we would have had a clearer understanding of what was actually shared.

Instead, we were changing the service structure and the underlying data representation while the original implementation problems were still there. That was the part of the approach that concerned me.

## They Shared Data but Had Different Lifecycles

A draft was basically a workspace. You could change the line items, update information, recalculate things, and keep editing it until it was ready. Its main purpose was to hold something that was still being worked on.

An invoice had a different lifecycle. Once it was finalized, it had financial and legal meaning. It had payment information, could be sent to a patient, and some parts of it should no longer behave like editable draft data.

External billing had its own rules too. It went through a third-party billing system, had different numbering and submission behavior, and did not always use the same payment flow.

Corrections were different again because they existed in relation to another billing document. A correction could also be connected to another correction, so there could be a chain of related documents.

They shared a lot of fields. Patient information, line items, totals, physician information, dates, and other billing information appeared across them. They also shared enough operations that having common services and utilities made sense to me.

What I was less convinced about was whether sharing data and operations meant they should also share the same data representation. Their responsibilities were still different, and those differences had to be represented somewhere in the system.

I thought about it similarly to how a company can have sales, development, maintenance, and operations. They are all part of the same company and can share tools and processes, but we still separate their responsibilities because they are doing different kinds of work. I saw the billing concepts in a similar way. Sharing common behavior did not necessarily require removing their boundaries.

When different lifecycles were put into one representation, we still needed to distinguish them. A field might only apply to some document types and become nullable. An enum might determine which behavior should run, or a handler might need to check whether an operation was allowed for a draft but not for a finalized invoice.

This was why I felt that some of the separation was not really being removed. Part of it was moving from the data model into application logic.

## The Database Tradeoff Also Concerned Me

I also had concerns about what the consolidation meant for how we accessed the data. Putting more billing documents into a shared structure made the schema look simpler because we could use a common structure and distinguish the documents by type.

The tradeoff was that more document types and their items could now live inside the same tables. Queries needed to filter based on document type, state, relationships, and whatever information a particular operation needed. As the tables grew, indexes also became more important, especially for combinations of fields that were commonly used to find a specific type of document.

I did not see this as proof that the unified model was automatically bad. It was another cost that I thought we needed to consider. Reducing the number of tables could simplify one part of the architecture while requiring more filtering, indexing, and conditions in another part.

We also had autoscaling available, but I did not think adding more server resources addressed this particular concern. Autoscaling could help the application handle more load, but it would not make an inefficient query more efficient or reduce data that we did not need to fetch in the first place.

This was especially relevant because we already had places where TypeORM fetched more data than we needed. I wanted to reduce those patterns before putting more responsibility into a shared data structure.

## Caching Was Not an Easy Option for This Data

This was also not mostly static master data where we could put a cache in front of it and expect the data to remain unchanged for a long time. These billing documents were transactional and changed as users worked with them.

Drafts could be edited, invoices could change state, payments could affect their data, and corrections could be created later. The database still needed to be the source of truth for those operations.

Something like Meilisearch could still be useful for a specific purpose, such as searching across billing documents. I did not see it as a solution to the main transactional data access, though, because the search index would still need to be synchronized with data that could change frequently.

That would give us another representation of the data to maintain without removing the need for efficient database queries. For this part of the system, I preferred to make the primary data access efficient rather than depend on another layer to hide the cost.

## The Existing Problems Were Still There

My bigger concern with the larger refactor was that the problems that originally made us want to clean the system were still there. We still had duplicated logic, unnecessary data flows, and responsibilities that were difficult to understand, while we were also changing the structure underneath all of them.

With the gradual approach, I wanted to separate those problems. We could first remove the obvious redundancy and simplify the existing implementation, then look at what remained and decide whether the existing boundaries were actually wrong.

The approach we chose required us to answer those questions at the same time. We had to understand the old behavior, decide what was actually shared, migrate the existing data, introduce the new abstraction, and make sure the current product continued working while development was still ongoing.

I raised my concerns and explained why I preferred the gradual approach, but the decision went the other way. At the time, I was still relatively junior, so I did not have the authority to make the final architecture decision or enough experience to turn the disagreement into a long argument with people who had more influence over the system.

The decision had already been made, and implementing it was still part of my responsibility. Even though it was not the approach I preferred, I wanted to make sure the implementation itself was done properly.

## Building the Chosen Architecture

I worked on the architecture documentation, abstract service layers, handlers for the different billing document types, and the migration from the old entities into the new representation. The database migration itself was not small because we had thousands of existing rows across different structures, including several ID prefixes that had accumulated in the billing domain.

We could not lose existing data just because the new structure was different. The migration had to preserve that data while transforming it into the new representation, and tests had to make sure the existing behavior still worked after those changes.

Because the refactor was getting large, I also kept a status document to track what had already been migrated, what was still missing, and where we had problems. It was easier to maintain that document than to try to keep the entire migration state in my head.

Development also continued while we were doing this work. New requirements were still coming in while we were restructuring the system underneath them, which was one of the reasons I had originally preferred doing the refactor in smaller steps.

## Someone Else Had to Own It After Me

During the refactor, I was also pair programming with the engineer who would eventually take over much of the codebase. That became more important later because I did not want them to inherit a system where the context behind the implementation disappeared when I left.

We worked through the important parts together while I was still implementing them. I explained how the new architecture was supposed to work, why some decisions had been made, where the actual implementation was different from the original plan, and which assumptions were important to understand before changing things again.

I also tried to separate my disagreement with the architecture from explaining how it worked. The person taking over did not need me repeatedly telling them that I would have chosen another approach. They needed to understand what was actually there, why it worked that way, and where they needed to be careful.

They could form their own opinion about the architecture after working with it. My responsibility during the handover was to make sure they had enough context and were not inheriting a black box.

## Leaving the Job

By that point, I was already exhausted with the job. The refactor was not the only reason. It came after a longer period of continuous requirements, growing technical debt, architectural disagreements, and the feeling that we were trying to fix complexity while still working at the same pace that had created a lot of it.

I had already decided that I wanted to resign and planned to send my resignation later. Before I actually did that, I was told that my employment would end, so the company made its decision before I formally communicated mine.

I still had some time left before my final day, and I continued pair programming with the engineer taking over. I focused more on transferring context because the code still needed to be understandable, the migrations still needed to be safe, and the tests still needed to work.

The next person also needed enough information to continue without reconstructing months of decisions from Git history. Even though I no longer planned to stay, I still wanted the code I left behind to be maintainable.

## What I Think About It Now

Looking back, I do not think a large refactor is always wrong or that a gradual refactor is always better. Sometimes replacing a large part of a system at once makes sense, and sometimes several concepts really are similar enough that putting them behind one abstraction removes unnecessary complexity.

I also understand why engineering work cannot be considered separately from business requirements. There can be client commitments, revenue targets, certification deadlines, and other reasons why a company needs to keep delivering. I never expected development to stop until the engineering team considered the codebase perfect.

What concerned me was the order of the changes and where we chose to put the abstraction. We already had duplicated logic, unnecessary data being fetched and passed around, unclear responsibilities, frequent changes, and bugs that we were still dealing with.

In that situation, I would rather have started by making the business flow more structured and extracting behavior that was genuinely shared. That would not require the four billing concepts to remain separate forever. It would give us a clearer view of their responsibilities before deciding whether their data representation should also be consolidated.

Maybe after doing that work, we would still have decided that one `BillingDocument` model was the better architecture. I would have been more comfortable with that decision if it came after reducing the existing implementation problems and understanding the boundaries more clearly.

This experience also changed how I look at architectural simplicity. Having four tables become one table or several services become one abstraction is easy to see, but fewer components do not always mean fewer concepts.

If those concepts still have different lifecycles, rules, and data-access patterns, those differences still need to be represented somewhere. They can appear as nullable fields, enums, handler conditions, query filters, or additional indexes, depending on how the system is designed.

I also learned that disagreeing with a technical decision does not mean I should implement it badly. I can explain my concerns and propose another approach, but there will be times when the final decision is different from what I would choose.

In that situation, I still want to make the migration safe, write the tests, document the implementation, and make sure the next engineer understands what they are taking over. Disagreement with the design and responsibility for the implementation are two separate things.

If I faced the same kind of problem now, I would still ask how much of the complexity actually belongs to the domain and how much comes from the way we currently implemented it. I would prefer to reduce the implementation complexity first, then use what remains to decide which domain boundaries are actually unnecessary.
