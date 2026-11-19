---
title: "BookYourGP"
description: "BookYourGP is an automated recall and appointment coordination system for UK GP practices, helping surgeries manage long-term condition reviews, patient recalls, questionnaires, and follow-up communication."
order: 2
image:
  src: "../../assets/projects/bygp-preview.webp"
  alt: "BookYourGP project preview"
projectStack:
  - "Laravel"
  - "PHP"
  - "MySQL"
  - "Blade Templates"
  - "JavaScript"
  - "jQuery"
  - "Bootstrap"
  - "GOV.UK Notify"
  - "Twilio"
links:
  - label: "Product Page Snapshot"
    url: "https://web.archive.org/web/20231219084755/https://www.hummingbirdsmedical.com/"
  - label: "Current Website"
    url: "https://www.hummingbirdsmedical.com/"
---

## Problem

- The existing legacy PHP system supported core appointment, recall, and patient communication workflows, but became harder to maintain, extend, and scale over time.
- Performance bottlenecks in database queries and legacy implementation patterns affected responsiveness during real clinic usage.
- The product needed modernization and essential improvements such as better performance, translation support, and support for imported-file inputs while preserving production stability.

## My Role

- Full Stack Developer contributing as one of two engineers on the modernization from legacy PHP to Laravel.
- Focused on backend development, SQL performance optimization, production stability, and communication workflow integrations.

## What I Built

![BookYourGP interface](../../assets/projects/book-your-gp/slide-01.webp "BookYourGP interface")

- Migrated and refactored core backend functionality from legacy PHP to Laravel while keeping existing clinical workflows stable.
- Optimized SQL queries and added database indexes to improve system responsiveness.
- Extended existing workflows with essential improvements such as translation support and imported-file input handling.
- Improved patient communication integrations using GOV.UK Notify and Twilio for recall and appointment-related messaging.
- Maintained and enhanced existing appointment, recall, and follow-up workflows without disrupting live clinic operations.

## Outcome

- Reduced page load times by 60–75% through SQL optimization and database indexing.
- Improved maintainability and scalability by modernizing the backend architecture with Laravel.
- Reduced missed appointments and improved follow-up reliability by strengthening automated reminders, recall notifications, and patient communication workflows.
