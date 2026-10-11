import { demoCase } from '../../data/demoCase';
import type { Language } from '../../i18n/copy';
import { caseCopy, copy, presentAfterReason, presentCriterionName } from '../../i18n/copy';
import type { AfterAnalysis } from '../../lib/api';

type Props = { language: Language; analysis: AfterAnalysis | null };

export function MemberEvidence({ language, analysis }: Props) {
  const t = copy[language];
  const localCase = caseCopy[language];
  const byMember = new Map(analysis?.members.map((m) => [m.member, m]));
  return (
    <section className="panel">
      <div className="section-heading"><span>03</span><div><p>{t.actualEvidence}</p><h2>{t.afterQuestion}</h2></div></div>
      <div className="evidence-grid">
        {demoCase.actualContributions.map((member) => {
          const interpretation = byMember.get(member.member);
          return (
            <article className="evidence-card" key={member.member}>
              <div className="evidence-card-head"><strong>{t.member} {member.member}</strong>{interpretation && <span className={`relevance ${interpretation.contribution_relevance.toLowerCase()}`}>{t.relevance[interpretation.contribution_relevance]}</span>}</div>
              <div className="raw-evidence-block">
                <p className="mini-label">{t.rawEvidence}</p>
                {member.evidence.map((e) => <div className="evidence-line" key={e.id}><span>{e.id}</span><p>{localCase.evidence[e.id]}</p></div>)}
              </div>
              {interpretation && <div className="interpretation-block">
                <p className="mini-label">{t.aiInterpretation}</p>
                <p>{presentAfterReason(language, member.member, interpretation.reason)}</p>
                <div className="trace-row"><span>{t.evidenceUsed}</span>{interpretation.evidence_ids.map((id) => <code key={id}>{id}</code>)}</div>
                <div className="criterion-tags">{interpretation.linked_criteria.map((c) => <span key={c}>{presentCriterionName(language, c)}</span>)}</div>
              </div>}
            </article>
          );
        })}
      </div>
    </section>
  );
}
