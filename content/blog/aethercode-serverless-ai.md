---
title: Building AetherCode — Serverless AI Without the Lock-In
category: AI Systems
date: October 2026
read: 6 min read
excerpt: How AetherCode routes across four AI providers from one Netlify function, using browser-only keys, quota-aware failover, and context guardrails.
---

AetherCode started as a small experiment: build a code synthesizer that could switch between AI providers without turning the frontend into a pile of provider-specific SDKs. It grew into a useful tool and a practical lesson in serverless architecture, quota management, and designing around third-party limits instead of pretending they do not exist.

The constraints were deliberate:

- No vendor lock-in.
- No server-side custody of API keys.
- No silent failures when a provider runs out of quota.

## BYOK: keys stay in the browser

AetherCode uses a bring-your-own-key model. The user pastes an API key, and it is stored only in the browser's `localStorage`. When a request is made, the key is sent to a stateless Netlify function for that single request and is never written to a database, log, or environment variable.

That keeps the deployment simple. There is no account system, no billing layer, and no central key that becomes valuable if the server is compromised. The function only exists long enough to validate the request shape, call the selected provider, normalize the response, and return it.

The trade-off is that browser storage is not a vault. A key in `localStorage` is readable by any script running on the same origin, so the frontend has to stay disciplined about what it loads. For a personal tool with no third-party scripts in the request path, that is an acceptable exchange.

## One endpoint, four providers

The backend exposes a single endpoint. A provider field selects an adapter for Google Gemini, Groq, OpenAI, or Anthropic. Each adapter translates the shared message format into the provider's request shape, then maps the response back into one normalized result for the client.

This is where most provider abstractions leak. Model names are not stable, and older clients can end up requesting a model string that the provider has retired. AetherCode handles that with a normalization layer that intercepts legacy model identifiers and upgrades them to current APIs before the upstream call is made.

In practice, that means an old saved session or stale frontend build does not produce a confusing `404` from the provider. The request is rewritten to a supported model, and the response includes the model that actually ran. The client can then persist the corrected identifier for next time.

The same layer smooths over differences in response envelopes, streaming formats, and usage metadata. The React app does not need to know which provider answered.

## Quotas are part of the user experience

Free-tier AI APIs are strict. Daily quotas disappear quickly during a long coding session, and the failure mode is usually an unhelpful HTTP error after the user has already typed a detailed prompt.

AetherCode treats quota information as part of the interface. A custom fetch interceptor watches `x-ratelimit` headers on provider responses and tracks remaining budget client-side. The UI can show what is left before the next request, rather than discovering the limit only when a call fails.

When a provider is exhausted, the app does not simply stop. A fallback chain moves the request to another model or provider. A typical path is Gemini to GPT OSS 120B on Groq. The switch is visible in the session, so the user knows which model produced the answer and why the route changed.

This is intentionally a graceful failover, not a retry loop. A quota error is a routing signal. A malformed prompt or a content error should still surface to the user instead of being hidden by silently trying every provider in sequence.

## Context guardrails

Long conversations eventually hit token limits. Some providers return `413` errors, others truncate in less obvious ways, and the result is usually a broken session rather than a useful warning.

AetherCode uses a sliding-window truncator before each request. The system instructions and the latest user message are preserved, while the oldest turns are dropped until the payload fits the target budget. The result is a conversation that keeps its current context instead of failing because of its history.

The truncator is deliberately conservative. It is better to lose an old turn than to send a request that the provider rejects outright.

## The small things that make it usable

The features around the model calls matter as much as the routing:

- Syntax-highlighted code blocks with one-click copy.
- Session persistence so a refresh does not erase the conversation.
- Duplicate-prompt caching keyed by provider, model, and prompt hash.
- Markdown export for moving a session into notes or a repository.

None of these require a server. They are all client-side state and presentation, which keeps the backend focused on the one job it needs to do: make a provider call and return a normalized response.

## What the project taught me

Vendor lock-in is usually an architectural choice, not a vendor problem. Once the request and response shapes are normalized, swapping providers becomes a routing decision instead of a rewrite.

Third-party limits also deserve first-class design. Quotas, rate limits, and context windows are not edge cases that can be handled with a generic error toast. They are part of the system's operating conditions, and the interface should reflect them honestly.

AetherCode is live at [aethercode-ai-coding-agent.netlify.app](https://aethercode-ai-coding-agent.netlify.app/), and the source is on [GitHub](https://github.com/AkashGandhawa/aethercode).
