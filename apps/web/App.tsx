// FIX: The import statement was malformed. It has been corrected to properly import React hooks.
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Page, UserRole, School, Student, Teacher, Principal, Subject, EducationalStage, Note, Announcement, Complaint, EducationalTip, MonthlyFeePayment, InterviewRequest, Summary, Exercise, ExamProgram, Notification, SupplementaryLesson, Timetable, Quiz, Project, LibraryItem, AlbumPhoto, PersonalizedExercise, UnifiedAssessment, TalkingCard, MemorizationItem, Feedback, Expense, SearchResult, SchoolFeature, SearchableContent, Absence, Grade } from '../../packages/core/types';
import { supabase, isSupabaseConfigured } from '../../packages/core/supabaseClient';
import { SUPER_ADMIN_LOGIN_CODE, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, ALL_FEATURES_ENABLED } from '../../packages/core/constants';
import { useTranslation } from '../../packages/core/i18n';
import { snakeToCamelCase, camelToSnakeCase } from '../../packages/core/utils';
import { GoogleGenAI, Type } from "@google/genai";
import ConfirmationModal from './components/common/ConfirmationModal';


// Screen Imports (Lazy Loaded)
const UnifiedLoginScreen = lazy(() => import('./components/screens/UnifiedLoginScreen'));
const SuperAdminDashboard = lazy(() => import('./components/screens/SuperAdminDashboard'));
const SuperAdminSchoolManagement = lazy(() => import('./components/screens/SuperAdminSchoolManagement'));
const SuperAdminFeedbackAnalysis = lazy(() => import('./components/screens/SuperAdminFeedbackAnalysis'));
const PrincipalStageSelection = lazy(() => import('./components/screens/PrincipalStageSelection'));
const PrincipalDashboard = lazy(() => import('./components/screens/PrincipalDashboard'));
const GuardianDashboard = lazy(() => import('./components/screens/GuardianDashboard'));
const TeacherDashboard = lazy(() => import('./components/screens/TeacherDashboard'));
const TeacherClassSelection = lazy(() => import('./components/screens/TeacherClassSelection'));
const TeacherActionMenu = lazy(() => import('./components/screens/TeacherActionMenu'));
const MaintenanceScreen = lazy(() => import('./components/screens/MaintenanceScreen'));
const ConfigErrorScreen = lazy(() => import('./components/screens/ConfigErrorScreen'));
const GuardianSubjectMenu = lazy(() => import('./components/screens/GuardianSubjectMenu'));
const GuardianViewContent = lazy(() => import('./components/screens/GuardianViewContent'));
const GuardianViewNotes = lazy(() => import('./components/screens/GuardianViewNotes'));
const GuardianViewGrades = lazy(() => import('./components/screens/GuardianViewGrades'));
const TeacherContentForm = lazy(() => import('./components/screens/TeacherContentForm'));
const TeacherStudentSelection = lazy(() => import('./components/screens/TeacherStudentSelection'));
const TeacherStudentGrades = lazy(() => import('./components/screens/TeacherStudentGrades'));
const TeacherExamProgramForm = lazy(() => import('./components/screens/TeacherExamProgramForm'));
const GuardianViewExamProgram = lazy(() => import('./components/screens/GuardianViewExamProgram'));
const TeacherNotesForm = lazy(() => import('./components/screens/TeacherNotesForm'));
const TeacherGenerateReportCard = lazy(() => import('./components/screens/TeacherGenerateReportCard'));
const TeacherStudentReportGeneration = lazy(() => import('./components/screens/TeacherStudentReportGeneration'));
const GuardianNotifications = lazy(() => import('./components/screens/GuardianNotifications'));
const PrincipalReviewNotes = lazy(() => import('./components/screens/PrincipalReviewNotes'));
const PrincipalManageTeachers = lazy(() => import('./components/screens/PrincipalManageTeachers'));
const PrincipalManageStudents = lazy(() => import('./components/screens/PrincipalManageStudents'));
const PrincipalAnnouncements = lazy(() => import('./components/screens/PrincipalAnnouncements'));
const PrincipalComplaints = lazy(() => import('./components/screens/PrincipalComplaints'));
const PrincipalEducationalTips = lazy(() => import('./components/screens/PrincipalEducationalTips'));
const PrincipalPerformanceTracking = lazy(() => import('./components/screens/PrincipalPerformanceTracking'));
const GuardianViewAnnouncements = lazy(() => import('./components/screens/GuardianViewAnnouncements'));
const GuardianViewEducationalTips = lazy(() => import('./components/screens/GuardianViewEducationalTips'));
const GuardianSubmitComplaint = lazy(() => import('./components/screens/GuardianSubmitComplaint'));
const PrincipalManagementMenu = lazy(() => import('./components/screens/PrincipalManagementMenu'));
const PrincipalBrowseAsTeacherSelection = lazy(() => import('./components/screens/PrincipalBrowseAsTeacherSelection'));
const PrincipalMonthlyFees = lazy(() => import('./components/screens/PrincipalMonthlyFees'));
const PrincipalInterviewRequests = lazy(() => import('./components/screens/PrincipalInterviewRequests'));
const GuardianMonthlyFees = lazy(() => import('./components/screens/GuardianMonthlyFees'));
const GuardianRequestInterview = lazy(() => import('./components/screens/GuardianRequestInterview'));
const PrincipalFeeManagement = lazy(() => import('./components/screens/PrincipalFeeManagement'));
const TeacherAddSupplementaryLesson = lazy(() => import('./components/screens/TeacherAddSupplementaryLesson'));
const GuardianViewSupplementaryLessons = lazy(() => import('./components/screens/GuardianViewSupplementaryLessons'));
const TeacherAddTimetable = lazy(() => import('./components/screens/TeacherAddTimetable'));
const GuardianViewTimetable = lazy(() => import('./components/screens/GuardianViewTimetable'));
const TeacherAddQuiz = lazy(() => import('./components/screens/TeacherAddQuiz'));
const GuardianViewQuizzes = lazy(() => import('./components/screens/GuardianViewQuizzes'));
const TeacherAddProject = lazy(() => import('./components/screens/TeacherAddProject'));
const GuardianViewProjects = lazy(() => import('./components/screens/GuardianViewProjects'));
const TeacherAddLibrary = lazy(() => import('./components/screens/TeacherAddLibrary'));
const GuardianViewLibrary = lazy(() => import('./components/screens/GuardianViewLibrary'));
const TeacherLessonPlanner = lazy(() => import('./components/screens/TeacherLessonPlanner'));
const TeacherPersonalizedExercises = lazy(() => import('./components/screens/TeacherPersonalizedExercises'));
const GuardianViewPersonalizedExercises = lazy(() => import('./components/screens/GuardianViewPersonalizedExercises'));
const PrincipalReviewAlbum = lazy(() => import('./components/screens/PrincipalReviewAlbum'));
const GuardianViewAlbum = lazy(() => import('./components/screens/GuardianViewAlbum'));
const TeacherManageAlbum = lazy(() => import('./components/screens/TeacherManageAlbum'));
const TeacherAddUnifiedAssessment = lazy(() => import('./components/screens/TeacherAddUnifiedAssessment'));
const GuardianViewUnifiedAssessments = lazy(() => import('./components/screens/GuardianViewUnifiedAssessments'));
const TeacherManageTalkingCards = lazy(() => import('./components/screens/TeacherManageTalkingCards'));
const GuardianViewTalkingCards = lazy(() => import('./components/screens/GuardianViewTalkingCards'));
const TeacherManageMemorization = lazy(() => import('./components/screens/TeacherManageMemorization'));
const GuardianViewMemorization = lazy(() => import('./components/screens/GuardianViewMemorization'));
const PrincipalFinancialDashboard = lazy(() => import('./components/screens/PrincipalFinancialDashboard'));
const FeedbackModal = lazy(() => import('./components/FeedbackModal'));
const TeacherViewAnnouncements = lazy(() => import('./components/screens/TeacherViewAnnouncements'));

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
            </div>
        </div>
    </div>
);

const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    
    // Effect to manage document lang and dir attributes based on language
    useEffect(() => {
        const handleLanguageChanged = (lng: string) => {
            const lang = lng.split('-')[0];
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        };
        i18n.on('languageChanged', handleLanguageChanged);
        handleLanguageChanged(i18n.language); // Initial setup

        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, [i18n]);

    const [page, setPage] = useState<Page>(Page.UnifiedLogin);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [currentUser, setCurrentUser] = useState<Student | Teacher | Principal | null>(null);
    const [school, setSchool] = useState<School | null>(null);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [session, setSession] = useState<any | null | undefined>(undefined);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [educationalTips, setEducationalTips] = useState<EducationalTip[]>([]);

    // Navigation state
    const [selectedStage, setSelectedStage] = useState<EducationalStage | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [nextPageAfterStudentSelection, setNextPageAfterStudentSelection] = useState<Page | null>(null);
    
    // Impersonation state
    const [impersonationReturnPage, setImpersonationReturnPage] = useState<Page | null>(null);

    // Modal State
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [confirmationModalConfig, setConfirmationModalConfig] = useState({ title: '', message: '', onConfirm: () => {} });

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
        setNotifications([]);
        setEducationalTips([]);
        setSelectedStage(null);
        setSelectedLevel('');
        setSelectedSubject(null);
        setSelectedClass('');
        setSelectedStudent(null);
        setNextPageAfterStudentSelection(null);
        setImpersonationReturnPage(null);
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
            return null; 
        }
        try {
            const { data: schoolData, error: schoolError } = await supabase
                .from('schools')
                .select('*, principals(*), teachers(*)')
                .eq('id', schoolId)
                .single();

            if (schoolError) throw schoolError;
            if (!schoolData) return null;
            
            return snakeToCamelCase(schoolData) as School;
        } catch (error) {
            console.error('Error fetching initial school data:', error);
            throw error;
        }
    }, []);
    
    const handleLogin = async (code: string) => {
        if (!isSupabaseConfigured) {
            return;
        }

        if (code.toLowerCase() === SUPER_ADMIN_LOGIN_CODE.toLowerCase()) {
            const { error } = await supabase.auth.signInWithPassword({
                email: SUPER_ADMIN_EMAIL,
                password: SUPER_ADMIN_PASSWORD,
            });
            if (error) throw new Error(error.message);
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
    
    const fetchNotifications = useCallback(async (studentId: string) => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('student_id', studentId)
            .order('date', { ascending: false });

        if (error) console.error("Error fetching notifications:", error);
        else setNotifications(snakeToCamelCase(data || []));
    }, []);
    
    const fetchEducationalTips = useCallback(async (schoolId: string) => {
        if (!isSupabaseConfigured) return;
        const { data, error } = await supabase
            .from('educational_tips')
            .select('*')
            .eq('school_id', schoolId)
            .order('date', { ascending: false });
        
        if (error) {
            console.error('Error fetching educational tips:', error);
        } else {
            setEducationalTips(snakeToCamelCase(data || []));
        }
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
                                    const studentData = snakeToCamelCase(student) as Student;
                                    setUserRole(UserRole.Guardian);
                                    setCurrentUser(studentData);
                                    await fetchNotifications(studentData.id);
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
    }, [session, fetchSchoolData, resetAppState, performLogout, fetchNotifications]);
    
     useEffect(() => {
        if (userRole === UserRole.Principal && page === Page.PrincipalDashboard && school) {
            fetchEducationalTips(school.id);
        }
    }, [userRole, page, school, fetchEducationalTips]);
    
    const handleTeacherActionNavigation = (nextPage: Page) => {
      const pagesRequiringStudentSelection = [
        Page.TeacherStudentSelection, // For grades
        Page.TeacherGenerateReportCard, // For AI notes
        Page.TeacherStudentSelectionForExercises // For personalized exercises
      ];
      
      if (pagesRequiringStudentSelection.includes(nextPage)) {
        let targetPage: Page;
        if (nextPage === Page.TeacherStudentSelection) targetPage = Page.TeacherStudentGrades;
        else if (nextPage === Page.TeacherGenerateReportCard) targetPage = Page.TeacherStudentReportGeneration;
        else targetPage = Page.TeacherPersonalizedExercises; // This assumes TeacherStudentSelectionForExercises leads here
        
        setNextPageAfterStudentSelection(targetPage);
        setPage(Page.TeacherStudentSelection);
      } else {
        setPage(nextPage);
      }
    };
    
    // Guardian Form Handlers
    const handleSubmitComplaint = async (content: string, file?: { image?: string; pdf?: { name: string; url: string } }) => {
        if (!school || !currentUser) return;
        const complaintData = {
            content, ...file,
            school_id: school.id,
            student_id: currentUser.id,
            date: new Date().toISOString(),
        };
        const { error } = await supabase.from('complaints').insert([complaintData]);
        if (error) alert(error.message);
        else alert(t('requestSent'));
    };

    const handleRequestInterview = async () => {
         if (!school || !currentUser) return;
        const requestData = {
            school_id: school.id,
            student_id: currentUser.id,
            date: new Date().toISOString(),
            status: 'pending',
        };
        const { error } = await supabase.from('interview_requests').insert([requestData]);
        if (error) alert(error.message);
    };

    const handlePayFee = async (month: number, year: number, amount: number) => {
         if (!school || !currentUser) return;
        const paymentData = {
            school_id: school.id,
            student_id: currentUser.id,
            amount, month, year,
            date: new Date().toISOString(),
        };
        const { error } = await supabase.from('monthly_fee_payments').insert([paymentData]);
        if (error) alert(error.message);
    };

    const handleMarkNotificationsRead = async () => {
        const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
        if (unreadIds.length > 0) {
            const { error } = await supabase.from('notifications').update({ read: true }).in('id', unreadIds);
            if (error) console.error("Error marking notifications as read:", error);
            else await fetchNotifications((currentUser as Student).id);
        }
    };

    // Super Admin Handlers
    const handleAddSchool = async (name: string, principalCode: string, logoUrl: string) => {
        setIsLoading(true);
        try {
            const { data: schoolData, error: schoolError } = await supabase
                .from('schools')
                .insert([{ name, logo_url: logoUrl, is_active: true, stages: [EducationalStage.PRIMARY], feature_flags: ALL_FEATURES_ENABLED }])
                .select().single();

            if (schoolError) throw schoolError;
            const newSchoolId = schoolData.id;

            const { error: principalError } = await supabase
                .from('principals')
                .insert([{ name: 'مدير عام', login_code: principalCode, stage: EducationalStage.PRIMARY, school_id: newSchoolId }]);
            if (principalError) throw principalError;

            const email = `${principalCode}@${newSchoolId}.com`;
            const password = `ImtiazApp_${principalCode}_S3cure!`;
            const { error: signUpError } = await supabase.auth.signUp({ email, password });
            if (signUpError) console.error("Sign up failed for new principal", signUpError);

            const { data: schoolsData, error: refetchError } = await supabase.from('schools').select('*, principals(*)');
            if (refetchError) throw refetchError;
            setSchools(snakeToCamelCase(schoolsData));
        } catch (error: any) {
            alert(`Error adding school: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSchool = (schoolId: string, schoolName: string) => {
        setConfirmationModalConfig({
            title: t('confirmDeleteSchoolTitle', { name: schoolName }),
            message: t('confirmDeleteSchoolMessage'),
            onConfirm: async () => {
                setIsLoading(true);
                try {
                    const { error } = await supabase.from('schools').delete().match({ id: schoolId });
                    if (error) throw error;
                    setSchools(prev => prev.filter(s => s.id !== schoolId));
                } catch (error: any) {
                    alert(`Error deleting school: ${error.message}`);
                } finally {
                    setIsLoading(false);
                }
            }
        });
        setIsConfirmationModalOpen(true);
    };

    const handleManageSchool = (schoolId: string) => {
        const schoolToManage = schools.find(s => s.id === schoolId);
        if (schoolToManage) {
            setSchool(schoolToManage);
            setPage(Page.SuperAdminSchoolManagement);
        }
    };
    
    const handleUpdateSchool = async (updatedSchool: School) => {
        try {
            const snakeCaseSchool = camelToSnakeCase(updatedSchool);
            // Supabase client might not handle nested objects well in update, so we handle principals separately if needed,
            // but for simple fields like name, logo_url, stages, feature_flags, it should be fine.
            const { id, principals, teachers, students, ...updateData } = snakeCaseSchool;

            const { error } = await supabase.from('schools').update(updateData).match({ id: updatedSchool.id });
            if (error) throw error;

            setSchool(updatedSchool);
            setSchools(prev => prev.map(s => s.id === updatedSchool.id ? updatedSchool : s));
        } catch (error: any) {
            alert(`Error updating school: ${error.message}`);
        }
    };
    
    const onAddPrincipal = async (stage: EducationalStage, name: string, loginCode: string) => {
        if (!school) return;
        try {
            const { error: principalError } = await supabase.from('principals').insert([{ name, login_code: loginCode, stage, school_id: school.id }]);
            if (principalError) throw principalError;

            const email = `${loginCode}@${school.id}.com`;
            const password = `ImtiazApp_${loginCode}_S3cure!`;
            const { error: signUpError } = await supabase.auth.signUp({ email, password });
            if (signUpError) console.error("Sign up failed for new principal", signUpError);

            const updatedSchoolData = await fetchSchoolData(school.id);
            if (updatedSchoolData) handleUpdateSchool(updatedSchoolData);
        } catch(error: any) {
            alert(`Error adding principal: ${error.message}`);
        }
    };

    const onDeletePrincipal = (stage: EducationalStage, principalId: string, principalName: string) => {
         if (!school) return;
        setConfirmationModalConfig({
            title: t('confirmDeletePrincipalTitle', { name: principalName }),
            message: t('confirmDeletePrincipalMessage'),
            onConfirm: async () => {
                try {
                    const { error } = await supabase.from('principals').delete().match({ id: principalId });
                    if (error) throw error;
                    const updatedSchoolData = await fetchSchoolData(school.id);
                    if (updatedSchoolData) handleUpdateSchool(updatedSchoolData);
                } catch (error: any) {
                    alert(`Error deleting principal: ${error.message}`);
                }
            }
        });
        setIsConfirmationModalOpen(true);
    };
    
    const onUpdatePrincipalCode = async (stage: EducationalStage, principalId: string, newCode: string) => {
        if (!school) return;
        try {
            const { error } = await supabase.from('principals').update({ login_code: newCode }).match({ id: principalId });
            if (error) throw error;
            const updatedSchoolData = await fetchSchoolData(school.id);
            if (updatedSchoolData) handleUpdateSchool(updatedSchoolData);
        } catch (error: any) {
            alert(`Error updating principal code: ${error.message}`);
        }
    };
    
    const handleEnterAsPrincipal = (page: Page, stage: EducationalStage) => {
        if (!school) return;
        const principalForStage = (school.principals[stage] || [])[0];

        if (principalForStage) {
            setImpersonationReturnPage(Page.SuperAdminSchoolManagement);
            setUserRole(UserRole.Principal);
            setCurrentUser(principalForStage);
            setSelectedStage(stage);
            setPage(page);
        } else {
            alert(t('noPrincipalForStage', { stageName: t(`${stage.toLowerCase()}Stage` as any) }));
        }
    };

    const stopImpersonation = () => {
        if (impersonationReturnPage) {
            const userEmail = session?.user?.email;
            if (userEmail === SUPER_ADMIN_EMAIL) {
                setUserRole(UserRole.SuperAdmin);
                setCurrentUser({ id: 'superadmin', name: 'Super Admin' } as any);
                setPage(impersonationReturnPage);
                setImpersonationReturnPage(null);
                setSelectedStage(null);
            } else {
                performLogout();
            }
        }
    };


    const renderPage = () => {
        if (!isSupabaseConfigured && (import.meta as any).env.PROD) {
            return <ConfigErrorScreen />;
        }

        if (isLoading) {
            return <LoadingSpinner />;
        }

        if (userRole === UserRole.SuperAdmin) {
            switch (page) {
                case Page.SuperAdminDashboard:
                    return <SuperAdminDashboard schools={schools} onLogout={performLogout} onNavigate={setPage} onAddSchool={handleAddSchool} onDeleteSchool={handleDeleteSchool} onManageSchool={handleManageSchool} />;
                case Page.SuperAdminSchoolManagement:
                    return <SuperAdminSchoolManagement school={school!} onBack={() => setPage(Page.SuperAdminDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onUpdateSchoolDetails={(id, name, logo) => handleUpdateSchool({ ...school!, name, logoUrl: logo })} onToggleStatus={() => handleUpdateSchool({ ...school!, isActive: !school!.isActive })} onToggleStage={(stage) => { const newStages = (school!.stages || []).includes(stage) ? (school!.stages || []).filter(s => s !== stage) : [...(school!.stages || []), stage]; handleUpdateSchool({ ...school!, stages: newStages }); }} onToggleFeatureFlag={(feature) => { const newFlags = { ...(school!.featureFlags || {}), [feature]: !(school!.featureFlags || {})[feature] }; handleUpdateSchool({ ...school!, featureFlags: newFlags }); }} onEnterFeaturePage={handleEnterAsPrincipal} onAddPrincipal={onAddPrincipal} onDeletePrincipal={onDeletePrincipal} onUpdatePrincipalCode={onUpdatePrincipalCode} />;
                 case Page.SuperAdminFeedbackAnalysis:
                    return <SuperAdminFeedbackAnalysis schools={schools} onBack={() => setPage(Page.SuperAdminDashboard)} onLogout={performLogout} onAnalyze={async () => "AI analysis"} />;
                default:
                    return <SuperAdminDashboard schools={schools} onLogout={performLogout} onNavigate={setPage} onAddSchool={handleAddSchool} onDeleteSchool={handleDeleteSchool} onManageSchool={handleManageSchool} />;
            }
        }

        if (school && !school.isActive && userRole) {
            return <MaintenanceScreen onLogout={performLogout} />;
        }
        
        switch (userRole) {
            case UserRole.Principal:
                 if (!school || !currentUser) return null; 
                switch (page) {
                    case Page.PrincipalStageSelection:
                         const accessibleStages = Object.values(school.principals || {}).flat().filter((p: Principal) => p.id === (currentUser as Principal).id).map((p: Principal) => p.stage);
                        return <PrincipalStageSelection school={school} accessibleStages={accessibleStages} onSelectStage={(stage) => { setSelectedStage(stage); setPage(Page.PrincipalDashboard); }} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onBack={performLogout} />;
                    case Page.PrincipalDashboard:
                        return <PrincipalDashboard school={school} stage={selectedStage!} onSelectAction={setPage} onLogout={performLogout} onBack={impersonationReturnPage ? stopImpersonation : () => setPage(Page.PrincipalStageSelection)} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalManagementMenu:
                        return <PrincipalManagementMenu school={school} stage={selectedStage!} onSelectAction={setPage} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalManageStudents:
                        return <PrincipalManageStudents school={school} stage={selectedStage!} onBack={() => setPage(Page.PrincipalManagementMenu)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalManageTeachers:
                        return <PrincipalManageTeachers school={school} stage={selectedStage!} onBack={() => setPage(Page.PrincipalManagementMenu)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalFeeManagement:
                        return <PrincipalFeeManagement school={school} onBack={() => setPage(Page.PrincipalManagementMenu)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onUpdateFees={() => {}} />;
                    case Page.PrincipalComplaints:
                        return <PrincipalComplaints school={school} onAnalyze={async () => "AI analysis"} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
                    case Page.PrincipalAnnouncements:
                        return <PrincipalAnnouncements school={school} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} announcements={[]} teachers={[]} onAddAnnouncement={() => {}} />;
                    case Page.PrincipalEducationalTips:
                        return <PrincipalEducationalTips 
                            school={school} 
                            onBack={() => setPage(Page.PrincipalDashboard)} 
                            onLogout={performLogout} 
                            toggleDarkMode={toggleDarkMode} 
                            isDarkMode={isDarkMode} 
                            tips={educationalTips}
                            onAddTip={async ({ content }) => {
                                if (!school) return;
                                const { error } = await supabase.from('educational_tips').insert([
                                    { content, school_id: school.id, date: new Date().toISOString() }
                                ]);
                                if (error) {
                                    console.error("Error adding educational tip:", error);
                                    alert(`Error: ${error.message}`);
                                } else {
                                    alert("تم إرسال النصيحة بنجاح!");
                                    await fetchEducationalTips(school.id);
                                }
                            }}
                            onGenerateAITip={async () => {
                                const apiKey = (import.meta as any).env.VITE_API_KEY;
                                if (!apiKey) {
                                    throw new Error("VITE_API_KEY is not configured.");
                                }
                                const ai = new GoogleGenAI({ apiKey });
                                const prompt = "اكتب نصيحة تربوية قصيرة ومفيدة للمعلمين أو أولياء الأمور حول تحسين تجربة تعلم الطلاب باللغة العربية.";
                                
                                try {
                                    const response = await ai.models.generateContent({
                                        model: 'gemini-2.5-flash',
                                        contents: prompt,
                                    });
                                    return response.text;
                                } catch (e) {
                                    console.error("Gemini API error:", e);
                                    throw new Error("Failed to generate tip from AI.");
                                }
                            }} 
                        />;
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
                 // FIX: The onLogout property was not defined in the teacherProps object. It has been corrected to use the performLogout function, which is available in the component's scope.
                 const teacherProps = { school, toggleDarkMode, isDarkMode, onLogout: performLogout, teacher: currentUser as Teacher };
                 const backToClassSelection = () => setPage(Page.TeacherClassSelection);
                 const backToActionMenu = () => setPage(Page.TeacherActionMenu);
                 
                 switch (page) {
                    case Page.TeacherDashboard:
                        return <TeacherDashboard {...teacherProps} onSelectionComplete={(level, subject) => { setSelectedLevel(level); setSelectedSubject(subject); setPage(Page.TeacherClassSelection); }} onBack={performLogout} />;
                    case Page.TeacherClassSelection:
                        const classes = (currentUser as Teacher).assignments[selectedLevel] || [];
                        return <TeacherClassSelection {...teacherProps} classes={classes} onSelectClass={(cls) => { setSelectedClass(cls); setPage(Page.TeacherActionMenu); }} onBack={() => setPage(Page.TeacherDashboard)} />;
                    case Page.TeacherActionMenu:
                        return <TeacherActionMenu {...teacherProps} selectedLevel={selectedLevel} onSelectAction={handleTeacherActionNavigation} onBack={backToClassSelection} />;
                    case Page.TeacherViewAnnouncements:
                         return <TeacherViewAnnouncements {...teacherProps} announcements={[]} onBack={backToActionMenu}/>
                    case Page.TeacherManageSummaries:
                         return <TeacherContentForm {...teacherProps} type="summary" items={[]} onSave={() => {}} onDelete={() => {}} onBack={backToActionMenu} subject={selectedSubject!} />;
                    case Page.TeacherManageExercises:
                         return <TeacherContentForm {...teacherProps} type="exercise" items={[]} onSave={() => {}} onDelete={() => {}} onBack={backToActionMenu} subject={selectedSubject!} />;
                    case Page.TeacherManageNotes:
                         return <TeacherNotesForm {...teacherProps} students={[]} onSaveNote={() => {}} onMarkAbsent={() => {}} onBack={backToActionMenu} />;
                    case Page.TeacherStudentSelection:
                         return <TeacherStudentSelection {...teacherProps} students={[]} onSelectStudent={(student) => { setSelectedStudent(student); setPage(nextPageAfterStudentSelection!); }} onBack={backToActionMenu} title={t('selectStudent')} />;
                    case Page.TeacherStudentGrades:
                         return <TeacherStudentGrades {...teacherProps} student={selectedStudent!} subject={selectedSubject!} initialGrades={[]} onSave={() => {}} onBack={() => setPage(Page.TeacherStudentSelection)} />;
                    case Page.TeacherManageExamProgram:
                         return <TeacherExamProgramForm {...teacherProps} examPrograms={[]} onSave={() => {}} onDelete={() => {}} onBack={backToActionMenu} />;
                    case Page.TeacherGenerateReportCard: // This is the selection screen
                         return <TeacherGenerateReportCard {...teacherProps} students={[]} onSelectStudent={(student) => { setSelectedStudent(student); setPage(Page.TeacherStudentReportGeneration); }} onBack={backToActionMenu} />;
                    case Page.TeacherStudentReportGeneration:
                         return <TeacherStudentReportGeneration {...teacherProps} student={selectedStudent!} subject={selectedSubject!} onGenerateComment={async () => "AI Comment"} onSendForReview={() => {}} onBack={() => setPage(Page.TeacherGenerateReportCard)} />;
                    case Page.TeacherAddSupplementaryLesson:
                        return <TeacherAddSupplementaryLesson {...teacherProps} subject={selectedSubject!} lessons={[]} onSave={()=>{}} onDelete={()=>{}} onBack={backToActionMenu} />;
                    case Page.TeacherAddUnifiedAssessment:
                        return <TeacherAddUnifiedAssessment {...teacherProps} assessments={[]} onSave={() => {}} onDelete={() => {}} onBack={backToActionMenu} />;
                    case Page.TeacherAddTimetable:
                        return <TeacherAddTimetable {...teacherProps} timetables={[]} onSave={()=>{}} onDelete={()=>{}} onBack={backToActionMenu} />;
                    case Page.TeacherAddQuiz:
                        return <TeacherAddQuiz {...teacherProps} quizzes={[]} onSave={() => {}} onDelete={() => {}} onBack={backToActionMenu} />;
                    case Page.TeacherAddProject:
                        return <TeacherAddProject {...teacherProps} projects={[]} onSave={() => {}} onDelete={() => {}} onBack={backToActionMenu} />;
                    case Page.TeacherAddLibrary:
                        return <TeacherAddLibrary {...teacherProps} libraryItems={[]} onSave={() => {}} onDelete={() => {}} onBack={backToActionMenu} />;
                    case Page.TeacherLessonPlanner:
                        return <TeacherLessonPlanner {...teacherProps} onGenerate={async () => "AI Lesson Plan"} onBack={backToActionMenu} />;
                    case Page.TeacherStudentSelectionForExercises:
                        return <TeacherStudentSelection {...teacherProps} students={[]} onSelectStudent={(student) => { setSelectedStudent(student); setPage(Page.TeacherPersonalizedExercises); }} onBack={backToActionMenu} title={t('selectStudentForExercises')} />;
                    case Page.TeacherPersonalizedExercises:
                        return <TeacherPersonalizedExercises {...teacherProps} student={selectedStudent!} subject={selectedSubject!} onGenerate={async () => "AI Exercises"} onSave={() => {}} onBack={() => setPage(Page.TeacherStudentSelectionForExercises)} />;
                    case Page.TeacherManageAlbum:
                        return <TeacherManageAlbum {...teacherProps} photos={[]} onSave={() => {}} onDelete={() => {}} onBack={backToActionMenu} />;
                    case Page.TeacherManageTalkingCards:
                        return <TeacherManageTalkingCards {...teacherProps} cards={[]} onAnalyze={async () => []} onSave={() => {}} onDelete={() => {}} onBack={backToActionMenu} />;
                    case Page.TeacherManageMemorization:
                        return <TeacherManageMemorization {...teacherProps} items={[]} onSave={() => {}} onDelete={() => {}} onExtractText={async () => "Extracted Text"} onBack={backToActionMenu} />;
                    default:
                         return <TeacherDashboard {...teacherProps} onSelectionComplete={(level, subject) => {setSelectedLevel(level); setSelectedSubject(subject); setPage(Page.TeacherClassSelection)}} onBack={performLogout} />;
                 }
            
            case UserRole.Guardian:
                if (!school || !currentUser) return null;
                const guardianProps = { school, student: currentUser as Student, onLogout: performLogout, toggleDarkMode, isDarkMode };
                const backToDashboard = () => setPage(Page.GuardianDashboard);
                const backToSubjectMenu = () => setPage(Page.GuardianSubjectMenu);

                 switch (page) {
                    case Page.GuardianDashboard:
                        return <GuardianDashboard {...guardianProps} notifications={notifications} onSelectSubject={(sub) => {setSelectedSubject(sub); setPage(Page.GuardianSubjectMenu)}} navigateTo={setPage} />;
                    case Page.GuardianSubjectMenu:
                        return <GuardianSubjectMenu {...guardianProps} studentLevel={(currentUser as Student).level} subject={selectedSubject!} onSelectAction={setPage} onBack={backToDashboard} />;
                    case Page.GuardianViewSummaries:
                        return <GuardianViewContent type="summaries" {...guardianProps} subject={selectedSubject} onBack={backToSubjectMenu} />
                    case Page.GuardianViewExercises:
                        return <GuardianViewContent type="exercises" {...guardianProps} subject={selectedSubject} onBack={backToSubjectMenu} />
                    case Page.GuardianViewNotes:
                        return <GuardianViewNotes {...guardianProps} subject={selectedSubject} onBack={backToSubjectMenu} />;
                    case Page.GuardianViewGrades:
                        return <GuardianViewGrades {...guardianProps} subject={selectedSubject} onBack={backToSubjectMenu} />;
                    case Page.GuardianViewExamProgram:
                        return <GuardianViewExamProgram {...guardianProps} onBack={backToSubjectMenu} />;
                    // FIX: The 'subject' prop was missing and is required by the component. It has been added to ensure the component receives the necessary data.
                    case Page.GuardianViewSupplementaryLessons:
                        return <GuardianViewSupplementaryLessons {...guardianProps} subject={selectedSubject} onBack={backToSubjectMenu} />;
                    // FIX: The 'subject' prop was missing and is required by the component. It has been added to ensure the component receives the necessary data.
                    case Page.GuardianViewUnifiedAssessments:
                        return <GuardianViewUnifiedAssessments {...guardianProps} subject={selectedSubject} onBack={backToSubjectMenu} />;
                    case Page.GuardianViewTimetable:
                        return <GuardianViewTimetable {...guardianProps} onBack={backToSubjectMenu} />;
                    // FIX: The 'subject' prop was missing and is required by the component. It has been added to ensure the component receives the necessary data.
                    case Page.GuardianViewQuizzes:
                        return <GuardianViewQuizzes {...guardianProps} subject={selectedSubject} onBack={backToSubjectMenu} />;
                    // FIX: The 'subject' prop was missing and is required by the component. It has been added to ensure the component receives the necessary data.
                    case Page.GuardianViewProjects:
                        return <GuardianViewProjects {...guardianProps} subject={selectedSubject} onBack={backToSubjectMenu} />;
                    // FIX: The 'subject' prop was missing and is required by the component. It has been added to ensure the component receives the necessary data.
                    case Page.GuardianViewLibrary:
                        return <GuardianViewLibrary {...guardianProps} subject={selectedSubject} onBack={backToSubjectMenu} />;
                    // FIX: The 'subject' prop was missing and is required by the component. It has been added to ensure the component receives the necessary data.
                    case Page.GuardianViewPersonalizedExercises:
                        return <GuardianViewPersonalizedExercises {...guardianProps} subject={selectedSubject} onBack={backToSubjectMenu} />;
                    case Page.GuardianNotifications:
                        return <GuardianNotifications {...guardianProps} notifications={notifications} onMarkRead={handleMarkNotificationsRead} onBack={backToDashboard} />;
                    case Page.GuardianViewAnnouncements:
                        return <GuardianViewAnnouncements {...guardianProps} onBack={backToDashboard} />;
                    case Page.GuardianViewEducationalTips:
                        return <GuardianViewEducationalTips {...guardianProps} onBack={backToDashboard} />;
                    case Page.GuardianSubmitComplaint:
                        return <GuardianSubmitComplaint {...guardianProps} onSubmit={handleSubmitComplaint} onBack={backToDashboard} />;
                    case Page.GuardianMonthlyFees:
                        return <GuardianMonthlyFees {...guardianProps} onPay={handlePayFee} onBack={backToDashboard} />;
                    case Page.GuardianRequestInterview:
                        return <GuardianRequestInterview {...guardianProps} onRequest={handleRequestInterview} onBack={backToDashboard} />;
                    case Page.GuardianViewAlbum:
                        return <GuardianViewAlbum {...guardianProps} onBack={backToDashboard} />;
                    case Page.GuardianViewTalkingCards:
                        return <GuardianViewTalkingCards {...guardianProps} onBack={backToDashboard} />;
                    case Page.GuardianViewMemorization:
                        return <GuardianViewMemorization {...guardianProps} onBack={backToDashboard} />;
                     default:
                        return <GuardianDashboard {...guardianProps} notifications={notifications} onSelectSubject={(sub) => {setSelectedSubject(sub); setPage(Page.GuardianSubjectMenu)}} navigateTo={setPage} />;
                 }

            default:
                return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:pt-4 pt-24">
            <ConfirmationModal 
                isOpen={isConfirmationModalOpen}
                title={confirmationModalConfig.title}
                message={confirmationModalConfig.message}
                onConfirm={confirmationModalConfig.onConfirm}
                onCancel={() => setIsConfirmationModalOpen(false)}
            />
            <Suspense fallback={<LoadingSpinner />}>
              {renderPage()}
            </Suspense>
        </div>
    );
};

export default App;