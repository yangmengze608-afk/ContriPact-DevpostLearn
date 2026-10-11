import type { AfterAnalysis, BeforeAnalysis, ObjectionCheck, RuleCriterion, RulesAnalysis } from '../../src/lib/api';
import type { DemoCase } from '../../src/data/demoCase';

type PreparedObjection = DemoCase['objections'][number];

export interface ContributionAIProvider {
  analyzeRules(): Promise<RulesAnalysis>;
  analyzeBefore(criteria: RuleCriterion[]): Promise<BeforeAnalysis>;
  analyzeAfter(criteria: RuleCriterion[]): Promise<AfterAnalysis>;
  checkObjection(currentAfter: AfterAnalysis, objection: PreparedObjection): Promise<ObjectionCheck>;
}
