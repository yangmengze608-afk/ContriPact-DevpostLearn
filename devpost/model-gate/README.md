# Spark-X2.5 feasibility gate for ContriPact

This is a technical investigation for `4-spec`, not product build code.

## Goal
Test whether Spark-X2.5-4B Q4_K_M is good enough for the four live-AI responsibilities in the POC:
1. competition-rule extraction;
2. Before-project planned-task relevance mapping;
3. After-project evidence-level contribution relevance evaluation;
4. objection reason checking.

The app's money arithmetic, Before/After UI state, language state, and final accept state remain deterministic frontend behavior.

## Model
- Source: `XHToken/Spark-X2.5-4B-GGUF`, Q4_K_M.
- Runtime: Ollama 0.40.1 on Apple Silicon.
- Context for first gate: 8192 tokens.
- Product-test sampling: temperature 0, seed 42, top_p 0.9 to prioritize repeatable structured output over benchmark creativity.

## Pass logic
Each test must:
- return valid schema-constrained JSON;
- cite only displayed criteria/evidence;
- avoid invented criteria/evidence;
- satisfy task-specific correctness checks.

A single run is the first feasibility screen. Before shipping, repeat the full gate at least 3 times to measure structured-output stability.

## Commands
```bash
ollama create contripact-spark-x2.5-4b-q4 -f devpost/model-gate/Modelfile
python3 devpost/model-gate/run_gate.py
```

### Interpretation boundary
`High / Medium / Supporting` labels apply to work/evidence items, not to people. Member-level reward percentages remain proposals and are never presented as objective fairness.

## Shipping audit note

The previously committed three-run evidence was moved to `stability-provisional-rubric/` after the prepared Build With AI judging rubric was corrected during shipping. The corrected official-rubric contract has now completed a fresh 3/3 repeated gate with exact structured-output equality across Rules, Before, After, and Objection. Current evidence is in `stability-final/` and summarized in `GATE_REPORT.md`.
