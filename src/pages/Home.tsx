import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  Palette,
  Download,
  Globe2,
  Sparkles,
  Check,
  Rocket,
  Star,
} from 'lucide-react';
import Header from '@/components/Header';
import { useCVStore } from '@/store/cvStore';

export default function Home() {
  const { t } = useTranslation();
  const { language, loadSample } = useCVStore();
  const isRtl = language === 'ar';
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const features = [
    { icon: FileText, title: t('featTitle1'), desc: t('featDesc1') },
    { icon: Palette, title: t('featTitle2'), desc: t('featDesc2') },
    { icon: Download, title: t('featTitle3'), desc: t('featDesc3') },
    { icon: Globe2, title: t('featTitle4'), desc: t('featDesc4') },
  ];

  const stats = [
    { value: '6', label: t('stats1') },
    { value: '8', label: t('stats2') },
    { value: '2', label: t('stats3') },
    { value: '∞', label: t('stats4') },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-mesh-light dark:bg-mesh opacity-90" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-white/0 to-slate-50 dark:to-slate-950" />

      <div className="relative">
        <Header />

        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                           glass text-slate-700 dark:text-slate-200 mb-6"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                {t('heroBadge')}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-white"
              >
                {t('heroTitle')}{' '}
                <span className="gradient-text">{t('heroTitleAccent')}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                {t('heroSubtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center"
              >
                <Link to="/create" className="btn-primary text-base px-7 py-3">
                  <Rocket className="w-4 h-4" />
                  {t('createCVNow')}
                  <Arrow className="w-4 h-4" />
                </Link>
                <button onClick={loadSample} className="btn-ghost text-base px-7 py-3">
                  <Sparkles className="w-4 h-4" />
                  {t('tryWithSample')}
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" /> {t('heroBadge').split('•')[0].trim()}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" /> A4 PDF
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" /> RTL · LTR
                </span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-16 sm:mt-20 mx-auto max-w-5xl"
            >
              <HeroPreview />
            </motion.div>
          </div>
        </section>

        <section className="relative py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="card p-5 text-center"
                >
                  <div className="text-3xl sm:text-4xl font-extrabold gradient-text">{s.value}</div>
                  <div className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t('whyChooseUs')}
              </h2>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">{t('whyChooseUsSubtitle')}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="card p-6 hover:shadow-soft hover:-translate-y-0.5 transition group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white shadow-soft"
                    style={{ background: 'linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent-strong)) 100%)' }}
                  >
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center text-white shadow-soft"
                 style={{ background: 'linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent-strong)) 100%)' }}>
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-center gap-1 mb-4 text-amber-300">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t('startNow')}</h2>
                <p className="mt-3 text-white/80 text-lg">{t('startNowSubtitle')}</p>
                <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/create"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold bg-white text-slate-900 hover:bg-slate-100 transition"
                  >
                    {t('createCVNow')}
                    <Arrow className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/templates"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold border border-white/30 text-white hover:bg-white/10 transition"
                  >
                    {t('browseTemplates')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200/70 dark:border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <div>
              © {new Date().getFullYear()} {t('brand')}
            </div>
            <div className="inline-flex items-center gap-1.5">
              {t('builtWith')} <span className="text-rose-500">♥</span> · React · Tailwind
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent/40 via-fuchsia-400/40 to-amber-300/40 blur-2xl opacity-50" />
      <div className="relative card p-2 sm:p-3 overflow-hidden">
        <div className="rounded-2xl overflow-hidden bg-white">
          <div className="grid grid-cols-12 min-h-[360px] sm:min-h-[440px]">
            <div
              className="col-span-4 p-6 text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(160deg, rgb(var(--accent)) 0%, rgb(var(--accent-strong)) 100%)' }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 mb-4 mx-auto flex items-center justify-center text-2xl font-bold">
                R
              </div>
              <div className="h-3 w-3/4 bg-white/40 rounded mx-auto" />
              <div className="h-2 w-1/2 bg-white/30 rounded mx-auto mt-2" />
              <div className="mt-6 space-y-2">
                <div className="h-2 bg-white/30 rounded w-full" />
                <div className="h-2 bg-white/30 rounded w-5/6" />
                <div className="h-2 bg-white/30 rounded w-4/6" />
              </div>
              <div className="mt-6">
                <div className="h-2.5 w-1/2 bg-white/60 rounded" />
                <div className="mt-3 space-y-2">
                  <div className="h-2 bg-white/30 rounded" />
                  <div className="h-2 bg-white/30 rounded w-5/6" />
                  <div className="h-2 bg-white/30 rounded w-4/6" />
                </div>
              </div>
            </div>
            <div className="col-span-8 p-6 sm:p-8 text-slate-700">
              <div className="h-3 w-1/3 rounded bg-slate-300" />
              <div className="mt-2 h-2 w-1/4 rounded bg-slate-200" />
              <div className="mt-6 space-y-2.5">
                <div className="h-2 w-full rounded bg-slate-200" />
                <div className="h-2 w-11/12 rounded bg-slate-200" />
                <div className="h-2 w-10/12 rounded bg-slate-200" />
              </div>
              {[0, 1, 2].map((i) => (
                <div key={i} className="mt-6">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-1/3 rounded bg-slate-300" />
                    <div className="h-2 w-1/6 rounded bg-slate-200 ms-auto" />
                  </div>
                  <div className="mt-2.5 space-y-1.5">
                    <div className="h-2 w-full rounded bg-slate-200" />
                    <div className="h-2 w-5/6 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
