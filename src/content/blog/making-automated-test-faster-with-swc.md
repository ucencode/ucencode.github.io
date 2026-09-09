---
title: "Making Automated Test Faster With SWC"
description: "Automated tests gave me confidence until the test suite became expensive to run. Understanding what ts-jest was doing led me to SWC, and to a decorator metadata problem I did not expect."
pubDate: 2026-06-10
tags: ["engineering", "backend", "typescript", "testing", "jest", "swc"]
draft: false
---

When I was first introduced to automated testing, especially unit tests and integration tests, my reaction was basically, bruh, this test is so good. Before that, changing code often meant manually checking whether the feature still worked, and it became even more annoying when I touched something shared by several parts of the domain because I had to think about what else might have been affected. With automated tests, I could make a change, run the tests, and get much more confidence that the code still behaved as expected. When I changed something that connected different parts of the domain, the tests could also catch when I had broken an assumption somewhere else.

Once we started implementing tests across all the packages, though, the cost began to accumulate. Integration tests were naturally heavier because they exercised more of the application and required more resources, while concurrency also had to be limited because CPU was still a finite resource. Eventually, running the integration tests could take around six to ten minutes. The unit tests had their own problem because the overall resource usage had grown enough that my 32 GB of RAM was no longer enough to run everything comfortably, so I ended up allocating more swap space just to handle the workload.

## When More Hardware Seemed Like the Answer

I asked one of my senior engineers about the resource usage because I wanted to know whether there was something obvious I was missing. His answer was that there was no problem when he ran the tests, so I looked at his machine and noticed that he had 96 GB of RAM. His suggestion was simple: expand my RAM. From his environment, that made perfect sense because he was not experiencing the same limitation.

At the time, that was probably the most practical solution to the problem I was seeing. I just did not stop thinking about whether giving the test suite more hardware was really the only way to make it manageable.

## Then I Had to Refactor the Invoicing Domain

Later, I ended up with full ownership of the invoicing domain, which was implemented as a Medusa plugin and wrapped in its own package. I eventually started a large refactor that touched almost every part of the domain, and that was when the cost of the existing test setup became much more noticeable.

Waiting several minutes for a test suite is annoying when you run it occasionally, but during a large refactor you run tests constantly. I would change something, run the tests, notice another issue, make another change, and run them again. The waiting time was no longer just an inconvenience. It had become part of the development loop itself, and the slower that loop became, the more frustrating it was to work with.

The unit tests in that package were using `ts-jest`, so TypeScript compilation was part of the Jest execution process. That made me start looking into what the test runner actually needed to do every time I wanted feedback. The application still needed normal TypeScript compilation and type checking for the production code, but I started wondering whether the test runner really needed to perform the same amount of work every time a test was executed.

## Looking at ts-jest More Closely

I started looking at the test toolchain instead of assuming that the only solution was adding more RAM. `ts-jest` was handling TypeScript compilation as part of the testing process, while SWC could transform TypeScript using a much faster Rust-based compiler. The difference looked significant enough that switching was worth investigating, so I decided to migrate the Jest transformation from `ts-jest` to `@swc/jest`.

At first, the migration looked straightforward. Then TypeORM got involved.

## The Decorator Problem

The invoicing package used TypeORM entities with decorators such as `@Entity` and `@Column`, and those entities also relied on `reflect-metadata`. The existing TypeScript toolchain had already been handling the metadata that TypeORM expected, so when I switched to SWC, the tests involving those entities started failing.

I spent around twenty minutes reading through the SWC documentation to understand what was actually happening. The important part was that decorator support and decorator metadata were two separate things. I could enable decorators, but that did not automatically mean SWC would generate the metadata that TypeORM expected.

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

Without `decoratorMetadata: true`, tests involving the TypeORM entities would fail because the metadata expected by `reflect-metadata` was not being generated. The error itself was not particularly helpful, which made the problem initially feel more mysterious than it really was.

That was also the part of the migration I had not anticipated. I was not simply replacing one TypeScript transformer with another. I was changing the compilation behavior underneath libraries that depended on specific output, so I had to make sure SWC reproduced the behavior that those libraries were relying on.

Once I understood that, the migration became much more straightforward.

## The Feedback Loop Got Faster

After the SWC configuration was correct, the difference was immediately noticeable. The unit tests in the invoicing domain became much faster to execute, and that mattered much more to me than the benchmark itself because I could finally get feedback quickly while working through the refactor.

The whole point was not really that SWC was a faster compiler. The useful part was that the test loop stopped getting in the way of the work I was doing. I could make a change and get an answer much sooner instead of repeatedly waiting for a heavier TypeScript compilation process.

There was still a trade-off, though.

## Faster Tests, Less Work Per Test Run

Moving from `ts-jest` to SWC meant that the test transformation was no longer doing TypeScript type checking in the same way. At first, that sounds like an obvious regression because type checking is useful for catching mistakes, but I was not removing type checking from the project.

The production code still went through the normal TypeScript compilation and type checking process. I was separating that responsibility from the behavioral feedback loop provided by the tests. The tests needed to tell me whether the behavior still worked, while TypeScript needed to tell me whether the code satisfied its type constraints. I did not necessarily need both systems to perform all of their work every time I changed a few lines.

That made the trade-off acceptable to me. I would rather have a fast test suite that I could run repeatedly while working and let the normal build or type-checking process handle the type safety separately.

## The Trade-Off Made Test Quality More Important

There was still another consequence to that decision. Once the test runner stopped performing type checking, I became more conscious of what the tests themselves were actually validating. A test suite can pass while still having weak assertions, missing important cases, or simply failing to exercise the behavior that matters.

Code coverage does not solve that problem either. You can execute a lot of lines and still write tests that do not meaningfully prove anything. Faster tests made it easier for me to run them more frequently, but they also made it more important that those tests were actually useful.

That became the balance I was looking for. Type checking belonged to the TypeScript build process, while behavioral verification belonged to the tests. The test runner did not need to duplicate every responsibility of the compiler just to tell me whether the code still behaved correctly.

## More RAM Wasn't the Only Answer

Looking back, my senior's suggestion to expand my RAM was reasonable because the tests were running fine on his machine with 96 GB. The problem was that I was running them on a machine with 32 GB, so adding more memory would have addressed the immediate resource limitation.

What changed for me was that I stopped looking at the hardware as the only explanation for the problem. When something becomes expensive to run, there is always a temptation to throw more resources at it and move on, but sometimes the better question is what work is actually necessary in the first place.

In my case, the unit tests did not need the full TypeScript compilation workload every time they ran. Switching from `ts-jest` to SWC let me separate fast test transformation from the type checking that was still handled elsewhere in the development and production workflow.

> The tests originally taught me that I did not have to manually verify everything after every change. Later, the test suite taught me almost the same lesson about itself. I did not need every test run to verify everything either.
