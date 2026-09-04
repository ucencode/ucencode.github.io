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
