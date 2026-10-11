import { demoCase } from '../../src/data/demoCase';
import type { AfterAnalysis, RuleCriterion } from '../../src/lib/api';
import type { DemoCase } from '../../src/data/demoCase';

type PreparedObjection = DemoCase['objections'][number];

export const SYSTEM_PROMPT = `You are the contribution-relevance analysis engine for ContriPact. Judge only from the competition rules and evidence supplied. Do not invent criteria, evidence, people, or facts. You are not an oracle of objective fairness. Separate evidence from interpretation. Return only JSON matching the requested schema.`;

function gateJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(gateJson).join(', ')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).map(([key, item]) => `${JSON.stringify(key)}: ${gateJson(item)}`).join(', ')}}`;
  }
  return JSON.stringify(value);
}

function canonicalCriteria(criteria: RuleCriterion[]) {
  return criteria.map(({ name, weight }) => {
    const canonical = demoCase.expectedCriteria.find((criterion) => criterion.name === name);
    if (!canonical || canonical.weight !== weight) throw new Error('criteria do not match canonical case');
    return { id: canonical.id, name, weight };
  });
}

export function rulesPrompt() {
  return `Extract the judging criteria from this competition brief. Preserve the exact criterion names and integer weights. Do not add criteria. For evidence_quote, copy a short exact phrase from the brief that supports that criterion. Keep each reason under 20 words. Do not invent an importance label: the UI derives importance deterministically from numeric weights.\n\nBRIEF:\n${demoCase.competitionBrief}`;
}

export function beforePrompt(criteria: RuleCriterion[]) {
  return `Map each prepared planned task to the exact judging criteria it is expected to influence BEFORE the project starts. contribution_relevance (High/Medium/Supporting) describes the task's expected competitive relevance, never the person's worth. The submission-logistics task is supporting work, not a scored deliverable itself. Keep each reason under 22 words.\n\nCRITERIA:\n${gateJson(canonicalCriteria(criteria))}\n\nPLANNED TASKS:\n${gateJson(demoCase.plannedTasks)}`;
}

export function afterPrompt(criteria: RuleCriterion[]) {
  return `Evaluate the strongest CONTRIBUTION BUNDLE for each member, not the person's human value. Cite one or more supplied evidence IDs and only the exact criterion names shown. contribution_relevance (High/Medium/Supporting) describes how strongly that cited work bundle matters to competition outcomes, never the person's worth. Then give a suggested share percent for each member that sums to 100, as a contestable proposal rather than objective fairness. Keep each reason under 24 words.\n\nCRITERIA:\n${gateJson(canonicalCriteria(criteria))}\n\nEVIDENCE:\n${gateJson(demoCase.actualContributions)}`;
}


export function objectionPrompt(currentAfter: AfterAnalysis, objection: PreparedObjection) {
  return `Check this ONE objection against only the supplied competition criteria and evidence. If unsupported, rule_connection MUST be NONE and evidence_ids MUST be empty. If supported or partially supported, rule_connection MUST name the single strongest exact criterion and evidence_ids must cite supporting evidence. Recommendation changes only if the objection changes the contribution assessment. Keep reason under 35 words.\n\nCRITERIA:\n${gateJson(demoCase.expectedCriteria)}\nCURRENT VALIDATED CONTRIBUTION ASSESSMENT:\n${gateJson(currentAfter)}\nEVIDENCE:\n${gateJson(demoCase.actualContributions)}\nOBJECTION:\n${gateJson(objection)}`;
}
