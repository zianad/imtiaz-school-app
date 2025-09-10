// FIX: This file was missing its content. It has been implemented with i18next configuration and translation resources.
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Subject } from './types';

const resources = {
  ar: {
    translation: {
      // Common
      back: 'رجوع',
      logout: 'تسجيل الخروج',
      next: 'التالي',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      cancel: 'إلغاء',
      add: 'إضافة',
      update: 'تحديث',
      confirm: 'تأكيد',
      loading: 'جاري التحميل',
      close: 'إغلاق',
      later: 'لاحقاً',
      send: 'إرسال',
      all: 'الكل',
      saveChanges: "حفظ التغييرات",
      savePassword: "حفظ كلمة المرور",
      newPassword: "كلمة المرور الجديدة",
      changePassword: "تغيير كلمة المرور",
      paid: "تم الدفع",
      markAsPaid: "تأكيد الدفع",
      approve: 'موافقة',
      reject: 'رفض',
      download: "تحميل",
      capture: "التقاط صورة",
      saveItem: "حفظ العنصر",
      fillAllFields: "الرجاء ملء جميع الحقول المطلوبة.",
      
      // Login & Generic
      discoverPleasureOfLearning: "اكتشف متعة التعلم",
      invalidCode: "الرمز الذي أدخلته غير صالح. الرجاء المحاولة مرة أخرى.",
      rlsLoginError: "خطأ في تسجيل الدخول. قد تكون هناك مشكلة في إعدادات الأمان (RLS) في قاعدة البيانات. يرجى الاتصال بالدعم الفني.",
      supabaseEmailConfirmationError: "يتطلب Supabase تفعيل البريد الإلكتروني. يرجى مراجعة إعدادات مشروع Supabase الخاص بك.",
      supabaseSignupsDisabledError: "تم تجاوز الحد الأقصى لمعدل تسجيل البريد الإلكتروني أو تم تعطيل الاشتراكات الجديدة في Supabase.",
      requestHelp: "هل تحتاج إلى مساعدة؟ اتصل بالدعم",
      helpNote: "إذا كنت تواجه مشاكل في تسجيل الدخول، يرجى الاتصال بإدارة المدرسة.",
      maintenanceTitle: "التطبيق قيد الصيانة",
      maintenanceMessage: "نحن نقوم ببعض التحديثات لتحسين تجربتك. سنعود قريباً!",
      rememberMe: "تذكرني",
      loginCodePlaceholder: "أدخل الرمز هنا",
      login: "تسجيل الدخول",
      unifiedLoginWelcome: "مرحبا بكم في مدرستكم",
      unifiedLoginPrompt: "الرجاء إدخال الرمز الخاص بك للدخول",

      // Subjects
      [Subject.Arabic]: "اللغة العربية",
      [Subject.French]: "اللغة الفرنسية",
      [Subject.Math]: "الرياضيات",
      [Subject.IslamicEducation]: "التربية الإسلامية",
      [Subject.SocialStudies]: "الاجتماعيات",
      [Subject.English]: "اللغة الإنجليزية",
      [Subject.Physics]: "الفيزياء والكيمياء",
      [Subject.NaturalSciences]: "علوم الحياة والأرض",
      [Subject.ComputerScience]: "المعلوميات",
      [Subject.Philosophy]: "الفلسفة",

      // Guardian
      guardianDashboardTitle: "لوحة تحكم ولي الأمر",
      selectSubjectToFollow: "اختر المادة للمتابعة",
      studentLevel: "المستوى الدراسي",
      guardianNotesTitle: "ملاحظات وغيابات التلميذ",
      summaries: "الملخصات",
      exercises: "التمارين",
      notes: "الملاحظات",
      studentGrades: "نقط التلميذ",
      examProgram: "برنامج الفروض",
      notesAndAbsences: "الملاحظات والغيابات",
      personalizedExercises: "تمارين الدعم",
      supplementaryLessons: "دروس إضافية",
      unifiedAssessments: "الامتحانات الموحدة",
      timetable: "جدول الحصص",
      quizzes: "روائز",
      unitProject: "مشروع الوحدة",
      digitalLibrary: "المكتبة الرقمية",
      classAlbum: "ألبوم القسم",
      talkingCards: "البطاقات الناطقة",
      memorizationHelper: "مساعد الحفظ",
      monthlyFees: "الواجبات الشهرية",
      viewAnnouncements: "الاطلاع على الإعلانات",
      viewEducationalTips: "نصائح تربوية",
      submitComplaintOrSuggestion: "شكاية أو اقتراح",
      requestInterview: "طلب مقابلة",
      notifications: "الإشعارات",
      noNewNotifications: "لا توجد إشعارات جديدة.",
      fromGuardianOf: "من ولي أمر التلميذ(ة):",
      paymentAmount: "المبلغ (درهم)",
      totalAmount: "المبلغ الإجمالي",
      transportation: "النقل",
      payByCard: "الدفع بواسطة البطاقة البنكية",
      cardNumber: "رقم البطاقة",
      expiryDate: "تاريخ الانتهاء (MM/YY)",
      cvc: "CVC",
      cardholderName: "اسم حامل البطاقة",
      confirmPayment: "تأكيد الدفع",
      processingPayment: "جاري معالجة الدفع...",
      paymentSuccessful: "تم الدفع بنجاح",
      academicYearMonths: "شهور السنة الدراسية",
      paymentCompleted: "تم الأداء",
      paymentDue: "واجب الأداء",
      pay: "أداء",
      requestSent: "تم إرسال الطلب بنجاح",
      confirmRequestInterview: "تأكيد طلب المقابلة",
      requestInterviewPrompt: "هل تود طلب مقابلة مع الإدارة بخصوص التلميذ(ة)؟",
      noLessons: "لا توجد دروس إضافية حاليا.",
      noTimetable: "لم يتم نشر جدول الحصص بعد.",
      noQuizzes: "لا توجد روائز حاليا.",
      noProjects: "لا توجد مشاريع حاليا.",
      noBooks: "لا توجد كتب في المكتبة الرقمية حاليا.",
      noPersonalizedExercises: "لا توجد تمارين دعم حاليا.",
      noPhotos: "لا توجد صور في الألبوم حاليا.",
      noAssessments: "لا توجد امتحانات موحدة حاليا.",
      noTalkingCards: "لا توجد بطاقات ناطقة حاليا.",
      noMemorizationItems: "لا توجد مواد للحفظ حاليا.",
      miscellaneous: "متفرقات",

      // Teacher
      teacherDashboardTitle: "لوحة تحكم الأستاذ",
      browseAsTeacher: "تصفح كأستاذ",
      teacherSelectLevelAndSubject: "اختر المستوى والمادة للبدء",
      level: "المستوى",
      class: "القسم",
      aiNotes: "ملاحظات بالذكاء الاصطناعي",
      lessonPlanner: "تحضير الدروس",
      aiGeneratedNote: "ملاحظة من الذكاء الاصطناعي",
      sentForReviewSuccess: "تم إرسال الملاحظة للمراجعة بنجاح!",
      sendForReview: "إرسال للمراجعة",
      lessonTitle: "عنوان الدرس",
      contentText: "محتوى النص",
      contentDomainOptional: "مكون المادة (اختياري)",
      addSupplementaryLesson: "إضافة درس دعم",
      externalLink: "الرابط الخارجي",
      addLink: "إضافة الرابط",
      addTimetable: "إضافة جدول حصص",
      uploadTimetable: "تحميل جدول الحصص (صورة أو PDF)",
      addQuiz: "إضافة رائـز (Quiz)",
      uploadImageForQuiz: "قم برفع صورة (نص، تمرين...) لإنشاء رائـز تلقائيا",
      generatingQuiz: "جاري إنشاء الرائـز...",
      generateQuizFromImage: "إنشاء رائـز من الصورة",
      saveQuiz: "حفظ الرائـز",
      addProject: "إضافة مشروع",
      projectTitle: "عنوان المشروع",
      projectDescription: "وصف المشروع",
      uploadPhoto: "رفع صورة",
      takePhoto: "التقاط صورة",
      addBook: "إضافة كتاب",
      bookTitle: "عنوان الكتاب",
      bookDescription: "وصف الكتاب (اختياري)",
      uploadBook: "رفع الكتاب (PDF)",
      lessonTopic: "موضوع الدرس أو الوحدة",
      generatingPlan: "جاري إنشاء الخطة...",
      generatePlan: "إنشاء خطة الدرس",
      lessonPlan: "خطة الدرس المقترحة",
      generatingExercises: "جاري إنشاء التمارين...",
      generateExercises: "إنشاء تمارين دعم",
      saveAndSendExercises: "حفظ وإرسال التمارين",
      addPhoto: "إضافة صورة للألبوم",
      photoCaption: "وصف الصورة",
      savePhoto: "حفظ الصورة وإرسالها للمراجعة",
      approved: "مقبول",
      pending: "قيد المراجعة",
      addTalkingCard: "إضافة بطاقة ناطقة",
      analyzing: "جاري التحليل...",
      analyzeWithAI: "تحليل الصورة بالذكاء الاصطناعي",
      reviewAIDetections: "مراجعة العناصر المكتشفة",
      editAIDetections_desc: "يمكنك تعديل أو حذف التسميات قبل الحفظ. اضغط على 🔊 للاستماع.",
      saveCard: "حفظ البطاقة",
      cardSaved: "تم حفظ البطاقة بنجاح!",
      addMemorizationItem: "إضافة مادة للحفظ",
      addByText: "نص",
      addByImage: "صورة",
      addByAudio: "صوت",
      memorizationItemTitle: "عنوان المادة (مثال: سورة الفاتحة)",
      extractingTextFromImage: "جاري استخراج النص من الصورة...",
      recordAudio: "🎙️ تسجيل صوتي",
      stopRecording: "🛑 إيقاف التسجيل",
      listenToRecording: "الاستماع للتسجيل:",
      itemSaved: "تم حفظ العنصر بنجاح!",
      repeat: "تكرار",
      listen: "استمع",
      infiniteRepeat: "لانهائي",
      saveSuccess: "تم الحفظ بنجاح",

      // Principal
      principalDashboardTitle: "لوحة تحكم المدير",
      selectStage: "اختر السلك التعليمي",
      principalWelcome: "مرحباً بك في لوحة التحكم.",
      PRE_SCHOOLStage: "التعليم الأولي",
      PRIMARYStage: "المرحلة الابتدائية",
      MIDDLEStage: "المرحلة الإعدادية",
      HIGHStage: "المرحلة الثانوية",
      statisticsDashboard: "لوحة الإحصائيات",
      educationalTips: "النصائح التربوية",
      announcements: "الإعلانات",
      complaintsAndSuggestions: "الشكايات والاقتراحات",
      reviewNotes: "مراجعة الملاحظات",
      schoolManagement: "إدارة المؤسسة",
      reviewAlbumPhotos: "مراجعة صور الألبوم",
      financialManagement: "التدبير المالي",
      manageTeachers: "تدبير الأساتذة",
      manageStudents: "تدبير التلاميذ",
      manageFees: "تدبير الرسوم",
      dashboard: "لوحة القيادة",
      changeStage: "تغيير السلك",
      addTeacher: "إضافة أستاذ(ة)",
      editTeacher: "تعديل معلومات الأستاذ(ة)",
      teacherName: "اسم الأستاذ(ة)",
      confirmDeleteTeacher: "هل أنت متأكد من حذف الأستاذ(ة) {{name}}؟",
      existingTeachers: "الأساتذة الحاليون",
      addStudent: "إضافة تلميذ",
      confirmDeleteStudent: "هل أنت متأكد من حذف التلميذ(ة) {{name}}؟",
      studentName: "اسم التلميذ(ة)",
      guardianCode: "رمز ولي الأمر",
      searchByName: "البحث بالاسم...",
      noStudentsInClass: "لا يوجد تلاميذ في هذا القسم.",
      existingStudents: "التلاميذ الحاليون",
      assessmentTitle: "عنوان الامتحان",
      attachFile: "إرفاق ملف (صورة أو PDF)",
      targetAudience: "مرسل إلى",
      guardians: "أولياء الأمور",
      teachers: "الأساتذة",
      sendAnnouncement: "إرسال الإعلان",
      sentAnnouncements: "الإعلانات المرسلة",
      noAnnouncements: "لا توجد إعلانات حاليا.",
      selectTeachers: "اختيار الأساتذة",
      complaintAnalysis: "تحليل الشكايات بالذكاء الاصطناعي",
      analyzeComplaints: "تحليل الشكايات",
      receivedComplaints: "الشكايات الواردة",
      noComplaints: "لا توجد شكايات حاليا.",
      noComplaintsToAnalyze: "لا توجد شكايات كافية للتحليل.",
      sendTip: "إرسال النصيحة",
      generateWithAI: "إنشاء نصيحة بالذكاء الاصطناعي",
      educationalTipContent: "محتوى النصيحة التربوية...",
      sentTips: "النصائح المرسلة",
      noTips: "لا توجد نصائح حاليا.",
      performanceTracking: "تتبع الأداء",
      averageGradePerLevel: "متوسط النقاط حسب المستوى",
      averageGrade: "المعدل",
      levelPerformance: "أداء مستوى: {{level}}",
      noStudents: "لا يوجد تلاميذ.",
      enterAsPrincipal: "الدخول كمدير",
      enterPrincipalDashboard: "الدخول للوحة تحكم {{stageName}}",
      managePrincipals: "إدارة المدراء",
      principalManagementForStage: "إدارة مدير(ة) {{stageName}}",
      principalName: "اسم المدير(ة)",
      loginCode: "الرمز السري",
      featureToggleTitle: "تفعيل/تعطيل الميزات",
      principalFeaturesSection: "ميزات المدير",
      teacherFeaturesSection: "ميزات الأستاذ",
      guardianFeaturesSection: "ميزات ولي الأمر",
      schoolStatus: "حالة المؤسسة",
      active: "مفعلة",
      inactive: "غير مفعلة",
      principalFeeManagement: "تدبير الواجبات الشهرية",
      monthlyFeeAmountLabel: "مبلغ الواجب الشهري",
      transportationFeeAmountLabel: "مبلغ واجب النقل",
      feesUpdated: "تم تحديث المبالغ بنجاح!",
      requestFrom: "طلب مقابلة من ولي أمر: {{studentName}}",
      markAsCompleted: "تحديد كمكتملة",
      noInterviewRequests: "لا توجد طلبات مقابلة حاليا.",
      noPhotosToReview: "لا توجد صور في انتظار المراجعة.",
      importFromExcel: "استيراد من ملف إكسل",
      importExcelInstructions: "يجب أن يحتوي الملف على أعمدة بالأسماء التالية: 'name' (أو 'الاسم') و 'guardian_code' (أو 'رمز ولي الأمر').",
      importExcelNote: "ملاحظة: سيتم إضافة جميع التلاميذ المستوردين إلى المستوى والقسم المحددين حالياً: {{level}} - {{class}}.",
      selectExcelFile: "اختر ملف إكسل",
      importing: "جاري الاستيراد...",
      importProcessing: "جاري معالجة الملف...",
      importError: "حدث خطأ أثناء معالجة الملف. الرجاء التأكد من أن التنسيق صحيح.",
      importReport: "اكتمل الاستيراد.\nالناجحة: {{successCount}} / {{total}}\nالفاشلة: {{errorCount}} / {{total}}\n\nالتفاصيل:\n{{errors}}",
      importMissingData: "بيانات ناقصة في الصف",
      guardianCodeInUseError: "رمز ولي الأمر '{{code}}' مستخدم بالفعل.",
      noPrincipalForStage: "لا يوجد مدير معين لهذه المرحلة: {{stageName}}",

       // Super Admin
      superAdminDashboardTitle: "لوحة تحكم المدير الخارق",
      rlsNoticeTitle: "تنبيه هام بخصوص أمان الوصول للبيانات (RLS)",
      rlsNoticeBody1: "لضمان أمان بيانات كل مدرسة، يجب تفعيل Row Level Security في Supabase.",
      rlsNoticeBody2: "يجب إنشاء سياسات (Policies) لجداول `students`, `teachers`, `principals` وغيرها لضمان أن كل مستخدم يمكنه الوصول فقط إلى البيانات المرتبطة بمدرسته (`school_id`).",
      rlsNoticeBody3: "مثال لسياسة على جدول `students`: `(auth.uid() = (SELECT user_id FROM user_school_roles WHERE school_id = students.school_id))`",
      feedbackAnalysis: "تحليل تقييمات التطبيق",
      addSchoolSectionTitle: "إضافة مؤسسة جديدة",
      newSchoolNamePlaceholder: "اسم المؤسسة الجديدة",
      principalSecretCodePlaceholder: "الرمز السري للمدير العام",
      addSchool: "إضافة المؤسسة",
      currentSchools: "المؤسسات الحالية",
      principalCodeLabel: "رمز المدير",
      noSchoolsAdded: "لم تتم إضافة أي مؤسسة بعد.",
      enterSchoolNameAndCode: "الرجاء إدخال اسم المؤسسة ورمز المدير.",
      feedbackAnalysisReport: "تقرير تحليل التقييمات",
      averageRating: "متوسط التقييم العام",
      analyzeAllFeedback: "تحليل جميع التقييمات",
      allFeedback: "جميع التقييمات",
      noFeedbackToAnalyze: "لا توجد تقييمات كافية للتحليل.",
    }
  },
  fr: {
    translation: {
      back: 'Retour',
      logout: 'Déconnexion',
      login: 'Connexion',
      [Subject.Arabic]: "Langue Arabe",
      [Subject.French]: "Langue Française",
      [Subject.Math]: "Mathématiques",
      [Subject.IslamicEducation]: "Éducation Islamique",
      [Subject.SocialStudies]: "Études Sociales",
      [Subject.English]: "Langue Anglaise",
      [Subject.Physics]: "Physique-Chimie",
      [Subject.NaturalSciences]: "Sciences de la Vie et de la Terre",
      [Subject.ComputerScience]: "Informatique",
      [Subject.Philosophy]: "Philosophie",
      guardianDashboardTitle: "Tableau de bord du tuteur",
      selectSubjectToFollow: "Choisissez une matière à suivre",
    }
  },
  en: {
    translation: {
      back: 'Back',
      logout: 'Logout',
      login: 'Login',
      [Subject.Arabic]: "Arabic",
      [Subject.French]: "French",
      [Subject.Math]: "Mathematics",
      [Subject.IslamicEducation]: "Islamic Education",
      [Subject.SocialStudies]: "Social Studies",
      [Subject.English]: "English",
      [Subject.Physics]: "Physics & Chemistry",
      [Subject.NaturalSciences]: "Life and Earth Sciences",
      [Subject.ComputerScience]: "Computer Science",
      [Subject.Philosophy]: "Philosophy",
      guardianDashboardTitle: "Guardian Dashboard",
      selectSubjectToFollow: "Select a subject to follow",
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

export { useTranslation };
export default i18n;