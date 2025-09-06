import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Page, UserRole, School, Student, Teacher, Principal, Subject, EducationalStage, Note, Announcement, Complaint, EducationalTip, MonthlyFeePayment, InterviewRequest, Summary, Exercise, ExamProgram, Notification, SupplementaryLesson, Timetable, Quiz, Project, LibraryItem, AlbumPhoto, PersonalizedExercise, UnifiedAssessment, TalkingCard, MemorizationItem, Feedback, Expense, SearchResult, SchoolFeature, SearchableContent, Absence, Grade } from '../../packages/core/types';
import { supabase, isSupabaseConfigured } from '../../packages/core/supabaseClient';
import { SUPER_ADMIN_LOGIN_CODE, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, MOCK_SCHOOLS, ALL_FEATURES_ENABLED, getBlankGrades, STAGE_DETAILS } from '../../packages/core/constants';
import { useTranslation } from '../../packages/core/i18n';
import { snakeToCamelCase, camelToSnakeCase, getStageForLevel } from '../../packages/core/utils';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';

// Screen Imports
import UnifiedLoginScreen from './components/screens/UnifiedLoginScreen';
import SuperAdminDashboard from './components/screens/SuperAdminDashboard';
import SuperAdminSchoolManagement from './components/screens/SuperAdminSchoolManagement';
import SuperAdminFeedbackAnalysis from './components/screens/SuperAdminFeedbackAnalysis';
import PrincipalStageSelection from './components/screens/PrincipalStageSelection';
import PrincipalDashboard from './components/screens/PrincipalDashboard';
import GuardianDashboard from './components/screens/GuardianDashboard';
import TeacherDashboard from './components/screens/TeacherDashboard';
import TeacherClassSelection from './components/screens/TeacherClassSelection';
import TeacherActionMenu from './components/screens/TeacherActionMenu';
import MaintenanceScreen from './components/screens/MaintenanceScreen';
import ConfigErrorScreen from './components/screens/ConfigErrorScreen';
import GuardianSubjectMenu from './components/screens/GuardianSubjectMenu';
import GuardianViewContent from './components/screens/GuardianViewContent';
import GuardianViewNotes from './components/screens/GuardianViewNotes';
import GuardianViewGrades from './components/screens/GuardianViewGrades';
import TeacherContentForm from './components/screens/TeacherContentForm';
import TeacherStudentSelection from './components/screens/TeacherStudentSelection';
import TeacherStudentGrades from './components/screens/TeacherStudentGrades';
import TeacherExamProgramForm from './components/screens/TeacherExamProgramForm';
import GuardianViewExamProgram from './components/screens/GuardianViewExamProgram';
import TeacherNotesForm from './components/screens/TeacherNotesForm';
import TeacherGenerateReportCard from './components/screens/TeacherGenerateReportCard';
import TeacherStudentReportGeneration from './components/screens/TeacherStudentReportGeneration';
import GuardianNotifications from './components/screens/GuardianNotifications';
import PrincipalReviewNotes from './components/screens/PrincipalReviewNotes';
import PrincipalManageTeachers from './components/screens/PrincipalManageTeachers';
import PrincipalManageStudents from './components/screens/PrincipalManageStudents';
import PrincipalAnnouncements from './components/screens/PrincipalAnnouncements';
import PrincipalComplaints from './components/screens/PrincipalComplaints';
import PrincipalEducationalTips from './components/screens/PrincipalEducationalTips';
import PrincipalPerformanceTracking from './components/screens/PrincipalPerformanceTracking';
import GuardianViewAnnouncements from './components/screens/GuardianViewAnnouncements';
import GuardianViewEducationalTips from './components/screens/GuardianViewEducationalTips';
import GuardianSubmitComplaint from './components/screens/GuardianSubmitComplaint';
import PrincipalManagementMenu from './components/screens/PrincipalManagementMenu';
import PrincipalBrowseAsTeacherSelection from './components/screens/PrincipalBrowseAsTeacherSelection';
import PrincipalMonthlyFees from './components/screens/PrincipalMonthlyFees';
import PrincipalInterviewRequests from './components/screens/PrincipalInterviewRequests';
import GuardianMonthlyFees from './components/screens/GuardianMonthlyFees';
import GuardianRequestInterview from './components/screens/GuardianRequestInterview';
import PrincipalFeeManagement from './components/screens/PrincipalFeeManagement';
import TeacherAddSupplementaryLesson from './components/screens/TeacherAddSupplementaryLesson';
import GuardianViewSupplementaryLessons from './components/screens/GuardianViewSupplementaryLessons';
import TeacherAddTimetable from './components/screens/TeacherAddTimetable';
import GuardianViewTimetable from './components/screens/GuardianViewTimetable';
import TeacherAddQuiz from './components/screens/TeacherAddQuiz';
import GuardianViewQuizzes from './components/screens/GuardianViewQuizzes';
import TeacherAddProject from './components/screens/TeacherAddProject';
import GuardianViewProjects from './components/screens/GuardianViewProjects';
import TeacherAddLibrary from './components/screens/TeacherAddLibrary';
import GuardianViewLibrary from './components/screens/GuardianViewLibrary';
import TeacherLessonPlanner from './components/screens/TeacherLessonPlanner';
import TeacherPersonalizedExercises from './components/screens/TeacherPersonalizedExercises';
import GuardianViewPersonalizedExercises from './components/screens/GuardianViewPersonalizedExercises';
import PrincipalReviewAlbum from './components/screens/PrincipalReviewAlbum';
import GuardianViewAlbum from './components/screens/GuardianViewAlbum';
import TeacherManageAlbum from './components/screens/TeacherManageAlbum';
import TeacherAddUnifiedAssessment from './components/screens/TeacherAddUnifiedAssessment';
import GuardianViewUnifiedAssessments from './components/screens/GuardianViewUnifiedAssessments';
import TeacherManageTalkingCards from './components/screens/TeacherManageTalkingCards';
import GuardianViewTalkingCards from './components/screens/GuardianViewTalkingCards';
import TeacherManageMemorization from './components/screens/TeacherManageMemorization';
import GuardianViewMemorization from './components/screens/GuardianViewMemorization';
import PrincipalFinancialDashboard from './components/screens/PrincipalFinancialDashboard';
import FeedbackModal from './components/FeedbackModal';
import TeacherViewAnnouncements from './components/screens/TeacherViewAnnouncements';
import SearchHeader from './components/common/SearchHeader';
import SearchResultModal from './components/common/SearchResultModal';
import ConfirmationModal from './components/common/ConfirmationModal';

const flattenAndProcessSchoolData = (schoolData: any) => {
    const students = schoolData.students || [];
    const flattenedData = {
        ...schoolData,
        summaries: students.flatMap((s: any) => s.summaries || []),
        exercises: students.flatMap((s: any) => s.exercises || []),
        notes: students.flatMap((s: any) => s.notes || []),
        absences: students.flatMap((s: any) => s.absences || []),
        examPrograms: students.flatMap((s: any) => s.exam_programs || []),
        notifications: students.flatMap((s: any) => s.notifications || []),
        complaints: students.flatMap((s: any) => s.complaints || []),
        monthlyFeePayments: students.flatMap((s: any) => s.monthly_fee_payments || []),
        interviewRequests: students.flatMap((s: any) => s.interview_requests || []),
        personalizedExercises: students.flatMap((s: any) => s.personalized_exercises || []),
        supplementaryLessons: students.flatMap((s: any) => s.supplementary_lessons || []),
        timetables: students.flatMap((s: any) => s.timetables || []),
        quizzes: students.flatMap((s: any) => s.quizzes || []),
        projects: students.flatMap((s: any) => s.projects || []),
        libraryItems: students.flatMap((s: any) => s.library_items || []),
        albumPhotos: students.flatMap((s: any) => s.album_photos || []),
        unifiedAssessments: students.flatMap((s: any) => s.unified_assessments || []),
        talkingCards: students.flatMap((s: any) => s.talking_cards || []),
        memorizationItems: students.flatMap((s: any) => s.memorization_items || []),
    };
    return snakeToCamelCase(flattenedData);
};


const App: React.FC = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState<Page>(Page.UnifiedLogin);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [currentUser, setCurrentUser] = useState<Student | Teacher | Principal | null>(null);
    const [school, setSchool] = useState<School | null>(null);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    // Use `undefined` to signify that the session state is not yet determined.
    const [session, setSession] = useState<any | null | undefined>(undefined);

    // Navigation state
    const [selectedStage, setSelectedStage] = useState<EducationalStage | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>('');

    // State for Principal browsing as Teacher
    const [isImpersonating, setIsImpersonating] = useState(false);
    const [impersonatedTeacher, setImpersonatedTeacher] = useState<Teacher | null>(null);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult | null>(null);

    // Feedback Modal State
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    // Confirmation Modal State
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(darkMode);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('darkMode', String(isDarkMode));
    }, [isDarkMode]);

    const resetAppState = useCallback(() => {
        setPage(Page.UnifiedLogin);
        setUserRole(null);
        setCurrentUser(null);
        setSchool(null);
        setSchools([]);
        setSelectedStage(null);
        setSelectedLevel('');
        setSelectedSubject(null);
        setSelectedClass('');
        setIsImpersonating(false);
        setImpersonatedTeacher(null);
        setSearchQuery('');
        setSearchResults([]);
        setSelectedSearchResult(null);
    }, []);
    
    const performLogout = useCallback(async () => {
        if (isSupabaseConfigured) {
            const { error } = await supabase.auth.signOut();
            if (error) console.error("Error signing out:", error);
            // The onAuthStateChange listener will handle the state reset.
        } else {
             resetAppState();
             setSession(null);
        }
    }, [resetAppState]);

    const fetchSchoolData = useCallback(async (schoolId: string): Promise<School | null> => {
        if (!isSupabaseConfigured) {
            return MOCK_SCHOOLS.find(s => s.id === schoolId) || null;
        }

        const { data, error } = await supabase
            .from('schools')
            .select(`
                *,
                principals(*),
                teachers(*),
                announcements(*),
                educational_tips(*),
                expenses(*),
                feedback(*),
                students(*,
                    summaries(*),
                    exercises(*),
                    notes(*),
                    absences(*),
                    exam_programs(*),
                    notifications(*),
                    complaints(*),
                    monthly_fee_payments(*),
                    interview_requests(*),
                    personalized_exercises(*),
                    supplementary_lessons(*),
                    timetables(*),
                    quizzes(*),
                    projects(*),
                    library_items(*),
                    album_photos(*),
                    unified_assessments(*),
                    talking_cards(*),
                    memorization_items(*)
                )
            `)
            .eq('id', schoolId)
            .single();

        if (error) {
            console.error('Error fetching school data:', error);
            if (error.message.includes("permission denied")) {
                throw new Error("RLS_MISSING_POLICY_ERROR");
            }
            throw error;
        }

        if (data) {
            return flattenAndProcessSchoolData(data);
        }
        return null;
    }, []);
    
    const handleLogin = async (code: string) => {
        if (!isSupabaseConfigured) {
            if (code.toLowerCase() === SUPER_ADMIN_LOGIN_CODE.toLowerCase()) {
                 setUserRole(UserRole.SuperAdmin);
                 setCurrentUser({ id: 'superadmin', name: 'Super Admin' } as any);
                 setSchools(MOCK_SCHOOLS);
                 setPage(Page.SuperAdminDashboard);
                 return;
            }
            for (const s of MOCK_SCHOOLS) {
                const student = s.students.find(st => st.guardianCode.toLowerCase() === code.toLowerCase());
                if (student) {
                    setUserRole(UserRole.Guardian);
                    setCurrentUser(student);
                    setSchool(s);
                    setPage(Page.GuardianDashboard);
                    return;
                }
                const teacher = s.teachers.find(t => t.loginCode.toLowerCase() === code.toLowerCase());
                if (teacher) {
                    setUserRole(UserRole.Teacher);
                    setCurrentUser(teacher);
                    setSchool(s);
                    setPage(Page.TeacherDashboard);
                    return;
                }
                 for (const stage in s.principals) {
                    const principal = s.principals[stage as EducationalStage]?.find(p => p.loginCode.toLowerCase() === code.toLowerCase());
                    if (principal) {
                        setUserRole(UserRole.Principal);
                        setCurrentUser(principal);
                        setSchool(s);
                        setPage(Page.PrincipalStageSelection);
                        return;
                    }
                }
            }
            throw new Error("Invalid login credentials");
        }

        if (code.toLowerCase() === SUPER_ADMIN_LOGIN_CODE.toLowerCase()) {
            const { error } = await supabase.auth.signInWithPassword({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            if (error) throw new Error(error.message);
            return; // onAuthStateChange will handle navigation
        }

        let userResult = null;
        let userRoleAttempt: UserRole | null = null;
        let schoolId: string | null = null;

        const tablesToSearch = ['students', 'teachers', 'principals'];
        const codeFields = ['guardian_code', 'login_code', 'login_code'];
        const roles = [UserRole.Guardian, UserRole.Teacher, UserRole.Principal];

        for (let i = 0; i < tablesToSearch.length; i++) {
            const { data, error } = await supabase
                .from(tablesToSearch[i])
                .select('*, school_id')
                .eq(codeFields[i], code)
                .limit(1);

            if (error) {
                 if (error.message.includes("permission denied")) {
                    throw new Error("RLS_MISSING_POLICY_ERROR");
                }
                console.error(`Error searching in ${tablesToSearch[i]}`, error);
                continue;
            }

            if (data && data.length > 0) {
                userResult = data[0];
                userRoleAttempt = roles[i];
                schoolId = data[0].school_id;
                break;
            }
        }

        if (!userResult || !userRoleAttempt || !schoolId) {
            throw new Error(t('invalidCode'));
        }
        
        const email = `${code}@${schoolId}.com`;
        const password = `ImtiazApp_${code}_S3cure!`;

        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
            if (signInError.message.includes('Invalid login credentials')) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) {
                    if (signUpError.message.includes('Email rate limit exceeded')) {
                         throw new Error("SUPABASE_SIGNUPS_DISABLED_ERROR");
                    }
                     throw new Error(signUpError.message);
                }
                const { error: secondSignInError } = await supabase.auth.signInWithPassword({ email, password });
                if (secondSignInError) {
                    if (secondSignInError.message.includes('Email not confirmed')) {
                        throw new Error("SUPABASE_EMAIL_CONFIRMATION_ERROR");
                    }
                     throw new Error(secondSignInError.message);
                }
            } else {
                 throw new Error(signInError.message);
            }
        }
    };
    
    // Effect to get the initial session and set up the auth listener.
    // This runs only once on component mount.
    useEffect(() => {
        if (!isSupabaseConfigured) {
            setSession(null); // In mock mode, start with no session.
            return;
        }
    
        // Check for the initial session state.
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
    
        // Listen for future auth state changes.
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );
    
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);
    
    // Effect to process the session whenever it changes.
    // This handles data fetching and setting the application state.
    useEffect(() => {
        const processSession = async () => {
            // If session is undefined, the initial check hasn't completed yet.
            if (session === undefined) {
                setIsLoading(true);
                return;
            }
    
            setIsLoading(true);
            try {
                if (session) {
                    const userEmail = session.user?.email;
                    if (userEmail === SUPER_ADMIN_EMAIL) {
                        const { data: schoolsData, error } = await supabase.from('schools').select('*, principals(*)');
                        if (error) throw error;
                        setSchools(snakeToCamelCase(schoolsData));
                        setUserRole(UserRole.SuperAdmin);
                        setCurrentUser({ id: 'superadmin', name: 'Super Admin' } as any);
                        setPage(Page.SuperAdminDashboard);
                    } else {
                        const code = userEmail?.split('@')[0];
                        const schoolId = userEmail?.split('@')[1]?.split('.')[0];
                        if (code && schoolId) {
                            const fetchedSchool = await fetchSchoolData(schoolId);
                            if (fetchedSchool) {
                                setSchool(fetchedSchool);
                                const student = fetchedSchool.students.find(s => s.guardianCode === code);
                                if (student) {
                                    setUserRole(UserRole.Guardian);
                                    setCurrentUser(student);
                                    setPage(Page.GuardianDashboard);
                                    return;
                                }
                                const teacher = fetchedSchool.teachers.find(t => t.loginCode === code);
                                if (teacher) {
                                    setUserRole(UserRole.Teacher);
                                    setCurrentUser(teacher);
                                    setPage(Page.TeacherDashboard);
                                    return;
                                }
                                for (const stage in fetchedSchool.principals) {
                                    const principal = fetchedSchool.principals[stage as EducationalStage]?.find(p => p.loginCode === code);
                                    if (principal) {
                                        setUserRole(UserRole.Principal);
                                        setCurrentUser(principal);
                                        setPage(Page.PrincipalStageSelection);
                                        return;
                                    }
                                }
                                console.error("User from session not found in school data. Logging out.");
                                await performLogout();
                            } else {
                                console.error("School not found for user. Logging out.");
                                await performLogout();
                            }
                        } else {
                            console.error("Invalid email in session. Logging out.");
                            await performLogout();
                        }
                    }
                } else {
                    resetAppState();
                }
            } catch (error) {
                console.error("Error processing auth state change:", error);
                resetAppState();
            } finally {
                setIsLoading(false);
            }
        };
    
        processSession();
    }, [session, fetchSchoolData, resetAppState, performLogout]);
    
    // In App.tsx
    const navigateTo = (page: Page) => {
        setPage(page);
    };
    
    // ... all other data handling functions would go here ...
    // NOTE: This will be a very large component. Consider splitting logic into hooks.
    
    const renderPage = () => {
        if (!isSupabaseConfigured) {
            // Using mocks, but check if env vars were intended.
            // A simple check can prevent a common deployment error.
            if ((import.meta as any).env.PROD && !(import.meta as any).env.VITE_SUPABASE_URL) {
                return <ConfigErrorScreen />;
            }
        }

        if (isLoading) {
            return <div className="flex items-center justify-center h-screen dark:text-gray-200">Loading...</div>;
        }

        switch (userRole) {
            case UserRole.SuperAdmin:
                switch (page) {
                    case Page.SuperAdminDashboard:
                        return <SuperAdminDashboard schools={schools} onLogout={performLogout} onNavigate={setPage} onAddSchool={()=>{}} onDeleteSchool={()=>{}} onManageSchool={()=>{}} />;
                    case Page.SuperAdminSchoolManagement:
                        // This would need a selected school state
                        return <SuperAdminSchoolManagement school={school!} onBack={() => setPage(Page.SuperAdminDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onUpdateSchoolDetails={()=>{}} onToggleStatus={()=>{}} onToggleStage={()=>{}} onToggleFeatureFlag={()=>{}} onEnterFeaturePage={()=>{}} onAddPrincipal={()=>{}} onDeletePrincipal={()=>{}} onUpdatePrincipalCode={()=>{}} />;
                    default:
                        // Fallback to dashboard if page is invalid for this role
                        return <SuperAdminDashboard schools={schools} onLogout={performLogout} onNavigate={setPage} onAddSchool={()=>{}} onDeleteSchool={()=>{}} onManageSchool={()=>{}} />;
                }

            case UserRole.Principal:
                 if (school && !school.isActive) return <MaintenanceScreen onLogout={performLogout} />;
                switch (page) {
                    case Page.PrincipalStageSelection:
                        const accessibleStages = Object.values(school?.principals || {}).flat().filter(p => p.id === (currentUser as Principal).id).map(p => p.stage);
                        return <PrincipalStageSelection school={school!} accessibleStages={accessibleStages} onSelectStage={(stage) => { setSelectedStage(stage); setPage(Page.PrincipalDashboard); }} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onBack={performLogout} />;
                    case Page.PrincipalDashboard:
                        return <PrincipalDashboard school={school!} stage={selectedStage!} onSelectAction={setPage} onLogout={performLogout} onBack={() => setPage(Page.PrincipalStageSelection)} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalManagementMenu:
                        return <PrincipalManagementMenu school={school!} stage={selectedStage!} onSelectAction={setPage} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalManageStudents:
                        return <PrincipalManageStudents school={school!} stage={selectedStage!} students={school?.students.filter(s => s.stage === selectedStage) || []} onBack={() => setPage(Page.PrincipalManagementMenu)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onAddStudent={() => {}} onUpdateStudent={() => {}} onDeleteStudent={() => {}} onAddMultipleStudents={()=>{}}/>;
                    case Page.PrincipalManageTeachers:
                        return <PrincipalManageTeachers school={school!} stage={selectedStage!} teachers={school?.teachers || []} onBack={() => setPage(Page.PrincipalManagementMenu)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onAddTeacher={() => {}} onUpdateTeacher={() => {}} onDeleteTeacher={() => {}} />;
                    case Page.PrincipalFeeManagement:
                         return <PrincipalFeeManagement school={school!} onUpdateFees={() => {}} onBack={() => setPage(Page.PrincipalManagementMenu)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalEducationalTips:
                        return <PrincipalEducationalTips school={school!} tips={school?.educationalTips || []} onAddTip={() => {}} onGenerateAITip={async () => "AI Tip"} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalAnnouncements:
                        return <PrincipalAnnouncements school={school!} announcements={school?.announcements || []} teachers={school?.teachers || []} onAddAnnouncement={() => {}} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                     case Page.PrincipalComplaints:
                        return <PrincipalComplaints school={school!} complaints={school?.complaints || []} students={school?.students || []} onAnalyze={async () => "AI Analysis"} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalReviewNotes:
                        return <PrincipalReviewNotes school={school!} stage={selectedStage!} notes={school?.notes || []} students={school?.students || []} onApprove={() => {}} onReject={() => {}} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalReviewAlbum:
                        return <PrincipalReviewAlbum school={school!} pendingPhotos={(school?.albumPhotos || []).filter(p=>p.status === 'pending')} onApprove={() => {}} onReject={() => {}} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalPerformanceTracking:
                        return <PrincipalPerformanceTracking school={school!} stage={selectedStage!} students={school?.students || []} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalMonthlyFees:
                        return <PrincipalMonthlyFees school={school!} stage={selectedStage!} students={school?.students.filter(s => s.stage === selectedStage) || []} payments={school?.monthlyFeePayments || []} onMarkAsPaid={() => {}} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalInterviewRequests:
                        return <PrincipalInterviewRequests school={school!} requests={(school?.interviewRequests || []).filter(r => r.status === 'pending')} students={school?.students || []} onComplete={() => {}} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalFinancialDashboard:
                        return <PrincipalFinancialDashboard school={school!} stage={selectedStage!} onAddExpense={() => {}} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                     case Page.PrincipalBrowseAsTeacherSelection:
                        return <PrincipalBrowseAsTeacherSelection school={school!} stage={selectedStage!} onSelectionComplete={() => {}} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    
                    default:
                        // Fallback to stage selection if page is invalid
                        return <PrincipalStageSelection school={school!} accessibleStages={Object.values(school?.principals || {}).flat().filter(p => p.id === (currentUser as Principal).id).map(p => p.stage)} onSelectStage={(stage) => { setSelectedStage(stage); setPage(Page.PrincipalDashboard); }} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onBack={performLogout} />;
                }
            
            case UserRole.Teacher:
                // ... Teacher routes
                return <div>Teacher Dashboard</div>
            case UserRole.Guardian:
                // ... Guardian routes
                return <div>Guardian Dashboard</div>
                
            default:
                return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:pt-4 pt-24">
            {renderPage()}
        </div>
    );
};

export default App;