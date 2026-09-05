---
title: "The Notification That Needed to Know What Drawer Was Open"
description: "Making a notification actionable required wiring a Zustand store into the notification formatter — two concerns the architecture had assumed were separate."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

I know basic frontend, i also have small familiarity to react

but when the code comes too big and fastly growing. 

When I completed worked in the backend side. I realized all resources in frontend is full loaded. So since its a small feature by adding new type of notification.

I got requirement it has CTA to open the drawer. i asked frontend guy how it got called so i can just call it by passing just the id. Its so complicated I conducted pair programming then, I could hand it over to him tho and its allowed, but since i started this and i need to finish it too, also I have to know how the frontend side handling it so i got new perspective to be more aligning what i propose the API contract with frontend.

\*The story got written by the truth below

---
Truth:

19. "The Notification That Needed to Know What Drawer Was Open"

Summary: In March 2025, Ahmad worked on external order notifications in clinic-os-admin. The new requirement: when a notification for an external order arrived, clicking it should open the draft invoice drawer pre-populated with that order's data. The problem: the notification\ formatting function had no access to the draft invoice drawer's state. The fix required integrating useDraftInvoiceDrawerStore (a Zustand store) into the notification formatting logic. The commits show an iterative approach: first add the notification format, then realize the drawer state needs to be accessible, then merge the store into the formatter, then add relative time display. The diary entry is about the moment you realize "show this notification" and "open this drawer with this data" are not as separate as the architecture assumed.

Original situation: Notifications for external orders appeared in the notification panel, but clicking them didn't navigate to the relevant draft invoice.
What triggered it: User feedback that the notification system was informational but not actionable.
Investigation: Tracing the notification click handler to see where navigation state was managed. Finding the gap between the notification formatter and the drawer state.
Obstacles: The notification formatter was a pure function with no access to React state. Injecting a Zustand store reference into it required restructuring the component that called it.
Solution: Use the Zustand store's getState() method (outside React context) inside the formatter, keeping the formatter functionally pure but allowing it to trigger drawer state changes.
Alternatives: Pass the drawer setter as a parameter to the formatter — clean but would require updating every call site.
Lessons: Notifications that change application state are not "pure" formatters. The architectural boundary between "formatting" and "navigation" is real and enforcing it has a cost.

Educational value: 7/10 | Authenticity as diary: 8/10
Audience: React engineers working on notification systems, state management | Reading time: 5 min
Recommended structure: The notification click gap → why the formatter can't access state → Zustand's getState() escape hatch → the right architecture vs the pragmatic fix

---

POLISHED

---

title: "I Could Have Handed It to the Frontend Engineer. I Didn't."
description: "I only needed to add a new notification. Following its CTA into the frontend taught me more about the API contract I was designing from the backend."
pubDate: 2026-06-01
tags: ["backend", "frontend", "react", "typescript"]
draft: true
-----------

I know basic frontend development, and I have some familiarity with React. I can work with components, follow state through an application, and implement smaller features when necessary.

That confidence changes once the frontend becomes large and starts growing quickly.

In a real application, understanding React itself is only part of the problem. There are components built on top of other components, application-wide state, hooks, stores, formatters, drawers, navigation behavior, and conventions that have accumulated while other engineers were developing the product.

I could read the code, but I did not have the same mental map of it as the frontend engineers who worked with it every day.

That became very obvious when I thought I only needed to add a notification.

## The Backend Part Was Already Done

I was working on external order notifications. Most of my work was on the backend, and once that side was completed, I looked at what was needed to finish the feature in the frontend.

At that time, the frontend engineers were already fully occupied. The remaining work looked small enough that I could handle it myself.

The notification itself was straightforward. An external order arrived, the application received the relevant information, and a new notification appeared in the notification panel.

But the requirement was not just to tell the user that an external order existed.

The notification needed a CTA.

When the user clicked it, the application should open the draft invoice drawer with the relevant external order already loaded.

From the backend perspective, I imagined this would be fairly simple. I already had the identifier. I just needed to find whatever function opened the drawer and pass that ID to it.

So I asked one of the frontend engineers how the drawer was called.

The answer led me much deeper into the frontend than I expected.

## Opening a Drawer Wasn't Just Opening a Drawer

The notification formatting logic and the draft invoice drawer had been built as separate parts of the application.

That made sense until a notification suddenly needed to control the drawer.

The formatter knew how to turn notification data into something the UI could display. The drawer had its own state and knew how to display a draft invoice. What was missing was a clean path between those two responsibilities.

I started tracing the notification click handler and following how the drawer state was managed. Eventually, the problem became clear: the notification formatter did not have access to the state responsible for opening the draft invoice drawer.

What I had imagined as:

```ts
openDraftInvoiceDrawer(orderId);
```

was not sitting somewhere waiting for me to call it.

The drawer state was managed through Zustand, while the notification formatting logic lived outside the normal React state flow where I would usually access that store through a hook.

At this point, I could have stopped.

The backend work was done. Frontend implementation was not my primary responsibility, and handing the remaining work to a frontend engineer would have been completely acceptable.

But I had already started the feature, and I wanted to finish the path all the way to the user.

More importantly, by then I wanted to understand why something that sounded so simple from the backend was not simple from the frontend.

## Pair Programming Through the Frontend

I ended up pair programming with one of the frontend engineers.

Instead of asking him to take the feature from me, we went through the existing frontend flow together. I could ask why state was stored in a particular place, how the drawer was normally opened, and what assumptions the surrounding code was making.

Eventually, we used the Zustand store directly through `getState()` from outside the usual React component context. That gave the notification logic access to the action needed to update the drawer state when the CTA was clicked.

Conceptually, the flow became something like:

```ts
const drawerStore = useDraftInvoiceDrawerStore.getState();

drawerStore.open(orderId);
```

The actual implementation had more application-specific state involved, but the important part was that the notification could now bridge into the existing drawer state without requiring us to thread a setter through every formatter call site.

There was a cleaner alternative. We could have passed the drawer action into the notification formatter as a dependency.

That would have made the relationship more explicit, but it also meant changing every place that called the formatter. For a relatively small feature inside an already large frontend, using the store directly was the more practical change.

It was not architecturally invisible, though. A piece of code that had mostly been concerned with formatting notifications could now cause application state to change.

The notification was no longer merely informational.

It had become part of the application's navigation.

## Why I Finished the Frontend Part

Finishing that feature gave me something I would not have gotten if I had simply handed it over after completing the backend.

I got to see how the data I exposed was actually consumed.

As a backend engineer, it is easy to look at an API contract and think primarily about whether the endpoint is consistent, whether the response is properly typed, whether the required identifiers are present, and whether the domain model makes sense.

All of those things matter.

But the frontend does not consume an API contract in isolation. It needs to turn that data into an interaction.

In this case, an external order ID was not just an identifier in a response. It was the piece of information that eventually needed to travel from a notification, through a click handler, into application state, and finally into a drawer that could show the user something useful.

Following that path gave me a different perspective on what I was proposing from the backend.

## An API Contract Has a Consumer

Since then, when I work on API contracts, I try to think beyond whether the backend representation is technically clean.

I also think about what the frontend will actually have to do with it.

Will they have enough information to perform the next interaction? Are they going to need another request just to resolve something I could already provide? Does the response shape fit how the feature is presented, or am I exposing something that is convenient for the backend but awkward for its consumer?

That does not mean the backend should reshape everything around whatever the frontend happens to need at that moment. The boundaries still matter.

But understanding both sides makes those boundaries easier to negotiate.

The notification feature started as a small piece of remaining frontend work after I had finished the backend. I could have handed it to someone who knew that codebase better than I did.

Instead, I spent more time on it than I originally expected, pair programmed through unfamiliar state management, and learned why opening one drawer was considerably more complicated than passing an ID into a function.

The feature itself was small.

Understanding the other side of the API was the useful part.
