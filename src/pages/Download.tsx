import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Download as DownloadIcon,
  Share2,
  Copy,
  Check,
  Printer,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { useCVStore } from '@/store/cvStore';
import Header from '@/components/Header';
import CVPreview from '@/components/CVPreview';
import { cn } from '@/lib/utils';

const A4_W_MM = 210;
const A4_H_MM = 297;

const DownloadPage = () => {
  const { t } = useTranslation();
  const { cvData, selectedTemplate, language } = useCVStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const filename = `${(cvData.personalInfo.firstName || 'CV').trim()}_${(cvData.personalInfo.lastName || '').trim()}_CV.pdf`
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '');

  const handleDownloadPDF = async () => {
    const target = document.querySelector<HTMLElement>('[data-pdf-target]');
    if (!target) return;
    setIsDownloading(true);

    target.classList.add('pdf-capturing');

    try {
      // 1. Wait for all fonts (including Noto Sans Arabic) to fully load
      if (document.fonts && (document.fonts as any).ready) {
        await (document.fonts as any).ready;
      }
      // small delay so any in-flight images settle
      await new Promise((r) => setTimeout(r, 80));

      // 2. Lazy-load html2canvas to keep the dev server light
      const { default: html2canvas } = await import('html2canvas');

      // 3. Capture at 2× scale; explicitly clone fonts and Arabic dir into the iframe
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: target.scrollWidth,
        windowHeight: target.scrollHeight,
        logging: false,
        onclone: (doc, node) => {
          // Re-import the fonts inside the cloned document so html2canvas
          // shapes Arabic glyphs correctly.
          const link = doc.createElement('link');
          link.rel = 'stylesheet';
          link.href =
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&family=Cormorant+Garamond:wght@400;500;600;700&display=swap';
          doc.head.appendChild(link);
          (node as HTMLElement).style.fontFamily =
            language === 'ar'
              ? "'Noto Sans Arabic', 'Inter', Arial, sans-serif"
              : "'Inter', 'Noto Sans Arabic', Arial, sans-serif";
          (node as HTMLElement).setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
          (node as HTMLElement).setAttribute('lang', language);
        },
      });

      // 4. Compute multi-page slicing in mm against A4
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pageW = A4_W_MM;
      const pageH = A4_H_MM;
      const imgWmm = pageW;
      const imgHmm = (canvas.height * imgWmm) / canvas.width;

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

      if (imgHmm <= pageH + 0.5) {
        // single page
        pdf.addImage(dataUrl, 'JPEG', 0, 0, imgWmm, imgHmm, undefined, 'FAST');
      } else {
        // multiple pages — keep the same image but offset y negatively each page
        let heightLeft = imgHmm;
        let position = 0;
        pdf.addImage(dataUrl, 'JPEG', 0, position, imgWmm, imgHmm, undefined, 'FAST');
        heightLeft -= pageH;
        while (heightLeft > 0) {
          position -= pageH;
          pdf.addPage();
          pdf.addImage(dataUrl, 'JPEG', 0, position, imgWmm, imgHmm, undefined, 'FAST');
          heightLeft -= pageH;
        }
      }

      pdf.save(filename || 'CV.pdf');
    } catch (e) {
      console.error(e);
      alert(t('pdfError'));
    } finally {
      target.classList.remove('pdf-capturing');
      setIsDownloading(false);
    }
  };

  const handlePrint = async () => {
    if (document.fonts && (document.fonts as any).ready) {
      await (document.fonts as any).ready;
    }
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.origin;
    const data = {
      title: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName} — CV`,
      text: language === 'ar' ? 'سيرتي الذاتية مصممة بـ 2CV' : 'My CV built with 2CV',
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        // user cancelled — no-op
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const isRtl = language === 'ar';
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 no-print">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold glass mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            {t(selectedTemplate)}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('downloadPDF')}
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            {language === 'ar' ? 'سيرتك جاهزة للتحميل والمشاركة بحجم A4 الدقيق' : 'Your CV is print-ready at exact A4 size'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="card p-4 sm:p-6">
            <div
              className="bg-slate-200 dark:bg-slate-900 rounded-xl p-4 sm:p-8 overflow-auto scrollbar-thin"
              ref={previewRef}
            >
              <div
                className="mx-auto bg-white shadow-2xl rounded-md overflow-hidden print-target"
                style={{ width: '210mm' }}
                data-pdf-target
              >
                <CVPreview />
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-soft"
                  style={{ background: 'linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent-strong)) 100%)' }}
                >
                  <DownloadIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{t('downloadPDF')}</h3>
                  <p className="text-xs text-slate-500 truncate" title={filename}>A4 · {filename}</p>
                </div>
              </div>
              <button onClick={handleDownloadPDF} disabled={isDownloading} className="btn-primary w-full">
                {isDownloading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    {t('generatingPDF')}
                  </>
                ) : (
                  <>
                    <DownloadIcon className="w-4 h-4" />
                    {t('downloadPDF')}
                  </>
                )}
              </button>
              <button onClick={handlePrint} className="btn-ghost w-full mt-2">
                <Printer className="w-4 h-4" /> {t('print')}
              </button>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">{t('share')}</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleShare} className="btn-soft text-xs">
                  <Share2 className="w-4 h-4" /> {t('share')}
                </button>
                <button onClick={handleCopy} className={cn('btn-ghost text-xs', copied && 'text-emerald-600')}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? t('linkCopied') : t('copyLink')}
                </button>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{t('tipsTitle')}</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {[t('tip1'), t('tip2'), t('tip3')].map((tip, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <Link to="/templates" className="btn-ghost flex-1 text-xs">
                <ArrowLeft className={cn('w-4 h-4', isRtl && 'rotate-180')} />
                {t('templates')}
              </Link>
              <Link to="/create" className="btn-soft flex-1 text-xs">
                {t('backToEdit')} <Arrow className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
