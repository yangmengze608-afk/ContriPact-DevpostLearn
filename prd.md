---
doc: prd
status: approved
approval_basis: User's supplied requirements and delegated implementation details, 2026-10-23.
---
# ContriPact — Product Requirements
Source: `scope.md > The Core Loop` and `The POC Boundary`.

## The Core Journey
1. Open the single page and find a clearly labeled fictional example: CNY 100.00, Alex 1, Blair 1, Casey 1.
2. Edit the prize, member names and scores. Add/remove members within 1–20.
3. Calculate. See each member's score fraction, approximate percentage, exact CNY amount, base cents and any extra rounding cent.
4. Change Blair's score to 2. See “Results need updating”; the previous result remains clearly marked and export is disabled.
5. Recalculate. See the previous calculation and signed changes: Alex 33.34 → 25.00, Blair 33.33 → 50.00, Casey 33.33 → 25.00.
6. Export fresh JSON containing both calculation snapshots and the rule. Success means the allocated cents exactly equal the prize cents.

## Screens and Layout
One screen with an input form, a results table and an explanation. A small process/document section links scope, PRD and spec. On narrow screens the columns stack. All inputs have labels and errors are announced.

## Look and Feel
Clear enough to record. Agent-selected low-risk details: warm neutral paper, dark ink, restrained green for current results, tabular money, strong focus rings. No decorative animation or marketing claims.

## Fields and Validation
- Prize: CNY 0.01–1,000,000.00 inclusive, plain decimal notation, at most two decimal places. No exponent, signs, separators, NaN or infinity. Reject empty, zero and excessive values.
- Members: 1–20; name after trimming 1–60 characters; duplicate names rejected case-insensitively to avoid ambiguous comparisons.
- Scores: plain nonnegative integers 0–1,000,000 inclusive; total score > 0. Reject decimal, exponent, signed, empty or over-limit values.
- The three example names are fictional. Names are rendered as text.

## Results and Comparison
Prize cents × score / total score is the exact quota. Floor quotas, then award the remaining cents to highest fractional remainders. Equal remainders use list order. Zero scores get no cents. Rounded percentages are informative and need not sum to exactly 100.00%; score fractions and allocated cents are authoritative.
Comparison uses stable member IDs against the immediately preceding successful calculation, including its original names, scores, prize and amounts. Added/removed members are explicit. On a failed calculation, preserve the last successful snapshot without making it exportable. Repeat calculation of unchanged input does not replace the comparison baseline.

## States and Boundaries
Initial: example is editable, not calculated. Fresh: export enabled. Edited: visibly stale, export disabled even if edit is later undone, until a successful calculation. Invalid: actionable field error, no new result and no export. Reload: resets to example; nothing is sent to a server or stored across sessions. Export includes current and previous inputs/results, rule, tie-break and limitation; it is not a signed agreement or payment instruction.

## Acceptance Conditions
- 100.00 with scores 1/1/1 → 33.34/33.33/33.33.
- 0.01 with 1/1/1 → 0.01/0/0; exact ties favor first listed member.
- 100.00 with 0/1/1 → 0/50/50.
- All-zero, invalid prize/score/name/member count → clear error and disabled export.
- Edit then recalculate → correct previous/current comparison and cents deltas.
- Exported current cents sum exactly to prize; JSON inputs reproduce results deterministically.
- Full loop runs without backend, Ollama, credentials or network APIs.

## Product Decisions
User supplied the operator, workflow, arithmetic, stale-result guard and exclusions. CNY, limits, duplicate-name guard, stable IDs and visual details are delegated agent choices. No new learner interview, reflection or hands-on approval is asserted.

## Non-Goals
No objective contribution assessment, fairness guarantee, legal agreement, payment, AI inference or collaborative workflow. Historical AI prototype files are preserved but are not part of the active entry.
