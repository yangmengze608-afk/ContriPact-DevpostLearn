---
doc: prd
status: approved
---

# ContriPact — Product Requirements

A compact AI-assisted contribution-governance experience for competition teams that need to agree on what work matters most and how shared rewards should reflect contribution, without forcing teammates to personally argue over status or worth.

Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > The POC Boundary`.

## The Core Journey

1. The user lands on a commercial ContriPact homepage with a black-and-white ink-wash visual identity. The default language is English, with a visible Chinese toggle. The page leads with a stronger tension: contribution should shape reward, while trust and cohesion hold a team together. When rewarding impact starts to threaten that trust, ContriPact helps turn awkward personal judgments into shared, evidence-backed decisions.
2. The primary entry takes the user directly into one prepared four-person competition case with a ¥12,000 prize pool.
3. The workspace shows two modes for the same case: **Before Project** and **After Project**.
4. In **Before Project**, the system shows the prepared competition brief and judging criteria, highlights which criteria matter most, maps planned team tasks to those criteria, and identifies likely high-value contribution points with reasons.
5. The team can review that contribution map and mark it as agreed. The purpose is to establish a shared reference before work begins, not to lock a final money split.
6. In **After Project**, the system shows the same competition rules together with prepared contribution/evidence records for all four members.
7. AI assesses each contribution against the competition criteria and the agreed contribution map, highlights the strongest contribution points, and explains why those points matter to the competition outcome.
8. The system proposes a contribution-based split of the ¥12,000 prize and links each member's recommendation to visible reasons and evidence.
9. One member raises an objection with a short reason. The system checks whether the objection is materially connected to the rules, contribution evidence, or the previously agreed contribution map.
10. The system either revises the recommendation or explains why it is keeping the original assessment.
11. The team reaches a final accepted state. The closing message reinforces that AI evaluated contribution relevance and reasons, while the team retained final authority over the agreement.

## Screens and Layout

### 1. Commercial Landing Page
Source: `scope.md > Inspiration & Identity`, learner design direction.

- Full-screen commercial hero, not an admin dashboard.
- Black, white, warm off-white, and ink-wash textures.
- Mouse movement creates a restrained ripple / spreading-ink response in the hero background.
- The interaction is artistic but brief: the value proposition and primary entry are visible immediately without making the user wait through an animation.
- The hero frames the tension positively rather than as a complaint: contribution is a team's engine for progress; trust and cohesion are what let a team keep moving together.
- Core English headline: **Reward contribution. Protect the team.**
- Supporting English copy: **Contribution fuels progress. Trust holds a team together. When rewarding impact starts to threaten that trust, ContriPact turns awkward personal judgments into shared, evidence-backed decisions.**
- Chinese equivalent: **让贡献值得回报，也让关系不必为此受伤。贡献推动团队向上，信任让团队凝聚。当按贡献分配与维护关系发生张力时，ContriPact 用规则、证据和 AI 辅助判断，把难说出口的话变成团队可以共同确认的决定。**
- One primary action enters the prepared ContriPact case.
- Language control is visible in the hero: English is the default for judging; Chinese is available without changing the product flow.

### 2. Contribution Governance Workspace
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

A single focused workspace carries the full demo. It uses the visual language of the existing ContriPact product—serif/Song-style headings, restrained monochrome cards, evidence-oriented labels, clear phase context—but not the existing production account/navigation complexity.

The workspace contains:
- competition context and ¥12,000 reward pool;
- **Before Project / After Project** mode switch;
- rule and judging-criteria panel;
- contribution-value analysis area;
- member-level reasoning and evidence;
- reward recommendation area in After mode;
- objection / reason-check panel;
- final agreement state.

## Look and Feel

- Preserve the existing ContriPact identity: **black + white + ink-wash + modern SaaS**.
- Homepage should feel more commercial and artistic than the current internal project dashboard.
- Mouse ripple / ink diffusion is a signature interaction, but it must not obscure text, delay entry, or look like a game effect.
- Workspace should feel calm, precise, evidence-oriented, and socially neutral.
- Typography: editorial/serif character for major statements; clean sans-serif for data, labels, and controls.
- Avoid generic neon AI styling, excessive gradients, finance-terminal aesthetics, or cartoon fairness metaphors.
- Product UI is bilingual: English-first by default, with Chinese available through a clear language toggle. Do not place two full languages side-by-side on every component; preserve visual calm.

## Features and Behavior

### Commercial Entry
Source: `scope.md > Inspiration & Identity`.

The landing page communicates three ideas before the user enters the case:
- rewarding contribution and preserving team cohesion are both legitimate goals, and tension appears when teams feel forced to sacrifice one for the other;
- ContriPact reads the competition rules and connects them to real work, so contribution can be discussed through shared criteria rather than personal confrontation;
- AI gives an explainable recommendation, but the team still agrees.

The landing experience is bilingual. English is the default because the competition submission environment is English-first; Chinese can be switched on for the same content and flow.

Acceptance criteria:
- [ ] A reviewer can identify what problem ContriPact solves without scrolling through a long marketing page.
- [ ] The primary action reaches the prepared demo case immediately.
- [ ] Ripple / ink interaction responds to pointer movement without blocking the primary action or text.
- [ ] English is the default language and the Chinese version of the same product content is reachable through a visible language control.
- [ ] Switching language does not change the demo state or restart the flow.

### Competition Rule Analysis
Source: `scope.md > The Unique Kernel`.

The workspace displays a prepared competition brief and extracts a small set of judging criteria. Each criterion includes:
- criterion name;
- relative importance / relevance indicator;
- short plain-language explanation of why it can affect the competition result.

Acceptance criteria:
- [ ] The displayed criteria visibly originate from the competition brief.
- [ ] The user can see at least one reason why a criterion matters before any contribution is assessed.

### Before-Project Contribution Planning
Source: `scope.md > The Core Loop > Before-project mode`.

The system maps prepared planned tasks to the competition criteria and identifies likely high-value work before the project starts.

For each planned task, show:
- task / responsibility;
- linked judging criterion or criteria;
- expected contribution value (for example High / Medium / Supporting);
- short reason grounded in the rules.

The team can confirm that this contribution map is an agreed planning reference.

Acceptance criteria:
- [ ] At least one task is clearly identified as high-value for a reason tied to judging criteria.
- [ ] The user can distinguish high-value work from supporting work without seeing a money split yet.
- [ ] The team can mark the proposed map as agreed.

### After-Project Contribution Evaluation
Source: `scope.md > The Core Loop > After-project mode`.

The same case switches to actual contribution records. For each member, the system shows:
- major contribution(s);
- evidence / output summary;
- linked competition criteria;
- assessed contribution value;
- explanation of why the contribution was or was not especially important to the outcome.

Acceptance criteria:
- [ ] Each member assessment cites visible rule/evidence context rather than only a score.
- [ ] A reviewer can tell why two members with different work receive different contribution assessments.

### Reward Recommendation
Source: `scope.md > What "Working" Looks Like`.

The system proposes a split of the ¥12,000 prize after contribution evaluation.

For each member, show:
- recommended percentage;
- recommended amount;
- short explanation connected to contribution value;
- visible distinction between evidence and AI interpretation.

The recommendation is explicitly labeled as a proposal for team agreement, not an objective fairness verdict.

Acceptance criteria:
- [ ] Percentages sum to 100% and amounts sum to ¥12,000.
- [ ] Each recommendation is traceable to displayed contribution reasoning.
- [ ] Copy does not claim the AI has discovered objectively fair shares.

### Objection and Reason Check
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop > After-project mode`.

A member can challenge the recommendation with one concise reason.

The system checks whether the objection materially references:
- competition rules / judging criteria;
- actual contribution evidence;
- the previously agreed contribution map.

The result must include:
- whether the objection is materially supported, partially supported, or not supported by the displayed context;
- the specific rule/evidence connection used in that judgment;
- either a revised recommendation or an explanation for keeping the current recommendation.

Acceptance criteria:
- [ ] The objection cannot be dismissed with a bare "AI disagrees" message.
- [ ] The reason check cites visible rules/evidence.
- [ ] The recommendation changes only when the explanation says the objection changes the contribution assessment.

### Final Agreement
Source: `scope.md > The Core Loop`.

The user can confirm the current proposal as the team's accepted outcome. The final state shows:
- final allocation;
- that the contribution reasoning has been reviewed;
- that the team, not the AI, accepted the outcome.

Acceptance criteria:
- [ ] The final screen clearly distinguishes AI recommendation from human agreement.
- [ ] The accepted state is obvious enough to close a 60-second demo.

## States and Boundaries

- **Landing** — commercial hero and direct entry into the prepared case.
- **Before analysis** — competition criteria and planned-task contribution map visible; no reward split shown.
- **Before agreed** — planning contribution map visibly marked as accepted reference.
- **After analysis** — contribution evidence, AI contribution judgments, and reward recommendation visible.
- **Objection open** — one member reason is shown and awaiting / displaying the reason check.
- **Recommendation revised or defended** — the product explains what changed or why nothing changed.
- **Final accepted** — the team has accepted the current recommendation.
- **Analysis unavailable** — if AI analysis cannot be produced, keep the raw prepared rules/evidence visible and do not show a fabricated recommendation.

No account state, project persistence, invite state, or multi-browser collaboration state is required in this POC.

## Product Decisions

- Reuse the existing ContriPact visual/governance identity, but not its full production workflow or source code.
- The primary framing is the tension between two positive team values: rewarding meaningful contribution and preserving trust/cohesion. ContriPact exists so teams do not have to sacrifice one to protect the other.
- The same case has both Before and After modes so the reviewer can understand proactive planning and retrospective assessment in one demo.
- AI evaluates **contribution relevance to competition outcomes**, not moral worth or objective fairness.
- Competition rules and visible evidence are the primary basis for AI reasoning.
- Before mode produces a contribution map, not a predetermined reward split.
- After mode may produce a reward recommendation because actual contribution evidence exists.
- One objection is enough for the POC; the goal is to demonstrate contestability, not a complete dispute-resolution engine.
- Final authority remains with the team.
- The POC is bilingual, English-first with a Chinese toggle, because the competition requires English-language submission materials while the product should remain reusable for Chinese-speaking teams.

## What We're Building

- Bilingual commercial ink-wash landing page with subtle pointer ripple interaction and an English/中文 language toggle.
- One prepared four-member competition scenario.
- Prepared competition rules and judging criteria.
- Before / After mode switch.
- Before-mode task-to-criterion contribution planning.
- After-mode evidence-to-contribution assessment.
- Explainable ¥12,000 reward recommendation.
- One objection reason check.
- Revised/defended recommendation behavior.
- Final accepted state.
- A flow that can be shown clearly in a 1–3 minute competition video and understood in roughly 60 seconds.

## Deferred From the POC

- Authentication, real user accounts, project creation, invitations, and role enforcement.
- Supabase / production database persistence.
- Real-time multi-user collaboration.
- Full peer-review workflow and anonymous review ledger.
- Arbitrary competition-document upload and OCR/parser pipeline.
- Continuous contribution logging during the project.
- GitHub/Figma/Docs evidence connectors.
- Multiple objections, mediation rounds, and full audit history.
- Configurable allocation-policy presets and physical-prize matching.

These remain part of the broader ContriPact product, but they do not strengthen the specific Build With AI proof enough to justify their cost here.

## Possible Later Enhancements

- Upload an arbitrary competition brief and generate the contribution map from it.
- Connect actual project evidence sources and continuously update contribution signals.
- Compare the pre-project contribution map with actual post-project contribution patterns.
- Let multiple team members independently submit objections and reach a consent-based final lock.
- Evaluate model consistency and bias across different contribution types.

## Non-Goals

- Rebuilding the full existing ContriPact production app.
- Claiming that AI can objectively determine fairness.
- Ranking people as inherently more valuable than others.
- Hiding the rules or evidence behind a single opaque score.
- Building production-grade collaboration infrastructure for this hackathon POC.

## Open Questions

No product-defining questions currently block the technical specification. Exact model choice, whether the prepared rule analysis is precomputed or generated live, and the simplest implementation of the ripple interaction belong in `4-spec` because they affect implementation rather than product behavior.
