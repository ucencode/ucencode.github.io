---
title: "The Finance Dashboard Showed Different Numbers Depending on Which Field You Sorted By"
description: "Two date fields — service_datetime and created_at — were used interchangeably across dashboard components, silently producing different totals."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

12. "The Finance Dashboard Showed Different Numbers Depending on Which Field You Sorted By"

Summary: In August, Ahmad spent a full day (4 commits, all on August 1) standardizing date field handling across the finance components in clinic-os-admin. The issue: service_datetime (when the service was performed) and created_at (when the invoice was created) were being used interchangeably in different parts of the finance dashboard. Invoices without a service_datetime would disappear from date-filtered views. The API parameters were updated from service_datetime to created_at for the main finance page filter. The ServiceOccasionTable component also had its own date filtering logic that disagreed with the dashboard's. After the fix, the "unfulfilled draft invoices" count changed — because now it was counting invoices created in the period, not services performed in the period. These two numbers are different for any clinic that bills services weeks after performing them.

Original situation: Finance totals looked different depending on which view you used.
What triggered it: A product manager noticed the invoice count on the dashboard didn't match the count in the table.
Investigation: Compared the API calls from the dashboard component vs. the table component. Found different query parameters being sent.
Obstacles: Understanding the business intent: is the finance dashboard showing "services performed this month" or "invoices created this month"? These are different for clinics with billing delays.
Solution: Standardize on created_at for the finance filter, which represents the invoice lifecycle. Update API parameters and ServiceOccasionTable to match.
Alternatives: Keep service_datetime but make it non-optional — rejected because some invoices don't have a service date at all.
Lessons: "When was this created?" and "When did this happen?" are different questions. Mixing them in filters produces numbers that are both technically correct and practically wrong.

Educational value: 8/10 | Authenticity as diary: 8/10
Audience: Frontend engineers working on financial reporting, full-stack engineers dealing with temporal data | Reading time: 5 min
Recommended structure: The two date fields and their difference → how they got mixed → the debugging process → the business decision → the changed numbers and what they mean