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