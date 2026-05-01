import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

const empty = { school: '', degree: '', field: '', startDate: '', endDate: '', description: '' };

const EducationForm = () => {
  const { t } = useTranslation();
  const { cvData, addEducation, updateEducation, removeEducation, language } = useCVStore();
  const { education } = cvData;
  const [draft, setDraft] = useState(empty);

  const submit = () => {
    if (!draft.school || !draft.degree) return;
    addEducation(draft);
    setDraft(empty);
  };

  return (
    <div className="space-y-5">
      {education.map((edu) => (
        <div key={edu.id} className="card p-5 group">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent-strong dark:text-white flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {edu.degree || t('degree')} {edu.field && `· ${edu.field}`}
                </div>
                <div className="text-xs text-slate-500">{edu.school}</div>
              </div>
            </div>
            <button
              onClick={() => removeEducation(edu.id)}
              className="opacity-60 hover:opacity-100 text-rose-500 transition"
              aria-label="remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <FieldInput label={t('school')} value={edu.school} onChange={(v) => updateEducation(edu.id, { school: v })} />
            <FieldInput label={t('degree')} value={edu.degree} onChange={(v) => updateEducation(edu.id, { degree: v })} />
            <FieldInput label={t('field')} value={edu.field} onChange={(v) => updateEducation(edu.id, { field: v })} />
            <div className="grid grid-cols-2 gap-2">
              <DateInput label={t('startDate')} value={edu.startDate} onChange={(v) => updateEducation(edu.id, { startDate: v })} />
              <DateInput label={t('endDate')} value={edu.endDate} onChange={(v) => updateEducation(edu.id, { endDate: v })} />
            </div>
          </div>
          <div className="mt-3">
            <label className="label">{t('description')}</label>
            <textarea
              value={edu.description}
              onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
              rows={2}
              className="field"
              placeholder={language === 'ar' ? 'إنجازات، تخصصات فرعية، معدل تراكمي...' : 'Honors, focus areas, GPA…'}
            />
          </div>
        </div>
      ))}

      <div className="card border-dashed p-5">
        <h4 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-4">
          <Plus className="w-4 h-4" /> {t('add')} {t('education')}
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          <FieldInput
            label={`${t('school')} *`}
            value={draft.school}
            onChange={(v) => setDraft({ ...draft, school: v })}
            placeholder={language === 'ar' ? 'جامعة الملك سعود' : 'King Saud University'}
          />
          <FieldInput
            label={`${t('degree')} *`}
            value={draft.degree}
            onChange={(v) => setDraft({ ...draft, degree: v })}
            placeholder={language === 'ar' ? 'بكالوريوس' : "Bachelor's"}
          />
          <FieldInput
            label={t('field')}
            value={draft.field}
            onChange={(v) => setDraft({ ...draft, field: v })}
            placeholder={language === 'ar' ? 'علوم الحاسب' : 'Computer Science'}
          />
          <div className="grid grid-cols-2 gap-2">
            <DateInput label={t('startDate')} value={draft.startDate} onChange={(v) => setDraft({ ...draft, startDate: v })} />
            <DateInput label={t('endDate')} value={draft.endDate} onChange={(v) => setDraft({ ...draft, endDate: v })} />
          </div>
        </div>
        <div className="mt-3">
          <label className="label">{t('description')}</label>
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            rows={2}
            className="field"
          />
        </div>
        <button onClick={submit} disabled={!draft.school || !draft.degree} className="btn-primary mt-4 text-xs">
          <Plus className="w-3.5 h-3.5" /> {t('add')}
        </button>
      </div>
    </div>
  );
};

function FieldInput({
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

function DateInput({
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

export default EducationForm;
