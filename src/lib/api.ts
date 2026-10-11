import type { CriterionName, EvidenceId, MemberId, ObjectionId, PlannedTaskId } from '../data/demoCase';

export type RuleCriterion = {
  name: CriterionName;
  weight: number;
  reason: string;
  evidence_quote: string;
};
export type RulesAnalysis = { criteria: RuleCriterion[] };

export type BeforeTaskAnalysis = {
  task_id: PlannedTaskId;
  linked_criteria: CriterionName[];
  contribution_relevance: 'High' | 'Medium' | 'Supporting';
  reason: string;
};
export type BeforeAnalysis = { tasks: BeforeTaskAnalysis[] };

export type MemberContributionAnalysis = {
  member: MemberId;
  evidence_ids: EvidenceId[];
  linked_criteria: CriterionName[];
  contribution_relevance: 'High' | 'Medium' | 'Supporting';
  reason: string;
  suggested_share_percent: number;
};
export type AfterAnalysis = { members: MemberContributionAnalysis[]; summary: string };

export type ObjectionCheck = {
  objection_id: ObjectionId;
  support: 'supported' | 'partially_supported' | 'unsupported';
  rule_connection: CriterionName | 'NONE';
  evidence_ids: EvidenceId[];
  changes_contribution_assessment: boolean;
  recommendation_action: 'revise' | 'keep';
  reason: string;
};

export type AnalysisEnvelope<T> =
  | { ok: true; data: T; cached: boolean }
  | { ok: false; error: 'MODEL_UNAVAILABLE' | 'INVALID_MODEL_OUTPUT' | 'TIMEOUT' };

async function post<T>(path: string, body: unknown): Promise<AnalysisEnvelope<T>> {
  const response = await fetch(path, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return (await response.json()) as AnalysisEnvelope<T>;
}

async function dataOnly<T>(path: string, body: unknown): Promise<T> {
  const envelope = await post<T>(path, body);
  if (!envelope.ok) throw new Error(envelope.error);
  return envelope.data;
}

export function analyzeRules(scenarioId: string, scenarioVersion: string) {
  return dataOnly<RulesAnalysis>('/api/analyze/rules', { scenarioId, scenarioVersion });
}
export function analyzeBefore(scenarioId: string, scenarioVersion: string, criteria: RuleCriterion[]) {
  return dataOnly<BeforeAnalysis>('/api/analyze/before', { scenarioId, scenarioVersion, criteria });
}
export function analyzeAfter(scenarioId: string, scenarioVersion: string, criteria: RuleCriterion[], force = false) {
  return post<AfterAnalysis>('/api/analyze/after', { scenarioId, scenarioVersion, criteria, force });
}

export function checkObjection(scenarioId: string, scenarioVersion: string, objectionId: ObjectionId, force = false) {
  return post<ObjectionCheck>('/api/analyze/objection', { scenarioId, scenarioVersion, objectionId, force });
}
