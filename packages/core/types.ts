

export type Language = 'ar' | 'fr' | 'en';

export enum Page {
  UnifiedLogin,
  // FIX: Add Maintenance page for inactive schools.
  Maintenance,

  // Super Admin
  SuperAdminDashboard,
  SuperAdminSchoolManagement,
  SuperAdminFeedbackAnalysis,

  // Principal Flow
  PrincipalStageSelection,
  PrincipalDashboard,
  PrincipalReviewNotes,
  PrincipalManageTeachers,
  PrincipalManageStudents,
  PrincipalAnnouncements,
  PrincipalComplaints,
  PrincipalEducationalTips,
  PrincipalPerformanceTracking,
  PrincipalManagementMenu,
  PrincipalMonthlyFees,
  PrincipalInterviewRequests,
  PrincipalBrowseAsTeacherSelection,
  PrincipalFeeManagement,
  PrincipalReviewAlbum, 
  PrincipalFinancialDashboard,

  // Teacher Flow
  TeacherDashboard,
  TeacherClassSelection,
  TeacherActionMenu,
  TeacherManageSummaries,
  TeacherManageExercises,
  TeacherManageNotes,
  TeacherStudentSelection,
  TeacherStudentGrades,
  TeacherManageExamProgram,
  TeacherGenerateReportCard,
  TeacherStudentReportGeneration,
  TeacherAddSupplementaryLesson,
  TeacherAddUnifiedAssessment,
  TeacherAddTimetable,
  TeacherAddQuiz,
  TeacherAddProject,
  TeacherAddLibrary,
  TeacherLessonPlanner, 
  TeacherStudentSelectionForExercises, 
  TeacherPersonalizedExercises, 
  TeacherManageAlbum, 
  TeacherManageTalkingCards,
  TeacherManageMemorization,
  TeacherViewAnnouncements,

  // Guardian Flow
  GuardianDashboard,
  GuardianSubjectMenu,
  GuardianViewSummaries,
  GuardianViewExercises,
  GuardianViewNotes,
  GuardianViewGrades,
  GuardianViewExamProgram,
  GuardianViewSupplementaryLessons,
  GuardianViewUnifiedAssessments,
  GuardianViewTimetable,
  GuardianViewQuizzes,
  GuardianViewProjects,
  GuardianViewLibrary,
  GuardianNotifications,
  GuardianViewAnnouncements,
  GuardianViewEducationalTips,
  GuardianSubmitComplaint,
  GuardianMonthlyFees,
  GuardianRequestInterview,
  GuardianViewPersonalizedExercises, 
  GuardianViewAlbum, 
  GuardianViewTalkingCards,
  GuardianViewMemorization,
}

export enum UserRole {
  Teacher = 'teacher',
  Guardian = 'guardian',
  Principal = 'principal',
  SuperAdmin = 'super_admin',
}

export enum EducationalStage {
  PRE_SCHOOL = 'PRE_SCHOOL',
  PRIMARY = 'PRIMARY',
  MIDDLE = 'MIDDLE',
  HIGH = 'HIGH',
}

export enum Subject {
  // Primary
  Arabic = 'اللغة العربية',
  French = 'اللغة الفرنسية',
  Math = 'الرياضيات',
  IslamicEducation = 'التربية الإسلامية',
  SocialStudies = 'الاجتماعيات',

  // Middle & High
  English = 'اللغة الإنجليزية',
  Physics = 'الفيزياء والكيمياء',
  NaturalSciences = 'علوم الحياة والأرض',
  ComputerScience = 'المعلوميات',
  Philosophy = 'الفلسفة',
}


export interface Teacher {
  id: string;
  name: string;
  loginCode: string;
  subjects: Subject[];
  salary?: number;
  assignments: {
    [level: string]: string[];
  };
}

export interface Principal {
  id: string;
  name: string;
  loginCode: string;
  stage: EducationalStage;
}

export interface Announcement {
  id: number;
  content: string;
  image?: string;
  pdf?: { name: string; url: string };
  targetAudience: 'guardians' | 'teachers';
  teacherIds?: string[];
  date: Date;
}

export interface Complaint {
    id: number;
    content: string;
    image?: string;
    pdf?: { name: string; url: string };
    studentId: string;
    date: Date;
}

export interface EducationalTip {
    id: number;
    content: string;
    date: Date;
}

export type SchoolFeature =
  // Principal Features
  | 'statisticsDashboard'
  | 'educationalTips' // Shared with Guardian
  | 'announcements' // Shared with Guardian
  | 'complaintsAndSuggestions'
  | 'reviewNotes'
  | 'monthlyFees'
  | 'interviewRequests'
  | 'schoolManagement'
  | 'browseAsTeacher'
  | 'reviewAlbumPhotos'
  | 'financialManagement'
  
  // Teacher Features
  | 'teacherManageSummaries'
  | 'teacherManageExercises'
  | 'teacherManageNotesAndAbsences'
  | 'teacherManageGrades'
  | 'teacherManageExamProgram'
  | 'teacherGenerateAiNotes'
  | 'teacherLessonPlanner'
  | 'teacherPersonalizedExercises'
  | 'teacherManageSupplementaryLessons'
  | 'teacherManageUnifiedAssessments'
  | 'teacherManageTimetable'
  | 'teacherManageQuizzes'
  | 'teacherManageProjects'
  | 'teacherManageLibrary'
  | 'teacherManageAlbum'
  | 'teacherManageTalkingCards'
  | 'teacherManageMemorization'
  | 'teacherViewAnnouncements'

  // Guardian Features
  | 'guardianViewSummaries'
  | 'guardianViewExercises'
  | 'guardianViewNotesAndAbsences'
  | 'guardianViewGrades'
  | 'guardianViewExamProgram'
  | 'guardianViewPersonalizedExercises'
  | 'guardianViewSupplementaryLessons'
  | 'guardianViewUnifiedAssessments'
  | 'guardianViewTimetable'
  | 'guardianViewQuizzes'
  | 'guardianViewProjects'
  | 'guardianViewLibrary'
  | 'guardianViewAlbum'
  | 'guardianPayFees'
  | 'guardianSubmitComplaints'
  | 'guardianRequestInterview'
  | 'guardianViewTalkingCards'
  | 'guardianViewMemorization';


export type SchoolFeatureFlags = Partial<Record<SchoolFeature, boolean>>;

export interface MonthlyFeePayment {
    id: number;
    studentId: string;
    amount: number;
    date: Date;
    month: number; // 1-12
    year: number;
}

export interface Expense {
    id: number;
    description: string;
    amount: number;
    date: Date;
    type: 'salary' | 'manual';
    teacherId?: string; // for salary type
}

export interface InterviewRequest {
    id: number;
    studentId: string;
    date: Date;
    status: 'pending' | 'completed';
}

interface BaseContent {
  id: number;
  stage: EducationalStage;
  level: string;
  class: string;
  subject: Subject;
  domain?: string;
}

export interface SupplementaryLesson extends BaseContent {
  title: string;
  externalLink: string;
}

export interface UnifiedAssessment {
  id: number;
  stage: EducationalStage;
  level: string;
  subject: Subject;
  title: string;
  image?: string; // base64
  pdf?: { name: string; url: string };
  date: Date;
}

export interface Timetable {
  id: number;
  stage: EducationalStage;
  level: string;
  class: string;
  image?: string;
  pdf?: { name: string; url: string };
  date: Date;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz extends BaseContent {
  title: string;
  questions: Question[];
  date: Date;
}

export interface Project extends BaseContent {
  title: string;
  description: string;
  image: string; // base64
  date: Date;
}

export interface LibraryItem extends BaseContent {
  title: string;
  description: string;
  file: { name: string; url: string }; // pdf
  date: Date;
}

export interface AlbumPhoto {
  id: number;
  stage: EducationalStage;
  level: string;
  class: string;
  image: string; // base64
  caption: string;
  date: Date;
  status: 'pending' | 'approved';
}

export interface Hotspot {
  label: string;
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface TalkingCard {
  id: number;
  stage: EducationalStage;
  level: string;
  class: string;
  image: string; // base64
  hotspots: Hotspot[];
  date: Date;
}


export interface PersonalizedExercise {
  id: number;
  studentId: string;
  subject: Subject;
  stage: EducationalStage;
  content: string;
  date: Date;
  domain?: string;
}

export interface MemorizationItem {
  id: number;
  stage: EducationalStage;
  level: string;
  class: string;
  subject: Subject;
  title: string;
  contentText?: string;
  audioBase64?: string;
  date: Date;
  domain?: string;
}

export interface Feedback {
  id: number;
  userRole: UserRole | null;
  schoolId: string;
  rating: number;
  comments: string;
  date: Date;
}

export interface School {
  id: string;
  name: string;
  logoUrl?: string;
  principals: {
    [key in EducationalStage]?: Principal[];
  };
  isActive: boolean;
  stages: EducationalStage[]; // Which stages are active for this school
  featureFlags: SchoolFeatureFlags;
  monthlyFeeAmount?: number;
  transportationFee?: number;
  students: Student[];
  teachers: Teacher[];
  summaries: Summary[];
  exercises: Exercise[];
  notes: Note[];
  absences: Absence[];
  examPrograms: ExamProgram[];
  notifications: Notification[];
  announcements: Announcement[];
  complaints: Complaint[];
  educationalTips: EducationalTip[];
  monthlyFeePayments: MonthlyFeePayment[];
  interviewRequests: InterviewRequest[];
  supplementaryLessons: SupplementaryLesson[];
  timetables: Timetable[];
  quizzes: Quiz[];
  projects: Project[];
  libraryItems: LibraryItem[];
  albumPhotos: AlbumPhoto[]; 
  personalizedExercises: PersonalizedExercise[]; 
  unifiedAssessments: UnifiedAssessment[];
  talkingCards: TalkingCard[];
  memorizationItems: MemorizationItem[];
  expenses: Expense[];
  feedback: Feedback[];
}

export interface Summary extends BaseContent {
  title: string;
  content: string;
  image?: string;
  pdf?: { name: string; url: string };
  externalLink?: string;
}

export interface Exercise extends BaseContent {
  content: string;
  image?: string;
  pdf?: { name: string; url: string };
  externalLink?: string;
  date: Date;
}

export interface Note extends BaseContent {
  studentIds: string[];
  observation: string;
  image?: string;
  pdf?: { name: string; url: string };
  externalLink?: string;
  date: Date;
  status: 'pending' | 'approved';
  type?: 'ai_report';
}

export interface Absence {
    id: number;
    studentId: string;
    date: Date;
    stage: EducationalStage;
    level: string;
    class: string;
    subject: Subject;
}

export interface ExamProgram extends BaseContent {
    date: Date;
    image?: string; // base64 string
    pdf?: { name: string; url: string }; // name and blob url
}

export interface Grade {
    subSubject: string;
    semester: 1 | 2;
    assignment: 1 | 2;
    score: number | null;
}

export interface Student {
    id: string;
    guardianCode: string;
    name: string;
    stage: EducationalStage;
    level: string;
    class: string;
    grades: {
        [key in Subject]?: Grade[];
    };
}

export interface Notification {
    id: number;
    studentId: string;
    message: string;
    date: Date;
    read: boolean;
    targetRole?: UserRole; // To target principals
}

export type SearchableContent = Student | Teacher | Announcement | Summary | Exercise | Note | EducationalTip | Project | Quiz | LibraryItem | SupplementaryLesson;

export type SearchResultType = 'student' | 'teacher' | 'announcement' | 'summary' | 'exercise' | 'note' | 'educationalTip' | 'project' | 'quiz' | 'libraryItem' | 'supplementaryLesson';

export interface SearchResult {
    type: SearchResultType;
    title: string;
    description: string;
    data: SearchableContent;
    icon: string;
}