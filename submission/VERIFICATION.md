# Verification — 2026-10-23

## Executed checks
- `npm test`: 7/7 tests passed, including 5,000 seeded allocation cases covering exact conservation, quota bounds and zero-score members.
- `npm run build`: TypeScript check and Vite production build passed.
- Independent clean public-repository clone plus an explicit allowlist of this revision: Node 24.18.0, `npm ci`, `npm test`, `npm run build`, `npm run preview -- --host 127.0.0.1 --port 4173` all succeeded. Install reported zero known vulnerabilities.
- Actual browser checks on development and clean production preview: equal split/tail, positive totals, zero score, all-zero error, invalid decimal prize, dirty export disabled, recalculation and signed before/after deltas, actual JSON download, added member and removed-member comparison.
- Browser export independently checked: before 3334/3333/3333 cents; after 2500/5000/2500; both sum to 10000; recorded input reproduces the current calculation.
- Responsive check at 390×844: repaired grid child minimum width; input right edge 349px, form width 352px, document width 390px. Desktop and mobile screenshots retained.

## Public content and history
See `history-audit.json`: all 145 local-independent historical file blobs and 89 pre-existing public historical file blobs scanned for selected secret, credential, email and local-path patterns. No matches. Explicit publication worktree allowlist: 101 files reviewed/scanned before adding release evidence, no matching content. Local learner profile, credential files, old untracked videos, local Git history and machine paths are excluded from publication. Existing public author metadata is retained; new public commits use GitHub noreply identity.

Main private repository was checked as PRIVATE. Comparing source-file blob hashes against its current main tree found no identical source blobs in the prior public independent tree. No private source content was copied. This check cannot establish the absence of partial/historical copying, prove eligibility or replace human assessment.

## Video evidence
Actual browser actions were recorded in a separate clean browser context: calculate at 18s, audit at 34s, score edit/stale result at 49s, recalculate at 60s, real JSON download at 74s, scope at 86s, PRD at 100s, spec at 113s, limitation at 128s. No static slides substitute for operations. English system-synthesized voice and script are disclosed; no music. Final duration/hosting recorded separately once verified.

## Limits
No new learner hands-on checkpoint/reflection is claimed. No payment or fairness/objectivity validation. Automated pattern scans are bounded, not a guarantee that a repository contains no sensitive data. Final hosted-video permissions and Devpost submission must be directly verified and cannot be inferred from local artifacts.

## Final video and static site
The final H.264/AAC MP4 is 1440×1100, 142.08 seconds (1–3 minute requirement met). Sampled frames at 20, 52, 63, 90, 104 and 116 seconds show actual states and document transitions; narration segments were checked for duration and non-overlap. The raw browser recording and downloaded JSON remain local. Only trailing idle time was trimmed; no operation was fabricated.

GitHub Pages deployed at https://yangmengze608-afk.github.io/ContriPact-DevpostLearn/ . Live browser smoke passed: initial calculation, input edit/stale export, recalculation with +16.67 change, and actual JSON download.

YouTube Studio confirmed public publication at https://youtu.be/_Ow5PWbKkls on 2026-10-23; its copyright check reported no issues. Public-repository HTML and all three root planning files were fetched without authentication (HTTP 200 with substantive contents).
