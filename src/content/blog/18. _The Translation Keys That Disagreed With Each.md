---
title: "The Translation Keys That Disagreed With Each Other Across Three Components"
description: "Different components independently created translation keys for the same concepts. Untangling overlapping namespaces and missing translations across three components."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

18. "The Translation Keys That Disagreed With Each Other Across Three Components"

Summary: In January 2025, Ahmad spent four days (Jan 16–21) working on a translation refactor in clinic-os-admin. The commits reveal a specific kind of problem: different parts of the codebase had independently created translation keys for the same concepts. doctorId and physicianId were used in different components for the same field. The "features" namespace and the "pages" namespace both contained overlapping keys. Translations were added in one language but not the other. The fix commits show the incremental cleanup: rename doctorId to physicianId across components, align the "features" → "pages" namespace rename, add missing German translations, add missing English translations. The diary entry is about the specific entropy of i18n systems in fast-moving codebases.

Original situation: Translation keys were inconsistent across components — the same concept had different key paths in different files.
What triggered it: A UI review that showed inconsistent terminology ("Doctor" in some places, "Physician" in others) and missing translations in German.
Investigation: Grepping for all uses of t("doctorId") and t("physicianId"). Finding that they referred to the same concept.
Obstacles: The namespace rename (features → pages) was a breaking change that required updating every component that used the old namespace.
Solution: Systematic key rename, namespace consolidation, and adding missing translations for both languages in the same pass.
Alternatives: Add both key paths and alias one to the other — rejected as it perpetuates the inconsistency.
Lessons: i18n key inconsistency compounds faster than code inconsistency because it's rarely caught in code review. A project-level naming convention for translation keys is not optional — it's load-bearing.

Educational value: 7/10 | Authenticity as diary: 8/10
Audience: Frontend engineers managing i18n in fast-moving codebases | Reading time: 5 min
Recommended structure: How translation keys diverge → the namespace collision → the doctorId / physicianId case → a convention proposal that would prevent this