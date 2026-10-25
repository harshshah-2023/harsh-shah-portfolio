---
title: "Understanding Retrieval-Augmented Generation"
description: "A practical walkthrough of how RAG systems retrieve, rank and ground LLM answers — and where they usually break."
date: "2026-10-24"
tags:
  - AI Engineering
  - LLM
  - System Design
coverImage: "/blog/images/understanding-rag.svg"
coverAlt: "Diagram of a query flowing through retrieve, re-rank and generate stages"
featured: true
---

> **Example article.** This post shows how headings, code, tables, images and quotes render on this blog. Edit or delete `content/blog/understanding-rag.md` when you publish your own work.

Large language models are fluent but forgetful. They know what was in their training data, nothing about your internal wiki, and they will happily invent an answer when they don't know one. **Retrieval-augmented generation** (RAG) narrows that gap by fetching relevant source material at query time and asking the model to answer *from that material*.

The idea is simple. Getting it to work reliably is mostly retrieval engineering.

## The two halves of a RAG system

Every RAG system has an offline indexing path and an online query path.

![RAG pipeline: documents are chunked, embedded and stored; questions are embedded, matched, re-ranked and answered with citations](/blog/images/rag-pipeline-diagram.svg)

### Indexing

1. **Load** documents from their sources — Markdown, PDFs, tickets, database rows.
2. **Chunk** them into passages small enough to be specific, large enough to carry meaning.
3. **Embed** each chunk into a vector and store it alongside its text and metadata.

### Querying

1. Embed the user's question with the *same* model used for indexing.
2. Retrieve the top-k nearest chunks, usually combined with a keyword search.
3. Re-rank the candidates and keep the best few.
4. Generate an answer that cites the chunks it used.

## Chunking is a product decision

How you split documents decides what the model can ever see. There is no universal best size; it depends on how people ask questions.

| Strategy | Typical size | Works well for | Watch out for |
| --- | --- | --- | --- |
| Fixed window | 300–500 tokens | Uniform prose | Splitting tables and code mid-way |
| Heading-aware | One section | Docs, wikis, runbooks | Very long sections |
| Semantic | Varies | Mixed content | Slower, harder to debug |
| Parent–child | Small match, large context | Precise questions | More storage and plumbing |

> Retrieval quality caps answer quality. A better prompt cannot recover a passage that was never retrieved.

## A minimal retrieval step

Here is the core of a hybrid retriever in Python. It merges vector and keyword results with reciprocal rank fusion, which is robust and needs no tuning to start with.

```python
from collections import defaultdict

def reciprocal_rank_fusion(result_lists, k=60):
    """Merge several ranked lists of chunk ids into one ranking."""
    scores = defaultdict(float)
    for results in result_lists:
        for rank, chunk_id in enumerate(results):
            scores[chunk_id] += 1.0 / (k + rank + 1)
    return sorted(scores, key=scores.get, reverse=True)


def retrieve(question, vector_index, keyword_index, top_k=6):
    dense = vector_index.search(question, limit=25)
    sparse = keyword_index.search(question, limit=25)
    return reciprocal_rank_fusion([dense, sparse])[:top_k]
```

The generation prompt then states the rules explicitly:

```text
Answer using only the sources below. Cite sources as [1], [2].
If the sources do not contain the answer, say you don't know.
```

## Where RAG systems usually fail

- **Wrong chunk boundaries** — the answer is split across two chunks and neither ranks highly.
- **Vocabulary mismatch** — users say "refund", documents say "chargeback". Keyword search plus query rewriting helps.
- **Stale indexes** — the source changed and nobody re-embedded it.
- **No evaluation set** — without 50–100 real questions with known answers, every change is a guess.

Measure retrieval separately from generation: *recall@k* tells you whether the right passage was found at all, before you ever look at the model's wording.

## Takeaways

RAG is less about the model and more about search. Start with hybrid retrieval, heading-aware chunks and a small evaluation set, then tune the parts the numbers point at. Inline details like `top_k`, chunk size and the re-ranker are knobs you turn *after* you can measure.

---

*Further reading: the original [RAG paper](https://arxiv.org/abs/2005.11401) by Lewis et al.*
