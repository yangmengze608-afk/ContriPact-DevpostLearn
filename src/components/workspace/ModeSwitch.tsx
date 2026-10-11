import type { Language } from '../../i18n/copy';
import { copy } from '../../i18n/copy';

type Props = {
  language: Language;
  mode: 'before' | 'after';
  afterUnlocked: boolean;
  onMode: (mode: 'before' | 'after') => void;
};

export function ModeSwitch({ language, mode, afterUnlocked, onMode }: Props) {
  const t = copy[language];
  return (
    <section className="mode-switch-wrap">
      <div className="mode-switch" role="tablist" aria-label={language === 'zh' ? '项目阶段' : 'Project phase'}>
        <button className={mode === 'before' ? 'active' : ''} onClick={() => onMode('before')}>{t.before}</button>
        <button className={mode === 'after' ? 'active' : ''} disabled={!afterUnlocked} onClick={() => onMode('after')}>{t.after}</button>
      </div>
      {!afterUnlocked && <p className="mode-hint">{t.afterLocked}</p>}
    </section>
  );
}
