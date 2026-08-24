---
title: How StairDoc Climbs Stairs
category: Robotics
date: July 2026
read: 1 min read
excerpt: The mechanical and software challenges behind building a robot that navigates staircases autonomously.
---

## The mechanical problem

Standard wheeled robots fail on stairs because wheels lose contact with the surface. We solved this with a rocker-bogie-inspired chassis that keeps all wheels grounded even on uneven surfaces. The key insight was distributing weight dynamically as the incline changes.

## Motor control in C++

Each wheel pair is driven by a separate motor controller. The stair-climbing sequence is triggered by an ultrasonic sensor detecting a step edge. The firmware then executes a choreographed sequence:

```
RAISE_FRONT → ADVANCE → LOWER_FRONT → RAISE_REAR → ADVANCE → LOWER_REAR
```

## What I learned

Real hardware is unforgiving. Simulation told us the design would work; the first physical prototype disagreed loudly. Iteration speed — how fast you can test, break, and fix — matters more than getting the design perfect on paper.
