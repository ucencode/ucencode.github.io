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