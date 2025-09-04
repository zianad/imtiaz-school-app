import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

import {
  Page, UserRole, School, Student, Teacher, Principal, Subject, EducationalStage, Note, Grade, ExamProgram, Summary,
  Exercise, Notification, Announcement, Complaint, EducationalTip, InterviewRequest, MonthlyFeePayment, SchoolFeature,
  SupplementaryLesson, Timetable, Quiz, Question, Project, LibraryItem, AlbumPhoto, PersonalizedExercise, UnifiedAssessment,
  TalkingCard, Hotspot, MemorizationItem, Feedback, Expense, SearchResult, SearchableContent, SearchResultType
} from '../../packages/core/types';

import { supabase, isSupabaseConfigured } from '../../packages/core/supabaseClient';
import { SUPER_ADMIN_LOGIN_CODE, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, getBlankGrades, MOCK_SCHOOLS, STAGE_DETAILS, ALL_FEATURES_ENABLED, SUBJECT_MAP } from '../../packages/core/constants';
import { useTranslation } from '../../packages/core/i18n';
import { snakeToCamelCase, camelToSnakeCase } from '../../packages/core/utils';

// Import all screen components
import UnifiedLoginScreen from './components/screens/UnifiedLoginScreen';
import MaintenanceScreen from './components/screens/MaintenanceScreen';
import SuperAdminDashboard from './components/screens/SuperAdminDashboard';
import SuperAdminSchoolManagement from './components/screens/SuperAdminSchoolManagement';
import SuperAdminFeedbackAnalysis from './components/screens/SuperAdminFeedbackAnalysis';
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
import PrincipalBrowseAsTeacherSelection from './components/screens/PrincipalBrowseAsTeacherSelection';
import PrincipalFeeManagement from './components/screens/PrincipalFeeManagement';
import PrincipalReviewAlbum from './components/screens/PrincipalReviewAlbum';
import PrincipalFinancialDashboard from './components/screens/PrincipalFinancialDashboard';
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
import GuardianDashboard from './components/screens/GuardianDashboard';
import GuardianSubjectMenu from './components/screens/GuardianSubjectMenu';
import GuardianViewContent from './components/screens/GuardianViewContent';
import GuardianViewNotes from './components/screens/GuardianViewNotes';
import GuardianViewGrades from './components/screens/GuardianViewGrades';
import GuardianViewExamProgram from './components/screens/GuardianViewExamProgram';
import GuardianViewSupplementaryLessons from './components/screens/GuardianViewSupplementaryLessons';
import GuardianViewUnifiedAssessments from './components/screens/GuardianViewUnifiedAssessments';
import GuardianViewTimetable from './components/screens/GuardianViewTimetable';
import GuardianViewQuizzes from './components/screens/GuardianViewQuizzes';
import GuardianViewProjects from './components/screens/GuardianViewProjects';
import GuardianViewLibrary from './components/screens/GuardianViewLibrary';
import GuardianNotifications from './components/screens/GuardianNotifications';
import GuardianViewAnnouncements from './components/screens/GuardianViewAnnouncements';
import GuardianViewEducationalTips from './components/screens/GuardianViewEducationalTips';
import GuardianSubmitComplaint from './components/screens/GuardianSubmitComplaint';
import GuardianMonthlyFees from './components/screens/GuardianMonthlyFees';
import GuardianRequestInterview from './components/screens/GuardianRequestInterview';
import GuardianViewPersonalizedExercises from './components/screens/GuardianViewPersonalizedExercises';
import GuardianViewAlbum from './components/screens/GuardianViewAlbum';
import GuardianViewTalkingCards from './components/screens/GuardianViewTalkingCards';
import GuardianViewMemorization from './components/screens/GuardianViewMemorization';
import ConfigErrorScreen from './components/screens/ConfigErrorScreen';
import FeedbackModal from './components/FeedbackModal';
import ConfirmationModal from './components/common/ConfirmationModal';
import SearchHeader from './components/common/SearchHeader';
import SearchResultModal from './components/common/SearchResultModal';

const App: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [page, setPage] = useState<Page>(Page.UnifiedLogin);
    const [user, setUser] = useState<Student | Teacher | Principal | { name: string; id: string } | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [school, setSchool] = useState<School | null>(null);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionChecked, setSessionChecked] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedStage, setSelectedStage] = useState<EducationalStage | null>(null);
    const [isImpersonating, setIsImpersonating] = useState(false);
    const [principalBrowsingAs, setPrincipalBrowsingAs] = useState<{ level: string, subject: Subject, class: string } | null>(null);

    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult | null>(null);

    const { t } = useTranslation();

    const genAI = useMemo(() => {
        const apiKey = (import.meta as any).env.VITE_API_KEY;
        if (apiKey) {
            return new GoogleGenAI({ apiKey });
        }
        console.warn("VITE_API_KEY is not set. AI features will be disabled.");
        return null;
    }, []);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const findUserAndSchool = async (code: string) => {
        let user_data: any = null, role: UserRole | null = null, school_id: string | null = null;

        let { data: principalData } = await supabase.from('principals').select('*').eq('login_code', code).single();
        if (principalData) {
            user_data = principalData; role = UserRole.Principal; school_id = principalData.school_id;
        } else {
            let { data: teacherData } = await supabase.from('teachers').select('*').eq('login_code', code).single();
            if (teacherData) {
                user_data = teacherData; role = UserRole.Teacher; school_id = teacherData.school_id;
            } else {
                let { data: studentData } = await supabase.from('students').select('*').eq('guardian_code', code).single();
                if (studentData) {
                    user_data = studentData; role = UserRole.Guardian; school_id = studentData.school_id;
                }
            }
        }
        return { user_data, role, school_id };
    };

    const fetchUserData = async (userId: string, userEmail?: string) => {
        setIsLoading(true);

        if (userId === SUPER_ADMIN_LOGIN_CODE) {
            const { data, error } = await supabase.from('schools').select('id, name, logo_url, is_active, stages, principals(login_code)');
            if (error) console.error("Error fetching schools:", error);
            else setSchools(snakeToCamelCase(data) || []);
            setUser({ id: SUPER_ADMIN_LOGIN_CODE, name: 'Super Admin' });
            setUserRole(UserRole.SuperAdmin);
            setPage(Page.SuperAdminDashboard);
        } else {
            const code = userEmail?.split('@')[0];
            if (!code) { await handleLogout(); return; }

            const { user_data, role, school_id } = await findUserAndSchool(code);

            if (user_data && role && school_id) {
                const { data: schoolData, error: schoolError } = await supabase.from('schools').select(`*, students(*), teachers(*), principals(*)`).eq('id', school_id).single();
                
                if (schoolError) { console.error("Error fetching school data:", schoolError); await handleLogout(); return; }

                const schoolObject = snakeToCamelCase(schoolData);
                const arraysToInit: (keyof School)[] = ['summaries', 'exercises', 'notes', 'absences', 'examPrograms', 'notifications', 'announcements', 'complaints', 'educationalTips', 'monthlyFeePayments', 'interviewRequests', 'supplementaryLessons', 'timetables', 'quizzes', 'projects', 'libraryItems', 'albumPhotos', 'personalizedExercises', 'unifiedAssessments', 'talkingCards', 'memorizationItems', 'expenses', 'feedback'];
                for (const key of arraysToInit) {
                    if (!schoolObject[key]) schoolObject[key] = [];
                }

                setUser(snakeToCamelCase(user_data));
                setUserRole(role);
                setSchool(schoolObject);

                if (!schoolObject.isActive) { setPage(Page.Maintenance); setIsLoading(false); return; }

                switch (role) {
                    case UserRole.Guardian: setPage(Page.GuardianDashboard); break;
                    case UserRole.Teacher: setPage(Page.TeacherDashboard); break;
                    case UserRole.Principal:
                        const principal = snakeToCamelCase(user_data) as Principal;
                        const accessibleStages = Object.values(schoolObject.principals).flat().filter((p: Principal) => p.loginCode === principal.loginCode).map((p: Principal) => p.stage);
                        if (accessibleStages.length > 1) setPage(Page.PrincipalStageSelection);
                        else { setSelectedStage(accessibleStages[0]); setPage(Page.PrincipalDashboard); }
                        break;
                }
            } else {
                await handleLogout();
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await fetchUserData(session.user.id, session.user.email);
            } else {
                setIsLoading(false);
            }
            setSessionChecked(true);
        };
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                setUser(null); setUserRole(null); setSchool(null); setSchools([]); setPage(Page.UnifiedLogin);
            }
        });

        return () => subscription.unsubscribe();
    }, []);


    const handleLogin = async (code: string) => {
        setIsLoading(true);
        try {
            if (code.toLowerCase() === SUPER_ADMIN_LOGIN_CODE.toLowerCase()) {
                const { data: { session }, error } = await supabase.auth.signInWithPassword({ email: SUPER_ADMIN_EMAIL, password: SUPER_ADMIN_PASSWORD });
                if (error) throw error;
                if (session) await fetchUserData(session.user.id, session.user.email);
            } else {
                const { user_data, school_id } = await findUserAndSchool(code);
                if (user_data && school_id) {
                    const email = `${code}@${school_id}.com`;
                    let { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password: code });
                    if (error) {
                        const { error: signUpError } = await supabase.auth.signUp({ email, password: code });
                        if (signUpError && signUpError.message !== 'User already registered') throw signUpError;
                        const { data: { session: newSession }, error: signInAgainError } = await supabase.auth.signInWithPassword({ email, password: code });
                        if (signInAgainError) throw signInAgainError;
                        session = newSession;
                    }
                    if (session) await fetchUserData(session.user.id, session.user.email);
                } else {
                    throw new Error("Invalid login credentials");
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const navigateTo = (newPage: Page) => setPage(newPage);

    const onBack = useCallback(() => {
      // Implement a more robust history/back logic
      // For now, it will go to the main dashboard of the user
      if (userRole === UserRole.SuperAdmin) setPage(Page.SuperAdminDashboard);
      if (userRole === UserRole.Principal) setPage(Page.PrincipalDashboard);
      if (userRole === UserRole.Teacher) setPage(Page.TeacherDashboard);
      if (userRole === UserRole.Guardian) setPage(Page.GuardianDashboard);
    }, [userRole]);

    const renderPage = () => {
      if (!sessionChecked || isLoading) {
          return <div className="text-center">Loading...</div>;
      }

      switch(page) {
        case Page.UnifiedLogin:
            return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
        
        case Page.GuardianDashboard:
            return <GuardianDashboard student={user as Student} school={school!} onSelectSubject={(subject) => { setSelectedSubject(subject); navigateTo(Page.GuardianSubjectMenu); }} onLogout={handleLogout} navigateTo={navigateTo} notifications={school?.notifications || []} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
        
        case Page.GuardianSubjectMenu:
            return <GuardianSubjectMenu subject={selectedSubject!} school={school!} onSelectAction={navigateTo} onBack={() => navigateTo(Page.GuardianDashboard)} onLogout={handleLogout} studentLevel={ (user as Student).level } toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;

        case Page.GuardianViewSummaries:
        case Page.GuardianViewExercises:
            return <GuardianViewContent type={page === Page.GuardianViewSummaries ? 'summaries' : 'exercises'} school={school!} student={user as Student} subject={selectedSubject} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>

        case Page.GuardianViewNotes:
            return <GuardianViewNotes student={user as Student} school={school!} subject={selectedSubject} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        
        case Page.GuardianViewGrades:
            return <GuardianViewGrades student={user as Student} subject={selectedSubject} school={school!} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        
        // ... all other pages
        default:
          return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
      }
    };

    if (!isSupabaseConfigured && !MOCK_SCHOOLS) {
        return <ConfigErrorScreen />;
    }

    return (
        <div className={`min-h-screen font-sans ${isDarkMode ? 'dark' : ''}`}>
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
                {renderPage()}
            </div>
        </div>
    );
}

export default App;
