---
title: "The Meilisearch Batch That Silently Failed on One Bad ID"
description: "One malformed composite ID caused an entire Meilisearch batch indexing job to fail silently — no logs, no alerts, just stale search results."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

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