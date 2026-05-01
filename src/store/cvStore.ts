import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SocialLinks {
  linkedin: string;
  github: string;
  website: string;
  twitter: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  summary: string;
  photo: string;
  socials: SocialLinks;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

export type Proficiency = 'basic' | 'conversational' | 'fluent' | 'native';
export interface Language {
  id: string;
  name: string;
  proficiency: Proficiency;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  tech: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  projects: Project[];
}

export type TemplateId = 'minimal' | 'creative' | 'classic' | 'modern' | 'elegant' | 'executive';
export type AccentColor = 'blue' | 'purple' | 'emerald' | 'rose' | 'amber' | 'slate' | 'cyan' | 'indigo';

export const ACCENT_COLORS: Record<AccentColor, { hex: string; light: string; dark: string; gradient: string }> = {
  blue:    { hex: '#2563eb', light: '#dbeafe', dark: '#1e40af', gradient: 'from-blue-500 to-cyan-500' },
  purple:  { hex: '#7c3aed', light: '#ede9fe', dark: '#5b21b6', gradient: 'from-purple-500 to-pink-500' },
  emerald: { hex: '#059669', light: '#d1fae5', dark: '#065f46', gradient: 'from-emerald-500 to-teal-500' },
  rose:    { hex: '#e11d48', light: '#ffe4e6', dark: '#9f1239', gradient: 'from-rose-500 to-orange-500' },
  amber:   { hex: '#d97706', light: '#fef3c7', dark: '#92400e', gradient: 'from-amber-500 to-orange-500' },
  slate:   { hex: '#334155', light: '#e2e8f0', dark: '#0f172a', gradient: 'from-slate-700 to-slate-900' },
  cyan:    { hex: '#0891b2', light: '#cffafe', dark: '#155e75', gradient: 'from-cyan-500 to-blue-500' },
  indigo:  { hex: '#4f46e5', light: '#e0e7ff', dark: '#3730a3', gradient: 'from-indigo-500 to-purple-500' },
};

export interface CVStore {
  cvData: CVData;
  currentStep: number;
  selectedTemplate: TemplateId;
  accentColor: AccentColor;
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
  lastSavedAt: number | null;

  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSocials: (socials: Partial<SocialLinks>) => void;
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addLanguage: (language: Omit<Language, 'id'>) => void;
  updateLanguage: (id: string, language: Partial<Language>) => void;
  removeLanguage: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setCurrentStep: (step: number) => void;
  setSelectedTemplate: (template: TemplateId) => void;
  setAccentColor: (color: AccentColor) => void;
  setLanguage: (language: 'ar' | 'en') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  markSaved: () => void;
  loadSample: () => void;
  resetCV: () => void;
}

const initialPersonalInfo: PersonalInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  jobTitle: '',
  summary: '',
  photo: '',
  socials: { linkedin: '', github: '', website: '', twitter: '' },
};

const initialCVData: CVData = {
  personalInfo: initialPersonalInfo,
  education: [],
  experience: [],
  skills: [],
  languages: [],
  projects: [],
};

const uid = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);

const sampleData: CVData = {
  personalInfo: {
    firstName: 'Rayan',
    lastName: 'Alharbi',
    email: 'rayan@example.com',
    phone: '+966 50 123 4567',
    location: 'Riyadh, Saudi Arabia',
    jobTitle: 'Senior Full-Stack Engineer',
    summary:
      'Product-minded full-stack engineer with 6+ years building delightful web experiences. I love clean architecture, performant UIs, and shipping things people actually use.',
    photo: '',
    socials: {
      linkedin: 'https://linkedin.com/in/rayan',
      github: 'https://github.com/rayan',
      website: 'https://rayan.dev',
      twitter: '',
    },
  },
  education: [
    {
      id: uid(),
      school: 'King Saud University',
      degree: 'B.Sc.',
      field: 'Computer Science',
      startDate: '2016-09',
      endDate: '2020-06',
      description: 'Graduated with honors. Focus on distributed systems and HCI.',
    },
  ],
  experience: [
    {
      id: uid(),
      company: 'Acme Corp',
      position: 'Senior Software Engineer',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description:
        'Lead a team of 4 building the new design system. Reduced bundle size by 38% and shipped a fully-typed component library used across 12 products.',
    },
    {
      id: uid(),
      company: 'Beta Studio',
      position: 'Software Engineer',
      startDate: '2020-07',
      endDate: '2021-12',
      current: false,
      description:
        'Built customer-facing dashboards in React + TypeScript. Owned the migration from REST to GraphQL.',
    },
  ],
  skills: [
    { id: uid(), name: 'TypeScript', level: 'expert' },
    { id: uid(), name: 'React', level: 'expert' },
    { id: uid(), name: 'Node.js', level: 'advanced' },
    { id: uid(), name: 'PostgreSQL', level: 'advanced' },
    { id: uid(), name: 'Tailwind CSS', level: 'expert' },
    { id: uid(), name: 'AWS', level: 'intermediate' },
  ],
  languages: [
    { id: uid(), name: 'Arabic', proficiency: 'native' },
    { id: uid(), name: 'English', proficiency: 'fluent' },
  ],
  projects: [
    {
      id: uid(),
      name: 'Open Source UI Kit',
      description: 'Headless React component library with 80+ accessible primitives. 3k+ stars.',
      link: 'https://github.com/rayan/ui',
      tech: 'React, TypeScript, Radix',
    },
  ],
};

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cvData: initialCVData,
      currentStep: 0,
      selectedTemplate: 'modern',
      accentColor: 'blue',
      language: 'ar',
      theme: 'light',
      lastSavedAt: null,

      updatePersonalInfo: (info) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            personalInfo: { ...state.cvData.personalInfo, ...info },
          },
        })),

      updateSocials: (socials) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            personalInfo: {
              ...state.cvData.personalInfo,
              socials: { ...state.cvData.personalInfo.socials, ...socials },
            },
          },
        })),

      addEducation: (education) =>
        set((state) => ({
          cvData: { ...state.cvData, education: [...state.cvData.education, { ...education, id: uid() }] },
        })),
      updateEducation: (id, education) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            education: state.cvData.education.map((e) => (e.id === id ? { ...e, ...education } : e)),
          },
        })),
      removeEducation: (id) =>
        set((state) => ({
          cvData: { ...state.cvData, education: state.cvData.education.filter((e) => e.id !== id) },
        })),

      addExperience: (experience) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experience: [...state.cvData.experience, { ...experience, id: uid() }],
          },
        })),
      updateExperience: (id, experience) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            experience: state.cvData.experience.map((e) => (e.id === id ? { ...e, ...experience } : e)),
          },
        })),
      removeExperience: (id) =>
        set((state) => ({
          cvData: { ...state.cvData, experience: state.cvData.experience.filter((e) => e.id !== id) },
        })),

      addSkill: (skill) =>
        set((state) => ({
          cvData: { ...state.cvData, skills: [...state.cvData.skills, { ...skill, id: uid() }] },
        })),
      updateSkill: (id, skill) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            skills: state.cvData.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
          },
        })),
      removeSkill: (id) =>
        set((state) => ({
          cvData: { ...state.cvData, skills: state.cvData.skills.filter((s) => s.id !== id) },
        })),

      addLanguage: (language) =>
        set((state) => ({
          cvData: { ...state.cvData, languages: [...state.cvData.languages, { ...language, id: uid() }] },
        })),
      updateLanguage: (id, language) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            languages: state.cvData.languages.map((l) => (l.id === id ? { ...l, ...language } : l)),
          },
        })),
      removeLanguage: (id) =>
        set((state) => ({
          cvData: { ...state.cvData, languages: state.cvData.languages.filter((l) => l.id !== id) },
        })),

      addProject: (project) =>
        set((state) => ({
          cvData: { ...state.cvData, projects: [...state.cvData.projects, { ...project, id: uid() }] },
        })),
      updateProject: (id, project) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            projects: state.cvData.projects.map((p) => (p.id === id ? { ...p, ...project } : p)),
          },
        })),
      removeProject: (id) =>
        set((state) => ({
          cvData: { ...state.cvData, projects: state.cvData.projects.filter((p) => p.id !== id) },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      setAccentColor: (color) => set({ accentColor: color }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      markSaved: () => set({ lastSavedAt: Date.now() }),
      loadSample: () => set({ cvData: sampleData, currentStep: 0 }),
      resetCV: () => set({ cvData: initialCVData, currentStep: 0 }),
    }),
    {
      name: 'cv-storage',
      version: 2,
      partialize: (state) => ({
        cvData: state.cvData,
        selectedTemplate: state.selectedTemplate,
        accentColor: state.accentColor,
        language: state.language,
        theme: state.theme,
      }),
      migrate: (persisted: any, version) => {
        if (!persisted) return persisted;
        if (version < 2 && persisted.cvData?.personalInfo) {
          persisted.cvData.personalInfo = {
            ...initialPersonalInfo,
            ...persisted.cvData.personalInfo,
            socials: {
              ...initialPersonalInfo.socials,
              ...(persisted.cvData.personalInfo.socials ?? {}),
            },
          };
          persisted.cvData.experience = (persisted.cvData.experience ?? []).map((e: any) => ({
            current: false,
            ...e,
          }));
          persisted.cvData.projects = (persisted.cvData.projects ?? []).map((p: any) => ({
            tech: '',
            ...p,
          }));
        }
        return persisted;
      },
    }
  )
);
