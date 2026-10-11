import { demoCase } from '../../data/demoCase';
import type { Language } from '../../i18n/copy';
import { caseCopy, copy, presentCriterionName, presentTaskReason } from '../../i18n/copy';
import type { BeforeAnalysis } from '../../lib/api';

export function BeforeMap({ analysis, language }: { analysis: BeforeAnalysis; language: Language }) {
  const t = copy[language];
  const localCase = caseCopy[language];
  const taskById = new Map(demoCase.plannedTasks.map((task) => [task.id, task]));
  return (
    <section className="panel">
      <div className="section-heading"><span>02</span><div><p>{t.contributionMap}</p><h2>{t.contributionQuestion}</h2></div></div>
      <div className="task-list">
        {analysis.tasks.map((item) => {
          const task = taskById.get(item.task_id);
          const taskText = localCase.tasks[item.task_id as keyof typeof localCase.tasks] ?? task?.task;
          return (
            <article className="task-row" key={item.task_id}>
              <div className={`relevance ${item.contribution_relevance.toLowerCase()}`}>{t.relevance[item.contribution_relevance]}</div>
              <div className="task-body">
                <div className="task-meta"><strong>{item.task_id} · {t.member} {task?.owner}</strong></div>
                <h3>{taskText}</h3>
                <p>{presentTaskReason(language, item.task_id, item.reason)}</p>
                <div className="criterion-tags">
                  {item.linked_criteria.length ? item.linked_criteria.map((c) => <span key={c}>{presentCriterionName(language, c)}</span>) : <span className="muted-tag">{t.noDirectCriterion}</span>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
