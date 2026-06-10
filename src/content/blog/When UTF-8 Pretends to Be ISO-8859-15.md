---
title: "When UTF-8 Pretends to Be ISO-8859-15"
description: "PADneXt requires ISO-8859-15 encoding. Writing UTF-8 and declaring ISO-8859-15 in the XML header passes some validators but corrupts umlauts at the clearinghouse."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

Story 1 — The Encoding Lie: When UTF-8 Pretends to Be ISO-8859-15

1. Business / Technical Problem

The German medical billing standard PADneXt requires XML files encoded in ISO-8859-15 (Latin-9). The XML declaration line explicitly states
encoding="iso-8859-15". German umlauts (ä, ö, ü, ß) are legal and common in patient names and clinic addresses. The billing clearinghouse
validates both the declared encoding and the actual bytes.

2. Why the Existing Implementation Was Insufficient

writeFileSync(path, xmlString, "utf8") writes UTF-8 bytes, but the XML prolog says iso-8859-15. A umlaut like ü is one byte in ISO-8859-15
(0xFC) but two bytes in UTF-8 (0xC3 0xBC). The file looks correct in any text editor because editors detect the encoding from the BOM or
prolog — but the clearinghouse's strict validator rejects the file. This class of bug is almost invisible in development because every tool
you use to inspect the file will show ü correctly.

3. Solution

Two-part fix: (a) writeFileSync(path, xmlString, "latin1") — Node.js's alias for ISO-8859-1, close enough for the character set in use; (b)
pre-transmission sanitization that maps all four umlaut pairs and Eszett to their ASCII digraphs (ä→ae, ö→oe, ü→ue, ß→ss). The sanitizeDeep
utility does this recursively over the entire request payload before any XML is built.

4. Interesting Engineering Decisions

- The sanitization runs before XML generation, not after — so every builder method downstream works with clean ASCII. This avoids a second
pass.
- A fast-path regex check (/[äöüÄÖÜß]/) short-circuits the string replacement for the common case (no special chars), keeping throughput
high.
- The XML builder is told encoding: "iso-8859-15" in the declaration but the actual write uses "latin1" — a deliberate mismatch that
satisfies both the standard (declaration) and Node.js's API (nearest compatible charset).

5. Trade-offs / Alternatives

- Alternative: convert the entire string to a Buffer in ISO-8859-15 using iconv-lite. Rejected because it adds a dependency and the
character set in medical billing rarely includes characters outside ASCII + umlauts.
- The digraph substitution (ü→ue) changes semantics for names (e.g., Müller → Mueller), which is acceptable by German billing conventions
but surprising to developers unfamiliar with the domain.

6. Lessons Learned

- Encoding declarations in XML are not validated by most parsers during development; the mismatch only surfaces at the validator in
production.
- "It works in my browser/editor" is a dangerous signal for binary encoding bugs.
- Pre-process data at the earliest possible point, not at the last serialization step.

Uniqueness: 8/10 | Usefulness: 9/10

Target Audience: Backend engineers working with legacy standards or non-UTF-8 protocols

Difficulty: Intermediate

Recommended Article Structure:
1. What is PADneXt and why it uses ISO-8859-15
2. The silent encoding mismatch and why no test catches it locally
3. Debugging: comparing hex dumps of expected vs actual file
4. The two-part fix (write encoding + pre-sanitization)
5. Generalizing: a checklist for encoding-declared formats