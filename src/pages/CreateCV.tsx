import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Sparkles,
  Eye,
  Pencil,
  Check,
  RefreshCw,
  User,
  GraduationCap,
  Briefcase,
  Star,
  Languages as LangIcon,
  Folder,
} from 'lucide-react';
import { useCVStore } from '@/store/cvStore';
import Header from '@/components/Header';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import EducationForm from '@/components/EducationForm';
import ExperienceForm from '@/components/ExperienceForm';
import SkillsForm from '@/components/SkillsForm';
import LanguagesForm from '@/components/LanguagesForm';
import ProjectsForm from '@/components/ProjectsForm';
import CVPreview from '@/components/CVPreview';
import { cn } from '@/lib/utils';

const CreateCV = () => {
  const { t } = useTranslation();
  const { currentStep, setCurrentStep, language, cvData, markSaved, lastSavedAt, loadSample, resetCV } = useCVStore();
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

  const steps = useMemo(
    () => [
      { id: 0, key: 'personalInfo', icon: User, component: PersonalInfoForm },
      { id: 1, key: 'experience', icon: Briefcase, component: ExperienceForm },
      { id: 2, key: 'education', icon: GraduationCap, component: EducationForm },
      { id: 3, key: 'skills', icon: Star, component: SkillsForm },
      { id: 4, key: 'languages', icon: LangIcon, component: LanguagesForm },
      { id: 5, key: 'projects', icon: Folder, component: ProjectsForm },
    ],
    []
  );

  const safeStep = Math.min(Math.max(0, currentStep), steps.length - 1);
  const Current = steps[safeStep].component;

  useEffect(() => {
    const id = setTimeout(() => markSaved(), 600);
    return () => clearTimeout(id);
  }, [cvData, markSaved]);

  const isRtl = language === 'ar';
  const Prev = isRtl ? ChevronRight : ChevronLeft;
  const Next = isRtl ? ChevronLeft : ChevronRight;

  const progress = ((safeStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-5 sm:mb-7 card p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {t(steps[safeStep].key)}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('stepProgress', { current: safeStep + 1, total: steps.length })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SaveIndicator lastSavedAt={lastSavedAt} t={t} />
              <button onClick={loadSample} className="btn-ghost text-xs">
                <Sparkles className="w-3.5 h-3.5" /> {t('loadSample')}
              </button>
              <button
                onClick={() => {
                  if (confirm(language === 'ar' ? 'هل أنت متأكد من إعادة التعيين؟' : 'Reset all data?')) resetCV();
                }}
                className="btn-ghost text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" /> {t('reset')}
              </button>
            </div>
          </div>

          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, rgb(var(--accent)) 0%, rgb(var(--accent-strong)) 100%)',
              }}
            />
          </div>

          <div className="mt-4 flex gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
            {steps.map((s, i) => {
              const StepIcon = s.icon;
              const active = i === safeStep;
              const done = i < safeStep;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentStep(i)}
                  className={cn(
                    'shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition',
                    active
                      ? 'text-white shadow-soft'
                      : done
                      ? 'bg-accent/10 text-accent-strong dark:text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  )}
                  style={
                    active
                      ? { background: 'linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent-strong)) 100%)' }
                      : undefined
                  }
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : <StepIcon className="w-3.5 h-3.5" />}
                  <span>{t(s.key)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:hidden mb-4 grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-white/5">
          {(['edit', 'preview'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMobileView(m)}
              className={cn(
                'inline-flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition',
                mobileView === m ? 'bg-white dark:bg-slate-900 shadow-soft text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
              )}
            >
              {m === 'edit' ? <Pencil className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {m === 'edit' ? t('mobileFormTab') : t('mobilePreviewTab')}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className={cn('lg:block', mobileView === 'edit' ? 'block' : 'hidden')}>
            <div className="card p-5 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={safeStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Current />
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-7 pt-5 border-t border-slate-200 dark:border-white/10">
                <button
                  onClick={() => setCurrentStep(Math.max(0, safeStep - 1))}
                  disabled={safeStep === 0}
                  className="btn-ghost text-xs"
                >
                  <Prev className="w-4 h-4" /> {t('previous')}
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={markSaved} className="btn-soft text-xs">
                    <Save className="w-4 h-4" /> {t('save')}
                  </button>
                  {safeStep < steps.length - 1 ? (
                    <button onClick={() => setCurrentStep(safeStep + 1)} className="btn-primary text-xs">
                      {t('next')} <Next className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link to="/templates" className="btn-primary text-xs">
                      {t('templates')} <Next className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={cn('lg:block', mobileView === 'preview' ? 'block' : 'hidden')}>
            <div className="lg:sticky lg:top-24">
              <div className="card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                    {t('livePreview')}
                  </div>
                  <Link to="/templates" className="text-xs font-medium" style={{ color: 'rgb(var(--accent))' }}>
                    {t('chooseTemplate')}
                  </Link>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 max-h-[78vh] overflow-auto scrollbar-thin">
                  <div className="mx-auto" style={{ maxWidth: '820px' }}>
                    <div className="bg-white shadow-2xl rounded-md overflow-hidden">
                      <CVPreview />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function SaveIndicator({ lastSavedAt, t }: { lastSavedAt: number | null; t: (k: string) => string }) {
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((x) => x + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!lastSavedAt) return null;
  const diff = Math.max(1, Math.floor((Date.now() - lastSavedAt) / 1000));
  const text =
    diff < 60
      ? `${diff}s`
      : diff < 3600
      ? `${Math.floor(diff / 60)}m`
      : `${Math.floor(diff / 3600)}h`;
  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
      <Check className="w-3.5 h-3.5" /> {t('autosaved')} · {text}
    </div>
  );
}

export default CreateCV;
