---
title: "When XML Says ISO-8859-15 but the File Is UTF-8"
description: "An XML file looked right in my editor, but its bytes didn't match the encoding required by the billing service."
pubDate: 2026-06-10
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

The JavaScript string still contained German characters such as `ä`, `ö`, `ü`, and `ß`. The mismatch happened when I wrote that string to disk as UTF-8:

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

The billing system rejected the file. I could confirm the mismatch by looking at the bytes, even though the rejection by itself gave me no way to tell how the service detected the problem.

That was the point where I realized that the XML declaration was not an encoding conversion. It was only a statement about what encoding the document was supposed to contain.

## Fixing the Actual Data Flow

I switched the file output to Node.js's `latin1` and transliterated a known set of German characters before building the XML. This was a workaround for the character set we expected in this integration. The replacements were:

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

The billing integration accepted `Mueller`, although that changes the spelling of the name. These substitutions handle only the characters in the table.

## Sanitizing Before XML Generation

I deliberately put the sanitization before XML generation rather than generating the entire document and modifying the finished XML afterward. The utility walked recursively through the request payload and sanitized string values before any of the XML builder methods saw them.

I also added a small fast path to avoid unnecessary work for the common case. Most strings did not contain any of the characters we were looking for, so there was no reason to run a sequence of replacements against every string. A quick check using this regular expression was enough to determine whether the string needed further processing:

```ts
/[äöüÄÖÜß]/
```

This regex detects those substitutions. It leaves `€` untouched, for example. Node.js writes `€` as `AC` with `latin1`, while ISO-8859-15 represents it as `A4`. See the [Node.js Buffer documentation](https://nodejs.org/api/buffer.html#buffers-and-character-encodings) and the [ISO-8859-15 character table](https://www.unicode.org/L2/L1998/98181.pdf).

## When to Use an ISO-8859-15 Encoder

If an integration accepts ASCII-only output, check the entire serialized document for non-ASCII characters before writing it. ASCII bytes are identical in UTF-8 and ISO-8859-15. This example shows how to fail early if the document falls outside that subset:

```ts
if (/[^\x00-\x7F]/.test(xmlString)) {
  throw new Error("The XML contains characters outside the ASCII subset");
}

writeFileSync(path, xmlString, "utf8");
```

To preserve representable characters such as `ü` and `€`, encode the serialized XML with an ISO-8859-15 encoder such as `iconv-lite` and write the resulting bytes. Decide how to handle characters outside ISO-8859-15 before encoding, and test the bytes the receiver will actually read.
