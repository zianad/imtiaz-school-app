

import { Student, Teacher, Grade, Subject, EducationalStage, SchoolFeature } from './types';

export const SUPER_ADMIN_CODE = "Lunallena11241984";
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
    subjects: [Subject.Arabic, Subject.French, Subject.Math]
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

// --- Mock Data ---

const sampleArabicGrades: Grade[] = SUBJECT_MAP[Subject.Arabic].flatMap(sub =>
    ([1, 2] as const).flatMap(semester =>
        ([1, 2] as const).map(assignment => ({
            subSubject: sub, semester, assignment, score: Math.round((Math.random() * 4 + 6) * 10) / 10 // score between 6 and 10
        }))
    )
);

const sampleFrenchGrades: Grade[] = SUBJECT_MAP[Subject.French].flatMap(sub =>
    ([1, 2] as const).flatMap(semester =>
        ([1, 2] as const).map(assignment => ({
            subSubject: sub, semester, assignment, score: Math.round((Math.random() * 5 + 4) * 10) / 10 // score between 4 and 9
        }))
    )
);

const sampleMathGrades: Grade[] = SUBJECT_MAP[Subject.Math].flatMap(sub =>
    ([1, 2] as const).flatMap(semester =>
        ([1, 2] as const).map(assignment => ({
            subSubject: sub, semester, assignment, score: Math.round((Math.random() * 3 + 7) * 10) / 10 // score between 7 and 10
        }))
    )
);

const samplePhysicsGrades: Grade[] = SUBJECT_MAP[Subject.Physics].flatMap(sub =>
    ([1, 2] as const).flatMap(semester =>
        ([1, 2] as const).map(assignment => ({
            subSubject: sub, semester, assignment, score: Math.round((Math.random() * 4 + 5) * 10) / 10
        }))
    )
);

const sampleEnglishGrades: Grade[] = SUBJECT_MAP[Subject.English].flatMap(sub =>
    ([1, 2] as const).flatMap(semester =>
        ([1, 2] as const).map(assignment => ({
            subSubject: sub, semester, assignment, score: Math.round((Math.random() * 3 + 7) * 10) / 10
        }))
    )
);

const samplePhilosophyGrades: Grade[] = SUBJECT_MAP[Subject.Philosophy].flatMap(sub =>
    ([1, 2] as const).flatMap(semester =>
        ([1, 2] as const).map(assignment => ({
            subSubject: sub, semester, assignment, score: Math.round((Math.random() * 2 + 8) * 10) / 10
        }))
    )
);

export const MOCK_STUDENTS: Student[] = [
    {
        id: 'student_preschool_1',
        guardianCode: '12345',
        name: 'آدم',
        stage: EducationalStage.PRE_SCHOOL,
        level: 'القسم الأول',
        class: 'الفوج الأول',
        grades: {}
    },
    {
        id: 'student1',
        guardianCode: '11111',
        name: 'ندى',
        stage: EducationalStage.PRIMARY,
        level: 'المستوى الأول ابتدائي',
        class: 'الفوج الأول',
        grades: {
            [Subject.Arabic]: sampleArabicGrades,
            [Subject.French]: sampleFrenchGrades,
            [Subject.Math]: sampleMathGrades
        }
    },
    {
        id: 'student2',
        guardianCode: '2222',
        name: 'زياد بنجبار',
        stage: EducationalStage.PRIMARY,
        level: 'المستوى الرابع ابتدائي',
        class: 'الفوج الأول',
        grades: {
            [Subject.Arabic]: sampleArabicGrades.map(g => ({...g, score: g.score ? Math.min(10, g.score + 0.5) : null})),
            [Subject.French]: sampleFrenchGrades.map(g => ({...g, score: g.score ? Math.min(10, g.score - 0.5) : null})),
            [Subject.Math]: sampleMathGrades
        }
    },
    {
        id: 'student3',
        guardianCode: '3333',
        name: 'يوسف إبراهيم',
        stage: EducationalStage.PRIMARY,
        level: 'المستوى الثالث ابتدائي',
        class: 'الفوج الثاني',
        grades: {} // Student with no grades yet
    },
     {
        id: 'student4',
        name: 'فاطمة الزهراء',
        guardianCode: '4444',
        stage: EducationalStage.PRIMARY,
        level: 'المستوى الأول ابتدائي',
        class: 'الفوج الأول',
        grades: {
            [Subject.Arabic]: sampleArabicGrades.map(g => ({...g, score: g.score ? Math.max(0, g.score - 1) : null}))
        }
    },
    {
        id: 'student_middle_1',
        guardianCode: '5555',
        name: 'أمين العلوي',
        stage: EducationalStage.MIDDLE,
        level: 'الثانية إعدادي',
        class: 'الفوج الأول',
        grades: {
            [Subject.Physics]: samplePhysicsGrades,
            [Subject.English]: sampleEnglishGrades,
        }
    },
    {
        id: 'student_middle_2',
        guardianCode: '6666',
        name: 'سارة بوخريص',
        stage: EducationalStage.MIDDLE,
        level: 'الثانية إعدادي',
        class: 'الفوج الثاني',
        grades: {}
    },
    {
        id: 'student_high_1',
        guardianCode: '7777',
        name: 'ياسين حمدي',
        stage: EducationalStage.HIGH,
        level: 'الأولى باكالوريا',
        class: 'الفوج الأول',
        grades: {
            [Subject.Philosophy]: samplePhilosophyGrades,
            [Subject.English]: sampleEnglishGrades.map(g => ({...g, score: g.score ? Math.max(0, g.score - 1) : null})),
        }
    }
];

export const MOCK_TEACHERS: Teacher[] = [
    {
        id: 'teacher1',
        name: 'أحمد العلوي',
        loginCode: 'teacher01',
        subjects: [Subject.Arabic],
        salary: 8000,
        assignments: {
            'المستوى الخامس ابتدائي': ['الفوج الأول', 'الفوج الثاني'],
            'المستوى السادس ابتدائي': ['الفوج الأول']
        }
    },
    {
        id: 'teacher2',
        name: 'فاطمة الزهراء',
        loginCode: 'teacher02',
        subjects: [Subject.Physics],
        assignments: {
            'الثانية إعدادي': ['الفوج الأول', 'الفوج الثاني', 'الفوج الثالث'],
            'الثالثة إعدادي': ['الفوج الأول', 'الفوج الثاني']
        }
    },
    {
        id: 'teacher3',
        name: 'كريم المرابط',
        loginCode: 'teacher03',
        subjects: [Subject.Philosophy, Subject.Arabic],
        salary: 9500,
        assignments: {
            'الثانية باكالوريا': ['الفوج الأول'],
            'الأولى باكالوريا': ['الفوج الأول']
        }
    }
];
