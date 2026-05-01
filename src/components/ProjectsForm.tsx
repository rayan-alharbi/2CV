import { useState } from 'react';
import { useCVStore } from '@/store/cvStore';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, ExternalLink, Folder } from 'lucide-react';

const empty = { name: '', description: '', link: '', tech: '' };

const ProjectsForm = () => {
  const { t } = useTranslation();
  const { cvData, addProject, updateProject, removeProject, language } = useCVStore();
  const { projects } = cvData;
  const [draft, setDraft] = useState(empty);

  const submit = () => {
    if (!draft.name.trim()) return;
    addProject(draft);
    setDraft(empty);
  };

  const examples = [
    { name: 'Portfolio site', tech: 'React, Tailwind' },
    { name: 'E-commerce platform', tech: 'Next.js, Stripe' },
    { name: 'Realtime chat', tech: 'WebSocket, Node.js' },
    { name: 'Task manager', tech: 'React, PostgreSQL' },
  ];

  return (
    <div className="space-y-5">
      {projects.map((p) => (
        <div key={p.id} className="card p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent-strong dark:text-white flex items-center justify-center">
                <Folder className="w-4 h-4" />
              </div>
              <input
                value={p.name}
                onChange={(e) => updateProject(p.id, { name: e.target.value })}
                className="field"
                placeholder={t('projectName')}
              />
            </div>
            <button onClick={() => removeProject(p.id)} className="text-rose-500 opacity-60 hover:opacity-100 ms-2" aria-label="remove">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid gap-3">
            <div>
              <label className="label">{t('description')}</label>
              <textarea
                value={p.description}
                onChange={(e) => updateProject(p.id, { description: e.target.value })}
                rows={2}
                className="field"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label">{t('projectTech')}</label>
                <input
                  value={p.tech}
                  onChange={(e) => updateProject(p.id, { tech: e.target.value })}
                  className="field"
                  placeholder="React, TypeScript, Tailwind"
                />
              </div>
              <div>
                <label className="label">{t('projectLink')}</label>
                <div className="flex gap-2">
                  <input
                    value={p.link}
                    onChange={(e) => updateProject(p.id, { link: e.target.value })}
                    className="field"
                    placeholder="https://…"
                    dir="ltr"
                  />
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-soft !px-3">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="card border-dashed p-5">
        <h4 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-4">
          <Plus className="w-4 h-4" /> {t('addProject')}
        </h4>
        <div className="grid gap-3">
          <div>
            <label className="label">{t('projectName')} *</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="field"
              placeholder={language === 'ar' ? 'تطبيق إدارة المهام' : 'Task Manager'}
            />
          </div>
          <div>
            <label className="label">{t('description')}</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={2}
              className="field"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">{t('projectTech')}</label>
              <input
                value={draft.tech}
                onChange={(e) => setDraft({ ...draft, tech: e.target.value })}
                className="field"
                placeholder="React, Node.js"
              />
            </div>
            <div>
              <label className="label">{t('projectLink')}</label>
              <input
                value={draft.link}
                onChange={(e) => setDraft({ ...draft, link: e.target.value })}
                className="field"
                placeholder="https://github.com/…"
                dir="ltr"
              />
            </div>
          </div>
          <button onClick={submit} disabled={!draft.name.trim()} className="btn-primary self-start text-xs">
            <Plus className="w-3.5 h-3.5" /> {t('add')}
          </button>
        </div>
      </div>

      <div className="card p-5">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">{t('projectExamples')}</div>
        <div className="flex flex-wrap gap-2">
          {examples.map((p) => (
            <button
              key={p.name}
              onClick={() => setDraft({ ...empty, name: p.name, tech: p.tech })}
              className="chip hover:bg-accent/10 hover:text-accent-strong dark:hover:text-white transition"
            >
              + {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsForm;
