---
title: "TypeScript Habits That Actually Saved Me"
description: "A few practical patterns I keep reaching for — not from a style guide, but from bugs I've already shipped."
pubDate: 2026-05-11
tags: ["typescript", "dev"]
draft: true
---

In my past i code in php laravel, i remember i need to revisit where this variable flows and console logging too many for each step to ensure nothing i missed.

when i moved stack to typescript + I started to implement the type. especially when it comes to arrays and objects.

I continued my peer's code which any variable was flooding and using babel as js compiler. then we as a team refactored it to typescript and using native tsc compiler. The result the code is more deterministic, easier to maintain and expand the feature, and also of course the build time trimmed from 100s to 80s cutting 20% of it.

since now when i code i dont spend too much on checking variables too deep because by defining type, i can catch in compiler will give me error, even my IDE extension already flag my code line if this is error.

That was the biggest impact that affect my way to code and develop. beside that there's still several impacts that makes development easier

I dont need to strictly give type check, I just need to check if value specific or if the result went falsy

These patterns are useless if you only use them to fix TypeScript errors.
The right way is to write types first before you write the code. Think about the data shape first, then think how to process it. That is the real benefit of TypeScript.

---

POLISHED

---

title: "TypeScript Habits That Actually Saved Me"
description: "A few practical patterns I keep reaching for — not from a style guide, but from bugs I've already shipped."
pubDate: 2026-05-11
tags: ["typescript", "dev"]
draft: true
-----------

Before I worked primarily with TypeScript, most of my backend work was in PHP and Laravel. I remember spending a lot of time tracing where a variable came from, where it changed, and what shape it had at each point in the flow. When something behaved unexpectedly, I often ended up adding logs at several steps just to make sure I had not missed anything.

That worked, but it also meant a lot of development time was spent verifying assumptions that the language itself could not verify for me.

When I moved more of my work to TypeScript, one of the first habits I picked up was defining types properly, especially for arrays and objects. That gradually changed how I approached code. Instead of asking what a variable might contain after the code had already been written, I started defining what the data was supposed to look like before deciding how to process it.

## From JavaScript to TypeScript

At one point, I continued working on a codebase where variables were passed around quite freely and Babel was being used as the JavaScript compiler. As a team, we eventually refactored the codebase to TypeScript and moved the build process to the native TypeScript compiler.

The difference was noticeable beyond just having type annotations. The code became more deterministic because the expected shape of data was visible and enforceable. It became easier to maintain existing features, easier to expand them, and easier to understand what another part of the system expected without tracing the entire flow manually.

The build process also became faster. What previously took around 100 seconds dropped to roughly 80 seconds after the migration, cutting about 20% from the build time.

That performance improvement was useful, but the larger benefit for me was how much less mental effort I had to spend checking variables manually.

## Let the Compiler Check the Boring Parts

These days, I rarely need to trace a variable several layers deep just to confirm whether a field exists or whether a function returns the shape I expect. If the types are defined properly, the compiler already catches a large part of that for me. In many cases, my IDE flags the problem before I even run the code.

That does not mean TypeScript prevents every bug. Runtime data can still be wrong, external APIs can still return unexpected values, and business logic can still be incorrect. But it removes an entire category of mistakes that I used to spend time finding manually.

This also changed the way I write conditions. I do not need to fill the code with defensive type checks when the type system has already established what a value can be. Most of the time, I only need to check whether a value matches a specific case or whether the result is falsy.

The type system handles the rest.

## Types Should Describe the Data Before the Code

For me, this is where TypeScript becomes genuinely useful.

These patterns are almost pointless if types are only added afterward to make compiler errors disappear. At that point, TypeScript becomes another obstacle to satisfy rather than something that helps with the design of the code.

I prefer to think about the data shape first.

What does this function receive? What should it return? Which fields are required? Which values are optional? Can this object exist in several valid states? If it can, should those states be represented explicitly?

Once those questions are answered, the implementation usually becomes much easier to reason about.

Instead of writing the code first and discovering the structure while debugging it, I define the structure and then write the code that operates on it.

That is probably the biggest habit TypeScript changed for me. I use types less as documentation attached to code and more as boundaries around the data flowing through the system.

The compiler catching mistakes is useful.

Having fewer mistakes to investigate in the first place is much better.
