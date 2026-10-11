import { Router } from 'express';
import { z } from 'zod';
import { demoCase } from '../../src/data/demoCase';
import { analysisKey, getCached, setCached } from '../cache/analysisCache';
import { RuleCriterionSchema } from '../ai/schemas';
import { OllamaSparkProvider, ProviderError } from '../ai/ollamaSpark';
import { validateAfter, validateRules } from '../ai/validate';
import type { AfterAnalysis, BeforeAnalysis, ObjectionCheck, RulesAnalysis } from '../../src/lib/api';

const router = Router();
const provider = new OllamaSparkProvider();
const baseRequest = z.object({ scenarioId: z.string(), scenarioVersion: z.string(), force: z.boolean().optional().default(false) });
const criteriaRequest = baseRequest.extend({ criteria: z.array(RuleCriterionSchema) });
const objectionRequest = baseRequest.extend({ objectionId: z.enum(demoCase.objections.map((o) => o.id) as [string, ...string[]]) });

function canonicalAfterInput() {
  return { criteria: demoCase.expectedCriteria, evidence: demoCase.actualContributions };
}

function matchesScenario(input: { scenarioId: string; scenarioVersion: string }) {
  return input.scenarioId === demoCase.id && input.scenarioVersion === demoCase.version;
}
function fail(res: any, error: unknown) {
  console.error('[analysis]', error);
  const code = error instanceof ProviderError ? error.code : 'INVALID_MODEL_OUTPUT';
  const status = code === 'MODEL_UNAVAILABLE' ? 503 : code === 'TIMEOUT' ? 504 : 422;
  return res.status(status).json({ ok: false, error: code });
}
async function cachedAnalysis<T>(operation: string, parsed: { scenarioId: string; scenarioVersion: string; force: boolean }, input: unknown, run: () => Promise<T>) {
  const key = analysisKey(operation, parsed.scenarioId, parsed.scenarioVersion, input);
  if (!parsed.force) {
    const hit = getCached<T>(key);
    if (hit) return { data: hit, cached: true };
  }
  const data = await run();
  setCached(key, data);
  return { data, cached: false };
}

router.post('/rules', async (req, res) => {
  const parsed = baseRequest.safeParse(req.body);
  if (!parsed.success || !matchesScenario(parsed.data)) return res.status(400).json({ ok: false, error: 'INVALID_MODEL_OUTPUT' });
  try {
    const result = await cachedAnalysis<RulesAnalysis>('rules', parsed.data, { brief: demoCase.competitionBrief }, () => provider.analyzeRules());
    return res.json({ ok: true, ...result });
  } catch (error) { return fail(res, error); }
});

router.post('/before', async (req, res) => {
  const parsed = criteriaRequest.safeParse(req.body);
  if (!parsed.success || !matchesScenario(parsed.data)) return res.status(400).json({ ok: false, error: 'INVALID_MODEL_OUTPUT' });
  try {
    const validated = validateRules({ criteria: parsed.data.criteria });
    const canonicalInput = { criteria: demoCase.expectedCriteria, plannedTasks: demoCase.plannedTasks };
    const result = await cachedAnalysis<BeforeAnalysis>('before', parsed.data, canonicalInput, () => provider.analyzeBefore(validated.criteria as any));
    return res.json({ ok: true, ...result });
  } catch (error) { return fail(res, error); }
});

router.post('/after', async (req, res) => {
  const parsed = criteriaRequest.safeParse(req.body);
  if (!parsed.success || !matchesScenario(parsed.data)) return res.status(400).json({ ok: false, error: 'INVALID_MODEL_OUTPUT' });
  try {
    const validated = validateRules({ criteria: parsed.data.criteria });
    const result = await cachedAnalysis<AfterAnalysis>('after', parsed.data, canonicalAfterInput(), () => provider.analyzeAfter(validated.criteria as any));
    return res.json({ ok: true, ...result });
  } catch (error) { return fail(res, error); }
});


router.post('/objection', async (req, res) => {
  const parsed = objectionRequest.safeParse(req.body);
  if (!parsed.success || !matchesScenario(parsed.data)) return res.status(400).json({ ok: false, error: 'INVALID_MODEL_OUTPUT' });
  try {
    const afterKey = analysisKey('after', parsed.data.scenarioId, parsed.data.scenarioVersion, canonicalAfterInput());
    const currentAfter = getCached<AfterAnalysis>(afterKey);
    if (!currentAfter) return res.status(409).json({ ok: false, error: 'INVALID_MODEL_OUTPUT' });
    const validatedAfter = validateAfter(currentAfter) as AfterAnalysis;
    const objection = demoCase.objections.find((item) => item.id === parsed.data.objectionId);
    if (!objection) return res.status(400).json({ ok: false, error: 'INVALID_MODEL_OUTPUT' });
    const input = { criteria: demoCase.expectedCriteria, currentAfter: validatedAfter, evidence: demoCase.actualContributions, objection };
    const result = await cachedAnalysis<ObjectionCheck>(`objection:${objection.id}`, parsed.data, input, () => provider.checkObjection(validatedAfter, objection));
    return res.json({ ok: true, ...result });
  } catch (error) { return fail(res, error); }
});

export default router;
