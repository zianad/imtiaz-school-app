import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from './types';

type Translations = { [key: string]: string | Translations };

const translations: { [key in Language]: Translations } = {
  ar: {
    // General
    back: 'الرجوع',
    logout: 'تسجيل الخروج',
    next: 'التالي',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    cancel: 'إلغاء',
    add: 'إضافة',
    confirm: 'تأكيد',
    close: 'إغلاق',
    loading: 'جار التحميل',
    all: 'الكل',
    later: 'لاحقاً',
    send: 'إرسال',
    searchPlaceholder: 'ابحث في {schoolName}...',
    noResultsFound: 'لم يتم العثور على نتائج.',
    student: 'تلميذ',
    teacher: 'أستاذ',
    announcement: 'إعلان',
    summary: 'ملخص',
    exercise: 'تمرين',
    note: 'ملاحظة',
    educationalTip: 'نصيحة تربوية',
    project: 'مشروع',
    quiz: 'اختبار',
    libraryItem: 'عنصر مكتبة',
    supplementaryLesson: 'درس دعم',
    
    // Roles
    teacher_feature: 'ميزات الأستاذ',
    guardian_feature: 'ميزات ولي الأمر',
    principal_feature: 'ميزات المدير',
    
    // Login Screen
    unifiedLoginWelcome: 'مرحبا بكم في مدرستكم',
    unifiedLoginPrompt: 'المرجو إدخال الرمز السري الخاص بكم',
    loginCodePlaceholder: 'أدخل الرمز هنا',
    login: 'دخول',
    rememberMe: 'تذكرني',
    requestHelp: 'هل تحتاج إلى مساعدة؟ اتصل بنا',
    helpNote: 'هذا الرقم مخصص للدعم الفني فقط.',
    invalidCode: 'الرمز الذي أدخلته غير صحيح. يرجى المحاولة مرة أخرى.',
    rlsLoginError: "خطأ في تسجيل الدخول. يرجى التواصل مع الدعم الفني.",
    supabaseEmailConfirmationError: "خطأ: لم يتم تأكيد البريد الإلكتروني. يرجى التواصل مع الدعم الفني.",
    supabaseSignupsDisabledError: "خطأ: التسجيل معطل حاليا. تواصل مع الدعم الفني.",
    
    // Maintenance Screen
    maintenanceTitle: 'تحت الصيانة',
    maintenanceMessage: 'التطبيق قيد الصيانة حاليًا. سنعود قريبًا.',

    // Super Admin
    superAdminDashboardTitle: 'لوحة تحكم المدير الخارق',
    addSchoolSectionTitle: 'إضافة مدرسة جديدة',
    newSchoolNamePlaceholder: 'اسم المدرسة الجديدة',
    principalSecretCodePlaceholder: 'الرمز السري للمدير',
    addSchool: 'إضافة المدرسة',
    currentSchools: 'المدارس الحالية',
    principalCodeLabel: 'رمز المدير',
    noSchoolsAdded: 'لم تتم إضافة أي مدارس بعد.',
    enterSchoolNameAndCode: 'الرجاء إدخال اسم المدرسة ورمز المدير.',
    rlsNoticeTitle: 'تنبيه هام بخصوص أمان الوصول للبيانات (RLS)',
    rlsNoticeBody1: 'يتم حاليًا تطوير وتنفيذ سياسات أمان الوصول على مستوى الصف (Row Level Security) في قاعدة البيانات Supabase.',
    rlsNoticeBody2: 'الهدف هو ضمان أن كل مستخدم (مدير، أستاذ، ولي أمر) يمكنه الوصول فقط إلى البيانات المتعلقة بمدرسته أو بأبنائه. هذا يمنع أي وصول غير مصرح به إلى بيانات المدارس الأخرى.',
    rlsNoticeBody3: 'للتأكد من أن تسجيل الدخول يعمل بشكل صحيح بعد تفعيل هذه السياسات، يجب تعيين دور <code>supabase_admin</code> للمستخدم <code>postgres</code>. يمكن القيام بذلك عبر تنفيذ الأمر SQL التالي في محرر Supabase SQL: <code>GRANT supabase_admin TO postgres;</code>',
    feedbackAnalysis: 'تحليل الملاحظات والشكاوى',
    schoolStatus: 'حالة المدرسة',
    active: 'نشطة',
    inactive: 'غير نشطة',
    enterAsPrincipal: 'الدخول كمدير',
    enterPrincipalDashboard: 'دخول لوحة تحكم {stageName}',
    managePrincipals: 'إدارة المديرين',
    principalManagementForStage: 'إدارة مديري {stageName}',
    principalName: 'اسم المدير',
    changePassword: 'تغيير كلمة المرور',
    newPassword: 'كلمة المرور الجديدة',
    savePassword: 'حفظ كلمة المرور',
    featureToggleTitle: 'تفعيل الميزات',
    principalFeaturesSection: 'ميزات المدير',
    teacherFeaturesSection: 'ميزات الأستاذ',
    guardianFeaturesSection: 'ميزات ولي الأمر',
    saveChanges: 'حفظ التغييرات',
    
    // Principal
    selectStage: 'اختر المرحلة التعليمية',
    principalWelcome: 'مرحبا بك أيها المدير(ة)',
    principalDashboardTitle: 'لوحة تحكم المدير',
    dashboard: 'لوحة التحكم',
    changeStage: 'تغيير المرحلة',
    statisticsDashboard: 'لوحة الإحصائيات',
    educationalTips: 'نصائح تربوية',
    announcements: 'الإعلانات',
    complaintsAndSuggestions: 'الشكاوى والاقتراحات',
    reviewNotes: 'مراجعة الملاحظات',
    reviewAlbumPhotos: 'مراجعة صور الألبوم',
    monthlyFees: 'الرسوم الشهرية',
    interviewRequests: 'طلبات المقابلة',
    schoolManagement: 'إدارة المؤسسة',
    browseAsTeacher: 'التصفح كأستاذ',
    financialManagement: 'الإدارة المالية',
    manageStudents: 'إدارة التلاميذ',
    manageTeachers: 'إدارة الأساتذة',
    
    // Teacher
    teacherDashboardTitle: 'لوحة تحكم الأستاذ',
    teacherSelectLevelAndSubject: 'المرجو اختيار المستوى والمادة',
    level: 'المستوى',
    subject: 'المادة',
    class: 'القسم',
    selectClassPrompt: 'اختر القسم',
    summaries: 'الملخصات',
    exercises: 'التمارين',
    notesAndAbsences: 'الملاحظات والغياب',
    aiNotes: 'ملاحظات بالذكاء الاصطناعي',
    lessonPlanner: 'مخطط الدروس',
    memorizationHelper: 'مساعد الحفظ',
    talkingCards: 'البطاقات الناطقة',
    classAlbum: 'ألبوم القسم',
    fillAllFields: 'المرجو ملء جميع الحقول.',
    
    // Guardian
    guardianDashboardTitle: 'لوحة تحكم ولي الأمر',
    discoverPleasureOfLearning: 'اكتشف متعة التعلم',
    selectSubjectToFollow: 'اختر المادة للمتابعة',
    studentLevel: 'المستوى الدراسي',
    notifications: 'الإشعارات',
    noNewNotifications: 'لا توجد إشعارات جديدة',
    viewAnnouncements: 'عرض الإعلانات',
    viewEducationalTips: 'عرض النصائح التربوية',
    submitComplaintOrSuggestion: 'تقديم شكوى أو اقتراح',
    requestInterview: 'طلب مقابلة',
    guardianNotesTitle: 'ملاحظات وغيابات التلميذ(ة)',
    sentForReviewSuccess: 'تم إرسال الملاحظة للمراجعة بنجاح.',
    studentGrades: 'نقط التلاميذ',
    examProgram: 'برنامج الفروض',
    
    // Subjects
    "اللغة العربية": "اللغة العربية",
    "اللغة الفرنسية": "اللغة الفرنسية",
    "الرياضيات": "الرياضيات",
    "التربية الإسلامية": "التربية الإسلامية",
    "الاجتماعيات": "الاجتماعيات",
    "اللغة الإنجليزية": "اللغة الإنجليزية",
    "الفيزياء والكيمياء": "الفيزياء والكيمياء",
    "علوم الحياة والأرض": "علوم الحياة والأرض",
    "المعلوميات": "المعلوميات",
    "الفلسفة": "الفلسفة",
    
    // Stages
    pre_schoolStage: 'التعليم الأولي',
    primaryStage: 'المرحلة الابتدائية',
    middleStage: 'المرحلة الإعدادية',
    highStage: 'المرحلة الثانوية',
  },
  fr: {
    // Basic translations for French
    back: 'Retour',
    logout: 'Déconnexion',
    next: 'Suivant',
    save: 'Enregistrer',
    delete: 'Supprimer',
    login: 'Connexion',
    teacherDashboardTitle: 'Tableau de bord de l\'enseignant',
    guardianDashboardTitle: 'Tableau de bord du parent',
    principalDashboardTitle: 'Tableau de bord du directeur',
    // ... etc
  },
  en: {
    // Basic translations for English
    back: 'Back',
    logout: 'Logout',
    next: 'Next',
    save: 'Save',
    delete: 'Delete',
    login: 'Login',
    teacherDashboardTitle: 'Teacher Dashboard',
    guardianDashboardTitle: 'Guardian Dashboard',
    principalDashboardTitle: 'Principal Dashboard',
    // ... etc
  },
};


type TranslationContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
};

const LanguageContext = createContext<TranslationContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['ar', 'fr', 'en'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
    if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }
  };
  
   useEffect(() => {
     if (language === 'ar') {
        document.documentElement.dir = 'rtl';
     } else {
        document.documentElement.dir = 'ltr';
     }
   }, [language]);

  const t = (key: string, options?: { [key: string]: string | number }): string => {
    const langTranslations = translations[language];
    let translation = key.split('.').reduce((obj, keyPart) => {
        if (obj && typeof obj === 'object' && keyPart in obj) {
            return (obj as any)[keyPart];
        }
        return undefined;
    }, langTranslations as any) || key;

    if (typeof translation === 'string' && options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{${optionKey}}`, String(options[optionKey]));
      });
    }

    return String(translation); // Ensure it's always a string
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
