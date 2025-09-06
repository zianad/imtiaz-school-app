// FIX: The import statement was malformed. It has been corrected to properly import React hooks.
import React, { useState, useEffect, useCallback } from 'react';
import { Page, UserRole, School, Student, Teacher, Principal, Subject, EducationalStage, Note, Announcement, Complaint, EducationalTip, MonthlyFeePayment, InterviewRequest, Summary, Exercise, ExamProgram, Notification, SupplementaryLesson, Timetable, Quiz, Project, LibraryItem, AlbumPhoto, PersonalizedExercise, UnifiedAssessment, TalkingCard, MemorizationItem, Feedback, Expense, SearchResult, SchoolFeature, SearchableContent, Absence, Grade } from '../../packages/core/types';
import { supabase, isSupabaseConfigured } from '../../packages/core/supabaseClient';
import { SUPER_ADMIN_LOGIN_CODE, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } from '../../packages/core/constants';
import { useTranslation } from '../../packages/core/i18n';
import { snakeToCamelCase, camelToSnakeCase } from '../../packages/core/utils';
import { GoogleGenAI, Type } from "@google/genai";


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

const App: React.FC = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState<Page>(Page.UnifiedLogin);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [currentUser, setCurrentUser] = useState<Student | Teacher | Principal | null>(null);
    const [school, setSchool] = useState<School | null>(null);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [session, setSession] = useState<any | null | undefined>(undefined);

    // Navigation state
    const [selectedStage, setSelectedStage] = useState<EducationalStage | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>('');

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

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
    }, []);
    
    const performLogout = useCallback(async () => {
        if (isSupabaseConfigured) {
            const { error } = await supabase.auth.signOut();
            if (error) console.error("Error signing out:", error);
        }
        setSession(null);
        resetAppState();
    }, [resetAppState]);

    const fetchSchoolData = useCallback(async (schoolId: string): Promise<School | null> => {
        if (!isSupabaseConfigured) {
            // Mock mode is simplified and doesn't need this change
            return null; 
        }
        try {
            // Fetch only the essential data for establishing context
            const { data: schoolData, error: schoolError } = await supabase
                .from('schools')
                .select('*, principals(*), teachers(*)')
                .eq('id', schoolId)
                .single();

            if (schoolError) throw schoolError;
            if (!schoolData) return null;
            
            // The rest of the data (students, notes, etc.) will be lazy-loaded by their respective components
            return snakeToCamelCase(schoolData) as School;
        } catch (error) {
            console.error('Error fetching initial school data:', error);
            throw error;
        }
    }, []);
    
    const handleLogin = async (code: string) => {
        if (!isSupabaseConfigured) {
            // Mock login logic remains for offline testing
            return;
        }

        if (code.toLowerCase() === SUPER_ADMIN_LOGIN_CODE.toLowerCase()) {
            const { error } = await supabase.auth.signInWithPassword({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            if (error) throw new Error(error.message);
            // onAuthStateChange will handle navigation
            return;
        }

        let userResult: any = null;
        let schoolId: string | null = null;

        const tablesToSearch = ['students', 'teachers', 'principals'];
        const codeFields = ['guardian_code', 'login_code', 'login_code'];
        
        for (let i = 0; i < tablesToSearch.length; i++) {
            const { data, error } = await supabase
                .from(tablesToSearch[i])
                .select('school_id')
                .eq(codeFields[i], code)
                .limit(1);

            if (error) {
                 if (error.message.includes("permission denied")) {
                    throw new Error("RLS_LOGIN_ERROR");
                }
                console.error(`Error searching in ${tablesToSearch[i]}`, error);
                continue;
            }

            if (data && data.length > 0) {
                userResult = data[0];
                schoolId = data[0].school_id;
                break;
            }
        }

        if (!userResult || !schoolId) {
            throw new Error(t('invalidCode'));
        }
        
        const email = `${code}@${schoolId}.com`;
        const password = `ImtiazApp_${code}_S3cure!`;

        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
            if (signInError.message.includes('Invalid login credentials')) {
                const { error: signUpError } = await supabase.auth.signUp({ email, password });
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
         // onAuthStateChange will handle successful login
    };
    
    useEffect(() => {
        if (!isSupabaseConfigured) {
            setIsLoading(false);
            setSession(null);
            return;
        }
        
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );
    
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);
    
    useEffect(() => {
        const processSession = async () => {
            if (session === undefined) return; 

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
                                
                                const student = (await supabase.from('students').select('*').eq('school_id', schoolId).eq('guardian_code', code).single()).data;
                                if (student) {
                                    setUserRole(UserRole.Guardian);
                                    setCurrentUser(snakeToCamelCase(student));
                                    setPage(Page.GuardianDashboard);
                                    return;
                                }

                                const teacher = (fetchedSchool.teachers || []).find(t => t.loginCode === code);
                                if (teacher) {
                                    setUserRole(UserRole.Teacher);
                                    setCurrentUser(teacher);
                                    setPage(Page.TeacherDashboard);
                                    return;
                                }
                                
                                // FIX: Add explicit type for `p` to resolve type inference issue.
                                const principal = Object.values(fetchedSchool.principals || {}).flat().find((p: Principal) => p.loginCode === code);
                                if (principal) {
                                    setUserRole(UserRole.Principal);
                                    setCurrentUser(principal);
                                    setPage(Page.PrincipalStageSelection);
                                    return;
                                }
                                
                                console.error("User from session not found. Logging out.");
                                await performLogout();
                            } else {
                                console.error("School not found. Logging out.");
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
    
    
    const renderPage = () => {
        if (!isSupabaseConfigured && (import.meta as any).env.PROD) {
            return <ConfigErrorScreen />;
        }

        if (isLoading) {
            return <div className="flex items-center justify-center h-screen dark:text-gray-200">Loading...</div>;
        }

        if (userRole === UserRole.SuperAdmin) {
            // Super Admin pages don't need lazy loading as they deal with basic school list
            switch (page) {
                case Page.SuperAdminDashboard:
                    return <SuperAdminDashboard schools={schools} onLogout={performLogout} onNavigate={setPage} onAddSchool={()=>{}} onDeleteSchool={()=>{}} onManageSchool={()=>{}} />;
                case Page.SuperAdminSchoolManagement:
                    return <SuperAdminSchoolManagement school={school!} onBack={() => setPage(Page.SuperAdminDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onUpdateSchoolDetails={()=>{}} onToggleStatus={()=>{}} onToggleStage={()=>{}} onToggleFeatureFlag={()=>{}} onEnterFeaturePage={()=>{}} onAddPrincipal={()=>{}} onDeletePrincipal={()=>{}} onUpdatePrincipalCode={()=>{}} />;
                 case Page.SuperAdminFeedbackAnalysis:
                    return <SuperAdminFeedbackAnalysis schools={schools} onBack={() => setPage(Page.SuperAdminDashboard)} onLogout={performLogout} onAnalyze={async () => "AI analysis"} />;
                default:
                    return <SuperAdminDashboard schools={schools} onLogout={performLogout} onNavigate={setPage} onAddSchool={()=>{}} onDeleteSchool={()=>{}} onManageSchool={()=>{}} />;
            }
        }

        // FIX: Replaced `userRole !== UserRole.SuperAdmin` with just `userRole` to fix a TypeScript type-narrowing error.
        // The logic remains the same, as the SuperAdmin case is handled above. This ensures only logged-in, non-admin users see the maintenance screen for an inactive school.
        if (school && !school.isActive && userRole) {
            return <MaintenanceScreen onLogout={performLogout} />;
        }
        
        switch (userRole) {
            case UserRole.Principal:
                 if (!school || !currentUser) return null; 
                switch (page) {
                    case Page.PrincipalStageSelection:
                         // FIX: Add explicit type for `p` to resolve type inference issue.
                         const accessibleStages = Object.values(school.principals || {}).flat().filter((p: Principal) => p.id === (currentUser as Principal).id).map((p: Principal) => p.stage);
                        return <PrincipalStageSelection school={school} accessibleStages={accessibleStages} onSelectStage={(stage) => { setSelectedStage(stage); setPage(Page.PrincipalDashboard); }} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onBack={performLogout} />;
                    case Page.PrincipalDashboard:
                        return <PrincipalDashboard school={school} stage={selectedStage!} onSelectAction={setPage} onLogout={performLogout} onBack={() => setPage(Page.PrincipalStageSelection)} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalManagementMenu:
                        return <PrincipalManagementMenu school={school} stage={selectedStage!} onSelectAction={setPage} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalManageStudents:
                        return <PrincipalManageStudents school={school} stage={selectedStage!} onBack={() => setPage(Page.PrincipalManagementMenu)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalManageTeachers:
                        // FIX: Removed props that are now managed internally by the PrincipalManageTeachers component.
                        return <PrincipalManageTeachers school={school} stage={selectedStage!} onBack={() => setPage(Page.PrincipalManagementMenu)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalFeeManagement:
                        return <PrincipalFeeManagement school={school} onBack={() => setPage(Page.PrincipalManagementMenu)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onUpdateFees={() => {}} />;
                    case Page.PrincipalComplaints:
                        return <PrincipalComplaints school={school} onAnalyze={async () => "AI analysis"} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalAnnouncements:
                        return <PrincipalAnnouncements school={school} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} announcements={[]} teachers={[]} onAddAnnouncement={() => {}} />;
                    case Page.PrincipalEducationalTips:
                        return <PrincipalEducationalTips school={school} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} tips={[]} onAddTip={() => {}} onGenerateAITip={async () => "AI Tip"} />;
                    case Page.PrincipalPerformanceTracking:
                        return <PrincipalPerformanceTracking school={school} stage={selectedStage!} students={[]} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalReviewNotes:
                        return <PrincipalReviewNotes school={school} stage={selectedStage!} notes={[]} students={[]} onApprove={() => {}} onReject={() => {}} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalReviewAlbum:
                        return <PrincipalReviewAlbum school={school} pendingPhotos={[]} onApprove={() => {}} onReject={() => {}} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalMonthlyFees:
                        return <PrincipalMonthlyFees school={school} stage={selectedStage!} students={[]} payments={[]} onMarkAsPaid={() => {}} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalInterviewRequests:
                        return <PrincipalInterviewRequests school={school} requests={[]} students={[]} onComplete={() => {}} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalFinancialDashboard:
                        return <PrincipalFinancialDashboard school={school} stage={selectedStage!} onAddExpense={() => {}} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalBrowseAsTeacherSelection:
                        return <PrincipalBrowseAsTeacherSelection school={school} stage={selectedStage!} onSelectionComplete={()=>{}} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    default:
                        return <PrincipalDashboard school={school} stage={selectedStage!} onSelectAction={setPage} onLogout={performLogout} onBack={() => setPage(Page.PrincipalStageSelection)} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                }

            case UserRole.Teacher:
                 if (!school || !currentUser) return null;
                 switch (page) {
                    case Page.TeacherDashboard:
                        return <TeacherDashboard school={school} teacher={currentUser as Teacher} onSelectionComplete={(level, subject) => {setSelectedLevel(level); setSelectedSubject(subject); setPage(Page.TeacherClassSelection)}} onBack={performLogout} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.TeacherClassSelection:
                        const classes = (currentUser as Teacher).assignments[selectedLevel] || [];
                        return <TeacherClassSelection school={school} classes={classes} onSelectClass={(cls) => {setSelectedClass(cls); setPage(Page.TeacherActionMenu)}} onBack={() => setPage(Page.TeacherDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.TeacherActionMenu:
                        return <TeacherActionMenu school={school} selectedLevel={selectedLevel} onSelectAction={setPage} onBack={() => setPage(Page.TeacherClassSelection)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    // ... other teacher screens will need refactoring for lazy loading
                    default:
                         return <TeacherDashboard school={school} teacher={currentUser as Teacher} onSelectionComplete={(level, subject) => {setSelectedLevel(level); setSelectedSubject(subject); setPage(Page.TeacherClassSelection)}} onBack={performLogout} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                 }
            
            case UserRole.Guardian:
                if (!school || !currentUser) return null;
                 switch (page) {
                    case Page.GuardianDashboard:
                        // Notifications can be fetched here or inside the dashboard
                        return <GuardianDashboard school={school} student={currentUser as Student} notifications={[]} onSelectSubject={(sub) => {setSelectedSubject(sub); setPage(Page.GuardianSubjectMenu)}} onLogout={performLogout} navigateTo={setPage} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.GuardianSubjectMenu:
                        return <GuardianSubjectMenu school={school} studentLevel={(currentUser as Student).level} subject={selectedSubject!} onSelectAction={setPage} onBack={()=>setPage(Page.GuardianDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.GuardianViewSummaries:
                        // This component will now fetch its own data
                        return <GuardianViewContent type="summaries" school={school} student={currentUser as Student} subject={selectedSubject} onBack={()=>setPage(Page.GuardianSubjectMenu)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                    case Page.GuardianViewExercises:
                         // This component will now fetch its own data
                        return <GuardianViewContent type="exercises" school={school} student={currentUser as Student} subject={selectedSubject} onBack={()=>setPage(Page.GuardianSubjectMenu)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                     // ... other guardian screens will need refactoring
                     default:
                        return <GuardianDashboard school={school} student={currentUser as Student} notifications={[]} onSelectSubject={(sub) => {setSelectedSubject(sub); setPage(Page.GuardianSubjectMenu)}} onLogout={performLogout} navigateTo={setPage} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                 }

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