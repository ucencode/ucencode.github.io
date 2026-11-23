---
title: "I Should Have Asked How Doctors Submit Invoices"
description: "Clearinghouse validation taught me what belonged in the XML. Learning how doctors submit invoices changed how I thought about the workload."
pubDate: 2026-06-10
tags: ["backend", "architecture", "xml", "engineering"]
draft: false
---

When I started working on one of our medical billing integrations, I understood the technical problem much better than I understood the business behind it. I had never experienced the feature from the perspective of its actual users. I was not a doctor submitting invoices through a third party service or insurance company, and I was obviously not a patient receiving a medical bill that might be partially or fully covered by insurance.

I could read the requirements, inspect the existing code, follow the data, read the external specification, and generate the expected XML. What I did not understand yet was how people actually used the billing workflow.

At the time, I treated that unfamiliarity mostly as something I needed to learn while implementing the feature. Looking back, I should have treated it as a project constraint and communicated it much more explicitly. There was a difference between understanding the required data structure and understanding the business process that produced it, and I learned that difference the painful way.

## Learning the Schema One Validation Error at a Time

Part of the work involved generating XML for external medical billing systems. The schema was large, domain-specific, and not particularly easy to understand if you were unfamiliar with medical billing, while the documentation also did not answer everything.

My first implementation was based on the information available to me at the time, but the schema kept evolving as we learned more about what the clearinghouse actually expected. A field for the application version appeared, then transport details changed, followed by additional information about law types and payment structures. Insurance and physician information became more detailed, the balance structure changed, and email and phone fields were added. Eventually, the schema had gone through several significant revisions.

This was not simply a matter of repeatedly implementing the specification incorrectly. Some requirements only became clear after we generated a document, submitted it to the external validator, received an error, compared our output against example files, and discovered another assumption that had not been obvious from the documentation.

The validator effectively became part of the development process because each rejected XML document taught me something about the domain. The commit history ended up reflecting a learning curve that was not really visible when I first started the work.

## I Needed a Representation I Could Actually Understand

As the implementation grew, the code responsible for processing the billing data became increasingly difficult to reason about. I did not want the next engineer to repeat the same process of tracing through implementation details just to understand what a valid billing document was supposed to contain, so I started moving toward a stricter and simpler representation of the data.

Instead of allowing a large amount of flexible processing logic to decide what the XML should eventually look like, I wanted the input to have a clear shape and a much tighter validation boundary. If the service required a value, the schema should say so. If a value could only take certain forms, the schema should enforce that. If the input was invalid, I wanted it rejected before it travelled deeply into the processing flow.

The schema became more than validation. It was also documentation because I could use it to understand the billing structure myself, while the next engineer could inspect it without first understanding every implementation detail. Eventually, the same structured representation could also help us explain the expected data more clearly to users.

That was the direction I wanted: one understandable definition of what entered the service, followed by boring code that transformed it into the external format.

## I Made the Implementation Stupidly Boring

In the middle of that work, I also simplified the processing code itself. There had been more machinery than I thought the problem actually required, so I gradually replaced it with a smaller and more direct implementation while making input validation stricter.

The result took me longer to develop than simply extending what was already there, but I liked where it ended up. The code was lightweight, the processing was fast, the input boundary was strict, and the implementation was stupidly boring to read. I mean that as a compliment.

For something dealing with medical billing data and an external XML specification, I did not want clever processing. I wanted another engineer to open the service, follow the data from input to output, and understand what happened without needing an archaeological expedition through abstractions.

For the workload I knew about, it worked well. The problem was that the workload I knew about was not the workload we actually had.

## Then the Implementation Became Heavier Again

Later, a senior engineer introduced a library into the processing flow. I noticed a delay after the change and wanted to know what it meant for concurrent submissions.

Normally, that would have been the point where I wanted numbers immediately. How much slower was each request? Where was the time being spent? What happened to memory consumption? How did throughput change as concurrency increased?

I hadn't finished adding the instrumentation. I had an observation about the delay, but I couldn't quantify the effect on throughput or attribute the delay to the library alone.

That was another mistake I carried forward from the project. If performance is part of an architectural decision, observability cannot be something I plan to add after the architecture is already being challenged.

But even that was not the biggest surprise.

## Then Invoices Arrived in Batches

The mental model I had been using was relatively simple. An invoice is completed, the system processes it, and the invoice is submitted. Then another invoice comes later.

I hadn't accounted for doctors who reviewed a group of invoices first and submitted them together.

Suddenly, the service was not handling the workload I had designed around. It was handling bursts, and that changed the meaning of the performance problem completely.

Imagine a batch of 100 invoices. A small delay on one invoice might go unnoticed, but if work arrives faster than the service can process it, the doctor can be left waiting for the batch.

The service had been technically correct, the XML could be correct, the validation could be correct, and the implementation could even be clean. We could still have the wrong performance characteristics because I had misunderstood how the feature was used.

## Nobody Had Told Me How Doctors Actually Used It

This was the part that frustrated me the most. I had asked questions while implementing the feature, but most of the requirements I received were focused on what needed to exist. Generate this document, include these fields, send the billing data, and make the integration work.

Nobody had explained the operational behavior clearly enough. Do doctors normally submit invoices individually? Do they accumulate them throughout the day? Do they review everything first and submit a batch afterward? What is a normal batch size? What does an unusually large clinic do? How quickly does the user expect those submissions to complete?

Those questions turned out to matter enormously to the architecture, but I had not asked all of them at the beginning because I did not know enough about the domain to know that I should.

That is the uncomfortable part of unfamiliar domains. Sometimes you do not know which questions are missing.

But I also cannot put all of that responsibility on whoever gave me the requirements. I knew that I was unfamiliar with the business flow, and what I should have said explicitly was that this unfamiliarity was itself a risk.

## I Should've Communicated Better

If I approached the same situation again, I would communicate the uncertainty much earlier. I would not simply say, "I don't understand this yet." I would say something more useful:

> I can implement the technical specification, but I don't yet understand the normal user workflow or expected submission patterns. Until we validate those assumptions with someone who understands the billing process, throughput and concurrency requirements are still unknown.

That changes the conversation because the missing domain knowledge is now visible. Product, engineering, and whoever understands the users can decide whether we need to investigate it immediately or consciously accept the risk.

If I were starting again, I'd ask someone to walk me through a real billing session and note when invoices are reviewed and submitted. I'd use that workflow to plan a load test alongside the XML validation tests.
