---
title: "When Encoding isn't Compatible"
description: "A service requires ISO-8859-15 encoding. Writing UTF-8 and declaring ISO-8859-15 in the XML header passes some validators but corrupts umlauts at the clearinghouse."
pubDate: 2026-05-18
tags: ["backend", "encoding", "xml", "typescript"]
draft: false
---

I started working on an application that had to support multiple natural languages, mainly English and German. At the UI level, this was fairly straightforward. Most of the visible text could be mapped into JSON translation files, with one set of strings for English and another for German, and the application would load the appropriate translations depending on the selected language. As long as the text stayed inside the application and was rendered by the browser, there was not much else I had to think about.

The more interesting problems started when that text had to leave the application and become integration data. Some parts of the system communicated with external services through REST APIs, where the request bodies were usually JSON. Other integrations were different because they required documents to be sent as XML. That was where something that had seemed like ordinary application text suddenly became part of a strict external data format.

## When Text Became Integration Data

An XML document usually begins with a declaration that describes, among other things, the character encoding being used by the file. In one of the medical billing integrations I worked with, the external standard required ISO-8859-15, so the generated document started with something like this:

```xml
<?xml version="1.0" encoding="iso-8859-15"?>
```

At first, that seemed simple enough. The specification said ISO-8859-15, so I declared ISO-8859-15. What I overlooked was that declaring an encoding and actually writing the file using that encoding are two completely different things.

Somewhere earlier in the processing flow, the strings had already been handled as UTF-8. That included normal German characters such as `ä`, `ö`, `ü`, and `ß`. When I eventually generated the XML, those characters were still represented as UTF-8 data, but the XML declaration claimed that the document was ISO-8859-15.

The mistake became even worse when I wrote the generated XML using UTF-8:

```ts
writeFileSync(path, xmlString, "utf8");
```

So I had effectively created a document that told the reader, "I am ISO-8859-15," while the bytes underneath it said something else entirely.

## The Encoding Lie

The problem becomes easier to understand when looking at the bytes instead of the characters themselves. The same visible character can have a different byte representation depending on the encoding being used. For example, `ü` can be represented by a single byte in ISO-8859-15, while its UTF-8 representation takes two bytes.

```text
ISO-8859-15: FC
UTF-8:       C3 BC
```

To a human looking at the rendered text, both represent `ü`. To a strict external system reading the bytes according to the declared encoding, they are not interchangeable.

That was what made this bug particularly annoying. When I opened the generated XML in a normal editor during development, everything looked correct. The German names were readable, the umlauts were visible, and the XML declaration looked right. Most of the tools involved were perfectly happy to interpret the document in a way that allowed the text to render correctly, even though the underlying bytes did not match the declared encoding.

The external billing system was less forgiving. Its validation process checked the actual encoding of the file instead of simply trusting what the declaration said. The mismatch eventually became visible when the document was processed through the integration flow, and the file was rejected.

That was the point where I realized that the XML declaration was not an encoding conversion. It was only a statement about what encoding the document was supposed to contain.

## Fixing the Actual Data Flow

The first part of the fix was making sure the generated file was written using an encoding compatible with what we were producing. Instead of writing the XML as UTF-8, I changed the file output to use Node.js's `latin1` encoding:

```ts
writeFileSync(path, xmlString, "latin1");
```

Node.js does not provide ISO-8859-15 as a direct output encoding name, and `latin1` is not technically identical to ISO-8859-15. In our particular case, however, we were already dealing with a relatively small character set, so I could avoid relying on characters that required the differences between those two encodings.

That led to the more important part of the fix. Rather than waiting until XML serialization to deal with problematic characters, I sanitized the request payload before any XML was generated. German characters were converted into ASCII-compatible representations:

```text
ä → ae
ö → oe
ü → ue
Ä → Ae
Ö → Oe
Ü → Ue
ß → ss
```

So a value such as:

```text
Müller
```

became:

```text
Mueller
```

This is not the sort of transformation I would normally want to apply to user-facing text, especially for names, but it was acceptable for this billing integration. More importantly, it meant that the XML generation layer did not have to reason about a growing set of special characters. By the time the data reached that layer, it had already been normalized into a form that was safe for the format we were generating.

## Sanitizing Before XML Generation

I deliberately put the sanitization before XML generation rather than generating the entire document and modifying the finished XML afterward. The utility walked recursively through the request payload and sanitized string values before any of the XML builder methods saw them.

That approach kept the responsibility in one place. The XML builders did not need to know anything about German umlauts, Eszett, or character-set compatibility. They could simply operate on already-sanitized data and focus on constructing the document itself.

I also added a small fast path to avoid unnecessary work for the common case. Most strings did not contain any of the characters we were looking for, so there was no reason to run a sequence of replacements against every string. A quick check using this regular expression was enough to determine whether the string needed further processing:

```ts
/[äöüÄÖÜß]/
```

Only strings containing one of those characters needed the replacement logic. It was a small optimization, but it also made the intention of the utility clearer because the special-case handling was isolated to the data that actually needed it.

## Why I Didn't Convert Everything Properly

There was another solution that would have been technically more complete. I could have taken the generated string and explicitly converted it into ISO-8859-15 bytes using a library such as `iconv-lite`. That would have allowed us to preserve characters like `ü` instead of changing `Müller` into `Mueller`.

I decided not to take that route because it added another dependency and another encoding layer to a problem that did not require one in our particular domain. The billing data we handled mostly consisted of ASCII text plus a small, known set of German characters, and the digraph substitutions were acceptable under the conventions of the integration.

There is still an important trade-off in that choice. Converting `ü` into `ue` does change the original spelling, and a developer unfamiliar with the domain could reasonably wonder why we were modifying someone's name. In this case, that behavior was intentional rather than an accidental corruption. The external billing process accepted that normalized representation, which made the simpler solution preferable to introducing a full character-set conversion pipeline.

## The Problem With "It Looks Fine"

What stayed with me from this bug was how little the generated file itself seemed to tell me. The XML was readable, the German text appeared correctly, and the declaration at the top of the document looked exactly like the specification required. If I judged the file only by what I saw in an editor, there was almost no indication that anything was wrong.

That is one of the dangerous things about encoding bugs. Editors, browsers, and other development tools often do a good job of making broken or mismatched data look normal. They are designed to give you usable text, not necessarily to prove that the bytes underneath it match a strict external specification.

Since then, I have treated encoding as part of the actual data format rather than as a string written into an XML header. When an external system requires a specific encoding, I want to know what bytes we are producing, where the transformation happens, and whether the data has already been normalized before it reaches the serialization layer.

> The important distinction is simple: declaring an encoding does not make the bytes use that encoding. The document can say `iso-8859-15` all it wants, but if the file underneath is still UTF-8, eventually something that actually checks the bytes is going to notice.
