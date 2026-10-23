import { useState } from 'react';
import { calculate, createExport, limitation, money, type Input, type Snapshot } from './allocation';
import scope from '../../scope.md?raw';
import prd from '../../prd.md?raw';
import spec from '../../spec.md?raw';
import './allocation.css';

const example = (): Input => ({ prize: '100.00', members: [
  { id: 'member-1', name: 'Alex', score: '1' }, { id: 'member-2', name: 'Blair', score: '1' }, { id: 'member-3', name: 'Casey', score: '1' },
] });
export function AllocationApp() {
  const [input, setInput] = useState<Input>(example);
  const [current, setCurrent] = useState<Snapshot | null>(null);
  const [previous, setPrevious] = useState<Snapshot | null>(null);
  const [dirty, setDirty] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [nextId, setNextId] = useState(4);
  const [doc, setDoc] = useState<null | 'scope' | 'prd' | 'spec'>(null);
  function edit(next: Input) { setInput(next); setDirty(true); setError(''); setNotice(''); }
  function updateMember(index: number, key: 'name' | 'score', value: string) {
    edit({ ...input, members: input.members.map((m, i) => i === index ? { ...m, [key]: value } : m) });
  }
  function run() {
    try {
      const result = calculate(input);
      if (current && JSON.stringify(current.inputs) !== JSON.stringify(input)) setPrevious(current);
      setCurrent({ inputs: structuredClone(input), result }); setDirty(false); setError(''); setNotice('Calculation updated. Every cent accounted for.');
    } catch (e) { setError((e as Error).message); setDirty(true); setNotice(''); }
  }
  function download() {
    if (!current) return;
    try {
      const payload = createExport(current, previous, input, dirty);
      const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = 'contripact-allocation.json'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice('JSON download requested. Includes inputs, rule, current result and previous calculation.');
    } catch (e) { setError((e as Error).message); }
  }
  const result = current?.result;
  const delta = (cents: number) => `${cents < 0 ? '−' : '+'}${money(Math.abs(cents))}`;
  return <main>
    <header><a className="brand" href="#">ContriPact<span> / TRANSPARENT PRIZE SPLIT</span></a><span className="badge">Single-device POC</span></header>
    <section className="intro"><p className="eyebrow">A SHARED RULE. EVERY CENT VISIBLE.</p><h1>Make the split inspectable.</h1><p>Set the scores. See the calculation. Compare a change before sharing the result.</p></section>
    <div className="workspace">
      <section className="inputs" aria-labelledby="input-title"><div className="section-title"><h2 id="input-title">01 <span>Set your inputs</span></h2><span>Fictional example</span></div>
        <form noValidate onSubmit={e => { e.preventDefault(); run(); }}>
          <label className="prize">Prize pool <span>CNY</span><input aria-label="Prize pool (CNY)" inputMode="decimal" value={input.prize} maxLength={12} onChange={e => edit({ ...input, prize: e.target.value })} /></label>
          <p className="help">0.01–1,000,000.00 · up to 2 decimal places</p>
          <div className="member-heading"><span>Member name</span><span>Score</span><span /></div>
          {input.members.map((member, index) => <div className="member" key={member.id}>
            <input aria-label={`Member ${index + 1} name`} maxLength={60} value={member.name} onChange={e => updateMember(index, 'name', e.target.value)} />
            <input aria-label={`Member ${index + 1} score`} inputMode="numeric" maxLength={8} value={member.score} onChange={e => updateMember(index, 'score', e.target.value)} />
            <button className="remove" type="button" aria-label={`Remove member ${index + 1}`} disabled={input.members.length === 1} onClick={() => edit({ ...input, members: input.members.filter(m => m.id !== member.id) })}>×</button>
          </div>)}
          <div className="input-tools"><button type="button" disabled={input.members.length >= 20} onClick={() => { edit({ ...input, members: [...input.members, { id: `member-${nextId}`, name: '', score: '0' }] }); setNextId(nextId + 1); }}>+ Add member</button><button type="button" onClick={() => edit(example())}>Reset example</button></div>
          <p className="help">Scores: whole numbers from 0 to 1,000,000. At least one must be positive. No data is saved after reload.</p>
          <button className="primary" type="submit">{current ? 'Recalculate split' : 'Calculate split'} <span aria-hidden="true">→</span></button>
        </form>
        {error && <p className="error" role="alert">{error}</p>}
      </section>
      <section className="results" aria-labelledby="result-title"><div className="section-title"><h2 id="result-title">02 <span>Inspect the split</span></h2><span className={dirty ? 'pending' : 'fresh'}>{current ? dirty ? 'Needs update' : 'Up to date' : 'Ready to calculate'}</span></div>
        <p className="status" role="status">{current && dirty ? 'Results need updating. Showing the last calculation; recalculate before export.' : notice || 'Calculate to see amounts and the rounding audit.'}</p>
        {result ? <>
          <div className="total"><span>{dirty ? 'Last calculated pool' : 'Allocated pool'}</span><strong><small>CNY</small> {money(result.prizeCents)}</strong><span>{result.totalScore.toLocaleString()} total score · sum of payouts = prize exactly</span></div>
          <div className="table-scroll"><table><caption>{dirty ? 'Last calculated result — not current inputs' : 'Current allocation'}</caption><thead><tr><th>Member / score</th><th>Share</th><th>Amount (CNY)</th>{previous && <><th>Previous</th><th>Change</th></>}</tr></thead><tbody>
          {result.members.map(m => { const old = previous?.result.members.find(p => p.id === m.id); return <tr key={m.id}><th scope="row">{m.name}<small>{m.score} / {result.totalScore} points</small></th><td>{(m.score / result.totalScore * 100).toFixed(2)}%</td><td className="amount">{money(m.amountCents)}<small>{m.extraCent ? '+1 rounding cent' : 'No extra cent'}</small></td>{previous && <><td>{old ? money(old.amountCents) : 'New member'}</td><td className="change">{delta(m.amountCents - (old?.amountCents ?? 0))}</td></>}</tr>; })}
          </tbody></table></div>
          {previous && <p className="comparison">Compared with the previous calculation: CNY {money(previous.result.prizeCents)}; {previous.result.members.map(m => `${m.name} ${m.score} points`).join(', ')}.{previous.result.members.filter(m => !result.members.some(n => n.id === m.id)).map(m => ` Removed: ${m.name}, previous CNY ${money(m.amountCents)} → 0.00 (${delta(-m.amountCents)}).`).join('')}</p>}
          <details><summary>See the exact rounding audit</summary><p>Base cents = floor(prize cents × score / total score). The remainder numerator is ranked over the common denominator {result.totalScore}.</p><ul>{result.members.map(m => <li key={m.id}>{m.name}: floor({result.prizeCents} × {m.score} / {result.totalScore}) = {m.baseCents} cents; remainder {m.remainderNumerator}/{result.totalScore}; extra {m.extraCent} cent.</li>)}</ul></details>
        </> : <div className="empty"><span>100.00</span><p>One pool. A visible rule.<br />A result your team can inspect.</p></div>}
        <button className="export" disabled={!current || dirty} onClick={download}>Export calculation JSON <span aria-hidden="true">↓</span></button>
      </section>
    </div>
    <section className="method"><div><p className="eyebrow">THE RULE</p><h2>Prize × member score ÷ total score</h2><p>Work in integer cents. Round each quota down, then give remaining cents to the largest remainders. Ties follow member list order. A zero score receives zero. Percentages are approximate; cents are exact.</p></div><aside><strong>Transparent does not mean fair.</strong><p>{limitation}</p></aside></section>
    <footer><span>Built with the Devpost Learn Skill Pack · no runtime AI or API</span><nav aria-label="Project documents">{(['scope', 'prd', 'spec'] as const).map(key => <button key={key} onClick={() => setDoc(doc === key ? null : key)} aria-expanded={doc === key}>{key}.md</button>)}</nav></footer>
    {doc && <section className="document" aria-label={`${doc}.md`}><div className="section-title"><h2>{doc}.md</h2><button onClick={() => setDoc(null)}>Close document</button></div><pre>{({ scope, prd, spec })[doc]}</pre></section>}
  </main>;
}
