import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Download, ArrowLeft, ArrowRight, Palette } from 'lucide-react';
import { useCVStore, ACCENT_COLORS, type AccentColor, type TemplateId } from '@/store/cvStore';
import Header from '@/components/Header';
import CVPreview from '@/components/CVPreview';
import { cn } from '@/lib/utils';

const Templates = () => {
  const { t } = useTranslation();
  const { selectedTemplate, setSelectedTemplate, accentColor, setAccentColor, language } = useCVStore();
  const isRtl = language === 'ar';
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const templates: { id: TemplateId; description: string }[] = [
    { id: 'modern', description: language === 'ar' ? 'لوحة جانبية ملوّنة وتفاصيل أنيقة' : 'Vibrant sidebar with crisp typography' },
    { id: 'minimal', description: language === 'ar' ? 'أبيض، نظيف، يركّز على المحتوى' : 'Whitespace-first and content-focused' },
    { id: 'creative', description: language === 'ar' ? 'بطاقات ملوّنة لطابع مميّز' : 'Bold cards with playful color' },
    { id: 'elegant', description: language === 'ar' ? 'هادئ، فاخر، بحروف رفيعة' : 'Refined typography, subtle accents' },
    { id: 'classic', description: language === 'ar' ? 'كلاسيكي بخط مقروء' : 'Timeless serif layout' },
    { id: 'executive', description: language === 'ar' ? 'هيدر داكن ومحاذاة بالأعمدة' : 'Dark header, column alignment' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('chooseTemplate')}
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            {language === 'ar' ? 'كل قالب مصمم بعناية ليبرز شخصيتك المهنية' : 'Each template is hand-crafted to highlight your story'}
          </p>
        </motion.div>

        <div className="card p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Palette className="w-4 h-4" /> {t('accentColor')}
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ACCENT_COLORS) as AccentColor[]).map((c) => (
              <button
                key={c}
                onClick={() => setAccentColor(c)}
                className={cn(
                  'group relative w-9 h-9 rounded-full transition focus:outline-none',
                  accentColor === c ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950' : ''
                )}
                style={{
                  background: `linear-gradient(135deg, ${ACCENT_COLORS[c].hex} 0%, ${ACCENT_COLORS[c].dark} 100%)`,
                  ['--tw-ring-color' as any]: ACCENT_COLORS[c].hex,
                }}
                aria-label={c}
              >
                {accentColor === c && <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {templates.map((tpl, i) => (
            <motion.button
              key={tpl.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedTemplate(tpl.id)}
              className={cn(
                'group text-start card overflow-hidden ring-2 transition relative',
                selectedTemplate === tpl.id ? 'ring-accent' : 'ring-transparent'
              )}
              style={{ ['--tw-ring-color' as any]: 'rgb(var(--accent))' }}
            >
              {selectedTemplate === tpl.id && (
                <div
                  className="absolute top-3 end-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-soft"
                  style={{ background: 'rgb(var(--accent))' }}
                >
                  <Check className="w-4 h-4" />
                </div>
              )}
              <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                <div className="absolute inset-0 origin-top-left" style={{ transform: 'scale(0.32)', transformOrigin: isRtl ? 'top right' : 'top left', width: '312%', height: '312%' }}>
                  <CVPreview template={tpl.id} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent group-hover:from-black/10 transition" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{t(tpl.id)}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tpl.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">{t('livePreview')}</h2>
            <span className="chip">{t(selectedTemplate)}</span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 sm:p-6 overflow-auto scrollbar-thin">
            <div className="mx-auto bg-white shadow-2xl rounded-md overflow-hidden" style={{ maxWidth: '820px' }}>
              <CVPreview />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-10">
          <Link to="/create" className="btn-ghost">
            <ArrowLeft className={cn('w-4 h-4', isRtl && 'rotate-180')} />
            {t('backToEdit')}
          </Link>
          <Link to="/download" className="btn-primary">
            <Download className="w-4 h-4" />
            {t('downloadPDF')}
            <Arrow className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Templates;
