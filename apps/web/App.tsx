
import React, { useState, useCallback, useEffect, useMemo } from 'react';
// @ts-ignore
import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from '@google/genai';

// Core
import { Page, UserRole, Student, Teacher, School, Subject, EducationalStage, Summary, Exercise, Note, Grade, Absence, Principal, ExamProgram, Announcement, Complaint, EducationalTip, MonthlyFeePayment, InterviewRequest, SupplementaryLesson, UnifiedAssessment, Timetable, Quiz, Project, LibraryItem, AlbumPhoto, PersonalizedExercise, TalkingCard, Hotspot, MemorizationItem, Feedback, SearchResult, SearchableContent, SchoolFeature } from '../../packages/core/types';
import { SUPER_ADMIN_LOGIN_CODE, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, ALL_FEATURES_ENABLED, SUBJECT_MAP, SUBJECT_ICONS } from '../../packages/core/constants';
import { supabase, isSupabaseConfigured } from '../../packages/core/supabaseClient';
import { snakeToCamelCase, camelToSnakeCase, getStageForLevel } from '../../packages/core/utils';
import { useTranslation } from '../../packages/core/i18n';


// Common components
import SearchHeader from './components/common/SearchHeader';
import SearchResultModal from './components/common/SearchResultModal';
import ConfirmationModal from './components/common/ConfirmationModal';
import FeedbackModal from './components/FeedbackModal';

// Screens
import UnifiedLoginScreen from './components/screens/UnifiedLoginScreen';
import ConfigErrorScreen from './components/screens/ConfigErrorScreen';
import MaintenanceScreen from './components/screens/MaintenanceScreen';
// Super Admin
import SuperAdminDashboard from './components/screens/SuperAdminDashboard';
import SuperAdminSchoolManagement from './components/screens/SuperAdminSchoolManagement';
import SuperAdminFeedbackAnalysis from './components/screens/SuperAdminFeedbackAnalysis';
// Principal
import PrincipalStageSelection from './components/screens/PrincipalStageSelection';
import PrincipalDashboard from './components/screens/PrincipalDashboard';
import PrincipalReviewNotes from './components/screens/PrincipalReviewNotes';
import PrincipalManageTeachers from './components/screens/PrincipalManageTeachers';
import PrincipalManageStudents from './components/screens/PrincipalManageStudents';
import PrincipalAnnouncements from './components/screens/PrincipalAnnouncements';
import PrincipalComplaints from './components/screens/PrincipalComplaints';
import PrincipalEducationalTips from './components/screens/PrincipalEducationalTips';
import PrincipalPerformanceTracking from './components/screens/PrincipalPerformanceTracking';
import PrincipalManagementMenu from './components/screens/PrincipalManagementMenu';
import PrincipalMonthlyFees from './components/screens/PrincipalMonthlyFees';
import PrincipalInterviewRequests from './components/screens/PrincipalInterviewRequests';
import PrincipalFeeManagement from './components/screens/PrincipalFeeManagement';
import PrincipalBrowseAsTeacherSelection from './components/screens/PrincipalBrowseAsTeacherSelection';
import PrincipalReviewAlbum from './components/screens/PrincipalReviewAlbum';
import PrincipalFinancialDashboard from './components/screens/PrincipalFinancialDashboard';
// Teacher
import TeacherDashboard from './components/screens/TeacherDashboard';
import TeacherClassSelection from './components/screens/TeacherClassSelection';
import TeacherActionMenu from './components/screens/TeacherActionMenu';
import TeacherContentForm from './components/screens/TeacherContentForm';
import TeacherNotesForm from './components/screens/TeacherNotesForm';
import TeacherStudentSelection from './components/screens/TeacherStudentSelection';
import TeacherStudentGrades from './components/screens/TeacherStudentGrades';
import TeacherExamProgramForm from './components/screens/TeacherExamProgramForm';
import TeacherGenerateReportCard from './components/screens/TeacherGenerateReportCard';
import TeacherStudentReportGeneration from './components/screens/TeacherStudentReportGeneration';
import TeacherAddSupplementaryLesson from './components/screens/TeacherAddSupplementaryLesson';
import TeacherAddUnifiedAssessment from './components/screens/TeacherAddUnifiedAssessment';
import TeacherAddTimetable from './components/screens/TeacherAddTimetable';
import TeacherAddQuiz from './components/screens/TeacherAddQuiz';
import TeacherAddProject from './components/screens/TeacherAddProject';
import TeacherAddLibrary from './components/screens/TeacherAddLibrary';
import TeacherLessonPlanner from './components/screens/TeacherLessonPlanner';
import TeacherPersonalizedExercises from './components/screens/TeacherPersonalizedExercises';
import TeacherManageAlbum from './components/screens/TeacherManageAlbum';
import TeacherManageTalkingCards from './components/screens/TeacherManageTalkingCards';
import TeacherManageMemorization from './components/screens/TeacherManageMemorization';
import TeacherViewAnnouncements from './components/screens/TeacherViewAnnouncements';
// Guardian
import GuardianDashboard from './components/screens/GuardianDashboard';
import GuardianSubjectMenu from './components/screens/GuardianSubjectMenu';
import GuardianViewContent from './components/screens/GuardianViewContent';
import GuardianViewNotes from './components/screens/GuardianViewNotes';
import GuardianViewGrades from './components/screens/GuardianViewGrades';
import GuardianViewExamProgram from './components/screens/GuardianViewExamProgram';
import GuardianNotifications from './components/screens/GuardianNotifications';
import GuardianViewAnnouncements from './components/screens/GuardianViewAnnouncements';
import GuardianViewEducationalTips from './components/screens/GuardianViewEducationalTips';
import GuardianSubmitComplaint from './components/screens/GuardianSubmitComplaint';
import GuardianMonthlyFees from './components/screens/GuardianMonthlyFees';
import GuardianRequestInterview from './components/screens/GuardianRequestInterview';
import GuardianViewSupplementaryLessons from './components/screens/GuardianViewSupplementaryLessons';
import GuardianViewUnifiedAssessments from './components/screens/GuardianViewUnifiedAssessments';
import GuardianViewTimetable from './components/screens/GuardianViewTimetable';
import GuardianViewQuizzes from './components/screens/GuardianViewQuizzes';
import GuardianViewProjects from './components/screens/GuardianViewProjects';
import GuardianViewLibrary from './components/screens/GuardianViewLibrary';
import GuardianViewPersonalizedExercises from './components/screens/GuardianViewPersonalizedExercises';
import GuardianViewAlbum from './components/screens/GuardianViewAlbum';
import GuardianViewTalkingCards from './components/screens/GuardianViewTalkingCards';
import GuardianViewMemorization from './components/screens/GuardianViewMemorization';


// Theming hook
const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    
    return { isDarkMode, toggleDarkMode };
};

// Main App Component
const AppContent = () => {
    const { t, language } = useTranslation();
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    const [schools, setSchools] = useState<School[]>([]);
    const [session, setSession] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fatalError, setFatalError] = useState<string | null>(null);
    
    const [page, setPage] = useState<Page>(Page.UnifiedLogin);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
    const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
    const [principalStages, setPrincipalStages] = useState<EducationalStage[]>([]);

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedStage, setSelectedStage] = useState<EducationalStage | null>(null);
    const [studentForGrading, setStudentForGrading] = useState<Student | null>(null);
    const [studentForExercises, setStudentForExercises] = useState<Student | null>(null);
    const [studentForReport, setStudentForReport] = useState<Student | null>(null);
    
    // Impersonation state
    const [isImpersonating, setIsImpersonating] = useState(false);
    const [originalPrincipalState, setOriginalPrincipalState] = useState<{ page: Page, stage: EducationalStage | null } | null>(null);

    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalProps, setConfirmModalProps] = useState({ title: '', message: '', onConfirm: () => {} });

    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [feedbackShown, setFeedbackShown] = useState(false);

    const navigateTo = (newPage: Page) => setPage(newPage);

    // Gemini AI client
    const ai = useMemo(() => {
        const apiKey = (import.meta as any).env.VITE_API_KEY;
        if (!apiKey) {
            console.warn("VITE_API_KEY is not set. AI features will be disabled.");
            return null;
        }
        return new GoogleGenAI({ apiKey });
    }, []);
    
    const handleLogout = useCallback(() => {
        supabase.auth.signOut();
        setSession(null);
        setUserRole(null);
        setCurrentStudent(null);
        setCurrentTeacher(null);
        setSelectedSchool(null);
        setIsImpersonating(false);
        setOriginalPrincipalState(null);
        navigateTo(Page.UnifiedLogin);
        localStorage.removeItem('rememberLoginCode');
    }, []);

    const fetchUserData = useCallback(async (forceReload = false) => {
        setIsLoading(true);
        setFatalError(null);
        try {
            const email = session?.user?.email;
            if (!email) { handleLogout(); return; }

            if (email === SUPER_ADMIN_EMAIL) {
                const { data, error } = await supabase.from('schools').select(`*, principals(*), students(*, grades(*)), teachers(*), summaries(*), exercises(*), notes(*), absences(*), exam_programs(*), notifications(*), announcements(*), complaints(*), educational_tips(*), monthly_fee_payments(*), interview_requests(*), album_photos(*), memorization_items(*), feedback(*), expenses(*), supplementary_lessons(*), unified_assessments(*), timetables(*), quizzes(*), projects(*), library_items(*), personalized_exercises(*), talking_cards(*))`);
                if (error) throw error;
                const camelCaseSchools: any[] = snakeToCamelCase(data);
                const transformedSchools = camelCaseSchools.map(school => {
                    const principalsByStage: School['principals'] = {};
                    (school.principals || []).forEach((p: Principal & { stage: EducationalStage }) => {
                        if (p.stage) {
                            if (!principalsByStage[p.stage]) principalsByStage[p.stage] = [];
                            principalsByStage[p.stage]!.push(p);
                        }
                    });
                    return { ...school, principals: principalsByStage, featureFlags: school.featureFlags || {} };
                });

                setSchools(transformedSchools as School[]);
                setUserRole(UserRole.SuperAdmin);
                navigateTo(Page.SuperAdminDashboard);
            } else {
                const code = email.split('@')[0];
                const { data: studentData } = await supabase.from('students').select('school_id').eq('guardian_code', code).maybeSingle();
                const { data: teacherData } = await supabase.from('teachers').select('school_id').eq('login_code', code).maybeSingle();
                const { data: principalData } = await supabase.from('principals').select('school_id').eq('login_code', code).maybeSingle();

                const schoolId = studentData?.school_id || teacherData?.school_id || principalData?.school_id;

                if (!schoolId) {
                    console.warn(`No role found for code: ${code}. Logging out.`);
                    handleLogout();
                    return;
                }

                const { data: schoolData, error: schoolError } = await supabase.from('schools').select(`*, principals(*), students(*, grades(*)), teachers(*), summaries(*), exercises(*), notes(*), absences(*), exam_programs(*), notifications(*), announcements(*), complaints(*), educational_tips(*), monthly_fee_payments(*), interview_requests(*), album_photos(*), memorization_items(*), feedback(*), expenses(*), supplementary_lessons(*), unified_assessments(*), timetables(*), quizzes(*), projects(*), library_items(*), personalized_exercises(*), talking_cards(*))`).eq('id', schoolId).single();
                if (schoolError) throw schoolError;

                const camelCaseSchool: any = snakeToCamelCase(schoolData);
                const principalsByStage: School['principals'] = {};
                (camelCaseSchool.principals || []).forEach((p: Principal & { stage: EducationalStage }) => {
                    if (p.stage) {
                        if (!principalsByStage[p.stage]) principalsByStage[p.stage] = [];
                        principalsByStage[p.stage]!.push(p);
                    }
                });

                const transformedSchool = {
                    ...camelCaseSchool,
                    principals: principalsByStage,
                    featureFlags: camelCaseSchool.featureFlags || {},
                    teachers: (camelCaseSchool.teachers || []).map((t: Teacher) => ({ ...t, assignments: t.assignments || {} })),
                    students: (camelCaseSchool.students || []).map((st: any) => ({
                        ...st,
                        grades: (st.grades || []).reduce((acc: any, g: Grade & { subject: Subject }) => {
                            if (g.subject) { (acc[g.subject] = acc[g.subject] || []).push(g); }
                            return acc;
                        }, {}),
                    })),
                };
                
                setSelectedSchool(transformedSchool as School);
                
                if (!transformedSchool.isActive) {
                    navigateTo(Page.Maintenance);
                    return; // Stop further processing if school is inactive
                }

                if (studentData) {
                    const student = transformedSchool.students.find((s: Student) => s.guardianCode === code);
                    setCurrentStudent(student);
                    setUserRole(UserRole.Guardian);
                    navigateTo(Page.GuardianDashboard);
                } else if (teacherData) {
                    const teacher = transformedSchool.teachers.find((t: Teacher) => t.loginCode === code);
                    if (teacher && !teacher.assignments) teacher.assignments = {};
                    setCurrentTeacher(teacher);
                    setUserRole(UserRole.Teacher);
                    navigateTo(Page.TeacherDashboard);
                } else if (principalData) {
                    const principalAccessibleStages = Object.entries(transformedSchool.principals)
                        .filter(([_, principals]) => (principals as Principal[]).some(p => p.loginCode === code))
                        .map(([stage]) => stage as EducationalStage);
                    setPrincipalStages(principalAccessibleStages);
                    setUserRole(UserRole.Principal);
                    navigateTo(Page.PrincipalStageSelection);
                }
            }
        } catch (error: any) {
            console.error("Fatal error during data fetch:", error);
            setFatalError(`Failed to load application data: ${error.message}`);
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    }, [session, handleLogout]);
    
    // Auth and data loading effects
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          if (_event === "SIGNED_OUT") handleLogout();
        });
        return () => subscription?.unsubscribe();
    }, [handleLogout]);

    useEffect(() => {
        if (session) {
            fetchUserData();
            if (!feedbackShown && (session.user.email !== SUPER_ADMIN_EMAIL)) {
              setTimeout(() => {
                setIsFeedbackModalOpen(true);
                setFeedbackShown(true);
              }, 60000); // 1 minute
            }
        } else if (!isSupabaseConfigured) {
            fetchUserData(); // Run with mock data
        } else {
            setIsLoading(false);
        }
    }, [session, fetchUserData, feedbackShown]);
    
    const handleLogin = useCallback(async (code: string) => {
        const isSuperAdmin = code.toLowerCase() === SUPER_ADMIN_LOGIN_CODE.toLowerCase();
        const email = isSuperAdmin ? SUPER_ADMIN_EMAIL : `${code}@school-app.com`;
        const password = isSuperAdmin ? SUPER_ADMIN_PASSWORD : code;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    }, []);

    // CRUD Callbacks...
    // These will be similar to the mobile app's callbacks.
    // Omitted for brevity, but a full implementation would include them.
    const onConfirm = (title: string, message: string, onConfirmAction: () => void) => {
        setConfirmModalProps({ title, message, onConfirm: onConfirmAction });
        setIsConfirmModalOpen(true);
    };

    const renderPage = () => {
        if (!selectedSchool?.isActive && userRole !== UserRole.SuperAdmin) {
            return <MaintenanceScreen onLogout={handleLogout} />;
        }
        
        switch(page) {
            case Page.UnifiedLogin: return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            
            // Guardian Flow
            case Page.GuardianDashboard:
                return <GuardianDashboard student={currentStudent!} school={selectedSchool!} onSelectSubject={(s) => { setSelectedSubject(s); navigateTo(Page.GuardianSubjectMenu); }} onLogout={handleLogout} navigateTo={navigateTo} notifications={selectedSchool?.notifications || []} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianSubjectMenu:
                return <GuardianSubjectMenu subject={selectedSubject!} school={selectedSchool!} studentLevel={currentStudent!.level} onSelectAction={navigateTo} onBack={() => navigateTo(Page.GuardianDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewSummaries:
                 return <GuardianViewContent title={t('summaries')} items={selectedSchool?.summaries.filter(i => i.subject === selectedSubject && i.level === currentStudent?.level) || []} onBack={() => navigateTo(Page.GuardianSubjectMenu)} school={selectedSchool!} onLogout={handleLogout} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
            // Add other guardian pages...
            
            // Teacher Flow
            case Page.TeacherDashboard:
                return <TeacherDashboard teacher={currentTeacher!} school={selectedSchool!} onSelectionComplete={(level, subject) => { setSelectedLevel(level); setSelectedSubject(subject); navigateTo(Page.TeacherClassSelection); }} onBack={() => isImpersonating ? handleExitImpersonation() : handleLogout()} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} isImpersonating={isImpersonating} />;
            case Page.TeacherClassSelection:
                return <TeacherClassSelection school={selectedSchool!} classes={currentTeacher!.assignments[selectedLevel] || []} onSelectClass={(c) => { setSelectedClass(c); navigateTo(Page.TeacherActionMenu); }} onBack={() => navigateTo(Page.TeacherDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherActionMenu:
                return <TeacherActionMenu school={selectedSchool!} selectedLevel={selectedLevel} onSelectAction={navigateTo} onBack={() => navigateTo(Page.TeacherClassSelection)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            // Add other teacher pages...

            // Principal Flow
            case Page.PrincipalStageSelection:
                return <PrincipalStageSelection school={selectedSchool!} accessibleStages={principalStages} onSelectStage={(s) => { setSelectedStage(s); navigateTo(Page.PrincipalDashboard); }} onBack={handleLogout} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.PrincipalDashboard:
                return <PrincipalDashboard school={selectedSchool!} stage={selectedStage!} onSelectAction={navigateTo} onBack={() => navigateTo(Page.PrincipalStageSelection)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            // Add other principal pages...

            // Super Admin Flow
            case Page.SuperAdminDashboard:
                return <SuperAdminDashboard schools={schools} onAddSchool={handleAddSchool} onDeleteSchool={(id, name) => onConfirm(t('confirmDeleteSchool', { schoolName: name }), "", () => handleDeleteSchool(id))} onManageSchool={(id) => { const school = schools.find(s => s.id === id); if (school) { setSelectedSchool(school); navigateTo(Page.SuperAdminSchoolManagement); } }} onNavigate={navigateTo} onLogout={handleLogout} />;
            case Page.SuperAdminSchoolManagement:
                return <SuperAdminSchoolManagement school={selectedSchool!} onToggleStatus={handleToggleSchoolStatus} onToggleStage={handleToggleSchoolStage} onToggleFeatureFlag={handleToggleFeatureFlag} onEnterFeaturePage={handleEnterPrincipalAsTeacher} onBack={() => { setSelectedSchool(null); navigateTo(Page.SuperAdminDashboard); }} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onAddPrincipal={handleAddPrincipal} onDeletePrincipal={(stage, id, name) => onConfirm(t('confirmDeletePrincipal', { name }), "", () => handleDeletePrincipal(stage, id))} onUpdatePrincipalCode={handleUpdatePrincipalCode} onUpdateSchoolDetails={handleUpdateSchoolDetails} />;
            // ...
            default: return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
        }
    };

    // Placeholder for functions that would be implemented, similar to mobile.
    const handleAddSchool = async () => {};
    const handleDeleteSchool = async (id: string) => {};
    const handleToggleSchoolStatus = async () => {};
    const handleToggleSchoolStage = async (stage: EducationalStage) => {};
    const handleToggleFeatureFlag = async (feature: SchoolFeature) => {};
    const handleEnterPrincipalAsTeacher = (page: Page, stage: EducationalStage) => {};
    const handleExitImpersonation = () => {};
    const handleAddPrincipal = async (stage: EducationalStage, name: string, loginCode: string) => {};
    const handleDeletePrincipal = async (stage: EducationalStage, id: string) => {};
    const handleUpdatePrincipalCode = async (stage: EducationalStage, id: string, newCode: string) => {};
    const handleUpdateSchoolDetails = async (id: string, name: string, logoUrl: string) => {};

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">Loading...</div>;
    }

    if (fatalError) {
        return <div className="flex items-center justify-center h-screen bg-red-50 p-4 text-red-700">{fatalError}</div>;
    }

    if (!isSupabaseConfigured && !((import.meta as any).env.PROD === false)) {
      return <ConfigErrorScreen />;
    }
    
    return (
        <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className="w-full max-w-7xl mx-auto">
                {renderPage()}
            </div>
            {isSearchModalOpen && searchResult && <SearchResultModal result={searchResult} onClose={() => setIsSearchModalOpen(false)} isDarkMode={isDarkMode} />}
            <ConfirmationModal isOpen={isConfirmModalOpen} {...confirmModalProps} onCancel={() => setIsConfirmModalOpen(false)} />
            <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} onSubmit={() => {}} />
        </div>
    );
};

export default function App() {
    return <AppContent />;
}
