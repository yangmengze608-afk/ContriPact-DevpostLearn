---
doc: scope
status: approved
---

# ContriPact — Build With AI POC

One line: an AI-assisted contribution governance POC that helps small teams agree on what counts as high-value work before a competition, or assess real contribution after it, without forcing teammates to personally argue over who deserves more.

## The Unique Kernel
The core problem is social, not mathematical. In real teams, members often avoid saying “my contribution mattered more” because of face, relationships, politeness, or professional norms. That pressure pushes teams toward equal splits or vague leader judgments even when contributions were meaningfully unequal.

ContriPact introduces AI as a relatively neutral third-party evaluator of **contribution relevance**, not as a moral oracle of fairness. It first reads the competition rules and judging criteria, then connects those criteria to team work.

The product has two moments:
- **Before the project:** AI identifies which tasks are likely to create the highest competitive value, proposes a contribution map, and asks the team to agree on that map before work begins.
- **After the project:** AI reads the rules plus each member’s actual work/evidence, assesses which contributions were most important to the result, explains why, recommends a contribution-based allocation, and asks the team to accept or challenge it.

If someone challenges the assessment, AI performs a basic relevance check on the stated reason: is the objection connected to the competition rules, actual evidence, or an agreed contribution criterion? The final decision still requires human agreement.

## Who It's For
A small hackathon, competition, research, club, or side-project team that expects to share prize money or another divisible reward.

The immediate POC persona is a four-person competition team. They want contribution to matter, but do not want teammates to damage relationships by directly arguing about who was “more important.”

## The Core Loop
### Before-project mode
1. The team loads a prepared competition brief and judging criteria.
2. AI extracts the criteria that are most likely to drive the final result.
3. AI maps planned tasks to those criteria and highlights likely high-contribution work.
4. The team reviews the proposed contribution map and agrees or raises a reasoned objection.
5. The agreed map becomes the reference for later assessment.

### After-project mode
1. The team loads the same competition rules plus prepared member contribution records/evidence.
2. AI evaluates each contribution against the rules and the agreed contribution map.
3. AI highlights the strongest contribution points and explains the reasoning.
4. AI proposes a contribution-based reward split.
5. A member may object and provide a reason.
6. AI checks whether the reason is materially connected to the rules/evidence and updates or defends the recommendation.
7. The team accepts the final proposal.

## Inspiration & Identity
Carry forward the ContriPact identity: calm, disciplined, evidence-oriented, and socially neutral. It should feel like a serious collaboration/governance tool, not an “AI judge” game and not a flashy finance dashboard.

The interface should make three things visibly connected: **competition rules → contribution value → reward recommendation**.

## Why This Matters to the Learner
The learner wants to use this competition version to practice a complete development process rather than only generate another working website. ContriPact is a strong vehicle because the product idea already exists, so the learning can focus on how to scope, define, build, verify, and ship a disciplined proof of concept.

## What "Working" Looks Like
A reviewer can understand the value in about 60 seconds:

- they see a four-person team and a real-looking competition brief;
- the app extracts which judging criteria matter most;
- in **Before** mode, it identifies which planned tasks are likely to carry the most competitive value and asks the team to agree;
- in **After** mode, it reads actual contribution evidence and ranks the strongest contribution points with reasons;
- it proposes a reward split tied to those reasons;
- one member objects;
- the app checks whether that objection is supported by the rules/evidence and updates or explains the recommendation;
- the team reaches an accepted proposal.

The “oh, that’s useful” moment is seeing AI say **why a contribution matters to this competition**, so teammates do not have to personally accuse each other of contributing too little.

## The POC Boundary
In this version:
- one prepared four-member competition scenario;
- one prepared competition rule/judging-criteria document;
- a two-mode interface: **Before** and **After**;
- prepared planned tasks for Before mode;
- prepared contribution/evidence records for After mode;
- one AI-assisted rules-to-contribution analysis;
- one contribution-value recommendation;
- one suggested cash split from a ¥12,000 reward pool;
- one objection and basic reason check;
- one final accept state;
- everything demonstrable in a short video and public GitHub repository.

The kernel must be real: the recommendation must be grounded in displayed competition criteria and contribution evidence, not decorative AI text.

## Later
- real document upload and OCR/parsing of arbitrary competition rules;
- real multi-user identity and invitations;
- live contribution logging during the project;
- peer review and richer evidence sources (GitHub, Docs, Figma, etc.);
- persistent projects and audit history;
- multiple objections and revision rounds;
- configurable allocation policies;
- physical-prize allocation;
- production-grade model evaluation and bias monitoring.

## Explicitly Cut
- **Full authentication and account system** — not needed to prove rules-to-contribution evaluation.
- **Production database and Supabase integration** — prepared scenario state is enough for this learning POC.
- **Real team invitations and multiple browsers** — collaboration infrastructure is not the kernel being tested.
- **Continuous contribution tracking** — useful later, but not required for the before/after proof.
- **Arbitrary file ingestion for every contest format** — one prepared competition brief is enough to test the reasoning loop.
- **AI making the final moral decision about fairness** — AI evaluates contribution relevance and gives a recommendation; the team still consents.
- **Production polish, billing, analytics, and admin tools** — outside the 2–4 hour learning build.
