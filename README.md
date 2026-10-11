# ContriPact — Build With AI POC

**Reward contribution. Protect the team.**

ContriPact is a small AI-assisted contribution-governance proof of concept for competition teams. It does **not** claim that AI can discover an objectively fair split. Instead, it makes one narrow loop inspectable:

**competition rules → contribution relevance → reward proposal → contestable objection → team agreement**

This repository is an independently built competition POC. It uses one prepared four-person case and a ¥12,000 prize pool so the reasoning path can be demonstrated clearly without adding authentication, a production database, or document ingestion.

## What the demo proves

- **Before Project:** extract judging criteria and map planned tasks to the criteria they are expected to influence. No money split appears before work exists.
- **After Project:** show raw contribution evidence separately from AI interpretation, then produce a traceable reward proposal.
- **Reason check:** a member can challenge the proposal. The AI must connect the objection to a visible judging criterion and evidence, or explicitly say that no such connection exists.
- **Human authority:** the closing state distinguishes **AI recommended** from **team accepted**.

`High / Medium / Supporting` labels describe the competitive relevance of a **task or contribution bundle**, never the worth of a person.

## Stack

- React 19 + TypeScript + Vite 8
- Express 5 + Zod 4
- Ollama local API
- Spark-X2.5-4B Q4_K_M behind a provider boundary
- Process-memory cache for **successfully validated** AI results only

The browser never talks directly to Ollama. Vite proxies `/api/*` to the local Express analysis boundary, where structured model output is validated before React can display it.

## Requirements

- **Node.js 24 LTS** (`.nvmrc` is included)
- npm
- Ollama >= 0.34.1
- Spark-X2.5-4B Q4_K_M available in Ollama under the default alias:

```text
contripact-spark-x2.5-4b-q4
```

The model artifact used during development came from the official model repository:

```text
https://huggingface.co/XHToken/Spark-X2.5-4B-GGUF
```

This repository does not contain the GGUF model binary or any machine-specific model path. If you create the Ollama alias manually, point a local Modelfile at **your own** downloaded GGUF path, then run:

```bash
ollama create contripact-spark-x2.5-4b-q4 -f Modelfile
```

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

The Express API runs on `http://127.0.0.1:8787` by default.

Optional environment variables are documented in `.env.example`.

## Warm the real AI path before recording

For a smooth short demo, keep the same server process running and execute:

```bash
npm run warm
```

This performs the real **Rules → Before → After → prepared O2 objection** path. Only validated successful results enter the in-memory cache. If the cache is cold, these are real model calls; if it is already warm, the script reports cache hits.

To deliberately bypass the cache during development:

```bash
npm run warm -- --force
```

Server restart clears the cache. There is no disk-persisted or seeded “successful AI result” fallback.

## Demo path

1. Enter the prepared case.
2. Run **Before Project** analysis and inspect the rules-to-task map.
3. Mark the map as the team's planning reference.
4. Switch to **After Project** and inspect raw A1–D2 evidence.
5. Run the contribution analysis and see the validated ¥12,000 proposal.
6. Check the prepared O2 objection: the point is supported by `Presentation` + `D1`, but the proposal stays because the current After assessment already recognized that contribution.
7. The team accepts the current proposal.

The UI is English-first and can switch to Chinese without creating a second project state or re-running the AI.

## Failure behavior

If Ollama is stopped, the model alias is missing, the call times out, or structured output fails validation:

- original rules/evidence stay visible;
- the affected AI result is cleared;
- the UI shows **Analysis unavailable** and a retry action;
- no seeded or prewritten AI-looking result is substituted.

## Validation evidence

The product contract uses `num_ctx=8192`, `think=false`, `temperature=0`, `seed=42`, and schema-constrained output. The build checks exact rubric extraction, evidence ownership, criterion links, 100% share totals, and objection cross-field consistency before results can be displayed.

After the shipping rubric correction, Spark completed **3/3 full repeated post-correction gates** against the official four-item equal-weight case. Rules, Before, After, and Objection structured outputs were exactly identical across all three runs. The stable proposal was **B 35% / A 30% / C 20% / D 15%**, and prepared O2 consistently returned `Presentation` + `D1`, `supported`, `changes=false`, `keep`.

A clean product server was then warmed through the real API path: the first Rules → Before → After → O2 pass used live inference, and the second identical pass hit validated in-memory cache at all four stages. Cold local inference latency varied substantially, so the cache is used for demo smoothness—not as a fake result fallback.

See `devpost/model-gate/GATE_REPORT.md` and `devpost/model-gate/stability-final/stability-summary.json` for the current evidence. The older `stability-provisional-rubric/` runs are historical only. This fixed POC is not a claim that a 4B model is ready to adjudicate arbitrary real-world compensation disputes.

## Build With AI: Basics submission facts

For the current hackathon, the technical delivery package requires a **1–3 minute demo video** that visibly shows the proof of concept working and a **public source repository URL**. The submission also asks for a short learner-written description and required form questions. This repository contains the planning artifacts (`scope.md`, `prd.md`, `spec.md`) required to demonstrate use of the Devpost Learn skill pack.

## Project boundary

Deliberately not included in this POC: authentication, production persistence, live team invitations, real-time collaboration, arbitrary document upload/OCR, continuous contribution tracking, multiple dispute rounds, or a claim of AI-determined fairness.
