---
title: "I Added a Feature Flag for Something That Was Already in Production"
description: "The Starnet export button was already in production before the feature flag was added. A story about building kill switches after the fact in multi-tenant deployments."
pubDate: 2026-06-10
tags: ["engineering", "backend"]
draft: true
---

13. "I Added a Feature Flag for Something That Was Already in Production"

Summary: In early January 2025, Ahmad added VITE_ENABLE_EXPORT_TO_STARNET — a feature flag for the Starnet export button. The button itself was already built and pushed. The feature flag was added after implementation, to allow disabling the button on instances where the Starnet integration wasn't configured. The commit sequence: add export starnet button → add expand external lab orders when fetching appointment  data → adjust expanded relations from backend → let selected items depend on backend → add VITE_ENABLE_EXPORT_TO_STARNET feature flag. The flag was an afterthought, added when it became clear that the feature couldn't be rolled back to instances that didn't have the integration setup. The diary entry is about the standard experience of "we shipped it, now we need a kill switch."

Original situation: The Starnet export was built and deployed. Some clinic instances didn't have the Starnet configuration.
What triggered it: Deployment to a multi-tenant environment where not all tenants had Starnet.
Investigation: Checking which environment variables were needed for Starnet and which tenants had them configured.
Obstacles: The feature was already in production; rolling it back would be more disruptive than adding a flag.
Solution: Add VITE_ENABLE_EXPORT_TO_STARNET environment variable that defaults to off; enable only on instances with Starnet credentials.
Alternatives: Tenant-level feature flag in the backend — the correct long-term solution, but more engineering work.
Lessons: Ship the feature. Ship the kill switch. Don't assume the first deployment goes to all instances.

Educational value: 7/10 | Authenticity as diary: 9/10
Audience: Frontend engineers in multi-tenant SaaS, anyone managing feature rollouts | Reading time: 4 min
Recommended structure: Why "it's deployed" doesn't mean "it's everywhere" → the multi-tenant kill switch → why the flag was VITE_-prefixed → the long-term correct solution