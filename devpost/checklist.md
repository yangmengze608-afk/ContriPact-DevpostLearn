---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Enter the case and get a real Before contribution map**
  Becomes usable: A running ContriPact POC where the reviewer can enter the prepared case, see the competition brief, run real local Spark rule analysis, see planned tasks mapped to those criteria, and mark the map agreed.
  Why now: This proves the unique kernel first—competition rules → contribution value—while bootstrapping React, Express, prepared data, validation, and Ollama inside one usable end-to-end slice.
  PRD ref: `prd.md > The Core Journey` (steps 1-5), `prd.md > Competition Rule Analysis`, `prd.md > Before-Project Contribution Planning`
  Spec ref: `spec.md > Commercial Landing`, `spec.md > Demo Case Loader and Flow State`, `spec.md > Competition Rule Analysis`, `spec.md > Before-Project Contribution Planning`, `spec.md > AI Provider Boundary`
  Build: Scaffold React/Vite + TypeScript and the Express server; add the canonical prepared case; build a restrained first-pass landing/workspace shell; implement `/api/analyze/rules` and `/api/analyze/before` through `OllamaSparkProvider`; add schema and traceability validation; render rule weights, source quotes, task relevance, and the local agreed state. Keep the visual pass functional rather than final.
  Verify (mechanical): Run the TypeScript/build checks; start the app; call Rules and Before APIs against the canonical scenario and assert exact criterion set/100% weights, valid task IDs/criterion links, at least one High task and one Supporting task; confirm the web app responds at `http://localhost:5173`.
  Learner check: Open the app, enter the demo, run the Before analysis, inspect why T1/T2/T4 matter and why T5 is Supporting, then mark the contribution map agreed. Tell me what feels confusing or unlike the product you pictured.
  Commit: `Build real Before contribution map`

- [x] **2. Switch to After and get a traceable ¥12,000 proposal**
  Becomes usable: The agreed case can switch to After Project, display each member's raw evidence separately from AI interpretation, and produce a validated contribution-based split whose percentages and CNY amounts reconcile exactly.
  Why now: This completes the second half of the kernel before dispute handling and catches the highest-risk product claim—turning evidence into a money proposal—while the flow is still small enough to inspect.
  PRD ref: `prd.md > The Core Journey` (steps 6-8), `prd.md > After-Project Contribution Evaluation`, `prd.md > Reward Recommendation`
  Spec ref: `spec.md > After-Project Contribution Evaluation`, `spec.md > Reward Recommendation`, `spec.md > Analysis Cache`, `spec.md > Analysis-Unavailable Boundary`
  Build: Add the After mode and member evidence cards; implement `/api/analyze/after`; constrain criterion/evidence enums and evidence ownership; validate four unique members and 100% total shares; compute amounts deterministically from ¥12,000; add honest loading/unavailable states and validated process-memory caching for Rules/Before/After.
  Verify (mechanical): Run build/type checks; call the After API and assert A/B/C/D appear once, cited evidence belongs to each member, criterion links are valid, shares total 100%, amounts total ¥12,000, and the same validated request returns from cache on the second call without changing data.
  Learner check: In the running app, switch from the agreed Before map to After, inspect the four evidence/reason cards and the money proposal, and check whether the distinction between evidence and AI interpretation is immediately clear.
  Commit: `Add evidence-grounded reward proposal`

- [x] **3. Challenge the proposal and reach human agreement**
  Becomes usable: A member can raise the prepared objection, see whether it is grounded in rules/evidence, understand why the current proposal is kept or would require re-analysis, and the team can explicitly accept the final allocation.
  Why now: Contestability is what separates ContriPact from a black-box allocation calculator; building it before polish completes the social/governance kernel while all inputs remain inspectable.
  PRD ref: `prd.md > The Core Journey` (steps 9-11), `prd.md > Objection and Reason Check`, `prd.md > Final Agreement`
  Spec ref: `spec.md > Objection and Reason Check`, `spec.md > Final Agreement`, `spec.md > Analysis-Unavailable Boundary`
  Build: Implement `/api/analyze/objection` with one objection per call and the current validated After assessment; enforce supported/unsupported cross-field rules; render the rule/evidence connection and defended/revise state; require fresh After analysis before any revised money can be shown; add the final team-accepted state with explicit AI-versus-human authority copy.
  Verify (mechanical): Run build/type checks; submit O1/O2/O3 through the objection route and assert unsupported objections return `NONE`/no evidence/keep, O2 cites `Presentation` + `D1` and keeps the already-recognized proposal, then verify the final accepted state can only use a validated proposal.
  Learner check: Run the full Before → After → objection → Accept path yourself. Focus on whether O2 feels like a fair explanation of “your point is valid, but it was already counted,” rather than the AI simply dismissing the member.
  Commit: `Add contestable objection and agreement flow`

- [x] **4. Make the complete journey reviewer-ready**
  Becomes usable: The same verified kernel becomes a polished English-first bilingual, black/white/ink-wash demo that can be understood quickly, survives AI failure honestly, and is smooth enough for the competition recording.
  Why now: Visual polish, bilingual copy, ripple interaction, cache warming, and full-flow refinements matter only after the real governance kernel works; doing them last prevents presentation work from hiding broken reasoning.
  PRD ref: `prd.md > Commercial Entry`, `prd.md > Look and Feel`, `prd.md > States and Boundaries`, `prd.md > What We're Building`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Where It Runs and How Someone Tries It`, `spec.md > Analysis Cache`, `spec.md > Important Failure Modes`
  Build: Finish the commercial ink-wash landing and restrained pointer interaction; use the earlier ContriPact MVP as a visual-quality reference for hierarchy, ink-wash atmosphere, and card rhythm without copying its source code or production workflow; complete English/中文 copy without resetting state; polish workspace hierarchy and responsive behavior; expose retry/force-refresh development behavior; add a warm-cache path using only genuinely validated inference; finish README/start instructions and remove machine-specific assumptions from the public path.
  Verify (mechanical): Run the production build/type checks; start from a clean server process and exercise the complete Rules → Before → After → O2 → Accept API path; verify the second validated pass is cache-backed, language switching preserves state, failure responses never surface fake analysis, and the app serves successfully at the documented URL.
  Learner check: Open the app fresh and use it like a judge with no explanation from me. Try English/中文, complete the whole journey, deliberately notice anything slow/confusing/ugly, and tell me what you would change before recording the demo.
  Commit: `Polish complete ContriPact demo journey`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after Slice 1, while the workspace hierarchy and Before explanation can still shape the remaining UI
- [x] Final kick-the-tires exploration and feedback completed — after Slice 4

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship

Outcome: final hands-on review completed; no additional product changes requested.

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Focused recap of the real prompt-contract drift during the original build: the product path and model gate initially produced different valid proposals until both were aligned to the same canonical `id + name + weight` input contract. That earlier numeric result was later superseded during shipping when the prepared case rubric was corrected to the current official Build With AI: Basics criteria.
Route and stops: Reference route saved in `devpost/app-map.html`: `Workspace.tsx` (`runAfterAnalysis` / `runObjection`) → `server/routes/analysis.ts` (`/after`, `/objection`, `cachedAnalysis`) → `ollamaSpark.ts` + `validate.ts` (`analyzeAfter`, `checkObjection`, validators).
Edit outcome: Not applicable — the meaningful contract correction was already implemented and verified during Slice 2; no ceremonial extra edit was added.
Reflection: Already covered by the build discussion; no additional reflection exercise required.
Activity mode: Focused evidence-based recap for an experienced agent-assisted builder.

## Revisions

- After AI prompt aligned to the final gated canonical input shape — the first product-path run used compact `name + weight` criteria and produced a different valid split than the final 4-spec gate; the build now uses the same canonical `id + name + weight` facts and formatting contract as the verified gate.

- Shipping audit correction: the prepared competition case was updated from a provisional rubric to the current official Build With AI: Basics Stage Two criteria — `Design`, `Potential Impact`, `Innovation/Idea`, and `Presentation`, equally weighted. The corrected contract then passed 3/3 full post-correction model gates with exact structured-output equality; current evidence lives in `model-gate/stability-final/`.

- Shipping tooling fix: after the canonical case version bumped from `1.0.0` to `1.1.0`, `scripts/warmDemo.ts` was found to have a hard-coded old version. It now imports the canonical `demoCase.id` and `demoCase.version`, preventing warm-cache tooling from drifting from the product contract.
