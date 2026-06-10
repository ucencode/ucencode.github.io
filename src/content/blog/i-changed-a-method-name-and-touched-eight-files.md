---
title: "I Changed a Method Name and Touched Eight Files"
description: "Renaming acknowledgeCancellation to cancelAppointment required touching eight files — and revealed a test that was passing without testing anything real."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

8. "I Changed a Method Name and Touched Eight Files"

Summary: In November, Ahmad renamed acknowledgeCancellation to cancelAppointment in the appointment service. Sounds trivial. The method had the same semantics but the old name was misleading (acknowledging a cancellation request is different from performing the cancellation). The rename required updating: the service method itself, the API route handler, two email queuing functions, a status check predicate, test fixtures, and a test case that referenced the removed function. The commit history shows the cleanup: first the refactor, then the immediate fix: remove test of removed function from appointment service. The test wasn't failing — it was testing a function that no longer existed, which means the test suite was passing based on stale mock setup that never called the real implementation.

Original situation: A method named acknowledgeCancellation that actually cancelled the appointment — not just acknowledged a request.
What triggered it: Code review flagged the misleading name; adding a new "bulk cancellation" endpoint made the inconsistency more visible.
Investigation: Grepped every caller. Found 6 references across 5 files plus test fixtures.
Obstacles: One test was mocking the method and asserting on the mock, never calling the real implementation. The rename didn't break it — it just continued passing on the mock.
Solution: Rename + update all callers + fix the test to call the real method (or delete it if it was testing nothing real).
Alternatives: Add an alias (acknowledgeCancellation = cancelAppointment) — rejected as it perpetuates the misleading name.
Lessons: Tests that pass after a function is deleted are the most dangerous false positives. They test a mock of something that no longer exists.

Educational value: 7/10 | Authenticity as diary: 9/10
Audience: Engineers who work in large codebases with shared services, anyone doing naming refactors | Reading time: 5 min
Recommended structure: Why naming matters in domain models → the rename cascade → the ghost test → why mock-based tests need more care than you think