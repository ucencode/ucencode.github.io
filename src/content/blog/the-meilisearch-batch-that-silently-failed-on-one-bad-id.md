---
title: "The Meilisearch Batch That Silently Failed on One Bad ID"
description: "One malformed composite ID caused an entire Meilisearch batch indexing job to fail silently — no logs, no alerts, just stale search results."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

I got a requirement to add a favorite item feature. The item itself already indexed to meilisearch.

I implemented the way it normally does firstly
I connected it via composite keys, connects to item_id, reference_id, and user_id. put db index on (user_id), (item_id, reference_id), and (user_id, item_id, reference_id).

I intentionally scoped out the mailisearch into this because the update is async can be delay from 1s to 5mins depends on the queue, and we're not ready to add concurrency dedeicated for this feature that dont need to aggresively scale up and the add/remove favorite item operation needs to be got instantly feedback.

I took steam as example. they intentionally dont index the wishlist feature. i can simply conclude that when it comes to seasonal sale such as summer or winter sale, I can load the homepage which intented to show it to most user and indexed it into faster access storage so everytime user send request it wont reach the database. and wishlist got down especially in the first day of sale because many people accessed it for checkout game they have been wishlisted  

so i learn from that and adjusting what my user needs, so yea i accepted the trade off, beside that, user dont frequently doing write operation for favorite_item, just accessed it.

several times ahead i checked enthusiatically and proudly present this is one of many feature i made during sprint.

but "so clever engineer" peer added meilisearch without any requirement from anyone

when it comes from demo, i got message from manager and alert from observability that the feature got issue that the feature isnt responsive enough, sometimes the list vanishes because the request is failing.

it made me pissed off and i cant forgive that. because it was not my responsibility to the peers did. but i paid the consequence of changing the code that already works in the last feature because from NPD peers. thank god later because of his behavior he got fired.

Later the EM changed the way meilisearch indexer doing reindex in server start.
It has flaws and favorite item sometimes the data still there but not showing any item name just empty favorite item. 

And the story continues in the truth

---
Truth:

6. "The Meilisearch Batch That Silently Failed on One Bad ID"

Summary: Meilisearch indexing for favorite items used composite IDs: a user_id and a reference_id joined by a separator. The batch indexer looped over hundreds of IDs, calling parseFavoriteItemId() for each — without error handling. One malformed ID from production data (perhaps created before the composite format was introduced) would throw, and the entire batch would fail silently, leaving the search index in a stale or partial state. There was no log entry, no error event, no alerting. Ahmad diagnosed this on a Saturday at 5:39am (the commit timestamp tells the story). The fix was a try/catch inside the map that included the batch index and the offending ID in the error message. Small change; explains exactly why search was not returning results for some users.

Original situation: Meilisearch indexing ran nightly, appeared to succeed (no crash), but some users' favorite items were missing from search.
What triggered it: A user support ticket about search not finding items they had favorited.
Investigation: Added logging to the indexer. Traced the composite ID parsing. Found a record whose ID didn't match the {userId}:{referenceId} format.
Obstacles: The silent failure: Array.map doesn't stop on a thrown exception from a called function — it depends on the outer context. In this case the outer .map() did throw, but the error was swallowed by a caller that didn't re-throw.
Solution: Explicit try/catch in the map callback with an error message that includes batch index and the bad ID value.
Alternatives: Validate IDs before the map and filter out malformed ones — considered, but would hide data integrity problems.
Lessons: Batch processing needs per-item error handling, not just outer try/catch. Silent failures in indexing pipelines are the hardest to debug because you can't reproduce the exact production data locally.

Educational value: 9/10 | Authenticity as diary: 9/10
Audience: Engineers working with search indexing, batch processing pipelines | Reading time: 6 min
Recommended structure: The silent failure pattern → tracing a batch indexer → the composite ID format → per-item error handling → what the test suite missed

“here's how a reasonable design decision slowly evolved into a failure mode nobody initially anticipated.”

---

POLISHED

---

title: "I Intentionally Kept Favorites Out of Meilisearch. Then We Put Them There Anyway."
description: "A favorite-item feature started with a deliberately boring database design. Moving it into an asynchronous search index created exactly the consistency problem I had tried to avoid."
pubDate: 2026-06-08
tags: ["backend", "meilisearch", "database", "search", "architecture"]
draft: true
-----------

I once got a requirement to add a favorite-item feature. The items themselves were already indexed in Meilisearch, so using the search index for favorites might have seemed like the natural choice.

I intentionally did not do that.

I started with the boring implementation: store the relationship in the database and connect it using `item_id`, `reference_id`, and `user_id`. I used a composite key for the relationship and added indexes around the access patterns I expected to use: `user_id`, the pair of `item_id` and `reference_id`, and the complete combination of `user_id`, `item_id`, and `reference_id`.

There was nothing particularly clever about it. A user could add an item to their favorites, remove it, or retrieve their favorites. The database already had everything necessary to do that.

More importantly, the result was immediately consistent.

That mattered more to me than putting everything into the search engine just because the items happened to already exist there.

## Why I Intentionally Left Meilisearch Out

Our Meilisearch updates were asynchronous.

Depending on the queue, an update could become visible within a second, or it could take several minutes. That was acceptable for the data we were already using it for, but it did not fit the interaction I wanted for favorites.

If a user clicks a favorite button, they expect immediate feedback. If they remove an item and open their favorites again, they expect that item to be gone. Waiting for an asynchronous indexing job to catch up would introduce eventual consistency into a feature that did not need it.

We could have allocated dedicated concurrency to make favorite updates propagate more aggressively, but that would have meant adding more infrastructure and resource usage for a feature that did not need to scale aggressively in the first place.

The workload was also naturally read-heavy. Users might open their favorite list many times, but they were not continuously adding and removing hundreds of favorites.

So I accepted the database access.

Part of my reasoning came from watching how other systems behave under load. Steam was one example I kept thinking about.

During a major seasonal sale, the store homepage is something almost everyone needs. It makes sense for that kind of broadly shared content to be heavily cached or indexed so millions of requests do not repeatedly perform expensive database work.

A wishlist is different. It belongs to an individual user and has a very different access pattern. During the first hours of a major sale, wishlist functionality has historically been one of the parts of Steam that can struggle while the general storefront remains accessible.

I did not take that as proof that Steam had the same architecture as ours. I obviously did not know their internal implementation.

What I took from it was simpler: not every piece of data needs the same availability and scaling strategy.

For our users and our expected traffic, I preferred the simpler consistency model.

The feature shipped, and it worked.

## Then Meilisearch Was Added Anyway

Several sprints later, I would still occasionally check the feature. I was proud of it. It was one of many features I had built during that period, and it had stayed pleasantly boring.

Then another engineer changed the implementation and integrated the favorite-item flow with Meilisearch.

There had been no new product requirement asking for this. We had not identified a database bottleneck in favorites. There was no scaling problem that required moving reads into the search index.

It was added as a technical change.

That bothered me, but initially the feature continued to exist and there were other things to work on.

The actual consequence became obvious during a demo.

I received a message from my manager around the same time observability started reporting problems. The favorite feature had become unreliable. Sometimes it was slow to respond. Sometimes requests failed. In some cases, the favorite list appeared to vanish entirely.

That was especially frustrating because these were failure modes the original implementation deliberately did not have.

The database-backed version had already worked. Now I was dealing with consequences from a change I had neither required nor designed, in a feature for which I still effectively carried ownership.

Eventually that engineer left the team, but the architectural change remained.

And once an additional system becomes part of a feature, removing the engineer who introduced it does not remove the additional system.

## Reindexing Introduced Another State to Reconcile

Later, our engineering manager changed how the Meilisearch indexer performed reindexing during server startup.

That solved some problems, but favorites still occasionally entered a strange state.

The favorite relationship was still present in the database. From the database's perspective, the user had not lost anything.

But the indexed representation could be incomplete.

The UI could therefore know that a favorite existed while failing to resolve the corresponding item correctly. A favorite entry might appear without an item name or with missing information, creating what looked like an empty favorite.

Now the feature effectively had two versions of reality.

There was the database, which contained the actual relationship, and there was Meilisearch, which contained the representation the application expected to retrieve.

As long as they agreed, everything looked fine.

When they did not, the user saw the disagreement.

## One Bad ID Was Enough

The problem became even more interesting when I later investigated cases where some favorite items were simply missing from search.

The indexing pipeline processed favorites in batches. Favorite items used composite identifiers built from values such as the user ID and reference ID, separated using an expected format.

Conceptually, an ID looked something like:

```text
{userId}:{referenceId}
```

During indexing, the batch processor would iterate through hundreds of those IDs and parse each one.

The implementation assumed every ID followed the expected format.

Production data disagreed.

At least one record contained an identifier that could not be parsed correctly. It may have been old data created before the composite format was introduced, or simply data that had entered the system through an unexpected path.

Whatever its origin, `parseFavoriteItemId()` threw when it reached that value.

That should have made the problem obvious.

It didn't.

## The Failure Was Being Swallowed

The exception propagated out of the batch transformation, but somewhere further up the indexing pipeline the error was swallowed.

The server did not crash. There was no useful error telling me which favorite caused the problem. There was no alert explaining that a particular batch had stopped processing halfway through.

From the outside, indexing appeared to have happened.

The result was simply incomplete.

That is an unpleasant failure mode for a search index because the source of truth can remain completely healthy. I could inspect the database and see the favorite relationship sitting there exactly where it should be.

Then I could query the search path and not get it back.

The feature was neither fully broken nor fully working.

It was just wrong for some users.

## I Needed the Indexer to Tell Me Which Record Was Bad

The eventual code change was small.

Instead of allowing the parsing failure to disappear into the surrounding batch operation, I handled it at the individual item and included enough context to identify exactly what had failed.

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

I deliberately did not silently filter malformed IDs.

Filtering them would have allowed the rest of the batch to continue, but it would also have turned corrupted or unexpected data into something the system quietly accepted.

If an ID violated the format we expected, I wanted to know about it.

The important improvement was not that the indexer could magically recover from malformed production data. It was that the next failure would tell me which record had violated the assumption.

A batch containing hundreds of records should not make one of those records anonymous when it fails.

## The Original Trade-Off Hadn't Disappeared

By this point, the favorite-item feature had travelled quite far from where it started.

Originally, it was a database relationship with immediate consistency. I had intentionally excluded Meilisearch because asynchronous indexing introduced a delay that the feature did not require.

Later, Meilisearch was added anyway.

That meant we needed to think about synchronization.

Then we needed reindexing behavior.

Then we had to handle cases where the database contained a favorite but the index did not contain enough information to display it.

Then a malformed composite ID revealed that an entire batch could become stale or incomplete without producing enough information to diagnose why.

None of these problems meant Meilisearch was bad technology. We were already using it successfully for workloads where search and fast indexed retrieval actually mattered.

The mistake was assuming that because a system was useful for one part of the application, another feature would automatically benefit from being moved into it.

Every additional representation of data creates another state that has to remain consistent.

Sometimes that cost is absolutely worth paying.

For favorites, I had originally decided it wasn't.

## Boring Architecture Can Be a Deliberate Decision

This experience changed how I react when someone describes an implementation as too simple.

A direct database query can look unsophisticated next to a search index, caching layer, asynchronous queue, or dedicated read model. But those systems are not free improvements. Each one changes the failure modes of the feature.

The original favorite implementation had a straightforward limitation: reads reached the database.

I knew about that limitation when I designed it, and I accepted it because the expected usage made the cost reasonable.

The indexed version solved that theoretical concern while introducing asynchronous propagation, synchronization, reindexing, partial failures, and another place where production data could disagree with the source of truth.

The important question was never whether Meilisearch could make favorite reads faster.

Of course it could.

The question was whether favorite reads needed it badly enough to justify everything that came with it.

For this feature, they didn't.

Sometimes the boring database query is not the architecture you ended up with because you forgot to optimize it.

Sometimes you already considered the optimization and deliberately decided not to need it.
