---
title: "A While Loop With No Exit Condition That Almost Got To Production"
description: "An unguarded while loop iterating over date ranges had lived in production for months. One invalid date from a new code path would have hung the server."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

4. "A While Loop With No Exit Condition That Almost Got To Production"

Summary: Buried in ExternService.generateTimeFrames and InvoiceService.generateTimeFrames was a while (currentDate <= endDate) loop — no iteration limit, no date validation. If a caller passed an invalid date (e.g., NaN from a malformed timestamp), currentDate would be NaN, the loop condition would never become false, and the server process would hang. Ahmad discovered this while adding the "include extern" feature for the finance dashboard, where the time frame calculation was called with user-supplied date ranges. The fix was a five-line guard: validate the dates, add MAX_ITERATIONS = 1000, throw an error if exceeded. The scariest part: the method had existed for months. No test had ever passed an invalid date. The loop had simply never been called with bad input — until new features started routing more code paths through it.

Original situation: Two unguarded while loops in production services, each iterating over date ranges.
What triggered it: The "include extern totals" feature required calling time frame generation from a new code path that received
user-supplied filter dates.
Investigation: Traced the call graph from the new finance stats endpoint to the generateTimeFrames function. Realized there was no input
validation.
Obstacles: The fix itself was trivial; the scary part was realizing the code had been in production without a limit for months.
Solution: Input validation (isNaN check, startDate > endDate early return) + MAX_ITERATIONS guard + explicit error message.
Alternatives: Remove the function and replace with a library-based solution — rejected as over-engineering for the current need.
Lessons: "It works in all existing tests" is not the same as "it is safe for all inputs." Every loop that advances a mutable variable needs a maximum iteration guard.

Educational value: 8/10 | Authenticity as diary: 9/10
Audience: Backend engineers, anyone working with date-range computation | Reading time: 5 min
Recommended structure: What the code looked like → how the new feature exposed it → the fix → the audit (what other loops might have the same problem?)
