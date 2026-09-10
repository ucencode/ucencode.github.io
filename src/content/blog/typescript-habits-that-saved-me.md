---
title: "TypeScript Habits That Actually Saved Me"
description: "I tried to put static typing to my code."
pubDate: 2026-02-02
tags: ["typescript", "dev"]
draft: false
---

Before I worked primarily with TypeScript, most of my backend work was in PHP and Laravel. I remember spending a lot of time tracing where a variable came from, where it changed, and what shape it had at each point in the flow. When something behaved unexpectedly, I would often add logs at several steps just to make sure I had not missed something along the way.

That approach worked, but it also meant I spent a lot of development time checking assumptions manually. I had to keep the state of the data in my head while reading through the code, and the deeper the flow became, the more effort it took to be confident that I understood what was actually happening.

When I moved more of my work to TypeScript, one of the habits that had the biggest impact on me was defining types properly, especially for arrays and objects. I started thinking less about figuring out what a variable contained after the code was already written and more about defining what the data was supposed to look like before I wrote the logic around it.

## From JavaScript to TypeScript

At one point, I continued working on a codebase where variables were being passed around quite freely, and Babel was being used to compile the JavaScript. Eventually, our team decided to refactor the codebase to TypeScript and move the build process to the native TypeScript compiler.

The biggest difference was not simply that the code now had type annotations everywhere. The structure of the data became much more visible, and the compiler could enforce those expectations for us. The code became more deterministic because I could see what a function expected to receive and what it was supposed to return without having to trace every possible path manually.

That also made the codebase easier to maintain and extend. When adding a feature, I could rely more on the compiler to point out places that needed to be updated instead of discovering those problems later while manually testing the application.

There was also a measurable improvement in the build process. What previously took around 100 seconds dropped to roughly 80 seconds after the migration, cutting around 20% from the build time. That was a nice improvement, but for me, the bigger change was how much less time I had to spend manually investigating variables.

## Let the Compiler Check the Boring Parts

These days, I do not spend nearly as much time tracing variables several layers deep just to figure out whether a field exists or what a function returns. When the types are defined properly, the compiler can catch a large part of those problems for me, and my IDE will often highlight the issue before I even run the code.

That does not mean TypeScript catches everything. Runtime data can still be wrong, external APIs can still return unexpected values, and business logic can still be incorrect. What it does give me is a way to eliminate a whole category of mistakes before they become something I have to investigate manually.

It also changed how I write conditions. I do not need to repeatedly write defensive checks for every possible type when the type system has already established what a value can be. Most of the time, I only need to handle the cases that are actually meaningful for the data, such as checking whether a value matches a specific condition or whether the result is falsy.

## Types Should Come Before the Implementation

This is probably the most important habit TypeScript gave me. I do not think adding types after the implementation is finished is particularly useful when the only goal is to make the compiler stop complaining. In that situation, TypeScript becomes another thing you have to satisfy instead of something that helps you structure the code.

I prefer to think about the data shape first. What does this function receive? What should it return? Which fields are required? Which values are optional? Can the object have several valid states, and if it can, should those states be represented explicitly?

Once those questions are clear, the implementation usually becomes easier to write. I am no longer discovering the structure of the data while debugging the code because I already decided what that structure should be before writing the logic.

That is also why I find types particularly useful for arrays and objects. A loosely structured object can force me to repeatedly inspect what might be inside it, while a properly defined type gives me a clear boundary around the data. When I pass that object somewhere else, the receiving code already has a contract for what it is supposed to get.

## The Habit Changed How I Debug

The biggest impact was not that TypeScript gave me more syntax to write. It changed where I spent my time.

Before, a lot of debugging involved following data through the application and checking whether my assumptions about that data were correct. Now, many of those assumptions are represented directly in the type system, so the compiler or my IDE can tell me when I am violating them.

That means I can spend more time thinking about whether the code is actually correct instead of repeatedly asking myself what shape a variable might have.

There are still plenty of bugs that only exist at runtime, and no type system is going to replace testing or understanding the business rules. But having the compiler handle the mechanical parts of data validation removes a lot of unnecessary investigation from the development process.

> It is not just that the compiler catches mistakes. It is that by defining the data shape first, I have fewer assumptions to verify manually in the first place.
