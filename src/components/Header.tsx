import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useCVStore } from '@/store/cvStore';
import { Globe, Sun, Moon, Menu, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const { t } = useTranslation();
  const { language, theme, setLanguage, toggleTheme } = useCVStore();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = [
    { to: '/', label: t('home') },
    { to: '/create', label: t('createCV') },
    { to: '/templates', label: t('templates') },
    { to: '/download', label: t('download') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass border-b border-slate-200/60 dark:border-white/10 shadow-soft'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl shadow-soft flex items-center justify-center overflow-hidden"
                 style={{ background: 'linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent-strong)) 100%)' }}>
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">{t('brand')}</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full glass">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  'relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
                  isActive(l.to)
                    ? 'text-white shadow-soft'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                )}
                style={
                  isActive(l.to)
                    ? { background: 'linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent-strong)) 100%)' }
                    : undefined
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                         text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
              title={language === 'ar' ? 'English' : 'العربية'}
            >
              <Globe className="w-4 h-4" />
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
              title={theme === 'light' ? t('dark') : t('light')}
              aria-label="toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5 w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
            </button>

            <Link to="/create" className="hidden md:inline-flex btn-primary py-2 px-4 text-xs">
              {t('createCVNow')}
            </Link>

            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
              aria-label="menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden py-3 border-t border-slate-200/70 dark:border-white/10 animate-fade-up">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium',
                    isActive(l.to)
                      ? 'bg-accent/10 text-accent-strong dark:text-white'
                      : 'text-slate-700 dark:text-slate-200'
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="mt-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 text-left"
              >
                <Globe className="inline w-4 h-4 me-2" />
                {language === 'ar' ? 'English' : 'العربية'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
