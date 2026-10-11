import { useEffect, useState } from 'react';
import { LandingPage } from '../components/landing/LandingPage';
import { Workspace } from '../components/workspace/Workspace';
import type { Language } from '../i18n/copy';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [screen, setScreen] = useState<'landing' | 'workspace'>('landing');

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);

  return screen === 'landing'
    ? <LandingPage language={language} onLanguage={setLanguage} onEnter={() => setScreen('workspace')} />
    : <Workspace language={language} onLanguage={setLanguage} onBack={() => setScreen('landing')} />;
}
