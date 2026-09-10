---
title: "It Worked Fine Until Someone Optimized It"
description: "A favorite-item feature started with a deliberately boring database design. Moving it into an asynchronous search index created exactly the consistency problems I had tried to avoid"
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: false
---

I once got a requirement to add a favorite-item feature. The base items themselves were already indexed in Meilisearch.

I started with the boring implementation by storing the relationship in the database and connecting it using `item_id`, `reference_id`, and `user_id`. I used a composite key for the relationship and added indexes around the access patterns I expected to use: `user_id`, the pair of `item_id` and `reference_id`, and the complete combination of `user_id`, `item_id`, and `reference_id`.

There was nothing particularly clever about it. A user could add an item to their favorites, remove it, or retrieve their favorites, and the database already had everything necessary to do that.

More importantly, the result was immediately consistent. That mattered more to me than putting everything into the search engine just because the base items happened to already exist there.

## Why I Intentionally Left Meilisearch Out

Our Meilisearch updates were asynchronous. Depending on the queue, an update could become visible within a second, or it could take several minutes. That was acceptable for the data we were already using it for, but it did not fit the interaction I wanted for favorites.

If a user clicks a favorite button, they expect immediate feedback. If they remove an item and open their favorites again, they expect that item to be gone. Waiting for an asynchronous indexing job to catch up would introduce eventual consistency into a feature that did not need it.

We could have allocated dedicated concurrency to make favorite updates propagate more aggressively, but that would have meant adding more infrastructure and resource usage for a feature that did not need to scale aggressively in the first place.

The workload was also naturally read-heavy. Users might open their favorite list many times, but they were not continuously adding and removing hundreds of favorites, so I accepted the database access.

Part of my reasoning came from watching how other systems behave under load. Steam was one example I kept thinking about. During a major seasonal sale, the store homepage is fast to open, and this is something almost everyone needs, so it makes sense for that kind of broadly shared content to be heavily cached or indexed so millions of requests do not repeatedly perform expensive database work.

A wishlist is different because it belongs to an individual user and has a very different access pattern. During the first hours of a major sale, I got a 503 Service Unavailable instead. Wishlist functionality has historically been one of the parts of Steam that can struggle while the general storefront remains accessible.

I did not take that as proof that Steam had the same architecture as ours because I obviously did not know their internal implementation. What I took from it was simpler: not every piece of data needs the same availability and scaling strategy.

For our users and our expected traffic, I preferred the simpler consistency model. The feature shipped, and it worked.

## Then Meilisearch Was Added Anyway

Several sprints later, another engineer changed the implementation and integrated the favorite-item flow with Meilisearch. There had been no new product requirement asking for this, we had not identified a database bottleneck in favorites, and there was no scaling problem that required moving reads into the search index.

It was added as a technical change. That bothered me, but initially the feature continued to work and there were other things to work on.

The actual consequence became obvious during a demo. I received a message from my manager around the same time observability started reporting problems. The favorite feature had become unreliable. Sometimes it was slow to respond, sometimes requests failed, and in some cases the favorite list appeared to vanish entirely.

That was especially frustrating because these were failure modes the original implementation deliberately did not have. The database-backed version had already worked. Now I was dealing with consequences from a change I had neither required nor designed, in a feature for which I still effectively carried ownership.

Eventually that engineer left the team, but the architectural change remained. Once an additional system becomes part of a feature, removing the engineer who introduced it does not remove the additional system.

## Soft Delete Changed More Than I Expected

There was another change that made the situation more complicated. "a so-called clever low-level engineer" later introduced soft delete for the favorite-item data.

Originally, the database relationship followed a simpler delete behavior. Because the relationship was represented as a normal database record with cascade behavior, deleting the related data meant the favorite relationship would no longer exist.

With soft delete, that behavior changed. The record remained in the table with a non-null `deleted_at` value instead of actually disappearing.

At first, the reasoning sounded reasonable. If something was deleted accidentally, we could recover it.

Looking back, I think I could have pushed back on that trade-off more clearly. For a favorite-item relationship, the state seemed fundamentally binary to me. The item is favorited, or it is not. I did not immediately see a user requirement for keeping a deleted favorite in a recoverable state.

The more confusing part was that the delete logic had also become more complicated. A delete operation no longer meant that the record simply stopped existing for every query, because some queries could still retrieve previously deleted records.

That made me wonder about another question: why was a deleted favorite still reaching the Meilisearch indexer at all?

I no longer remember enough of the original implementation to say whether the problem was caused by the delete event itself, the indexer querying soft-deleted records, or the way the deleted state was interpreted before indexing. What I remember clearly is seeing a favorite that had already been deleted still taking part in the indexing flow and having to trace through that behavior.

That was another consequence of adding a state we had not originally needed. The system now had to understand not only whether a favorite existed, but whether it existed in an active or deleted state, and every part of the indexing flow had to interpret that state correctly.

## Reindexing Introduced Another State to Reconcile

Later, our engineering manager changed how the Meilisearch indexer performed reindexing during server startup. That solved some problems, but favorites still occasionally entered a strange state.

The favorite relationship was still present in the database, so from the database's perspective the user had not lost anything. The indexed representation could still be incomplete, however.

The UI could therefore know that a favorite existed while failing to resolve the corresponding item correctly. A favorite entry might appear without an item name or with missing information, creating what looked like an empty favorite.

Now the feature effectively had two versions of reality. There was the database, which contained the actual relationship, and there was Meilisearch, which contained the representation the application expected to retrieve.

As long as they agreed, everything looked fine. When they did not, the user saw the disagreement.

## One Bad ID Was Enough

The problem became even more interesting when I later investigated cases where some favorite items were simply missing from search.

The indexing pipeline processed favorites in batches. Favorite items used composite identifiers built from values such as the user ID and reference ID, separated using an expected format.

Conceptually, an ID looked something like:

```text
{userId}:{referenceId}
```

During indexing, the batch processor would iterate through hundreds of those IDs and parse each one. The implementation assumed every ID followed the expected format, but production data disagreed.

At least one record contained an identifier that could not be parsed correctly. It may have been old data created before the composite format was introduced, or simply data that had entered the system through an unexpected path.

Whatever its origin, `parseFavoriteItemId()` threw when it reached that value. That should have made the problem obvious, but it did not.

I remember finding and fixing the problem at around 2 AM. I do not remember every detail of the exact path I took to get there, but I remember that the batch processing needed to tell me exactly which record had failed rather than allowing the problem to disappear into the larger indexing operation.

## The Failure Was Being Swallowed

The exception propagated out of the batch transformation, but somewhere further up the indexing pipeline the error was swallowed. The server did not crash, there was no useful error telling me which favorite caused the problem, and there was no alert explaining that a particular batch had stopped processing halfway through.

From the outside, indexing appeared to have happened. The result was simply incomplete.

That is an unpleasant failure mode for a search index because the source of truth can remain completely healthy. I could inspect the database and see the favorite relationship sitting there exactly where it should be, then query the search path and not get it back.

The feature was neither fully broken nor fully working. It was just wrong for some users.

## I Needed the Indexer to Tell Me Which Record Was Bad

The eventual code change was small. Instead of allowing the parsing failure to disappear into the surrounding batch operation, I handled it at the individual item level and included enough context to identify exactly what had failed.

Conceptually, it looked like this:

```ts
items.map((id, index) => {
  try {
    return parseFavoriteItemId(id);
  } catch (error) {
    throw new Error(
      `Failed to parse favorite item at batch index ${index}: ${id}`
    );
  }
});
```

I deliberately did not silently filter malformed IDs. Filtering them would have allowed the rest of the batch to continue, but it would also have turned corrupted or unexpected data into something the system quietly accepted.

If an ID violated the format we expected, I wanted to know about it. The important improvement was not that the indexer could magically recover from malformed production data. It was that the next failure would tell me which record had violated the assumption.

A batch containing hundreds of records should not make one of those records anonymous when it fails.

## The Original Trade-Off Hadn't Disappeared

By this point, the favorite-item feature had travelled quite far from where it started. Originally, it was a database relationship with immediate consistency, and I had intentionally excluded Meilisearch because asynchronous indexing introduced a delay that the feature did not require.

Later, Meilisearch was added anyway. That meant we needed to think about synchronization, reindexing behavior, soft-deleted records, and cases where the database contained a favorite but the index did not contain enough information to display it. A malformed composite ID eventually revealed that an entire batch could become stale or incomplete without producing enough information to diagnose why.

None of these problems meant Meilisearch was bad technology. We were already using it successfully for workloads where search and fast indexed retrieval actually mattered.

The mistake was assuming that because a system was useful for one part of the application, another feature would automatically benefit from being moved into it. Every additional representation of data creates another state that has to remain consistent.

The same applied to soft delete. Keeping deleted records recoverable can be useful when the business needs that capability, but it is not automatically an improvement when the underlying feature only has a simple active-or-not-active state.

Sometimes those trade-offs are absolutely worth paying. For favorites, I had originally decided they weren't.

## Boring Architecture Can Be a Deliberate Decision

This experience changed how I react when someone describes an implementation as too simple. A direct database query can look unsophisticated next to a search index, caching layer, asynchronous queue, or dedicated read model, but those systems are not free improvements. Each one changes the failure modes of the feature.

The original favorite implementation had a straightforward limitation: reads reached the database. I knew about that limitation when I designed it, and I accepted it because the expected usage made the cost reasonable.

The indexed version solved that theoretical concern while introducing asynchronous propagation, synchronization, reindexing, partial failures, another data representation, and more states that had to be interpreted consistently.

The important question was never whether Meilisearch could make favorite reads faster. Of course it could.

The question was whether favorite reads needed it badly enough to justify everything that came with it. For this feature, they didn't.

> Sometimes the boring database query is not the architecture you ended up with because you forgot to optimize it. Sometimes you already considered the optimization and deliberately decided not to need it.
