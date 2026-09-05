---
title: "When UTF-8 Pretends to Be ISO-8859-15"
description: "PADneXt requires ISO-8859-15 encoding. Writing UTF-8 and declaring ISO-8859-15 in the XML header passes some validators but corrupts umlauts at the clearinghouse."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

I want to tell story this way:

I started to develop application which using multiple natural languages such as English and German

At first in the UI its pretty easy, map the string into a json file that loads many UI text in one language that maps

Then when it comes to external integration. the data sent for the communication via REST API, its raw stored in json and sometimes for a document the API request body schema they asked for an XML File.

In the beginning of the file there's opening tag that declare encoding that will be used in the data.

I messed up by putting german texts into UTF-8 or ISO-8859-15 but process before this already sanitize all character into UTF-8 such as character with umlaut or eszett.

I did additional fix when it was fail in development and staging server.

---

The truth:

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

--- 

POLISHED

---

title: "The Encoding Lie: When UTF-8 Pretends to Be ISO-8859-15"
description: "The XML said ISO-8859-15. The bytes were UTF-8. Everything looked correct until a German billing system actually read it."
pubDate: 2026-05-18
tags: ["backend", "encoding", "xml", "typescript"]
draft: true
-----------

I started working on an application that had to support multiple natural languages, mainly English and German.

At the UI level, this was fairly straightforward. Most of the visible text could be mapped into JSON translation files, with one set of strings for English and another for German. The application loaded the appropriate strings, the UI rendered them, and there was not much else to think about.

The interesting problems started when those languages had to leave the application.

## When Text Became Integration Data

Some parts of the system communicated with external services through REST APIs. For ordinary requests, the data was serialized as JSON, which rarely gave me a reason to think deeply about character encoding.

Other integrations were different. Some request bodies contained documents, and one of the medical billing standards I worked with required those documents to be XML.

An XML file usually begins with a declaration describing, among other things, the character encoding used by the document.

```xml
<?xml version="1.0" encoding="iso-8859-15"?>
```

At first, that looked simple enough. The external specification required ISO-8859-15, so I declared ISO-8859-15.

The problem was that declaring an encoding and actually encoding the file are two different things.

## The XML Was Telling a Lie

Somewhere earlier in our processing flow, the strings had already been handled as UTF-8. That included perfectly normal German characters such as umlauts and Eszett: `ä`, `ö`, `ü`, and `ß`.

Then I generated XML declaring that the document used ISO-8859-15.

And at one point, I wrote that XML using UTF-8.

```ts
writeFileSync(path, xmlString, "utf8");
```

So I had created a file that effectively said:

> I am ISO-8859-15.

while its actual bytes said:

> No, you're not.

This matters because the same visible character can have a completely different byte representation depending on the encoding.

Take `ü`, for example.

In ISO-8859-15, it can be represented as a single byte:

```text
FC
```

In UTF-8, the same character is represented by two bytes:

```text
C3 BC
```

Visually, both represent `ü`. At the byte level, they are completely different.

That distinction was easy to miss because when I opened the generated XML in normal development tools, it looked fine. The German text was there. The umlauts were there. Nothing was obviously corrupted.

The XML declaration also looked correct.

It was only when the file went through stricter validation in our development and staging integration flow that the problem became visible. The external system did not care that my editor could display the file correctly. It cared whether the bytes actually followed the encoding the document claimed to use.

They did not.

## Fixing More Than the XML Declaration

Changing the declaration alone obviously would not solve anything. I needed to control what actually reached the XML builder and how the resulting file was written.

One part of the fix was changing how the generated XML was written:

```ts
writeFileSync(path, xmlString, "latin1");
```

Node.js provides `latin1` rather than ISO-8859-15 directly. It is not the same character set as ISO-8859-15, but it was sufficient for the subset of characters we needed after sanitization.

The more important change happened earlier in the flow.

Instead of waiting until XML serialization to deal with problematic characters, I sanitized the request data before XML generation. German characters were converted into ASCII-compatible forms:

```text
ä → ae
ö → oe
ü → ue
Ä → Ae
Ö → Oe
Ü → Ue
ß → ss
```

For example, a value such as:

```text
Müller
```

became:

```text
Mueller
```

This might look strange if you approach the problem purely as text transformation. In the context of German billing data, however, these substitutions were acceptable and allowed us to avoid carrying incompatible characters further into the serialization process.

## Sanitize Before Serialization

One decision that turned out to be particularly useful was *where* the sanitization happened.

I could have generated the complete XML first and then run another transformation over the resulting document. Instead, I sanitized the data before it reached any of the XML builder methods.

The sanitization utility recursively walked through the request payload and transformed strings wherever necessary. Once the payload passed through that boundary, everything downstream could assume it was already safe to serialize.

There was also a cheap fast path before performing replacements:

```ts
/[äöüÄÖÜß]/
```

Most strings did not contain any of these characters, so there was no reason to run every replacement against every string. If the regex found nothing, the original value could simply pass through.

It was a small optimization, but more importantly, it kept the responsibility in one place. The XML builders did not need to know how German characters should be normalized. They just received data that was already safe for the format they were producing.

## Why Not Properly Convert to ISO-8859-15?

There was another, more technically complete solution: explicitly convert the generated XML into ISO-8859-15 bytes using something like an encoding conversion library.

That would have allowed us to preserve characters such as `ü` instead of turning `Müller` into `Mueller`.

For our case, that came with another dependency and complexity we did not actually need. The billing data we handled did not require the broader character set once the known German characters had been normalized, and the ASCII substitutions were acceptable for the integration.

So the final solution was deliberately narrower: sanitize the relevant characters early, generate the XML from that sanitized data, and write it using the closest encoding Node.js supported natively.

It solved the integration problem without introducing another encoding layer into the application.

## The File Looking Correct Means Almost Nothing

The part I remember most from this bug is how normal everything looked.

The XML was valid enough to inspect. The German text looked fine in an editor. The declaration said ISO-8859-15. If I judged the file by what was rendered on my screen, there was not much reason to suspect an encoding problem.

But an encoding declaration is only metadata. Writing `encoding="iso-8859-15"` at the top of a document does not magically convert the bytes underneath it.

That sounds obvious when written down. It was much less obvious while debugging an XML document that looked completely normal.

Since then, I have treated encoding as part of the actual data format rather than a configuration string attached to it. If an external protocol requires a specific encoding, I want to know what bytes we are producing, where the conversion happens, and whether data has already been transformed before it reaches serialization.

Because sometimes the XML is perfectly happy to tell you it is ISO-8859-15.

The bytes are under no obligation to agree.
