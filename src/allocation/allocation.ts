export type Input = { prize: string; members: { id: string; name: string; score: string }[] };
export type Result = { prizeCents: number; totalScore: number; members: {
  id: string; name: string; score: number; baseCents: number; remainderNumerator: number;
  extraCent: number; amountCents: number;
}[] };
export type Snapshot = { inputs: Input; result: Result };
export const limitation = 'This tool makes rules and calculations transparent. It does not prove scores are objective or guarantee a fair allocation.';
export function calculate(input: Input): Result {
  if (!/^(0|[1-9]\d{0,6})(\.\d{1,2})?$/.test(input.prize))
    throw new Error('Prize: enter a positive plain decimal with at most two decimal places.');
  const [whole, fraction = ''] = input.prize.split('.');
  const prizeCents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (prizeCents < 1 || prizeCents > 100_000_000)
    throw new Error('Prize must be between CNY 0.01 and 1,000,000.00.');
  if (input.members.length < 1 || input.members.length > 20)
    throw new Error('Use between 1 and 20 members.');
  const names = new Set<string>(), ids = new Set<string>();
  const members = input.members.map((member, index) => {
    const name = member.name.trim();
    if (!name || name.length > 60) throw new Error(`Member ${index + 1}: name must be 1–60 characters.`);
    if (names.has(name.toLowerCase())) throw new Error(`Member ${index + 1}: use a unique name.`);
    names.add(name.toLowerCase());
    if (!member.id || ids.has(member.id)) throw new Error('Each member must have a unique ID.');
    ids.add(member.id);
    if (!/^(0|[1-9]\d{0,6})$/.test(member.score) || Number(member.score) > 1_000_000)
      throw new Error(`Member ${index + 1}: score must be an integer from 0 to 1,000,000.`);
    return { id: member.id, name, score: Number(member.score) };
  });
  const totalScore = members.reduce((sum, m) => sum + m.score, 0);
  if (!totalScore) throw new Error('Total score must be greater than zero. Give at least one member a positive score.');
  const allocated = members.map(m => {
    const numerator = BigInt(prizeCents) * BigInt(m.score), denominator = BigInt(totalScore);
    const baseCents = Number(numerator / denominator);
    return { ...m, baseCents, remainderNumerator: Number(numerator % denominator), extraCent: 0, amountCents: baseCents };
  });
  const remaining = prizeCents - allocated.reduce((sum, m) => sum + m.baseCents, 0);
  const order = allocated.map((m, index) => ({ ...m, index })).filter(m => m.score > 0)
    .sort((a, b) => b.remainderNumerator - a.remainderNumerator || a.index - b.index);
  for (const item of order.slice(0, remaining)) {
    allocated[item.index].extraCent = 1;
    allocated[item.index].amountCents++;
  }
  if (allocated.reduce((sum, m) => sum + m.amountCents, 0) !== prizeCents || allocated.some(m => m.score === 0 && m.amountCents !== 0))
    throw new Error('Allocation invariant failed.');
  return { prizeCents, totalScore, members: allocated };
}
export function money(cents: number): string {
  return `${Math.floor(cents / 100).toLocaleString('en-US')}.${String(cents % 100).padStart(2, '0')}`;
}
export function createExport(current: Snapshot, previous: Snapshot | null, live: Input, dirty: boolean) {
  if (dirty || JSON.stringify(live) !== JSON.stringify(current.inputs)) throw new Error('Results need updating. Recalculate before exporting.');
  const checked = calculate(current.inputs);
  if (JSON.stringify(checked) !== JSON.stringify(current.result)) throw new Error('Result does not match inputs.');
  return {
    schemaVersion: 1, currency: 'CNY',
    rule: { method: 'largest-remainder', formula: 'prizeCents * score / totalScore; floor, then distribute remaining cents by remainder descending', tieBreak: 'member-list-order' },
    limitation, current, previous,
  };
}
