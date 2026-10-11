import { demoCase } from '../../src/data/demoCase';
import { AfterAnalysisSchema, BeforeAnalysisSchema, ObjectionCheckSchema, RulesAnalysisSchema } from './schemas';

export function validateRules(input: unknown) {
  const parsed = RulesAnalysisSchema.parse(input);
  const expected = new Map<string, number>(demoCase.expectedCriteria.map((c) => [c.name, c.weight]));
  if (parsed.criteria.length !== expected.size) throw new Error('criterion count mismatch');
  const seen = new Set<string>();
  for (const criterion of parsed.criteria) {
    if (seen.has(criterion.name)) throw new Error('duplicate criterion');
    seen.add(criterion.name);
    if (expected.get(criterion.name) !== criterion.weight) throw new Error('criterion weight mismatch');
    if (!demoCase.competitionBrief.includes(criterion.evidence_quote)) throw new Error('quote does not trace to brief');
  }
  if (parsed.criteria.reduce((sum, c) => sum + c.weight, 0) !== 100) throw new Error('weights must sum to 100');
  return parsed;
}

export function validateBefore(input: unknown) {
  const parsed = BeforeAnalysisSchema.parse(input);
  const expectedIds = new Set(demoCase.plannedTasks.map((t) => t.id));
  if (parsed.tasks.length !== expectedIds.size) throw new Error('task count mismatch');
  const byId = new Map(parsed.tasks.map((t) => [t.task_id, t]));
  if (byId.size !== expectedIds.size || [...expectedIds].some((id) => !byId.has(id))) throw new Error('task set mismatch');
  if (!parsed.tasks.some((t) => t.contribution_relevance === 'High')) throw new Error('no high-relevance task');
  if (!parsed.tasks.some((t) => t.contribution_relevance === 'Supporting')) throw new Error('no supporting task');
  if (!byId.get('T1')?.linked_criteria.includes('Design')) throw new Error('T1 must link Design');
  if (!byId.get('T2')?.linked_criteria.some((c) => c === 'Design' || c === 'Innovation/Idea')) throw new Error('T2 must link Design or Innovation/Idea');
  if (!byId.get('T3')?.linked_criteria.some((c) => c === 'Design' || c === 'Presentation')) throw new Error('T3 must link Design or Presentation');
  if (!byId.get('T4')?.linked_criteria.includes('Presentation')) throw new Error('T4 must link Presentation');
  const t5 = byId.get('T5');
  if (!t5 || t5.contribution_relevance !== 'Supporting' || t5.linked_criteria.length !== 0) throw new Error('T5 must remain supporting');
  return parsed;
}

export function validateAfter(input: unknown) {
  const parsed = AfterAnalysisSchema.parse(input);
  const expectedMembers = new Set(demoCase.actualContributions.map((m) => m.member));
  const evidenceOwner = new Map<string, string>();
  for (const member of demoCase.actualContributions) for (const evidence of member.evidence) evidenceOwner.set(evidence.id, member.member);
  if (parsed.members.length !== expectedMembers.size) throw new Error('member count mismatch');
  const byMember = new Map(parsed.members.map((m) => [m.member, m]));
  if (byMember.size !== expectedMembers.size || [...expectedMembers].some((id) => !byMember.has(id))) throw new Error('member set mismatch');
  for (const member of parsed.members) {
    if (member.evidence_ids.some((id) => evidenceOwner.get(id) !== member.member)) throw new Error('evidence ownership mismatch');
  }
  const total = parsed.members.reduce((sum, m) => sum + m.suggested_share_percent, 0);
  if (total !== 100) throw new Error('shares must sum to 100');
  const shares = parsed.members.map((m) => m.suggested_share_percent);
  if (Math.max(...shares) - Math.min(...shares) < 10) throw new Error('proposal lacks tested differentiation');
  if (!byMember.get('A')?.linked_criteria.includes('Design')) throw new Error('A must link Design');
  if (!byMember.get('B')?.linked_criteria.some((c) => c === 'Design' || c === 'Innovation/Idea')) throw new Error('B must link Design or Innovation/Idea');
  if (!byMember.get('D')?.linked_criteria.includes('Presentation')) throw new Error('D must link Presentation');
  return parsed;
}


export function validateObjection(input: unknown, expectedId: string) {
  const parsed = ObjectionCheckSchema.parse(input);
  if (parsed.objection_id !== expectedId) throw new Error('objection id mismatch');
  if (parsed.support === 'unsupported') {
    if (parsed.rule_connection !== 'NONE' || parsed.evidence_ids.length !== 0 || parsed.changes_contribution_assessment || parsed.recommendation_action !== 'keep') {
      throw new Error('unsupported objection cross-field mismatch');
    }
  } else {
    if (parsed.rule_connection === 'NONE' || parsed.evidence_ids.length === 0) throw new Error('supported objection must cite rule and evidence');
  }
  if (parsed.changes_contribution_assessment && parsed.recommendation_action !== 'revise') throw new Error('changed assessment must revise');
  if (!parsed.changes_contribution_assessment && parsed.recommendation_action !== 'keep') throw new Error('unchanged assessment must keep');

  if (expectedId === 'O1' && !(parsed.support === 'unsupported' && parsed.rule_connection === 'NONE' && parsed.evidence_ids.length === 0 && parsed.recommendation_action === 'keep')) throw new Error('O1 fixed-case expectation failed');
  if (expectedId === 'O2' && !((parsed.support === 'supported' || parsed.support === 'partially_supported') && parsed.rule_connection === 'Presentation' && parsed.evidence_ids.includes('D1') && parsed.changes_contribution_assessment === false && parsed.recommendation_action === 'keep')) throw new Error('O2 fixed-case expectation failed');
  if (expectedId === 'O3' && !(parsed.support === 'unsupported' && parsed.rule_connection === 'NONE' && parsed.evidence_ids.length === 0 && parsed.recommendation_action === 'keep')) throw new Error('O3 fixed-case expectation failed');
  return parsed;
}
