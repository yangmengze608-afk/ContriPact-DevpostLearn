# Devpost submission package — AI-assisted draft, not a submission receipt

## Project name
ContriPact — Transparent Prize Split

## Tagline
Make a small team's prize split inspectable, down to the last cent.

## About the project
### Inspiration
Small competition teams need to understand how a captain's contribution scores translate into prize amounts, including rounding and the effect of changing a score. Transparent arithmetic can make that discussion more concrete without pretending the scores are objective.

### What it does
A captain enters a CNY prize, member names and nonnegative integer contribution scores. ContriPact shows the score fraction, percentage and exact amount for each member. The largest-remainder method distributes every cent, with list order breaking ties. Changing an input marks the result stale and disables export. Recalculation compares amounts with the previous calculation. A JSON download includes the inputs, rule and both result snapshots.

### How it was built
An independent React/TypeScript/Vite browser POC. The current release uses integer cents and BigInt arithmetic, with no backend, runtime AI or external API. Existing competition-specific work was retained while the active flow was narrowed to this deterministic slice. Only the product idea is reused from the earlier private product.

### Validation and limitations
Automated tests cover normal shares, tails, zeros, invalid input, stale/tampered exports and 5,000 seeded conservation cases. Actual browser checks exercise modification, recalculation, before/after changes and a downloaded JSON. Scores remain human inputs: this tool does not prove objectivity, fairness, consent or legal agreement. Session data disappears on reload.

### How the Devpost Learn Skill Pack was used
Codex read the installed official 1-start → 6-ship pack and relevant templates. It resumed existing artifacts, then reopened scope, PRD and spec using the user's detailed supplied product answers before implementing the deterministic calculation/comparison/export slice. The build was tested mechanically and in a browser, followed by shipping checks. The root planning documents and current process record distinguish this revision from the previous AI prototype. The user delegated implementation; no new live interview, learner hands-on review or learner reflection is claimed. This copy is AI-assisted preparation and must not be represented as a personal learning reflection.

### Learning reflection
[User must supply their own actual reflection if the form asks. No answer is fabricated.]

## Built with
React, TypeScript, Vite, Node.js test runner, Codex, Devpost Learn Skill Pack.

## Try it out — repository required here
https://github.com/yangmengze608-afk/ContriPact-DevpostLearn

## Demo video
https://youtu.be/_Ow5PWbKkls

YouTube Studio confirmed published on October 23, 2026. Public visibility selected; no copyright issues reported. Local duration 142.08 seconds, YouTube display 2:23.

## Personal/legal fields
Age of majority, eligibility/residency exclusions, resource attendance, learner experience and exit survey must be truthful and personally confirmed. Do not infer them from an account profile or earlier unverified notes. Final submission accepts the official rules; if a required declaration cannot be verified, the user must perform it.

## Official sources
- https://learn-ai-basics.devpost.com/rules
- https://learn-ai-basics.devpost.com/updates/46821-two-new-questions-on-the-submission-form
- https://github.com/challengepost/learn-ai-basics

Deadline: October 26, 2026, 5pm EDT = October 27, 2026, 05:00 Beijing. Internal target: October 26, 22:00 Beijing.
