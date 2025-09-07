import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Re-export the hook for convenience, so other components don't need to change their imports.
export { useTranslation } from 'react-i18next';

// Minimal translations gathered from component usage
const resources = {
  ar: {
    translation: {
      back: 'رجوع',
      logout: 'تسجيل الخروج',
      guardianDashboardTitle: 'لوحة تحكم ولي الأمر',
      studentLevel: 'المستوى',
      selectSubjectToFollow: 'اختر المادة للمتابعة',
      memorizationHelper: 'مساعد الحفظ',
      login: 'دخول',
      invalidCode: 'الرمز الذي أدخلته غير صحيح.',
      rlsLoginError: 'خطأ في تسجيل الدخول. قد تكون سياسة RLS مفقودة أو غير صحيحة.',
      supabaseEmailConfirmationError: 'خطأ في Supabase: لم يتم تأكيد البريد الإلكتروني. يرجى مراجعة الإدارة.',
      supabaseSignupsDisabledError: 'خطأ في Supabase: التسجيل معطل حالياً. يرجى مراجعة الإدارة.',
      unifiedLoginWelcome: 'مرحبا بكم في منصة إمتياز',
      unifiedLoginPrompt: 'المرجو إدخال الرمز الخاص بكم للولوج',
      loginCodePlaceholder: 'أدخل الرمز هنا',
      rememberMe: 'تذكرني',
      requestHelp: 'هل تحتاج إلى مساعدة؟',
      helpNote: 'اتصل بإدارة المدرسة للحصول على رمزك',
      maintenanceTitle: 'المنصة في صيانة',
      maintenanceMessage: 'المنصة حاليا متوقفة للصيانة. نعتذر عن الإزعاج.',
      notifications: 'الإشعارات',
      noNewNotifications: 'لا توجد إشعارات جديدة.',
      summaries: 'الملخصات',
      exercises: 'التمارين',
      notes: 'الملاحظات',
      studentGrades: 'نقط التلاميذ',
      examProgram: 'برنامج الفروض',
      personalizedExercises: 'تمارين مخصصة',
      supplementaryLessons: 'دروس الدعم',
      unifiedAssessments: 'الامتحانات الموحدة',
      timetable: 'جدول الحصص',
      quizzes: 'الروائز',
      unitProject: 'مشروع الوحدة',
      digitalLibrary: 'المكتبة الرقمية',
      classAlbum: 'ألبوم القسم',
      talkingCards: 'البطاقات الناطقة',
      monthlyFees: 'الرسوم الشهرية',
      viewAnnouncements: 'عرض الإعلانات',
      viewEducationalTips: 'عرض النصائح التربوية',
      submitComplaintOrSuggestion: 'تقديم شكوى أو اقتراح',
      requestInterview: 'طلب مقابلة',
      "PRE_SCHOOL": "التعليم الأولي",
      "PRIMARY": "المرحلة الابتدائية",
      "MIDDLE": "المرحلة الإعدادية",
      "HIGH": "المرحلة الثانوية",
      'pre_schoolStage': 'التعليم الأولي',
      'primaryStage': 'المرحلة الابتدائية',
      'middleStage': 'المرحلة الإعدادية',
      'highStage': 'المرحلة الثانوية',
      'اللغة العربية': 'اللغة العربية',
      'اللغة الفرنسية': 'اللغة الفرنسية',
      'الرياضيات': 'الرياضيات',
      'التربية الإسلامية': 'التربية الإسلامية',
      'الاجتماعيات': 'الاجتماعيات',
      'اللغة الإنجليزية': 'اللغة الإنجليزية',
      'الفيزياء والكيمياء': 'الفيزياء والكيمياء',
      'علوم الحياة والأرض': 'علوم الحياة والأرض',
      'المعلوميات': 'المعلوميات',
      'الفلسفة': 'الفلسفة',
      teacher: 'أستاذ',
      guardian: 'ولي الأمر',
      principal: 'مدير',
      super_admin: 'مدير خارق',
      add: 'إضافة',
      edit: 'تعديل',
      delete: 'حذف',
      update: 'تحديث',
      cancel: 'إلغاء',
      teacherName: 'اسم الأستاذ(ة)',
      loginCode: 'الرمز السري',
      subject: 'المادة',
      levels: 'المستويات',
      classes: 'الأفواج',
      fillAllFields: 'المرجو ملء جميع الحقول المطلوبة.',
      confirmDeleteTeacher: 'هل أنت متأكد من أنك تريد حذف الأستاذ(ة) {{name}}؟',
      addTeacher: 'إضافة أستاذ(ة)',
      existingTeachers: 'الأساتذة الحاليون',
      loading: 'جاري التحميل',
      manageTeachers: 'تدبير الأساتذة',
      manageStudents: 'تدبير التلاميذ',
      addStudent: 'إضافة تلميذ(ة)',
      studentName: 'اسم التلميذ(ة)',
      guardianCode: 'رمز ولي الأمر',
      existingStudents: 'التلاميذ الحاليون',
      confirmDeleteStudent: 'هل أنت متأكد من أنك تريد حذف التلميذ(ة) {{name}}؟',
    }
  },
  fr: {
    translation: {
      back: 'Retour',
      logout: 'Déconnexion',
      // ... more keys
    }
  },
  en: {
    translation: {
      back: 'Back',
      logout: 'Logout',
      // ... more keys
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    debug: false,
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;