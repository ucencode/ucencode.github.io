---
title: "Six Weeks of Building and Rebuilding the Medidata XML Schema"
description: "The Medidata XML schema went through six versions in six weeks. Each clearinghouse validation attempt revealed fields no documentation had mentioned yet."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

17. "Six Weeks of Building and Rebuilding the Medidata XML Schema"

Summary: The billing-xml-service Medidata endpoint went through at least six distinct schema versions between August 28 and November 26. Starting from a Swiss billing scaffold, the schema grew progressively: first appVersion and transport refactor (Sep 12), then lawtype and payment structures (Sep 14), then insurance and physician elements (Sep 12 and 15), then balance structure (Sep 16), then email and phone fields (Sep 18), then the final ILQ alignment (Sep 22–25). Each change was a discovery that the clearinghouse expected a field Ahmad hadn't encountered yet. The final schema was substantially different from the first one — not because the first was wrong, but because understanding a complex billing specification is a process, not a document read. The commit sequence is a learning curve made visible in git history.

Original situation: A new XML generation service for Swiss medical billing, extended to German billing mid-development.
What triggered it: Incremental feedback from clearinghouse validation — each submission attempt revealed missing or malformed fields.
Investigation: Comparing generated XML against clearinghouse-provided example files and error responses.
Obstacles: The clearinghouse documentation was in German, domain-specific, and incomplete. Several field requirements were only discoverable by submitting and getting a validation error back.
Solution: Build against example output files, not just the specification document. Version the schema in JSON Schema files that can be validated independently of the service.
Alternatives: Generate the full schema from the specification upfront — theoretically correct but practically infeasible given the documentation quality.
Lessons: For external format integrations with poor documentation, treat every submission to the validator as a test run. Plan for at least 3× as many field additions as you initially estimate.

Educational value: 9/10 | Authenticity as diary: 9/10
Audience: Engineers integrating with external regulatory APIs, anyone working with poorly-documented specifications | Reading time: 7 min
Recommended structure: The first commit's confidence → each schema change and what revealed it → the learning curve in git log → a methodology for building against opaque specifications