---
doc: spec
status: approved
---

# ContriPact — Build With AI Technical Spec

## How This Works, In Plain Language

ContriPact is one prepared four-person competition case running as a small local web app. The browser owns the visible flow; a tiny local server is the boundary around AI calls.

The browser always knows the facts we prepared: the competition brief, the four members, their planned tasks, their evidence, and the ¥12,000 reward pool. It never asks AI to invent those facts. When analysis is needed, the server sends only the relevant rules/evidence to the model and requires a narrow JSON response. The server validates that response before the browser can display it.

The AI does three kinds of judgment:
1. extract what the competition actually rewards;
2. connect planned or completed work to those criteria and propose a contribution-based allocation after the project;
3. check whether one objection is materially supported by the displayed rules/evidence.

Everything that does not require judgment stays deterministic: language switching, Before/After navigation, reward amount arithmetic, final accept state, and display of raw evidence. If AI fails, ContriPact shows the source material and an **Analysis unavailable** state; it does not substitute fabricated analysis.

For this POC, `High / Medium / Supporting` describes the relevance of a **task or contribution bundle**, never the value of a person.

This shape is intentionally smaller than the production ContriPact product. It proves the kernel—**competition rules → contribution value → reward recommendation → contestable objection**—without authentication, a database, or realtime collaboration.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. The reviewer opens the landing page. React renders the English commercial hero first; the language toggle swaps copy in place without resetting demo state.
2. **Enter Demo Case** loads one local prepared case and opens the governance workspace.
3. In **Before Project**, the UI displays the original competition brief. The server asks the AI for structured rule extraction, validates it, then maps prepared planned tasks to those exact criteria. No money split is shown.
4. The user marks that contribution map as the team's agreed planning reference. This is local UI state only.
5. Switching to **After Project** reveals prepared member evidence. The server asks the AI to assess the strongest contribution bundle for each member against the already-visible criteria and to return a contestable reward-share proposal.
6. The server rejects outputs that cite unknown criteria/evidence or whose percentages do not sum to 100. The browser converts valid percentages to exact CNY amounts from ¥12,000.
7. One prepared member objection is sent as a single objection check. The model must point to one displayed criterion (or `NONE`) and supporting evidence IDs, then say whether the contribution assessment actually changes.
8. The UI either explains why the proposal is defended or, if a future test case returns a genuine change, requests re-analysis before presenting a revised proposal. The fixed POC only needs one demonstrated objection path.
9. The user accepts the current proposal. The final screen states that AI evaluated contribution relevance while the team retained final authority.

## Architecture Decision Summary

```text
┌──────────────────────────────── React + Vite browser ────────────────────────────────┐
│ Landing / language / Before-After / evidence / proposal / objection / final accept  │
└──────────────────────────────────────┬────────────────────────────────────────────────┘
                                       │ JSON over localhost
                                       ▼
┌──────────────────────────── Express analysis boundary ───────────────────────────────┐
│ Route → input schema → prompt → AI Provider → output schema → product validation     │
│                              │                                                       │
│                              └── Spark-X2.5 local through Ollama                     │
└──────────────────────────────────────┬────────────────────────────────────────────────┘
                                       │
                                       ▼
                             Prepared scenario data
                      rules / tasks / evidence / ¥12,000
```

The provider boundary is deliberately separate from product logic. The POC can replace the model later without changing the React flow or governance semantics.

## Stack

### Browser
- **React 19.3 + TypeScript** — familiar to the learner, enough for the stateful single-workspace demo without adding a full-stack framework. Docs: https://react.dev/
- **Vite 8.x** — small, fast local build/dev surface; no deployment framework is required for the competition video. Docs: https://vite.dev/
- **Plain CSS / CSS modules** — the ink-wash identity is custom enough that a component styling framework would add more defaults to undo than value.
- **No external state library** — React reducer/context is enough for one prepared case and a short finite flow.
- **No i18n library** — an English/Chinese typed copy dictionary is sufficient for the fixed POC and guarantees language changes do not reset product state.

### Local server
- **Node.js 24 LTS** — reproducible supported baseline. The learner's current Node 25.9.0 installation is EOL and should not define the public project baseline. Docs: https://nodejs.org/
- **Express 5.x** — minimal JSON API boundary around model calls. Docs: https://expressjs.com/
- **Zod 4.x** — validates request shapes and model output before product state can consume them. Docs: https://zod.dev/
- **Native `fetch`** — enough for Ollama HTTP calls; no AI SDK is needed.

### AI runtime
- **Ollama >= 0.34.1** with an 8K runtime context for the POC. The learner currently has Ollama 0.40.1. Docs: https://docs.ollama.com/
- **Default provider: Spark-X2.5-4B Q4_K_M** (`XHToken/Spark-X2.5-4B-GGUF`), running locally. The downloaded gate artifact is 2,600,224,352 bytes with SHA-256 `adfcfa19a4ed6a5985da8bf565fe15f8e1a7e131d79bae2d19d48d1c40109428`.
- Runtime product settings tested first: `num_ctx=8192`, `temperature=0`, fixed `seed=42`, `top_p=0.9`, `think=false`, and task-specific output-token caps. These are product-repeatability settings, not benchmark settings.
- The provider interface remains model-neutral. A cloud implementation is deferred outside this POC. The corrected official-rubric Spark gate passed 3/3 repeated runs, so the critical path remains local-only and no unused paid fallback service is added.

## Where It Runs and How Someone Tries It

The judged POC runs locally on macOS for the required demo recording. A public GitHub repository and short demo video are submission artifacts; a live hosted URL is optional and is not required to prove this local-model architecture.

Public repository: `https://github.com/yangmengze608-afk/ContriPact-DevpostLearn`

### Expected environment
- Node.js 24 LTS
- npm
- Ollama >= 0.34.1
- Spark-X2.5-4B Q4_K_M available in Ollama

For the learner's current machine, the model alias is:

```bash
contripact-spark-x2.5-4b-q4
```

The public README should prefer the official model source rather than the learner's absolute KIOXIA path. The local `devpost/model-gate/Modelfile` is a development artifact for this machine and is not the portable installer.

### Start the POC

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

`npm run dev` starts both Vite and the Express server. Vite proxies `/api/*` to the local server so the browser never talks directly to Ollama.

### Demo recording path
1. Start Ollama and the app.
2. Run one real analysis pass before recording and keep the same server process alive; successful analysis may remain in an in-memory cache keyed by scenario + operation + input hash.
3. Record the polished 1–3 minute flow using those real generated results. A `force=true` development request can re-run live inference for verification.
4. Never commit a fake “successful” result as a fallback. If there is no validated analysis in memory, the UI must show **Analysis unavailable**.

This preserves a real AI kernel without making the reviewer watch local 4B inference latency during a 60-second value demonstration.

## Look and Feel

Implements `prd.md > Look and Feel` and `prd.md > Commercial Entry`.

- Palette: black, white, warm off-white, soft ink greys; restrained accents only when state meaning requires them.
- Major statements: editorial serif / Song-style character. Data, labels, evidence IDs, and controls: clean sans-serif.
- Landing page: spacious, commercial, artistic. A lightweight canvas or CSS pointer field produces a brief ink/ripple response behind content; it must be pointer-events-none and must not delay the CTA.
- Workspace: denser but calm. The visual hierarchy should make **rule → contribution → recommendation** inspectable left-to-right or top-to-bottom.
- AI copy uses neutral terms such as “relevance,” “evidence,” “proposal,” “supported,” and “team accepted.” It must not say the model “found the fair answer.”
- English is default. Chinese swaps the same semantic copy through one language state; do not duplicate both languages side-by-side.

## Components

### Commercial Landing
Implements `prd.md > Commercial Entry`.

`LandingPage` renders the approved headline/copy, language control, ink interaction, and one primary CTA. It has no model dependency.

### Demo Case Loader and Flow State
Implements `prd.md > States and Boundaries`.

`DemoCaseProvider` loads one immutable prepared scenario. A reducer stores only ephemeral interaction state:
- language;
- current screen / phase;
- Before map agreed or not;
- validated rule analysis;
- validated contribution analysis;
- current objection result;
- final accepted flag;
- per-analysis loading/error state.

Refreshing the browser may reset the flow; persistence is explicitly outside the POC.

### Competition Rule Analysis
Implements `prd.md > Competition Rule Analysis`.

The server sends the prepared brief to the provider. The provider must return:
- exact criterion name;
- integer weight;
- short reason;
- a short exact quote from the displayed brief.

The server checks that weights sum to 100 and quotes actually occur in the source brief. **Relative importance labels are derived deterministically from numeric weights in the UI rather than asked from the model.** For the current prepared Build With AI: Basics case, all four official criteria are equally weighted at 25%.

### Before-Project Contribution Planning
Implements `prd.md > Before-Project Contribution Planning`.

The same provider boundary receives the validated criteria plus prepared planned tasks. For each task it returns:
- task ID;
- one or more exact criterion names;
- `High | Medium | Supporting` contribution relevance;
- concise rule-grounded reason.

The labels describe the work item's expected competitive relevance, never a teammate's personal value. The team can then mark the full map agreed. No reward calculation exists in this phase.

### After-Project Contribution Evaluation
Implements `prd.md > After-Project Contribution Evaluation`.

The provider receives validated criteria plus each member's prepared evidence. For each member it returns one strongest contribution bundle:
- member ID;
- one or more evidence IDs owned by that member;
- one or more exact criterion names;
- `High | Medium | Supporting` relevance of that cited work bundle;
- concise reason;
- suggested reward-share percentage.

The JSON schema restricts criterion values to the actual extracted criteria and evidence IDs to the actual scenario IDs. Product validation additionally checks that an evidence ID belongs to the member it is used to justify.

The UI always renders raw evidence separately from AI interpretation.

### Reward Recommendation
Implements `prd.md > Reward Recommendation`.

The server accepts a recommendation only if:
- all four expected members are present exactly once;
- each member cites valid owned evidence;
- criterion links are valid;
- integer percentages sum to 100.

The browser computes each amount deterministically:

```text
amountCny = 12000 × suggestedSharePercent / 100
```

Because the POC uses integer percentages and ¥12,000, the amounts are exact multiples of ¥120 and sum exactly to ¥12,000.

Copy labels the result **AI-assisted contribution proposal — requires team agreement**.

### Objection and Reason Check
Implements `prd.md > Objection and Reason Check`.

One objection is evaluated per AI call. This mirrors the actual POC interaction and is more reliable than asking a 4B model to batch several independent disputes in one response.

The validated response contains:
- objection ID;
- `supported | partially_supported | unsupported`;
- one strongest exact criterion connection or the sentinel `NONE`;
- zero or more exact evidence IDs;
- whether the underlying contribution assessment changes;
- `keep | revise` action;
- concise reason.

Cross-field product rules:
- `unsupported` ⇒ criterion is `NONE`, no evidence IDs, no contribution change, action `keep`;
- `supported/partially_supported` ⇒ must cite a real criterion and relevant evidence when evidence exists;
- `changes_contribution_assessment=false` ⇒ `keep`;
- `changes_contribution_assessment=true` ⇒ `revise`, and the server must obtain a fresh validated contribution recommendation before displaying changed money.

The prepared demo objection may legitimately be supported as relevant while still leaving the allocation unchanged; relevance and remedy are separate questions. The objection call receives the current validated After assessment, not a separate static baseline.

### Final Agreement
Implements `prd.md > Final Agreement`.

`FinalAgreement` shows the current validated allocation and the key reviewed reasoning, then records a local `accepted=true` state when the user confirms it. The closing copy explicitly says the team accepted the outcome; the AI only supplied analysis and a proposal.

### Analysis-Unavailable Boundary
Implements `prd.md > States and Boundaries > Analysis unavailable`.

Every AI surface has the same failure contract:
- preserve the raw prepared rules/evidence on screen;
- clear any unvalidated model result for that operation;
- display a short **Analysis unavailable** explanation and retry control;
- do not replace the failure with seeded “AI-looking” prose.

### AI Provider Boundary
Supports all AI-backed PRD behaviors without binding product code to one model.

```ts
interface ContributionAIProvider {
  analyzeRules(input: RulesInput): Promise<RulesAnalysis>;
  analyzeBefore(input: BeforeInput): Promise<BeforeAnalysis>;
  analyzeAfter(input: AfterInput): Promise<AfterAnalysis>;
  checkObjection(input: ObjectionInput): Promise<ObjectionCheck>;
}
```

`OllamaSparkProvider` is the initial implementation. Routes do not know model-specific prompt syntax; the provider does not know React state.

### Analysis Cache
A process-memory `Map` caches only **successfully validated** AI responses by a hash of operation + scenario version + exact input. It exists to make the fixed-scenario demo smooth after a genuine local inference pass.

- no disk persistence;
- no cache entry for invalid/error responses;
- development `force=true` bypasses the cache;
- server restart clears it.

This is a demo-performance aid, not a fake fallback.

## Data Model

### Prepared scenario
Stored in `src/data/demo-case.json` or a typed TS export and committed to the repository.

```ts
type DemoCase = {
  id: string;
  version: string;
  prizePoolCny: 12000;
  competitionBrief: string;
  plannedTasks: PlannedTask[];
  members: Member[];
  evidence: EvidenceItem[];
  preparedObjection: Objection;
};
```

It is immutable during the POC.

### Browser flow state
Lives in React memory. Language may additionally be mirrored to `localStorage` for convenience, but changing language never creates a second project state.

### AI analysis
Lives in React memory after server validation. The server may also hold the same validated response in process memory for the current run.

### Final agreement
A boolean and current proposal in React memory only. Refresh may reset it. There is no audit database in this POC.

## AI Request and Response Contracts

### Ollama endpoint

```text
POST http://127.0.0.1:11434/api/chat
Content-Type: application/json
```

Core payload shape:

```json
{
  "model": "contripact-spark-x2.5-4b-q4",
  "messages": ["system + one task-specific user message"],
  "stream": false,
  "think": false,
  "format": "task-specific JSON Schema",
  "options": {
    "num_ctx": 8192,
    "temperature": 0,
    "seed": 42,
    "top_p": 0.9,
    "num_predict": "task-specific cap"
  }
}
```

The build should generate the schema enums from the current scenario whenever possible. If the only legal criterion names are the four extracted criteria, the model should be structurally unable to return punctuation or a made-up fifth criterion in a criterion field.

### Server routes

```text
POST /api/analyze/rules
POST /api/analyze/before
POST /api/analyze/after
POST /api/analyze/objection
```

Each request includes `scenarioId`, `scenarioVersion`, and only the source facts needed for that operation. The server re-loads canonical prepared data instead of trusting browser-supplied evidence text when practical.

Responses use:

```ts
type AnalysisEnvelope<T> =
  | { ok: true; data: T; cached: boolean }
  | { ok: false; error: "MODEL_UNAVAILABLE" | "INVALID_MODEL_OUTPUT" | "TIMEOUT" };
```

No chain-of-thought is requested, stored, or displayed. The user sees concise evidence-grounded reasons only.

## File Structure

```text
ContriPact-DevpostLearn/
├── src/
│   ├── app/
│   │   ├── App.tsx                 # landing → workspace → final flow
│   │   └── demoReducer.ts          # finite local interaction state
│   ├── components/
│   │   ├── landing/
│   │   │   ├── LandingPage.tsx
│   │   │   └── InkField.tsx        # restrained pointer ripple / ink response
│   │   ├── workspace/
│   │   │   ├── Workspace.tsx
│   │   │   ├── ModeSwitch.tsx
│   │   │   ├── RulePanel.tsx
│   │   │   ├── BeforeMap.tsx
│   │   │   ├── MemberEvidence.tsx
│   │   │   ├── RewardProposal.tsx
│   │   │   ├── ObjectionPanel.tsx
│   │   │   └── FinalAgreement.tsx
│   │   └── common/
│   │       └── AnalysisState.tsx    # loading / unavailable / retry
│   ├── data/
│   │   └── demoCase.ts              # canonical prepared four-person scenario
│   ├── i18n/
│   │   └── copy.ts                  # English default + Chinese equivalent
│   ├── lib/
│   │   ├── api.ts                   # typed calls to local Express server
│   │   └── money.ts                 # deterministic ¥12,000 arithmetic
│   └── styles/
│       ├── tokens.css
│       ├── landing.css
│       └── workspace.css
├── server/
│   ├── index.ts                     # Express startup and Vite-facing API
│   ├── routes/
│   │   └── analysis.ts              # four narrow analysis routes
│   ├── ai/
│   │   ├── provider.ts              # provider-neutral interface
│   │   ├── ollamaSpark.ts           # Ollama /api/chat implementation
│   │   ├── prompts.ts               # narrow prompts, no UI copy
│   │   ├── schemas.ts               # Zod + JSON Schema contracts
│   │   └── validate.ts              # cross-field / traceability checks
│   └── cache/
│       └── analysisCache.ts          # validated in-memory results only
├── devpost/
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   ├── spec.md
│   ├── spec.html
│   ├── model-gate/
│   │   ├── README.md
│   │   ├── scenario.json
│   │   ├── run_gate.py
│   │   └── stability-final/         # final four-stage repeated-run evidence
│   └── zh-CN/
│       ├── scope.md
│       ├── prd.md
│       └── spec.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md
```

Generated `node_modules/`, local environment files, model binaries, and machine-specific KIOXIA paths are never committed.

## External Services and Dependencies

### Ollama local API
- Purpose: run the default local Spark provider.
- Endpoint: `POST /api/chat` on `127.0.0.1:11434`.
- Authentication: none on the local default binding.
- Cost: no per-call API cost; inference uses local hardware.
- Docs: https://docs.ollama.com/api/chat
- Failure consequence: AI surfaces become unavailable; raw facts remain visible.

### Spark-X2.5-4B GGUF
- Purpose: local contribution-relevance reasoning.
- Official model source used for the gate: https://huggingface.co/XHToken/Spark-X2.5-4B-GGUF
- Quantization: Q4_K_M.
- The model registry advertises a much larger context than this POC needs; this build intentionally limits runtime context to 8K for memory/latency discipline.

### No required cloud service
There is no database, authentication provider, analytics product, or paid model API on the POC critical path. The final seeded Spark feasibility gate passed. A cloud provider remains a later portability option, not a POC dependency.

## Important Failure Modes

- **Ollama is stopped or the model alias is missing** → server returns `MODEL_UNAVAILABLE`; UI keeps rules/evidence visible and shows **Analysis unavailable** with retry instructions.
- **The model returns schema-valid but context-invalid data** (unknown/foreign evidence, wrong total share, invalid cross-field objection action) → server returns `INVALID_MODEL_OUTPUT`; nothing is silently normalized into a valid-looking recommendation.
- **Local inference is slow** → UI shows an honest analysis loading state. For the recorded fixed-scenario demo, a genuine validated result may be warmed into process memory before recording; live rerun remains available during development.
- **Ink effect hurts readability or performance** → disable the visual effect while preserving hero layout/copy. The artistic interaction is not allowed to endanger the product kernel.

## What Was Simplified and Why

- **One prepared case** instead of arbitrary uploads — rules-to-contribution reasoning is the kernel; file ingestion is not.
- **Local React state** instead of Supabase/auth — persistence and identity infrastructure would not make the 60-second proof more convincing.
- **One local model implementation behind a provider interface** instead of wiring multiple AI services — model swap remains possible without paying the complexity cost before evidence says it is needed.
- **Numeric rule weight is authoritative; importance badges are derived** instead of asking AI to restate a redundant label — this removes an avoidable inconsistency discovered in the feasibility test.
- **Contribution relevance labels apply to work bundles, not people** — avoids turning an evidence-assessment tool into a person-ranking UI.
- **One objection per model call** instead of batch dispute processing — matches the POC interaction and reduces structured-output failure modes.
- **Validated in-memory cache** instead of persistent precomputed “AI results” — keeps the video smooth while preserving a real inference path and a visible failure state.
- **No production deployment requirement** — local app + public GitHub + recorded demo is enough for this proof; hosting a local LLM would add deployment complexity unrelated to the learning goal.

## Final Model Gate Verification

The model gate is a technical investigation, not product validation. After the shipping audit corrected the prepared case to the official four equally weighted criteria (`Design`, `Potential Impact`, `Innovation/Idea`, `Presentation`), Spark-X2.5-4B completed **3/3 full repeated runs** under the product runtime contract: 8K context, `think=false`, schema enums, one objection per call, `temperature=0`, and fixed `seed=42`.

All four structured stages—Rules, Before, After, and Objection—were exactly equal across the three post-correction runs. The stable After proposal was **B 35% / A 30% / C 20% / D 15%**. Prepared O2 was identical in all runs: `Presentation` + `D1`, supported, no assessment change, keep the current proposal.

Observed cold wall-time ranges were: Rules 12.256–27.893s, Before 26.605–47.651s, After 23.045–60.954s, and the O1/O2/O3 objection batch 24.038–34.524s. Because cold latency varies, the recorded demo may warm the validated in-memory cache using real inference first. A clean product server was verified to return all four stages as `live` on the first warm pass and all four as `cache` on the second pass.

The earlier runs are retained in `model-gate/stability-provisional-rubric/` as development history only. Current evidence is in `model-gate/stability-final/` and `model-gate/GATE_REPORT.md`.

This supports the local model for this **fixed, schema-constrained POC** only. It does not establish that a 4B model is safe or accurate for arbitrary real-world compensation disputes; broader evaluation remains a later product requirement.

## Decisions and Open Issues

### Decisions carried from Scope/PRD
- The POC evaluates **contribution relevance to competition outcomes**, not moral worth or objective fairness.
- Before Project has a contribution map and human agreement, never a predetermined money split.
- After Project can propose money because actual evidence exists.
- Final authority belongs to the team.
- English-first bilingual UI, black/white/ink-wash identity, one prepared case.

### Technical recommendations captured in this draft
- React/Vite browser + tiny Express server, local-first demo.
- Node 24 LTS baseline rather than the learner's EOL Node 25 installation.
- Schema-constrained model outputs plus independent product validation.
- `think=false` for product calls: the UI needs concise evidence-grounded results, not long hidden reasoning generation.
- `temperature=0` + fixed `seed=42` for the governance path: identical inputs should produce reproducible proposals rather than creative variation.
- No AI-generated rule-importance label; derive it from numeric weight.
- Apply relevance labels to contribution bundles, not people.
- One objection per AI call.
- In-memory validated result cache may be warmed before video recording; no fake fallback.

### Genuine uncertainty investigated in `4-spec`
**Question:** Can Spark-X2.5-4B Q4_K_M on a 16GB M3 Mac reliably handle ContriPact's rules → contribution → objection kernel with useful latency and strict traceability?

What clarified it:
- the model was downloaded and run locally through Ollama at 8K context;
- initial tests exposed two interface problems rather than only model problems: redundant importance labels and weakly constrained structured fields;
- the gate was tightened to match the real product contract: `think=false`, task-specific token caps, evidence/criterion enums, contribution-bundle labels, and one objection per call;
- final repeated runs established reproducibility across the complete Rules → Before → After → Objection path.

### Remaining open issues before approval
No technical choice currently blocks the POC blueprint. Spark-X2.5-4B is locked as the default local provider for this fixed scenario based on the final seeded gate. The remaining step in `4-spec` is learner review of this draft—especially the local-first architecture, validated in-memory demo cache, and the boundary that contribution labels describe work rather than people.

