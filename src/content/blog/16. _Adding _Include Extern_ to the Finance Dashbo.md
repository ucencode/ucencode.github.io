---
title: "Adding 'Include Extern' to the Finance Dashboard Took Four Service Changes"
description: "Adding one checkbox to the finance dashboard required changes across four services and exposed two unrelated bugs in the same code path."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

16. "Adding 'Include Extern' to the Finance Dashboard Took Four Service Changes"

Summary: On November 24, Ahmad implemented an "include extern" toggle on the finance dashboard — a checkbox that adds external billing amounts to the invoice totals. Sounds like a frontend feature. It required: (1) adding getAmount() to ExternService, (2) wiring it into InvoiceService.getAmount behind a flag, (3) adding all_draft_invoices → API parameter passthrough for the dashboard, (4) updating the frontend hook and toggle state. Then discovering the generateTimeFrames loop had no limit (see Story #4). Then discovering the Redis connection options in BuchhaltungsButlerQueueService were being initialized redundantly. The commit history shows six commits across two services and one frontend component — all for a checkbox. The diary entry is about how the simplest-looking UI features often have the deepest service chains.

Original situation: The finance dashboard showed invoice totals without external billing amounts.
What triggered it: Clinic managers needed to see both invoice and extern totals on the same view for cash flow reporting.
Investigation: Traced the data path from the dashboard total → invoice service → extern service → time frame calculation.
Obstacles: The ExternService had no getAmount method. Adding it revealed the infinite loop. Adding the flag to InvoiceService required updating the request interface.
Solution: Implement getAmount in ExternService with proper date validation, expose it through InvoiceService behind a flag, propagate the
flag through the API to the frontend toggle.
Alternatives: Aggregate in the frontend from two separate API calls — rejected because it would double the network requests and make the total non-atomic.
Lessons: "Add a toggle" stories should start by reading the service layer, not the UI. The UI is always the last 10% of the work.

Educational value: 8/10 | Authenticity as diary: 9/10
Audience: Full-stack engineers, product engineers estimating feature complexity | Reading time: 6 min
Recommended structure: The innocent toggle → tracing the service chain → each unexpected discovery → the final count of files changed → a framework for estimating "simple UI features"