import type { Language } from '../../i18n/copy';
import { copy, presentCriterionName, presentCriterionQuote, presentCriterionReason } from '../../i18n/copy';
import type { RulesAnalysis } from '../../lib/api';

export function RulePanel({ analysis, language }: { analysis: RulesAnalysis; language: Language }) {
  const t = copy[language];
  return (
    <section className="panel">
      <div className="section-heading"><span>01</span><div><p>{t.judgingCriteria}</p><h2>{t.judgingQuestion}</h2></div></div>
      <div className="criterion-list">
        {analysis.criteria.map((criterion) => (
          <article className="criterion-row" key={criterion.name}>
            <div className="weight">{criterion.weight}%</div>
            <div className="criterion-body">
              <h3>{presentCriterionName(language, criterion.name)}</h3>
              <p>{presentCriterionReason(language, criterion.name, criterion.reason)}</p>
              <blockquote>“{presentCriterionQuote(language, criterion.name, criterion.evidence_quote)}”</blockquote>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
