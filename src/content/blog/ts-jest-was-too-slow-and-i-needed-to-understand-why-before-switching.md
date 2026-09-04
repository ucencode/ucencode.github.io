---
title: "ts-jest Was Too Slow and I Needed to Understand Why Before Switching"
description: "Migrating from ts-jest to SWC for faster test compilation, and the TypeScript decorator flags that made it work with TypeORM."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

How I want to tell/explain

At first i was being introduced into automated testing such as unit test and integration test. 

At first the experience is "bruh this test is so good, and i dont need to deeply test what i implemented and when i touched code that also connects other parts of domain/feature i know if it affects"

But once we implemented across all packages. the accumulation of that and limiting concurrency due to resource such as CPU. it takes a lot of time, integration test consumes 6 to 10 minutes. for unit test i need to allocate more space in swap because 32GB of RAM is not enough. i asked my senior why and i hope they have solution to optimize, but i receives smth else. they dont, their solution is buy a new machine with 96GB of RAM. 

time goes by and I got full ownership on my domain when i got momentum that touched almost all part of domain, i also updated my unit test that compiles using swc

Its resulting very fast unit test execution in my domain as medusa plugin which wrapped in a package.

The pro its so fast
The cons we dropped the typecheck, its an acceptable trade off. We still compile with typecheck in main code which used in production. but we need more attention to check what the test doing so its really covers the code coverage and really catches issues/bugs.

---
Truth:

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