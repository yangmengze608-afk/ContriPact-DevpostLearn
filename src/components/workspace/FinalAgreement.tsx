import { demoCase } from '../../data/demoCase';
import type { Language } from '../../i18n/copy';
import { copy } from '../../i18n/copy';
import type { AfterAnalysis } from '../../lib/api';
import { amountFromPercent, formatCny } from '../../lib/money';

type Props = { language: Language; analysis: AfterAnalysis; accepted: boolean; onAccept: () => void };

export function FinalAgreement({ language, analysis, accepted, onAccept }: Props) {
  const t = copy[language];
  return (
    <section className={`final-card ${accepted ? 'accepted' : ''}`}>
      <div className="section-heading"><span>06</span><div><p>{t.finalAgreement}</p><h2>{accepted ? t.acceptedTitle : t.finalAgreement}</h2></div></div>
      <div className="authority-line"><span>{t.aiRecommended}</span><i>→</i><strong>{t.teamAccepted}</strong></div>
      <div className="final-allocation">
        {analysis.members.map((member) => <div key={member.member}><strong>{t.member} {member.member}</strong><span>{member.suggested_share_percent}% · {formatCny(amountFromPercent(demoCase.prizePoolCny, member.suggested_share_percent))}</span></div>)}
      </div>
      {accepted ? <div className="accepted-message"><p>{t.acceptedExplanation}</p><strong>{t.finalAuthority}</strong></div> : <button className="accept-button" onClick={onAccept}>{t.acceptProposal}</button>}
    </section>
  );
}
