---
title: "Context Engineering for Reliable AI Applications"
description: "How to design, budget and test the context you give a language model, so it behaves the same way on the hundredth request as on the first."
date: "2026-10-20"
tags:
  - AI Engineering
  - Context Engineering
coverImage: "/blog/images/context-engineering.svg"
coverAlt: "Stacked layers of a model context window"
---

> **Example article.** A second sample post, here to show TypeScript and JSON code, nested lists, task lists and a comparison table. Replace it with your own writing.

Prompt engineering asks *what words should I use?* Context engineering asks a bigger question: **what should the model see at all, in what order, and how much of it?** In production, most "model mistakes" turn out to be context mistakes.

## What goes into a context window

A typical request to a model is assembled from several sources:

- **Instructions** — role, rules, output format
- **Knowledge** — retrieved documents, product data
- **State** — conversation history, user preferences
  - recent turns verbatim
  - older turns summarised
- **Tool results** — API responses, search results, file contents

Each layer competes for the same limited budget, and each one can mislead the model if it is stale, noisy or contradictory.

## Budget the window explicitly

Treat the context window like memory in an embedded system: allocate it deliberately.

```ts
type Budget = Record<"instructions" | "knowledge" | "history" | "tools", number>;

const BUDGET: Budget = {
  instructions: 1_500,
  knowledge: 6_000,
  history: 3_000,
  tools: 2_500,
};

export function fitToBudget(items: { text: string; tokens: number }[], limit: number) {
  const kept: string[] = [];
  let used = 0;
  for (const item of items) {
    if (used + item.tokens > limit) break;
    kept.push(item.text);
    used += item.tokens;
  }
  return { kept, used };
}
```

Logging the assembled budget per request makes regressions visible:

```json
{
  "request_id": "req_8f2c",
  "tokens": { "instructions": 1180, "knowledge": 5742, "history": 2210, "tools": 0 },
  "dropped_chunks": 3
}
```

## Ordering matters

Models attend unevenly across long inputs. A few rules hold up well in practice:

1. Put stable instructions first, so they can be cached.
2. Put the most relevant knowledge closest to the question.
3. Label every source clearly so the model can cite it.
4. Repeat the single most important constraint at the end.

## Static vs. dynamic context

| | Static context | Dynamic context |
| --- | --- | --- |
| Examples | System prompt, style guide | Retrieved docs, tool output |
| Changes | Per release | Per request |
| Cacheable | Yes | Rarely |
| Main risk | Drifts from the product | Noise and contradictions |

## A checklist before shipping

- [x] Every context source has an owner and a freshness rule
- [x] Token budget is logged per request
- [ ] An evaluation set covers the top 20 user intents
- [ ] Contradictory sources are detected, not silently merged

> Good context is curated, not accumulated. Adding more information is the easiest change to make and the hardest one to undo.

## Closing thought

The model is the same for everyone. The context is yours. Designing it carefully — budgeting, ordering, labelling and testing it — is where most of the reliability in an AI product comes from.
