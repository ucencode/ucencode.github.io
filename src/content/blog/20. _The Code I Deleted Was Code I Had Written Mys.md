---
title: "The Code I Deleted Was Code I Had Written Myself Two Months Earlier"
description: "A commit message that just says 'remove written code which not working' — the most honest entry in the git log, and what it reveals about the debugging cycle."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

20. "The Code I Deleted Was Code I Had Written Myself Two Months Earlier"

Summary: The fix: remove written code which not working commit on January 2 tells the story. It appeared one day after Add logging when  changing the notification value of an order. Ahmad had added code to change the notification behavior of an order, spent time debugging it, and then deleted it. The commit message is a rare moment of complete honesty in a git log — no euphemism, no "refactor," no "streamline." Just: "remove written code which not working." This story pairs with the implicit cycle across several of Ahmad's features: build it, add logging to understand it, find it doesn't work as expected, remove or fix it. The most authentic developer diary entry is often the one-liner that admits defeat before trying again.

Original situation: Code was added to handle notification value changes for orders. It didn't work as expected.
What triggered it: The logging commit revealed that the notification value change logic was producing incorrect behavior.
Investigation: The logs showed the values changing but the notifications not updating. The logic was correct in isolation but wrong in context.
Obstacles: The notification system had implicit state dependencies that weren't visible from the code that was written.
Solution: Remove the non-working code. The logging commit was used to understand the problem before a proper fix.
Alternatives: Keep the broken code but disable it with a flag — rejected because it's cleaner to remove it and rewrite from a correct understanding.
Lessons: "Remove written code which not working" is sometimes the most important commit in a sprint. Shipping a fix you don't understand is worse than shipping nothing.

Educational value: 6/10 | Authenticity as diary: 10/10
Audience: Every developer | Reading time: 4 min
Recommended structure: The courage in a one-liner commit message → what the logging revealed → why deleting is underrated → the difference between "doesn't work yet" and "doesn't work"