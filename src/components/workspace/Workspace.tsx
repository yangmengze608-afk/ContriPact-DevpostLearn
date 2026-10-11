import { useState } from 'react';
import { demoCase } from '../../data/demoCase';
import type { Language } from '../../i18n/copy';
import { caseCopy, copy } from '../../i18n/copy';
import { analyzeAfter, analyzeBefore, analyzeRules, checkObjection, type AfterAnalysis, type BeforeAnalysis, type ObjectionCheck, type RulesAnalysis } from '../../lib/api';
import { BeforeMap } from './BeforeMap';
import { FinalAgreement } from './FinalAgreement';
import { MemberEvidence } from './MemberEvidence';
import { ModeSwitch } from './ModeSwitch';
import { ObjectionPanel } from './ObjectionPanel';
import { RewardProposal } from './RewardProposal';
import { RulePanel } from './RulePanel';

type Props = { language: Language; onLanguage: (language: Language) => void; onBack: () => void };
type LoadState = 'idle' | 'loading' | 'error';

export function Workspace({ language, onLanguage, onBack }: Props) {
  const t = copy[language];
  const localCase = caseCopy[language];
  const [mode, setMode] = useState<'before' | 'after'>('before');
  const [rules, setRules] = useState<RulesAnalysis | null>(null);
  const [before, setBefore] = useState<BeforeAnalysis | null>(null);
  const [after, setAfter] = useState<AfterAnalysis | null>(null);
  const [objection, setObjection] = useState<ObjectionCheck | null>(null);
  const [beforeStatus, setBeforeStatus] = useState<LoadState>('idle');
  const [afterStatus, setAfterStatus] = useState<LoadState>('idle');
  const [objectionStatus, setObjectionStatus] = useState<LoadState>('idle');
  const [afterCached, setAfterCached] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [accepted, setAccepted] = useState(false);

  async function runBeforeAnalysis() {
    setBeforeStatus('loading');
    setAgreed(false);
    setAccepted(false);
    setMode('before');
    setAfter(null);
    setObjection(null);
    setAfterStatus('idle');
    setObjectionStatus('idle');
    try {
      const nextRules = await analyzeRules(demoCase.id, demoCase.version);
      setRules(nextRules);
      const nextBefore = await analyzeBefore(demoCase.id, demoCase.version, nextRules.criteria);
      setBefore(nextBefore);
      setBeforeStatus('idle');
    } catch (error) {
      console.error(error);
      setRules(null);
      setBefore(null);
      setBeforeStatus('error');
    }
  }

  async function runAfterAnalysis(force = false) {
    if (!rules || !agreed) return;
    setAfterStatus('loading');
    setObjection(null);
    setObjectionStatus('idle');
    setAccepted(false);
    try {
      const result = await analyzeAfter(demoCase.id, demoCase.version, rules.criteria, force);
      if (!result.ok) throw new Error(result.error);
      setAfter(result.data);
      setAfterCached(result.cached);
      setAfterStatus('idle');
    } catch (error) {
      console.error(error);
      setAfter(null);
      setAfterStatus('error');
    }
  }

  async function runObjection(force = false) {
    if (!after) return;
    setObjectionStatus('loading');
    try {
      const result = await checkObjection(demoCase.id, demoCase.version, 'O2', force);
      if (!result.ok) throw new Error(result.error);
      setObjection(result.data);
      setObjectionStatus('idle');
    } catch (error) {
      console.error(error);
      setObjection(null);
      setObjectionStatus('error');
    }
  }

  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <button className="text-button" onClick={onBack}>← ContriPact</button>
        <div className="phase-pill">{mode === 'before' ? t.before : t.after}</div>
        <div className="language-switch" aria-label={language === 'zh' ? '语言' : 'Language'}>
          <button className={language === 'en' ? 'active' : ''} onClick={() => onLanguage('en')}>EN</button><span>/</span>
          <button className={language === 'zh' ? 'active' : ''} onClick={() => onLanguage('zh')}>中文</button>
        </div>
      </header>

      <section className="case-header">
        <div><p className="eyebrow">{t.preparedCase}</p><h1>{t.caseTitle}</h1></div>
        <div className="prize"><span>{t.rewardPool}</span><strong>¥{demoCase.prizePoolCny.toLocaleString()}</strong></div>
      </section>

      <ModeSwitch language={language} mode={mode} afterUnlocked={agreed} onMode={setMode} />

      <section className="brief-card">
        <div><p className="eyebrow">{t.brief}</p><p>{localCase.competitionBrief}</p></div>
        {mode === 'before' && <button className="analysis-button" disabled={beforeStatus === 'loading'} onClick={runBeforeAnalysis}>
          {beforeStatus === 'loading' ? t.analyzing : rules ? t.rerun : t.run}
        </button>}
      </section>

      {beforeStatus === 'error' && <section className="error-state"><strong>{t.analysisUnavailable}</strong><p>{t.unavailableExplanation}</p><button onClick={runBeforeAnalysis}>{t.retry}</button></section>}
      {rules && <RulePanel analysis={rules} language={language} />}

      {mode === 'before' && before && <>
        <BeforeMap analysis={before} language={language} />
        <section className={`agreement-card ${agreed ? 'accepted' : ''}`}>
          <div><p className="eyebrow">{t.humanCheckpoint}</p><h2>{agreed ? t.agreed : t.referenceQuestion}</h2><p>{t.referenceExplanation}</p></div>
          <button onClick={() => setAgreed(true)} disabled={agreed}>{agreed ? t.agreedButton : t.agree}</button>
        </section>
      </>}

      {mode === 'after' && agreed && <>
        <MemberEvidence language={language} analysis={after} />
        <section className="after-action-bar">
          <div><p className="eyebrow">{t.aiAnalysis}</p><p>{t.proposalNote}</p></div>
          <button className="analysis-button" disabled={afterStatus === 'loading'} onClick={() => runAfterAnalysis(false)}>
            {afterStatus === 'loading' ? t.analyzingEvidence : after ? t.reanalyzeEvidence : t.analyzeEvidence}
          </button>
        </section>
        {afterStatus === 'error' && <section className="error-state"><strong>{t.analysisUnavailable}</strong><p>{t.unavailableExplanation}</p><button onClick={() => runAfterAnalysis(true)}>{t.retry}</button></section>}
        {after && <>
          <RewardProposal language={language} analysis={after} cached={afterCached} />
          <ObjectionPanel language={language} result={objection} status={objectionStatus} onCheck={() => runObjection(false)} onRetry={() => runObjection(true)} onReanalyze={() => runAfterAnalysis(true)} />
          {objection?.recommendation_action === 'keep' && <FinalAgreement language={language} analysis={after} accepted={accepted} onAccept={() => setAccepted(true)} />}
        </>}
      </>}
    </main>
  );
}
