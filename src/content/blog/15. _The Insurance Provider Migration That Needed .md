---
title: "The Insurance Provider Migration That Needed to Learn About generateEntityId"
description: "A data migration using raw UUID generation, then rewritten to use Medusa's generateEntityId — and what that required from the migration file's imports."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

15. "The Insurance Provider Migration That Needed to Learn About generateEntityId"

Summary: In late November, Ahmad built German and Swiss insurance provider records via a data migration. The first version used uuid_generate_v4() directly in the SQL INSERT — a reasonable approach. Then Ahmad replaced it with generateEntityId(), Medusa's deterministic ID generator that produces human-readable prefixed IDs (like ins_01HXXX). The reason for the change: UUIDs make debugging hard when you need to look up records by ID in logs; Medusa-style IDs are sortable by creation time (ULID-based) and namespace-identifiable by prefix. But using generateEntityId in a TypeScript migration file meant the migration itself had to import the Medusa utility — adding a compile-time dependency to what would otherwise be a SQL-only migration. A small architectural friction that reveals a larger question about where domain logic lives.

Original situation: A data migration seeding German and Swiss insurance providers using raw UUID generation.
What triggered it: Code review feedback that the IDs should follow Medusa's ID conventions for consistency.
Investigation: Reading how other Medusa migrations generated entity IDs. Finding generateEntityId in @medusajs/utils.
Obstacles: Importing a JavaScript utility in a TypeScript migration creates a dependency on the utility's compiled output being available at migration runtime.
Solution: Use generateEntityId("", "ins") to generate the ID in TypeScript before the SQL INSERT.
Alternatives: Keep raw UUIDs — defensible, but inconsistent with the rest of the codebase.
Lessons: ID format is a schema decision. Making it consistent across the codebase (including seeded data) makes debugging significantly easier. The cost is a compile-time dependency in migrations.

Educational value: 7/10 | Authenticity as diary: 8/10
Audience: Engineers working with Medusa or any framework with opinionated entity IDs | Reading time: 4 min
Recommended structure: UUID vs. prefixed ULID → why the format matters in production debugging → the migration dependency tradeoff → a general principle