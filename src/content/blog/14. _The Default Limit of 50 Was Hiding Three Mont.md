---
title: "The Default Limit of 50 Was Hiding Three Months of Users From the Admin Panel"
description: "The admin user list capped at 50 with no pagination indicator. Clinics with more than 50 staff silently had users disappear from the management screen."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

14. "The Default Limit of 50 Was Hiding Three Months of Users From the Admin Panel"

Summary: On November 17, Ahmad changed the default user listing limit from 50 to 500. The original 50 was a standard Medusa pagination default, reasonable for most resources. But the admin user management page never implemented pagination — it displayed a flat list. Clinics with more than 50 staff were silently missing users from the management screen. No error, no pagination indicator, no "load more" button. The list just stopped at 50. The commit message is "increase default user limit to 500 for improved pagination handling" — a slightly euphemistic description of what was essentially a data visibility bug.

Original situation: The admin user list displayed 50 users maximum, regardless of how many existed.
What triggered it: A clinic with a large staff reported that some staff members were not visible in the user management screen.
Investigation: Checked the API response. Found it was returning exactly 50 records with count: 127. The frontend was displaying all returned results without pagination.
Obstacles: The "correct" fix is to implement proper pagination. The practical fix was to raise the limit.
Solution: Change default limit to 500, which comfortably covers any clinic's staff size without requiring pagination UI.
Alternatives: Add infinite scroll — the right solution, but requires frontend work and a deployment window.
Lessons: Default pagination limits on admin resources should be sized for realistic data volumes, not for e-commerce catalog performance. A "missing users" bug is a high-severity UX issue that doesn't present as a crash.

Educational value: 7/10 | Authenticity as diary: 9/10
Audience: Engineers working on admin dashboards, full-stack developers dealing with pagination defaults | Reading time: 4 min
Recommended structure: The standard default → why it's wrong for this context → the user report → the quick fix vs the right fix → a principle for pagination on admin resources