# ContriPact — Transparent Prize Split

A single-device proof of concept for a small competition team's captain: enter a prize, names and contribution scores; inspect a deterministic split; change a score and compare amounts; export a reproducible JSON calculation.

**Transparency does not prove scores are objective or guarantee fairness.** This is not a payment system or a team agreement.

## Run from a fresh clone

Requires Node.js **24.x** and npm. No API keys, backend or model installation.

```bash
git clone https://github.com/yangmengze608-afk/ContriPact-DevpostLearn.git
cd ContriPact-DevpostLearn
npm ci
npm run dev
```

Open http://127.0.0.1:5173 . The default entry is the current deterministic calculator.

```bash
npm test
npm run build
npm run preview -- --host 127.0.0.1
```

Preview opens http://127.0.0.1:4173 . The static build is `dist/`; the relative Vite base supports GitHub Pages repository paths.

## Try the core loop

1. Calculate the fictional CNY 100.00 example with Alex, Blair and Casey, each scoring 1. The payouts are 33.34, 33.33 and 33.33.
2. Change Blair's score to 2. The result is marked stale and export is disabled.
3. Recalculate: 25.00, 50.00 and 25.00, with previous amounts and signed changes.
4. Open the rounding audit, then download `contripact-allocation.json`. It includes original inputs, the rule, current results and the preceding calculation.

## Exact-cent calculation

Prize: CNY 0.01–1,000,000.00, at most two decimal places. Members: 1–20; unique trimmed names of 1–60 characters; integer scores 0–1,000,000; positive total score.

Use integer cents and BigInt products. Floor `prizeCents × score / totalScore`, then distribute remaining cents by largest remainder; ties follow member list order. Zero-score members get zero. The sum of payouts equals the prize exactly. Displayed percentages are approximate; score fractions and integer cents are authoritative.

## Current planning documents

- [scope.md](scope.md): user, problem, kernel and exclusions.
- [prd.md](prd.md): interaction, validation, stale results and acceptance.
- [spec.md](spec.md): state, arithmetic, export schema, startup and tests.
- [Current process record](devpost/current-process.md): actual Skill Pack usage and revision boundaries.
- [Verification](submission/VERIFICATION.md): executed checks and limits.
- [Submission package](submission/SUBMISSION.md): English draft fields and remaining personal requirements.

## Actual use of the official Devpost Learn Skill Pack

The installed pack is from [challengepost/learn-ai-basics](https://github.com/challengepost/learn-ai-basics), using:

```bash
npx skills add challengepost/learn-ai-basics --all -y
```

Codex read the installed six `SKILL.md` files, planning templates and relevant references. `1-start` resumed from existing project artifacts. `2-scope`, `3-prd` and `4-spec` were reopened for the user's explicit October 23 scope, producing the three current root documents before implementing the calculator. `5-build` implemented and tested the complete calculation → comparison → export slice. `6-ship` drives the public-file/history audit, reproduction, demo and submission checklist.

The user supplied the product answers and authorized autonomous low-risk implementation. This revision did not conduct new interviews, a new learner hands-on review, or a new learning reflection, and does not claim to have done so. It follows the six-step structure with these disclosed deviations from the pack's interactive curriculum. The pack's source and hashes are recorded in `skills-lock.json`.

## Project provenance and previous iteration

This competition-specific workspace was initialized on October 7, 2026. An earlier independent AI/Ollama prototype and its `devpost/` plans remain as historical work from the same submission period. They are **not** the current active flow or current feature claims; consult the root documents. Existing public Git history is preserved; the October 23 release is added without force-pushing or importing any main private-repository history. The product idea predates this competition; the private main ContriPact source, data and credentials are not dependencies or part of the current new implementation. Historical absence of source copying cannot be established solely by a current automated scan.

## Limitations

A captain assigns the scores; the tool cannot evaluate contribution evidence, secure team consent, establish fairness or execute payment. Data lives only in browser memory and disappears on reload. JSON is an unsigned calculation record. No login, database, sync, scoring AI or runtime external API.

## Demo and shipping status

- Repository: https://github.com/yangmengze608-afk/ContriPact-DevpostLearn
- Live demo: https://yangmengze608-afk.github.io/ContriPact-DevpostLearn/ (calculation → edit → recalculate → JSON checked in a browser).
- Current operation video: [2m22s actual browser demo with English synthetic narration](https://github.com/yangmengze608-afk/ContriPact-DevpostLearn/releases/tag/transparent-split-v1). This release download is a backup; a publicly visible YouTube/Vimeo link is still required by the competition and is not yet verified.
- Devpost: not submitted. See the local current status for remaining blockers.

MIT license. Historical AI modules retain their prior dependencies in the lockfile to preserve the existing project; the default browser bundle does not import them.
