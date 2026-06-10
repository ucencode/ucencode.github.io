---
title: "ts-jest Was Too Slow and I Needed to Understand Why Before Switching"
description: "Migrating from ts-jest to SWC for faster test compilation, and the TypeScript decorator flags that made it work with TypeORM."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

9. "ts-jest Was Too Slow and I Needed to Understand Why Before Switching"

Summary: The medusa-plugin-invoice unit tests used ts-jest, which performs TypeScript compilation at test time. On Ahmad's machine, running the test suite took long enough that the feedback loop for the Unified Billing refactor became painful — every change required waiting for full compilation before seeing results. He migrated to @swc/jest, which compiles TypeScript with Rust-based SWC instead. The tricky part: the plugin uses TypeScript decorators (@Entity, @Column) with reflect-metadata, and SWC's decorator support requires explicit legacyDecorator: true and decoratorMetadata: true in .swcrc. Without those flags, every test that instantiated a TypeORM entity would fail with a cryptic Reflect is not defined error. The commit message says "migrate to SWC for faster builds" — the diary entry is about the 20 minutes spent reading SWC documentation to understand why decoratorMetadata is a separate flag.

Original situation: The test suite worked but was slow enough to discourage running it frequently during a large refactor.
What triggered it: Needing a fast feedback loop during the 17-day billing refactor.
Investigation: Read ts-jest documentation, compared ts-jest compilation time vs. swc. Found that swc is 10–20× faster for this use case.
Obstacles: SWC handles TypeScript decorators differently from tsc. Specifically, decoratorMetadata: true is required to support reflect-metadata, which TypeORM depends on.
Solution: Add .swcrc with legacyDecorator: true, decoratorMetadata: true, and decorators: true in the parser options.
Alternatives: Keep ts-jest but use isolatedModules: true to skip type checking during tests — rejected because it loses type errors in test files.
Lessons: Switching compilers for tests is usually worth it, but decorator metadata support is the hidden trap. Test the switch with a single file before migrating the whole suite.

Educational value: 7/10 | Authenticity as diary: 8/10
Audience: TypeScript backend engineers, anyone using TypeORM decorators in tests | Reading time: 5 min
Recommended structure: The slow feedback loop problem → ts-jest vs swc comparison → the decorator metadata trap → the .swcrc configuration → verifying the migration