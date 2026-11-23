---
title: "TypeScript Habits That Actually Saved Me"
description: "Defining data shapes before writing the implementation changed how I debug TypeScript code."
pubDate: 2026-02-02
tags: ["typescript", "dev"]
draft: false
---

Before I worked primarily with TypeScript, most of my backend work was in PHP and Laravel. I remember spending a lot of time tracing where a variable came from, where it changed, and what shape it had at each point in the flow. When something behaved unexpectedly, I would often add logs at several steps just to make sure I had not missed something along the way.

That approach worked, but it also meant I spent a lot of development time checking assumptions manually. I had to keep the state of the data in my head while reading through the code, and the deeper the flow became, the more effort it took to be confident that I understood what was actually happening.

When I moved more of my work to TypeScript, one of the habits that had the biggest impact on me was defining types properly, especially for arrays and objects. I started thinking less about figuring out what a variable contained after the code was already written and more about defining what the data was supposed to look like before I wrote the logic around it.

## From JavaScript to TypeScript

At one point, I continued working on a codebase where variables were being passed around quite freely, and Babel was being used to compile the JavaScript. Eventually, our team decided to refactor the codebase to TypeScript and move the build process to the native TypeScript compiler.

After the migration, our build time dropped from about 100 seconds to 80 seconds.

The function signatures made the data shapes visible. I could see what a function expected to receive and what it returned without tracing every possible path. The compiler could flag callers that passed the wrong shape.

That also made the codebase easier to maintain and extend. When adding a feature, I could rely more on the compiler to point out places that needed to be updated instead of discovering those problems later while manually testing the application.

## Let the Compiler Check the Boring Parts

These days, I do not spend nearly as much time tracing variables several layers deep just to figure out whether a field exists or what a function returns. When the types are defined properly, the compiler can catch a large part of those problems for me, and my IDE will often highlight the issue before I even run the code.

That does not mean TypeScript catches everything. Runtime data can still be wrong, external APIs can still return unexpected values, and business logic can still be incorrect. What it does give me is a way to eliminate a whole category of mistakes before they become something I have to investigate manually.

It also changed how I write conditions. I do not need to repeatedly write defensive checks for every possible type when the type system has already established what a value can be. Most of the time, I only need to handle the cases that are actually meaningful for the data, such as checking whether a value matches a specific condition or whether the result is falsy.

## Types Should Come Before the Implementation

This is probably the most important habit TypeScript gave me. I do not think adding types after the implementation is finished is particularly useful when the only goal is to make the compiler stop complaining. In that situation, TypeScript becomes another thing you have to satisfy instead of something that helps you structure the code.

I prefer to think about the data shape first. What does this function receive? What should it return? Which fields are required? Which values are optional? Can the object have several valid states, and if it can, should those states be represented explicitly?

Once those questions are clear, the implementation usually becomes easier to write. I am no longer discovering the structure of the data while debugging the code because I already decided what that structure should be before writing the logic.

When I debug a missing field now, I start at the function signature. If the field is optional, I can look at how that case is handled. If the type says the field is required, I look at where the data entered the application and whether we checked it there. That gives me a place to start before I add another log.
