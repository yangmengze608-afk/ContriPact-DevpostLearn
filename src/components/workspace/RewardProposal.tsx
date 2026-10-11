import { demoCase } from '../../data/demoCase';
import type { Language } from '../../i18n/copy';
import { copy, presentAfterSummary } from '../../i18n/copy';
import type { AfterAnalysis } from '../../lib/api';
import { amountFromPercent, formatCny } from '../../lib/money';

type Props = { language: Language; analysis: AfterAnalysis; cached: boolean };

export function RewardProposal({ language, analysis, cached }: Props) {
  const t = copy[language];
  const totalPercent = analysis.members.reduce((sum, m) => sum + m.suggested_share_percent, 0);
  const totalCny = analysis.members.reduce((sum, m) => sum + amountFromPercent(demoCase.prizePoolCny, m.suggested_share_percent), 0);
  return (
    <section className="proposal-card">
      <div className="proposal-heading">
        <div><p className="eyebrow">04 · {t.proposal}</p><h2>{t.proposal}</h2><p>{t.proposalNote}</p></div>
        <span className="source-badge">{cached ? t.validatedCache : t.liveInference}</span>
      </div>
      <div className="proposal-list">
        {analysis.members.map((member) => {
          const amount = amountFromPercent(demoCase.prizePoolCny, member.suggested_share_percent);
          return <div className="proposal-row" key={member.member}>
            <strong>{t.member} {member.member}</strong>
            <div><span>{t.suggestedShare}</span><b>{member.suggested_share_percent}%</b></div>
            <div><span>{t.amount}</span><b>{formatCny(amount)}</b></div>
          </div>;
        })}
        <div className="proposal-row total-row"><strong>{t.total}</strong><div><b>{totalPercent}%</b></div><div><b>{formatCny(totalCny)}</b></div></div>
      </div>
      <p className="proposal-summary">{presentAfterSummary(language, analysis.summary)}</p>
    </section>
  );
}
