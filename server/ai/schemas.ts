import { z } from 'zod';
import { demoCase } from '../../src/data/demoCase';

const criterionNames = demoCase.expectedCriteria.map((c) => c.name);
const taskIds = demoCase.plannedTasks.map((t) => t.id);
const memberIds = demoCase.actualContributions.map((m) => m.member);
const evidenceIds = demoCase.actualContributions.flatMap((m) => m.evidence.map((e) => e.id));
const objectionIds = demoCase.objections.map((o) => o.id);
const relevance = ['High', 'Medium', 'Supporting'] as const;

export const RuleCriterionSchema = z.object({
  name: z.enum(criterionNames as [string, ...string[]]),
  weight: z.number().int(),
  reason: z.string().min(1),
  evidence_quote: z.string().min(1),
});
export const RulesAnalysisSchema = z.object({ criteria: z.array(RuleCriterionSchema) });

export const BeforeTaskSchema = z.object({
  task_id: z.enum(taskIds as [string, ...string[]]),
  linked_criteria: z.array(z.enum(criterionNames as [string, ...string[]])),
  contribution_relevance: z.enum(relevance),
  reason: z.string().min(1),
});
export const BeforeAnalysisSchema = z.object({ tasks: z.array(BeforeTaskSchema) });

export const MemberContributionSchema = z.object({
  member: z.enum(memberIds as [string, ...string[]]),
  evidence_ids: z.array(z.enum(evidenceIds as [string, ...string[]])).min(1),
  linked_criteria: z.array(z.enum(criterionNames as [string, ...string[]])).min(1),
  contribution_relevance: z.enum(relevance),
  reason: z.string().min(1),
  suggested_share_percent: z.number().int().min(0).max(100),
});
export const AfterAnalysisSchema = z.object({
  members: z.array(MemberContributionSchema),
  summary: z.string().min(1),
});

export const rulesJsonSchema = {
  type: 'object', properties: { criteria: { type: 'array', items: { type: 'object', properties: {
    name: { type: 'string', enum: criterionNames }, weight: { type: 'integer' }, reason: { type: 'string' }, evidence_quote: { type: 'string' },
  }, required: ['name', 'weight', 'reason', 'evidence_quote'] } } }, required: ['criteria'],
};

export const beforeJsonSchema = {
  type: 'object', properties: { tasks: { type: 'array', items: { type: 'object', properties: {
    task_id: { type: 'string', enum: taskIds },
    linked_criteria: { type: 'array', items: { type: 'string', enum: criterionNames } },
    contribution_relevance: { type: 'string', enum: relevance }, reason: { type: 'string' },
  }, required: ['task_id', 'linked_criteria', 'contribution_relevance', 'reason'] } } }, required: ['tasks'],
};

export const afterJsonSchema = {
  type: 'object', properties: {
    members: { type: 'array', items: { type: 'object', properties: {
      member: { type: 'string', enum: memberIds },
      evidence_ids: { type: 'array', items: { type: 'string', enum: evidenceIds } },
      linked_criteria: { type: 'array', items: { type: 'string', enum: criterionNames } },
      contribution_relevance: { type: 'string', enum: relevance },
      reason: { type: 'string' }, suggested_share_percent: { type: 'integer' },
    }, required: ['member', 'evidence_ids', 'linked_criteria', 'contribution_relevance', 'reason', 'suggested_share_percent'] } },
    summary: { type: 'string' },
  }, required: ['members', 'summary'],
};


export const ObjectionCheckSchema = z.object({
  objection_id: z.enum(objectionIds as [string, ...string[]]),
  support: z.enum(['supported', 'partially_supported', 'unsupported']),
  rule_connection: z.enum(['NONE', ...criterionNames] as [string, ...string[]]),
  evidence_ids: z.array(z.enum(evidenceIds as [string, ...string[]])),
  changes_contribution_assessment: z.boolean(),
  recommendation_action: z.enum(['revise', 'keep']),
  reason: z.string().min(1),
});

export const objectionJsonSchema = {
  type: 'object', properties: {
    objection_id: { type: 'string', enum: objectionIds },
    support: { type: 'string', enum: ['supported', 'partially_supported', 'unsupported'] },
    rule_connection: { type: 'string', enum: ['NONE', ...criterionNames] },
    evidence_ids: { type: 'array', items: { type: 'string', enum: evidenceIds } },
    changes_contribution_assessment: { type: 'boolean' },
    recommendation_action: { type: 'string', enum: ['revise', 'keep'] },
    reason: { type: 'string' },
  }, required: ['objection_id', 'support', 'rule_connection', 'evidence_ids', 'changes_contribution_assessment', 'recommendation_action', 'reason'],
};
