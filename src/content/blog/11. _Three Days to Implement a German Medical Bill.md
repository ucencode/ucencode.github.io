---
title: "Three Days to Implement a German Medical Billing Format From a Dense Specification"
description: "Implementing the complete ILQ/PADneXt billing interface in three days: GCS certificate download, PKCS#7 encryption, ZIP-within-ZIP, and SHA-1 checksums."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

11. "Three Days to Implement a German Medical Billing Format From a Dense Specification"

Summary: September 22–25: Ahmad implemented the complete ILQ/PADneXt billing interface in three days. Starting from the GCS integration (certificate download), to the PKCS#7 encryption, to the ZIP-within-ZIP file structure, to the SHA-1 checksum in the Auftrag XML — each piece was a separate discovery. The commit log shows the order in which the pieces fell: first unencrypted XML generation (aee3935), then cloud + encryption integration (e351c61), then alignment with the full PADneXt spec (23a7eb6), then the Auftrag structure changes (5d2dd95), then a test suite that covered the actual test scenarios from the spec (9e8ae97). A fix: fix build error commit on Sep 25 appears mid-sprint, as it always does when you're moving fast. The diary entry is about the speed and the cost of that speed.

Original situation: An existing medidata service that needed a new endpoint for a completely different billing standard.
What triggered it: A clinic integration with an ILQ-compatible clearinghouse.
Investigation: Reading the PADneXt v2.12 specification, comparing it against example XML files from the clearinghouse.
Obstacles: The ZIP structure: the final deliverable is a ZIP containing an Auftrag XML + a nested ZIP of the Nutzdaten (with a .p7m encrypted variant). Getting the nesting right without example output to compare against took multiple iterations.
Solution: Implement test scenarios from the spec first (test01a, test02a…), then validate generated XML against expected output.
Alternatives: Use a library for PKCS#7 — but no mature TypeScript CMS library existed. node-forge was the least-bad option.
Lessons: 3-day sprints on complex specs always accumulate a debt of "I'll clean that up later." Schedule the cleanup explicitly.

Educational value: 8/10 | Authenticity as diary: 8/10
Audience: Engineers implementing regulatory/billing integrations, fast-shipping engineers | Reading time: 6 min
Recommended structure: The sprint start → the discoveries in order → the build error and what it meant → what the test suite revealed → what should have taken longer