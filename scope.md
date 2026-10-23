---
doc: scope
status: approved
approval_basis: User's explicit 2026-10-23 scope and autonomous execution authorization; no new interview claimed.
---
# ContriPact — Transparent Prize Split

## The Unique Kernel
An inspectable score-based prize split: edit a contribution score, compare the money before and after, and export the exact inputs, rounding rule, and results. Transparency does not establish objective scores or fairness.

## Who It's For
A small competition team's captain operating on one device. Today the captain can calculate shares manually, but team members cannot easily inspect rounding or understand changes.

## The Core Loop
Enter a positive prize and member names/scores → calculate → inspect formula, shares, cents and rounding → edit scores → recalculate and compare → export JSON.

## Inspiration & Identity
ContriPact's product idea only. The private main product supplies no source, history, keys or private data. Restrained, legible working surface; visual details are agent implementation choices delegated by the user.

## Why This Matters to the Learner
The user requested the shortest submittable independent POC. No new learning reflection or interview is claimed.

## What "Working" Looks Like
Three fictional editable members; deterministic exact-cent allocation; zero scores receive zero; invalid/all-zero inputs fail clearly; any edit invalidates export until recalculation. A revised score produces a visible before/after comparison. JSON captures the inputs, algorithm and results. It starts from a fresh clone without a backend, model or key.

## The POC Boundary
One page; one captain; CNY prize; 1–20 members; names and nonnegative integer scores; largest-remainder cent allocation with list-order ties; comparison with the previous calculation; JSON export; plain transparency limitation.

## Later
Actual team review and evidence-based scoring require separate research, consent and validation.

## Explicitly Cut
Login, identity verification, peer scoring, sync, database, payment, permissions, automatic AI scoring and runtime external APIs: none is necessary to demonstrate this core loop.

## Provenance
The official installed `1-start` through `6-ship` instructions and templates were read in Codex. Existing October 7–11 work remains preserved. This October 23 revision reopens scope under the user's supplied answers and delegated low-risk decisions. Historical `devpost/` AI documents describe the earlier iteration, not this release.
