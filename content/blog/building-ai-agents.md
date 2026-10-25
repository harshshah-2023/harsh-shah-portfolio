---
title: "Building AI Agents That Know When to Stop"
description: "A draft on agent loops, tool design and termination conditions."
date: "2026-10-22"
tags:
  - AI Engineering
  - Agents
coverImage: "/blog/images/building-ai-agents.svg"
coverAlt: "A plan, act, observe, reflect loop"
draft: true
---

> **Example draft.** This file has `draft: true`, so it appears only on the local dev server and is left out of production builds, the sitemap and the RSS feed.

An agent is a loop: the model plans, calls a tool, observes the result and decides what to do next. The hard part is not starting the loop — it is ending it.

## The basic loop

```python
for step in range(MAX_STEPS):
    action = model.decide(goal, history)
    if action.type == "finish":
        return action.answer
    result = tools.run(action)
    history.append((action, result))
raise StepLimitExceeded(goal)
```

## Termination conditions

- A hard step limit
- A budget limit (tokens, time or money)
- An explicit `finish` tool the model must call
- A check that the last *n* steps made progress

*More to come.*
