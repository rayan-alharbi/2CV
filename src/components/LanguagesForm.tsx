import { useState } from 'react';
import { useCVStore, type Proficiency } from '@/store/cvStore';
import { useTranslation } from 'react-i18next';
import { Plus, X, Languages } from 'lucide-react';

const LEVELS: Proficiency[] = ['basic', 'conversational', 'fluent', 'native'];
const PROF_PCT: Record<Proficiency, number> = { basic: 25, conversational: 55, fluent: 80, native: 100 };

const LanguagesForm = () => {
  const { t } = useTranslation();
  const { cvData, addLanguage, updateLanguage, removeLanguage, language } = useCVStore();
  const { languages } = cvData;
  const [draft, setDraft] = useState<{ name: string; proficiency: Proficiency }>({
    name: '',
    proficiency: 'fluent',
  });

  const submit = () => {
    if (!draft.name.trim()) return;
    addLanguage(draft);
    setDraft({ name: '', proficiency: 'fluent' });
  };

  const common = [
    { code: 'ar', name: language === 'ar' ? 'العربية' : 'Arabic' },
    { code: 'en', name: language === 'ar' ? 'الإنجليزية' : 'English' },
    { code: 'fr', name: language === 'ar' ? 'الفرنسية' : 'French' },
    { code: 'es', name: language === 'ar' ? 'الإسبانية' : 'Spanish' },
    { code: 'de', name: language === 'ar' ? 'الألمانية' : 'German' },
    { code: 'tr', name: language === 'ar' ? 'التركية' : 'Turkish' },
    { code: 'zh', name: language === 'ar' ? 'الصينية' : 'Chinese' },
    { code: 'ja', name: language === 'ar' ? 'اليابانية' : 'Japanese' },
  ];

  return (
    <div className="space-y-5">
      {languages.length > 0 && (
        <div className="space-y-3">
          {languages.map((l) => (
            <div key={l.id} className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent-strong dark:text-white flex items-center justify-center">
                  <Languages className="w-4 h-4" />
                </div>
                <input
                  value={l.name}
                  onChange={(e) => updateLanguage(l.id, { name: e.target.value })}
                  className="field"
                  placeholder={t('languageLabel')}
                />
                <button onClick={() => removeLanguage(l.id)} className="text-rose-500 opacity-60 hover:opacity-100" aria-label="remove">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${PROF_PCT[l.proficiency]}%`,
                      background: 'linear-gradient(90deg, rgb(var(--accent)) 0%, rgb(var(--accent-strong)) 100%)',
                    }}
                  />
                </div>
                <select
                  value={l.proficiency}
                  onChange={(e) => updateLanguage(l.id, { proficiency: e.target.value as Proficiency })}
                  className="field !py-1.5 !w-auto text-xs"
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {t(`prof_${lvl}` as const)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card border-dashed p-5">
        <h4 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-4">
          <Plus className="w-4 h-4" /> {t('addLanguage')}
        </h4>
        <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3">
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="field"
            placeholder={language === 'ar' ? 'الإنجليزية' : 'English'}
          />
          <select
            value={draft.proficiency}
            onChange={(e) => setDraft({ ...draft, proficiency: e.target.value as Proficiency })}
            className="field"
          >
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {t(`prof_${lvl}` as const)}
              </option>
            ))}
          </select>
          <button onClick={submit} disabled={!draft.name.trim()} className="btn-primary">
            <Plus className="w-4 h-4" /> {t('add')}
          </button>
        </div>
      </div>

      <div className="card p-5">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">{t('commonLanguages')}</div>
        <div className="flex flex-wrap gap-2">
          {common
            .filter((c) => !languages.some((l) => l.name === c.name))
            .map((c) => (
              <button
                key={c.code}
                onClick={() => addLanguage({ name: c.name, proficiency: 'fluent' })}
                className="chip hover:bg-accent/10 hover:text-accent-strong dark:hover:text-white transition"
              >
                + {c.name}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LanguagesForm;
