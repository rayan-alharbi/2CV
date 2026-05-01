import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { useEffect } from 'react';
import i18n from '@/i18n';
import Home from '@/pages/Home';
import CreateCV from '@/pages/CreateCV';
import Templates from '@/pages/Templates';
import DownloadPage from '@/pages/Download';
import { useCVStore, ACCENT_COLORS } from '@/store/cvStore';

function hexToRgbTriplet(hex: string): string {
  const v = hex.replace('#', '');
  const n = parseInt(v.length === 3 ? v.split('').map((c) => c + c).join('') : v, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

function AppContent() {
  const { language, theme, accentColor } = useCVStore();

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = i18n.dir(language);
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const c = ACCENT_COLORS[accentColor];
    const root = document.documentElement;
    root.style.setProperty('--accent', hexToRgbTriplet(c.hex));
    root.style.setProperty('--accent-soft', hexToRgbTriplet(c.light));
    root.style.setProperty('--accent-strong', hexToRgbTriplet(c.dark));
  }, [accentColor]);

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors ${
        language === 'ar' ? 'font-arabic' : 'font-sans'
      }`}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCV />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/download" element={<DownloadPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
}
