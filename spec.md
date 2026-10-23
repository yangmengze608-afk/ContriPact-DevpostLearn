---
doc: spec
status: approved
approval_basis: Existing stack retained; implementation details delegated by user, 2026-10-23.
---
# ContriPact — Technical Spec

## How This Works, In Plain Language
The browser keeps what the captain types. Calculate validates it, converts the prize to integer cents, splits those cents by score, and saves a result snapshot. An edit marks that snapshot stale. Recalculate replaces it and retains the previous snapshot for comparison. Export downloads JSON from the fresh snapshot; no server receives member data.

## Stack
Retain existing React/TypeScript/Vite and installed lockfile. React UI: https://react.dev/ ; TypeScript: https://www.typescriptlang.org/ ; Vite static build: https://vite.dev/guide/static-deploy.html . No new production dependency. Existing historical Express/Ollama files remain but are not loaded or needed by the default entry.

## Where It Runs and How Someone Tries It
Node 24.x and npm; `npm ci`, `npm run dev`, open http://127.0.0.1:5173 . `npm test`, `npm run build`; `npm run preview -- --host 127.0.0.1` for built output. No keys/models. Static output in `dist/`; Vite base `./` supports a repository subpath. Optional GitHub Pages deployment does not replace the required video. Public repo: https://github.com/yangmengze608-afk/ContriPact-DevpostLearn . Final video URL is recorded in README when available; a local file is not a qualifying hosted URL.

## The Core Journey Through the System
`src/main.tsx` → `src/allocation/AllocationApp.tsx`: fields → `calculate` in `allocation.ts` → immutable result → results/previous snapshot → `createExport` → Blob download. Implements `prd.md > The Core Journey`.

## Components
### Allocation Engine
Pure TypeScript validation and calculation; no UI or network. Implements `prd.md > Fields and Validation` and `Results and Comparison`.
### Allocation App
React form, semantic result table, stale/error live status, comparison and download. Implements `prd.md > States and Boundaries`.
### Process Documents
Static document viewer embeds the three root Markdown documents at build time with Vite `?raw`; React renders text, never arbitrary HTML. No extra route or framework.

## Data Model
Input: `{prize: string, members: [{id: string, name: string, score: string}]}`. IDs stable in a session; reloading resets the fictional example. Result: `{prizeCents: number, totalScore: number, members: [{id,name,score,baseCents,remainderNumerator,extraCent,amountCents}]}`. Validated raw inputs and current/previous results live only in component memory. Previous result and raw inputs are captured only when a different valid calculation succeeds. Dirty flag is set on every input mutation. Fresh export verifies the raw input fingerprint against the last calculated fingerprint as defense in depth.

## Formula and Tail Algorithm
1. Validate bounded decimal prize as a string; split whole/fraction and convert to integer cents without floating-point multiplication.
2. Scores and score total are bounded safe integers (20 × 1,000,000 maximum).
3. For each member compute BigInt numerator = prizeCents × score, floor = numerator / totalScore and remainder = numerator % totalScore. Convert the bounded results to numbers for display/JSON.
4. Sort positive-score candidates by remainder descending then original index ascending. Give each of the first `prizeCents − sum(floors)` members one cent.
5. Assert sum(amountCents) == prizeCents and every zero score has zero amount. BigInt avoids intermediate precision loss; output money remains integer cents, at most 100,000,000.
6. Money formatting uses integer division and padded cents. Display percentages use floating point only for presentation, not allocation.

## Export Format
`schemaVersion: 1`, `currency: CNY`, `rule: {method: largest-remainder, formula, tieBreak: member-list-order}`, `limitation`, `current: {inputs, result}`, `previous: null | {inputs,result}`. No timestamp is needed; same calculation has deterministic result. File name `contripact-allocation.json`. Never serialize BigInt. Export is disabled whenever dirty or invalid, and the handler rechecks freshness.

## Look and Feel
Warm paper, ink, green accent, readable labels and focus states; stacked narrow layout; table in its own horizontal scroll container. Current and previous values labeled; fictional input and fairness limitations visible.

## File Structure
- `src/allocation/allocation.ts`: validation, integer algorithm, export.
- `src/allocation/AllocationApp.tsx`, `allocation.css`: active UI.
- `src/main.tsx`: active entry; earlier app modules preserved.
- `scope.md`, `prd.md`, `spec.md`: current canonical plan.
- `devpost/`: previous AI iteration preserved, plus explicit current process revision.
- `tests/allocation.test.ts`: algorithm, boundaries and export invariants.
- `submission/`: current recording/script, publication and verification evidence.

## Important Failure Modes
Invalid input → show validation message and disable export. Edited result → stale warning and disabled export. Browser download unavailable → show export failure and allow retry; no success claim without creating download. Refresh loses session → disclosed next to form.

## Tests
Node test runner with existing `tsx`: targeted examples, invalid boundaries, deterministic randomized conservation/zero-score tests, before/after export. Browser smoke checks verify edits, stale export, error recovery, comparison and downloaded JSON. Clean-directory clone/install/build/run verifies README reproducibility.

## Decisions and Open Issues
The genuine risk is exact rounding plus freshness: BigInt integer arithmetic and immutable snapshots address it and are testable. No new learner uncertainty or reflection is invented. Prior source provenance is evidenced by empty-project initialization and existing independent project history, but historical absence of copying cannot be proven by a current scan alone. Current new implementation uses no private-project source. Video hosting, personal eligibility/legal checkboxes and survey remain shipping checks until directly verified.
