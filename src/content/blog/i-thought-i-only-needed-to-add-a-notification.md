---
title: "I Thought I Only Needed to Add a Notification"
description: "I only needed to add a new notification. Following its CTA into the frontend taught me more about the API contract I was designing from the backend."
pubDate: 2026-06-10
tags: ["backend", "frontend", "react", "typescript"]
draft: false
---

I know the basics of frontend development, and I have some familiarity with React. I can read components, follow state through an application, and make small changes when I need to.

That becomes a different story when the frontend is already large and growing quickly.

By that point, there were components built on top of other components, application-wide state, hooks, stores, formatters, drawers, and a lot of behavior that had accumulated over time. I could understand individual pieces of it, but I did not have the same mental map as the frontend engineers who worked in that codebase every day.

That became obvious when I thought I only needed to add a notification.

## The Backend Part Was Already Done

I was working on external order notifications. Most of the feature was on the backend, and once I had finished that part, there was still a small amount of frontend work needed to make the feature usable.

At the time, the frontend engineers were already busy with other things, so I decided to handle the remaining work myself.

The notification itself was straightforward. When an external order arrived, the application would create a notification and show it in the notification panel.

The requirement, however, was not simply to tell the user that something had happened.

The notification needed a CTA. When the user clicked it, the application had to open the draft invoice drawer and pre-populate it with the relevant order.

From the backend side, I imagined this would be simple. I already had the order identifier. I just needed to find whatever function opened the drawer and pass the ID to it.

So I asked one of the frontend engineers how the drawer was normally opened.

That was when I realized I had underestimated the frontend side.

## Opening the Drawer Wasn't Just Passing an ID

The notification formatter and the draft invoice drawer had been designed as separate parts of the application.

The formatter knew how to turn notification data into something the UI could display. The drawer had its own state and its own logic for displaying a draft invoice.

The problem was that the notification now needed to do more than describe something that had happened. It needed to change application state.

I started tracing the notification click handler and following the path into the drawer. Eventually, I found the missing piece. The notification formatting logic did not have access to the state that controlled the draft invoice drawer.

What I had imagined as something like this:

```ts
openDraftInvoiceDrawer(orderId);
```

was not actually available where I needed it.

The drawer state was managed through Zustand, while the notification formatting logic lived outside the normal React component flow where I would usually access the store through a hook.

At that point, I could have simply handed the work to a frontend engineer.

That would have been completely reasonable. I had already finished my part of the feature, and the remaining problem was in an area of the application where someone else had much more context than I did.

But I had already started the feature, and I wanted to see it through.

More importantly, I wanted to understand why something that looked trivial from the backend had turned into something less trivial in the frontend.

## Pair Programming Through the Frontend

I ended up pair programming with one of the frontend engineers.

Instead of handing the feature over completely, we walked through the existing flow together. I could ask how the drawer state was managed, why it was structured that way, and where the existing actions normally came from.

That was useful because I was not just trying to find a function to call. I was learning how the frontend had already decided to manage this kind of state.

Eventually, we used Zustand's `getState()` directly from outside the React component context. That gave the notification logic access to the drawer store and allowed it to trigger the action needed to open the drawer.

Conceptually, it looked something like this:

```ts
const drawerStore = useDraftInvoiceDrawerStore.getState();

drawerStore.open(orderId);
```

The actual implementation involved more application-specific state than this example, but the important part was that the notification could reach the existing drawer state without threading a setter through every place that used the formatter.

There was another approach that was arguably cleaner. We could have passed the drawer action into the notification formatter as a dependency.

That would have made the relationship explicit, but it would also have required changing every call site that used the formatter. For a relatively small feature in an already large frontend, using the store directly was the more practical change.

It did, however, blur a boundary that had previously been quite clear.

A piece of code that was originally concerned with formatting notifications could now cause application state to change.

The notification was no longer just information.

It had become an entry point into another part of the application.

## What I Learned From Finishing It

The useful part of finishing the frontend work was not really the Zustand implementation.

It was seeing what happened to the data I had designed from the backend once it reached the other side.

As a backend engineer, it is easy to look at an API contract mostly in terms of the backend itself. I think about whether the response is consistent, whether the types make sense, whether the identifiers are present, and whether the domain model is represented cleanly.

Those things still matter.

But the frontend does not consume an API contract in isolation. It has to turn that data into an interaction.

In this case, the external order ID was not just another identifier in a response. It was the piece of information that needed to travel from the notification, through the click handling, into application state, and finally into a drawer that could show the user the relevant order.

Following that path gave me a better understanding of what I was actually proposing from the backend.

## An API Contract Has a Consumer

Since then, I have tried to think beyond whether an API contract looks clean from the backend side.

I also think about what the consumer will actually have to do with it.

Does the frontend have enough information to perform the next interaction? Will it need another request just to resolve something that could reasonably have been provided already? Does the response shape fit the way the feature is actually presented, or is it convenient for the backend while making the frontend work around it?

That does not mean the backend should reshape every API around whatever the frontend happens to need at a particular moment. The boundaries still matter, and there are good reasons to keep responsibilities separate.

What changed for me was understanding that those boundaries have to work for both sides.

The notification feature started as a small piece of frontend work after I had already finished the backend. I could have handed it to someone who knew the frontend better than I did.

Instead, I pair programmed through an unfamiliar part of the application and got to see how an identifier from an API eventually became an interaction in the UI.

The feature itself was small.

Understanding the other side of the API was the useful part.
