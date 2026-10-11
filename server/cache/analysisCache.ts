import { createHash } from 'node:crypto';

const cache = new Map<string, unknown>();

export function analysisKey(operation: string, scenarioId: string, scenarioVersion: string, input: unknown) {
  const hash = createHash('sha256').update(JSON.stringify(input)).digest('hex');
  return `${operation}:${scenarioId}:${scenarioVersion}:${hash}`;
}

export function getCached<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

export function setCached<T>(key: string, value: T) {
  cache.set(key, value);
}
