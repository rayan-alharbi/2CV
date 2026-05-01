# 2CV — Beautiful Resumes, Instant Export

منصّة عربية احترافية لصنع سيرة ذاتية أنيقة بمعاينة مباشرة وتصدير PDF بجودة الطباعة.

🔗 **GitHub:** [https://github.com/rayan-alharbi/2CV](https://github.com/rayan-alharbi/2CV)
🌐 **Live demo:** [https://cv-create.pages.dev/](https://cv-create.pages.dev/)

---

## 🌟 المميزات / Features

### العربية

- ✅ ست قوالب فاخرة: **Modern · Minimal · Creative · Classic · Elegant · Executive**
- ✅ ثمانية ألوان تمييز قابلة للتخصيص (Blue · Purple · Emerald · Rose · Amber · Slate · Cyan · Indigo)
- ✅ معاينة مباشرة (Live Preview) أثناء الكتابة + معاينة لزجة على سطح المكتب وتابات Edit/Preview على الموبايل
- ✅ رفع صورة شخصية + روابط سوشيال (LinkedIn · GitHub · Website · X)
- ✅ أشرطة تقدّم بصرية لمستوى المهارات واللغات
- ✅ حفظ تلقائي مع مؤشّر "Auto-saved · Xs"
- ✅ زر **بيانات تجريبية** لتجربة الواجهة فورًا
- ✅ تصدير PDF بحجم **A4 الدقيق** مع دعم متعدّد الصفحات وحلّ كامل لتشكيل الحروف العربية
- ✅ طباعة احترافية (`@page A4`) تخفي كل ما عدا السيرة
- ✅ دعم RTL/LTR، عربي وإنجليزي
- ✅ وضع داكن/فاتح
- ✅ تخزين محلي (Zustand persist)

### English

- ✅ Six hand-crafted templates: **Modern · Minimal · Creative · Classic · Elegant · Executive**
- ✅ Eight customizable accent colors
- ✅ Real-time live preview, sticky on desktop, with Edit/Preview tabs on mobile
- ✅ Photo upload + social links (LinkedIn · GitHub · Website · X)
- ✅ Visual progress bars for skill and language levels
- ✅ Auto-save with "Auto-saved · Xs" indicator
- ✅ One-click **sample data** to try the editor instantly
- ✅ Pixel-perfect **A4 PDF export**, multi-page aware, with bulletproof Arabic shaping
- ✅ Print-ready (`@page A4`) with all UI chrome hidden
- ✅ RTL/LTR ready (Arabic + English)
- ✅ Dark / light theme
- ✅ Local persistence (Zustand persist middleware)

---

## 🚀 التقنيات المستخدمة / Tech Stack

- **Framework:** React 18 + TypeScript + Vite 6
- **Styling:** Tailwind CSS 3 + custom CSS variables for accent colors
- **State:** Zustand (with `persist` + versioned migration)
- **i18n:** i18next + react-i18next
- **PDF export:** `html2canvas` + `jsPDF` (multi-page A4 slicing)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router v7

---

## 📋 المتطلبات / Requirements

- Node.js 18+
- npm or pnpm

---

## 🛠️ التثبيت والتشغيل / Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/rayan-alharbi/2CV.git
cd 2CV

# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev

# Type-check
npm run check

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🌐 النشر / Deployment

المشروع مُهيّأ للنشر على **Cloudflare Pages** و **Vercel**:

- `wrangler.toml` و `_redirects` للـCloudflare Pages
- `vercel.json` للنشر على Vercel
- راجع [DEPLOYMENT.md](DEPLOYMENT.md) للدليل الكامل

The project is pre-configured for **Cloudflare Pages** and **Vercel** deployment. See [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 📁 هيكل المشروع / Project Structure

```
2CV/
├── src/
│   ├── components/
│   │   ├── CVPreview.tsx          # 6 templates renderer + A4 preview
│   │   ├── Header.tsx             # Sticky glass nav
│   │   ├── PersonalInfoForm.tsx   # Photo + socials
│   │   ├── ExperienceForm.tsx     # With "currently here" toggle
│   │   ├── EducationForm.tsx
│   │   ├── SkillsForm.tsx         # Level bars + popular skills
│   │   ├── LanguagesForm.tsx      # Proficiency bars
│   │   └── ProjectsForm.tsx       # Tech stack + link
│   ├── pages/
│   │   ├── Home.tsx               # Animated hero, mesh gradient, stats
│   │   ├── CreateCV.tsx           # Step editor, autosave, sticky preview
│   │   ├── Templates.tsx          # Gallery + accent color picker
│   │   └── Download.tsx           # PDF export, print, share
│   ├── store/
│   │   └── cvStore.ts             # Zustand + persist v2 + sample data
│   ├── lib/
│   │   └── utils.ts               # cn() helper (clsx + tailwind-merge)
│   ├── i18n.ts                    # AR + EN translations
│   ├── index.css                  # Design system + PDF/print styles
│   └── App.tsx                    # Router + accent CSS variable injector
├── public/
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 🎨 القوالب المتوفرة / Available Templates

| القالب | النمط | الوصف |
| --- | --- | --- |
| **Modern** | Sidebar ملوّن | لوحة جانبية بألوان متدرّجة وتفاصيل أنيقة |
| **Minimal** | أبيض هادئ | يركّز على المحتوى وفراغات نظيفة |
| **Creative** | بطاقات مرحة | بطاقات ملوّنة لطابع مميّز |
| **Classic** | Serif كلاسيكي | تايبوقرافي تقليدية بحروف Cormorant Garamond |
| **Elegant** | فاخر هادئ | تايبوقرافي رفيعة وتايم لاين رأسي |
| **Executive** | تنفيذي | هيدر داكن وأعمدة دقيقة للتواريخ |

كل قالب يدعم الألوان الثمانية، وكلها تُعرض بنفس بيانات السيرة آنيًا.

Every template supports all eight accent colors and renders the same data live.

---

## 🔧 التخصيص / Customization

- **إضافة لغة جديدة:** أضف مفاتيح جديدة في `src/i18n.ts` ضمن `resources`.
- **تعديل قالب موجود أو إضافة قالب جديد:**
  1. أضف معرّف القالب إلى `TemplateId` في `src/store/cvStore.ts`.
  2. أضف دالة العرض داخل `src/components/CVPreview.tsx`.
  3. أدرِجه في قائمة القوالب في `src/pages/Templates.tsx`.
- **إضافة لون تمييز:** أضف مفتاحًا جديدًا إلى `ACCENT_COLORS` في `cvStore.ts`.
- **حقول جديدة:** عدّل واجهات `PersonalInfo` / `Experience` / إلخ في `cvStore.ts` ثم اعرضها في القوالب.

---

## 📄 الميزات المستقبلية / Future Roadmap

- [ ] قوالب إضافية (Tech, Academic, Designer)
- [ ] تصدير DOCX
- [ ] مشاركة السيرة عبر رابط دائم
- [ ] AI-powered summary suggestions
- [ ] استيراد من LinkedIn

---

## 🤝 المساهمة / Contributing

نرحب بالمساهمات! للإبلاغ عن مشكلة أو طلب ميزة:
[https://github.com/rayan-alharbi/2CV/issues](https://github.com/rayan-alharbi/2CV/issues)

Contributions welcome! Open an issue or PR at the repo above.

---

## 📄 الرخصة / License

MIT — هذا المشروع مرخّص تحت رخصة MIT. / This project is MIT-licensed.

---

## 📞 التواصل / Contact

- GitHub: [@rayan-alharbi](https://github.com/rayan-alharbi)
- Repository: [https://github.com/rayan-alharbi/2CV](https://github.com/rayan-alharbi/2CV)

---

**⭐ لا تنسَ إعطاء المشروع نجمة إن أعجبك!**
**⭐ If you find this useful, please give it a star!**
