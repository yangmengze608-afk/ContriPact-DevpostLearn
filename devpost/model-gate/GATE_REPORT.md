# ContriPact Model Gate Report

## Status: FINAL PASS — OFFICIAL RUBRIC CONTRACT

The prepared Build With AI: Basics case now uses four equally weighted judging criteria:

- Design — 25%
- Potential Impact — 25%
- Innovation/Idea — 25%
- Presentation — 25%

Runtime contract: Spark-X2.5-4B Q4_K_M through Ollama, `num_ctx=8192`, `think=false`, `temperature=0`, `seed=42`, `top_p=0.9`, schema-constrained output, and task-specific output caps.

## Final repeated gate

Three complete post-correction runs passed **Rules → Before → After → Objection** end to end. The full structured outputs were exactly equal across all three runs for all four stages.

| Gate | Result | Wall time across 3 runs | Mean |
| --- | --- | --- | --- |
| Rules | 3/3 pass; exact output equality | 12.256–27.893s | 17.952s |
| Before | 3/3 pass; exact output equality | 26.605–47.651s | 36.999s |
| After | 3/3 pass; exact output equality | 23.045–60.954s | 39.039s |
| Objection batch (O1/O2/O3) | 3/3 pass; exact output equality | 24.038–34.524s | 29.714s |

Stable reward proposal in all three runs:

- Member B — 35% — ¥4,200
- Member A — 30% — ¥3,600
- Member C — 20% — ¥2,400
- Member D — 15% — ¥1,800

Prepared O2 was identical in all three runs: `supported`, `Presentation`, evidence `D1`, `changes_contribution_assessment=false`, `recommendation_action=keep`.

The Before map also remained identical: T1 links to Design/Innovation-Idea, T2 to Potential Impact/Innovation-Idea, T3 to Design/Presentation, T4 to Presentation, and T5 remains Supporting with no fake scored-criterion link.

## Product-path verification

A clean Express process was started after the rubric correction. The first `npm run warm` performed real live inference for Rules, Before, After, and O2. A second identical warm-up hit validated in-memory cache for all four stages. The product API returned the same 35/30/20/15 proposal and the same O2 governance decision as the final model gate.

Cold inference latency varied substantially across repeated local runs, especially Before/After. The demo therefore uses the validated process-memory warm path for recording smoothness; it never substitutes seeded or prewritten AI-looking results.

## Historical evidence

The earlier three-run evidence is preserved under `stability-provisional-rubric/`. It used a provisional prepared-case rubric and is retained only to document the development investigation that led to deterministic settings and canonical input contracts. It is not current submission evidence.

## Boundary

This gate supports Spark-X2.5-4B for this **fixed, schema-constrained POC**. It does not establish that the model is safe, fair, or accurate for arbitrary real-world compensation disputes.
