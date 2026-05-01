import { useState } from 'react';
import { useCVStore, type SkillLevel } from '@/store/cvStore';
import { useTranslation } from 'react-i18next';
import { Plus, X, Sparkles } from 'lucide-react';

const LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
const LEVEL_PCT: Record<SkillLevel, number> = {
  beginner: 25,
  intermediate: 55,
  advanced: 80,
  expert: 100,
};

const POPULAR = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'SQL',
  'Tailwind CSS',
  'Figma',
  'AWS',
  'Docker',
  'Git',
];

const SkillsForm = () => {
  const { t } = useTranslation();
  const { cvData, addSkill, updateSkill, removeSkill, language } = useCVStore();
  const { skills } = cvData;
  const [draft, setDraft] = useState<{ name: string; level: SkillLevel }>({
    name: '',
    level: 'advanced',
  });

  const submit = () => {
    if (!draft.name.trim()) return;
    addSkill(draft);
    setDraft({ name: '', level: 'advanced' });
  };

  return (
    <div className="space-y-5">
      {skills.length > 0 && (
        <div className="space-y-3">
          {skills.map((s) => (
            <div key={s.id} className="card p-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => updateSkill(s.id, { name: e.target.value })}
                  className="field"
                  placeholder={t('skillName')}
                />
                <button onClick={() => removeSkill(s.id)} className="text-rose-500 opacity-60 hover:opacity-100" aria-label="remove">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${LEVEL_PCT[s.level]}%`,
                      background: 'linear-gradient(90deg, rgb(var(--accent)) 0%, rgb(var(--accent-strong)) 100%)',
                    }}
                  />
                </div>
                <select
                  value={s.level}
                  onChange={(e) => updateSkill(s.id, { level: e.target.value as SkillLevel })}
                  className="field !py-1.5 !w-auto text-xs"
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {t(`level_${lvl}` as const)}
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
          <Plus className="w-4 h-4" /> {t('addSkill')}
        </h4>
        <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3">
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="field"
            placeholder={language === 'ar' ? 'مثال: TypeScript' : 'e.g. TypeScript'}
          />
          <select
            value={draft.level}
            onChange={(e) => setDraft({ ...draft, level: e.target.value as SkillLevel })}
            className="field"
          >
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {t(`level_${lvl}` as const)}
              </option>
            ))}
          </select>
          <button onClick={submit} disabled={!draft.name.trim()} className="btn-primary">
            <Plus className="w-4 h-4" /> {t('add')}
          </button>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
          <Sparkles className="w-4 h-4 text-accent" /> {t('popularSkills')}
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR.filter((p) => !skills.some((s) => s.name.toLowerCase() === p.toLowerCase())).map((s) => (
            <button
              key={s}
              onClick={() => addSkill({ name: s, level: 'advanced' })}
              className="chip hover:bg-accent/10 hover:text-accent-strong dark:hover:text-white transition"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
