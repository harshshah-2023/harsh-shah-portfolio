---
title: "Machine Learning in Production — Field Notes"
description: "Training a model is 20%. Deploying one is 80%. Notes on what actually matters once a model ships."
date: "2025-01-01"
tags:
  - AI Engineering
  - MLOps
---

Training a model is 20%. Deploying one is 80%.

Loved by engineers, ignored by reality:

- Accuracy decays — data drift is unavoidable
- Monitoring beats a beautiful confusion matrix
- GPUs are expensive — inference must be optimized
- Latency > accuracy for real-time systems
- Explainability improves adoption more than accuracy
- If you don't track feature importance, you are blind

A model that ships is better than a model that scores.
