import { demoCase } from '../src/data/demoCase';

const base = process.env.CONTRIPACT_API_BASE ?? 'http://127.0.0.1:8787/api/analyze';
const force = process.argv.includes('--force');
const meta = { scenarioId: demoCase.id, scenarioVersion: demoCase.version };

type Envelope<T> = { ok: true; data: T; cached: boolean } | { ok: false; error: string };

async function post<T>(path: string, body: unknown): Promise<{ data: T; cached: boolean }> {
  const response = await fetch(`${base}${path}`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
  const envelope = await response.json() as Envelope<T>;
  if (!envelope.ok) throw new Error(`${path}: ${envelope.error}`);
  return envelope;
}

async function main() {
  console.log(`ContriPact warm-up (${force ? 'force live inference' : 'validated cache allowed'})`);
  const rules = await post<{ criteria: unknown[] }>('/rules', { ...meta, force });
  console.log(`rules      ${rules.cached ? 'cache' : 'live'}`);
  const before = await post('/before', { ...meta, criteria: rules.data.criteria, force });
  console.log(`before     ${before.cached ? 'cache' : 'live'}`);
  const after = await post('/after', { ...meta, criteria: rules.data.criteria, force });
  console.log(`after      ${after.cached ? 'cache' : 'live'}`);
  const objection = await post('/objection', { ...meta, objectionId: 'O2', force });
  console.log(`objection  ${objection.cached ? 'cache' : 'live'}`);
  console.log('Warm-up complete. Keep this server process running for the demo.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  console.error('Start Ollama and `npm run dev`, then retry.');
  process.exit(1);
});
