---
title: "I Built a Swiss Billing Service and Then Discovered the Client Needed German Billing"
description: "Built initial billing XML generation around Swiss formats, then discovered mid-development that the client needed German PADneXt billing instead."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

10. "I Built a Swiss Billing Service and Then Discovered the Client Needed German Billing"

Summary: The billing-xml-service repository's very first commit (August 28) included Swiss medical billing examples: TARMED PDFs, tier garant, tier payant, QR-ESR invoice formats. Ahmad built the initial Medidata XML generation around these. Then, over 5 schema restructuring commits in 14 days (Sep 10–25), the schema changed to include German/Austrian-specific fields: lawtype, iknr, lanr, GOÄ codes, ISO-8859-15 encoding, PADneXt/ILQ format. The progression is visible in commit titles: "add physician elements" → "add lawtype and payment structures" → "add insurance provider elements" → "align with PADneXt specifications." Each restructure was a discovery that the billing clearinghouse specification had another layer of requirements. This is a diary about building a domain service when you don't fully understand the domain at the start.

Original situation: A TypeScript microservice to generate XML for medical billing clearinghouses, with Swiss formatting examples as the initial reference.
What triggered it: A client requirement for German billing transmission (ILQ/PADneXt format) on top of the existing Swiss medidata work.
Investigation: Reading the PADneXt specification document. Finding that the German format is fundamentally different from the Swiss one in structure, encoding, and encryption requirements.
Obstacles: The PADneXt spec is dense, written in German, and uses domain-specific terminology (Rechnungsersteller, Leistungserbringer,
Abrechnungsfall) without clear analogues in general software concepts.
Solution: Build incrementally: start with unencrypted XML generation, add encryption later, add cloud certificate retrieval last.
Alternatives: Start from a known-good example XML and reverse-engineer the schema — actually what was done for the test fixtures.
Lessons: When building a domain service for a complex spec, getting one complete working example (even hardcoded) before generalizing is more valuable than building the abstraction first.

Educational value: 8/10 | Authenticity as diary: 9/10
Audience: Engineers building integrations with poorly documented legacy formats | Reading time: 7 min
Recommended structure: The first commit's assumptions → the schema changes and what triggered each → the moment the spec became clear → lessons for approaching dense specifications