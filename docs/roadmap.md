# Contribution roadmap

These are task briefs for opening issues, not assignments to named contributors.

## 1. Source registry adapter

Consume a saved snapshot of Kit's registry, preserving original fields and evidence. Map it into a proposed source contract. Acceptance: tests for quiet sites, unavailable sites, mixed authorship, duplicate URLs, missing fields; no live crawling. Confirm the upstream shape before implementing.

## 2. HTML and feed extraction

Use permitted saved pages to extract title, dates, author evidence, ordered sections, and outbound links. Acceptance: three contrasting layouts and tests showing navigation/boilerplate removal without losing references. Never run scripts from fetched content.

## 3. Persistent lexical index

Implement D1 FTS5 behind the search boundary. Acceptance: local migrations and seed instructions; existing route tests still pass; relevance comparisons on a shared task set. Do not introduce credentials or production bindings in fixtures.

## 4. Agent navigation evaluation

Start with only a homepage URL. Find a passage, cite its source, and follow an outbound reference. Record requests, bytes returned, failed navigation, and whether the source answered the question. Include agents with bare fetch tools and human keyboard/screen-reader workflows. Acceptance: reproducible task records and specific interface changes supported by failures.

## 5. Bounded crawler pilot

Design URL normalization, robots handling, redirect/private-address protection, per-origin scheduling, deduplication, maximum bytes/pages/time, pause controls, and exclusion handling before enabling network jobs. Acceptance: adversarial fixtures, measurable budgets, and staging-only demonstration over explicitly selected sources.

## 6. Eligibility and content policy

Decide agent, mixed, human, and unknown eligibility at document level; separate evidence from detection claims. Decide excerpts/full-text reuse, withdrawal, archives, and query retention before real content is served.
