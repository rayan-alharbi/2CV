import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Briefcase } from 'lucide-react';

const empty = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
};

const ExperienceForm = () => {
  const { t } = useTranslation();
  const { cvData, addExperience, updateExperience, removeExperience, language } = useCVStore();
  const { experience } = cvData;
  const [draft, setDraft] = useState(empty);

  const submit = () => {
    if (!draft.company || !draft.position) return;
    addExperience(draft);
    setDraft(empty);
  };

  return (
    <div className="space-y-5">
      {experience.map((exp) => (
        <div key={exp.id} className="card p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent-strong dark:text-white flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{exp.position || t('position')}</div>
                <div className="text-xs text-slate-500">{exp.company}</div>
              </div>
            </div>
            <button onClick={() => removeExperience(exp.id)} className="opacity-60 hover:opacity-100 text-rose-500" aria-label="remove">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label={t('company')} value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} />
            <Field label={t('position')} value={exp.position} onChange={(v) => updateExperience(exp.id, { position: v })} />
            <DateField label={t('startDate')} value={exp.startDate} onChange={(v) => updateExperience(exp.id, { startDate: v })} />
            <div>
              <label className="label">{t('endDate')}</label>
              <div className="flex gap-2">
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value, current: false })}
                  className="field"
                  disabled={exp.current}
                  dir="ltr"
                />
              </div>
              <label className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
                  className="rounded border-slate-300"
                />
                {t('currentlyHere')}
              </label>
            </div>
          </div>

          <div className="mt-3">
            <label className="label">{t('description')}</label>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
              rows={3}
              className="field"
              placeholder={language === 'ar' ? 'استخدم نقاطًا قصيرة بأرقام وإنجازات...' : 'Use short bullets with metrics and impact…'}
            />
          </div>
        </div>
      ))}

      <div className="card border-dashed p-5">
        <h4 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-4">
          <Plus className="w-4 h-4" /> {t('add')} {t('experience')}
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field
            label={`${t('company')} *`}
            value={draft.company}
            onChange={(v) => setDraft({ ...draft, company: v })}
            placeholder={language === 'ar' ? 'شركة التقنية' : 'Tech Co.'}
          />
          <Field
            label={`${t('position')} *`}
            value={draft.position}
            onChange={(v) => setDraft({ ...draft, position: v })}
            placeholder={language === 'ar' ? 'مهندس برمجيات' : 'Software Engineer'}
          />
          <DateField label={t('startDate')} value={draft.startDate} onChange={(v) => setDraft({ ...draft, startDate: v })} />
          <div>
            <label className="label">{t('endDate')}</label>
            <input
              type="month"
              value={draft.endDate}
              onChange={(e) => setDraft({ ...draft, endDate: e.target.value, current: false })}
              className="field"
              disabled={draft.current}
              dir="ltr"
            />
            <label className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={draft.current}
                onChange={(e) => setDraft({ ...draft, current: e.target.checked, endDate: e.target.checked ? '' : draft.endDate })}
                className="rounded border-slate-300"
              />
              {t('currentlyHere')}
            </label>
          </div>
        </div>
        <div className="mt-3">
          <label className="label">{t('description')}</label>
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            rows={3}
            className="field"
          />
        </div>
        <button onClick={submit} disabled={!draft.company || !draft.position} className="btn-primary mt-4 text-xs">
          <Plus className="w-3.5 h-3.5" /> {t('add')}
        </button>
      </div>
    </div>
  );
};

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="field" placeholder={placeholder} />
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="month" value={value} onChange={(e) => onChange(e.target.value)} className="field" dir="ltr" />
    </div>
  );
}

export default ExperienceForm;
