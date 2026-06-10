---
title: "TypeORM Hid a Join-All-Invoices Query Behind a One-Liner"
description: "A TypeORM relation filter that looked like a simple lookup was loading all invoices into memory and filtering client-side. A story about hidden query cost."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

5. "TypeORM Hid a Join-All-Invoices Query Behind a One-Liner"

Summary: SubmittedToBillingProviderService.findByInvoiceId used TypeORM's relation-based filtering: findOne({ where: { invoices: { id: 
invoiceId } } }). This looks innocent — find a billing provider submission by invoice ID. But TypeORM's generated SQL for M:N relation
filtering loads all related invoices into memory, then filters client-side. On a practice with 324+ invoices, this means loading every
invoice row just to check one ID. Ahmad replaced it with an explicit createQueryBuilder that joins directly on the junction table
submitted_to_billing_providers_have_invoices, selecting only five columns. The commit message says "optimize invoice retrieval query" but
the real story is a single-line ORM call silently becoming a full-table scan under load.

Original situation: A seemingly simple findOne with a relation filter working correctly in development.
What triggered it: Performance concerns as invoice counts grew; the function was called on every invoice load in the submitted-billing flow.
Investigation: Looked at the generated SQL in the TypeORM query log. Saw a query that selected * from invoice joined back to the submission.
Obstacles: The ORM made it look like a simple point-lookup. The actual behavior required reading the TypeORM source to understand.
Solution: Explicit QueryBuilder with a direct junction table join, only selecting the five needed columns.
Alternatives: Adding select to the findOne options — partial mitigation, but the join strategy would still be wrong.
Lessons: ORMs hide query shapes. Any query against a M:N relation deserves manual SQL inspection before it reaches production scale.

Educational value: 8/10 | Authenticity as diary: 9/10
Audience: Backend engineers using TypeORM or any ORM on M:N relationships | Reading time: 6 min
Recommended structure: What TypeORM's relation filter does under the hood → comparing generated SQL → the rewrite → a general rule for M:N
query review