---
title: DSA in the Real World: Lessons from TextileERP
category: Engineering
date: May 2026
read: 4 min read
excerpt: What building a manufacturing ERP in C taught me about data structures beyond the classroom.
---

## Linked lists for order queues

Orders in a textile factory arrive continuously and need to be processed in FIFO order — but with priority overrides for rush orders. A doubly linked list with a priority pointer turned out to be far more practical than a heap here, because insertion at arbitrary positions is O(1) once you hold a pointer.

## Hash maps for inventory lookup

Inventory queries need to be fast. Scanning an array for a SKU every time an order is placed doesn't scale. Replacing the array with a hash map dropped lookup from O(n) to O(1) average case — and the difference was immediately visible at even modest data sizes.

## The lesson

The right data structure isn't always the theoretically optimal one. It's the one that fits your access patterns, your team's mental model, and your maintenance budget. Choosing `struct` layouts thoughtfully in C made this concrete in a way that higher-level languages abstract away.