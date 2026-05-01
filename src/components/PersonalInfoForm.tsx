import { useRef } from 'react';
import { useCVStore } from '@/store/cvStore';
import { useTranslation } from 'react-i18next';
import { Upload, Trash2, Mail, Phone, MapPin, Briefcase, Linkedin, Github, Globe, Twitter } from 'lucide-react';

const PersonalInfoForm = () => {
  const { t } = useTranslation();
  const { cvData, updatePersonalInfo, updateSocials, language } = useCVStore();
  const { personalInfo } = cvData;
  const fileRef = useRef<HTMLInputElement>(null);

  const onPhoto = (file: File | null) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(language === 'ar' ? 'حجم الصورة يتجاوز 2MB' : 'Image exceeds 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updatePersonalInfo({ photo: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const initial = (personalInfo.firstName || '?').charAt(0).toUpperCase();

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-5">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center text-white text-3xl font-bold shadow-soft"
            style={{ background: 'linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent-strong)) 100%)' }}
          >
            {personalInfo.photo ? (
              <img src={personalInfo.photo} alt="" className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="label">{t('photo')}</div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => fileRef.current?.click()} className="btn-soft text-xs">
              <Upload className="w-3.5 h-3.5" /> {t('uploadPhoto')}
            </button>
            {personalInfo.photo && (
              <button onClick={() => updatePersonalInfo({ photo: '' })} className="btn-danger text-xs">
                <Trash2 className="w-3.5 h-3.5" /> {t('removePhoto')}
              </button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{t('photoHint')}</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => onPhoto(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">{t('firstName')} *</label>
          <input
            type="text"
            value={personalInfo.firstName}
            onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
            className="field"
            placeholder={language === 'ar' ? 'محمد' : 'John'}
          />
        </div>
        <div>
          <label className="label">{t('lastName')} *</label>
          <input
            type="text"
            value={personalInfo.lastName}
            onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
            className="field"
            placeholder={language === 'ar' ? 'العمري' : 'Doe'}
          />
        </div>
      </div>

      <div>
        <label className="label">{t('jobTitle')} *</label>
        <div className="relative">
          <Briefcase className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={personalInfo.jobTitle}
            onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
            className="field ps-10"
            placeholder={language === 'ar' ? 'مطور واجهات أمامية' : 'Frontend Engineer'}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">{t('email')} *</label>
          <div className="relative">
            <Mail className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
              className="field ps-10"
              placeholder="you@email.com"
            />
          </div>
        </div>
        <div>
          <label className="label">{t('phone')}</label>
          <div className="relative">
            <Phone className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
              className="field ps-10"
              placeholder="+966 5x xxx xxxx"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="label">{t('location')}</label>
        <div className="relative">
          <MapPin className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            className="field ps-10"
            placeholder={language === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia'}
          />
        </div>
      </div>

      <div>
        <label className="label">{t('summary')}</label>
        <textarea
          value={personalInfo.summary}
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
          rows={4}
          className="field"
          placeholder={
            language === 'ar'
              ? 'اكتب جملتين أو ثلاثًا تلخّص خبراتك وأهم إنجازاتك...'
              : 'Two or three sentences that capture your experience and biggest wins…'
          }
        />
        <div className="mt-1 text-xs text-slate-500 text-right rtl:text-left tabular-nums">
          {personalInfo.summary.length} / 400
        </div>
      </div>

      <div>
        <div className="label">{t('contactInfo')}</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { key: 'linkedin', icon: Linkedin, ph: 'https://linkedin.com/in/…' },
            { key: 'github', icon: Github, ph: 'https://github.com/…' },
            { key: 'website', icon: Globe, ph: 'https://yoursite.com' },
            { key: 'twitter', icon: Twitter, ph: 'https://x.com/…' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.key} className="relative">
                <Icon className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={(personalInfo.socials as any)[s.key] || ''}
                  onChange={(e) => updateSocials({ [s.key]: e.target.value } as any)}
                  className="field ps-10"
                  placeholder={s.ph}
                  dir="ltr"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
