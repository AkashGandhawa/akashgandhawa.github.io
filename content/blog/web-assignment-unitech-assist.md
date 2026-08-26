---
title: What I Learned Building a Full-Stack App Solo
category: Web Dev
date: April 2026
read: 1 min read
excerpt: Reflections on shipping the university IT ticketing system — from schema design to deployment.
---

## Schema design is the hardest part

I rewrote the Prisma schema three times before settling on the final structure. The relationship between `User`, `Ticket`, and `Department` seems obvious in hindsight, but the first two attempts created circular dependency issues that made role-based queries painful.

## Next.js App Router vs Pages Router

I chose the App Router because it was the future — and paid the price in documentation gaps and community answers that still assumed Pages Router. If I were starting today I'd still choose App Router, but I'd budget extra time for the learning curve.

## The deployment gap

There's a significant gap between "it works on localhost" and "it works reliably for 50 concurrent users". Connection pooling in Prisma, environment variable management, and error boundaries all became critical only after the first real-world load test.

## What I'd do differently

Write tests earlier. Not because bugs weren't caught — they were, eventually — but because tests force you to design APIs that are actually usable rather than just functional.