import { demoCase } from '../../data/demoCase';
import type { Language } from '../../i18n/copy';
import { caseCopy, copy, presentCriterionName, presentObjectionReason } from '../../i18n/copy';
import type { ObjectionCheck } from '../../lib/api';

type Props = {
  language: Language;
  result: ObjectionCheck | null;
  status: 'idle' | 'loading' | 'error';
  onCheck: () => void;
  onRetry: () => void;
  onReanalyze: () => void;
};

export function ObjectionPanel({ language, result, status, onCheck, onRetry, onReanalyze }: Props) {
  const t = copy[language];
  const objection = demoCase.objections.find((item) => item.id === 'O2')!;
  const localCase = caseCopy[language];
  return (
    <section className="objection-card">
      <div className="section-heading"><span>05</span><div><p>{t.objection}</p><h2>{t.objectionQuestion}</h2></div></div>
      <blockquote className="objection-text"><strong>{t.member} {objection.member}</strong><p>{localCase.objections.O2}</p></blockquote>
      {!result && status !== 'error' && <button className="analysis-button" disabled={status === 'loading'} onClick={onCheck}>{status === 'loading' ? t.checkingObjection : t.checkObjection}</button>}
      {status === 'error' && <div className="error-state inline-error"><strong>{t.analysisUnavailable}</strong><p>{t.unavailableExplanation}</p><button onClick={onRetry}>{t.retry}</button></div>}
      {result && <div className="objection-result">
        <div className="objection-metrics">
          <div><span>{t.supportLabel}</span><strong>{t.support[result.support]}</strong></div>
          <div><span>{t.ruleConnection}</span><strong>{result.rule_connection === 'NONE' ? '—' : presentCriterionName(language, result.rule_connection)}</strong></div>
          <div><span>{t.evidenceUsed}</span><strong>{result.evidence_ids.length ? result.evidence_ids.join(', ') : '—'}</strong></div>
        </div>
        <p className="objection-reason">{presentObjectionReason(language, result.objection_id, result.reason)}</p>
        <div className={`decision-strip ${result.recommendation_action}`}>
          <strong>{result.recommendation_action === 'keep' ? t.proposalDefended : t.reviseRequired}</strong>
          {result.recommendation_action === 'revise' && <button onClick={onReanalyze}>{t.reanalyzeEvidence}</button>}
        </div>
      </div>}
    </section>
  );
}
