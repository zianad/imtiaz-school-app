import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Page, UserRole, Student, Teacher, Principal, Subject, School, EducationalStage, SchoolFeature, Announcement, Complaint, EducationalTip, MonthlyFeePayment, InterviewRequest, Notification, SearchResult } from '../../packages/core/types';
import { supabase, isSupabaseConfigured } from '../../packages/core/supabaseClient';
import { SUPER_ADMIN_LOGIN_CODE, ALL_FEATURES_ENABLED } from '../../packages/core/constants';
import { snakeToCamelCase, camelToSnakeCase } from '../../packages/core/utils';
import { useTranslation } from 'react-i18next';

// --- Import All Screen Components ---
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
import PrincipalBrowseAsTeacherSelection from './components/screens/PrincipalBrowseAsTeacherSelection';
import PrincipalMonthlyFees from './components/screens/PrincipalMonthlyFees';
import PrincipalInterviewRequests from './components/screens/PrincipalInterviewRequests';
import PrincipalFeeManagement from './components/screens/PrincipalFeeManagement';
import PrincipalReviewAlbum from './components/screens/PrincipalReviewAlbum';
import PrincipalFinancialDashboard from './components/screens/PrincipalFinancialDashboard';
import TeacherDashboard from './components/screens/TeacherDashboard';
import TeacherClassSelection from './components/screens/TeacherClassSelection';
import TeacherActionMenu from './components/screens/TeacherActionMenu';
import TeacherStudentSelection from './components/screens/TeacherStudentSelection';
import TeacherGenerateReportCard from './components/screens/TeacherGenerateReportCard';
import TeacherStudentReportGeneration from './components/screens/TeacherStudentReportGeneration';
import GuardianDashboard from './components/screens/GuardianDashboard';
import GuardianSubjectMenu from './components/screens/GuardianSubjectMenu';
import GuardianNotifications from './components/screens/GuardianNotifications';
import ConfigErrorScreen from './components/screens/ConfigErrorScreen';
import FeedbackModal from './components/FeedbackModal';
import TeacherViewAnnouncements from './components/screens/TeacherViewAnnouncements';
import GuardianViewContent from './components/screens/GuardianViewContent';
import GuardianViewNotes from './components/screens/GuardianViewNotes';
import GuardianViewGrades from './components/screens/GuardianViewGrades';
import GuardianViewExamProgram from './components/screens/GuardianViewExamProgram';
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
import SearchHeader from './components/common/SearchHeader';
import SearchResultModal from './components/common/SearchResultModal';
import ConfirmationModal from './components/common/ConfirmationModal';

const App: React.FC = () => {
    // --- Global State ---
    const [page, setPage] = useState<Page>(Page.UnifiedLogin);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [currentUser, setCurrentUser] = useState<Student | Teacher | Principal | { id: string } | null>(null);
    const [schools, setSchools] = useState<School[]>([]); // For SuperAdmin
    const [currentSchool, setCurrentSchool] = useState<School | null>(null); // For logged-in users
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [sessionChecked, setSessionChecked] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // --- Screen-specific state ---
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedStage, setSelectedStage] = useState<EducationalStage | null>(null);
    const [selectedSchoolForMgmt, setSelectedSchoolForMgmt] = useState<School | null>(null);
    const [impersonatingTeacher, setImpersonatingTeacher] = useState<Teacher | null>(null);
    
    // --- Search State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult | null>(null);

    // --- Confirmation Modal State ---
    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    } | null>(null);

    const { i18n } = useTranslation();

    // --- AI instance ---
    const ai = isSupabaseConfigured ? new GoogleGenAI({apiKey: (import.meta as any).env.VITE_API_KEY as string}) : null;

    // --- Effects ---
    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true' || 
                       (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDarkMode(isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    // Effect for language direction
    useEffect(() => {
        const handleLanguageChange = (lng: string) => {
            document.documentElement.lang = lng;
            document.documentElement.dir = i18n.dir(lng);
        };
        i18n.on('languageChanged', handleLanguageChange);
        handleLanguageChange(i18n.language); // Set initial direction
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n]);
    
    // --- Auth State Change Handler ---
    const handleAuthStateChange = useCallback(async (session: any) => {
        setIsLoading(true);
        if (session?.user) {
            const { user } = session;
            if (user.email === (import.meta as any).env.VITE_SUPER_ADMIN_EMAIL) {
                setUserRole(UserRole.SuperAdmin);
                setCurrentUser({ id: user.id });
                await fetchAllSchoolsForSuperAdmin();
                setPage(Page.SuperAdminDashboard);
            } else {
                const [code, schoolIdDomain] = user.email.split('@');
                const schoolId = schoolIdDomain.split('.')[0];
                
                const { data: schoolData, error: schoolError } = await supabase
                    .from('schools')
                    .select('*')
                    .eq('id', schoolId)
                    .single();

                if (schoolError || !schoolData) {
                    console.error("User's school not found:", schoolError);
                    await performLogout(); return;
                }
                const school = snakeToCamelCase(schoolData) as School;
                setCurrentSchool(school);

                const { data: studentData } = await supabase.from('students').select('*').eq('guardian_code', code).eq('school_id', schoolId).single();
                if (studentData) { 
                    const student = snakeToCamelCase(studentData) as Student;
                    setUserRole(UserRole.Guardian); 
                    setCurrentUser(student);
                    const { data: notifData } = await supabase.from('notifications').select('*').eq('student_id', student.id).order('date', { ascending: false });
                    setNotifications(notifData ? snakeToCamelCase(notifData) as Notification[] : []);
                    setPage(Page.GuardianDashboard); 
                } else {
                    const { data: teacherData } = await supabase.from('teachers').select('*').eq('login_code', code).eq('school_id', schoolId).single();
                    if (teacherData) { 
                        setUserRole(UserRole.Teacher); 
                        setCurrentUser(snakeToCamelCase(teacherData)); 
                        setPage(Page.TeacherDashboard); 
                    } else {
                        const { data: principalData } = await supabase.from('principals').select('*').eq('login_code', code).eq('school_id', schoolId).single();
                        if (principalData) { 
                            setUserRole(UserRole.Principal); 
                            setCurrentUser(snakeToCamelCase(principalData)); 
                            setPage(Page.PrincipalStageSelection); 
                        } else { 
                            console.error("User profile not found for code:", code); 
                            await performLogout(); 
                        }
                    }
                }
            }
        } else {
            setUserRole(null);
            setCurrentUser(null);
            setCurrentSchool(null);
            setPage(Page.UnifiedLogin);
        }
        setIsLoading(false);
        setSessionChecked(true);
    }, []);
    
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleAuthStateChange(session);
        });
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleAuthStateChange(session);
        });

        return () => subscription.unsubscribe();
    }, [handleAuthStateChange]);


    // --- Core Functions ---
    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newIsDark = !prev;
            localStorage.setItem('darkMode', String(newIsDark));
            document.documentElement.classList.toggle('dark', newIsDark);
            return newIsDark;
        });
    };

    const performLogout = async () => {
        await supabase.auth.signOut();
        setIsFeedbackModalOpen(true);
        // Reset state
        setUserRole(null);
        setCurrentUser(null);
        setCurrentSchool(null);
        setSelectedSubject(null);
        setSelectedLevel('');
        setSelectedClass('');
        setSelectedStage(null);
        setImpersonatingTeacher(null);
        setPage(Page.UnifiedLogin);
    };

    const handleLogin = async (code: string): Promise<void> => {
        code = code.trim();
        if (code.toLowerCase() === SUPER_ADMIN_LOGIN_CODE.toLowerCase()) {
            await supabase.auth.signInWithPassword({
                email: (import.meta as any).env.VITE_SUPER_ADMIN_EMAIL,
                password: (import.meta as any).env.VITE_SUPER_ADMIN_PASSWORD
            });
            return;
        }

        const { data: principalData } = await supabase.from('principals').select('school_id').eq('login_code', code).single();
        if (principalData) {
            const email = `${code}@${principalData.school_id}.com`;
            const password = `ImtiazApp_${code}_S3cure!`;
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw new Error(error.message);
            return;
        }

        const { data: teacherData } = await supabase.from('teachers').select('school_id').eq('login_code', code).single();
        if (teacherData) {
            const email = `${code}@${teacherData.school_id}.com`;
            const password = `ImtiazApp_${code}_S3cure!`;
            const { error } = await supabase.auth.signInWithPassword({ email, password });
             if (error) throw new Error(error.message);
            return;
        }

        const { data: studentData } = await supabase.from('students').select('school_id').eq('guardian_code', code).single();
        if (studentData) {
             const email = `${code}@${studentData.school_id}.com`;
             const password = `ImtiazApp_${code}_S3cure!`;
             const { error } = await supabase.auth.signInWithPassword({ email, password });
              if (error) throw new Error(error.message);
             return;
        }
        
        throw new Error('Invalid login credentials');
    };
    
    // --- Super Admin Functions ---
    const fetchAllSchoolsForSuperAdmin = useCallback(async () => {
        const { data, error } = await supabase.from('schools').select('*, principals(*)').order('name');
        if (error) {
            console.error("Error fetching schools:", error);
        } else {
             const schoolsData = snakeToCamelCase(data) as School[];
            const schoolsWithGroupedPrincipals = schoolsData.map(school => {
                const groupedPrincipals: Partial<Record<EducationalStage, Principal[]>> = {};
                // Ensure principals is an array before iterating
                if (Array.isArray(school.principals)) {
                    for (const principal of school.principals) {
                        if (!groupedPrincipals[principal.stage]) {
                            groupedPrincipals[principal.stage] = [];
                        }
                        groupedPrincipals[principal.stage]!.push(principal);
                    }
                }
                return { ...school, principals: groupedPrincipals };
            });
            setSchools(schoolsWithGroupedPrincipals as any);
        }
    }, []);
    
    const handleAddSchool = async (schoolName: string, principalCode: string, logoUrl: string) => {
        const { data: schoolData, error: schoolError } = await supabase.from('schools').insert({
            name: schoolName,
            logo_url: logoUrl,
            stages: [EducationalStage.PRIMARY], 
            feature_flags: ALL_FEATURES_ENABLED,
            is_active: true,
        }).select().single();

        if (schoolError || !schoolData) {
            throw new Error('Error adding school: ' + schoolError?.message);
        }

        const principalEmail = `${principalCode}@${schoolData.id}.com`;
        const principalPassword = `ImtiazApp_${principalCode}_S3cure!`;
        
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: principalEmail,
            password: principalPassword,
        });

        if (signUpError || !authData.user) {
             await supabase.from('schools').delete().eq('id', schoolData.id); // Rollback
             throw new Error('Failed to create principal login: ' + signUpError?.message);
        }

        const { error: principalError } = await supabase.from('principals').insert({
            name: "المدير العام",
            login_code: principalCode,
            stage: EducationalStage.PRIMARY,
            school_id: schoolData.id,
            user_id: authData.user.id
        });

        if (principalError) {
             await supabase.from('schools').delete().eq('id', schoolData.id); // Rollback
             await supabase.auth.admin.deleteUser(authData.user.id); // Rollback
             throw new Error('School added, but failed to add principal profile: ' + principalError.message);
        }
        await fetchAllSchoolsForSuperAdmin();
    };
    
    const confirmDeleteSchool = (schoolId: string, schoolName: string) => {
        setConfirmation({
            isOpen: true,
            title: "تأكيد الحذف",
            message: `هل أنت متأكد من رغبتك في حذف مدرسة "${schoolName}"؟ سيتم حذف جميع البيانات المرتبطة بها بشكل دائم.`,
            onConfirm: () => handleDeleteSchool(schoolId),
        });
    };
    
    const handleDeleteSchool = async (schoolId: string) => {
        const { error } = await supabase.rpc('delete_school', { school_id_to_delete: schoolId });
        if (error) alert('Error deleting school: ' + error.message);
        else await fetchAllSchoolsForSuperAdmin();
    };
    
    const handleManageSchool = (schoolId: string) => {
        const schoolToManage = schools.find(s => s.id === schoolId);
        if (schoolToManage) {
            setSelectedSchoolForMgmt(schoolToManage);
            setPage(Page.SuperAdminSchoolManagement);
        }
    };
    

    // --- Search Functionality ---
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        const debounceTimer = setTimeout(async () => {
            if (!currentSchool) return;
            setIsSearching(true);
            
            // This is a simplified search. A real app might use a dedicated search endpoint or Postgres functions.
            const { data, error } = await supabase.rpc('search_school_data', {
                p_school_id: currentSchool.id,
                p_search_term: searchQuery
            });
            
            if (error) {
                console.error("Search error:", error);
                setSearchResults([]);
            } else {
                setSearchResults(snakeToCamelCase(data) as SearchResult[]);
            }
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, currentSchool]);
    
    // FIX: Add handler for marking notifications as read.
    const handleMarkAsRead = async (notificationId: number) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);

        if (error) {
            console.error('Failed to mark notification as read:', error);
            // Optionally revert state change on error
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: false } : n)
            );
        }
    };


    // --- Page Rendering Logic ---
    const renderPage = () => {
        // ... (render logic based on 'page' state)
        // This will be a large switch statement
        switch(page){
            // Add all cases here based on the Page enum
            case Page.UnifiedLogin: return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.SuperAdminDashboard: return <SuperAdminDashboard schools={schools} onAddSchool={handleAddSchool} onDeleteSchool={confirmDeleteSchool} onManageSchool={handleManageSchool} onNavigate={setPage} onLogout={performLogout} />;
            case Page.SuperAdminSchoolManagement: return <SuperAdminSchoolManagement school={selectedSchoolForMgmt!} onBack={() => {setSelectedSchoolForMgmt(null); setPage(Page.SuperAdminDashboard);}} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onDataChange={fetchAllSchoolsForSuperAdmin} />;
            case Page.SuperAdminFeedbackAnalysis: return <SuperAdminFeedbackAnalysis schools={schools} onAnalyze={async () => "Analysis from AI"} onBack={()=>setPage(Page.SuperAdminDashboard)} onLogout={performLogout} />;

            case Page.PrincipalStageSelection: return <PrincipalStageSelection school={currentSchool!} principal={currentUser as Principal} onSelectStage={(s) => { setSelectedStage(s); setPage(Page.PrincipalDashboard); }} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.PrincipalDashboard: return <PrincipalDashboard school={currentSchool!} stage={selectedStage!} onSelectAction={setPage} onBack={() => setPage(Page.PrincipalStageSelection)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            
            case Page.GuardianDashboard: return <GuardianDashboard student={currentUser as Student} school={currentSchool!} onSelectSubject={(s) => { setSelectedSubject(s); setPage(Page.GuardianSubjectMenu); }} onLogout={performLogout} navigateTo={setPage} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} notifications={notifications} />;
            case Page.GuardianSubjectMenu: return <GuardianSubjectMenu subject={selectedSubject!} school={currentSchool!} onSelectAction={setPage} onBack={() => setPage(Page.GuardianDashboard)} onLogout={performLogout} studentLevel={(currentUser as Student).level} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            // FIX: Pass notifications and onMarkAsRead handler to GuardianNotifications component.
            case Page.GuardianNotifications: return <GuardianNotifications school={currentSchool!} student={currentUser as Student} onBack={() => setPage(Page.GuardianDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} notifications={notifications} onMarkAsRead={handleMarkAsRead} />;

            case Page.TeacherDashboard: return <TeacherDashboard school={currentSchool!} teacher={currentUser as Teacher} onSelectionComplete={(level, subject) => { setSelectedLevel(level); setSelectedSubject(subject); setPage(Page.TeacherClassSelection); }} onBack={performLogout} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
            
            // Lazy-loaded component cases
            case Page.PrincipalManageStudents: return <PrincipalManageStudents school={currentSchool!} stage={selectedStage!} onBack={() => setPage(Page.PrincipalManagementMenu)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.PrincipalComplaints: return <PrincipalComplaints school={currentSchool!} onBack={() => setPage(Page.PrincipalDashboard)} onLogout={performLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>
            
            // Add all other cases
            default:
                if (userRole) { // If logged in but page not found, go to dashboard
                    if (userRole === UserRole.SuperAdmin) setPage(Page.SuperAdminDashboard);
                    else if (userRole === UserRole.Principal) setPage(Page.PrincipalStageSelection);
                    else if (userRole === UserRole.Teacher) setPage(Page.TeacherDashboard);
                    else if (userRole === UserRole.Guardian) setPage(Page.GuardianDashboard);
                    return null; // The page will re-render to the correct dashboard
                }
                return <div>Page not found for role {userRole} and page {page}</div>;

        }
    };

    if (!isSupabaseConfigured) {
        return <ConfigErrorScreen />;
    }
    
    if (!sessionChecked || isLoading) {
        return <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">Loading...</div>;
    }

    const showSearch = userRole && userRole !== UserRole.SuperAdmin;

    return (
        <div className={`w-full min-h-screen p-4 sm:pt-24 flex items-start justify-center ${showSearch ? 'pt-24' : ''}`}>
             {showSearch && currentSchool && (
                <SearchHeader 
                    schoolName={currentSchool.name}
                    query={searchQuery}
                    onQueryChange={setSearchQuery}
                    isSearching={isSearching}
                    results={searchResults}
                    onResultClick={(result) => {
                        setSelectedSearchResult(result);
                        setSearchQuery(''); // Clear query to hide results list
                    }}
                />
             )}
             {renderPage()}
             {selectedSearchResult && (
                <SearchResultModal result={selectedSearchResult} onClose={() => setSelectedSearchResult(null)} isDarkMode={isDarkMode} />
             )}
             {confirmation && (
                <ConfirmationModal {...confirmation} onCancel={() => setConfirmation(null)} />
             )}
             <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                onSubmit={async (rating, comments) => {
                     await supabase.from('feedback').insert([{
                        rating,
                        comments,
                        user_role: userRole,
                        school_id: currentSchool?.id,
                    }]);
                    setIsFeedbackModalOpen(false);
                }}
            />
        </div>
    );
};

export default App;