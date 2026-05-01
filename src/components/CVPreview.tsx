import { useTranslation } from 'react-i18next';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Twitter,
  ExternalLink,
} from 'lucide-react';
import {
  ACCENT_COLORS,
  type CVData,
  type Proficiency,
  type SkillLevel,
  type TemplateId,
  useCVStore,
} from '@/store/cvStore';

const SKILL_PCT: Record<SkillLevel, number> = { beginner: 25, intermediate: 55, advanced: 80, expert: 100 };
const PROF_PCT: Record<Proficiency, number> = { basic: 25, conversational: 55, fluent: 80, native: 100 };

interface PreviewProps {
  template?: TemplateId;
  className?: string;
}

const CVPreview = ({ template, className = '' }: PreviewProps) => {
  const { t, i18n } = useTranslation();
  const { cvData, selectedTemplate, accentColor, language } = useCVStore();
  const tpl = template ?? selectedTemplate;
  const accent = ACCENT_COLORS[accentColor];
  const isRtl = language === 'ar';

  const fmtDate = (d: string) => {
    if (!d) return '';
    const [y, m] = d.split('-');
    if (!y) return d;
    if (!m) return y;
    try {
      const date = new Date(Number(y), Number(m) - 1);
      return new Intl.DateTimeFormat(i18n.language, { month: 'short', year: 'numeric' }).format(date);
    } catch {
      return d;
    }
  };

  const dateRange = (start: string, end: string, current?: boolean) => {
    const s = fmtDate(start);
    const e = current ? t('currentlyHere') : fmtDate(end);
    if (!s && !e) return '';
    return `${s}${s && e ? ' — ' : ''}${e}`;
  };

  if (!cvData.personalInfo.firstName && !cvData.personalInfo.lastName) {
    return (
      <div className={`flex items-center justify-center min-h-[420px] ${className}`}>
        <div className="text-center max-w-xs">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white shadow-soft"
            style={{ background: `linear-gradient(135deg, ${accent.hex} 0%, ${accent.dark} 100%)` }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{t('emptyPreviewTitle')}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('emptyPreviewDesc')}</p>
        </div>
      </div>
    );
  }

  const ctx = { data: cvData, accent: accent.hex, accentDark: accent.dark, accentLight: accent.light, isRtl, t, fmtDate, dateRange };

  return (
    <div className={`pdf-render bg-white text-slate-800 ${isRtl ? 'font-arabic' : ''} ${className}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {tpl === 'minimal' && <MinimalTpl {...ctx} />}
      {tpl === 'creative' && <CreativeTpl {...ctx} />}
      {tpl === 'classic' && <ClassicTpl {...ctx} />}
      {tpl === 'modern' && <ModernTpl {...ctx} />}
      {tpl === 'elegant' && <ElegantTpl {...ctx} />}
      {tpl === 'executive' && <ExecutiveTpl {...ctx} />}
    </div>
  );
};

interface Ctx {
  data: CVData;
  accent: string;
  accentDark: string;
  accentLight: string;
  isRtl: boolean;
  t: (k: string) => string;
  fmtDate: (d: string) => string;
  dateRange: (s: string, e: string, c?: boolean) => string;
}

function ContactRow({ data }: { data: CVData }) {
  const p = data.personalInfo;
  const items: Array<[any, string, string?]> = [];
  if (p.email) items.push([Mail, p.email, `mailto:${p.email}`]);
  if (p.phone) items.push([Phone, p.phone]);
  if (p.location) items.push([MapPin, p.location]);
  if (p.socials.linkedin) items.push([Linkedin, p.socials.linkedin.replace(/^https?:\/\//, ''), p.socials.linkedin]);
  if (p.socials.github) items.push([Github, p.socials.github.replace(/^https?:\/\//, ''), p.socials.github]);
  if (p.socials.website) items.push([Globe, p.socials.website.replace(/^https?:\/\//, ''), p.socials.website]);
  if (p.socials.twitter) items.push([Twitter, p.socials.twitter.replace(/^https?:\/\//, ''), p.socials.twitter]);
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
      {items.map(([Icon, label], i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 opacity-70" />
          <span>{label}</span>
        </span>
      ))}
    </div>
  );
}

function SectionTitle({ title, accent, variant = 'underline' }: { title: string; accent: string; variant?: 'underline' | 'bar' | 'plain' | 'serif' }) {
  if (variant === 'bar') {
    return (
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 rounded-full" style={{ background: accent }} />
        <h3 className="text-[13px] font-bold uppercase tracking-[0.18em] text-slate-700">{title}</h3>
      </div>
    );
  }
  if (variant === 'serif') {
    return (
      <h3 className="font-serif text-2xl text-slate-900 mb-3" style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 4 }}>
        {title}
      </h3>
    );
  }
  if (variant === 'plain') {
    return <h3 className="text-[13px] font-bold uppercase tracking-[0.2em] text-slate-700 mb-3">{title}</h3>;
  }
  return (
    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-1.5 mb-3 border-b border-slate-200">
      {title}
    </h3>
  );
}

/* ─────────────────── MODERN ─────────────────── */
function ModernTpl({ data, accent, accentDark, t, dateRange }: Ctx) {
  const p = data.personalInfo;
  return (
    <div className="grid grid-cols-12 min-h-[297mm]">
      <aside
        className="col-span-4 p-7 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(165deg, ${accent} 0%, ${accentDark} 100%)` }}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          {p.photo ? (
            <img src={p.photo} alt="" className="w-28 h-28 rounded-full object-cover border-4 border-white/40 mx-auto mb-5 shadow-xl" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/20 border-4 border-white/40 mx-auto mb-5 flex items-center justify-center text-3xl font-bold">
              {(p.firstName || '?')[0]}{(p.lastName || '')[0]}
            </div>
          )}

          <h1 className="text-2xl font-extrabold leading-tight">{p.firstName} {p.lastName}</h1>
          {p.jobTitle && <p className="text-white/85 text-sm mt-1">{p.jobTitle}</p>}

          <div className="mt-6 space-y-2 text-xs">
            {p.email && <Line icon={Mail}>{p.email}</Line>}
            {p.phone && <Line icon={Phone}>{p.phone}</Line>}
            {p.location && <Line icon={MapPin}>{p.location}</Line>}
            {p.socials.linkedin && <Line icon={Linkedin}>{p.socials.linkedin.replace(/^https?:\/\//, '')}</Line>}
            {p.socials.github && <Line icon={Github}>{p.socials.github.replace(/^https?:\/\//, '')}</Line>}
            {p.socials.website && <Line icon={Globe}>{p.socials.website.replace(/^https?:\/\//, '')}</Line>}
            {p.socials.twitter && <Line icon={Twitter}>{p.socials.twitter.replace(/^https?:\/\//, '')}</Line>}
          </div>

          {data.skills.length > 0 && (
            <div className="mt-7">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 mb-3">{t('skills')}</h3>
              <div className="space-y-2.5">
                {data.skills.map((s) => (
                  <div key={s.id}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium">{s.name}</span>
                      <span className="opacity-70">{t(`level_${s.level}` as any)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${SKILL_PCT[s.level]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.languages.length > 0 && (
            <div className="mt-7">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 mb-3">{t('languages')}</h3>
              <div className="space-y-2.5">
                {data.languages.map((l) => (
                  <div key={l.id}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium">{l.name}</span>
                      <span className="opacity-70">{t(`prof_${l.proficiency}` as any)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${PROF_PCT[l.proficiency]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="col-span-8 p-8">
        {p.summary && (
          <section className="mb-6">
            <SectionTitle title={t('personalSummaryTitle')} accent={accent} variant="bar" />
            <p className="text-[13px] leading-relaxed text-slate-700">{p.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-6">
            <SectionTitle title={t('experience')} accent={accent} variant="bar" />
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <Item
                  key={exp.id}
                  title={exp.position}
                  subtitle={exp.company}
                  meta={dateRange(exp.startDate, exp.endDate, exp.current)}
                  description={exp.description}
                  accent={accent}
                />
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="mb-6">
            <SectionTitle title={t('education')} accent={accent} variant="bar" />
            <div className="space-y-4">
              {data.education.map((e) => (
                <Item
                  key={e.id}
                  title={`${e.degree}${e.field ? ` · ${e.field}` : ''}`}
                  subtitle={e.school}
                  meta={dateRange(e.startDate, e.endDate)}
                  description={e.description}
                  accent={accent}
                />
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section>
            <SectionTitle title={t('projects')} accent={accent} variant="bar" />
            <div className="space-y-3">
              {data.projects.map((p) => (
                <ProjectItem key={p.id} project={p} accent={accent} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Line({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 opacity-80 shrink-0" />
      <span className="break-all">{children}</span>
    </div>
  );
}

function Item({
  title,
  subtitle,
  meta,
  description,
  accent,
}: {
  title: string;
  subtitle: string;
  meta?: string;
  description?: string;
  accent: string;
}) {
  return (
    <div className="pdf-item relative ps-4">
      <span className="absolute start-0 top-2 w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
      <div className="flex flex-wrap justify-between items-baseline gap-x-3">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        {meta && <span className="text-[11px] text-slate-500 tabular-nums">{meta}</span>}
      </div>
      <div className="text-[12px] font-medium" style={{ color: accent }}>
        {subtitle}
      </div>
      {description && <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-700 whitespace-pre-line">{description}</p>}
    </div>
  );
}

function ProjectItem({ project, accent }: { project: CVData['projects'][number]; accent: string }) {
  return (
    <div className="pdf-item relative ps-4">
      <span className="absolute start-0 top-2 w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-semibold text-slate-900">{project.name}</h4>
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[11px]" style={{ color: accent }}>
            <ExternalLink className="inline w-3 h-3" />
          </a>
        )}
      </div>
      {project.tech && <div className="text-[11px] text-slate-500">{project.tech}</div>}
      {project.description && <p className="mt-1 text-[12.5px] text-slate-700 leading-relaxed">{project.description}</p>}
    </div>
  );
}

/* ─────────────────── MINIMAL ─────────────────── */
function MinimalTpl({ data, accent, t, dateRange }: Ctx) {
  const p = data.personalInfo;
  return (
    <div className="p-10 max-w-[820px] mx-auto">
      <header className="mb-7 pb-5 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{p.firstName} {p.lastName}</h1>
        {p.jobTitle && <p className="text-base mt-1" style={{ color: accent }}>{p.jobTitle}</p>}
        <div className="mt-3"><ContactRow data={data} /></div>
      </header>

      {p.summary && (
        <section className="mb-6">
          <SectionTitle title={t('personalSummaryTitle')} accent={accent} variant="plain" />
          <p className="text-[13px] leading-relaxed text-slate-700">{p.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6">
          <SectionTitle title={t('experience')} accent={accent} variant="plain" />
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between gap-3 items-baseline">
                  <h4 className="text-sm font-semibold text-slate-900">{e.position}</h4>
                  <span className="text-[11px] text-slate-500 tabular-nums">{dateRange(e.startDate, e.endDate, e.current)}</span>
                </div>
                <div className="text-[12px] text-slate-600">{e.company}</div>
                {e.description && <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-700 whitespace-pre-line">{e.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-6">
          <SectionTitle title={t('education')} accent={accent} variant="plain" />
          <div className="space-y-3">
            {data.education.map((e) => (
              <div key={e.id} className="flex justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{e.degree} {e.field && `· ${e.field}`}</div>
                  <div className="text-[12px] text-slate-600">{e.school}</div>
                  {e.description && <p className="mt-1 text-[12px] text-slate-700">{e.description}</p>}
                </div>
                <span className="text-[11px] text-slate-500 tabular-nums whitespace-nowrap">{dateRange(e.startDate, e.endDate)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        {data.skills.length > 0 && (
          <section>
            <SectionTitle title={t('skills')} accent={accent} variant="plain" />
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s) => (
                <span key={s.id} className="text-[11px] px-2 py-1 rounded-md border" style={{ borderColor: accent, color: accent }}>
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            <SectionTitle title={t('languages')} accent={accent} variant="plain" />
            <div className="space-y-1 text-[12.5px]">
              {data.languages.map((l) => (
                <div key={l.id} className="flex justify-between">
                  <span className="text-slate-800">{l.name}</span>
                  <span className="text-slate-500">{t(`prof_${l.proficiency}` as any)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {data.projects.length > 0 && (
        <section>
          <SectionTitle title={t('projects')} accent={accent} variant="plain" />
          <div className="space-y-2.5">
            {data.projects.map((p) => (
              <div key={p.id}>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900">{p.name}</h4>
                  {p.tech && <span className="text-[11px] text-slate-500">· {p.tech}</span>}
                </div>
                {p.description && <p className="text-[12.5px] text-slate-700 mt-0.5">{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ─────────────────── CREATIVE ─────────────────── */
function CreativeTpl({ data, accent, accentDark, accentLight, t, dateRange }: Ctx) {
  const p = data.personalInfo;
  return (
    <div className="relative p-10 min-h-[297mm]" style={{ background: accentLight }}>
      <div className="absolute top-0 inset-x-0 h-2" style={{ background: `linear-gradient(90deg, ${accent}, ${accentDark})` }} />
      <header
        className="rounded-2xl p-6 text-white mb-7 shadow-lg relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accentDark})` }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-5">
          {p.photo ? (
            <img src={p.photo} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-white/50 shadow-xl" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center text-2xl font-bold">
              {(p.firstName || '?')[0]}{(p.lastName || '')[0]}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight">{p.firstName} {p.lastName}</h1>
            {p.jobTitle && <p className="text-white/85 text-base mt-0.5">{p.jobTitle}</p>}
            <div className="mt-3"><ContactRow data={data} /></div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          {p.summary && (
            <section className="bg-white rounded-xl p-5 shadow-sm">
              <SectionTitle title={t('personalSummaryTitle')} accent={accent} variant="bar" />
              <p className="text-[13px] leading-relaxed text-slate-700">{p.summary}</p>
            </section>
          )}
          {data.experience.length > 0 && (
            <section className="bg-white rounded-xl p-5 shadow-sm">
              <SectionTitle title={t('experience')} accent={accent} variant="bar" />
              <div className="space-y-4">
                {data.experience.map((e) => (
                  <Item key={e.id} title={e.position} subtitle={e.company} meta={dateRange(e.startDate, e.endDate, e.current)} description={e.description} accent={accent} />
                ))}
              </div>
            </section>
          )}
          {data.projects.length > 0 && (
            <section className="bg-white rounded-xl p-5 shadow-sm">
              <SectionTitle title={t('projects')} accent={accent} variant="bar" />
              <div className="space-y-3">
                {data.projects.map((p) => (
                  <ProjectItem key={p.id} project={p} accent={accent} />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-5">
          {data.education.length > 0 && (
            <section className="bg-white rounded-xl p-5 shadow-sm">
              <SectionTitle title={t('education')} accent={accent} variant="bar" />
              <div className="space-y-3">
                {data.education.map((e) => (
                  <div key={e.id}>
                    <div className="text-sm font-semibold text-slate-900">{e.degree}</div>
                    <div className="text-[12px]" style={{ color: accent }}>{e.field}</div>
                    <div className="text-[11px] text-slate-500">{e.school}</div>
                    <div className="text-[11px] text-slate-500 tabular-nums">{dateRange(e.startDate, e.endDate)}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.skills.length > 0 && (
            <section className="bg-white rounded-xl p-5 shadow-sm">
              <SectionTitle title={t('skills')} accent={accent} variant="bar" />
              <div className="space-y-2">
                {data.skills.map((s) => (
                  <div key={s.id}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-slate-500">{t(`level_${s.level}` as any)}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${accent}22` }}>
                      <div className="h-full rounded-full" style={{ width: `${SKILL_PCT[s.level]}%`, background: accent }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.languages.length > 0 && (
            <section className="bg-white rounded-xl p-5 shadow-sm">
              <SectionTitle title={t('languages')} accent={accent} variant="bar" />
              <div className="space-y-1.5 text-[12.5px]">
                {data.languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="text-slate-800">{l.name}</span>
                    <span style={{ color: accent }}>{t(`prof_${l.proficiency}` as any)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── CLASSIC ─────────────────── */
function ClassicTpl({ data, accent, t, dateRange }: Ctx) {
  const p = data.personalInfo;
  return (
    <div className="p-12 max-w-[820px] mx-auto">
      <header className="text-center pb-5 mb-6" style={{ borderBottom: `3px double ${accent}` }}>
        <h1 className="font-serif text-4xl text-slate-900">{p.firstName} {p.lastName}</h1>
        {p.jobTitle && <p className="font-serif text-lg italic mt-1" style={{ color: accent }}>{p.jobTitle}</p>}
        <div className="mt-3 flex justify-center"><ContactRow data={data} /></div>
      </header>

      {p.summary && (
        <section className="mb-6">
          <SectionTitle title={t('personalSummaryTitle')} accent={accent} variant="serif" />
          <p className="text-[13.5px] leading-relaxed text-slate-700 font-serif">{p.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6">
          <SectionTitle title={t('experience')} accent={accent} variant="serif" />
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between gap-3 items-baseline">
                  <h4 className="text-base font-semibold font-serif text-slate-900">{e.position} — <span className="italic">{e.company}</span></h4>
                  <span className="text-[11px] text-slate-500 tabular-nums">{dateRange(e.startDate, e.endDate, e.current)}</span>
                </div>
                {e.description && <p className="mt-1 text-[13px] leading-relaxed text-slate-700 font-serif whitespace-pre-line">{e.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-6">
          <SectionTitle title={t('education')} accent={accent} variant="serif" />
          <div className="space-y-3">
            {data.education.map((e) => (
              <div key={e.id} className="flex justify-between gap-3">
                <div>
                  <div className="text-base font-semibold font-serif text-slate-900">{e.degree} {e.field && `in ${e.field}`}</div>
                  <div className="text-[12.5px] italic text-slate-600">{e.school}</div>
                  {e.description && <p className="mt-0.5 text-[12.5px] text-slate-700">{e.description}</p>}
                </div>
                <span className="text-[11px] text-slate-500 tabular-nums whitespace-nowrap">{dateRange(e.startDate, e.endDate)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {data.skills.length > 0 && (
          <section>
            <SectionTitle title={t('skills')} accent={accent} variant="serif" />
            <p className="text-[13px] text-slate-700 font-serif">{data.skills.map((s) => s.name).join(' · ')}</p>
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            <SectionTitle title={t('languages')} accent={accent} variant="serif" />
            <div className="space-y-1 text-[13px] font-serif">
              {data.languages.map((l) => (
                <div key={l.id} className="flex justify-between"><span>{l.name}</span><span className="italic text-slate-600">{t(`prof_${l.proficiency}` as any)}</span></div>
              ))}
            </div>
          </section>
        )}
      </div>

      {data.projects.length > 0 && (
        <section className="mt-6">
          <SectionTitle title={t('projects')} accent={accent} variant="serif" />
          <div className="space-y-2.5">
            {data.projects.map((p) => (
              <div key={p.id}>
                <h4 className="text-base font-semibold font-serif">{p.name}{p.tech && <span className="italic text-slate-500"> — {p.tech}</span>}</h4>
                {p.description && <p className="text-[12.5px] text-slate-700 font-serif">{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ─────────────────── ELEGANT ─────────────────── */
function ElegantTpl({ data, accent, t, dateRange }: Ctx) {
  const p = data.personalInfo;
  return (
    <div className="p-12 max-w-[820px] mx-auto">
      <header className="flex items-center gap-6 pb-6 mb-6" style={{ borderBottom: `1px solid ${accent}` }}>
        {p.photo && <img src={p.photo} alt="" className="w-24 h-24 rounded-full object-cover" style={{ boxShadow: `0 0 0 4px ${accent}22` }} />}
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-[0.4em]" style={{ color: accent }}>{t('personalInfo')}</div>
          <h1 className="text-4xl font-light tracking-tight text-slate-900 mt-1">{p.firstName} <span className="font-bold">{p.lastName}</span></h1>
          {p.jobTitle && <p className="text-base text-slate-600 mt-1">{p.jobTitle}</p>}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8">
        <aside className="col-span-1 space-y-6">
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>{t('contactInfo')}</h3>
            <div className="space-y-1.5 text-[12px] text-slate-700">
              {p.email && <div>{p.email}</div>}
              {p.phone && <div>{p.phone}</div>}
              {p.location && <div>{p.location}</div>}
              {p.socials.linkedin && <div className="break-all">{p.socials.linkedin.replace(/^https?:\/\//, '')}</div>}
              {p.socials.github && <div className="break-all">{p.socials.github.replace(/^https?:\/\//, '')}</div>}
              {p.socials.website && <div className="break-all">{p.socials.website.replace(/^https?:\/\//, '')}</div>}
            </div>
          </section>

          {data.skills.length > 0 && (
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>{t('skills')}</h3>
              <div className="space-y-2">
                {data.skills.map((s) => (
                  <div key={s.id} className="text-[12px] text-slate-700">
                    <div className="flex justify-between"><span>{s.name}</span><span className="text-slate-500">{t(`level_${s.level}` as any)}</span></div>
                    <div className="mt-1 h-px" style={{ background: `linear-gradient(90deg, ${accent} ${SKILL_PCT[s.level]}%, #e2e8f0 ${SKILL_PCT[s.level]}%)` }} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.languages.length > 0 && (
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>{t('languages')}</h3>
              <div className="space-y-1 text-[12px] text-slate-700">
                {data.languages.map((l) => (
                  <div key={l.id} className="flex justify-between"><span>{l.name}</span><span className="text-slate-500">{t(`prof_${l.proficiency}` as any)}</span></div>
                ))}
              </div>
            </section>
          )}
        </aside>

        <main className="col-span-2 space-y-6">
          {p.summary && (
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>{t('personalSummaryTitle')}</h3>
              <p className="text-[13px] leading-relaxed text-slate-700">{p.summary}</p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>{t('experience')}</h3>
              <div className="space-y-4 relative ps-4" style={{ borderInlineStart: `1px solid ${accent}33` }}>
                {data.experience.map((e) => (
                  <div key={e.id} className="relative">
                    <span className="absolute -start-[19px] top-2 w-2 h-2 rounded-full" style={{ background: accent }} />
                    <div className="flex justify-between gap-3 items-baseline">
                      <h4 className="text-sm font-semibold text-slate-900">{e.position}</h4>
                      <span className="text-[11px] text-slate-500 tabular-nums">{dateRange(e.startDate, e.endDate, e.current)}</span>
                    </div>
                    <div className="text-[12px]" style={{ color: accent }}>{e.company}</div>
                    {e.description && <p className="mt-1.5 text-[12.5px] text-slate-700 leading-relaxed whitespace-pre-line">{e.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>{t('education')}</h3>
              <div className="space-y-3">
                {data.education.map((e) => (
                  <div key={e.id} className="flex justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{e.degree}{e.field && ` · ${e.field}`}</div>
                      <div className="text-[12px] text-slate-600">{e.school}</div>
                    </div>
                    <span className="text-[11px] text-slate-500 tabular-nums whitespace-nowrap">{dateRange(e.startDate, e.endDate)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects.length > 0 && (
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>{t('projects')}</h3>
              <div className="space-y-2.5">
                {data.projects.map((p) => (
                  <div key={p.id}>
                    <h4 className="text-sm font-semibold text-slate-900">{p.name}</h4>
                    {p.tech && <div className="text-[11px] text-slate-500">{p.tech}</div>}
                    {p.description && <p className="text-[12.5px] text-slate-700">{p.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

/* ─────────────────── EXECUTIVE ─────────────────── */
function ExecutiveTpl({ data, accent, accentDark, t, dateRange }: Ctx) {
  const p = data.personalInfo;
  return (
    <div className="p-0 min-h-[297mm]">
      <header className="px-12 py-8 text-white" style={{ background: `linear-gradient(135deg, #0f172a 0%, ${accentDark} 100%)` }}>
        <div className="flex justify-between items-start gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{p.firstName} {p.lastName}</h1>
            {p.jobTitle && <p className="text-white/80 mt-1 text-base">{p.jobTitle}</p>}
          </div>
          {p.photo && <img src={p.photo} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-white/40" />}
        </div>
        <div className="mt-4 pt-4 border-t border-white/15"><ContactRow data={data} /></div>
      </header>

      <div className="px-12 py-8">
        {p.summary && (
          <section className="mb-7">
            <SectionTitle title={t('personalSummaryTitle')} accent={accent} variant="bar" />
            <p className="text-[13px] leading-relaxed text-slate-700">{p.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-7">
            <SectionTitle title={t('experience')} accent={accent} variant="bar" />
            <div className="space-y-4">
              {data.experience.map((e) => (
                <div key={e.id} className="grid grid-cols-[120px_1fr] gap-4">
                  <div className="text-[11px] text-slate-500 tabular-nums pt-1">{dateRange(e.startDate, e.endDate, e.current)}</div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{e.position}</h4>
                    <div className="text-[12px]" style={{ color: accent }}>{e.company}</div>
                    {e.description && <p className="mt-1 text-[12.5px] text-slate-700 leading-relaxed whitespace-pre-line">{e.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="mb-7">
            <SectionTitle title={t('education')} accent={accent} variant="bar" />
            <div className="space-y-3">
              {data.education.map((e) => (
                <div key={e.id} className="grid grid-cols-[120px_1fr] gap-4">
                  <div className="text-[11px] text-slate-500 tabular-nums pt-1">{dateRange(e.startDate, e.endDate)}</div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{e.degree}{e.field && ` · ${e.field}`}</div>
                    <div className="text-[12px] text-slate-600">{e.school}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-7">
          {data.skills.length > 0 && (
            <section>
              <SectionTitle title={t('skills')} accent={accent} variant="bar" />
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((s) => (
                  <span key={s.id} className="text-[11px] px-2.5 py-1 rounded text-white" style={{ background: accent }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}
          {data.languages.length > 0 && (
            <section>
              <SectionTitle title={t('languages')} accent={accent} variant="bar" />
              <div className="space-y-1 text-[12.5px]">
                {data.languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="text-slate-800">{l.name}</span>
                    <span className="text-slate-500">{t(`prof_${l.proficiency}` as any)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {data.projects.length > 0 && (
          <section className="mt-7">
            <SectionTitle title={t('projects')} accent={accent} variant="bar" />
            <div className="grid sm:grid-cols-2 gap-3">
              {data.projects.map((p) => (
                <div key={p.id} className="p-3 rounded-lg" style={{ background: '#f8fafc' }}>
                  <h4 className="text-sm font-semibold text-slate-900">{p.name}</h4>
                  {p.tech && <div className="text-[11px] text-slate-500">{p.tech}</div>}
                  {p.description && <p className="text-[12.5px] text-slate-700 mt-1">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default CVPreview;
