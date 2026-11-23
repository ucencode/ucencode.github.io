---
title: "Making Automated Tests Faster With SWC"
description: "Automated tests gave me confidence until the test suite became expensive to run. Understanding what ts-jest was doing led me to SWC, and to a decorator metadata problem I did not expect."
pubDate: 2026-06-10
tags: ["engineering", "backend", "typescript", "testing", "jest", "swc"]
draft: false
---

When I was first introduced to automated testing, especially unit tests and integration tests, my reaction was basically, bruh, this test is so good. Before that, changing code often meant manually checking whether the feature still worked, and it became even more annoying when I touched something shared by several parts of the domain because I had to think about what else might have been affected. With automated tests, I could make a change, run the tests, and get much more confidence that the code still behaved as expected. When I changed something that connected different parts of the domain, the tests could also catch when I had broken an assumption somewhere else.

Once we started implementing tests across all the packages, though, the cost began to accumulate. Integration tests were naturally heavier because they exercised more of the application and required more resources, while concurrency also had to be limited because CPU was still a finite resource. Eventually, running the integration tests could take around six to ten minutes. The unit tests had their own problem because the overall resource usage had grown enough that my 32 GB of RAM was no longer enough to run everything comfortably, so I ended up allocating more swap space just to handle the workload.

## When More Hardware Seemed Like the Answer

I asked a senior engineer whether he had run into the same problem. The tests ran fine on his machine, which had 96 GB of RAM. He suggested adding more memory to mine.

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

Here is a minimal version of the setup. In `jest.config.cjs`, use `@swc/jest` to transform TypeScript files:

```js
module.exports = {
  transform: {
    "^.+\\.tsx?$": "@swc/jest",
  },
};
```

Then set the TypeScript parser and decorator options in `.swcrc`:

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

Without `decoratorMetadata: true`, SWC didn't emit the type metadata that TypeORM reads through `reflect-metadata`. Tests involving those entities failed.

See the [SWC Jest setup](https://swc.rs/docs/usage/jest) and [SWC compilation options](https://swc.rs/docs/configuration/compilation) for the configuration details.

That was also the part of the migration I had not anticipated. I was not simply replacing one TypeScript transformer with another. I was changing the compilation behavior underneath libraries that depended on specific output, so I had to make sure SWC reproduced the behavior that those libraries were relying on.

Once I understood that, the migration became much more straightforward.

## The Feedback Loop Got Faster

After configuring SWC, I got feedback sooner when rerunning the invoicing unit tests during the refactor.

## The Trade-Off Made Test Quality More Important

SWC transpiles TypeScript without type checking, so I still rely on the normal TypeScript build to catch type errors. That made me pay closer attention to what Jest was checking. A suite can pass even when its assertions miss an important invoicing case.

During a refactor, I want a failing test to tell me which invoicing behavior changed. If I can rerun that test after each small edit, I have a better chance of spotting which change broke it.
