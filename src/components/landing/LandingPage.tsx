import type { Language } from '../../i18n/copy';
import { copy } from '../../i18n/copy';
import { InkField } from './InkField';

type Props = { language: Language; onLanguage: (language: Language) => void; onEnter: () => void };

export function LandingPage({ language, onLanguage, onEnter }: Props) {
  const t = copy[language];
  return (
    <main className="landing-shell">
      <nav className="topbar">
        <div className="wordmark">{t.brand}</div>
        <div className="language-switch" aria-label={language === 'zh' ? '语言' : 'Language'}>
          <button className={language === 'en' ? 'active' : ''} onClick={() => onLanguage('en')}>EN</button>
          <span>/</span>
          <button className={language === 'zh' ? 'active' : ''} onClick={() => onLanguage('zh')}>中文</button>
        </div>
      </nav>
      <section className="hero">
        <InkField />
        <p className="eyebrow">{t.landingEyebrow}</p>
        {language === 'zh' ? (
          <h1 className="zh-headline"><span>{t.headlineLine1}</span><span>{t.headlineLine2}</span></h1>
        ) : (
          <h1>{t.headline}</h1>
        )}
        <p className="hero-copy">{t.subheadLead}{language === 'zh' && <br />}<strong>{t.subheadStrong}</strong></p>
        <button className="primary-action" onClick={onEnter}>{t.enter}<span>→</span></button>
        <div className="principles" aria-label={language === 'zh' ? '产品原则' : 'Product principles'}>
          {t.principles.map((principle) => <span key={principle}>{principle}</span>)}
        </div>
      </section>
    </main>
  );
}
