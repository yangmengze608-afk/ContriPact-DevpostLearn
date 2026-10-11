import type { AfterAnalysis, BeforeAnalysis, ObjectionCheck, RuleCriterion, RulesAnalysis } from '../../src/lib/api';
import type { DemoCase } from '../../src/data/demoCase';
import type { ContributionAIProvider } from './provider';
import { afterPrompt, beforePrompt, objectionPrompt, rulesPrompt, SYSTEM_PROMPT } from './prompts';
import { afterJsonSchema, beforeJsonSchema, objectionJsonSchema, rulesJsonSchema } from './schemas';
import { validateAfter, validateBefore, validateObjection, validateRules } from './validate';

const MODEL = process.env.OLLAMA_MODEL ?? 'contripact-spark-x2.5-4b-q4';
const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434/api/chat';

export class ProviderError extends Error {
  constructor(public code: 'MODEL_UNAVAILABLE' | 'INVALID_MODEL_OUTPUT' | 'TIMEOUT', message: string) { super(message); }
}

async function chat(prompt: string, format: object, numPredict: number) {
  let response: Response;
  try {
    response = await fetch(OLLAMA_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(120_000),
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }],
        stream: false, think: false, format,
        options: { num_ctx: 8192, temperature: 0, seed: 42, top_p: 0.9, num_predict: numPredict },
      }),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') throw new ProviderError('TIMEOUT', 'Ollama timed out');
    throw new ProviderError('MODEL_UNAVAILABLE', 'Ollama is not reachable');
  }
  if (!response.ok) throw new ProviderError('MODEL_UNAVAILABLE', `Ollama returned ${response.status}`);
  const raw = await response.json() as { message?: { content?: string } };
  try { return JSON.parse(raw.message?.content ?? ''); }
  catch { throw new ProviderError('INVALID_MODEL_OUTPUT', 'Model did not return valid JSON'); }
}

export class OllamaSparkProvider implements ContributionAIProvider {
  async analyzeRules(): Promise<RulesAnalysis> {
    try { return validateRules(await chat(rulesPrompt(), rulesJsonSchema, 650)) as RulesAnalysis; }
    catch (error) { if (error instanceof ProviderError) throw error; throw new ProviderError('INVALID_MODEL_OUTPUT', String(error)); }
  }
  async analyzeBefore(criteria: RuleCriterion[]): Promise<BeforeAnalysis> {
    try { return validateBefore(await chat(beforePrompt(criteria), beforeJsonSchema, 800)) as BeforeAnalysis; }
    catch (error) { if (error instanceof ProviderError) throw error; throw new ProviderError('INVALID_MODEL_OUTPUT', String(error)); }
  }
  async analyzeAfter(criteria: RuleCriterion[]): Promise<AfterAnalysis> {
    try { return validateAfter(await chat(afterPrompt(criteria), afterJsonSchema, 900)) as AfterAnalysis; }
    catch (error) { if (error instanceof ProviderError) throw error; throw new ProviderError('INVALID_MODEL_OUTPUT', String(error)); }
  }
  async checkObjection(currentAfter: AfterAnalysis, objection: DemoCase['objections'][number]): Promise<ObjectionCheck> {
    try { return validateObjection(await chat(objectionPrompt(currentAfter, objection), objectionJsonSchema, 320), objection.id) as ObjectionCheck; }
    catch (error) { if (error instanceof ProviderError) throw error; throw new ProviderError('INVALID_MODEL_OUTPUT', String(error)); }
  }
}
