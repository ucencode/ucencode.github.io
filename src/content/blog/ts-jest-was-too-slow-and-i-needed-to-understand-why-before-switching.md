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

---

POLISHED

---

title: "When My Unit Tests Needed More RAM Than My Application"
description: "Automated tests gave me confidence to change code. Then the test suite became slow enough to change how I thought about the testing toolchain itself."
pubDate: 2026-05-25
tags: ["typescript", "testing", "jest", "swc"]
draft: true
-----------

When I was first introduced to automated testing, especially unit and integration tests, my reaction was basically: bruh, this is so good.

Before that, testing a change meant spending much more time manually checking what I had implemented. It became even more annoying when I touched code connected to other domains or features, because I also had to think about what else I might have accidentally affected.

Automated tests changed that experience. I could implement something, run the tests, and get much more confidence that the code still behaved as expected. More importantly, when I touched shared code, tests from other parts of the system could tell me when my change had broken an assumption somewhere else.

For a while, it felt like the obvious answer was simply to have more tests.

Then we had more tests.

## When the Test Suite Became Its Own Workload

As automated testing spread across the packages in our codebase, the cost started accumulating.

Integration tests were naturally expensive because they involved more components and resources. We also had to limit concurrency because CPU and other resources were finite. Eventually, running the integration tests could take around six to ten minutes.

The unit tests had a different problem.

Memory consumption became large enough that the 32 GB of RAM on my machine was not sufficient for comfortably running everything. I ended up allocating more swap space just to accommodate the test workload.

That was the point where I started wondering whether something was wrong with how we were running the tests rather than with the machine running them.

I asked one of my senior engineers about it, hoping there was some configuration, optimization, or architectural problem we could investigate.

There was a solution.

Buy a machine with 96 GB of RAM.

Technically, yes. That would solve the immediate problem.

It was not quite the kind of optimization I had in mind.

## Then I Got Ownership of My Domain

Some time later, I had full ownership of one of my domains: the invoicing domain, implemented as a Medusa plugin wrapped in its own package.

Eventually, I entered a large refactoring period that touched almost every part of that domain. This meant the tests were no longer something I occasionally ran after implementing a feature. I needed them constantly.

Change something. Run the tests.

Change another thing. Run them again.

Break something. Fix it. Run them again.

With that kind of development loop, test execution time becomes much more noticeable. A test suite that feels acceptable when you run it occasionally can become frustrating when you need feedback after almost every meaningful change.

The unit tests in this package were using `ts-jest`, which meant TypeScript compilation was part of the test execution process. That gave us useful guarantees, but during a large refactor I started questioning whether every test run actually needed the TypeScript compiler to do all of that work.

The production code would still go through the normal TypeScript compilation and type checking before it could actually be built and shipped.

The tests had a different job.

I wanted them to give me feedback quickly.

## Moving the Unit Tests to SWC

I decided to migrate the Jest transformation step from `ts-jest` to `@swc/jest`.

Instead of compiling the TypeScript test code through the regular TypeScript toolchain, Jest could use SWC to transform it into executable JavaScript much faster.

The migration itself looked straightforward until it reached one particular part of the codebase: TypeORM entities.

The plugin used TypeScript decorators such as `@Entity` and `@Column`, together with `reflect-metadata`. Those decorators depend on metadata that the normal TypeScript compiler had previously been generating for us.

SWC could support the same behavior, but it needed to be told explicitly.

The relevant configuration ended up looking roughly like this:

```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "decorators": true
    },
    "transform": {
      "legacyDecorator": true,
      "decoratorMetadata": true
    }
  }
}
```

Without the decorator configuration, tests involving those entities failed even though the application code itself was perfectly valid.

That forced me to understand something I had previously taken for granted. `ts-jest` was not merely removing TypeScript syntax before running my tests. The compilation behavior also included features that libraries such as TypeORM relied on at runtime.

Switching compilers meant those assumptions became my responsibility.

## Faster Tests, Fewer Guarantees

Once the migration was working, the difference in the feedback loop was immediately noticeable. Unit tests in the invoicing domain became much faster to execute, which mattered enormously while I was changing large parts of the package.

But that speed came with a trade-off.

SWC was transforming the TypeScript code, not type-checking it in the same way `ts-jest` had.

At first, losing type checking during unit test execution sounds like an obvious regression. Why would I intentionally remove a useful validation step from my tests?

Because I did not actually remove type checking from the project.

The main application code still had to pass the normal TypeScript compilation and type checking used by the production build. Type safety was still part of the development and delivery process. I was only separating it from the unit-test feedback loop.

That distinction became important to me.

I did not necessarily need one command to validate everything every time I changed a few lines of code. I needed different tools to answer different questions.

The unit tests could answer whether the behavior I was testing still worked.

The TypeScript compiler could answer whether the code satisfied its type constraints.

The production build still required both worlds to be valid.

## The Trade-Off Changed How I Treated Tests

There was a consequence to making the test runner less strict.

Because the unit-test compilation step was no longer catching type errors for me, I had to pay more attention to what the tests themselves were actually doing. A test passing did not automatically mean everything about that test was valid.

It also made test quality more important. I needed to make sure the tests actually exercised the behavior they claimed to cover instead of treating a green test suite as proof that the implementation was correct.

Code coverage helped, but coverage alone was not enough either. A line being executed does not mean the assertion around it is meaningful.

The trade-off was acceptable because the responsibility had not disappeared. It had been moved.

Type checking belonged to the TypeScript compilation process. Behavioral verification belonged to the tests. The faster test runner made it possible for me to run those behavioral checks much more frequently during development.

And during a refactor that touched almost an entire domain, frequency mattered.

## More Hardware Wasn't the Only Answer

I still think about that 96 GB RAM suggestion sometimes.

Throwing more hardware at a development workload is not inherently wrong. Developer time is expensive, RAM is relatively cheap, and sometimes buying faster machines genuinely is the most economical solution.

But that experience made me start asking a different question whenever development tooling becomes expensive.

Not just:

> How do I make this workload run faster?

But also:

> Why is this workload doing all of this work in the first place?

My unit tests did not necessarily need to compile and type-check TypeScript every time they ran. Once I separated those responsibilities, I could make the feedback loop much faster without removing type checking from the actual production path.

Automated tests originally taught me that I did not have to manually verify everything after every change.

Years later, the test suite taught me almost the same lesson about itself.

I did not need every test run to verify everything either.
