import { Grade, Subject, EducationalStage, SchoolFeature, School } from './types';

// The code the super admin enters to log in. This check is case-insensitive.
export const SUPER_ADMIN_LOGIN_CODE = "Lunallena11241984";
// The email for the super admin user in Supabase Auth.
export const SUPER_ADMIN_EMAIL = "lunallena11241984@superadmin.com";
// IMPORTANT: The password for the super admin. This MUST match the password set in the Supabase dashboard.
export const SUPER_ADMIN_PASSWORD = "ImtiazApp_Lunallena11241984_S3cure!";

export const HELP_PHONE_NUMBER = "+213123456789"; // Example phone number

export const CLASSES = ['الفوج الأول', 'الفوج الثاني', 'الفوج الثالث', 'الفوج الرابع', 'الفوج الخامس'];

export const STAGE_DETAILS = {
  [EducationalStage.PRE_SCHOOL]: {
    label: 'التعليم الأولي',
    levels: ['القسم الأول', 'القسم الثاني', 'القسم التحضيري'],
    subjects: [Subject.Arabic, Subject.French, Subject.Math]
  },
  [EducationalStage.PRIMARY]: {
    label: 'المرحلة الابتدائية',
    levels: [
      'المستوى الأول ابتدائي', 'المستوى الثاني ابتدائي', 'المستوى الثالث ابتدائي', 
      'المستوى الرابع ابتدائي', 'المستوى الخامس ابتدائي', 'المستوى السادس ابتدائي'
    ],
    subjects: [Subject.Arabic, Subject.French, Subject.Math, Subject.IslamicEducation, Subject.SocialStudies]
  },
  [EducationalStage.MIDDLE]: {
    label: 'المرحلة الإعدادية',
    levels: ['الأولى إعدادي', 'الثانية إعدادي', 'الثالثة إعدادي'],
    subjects: [
      Subject.Arabic, Subject.French, Subject.English, Subject.Math, 
      Subject.Physics, Subject.NaturalSciences, Subject.SocialStudies, 
      Subject.IslamicEducation, Subject.ComputerScience
    ]
  },
  [EducationalStage.HIGH]: {
    label: 'المرحلة الثانوية',
    levels: ['الجذع المشترك', 'الأولى باكالوريا', 'الثانية باكالوريا'],
    subjects: [
      Subject.Arabic, Subject.French, Subject.English, Subject.Math, 
      Subject.Physics, Subject.NaturalSciences, Subject.SocialStudies, 
      Subject.IslamicEducation, Subject.ComputerScience, Subject.Philosophy
    ]
  }
};

export const LEVELS = Object.values(STAGE_DETAILS).flatMap(stage => stage.levels);

export const SUBJECT_MAP: { [key in Subject]: string[] } = {
    [Subject.Arabic]: [
        'الصرف والتحويل', 'التراكيب', 'الأملاء', 'الفهم', 'التعبير الكتابي'
    ],
    [Subject.French]: [
        'Lecture', 'Grammaire', 'Conjugaison', 'Orthographe', 'Production écrite'
    ],
    [Subject.Math]: [
        'Numération et Calcul', 'Géométrie', 'Mesures'
    ],
    [Subject.IslamicEducation]: ['القرآن الكريم', 'العقيدة', 'العبادات', 'الآداب الإسلامية'],
    [Subject.SocialStudies]: ['التاريخ', 'الجغرافيا', 'التربية على المواطنة'],
    [Subject.English]: ['Grammar', 'Reading', 'Writing', 'Speaking'],
    [Subject.Physics]: ['الميكانيك', 'الكهرباء', 'البصريات', 'الكيمياء'],
    [Subject.NaturalSciences]: ['البيولوجيا', 'الجيولوجيا'],
    [Subject.ComputerScience]: ['الخوارزميات', 'البرمجة', 'الشبكات'],
    [Subject.Philosophy]: ['تاريخ الفلسفة', 'نظرية المعرفة', 'الأخلاق']
};

export const SUBJECT_ICONS: { [key in Subject]: string } = {
    [Subject.Arabic]: '📝',
    [Subject.French]: '🇫🇷',
    [Subject.Math]: '🔢',
    [Subject.IslamicEducation]: '🕌',
    [Subject.SocialStudies]: '🌍',
    [Subject.English]: '🇬🇧',
    [Subject.Physics]: '⚛️',
    [Subject.NaturalSciences]: '🔬',
    [Subject.ComputerScience]: '💻',
    [Subject.Philosophy]: '🤔',
};

export const getBlankGrades = (subject: Subject): Grade[] => {
    const subSubjects = SUBJECT_MAP[subject] || [];
    return subSubjects.flatMap(sub =>
        ([1, 2] as const).flatMap(semester =>
            ([1, 2] as const).map(assignment => ({
                subSubject: sub,
                semester,
                assignment,
                score: null
            }))
        )
    );
};

export const ALL_FEATURES_ENABLED: Record<SchoolFeature, boolean> = {
    statisticsDashboard: true,
    educationalTips: true,
    announcements: true,
    complaintsAndSuggestions: true,
    reviewNotes: true,
    monthlyFees: true,
    interviewRequests: true,
    schoolManagement: true,
    browseAsTeacher: true,
    reviewAlbumPhotos: true,
    financialManagement: true,
    teacherManageSummaries: true,
    teacherManageExercises: true,
    teacherManageNotesAndAbsences: true,
    teacherManageGrades: true,
    teacherManageExamProgram: true,
    teacherGenerateAiNotes: true,
    teacherLessonPlanner: true,
    teacherPersonalizedExercises: true,
    teacherManageSupplementaryLessons: true,
    teacherManageUnifiedAssessments: true,
    teacherManageTimetable: true,
    teacherManageQuizzes: true,
    teacherManageProjects: true,
    teacherManageLibrary: true,
    teacherManageAlbum: true,
    teacherManageTalkingCards: true,
    teacherManageMemorization: true,
    teacherViewAnnouncements: true,
    guardianViewSummaries: true,
    guardianViewExercises: true,
    guardianViewNotesAndAbsences: true,
    guardianViewGrades: true,
    guardianViewExamProgram: true,
    guardianViewPersonalizedExercises: true,
    guardianViewSupplementaryLessons: true,
    guardianViewUnifiedAssessments: true,
    guardianViewTimetable: true,
    guardianViewQuizzes: true,
    guardianViewProjects: true,
    guardianViewLibrary: true,
    guardianViewAlbum: true,
    guardianPayFees: true,
    guardianSubmitComplaints: true,
    guardianRequestInterview: true,
    guardianViewTalkingCards: true,
    guardianViewMemorization: true,
};

// FIX: Define and export MOCK_SCHOOLS for offline mode.
export const MOCK_SCHOOLS: School[] = [
  {
    id: 'mock-school-1',
    name: 'مدرسة النجاح النموذجية (تجريبي)',
    logoUrl: 'https://i.imgur.com/3gXIM3w.png',
    principals: [
        { id: 'principal-1', name: 'مدير الابتدائي', loginCode: 'p1', stage: EducationalStage.PRIMARY },
        { id: 'principal-2', name: 'مدير الإعدادي', loginCode: 'p2', stage: EducationalStage.MIDDLE }
    ],
    isActive: true,
    stages: [EducationalStage.PRE_SCHOOL, EducationalStage.PRIMARY, EducationalStage.MIDDLE, EducationalStage.HIGH],
    featureFlags: ALL_FEATURES_ENABLED,
    monthlyFeeAmount: 350,
    transportationFee: 150,
    students: [
        {
            id: 'student-1',
            guardianCode: 'g1',
            name: 'أحمد الصديق',
            stage: EducationalStage.PRIMARY,
            level: 'المستوى الخامس ابتدائي',
            class: 'الفوج الأول',
            grades: {
                [Subject.Arabic]: [
                    { subSubject: 'التراكيب', semester: 1, assignment: 1, score: 8 },
                    { subSubject: 'التراكيب', semester: 1, assignment: 2, score: 7.5 },
                ]
            }
        },
        {
            id: 'student-2',
            guardianCode: 'g2',
            name: 'فاطمة الزهراء',
            stage: EducationalStage.MIDDLE,
            level: 'الأولى إعدادي',
            class: 'الفوج الثاني',
            grades: {}
        }
    ],
    teachers: [
        {
            id: 'teacher-1',
            name: 'الأستاذة خديجة',
            loginCode: 't1',
            subjects: [Subject.Arabic, Subject.French],
            assignments: {
                'المستوى الخامس ابتدائي': ['الفوج الأول', 'الفوج الثاني'],
                'المستوى السادس ابتدائي': ['الفوج الأول']
            },
            salary: 5000
        }
    ],
    summaries: [],
    exercises: [],
    notes: [],
    absences: [],
    examPrograms: [],
    notifications: [],
    announcements: [],
    complaints: [],
    educationalTips: [],
    monthlyFeePayments: [],
    interviewRequests: [],
    supplementaryLessons: [],
    timetables: [],
    quizzes: [],
    projects: [],
    libraryItems: [],
    albumPhotos: [],
    personalizedExercises: [],
    unifiedAssessments: [],
    talkingCards: [],
    memorizationItems: [],
    expenses: [],
    feedback: [],
  }
];