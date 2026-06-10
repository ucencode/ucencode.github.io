---
title: "Three Commits in Two Days and the Draft Invoice Child Items Still Weren't Right"
description: "Five commits across two days to fix a parent-child invoice item relationship that kept breaking in different ways. A story about underestimating data model depth."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

7. "Three Commits in Two Days and the Draft Invoice Child Items Still Weren't Right"

Summary: Between November 13–16, Ahmad made five commits to the same section of DraftInvoiceService — all touching the parent-child relationship between invoice items. The root problem: when a process chain added items to a draft invoice, child items (variants of a parent service) were either not created, duplicated, or had their parent_draft_invoice_item_id set to the wrong ID. Each commit added more logging, changed the partitioning logic (using lodash.partition to separate items with and without parent references), adjusted the flattening strategy, and re-introduced proper transaction isolation. The final commit description: "streamline child item creation process and improve transaction handling" — which is developer-speak for "I finally understood the data model." The diary moment: when you realize the tree structure you assumed was two levels deep was actually three.

Original situation: Adding a product package to a draft invoice from the predefined tab was not applying items to the service occasion correctly.
What triggered it: A customer report: "Items from my process chain are not appearing in the draft invoice."
Investigation: Added logging to trace item creation. Found that childItems from the chain were being added before the parent item had a committed ID.
Obstacles: TypeORM transactions: creating a parent and its children in the same atomicPhase_ required the parent to be flushed before children could reference it.
Solution: Separate the parent item insert from child item inserts within the transaction. Use lodash.partition to split items into those with and without parent references.
Alternatives: Denormalize the tree (store full item details without parent FK) — rejected as it would break the billing summation logic.
Lessons: Parent-child FK relationships inside transactions require explicit flush points. Assuming TypeORM's cascade will handle the ordering is usually wrong.

Educational value: 8/10 | Authenticity as diary: 10/10
Audience: Backend engineers working with TypeORM entity trees, anyone debugging tree persistence bugs | Reading time: 7 min
Recommended structure: The original bug report → tracing the item creation flow → the transaction flush problem → the fix → what "I finally understood" means in a commit message