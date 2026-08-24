---
title: Building a Zero-Direct-Access Volunteer Recruitment System
category: Web Dev
date: August 2026
read: 3 min read
excerpt: How we built a production-grade recruitment platform for MoraSpirit with strict security, anti-abuse measures, and 40+ real submissions.
---

## The problem

When MoraSpirit needed a volunteer recruitment portal, the obvious path was a simple form that writes directly to a database. We took a different approach — one that treats security as a first-class requirement, not an afterthought.

The result: a production system with 40+ successful application submissions and zero data incidents so far.

## Zero-Direct-Access Security Architecture

The core principle: **the frontend never touches the database directly**.

Every operation — reading deadlines, submitting applications, uploading CVs — goes through serverless API routes on Next.js App Router. Supabase credentials never leave the server. Even if the frontend JavaScript were fully exposed, an attacker would find nothing useful.

### Supabase Row Level Security

RLS policies are configured to **deny all** by default. Public and anonymous requests are blocked at the database level. This means even if someone obtained the Supabase public key, they could not read or write data without a valid server-side session.

### Locked-down CV storage

CV uploads go through a multi-step server-side pipeline:

- Magic byte verification (file type confirmed by content, not extension)
- File size enforcement
- Upload to a **private** Supabase Storage bucket
- Downloads served via short-lived, backend-generated signed URLs

The bucket is never publicly accessible.

## Anti-Abuse & Submission Integrity

High-traffic recruitment windows attract bots. We addressed this at two levels:

**Cloudflare Turnstile** replaces traditional CAPTCHA. It validates users silently in most cases — no image puzzles, no friction — while still blocking automated submissions effectively.

**Upstash Redis rate limiting** enforces per-IP submission caps during peak registration windows, preventing DDoS-style floods from overwhelming the system or the database.

## Dynamic Deadlines & Admin Controls

A custom admin panel lets the MoraSpirit team:

- Set and update the application closing date without a redeploy
- Toggle application intake on/off in real time
- View submission counts live

The frontend reads the deadline from the API on load and renders a **synchronized countdown timer**. When the deadline hits, the form locks — no client-side bypass possible since the API enforces the same check server-side.

## Tech Stack

- **Next.js** (App Router) · **TypeScript** · **Tailwind CSS** · **shadcn/ui**
- **Supabase** (Postgres + Private Storage)
- **Upstash Redis** · **Cloudflare Turnstile** · **Zod**

## What I'd do differently

The admin panel was built quickly and could benefit from proper role-based access rather than a shared secret. That's the next iteration if the system sees continued use.