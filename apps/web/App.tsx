import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
// FIX: The `Session` type from '@supabase/supabase-js' was not being resolved correctly. `Session` is a type and should be imported using `import type`.
import type { Session } from '@supabase/supabase-js';
import { Page, UserRole, Subject, Summary, Exercise, Note, ExamProgram, Student, Grade, Absence, Notification, School, Teacher, Announcement, Complaint, EducationalTip, Language, SchoolFeature, MonthlyFeePayment, InterviewRequest, SupplementaryLesson, Timetable, Quiz, Project, LibraryItem, PersonalizedExercise, AlbumPhoto, UnifiedAssessment, EducationalStage, Hotspot, TalkingCard, MemorizationItem, Principal, Expense, Feedback, Question, SearchResult, SearchResultType, SearchableContent } from '../../packages/core/types';
import { getBlankGrades, SUPER_ADMIN_CODE, ALL_FEATURES_ENABLED, SUPER_ADMIN_EMAIL } from '../../packages/core/constants';
import { useTranslation } from '../../packages/core/i18n';
import { snakeToCamelCase, camelToSnakeCase, getStageForLevel, compressImage } from '../../packages/core/utils';
import { supabase, isSupabaseConfigured } from '../../packages/core/supabaseClient';


import UnifiedLoginScreen from './components/screens/UnifiedLoginScreen';
import SuperAdminDashboard from './components/screens/SuperAdminDashboard';
import TeacherDashboard from './components/screens/TeacherDashboard';
import TeacherClassSelection from './components/screens/TeacherClassSelection';
import TeacherActionMenu from './components/screens/TeacherActionMenu';
import TeacherContentForm from './components/screens/TeacherContentForm';
import TeacherStudentGrades from './components/screens/TeacherStudentGrades';
import GuardianDashboard from './components/screens/GuardianDashboard';
import GuardianSubjectMenu from './components/screens/GuardianSubjectMenu';
import GuardianViewContent from './components/screens/GuardianViewContent';
import GuardianViewNotes from './components/screens/GuardianViewNotes';
import GuardianViewGrades from './components/screens/GuardianViewGrades';
import TeacherExamProgramForm from './components/screens/TeacherExamProgramForm';
import GuardianViewExamProgram from './components/screens/GuardianViewExamProgram';
import TeacherStudentSelection from './components/screens/TeacherStudentSelection';
import TeacherNotesForm from './components/screens/TeacherNotesForm';
import TeacherGenerateReportCard from './components/screens/TeacherGenerateReportCard';
import TeacherStudentReportGeneration from './components/screens/TeacherStudentReportGeneration';
import GuardianNotifications from './components/screens/GuardianNotifications';
import TeacherViewAnnouncements from './components/screens/TeacherViewAnnouncements';
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
import GuardianViewAnnouncements from './components/screens/GuardianViewAnnouncements';
import GuardianViewEducationalTips from './components/screens/GuardianViewEducationalTips';
import GuardianSubmitComplaint from './components/screens/GuardianSubmitComplaint';
import GuardianMonthlyFees from './components/screens/GuardianMonthlyFees';
import GuardianRequestInterview from './components/screens/GuardianRequestInterview';
import GuardianViewSupplementaryLessons from './components/screens/GuardianViewSupplementaryLessons';
import GuardianViewTimetable from './components/screens/GuardianViewTimetable';
import GuardianViewQuizzes from './components/screens/GuardianViewQuizzes';
import GuardianViewProjects from './components/screens/GuardianViewProjects';
import GuardianViewLibrary from './components/screens/GuardianViewLibrary';
import GuardianViewPersonalizedExercises from './components/screens/GuardianViewPersonalizedExercises';
import GuardianViewAlbum from './components/screens/GuardianViewAlbum';
import GuardianViewUnifiedAssessments from './components/screens/GuardianViewUnifiedAssessments';
import GuardianViewTalkingCards from './components/screens/GuardianViewTalkingCards';
import GuardianViewMemorization from './components/screens/GuardianViewMemorization';
import TeacherAddSupplementaryLesson from './components/screens/TeacherAddSupplementaryLesson';
import TeacherAddTimetable from './components/screens/TeacherAddTimetable';
import TeacherAddQuiz from './components/screens/TeacherAddQuiz';
import TeacherAddProject from './components/screens/TeacherAddProject';
import TeacherAddLibrary from './components/screens/TeacherAddLibrary';
import TeacherLessonPlanner from './components/screens/TeacherLessonPlanner';
import TeacherPersonalizedExercises from './components/screens/TeacherPersonalizedExercises';
import TeacherManageAlbum from './components/screens/TeacherManageAlbum';
import TeacherAddUnifiedAssessment from './components/screens/TeacherAddUnifiedAssessment';
import TeacherManageTalkingCards from './components/screens/TeacherManageTalkingCards';
import TeacherManageMemorization from './components/screens/TeacherManageMemorization';
import SuperAdminSchoolManagement from './components/screens/SuperAdminSchoolManagement';
import SuperAdminFeedbackAnalysis from './components/screens/SuperAdminFeedbackAnalysis';
import PrincipalFinancialDashboard from './components/screens/PrincipalFinancialDashboard';
import MaintenanceScreen from './components/screens/MaintenanceScreen';
import FeedbackModal from './components/FeedbackModal';
import SearchHeader from './components/common/SearchHeader';
import SearchResultModal from './components/common/SearchResultModal';
import ConfirmationModal from './components/common/ConfirmationModal';
import ConfigErrorScreen from './components/screens/ConfigErrorScreen';

// Hook to get window size
const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<{ width: number | undefined; height: number | undefined }>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("resize", handleResize);
        handleResize(); // Call handler right away so state gets updated with initial window size

        return () => window.removeEventListener("resize", handleResize);
    }, []); 

    return windowSize;
};

export default function App() {
  const [schools, setSchools] = useState<School[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<Page[]>([Page.UnifiedLogin]);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [schoolForSuperAdminViewId, setSchoolForSuperAdminViewId] = useState<string | null>(null);
  const [isSuperAdminImpersonating, setIsSuperAdminImpersonating] = useState<boolean>(false);
  const [isPrincipalImpersonatingTeacher, setIsPrincipalImpersonatingTeacher] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const [selectedStage, setSelectedStage] = useState<EducationalStage | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [studentForGrading, setStudentForGrading] = useState<Student | null>(null);
  const [studentForReport, setStudentForReport] = useState<Student | null>(null);
  const [studentForPersonalizedExercises, setStudentForPersonalizedExercises] = useState<Student | null>(null);
  const [principalStages, setPrincipalStages] = useState<EducationalStage[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const debounceTimeoutRef = useRef<number | null>(null);

  // Confirmation Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalContent, setConfirmModalContent] = useState({ title: '', message: '', onConfirm: () => {} });

  const { t, language } = useTranslation();
  const currentPage = history[history.length - 1];
  const aiRef = useRef<GoogleGenAI | null>(null);
  const { width } = useWindowSize();
  const isDesktop = width ? width >= 1024 : false;

  const historyRef = useRef(history);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    const apiKey = (import.meta as any).env.VITE_API_KEY;
    if (apiKey) { 
      aiRef.current = new GoogleGenAI({ apiKey: apiKey });
    } else {
      console.warn("Gemini API key not found in import.meta.env.VITE_API_KEY. AI features will be mocked.");
    }
  }, []);

  const activeSchoolId = (userRole === UserRole.SuperAdmin && schoolForSuperAdminViewId) 
    ? schoolForSuperAdminViewId 
    : selectedSchoolId;

  const selectedSchool = schools.find(s => s.id === activeSchoolId);

  // #region Search (Remains client-side for now)
  const performSearch = useCallback((query: string) => {
    if (!selectedSchool || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search Students, Teachers, Announcements, etc.
    (selectedSchool.students || []).forEach(student => {
        if (student.name.toLowerCase().includes(lowerCaseQuery)) {
            results.push({ type: 'student', title: student.name, description: `${student.level} - ${student.class}`, data: student, icon: '🎓' });
        }
    });
    (selectedSchool.teachers || []).forEach(teacher => {
        if (teacher.name.toLowerCase().includes(lowerCaseQuery)) {
            results.push({ type: 'teacher', title: teacher.name, description: teacher.subjects.join(', '), data: teacher, icon: '👨‍🏫' });
        }
    });
    (selectedSchool.announcements || []).forEach(ann => {
        if (ann.content.toLowerCase().includes(lowerCaseQuery)) {
            results.push({ type: 'announcement', title: t('announcement'), description: ann.content.substring(0, 50) + '...', data: ann, icon: '📢' });
        }
    });
    
     (selectedSchool.summaries || []).forEach(item => {
        if (item.title.toLowerCase().includes(lowerCaseQuery) || item.content.toLowerCase().includes(lowerCaseQuery)) {
            results.push({ type: 'summary', title: item.title, description: `${item.subject} - ${item.level}`, data: item, icon: '📝' });
        }
    });

    (selectedSchool.exercises || []).forEach(item => {
        if (item.content.toLowerCase().includes(lowerCaseQuery)) {
            results.push({ type: 'exercise', title: `${t('exercise')} - ${item.subject}`, description: item.content.substring(0, 50) + '...', data: item, icon: '🏋️' });
        }
    });

    setSearchResults(results);
    setIsSearching(false);
  }, [selectedSchool, t]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    if (query.length < 2) { setSearchResults([]); setIsSearching(false); return; }
    setIsSearching(true);
    debounceTimeoutRef.current = window.setTimeout(() => performSearch(query), 300);
  };
  
  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
    setSearchQuery('');
    setSearchResults([]);
  };
  // #endregion

  // #region Navigation
  const navigateTo = useCallback((page: Page) => setHistory(prev => [...prev, page]), []);

  const handleBack = useCallback(() => {
    if (history.length > 1) {
        if(currentPage === Page.TeacherDashboard && isPrincipalImpersonatingTeacher) {
            setIsPrincipalImpersonatingTeacher(false);
            setHistory(prev => [prev[0], Page.PrincipalBrowseAsTeacherSelection]);
            return;
        }
        if(currentPage === Page.PrincipalDashboard && isSuperAdminImpersonating) {
            setIsSuperAdminImpersonating(false);
            setHistory(prev => [prev[0], Page.SuperAdminDashboard]);
            return;
        }
        setHistory(prev => prev.slice(0, -1));
    }
  }, [history, currentPage, isPrincipalImpersonatingTeacher, isSuperAdminImpersonating]);
  // #endregion
  
  // #region Authentication & Data Loading
  const handleLogout = useCallback((isError = false) => {
    (supabase.auth as any).signOut();
    setSession(null);
    setUserRole(null);
    setCurrentStudent(null);
    setCurrentTeacher(null);
    setSelectedSchoolId(null);
    setHistory([Page.UnifiedLogin]);
    setIsPrincipalImpersonatingTeacher(false);
    setIsSuperAdminImpersonating(false);
    if (!isError) {
        localStorage.removeItem('savedLoginCode');
        localStorage.removeItem('rememberLoginCode');
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    setFatalError(null);

    try {
        // Step 1: Fetch base school data with directly related tables
        const { data: schoolsData, error: schoolsError } = await supabase.from('schools').select(`
            *, principals(*), students(*, grades(*)), teachers(*)
        `);

        if (schoolsError) throw schoolsError;
        
        const schoolIds = schoolsData.map(s => s.id);
        if (schoolIds.length === 0) {
            setSchools([]);
            setIsLoading(false);
            // Handle user logic for no schools found if necessary
            const email = session?.user?.email;
            if (email && email === SUPER_ADMIN_EMAIL) {
                setUserRole(UserRole.SuperAdmin);
                navigateTo(Page.SuperAdminDashboard);
            }
            return;
        }
        
        // Step 2: Fetch all other related data for all schools in parallel to avoid relationship errors
        const relatedTables = [
            'summaries', 'exercises', 'notes', 'exam_programs', 'notifications', 
            'announcements', 'educational_tips', 'monthly_fee_payments', 'interview_requests', 
            'supplementary_lessons', 'timetables', 'quizzes', 'projects', 'library_items', 
            'album_photos', 'personalized_exercises', 'unified_assessments', 'talking_cards', 
            'memorization_items', 'absences', 'complaints', 'expenses', 'feedback'
        ];

        const promises = relatedTables.map(table => 
            supabase.from(table).select('*').in('school_id', schoolIds)
        );
        const results = await Promise.all(promises);
        
        const errors = results.map(r => r.error).filter(Boolean);
        if (errors.length > 0) {
            console.warn("Errors fetching some related data for schools:", errors);
        }

        const relatedDataMap: { [key: string]: any[] } = {};
        results.forEach((result, index) => {
            relatedDataMap[relatedTables[index]] = result.data || [];
        });

        // Step 3: Map the fetched related data back to their respective schools
        for (const school of schoolsData) {
            for (const tableName of relatedTables) {
                (school as any)[tableName] = relatedDataMap[tableName].filter(item => item.school_id === school.id);
            }
        }
        
        const data = schoolsData;
        const camelCaseSchools: any[] = snakeToCamelCase(data);
        const transformedSchools = camelCaseSchools.map(school => {
            const principalsByStage: School['principals'] = {};
            (school.principals || []).forEach((p: Principal & { stage: EducationalStage }) => {
                if (p.stage) {
                    if (!principalsByStage[p.stage]) principalsByStage[p.stage] = [];
                    principalsByStage[p.stage]!.push(p);
                }
            });

            return {
                ...school,
                principals: principalsByStage,
                teachers: (school.teachers || []).map((t: Teacher) => ({ ...t, assignments: t.assignments || {} })),
                students: (school.students || []).map((st: any) => ({
                    ...st,
                    grades: (st.grades || []).reduce((acc: any, g: Grade & { subject: Subject }) => {
                        if (g.subject) { (acc[g.subject] = acc[g.subject] || []).push(g); }
                        return acc;
                    }, {}),
                })),
            };
        });
        
        setSchools(transformedSchools as School[]);

        const email = session?.user?.email;
        if (!email) { handleLogout(true); return; }

        if (email === SUPER_ADMIN_EMAIL) {
            setUserRole(UserRole.SuperAdmin);
            navigateTo(Page.SuperAdminDashboard);
        } else {
            const code = email.split('@')[0];
            let userFound = false;
            for (const school of transformedSchools) {
                const student = school.students.find((s: Student) => s.guardianCode === code);
                if (student) {
                    setSelectedSchoolId(school.id);
                    setCurrentStudent(student);
                    setUserRole(UserRole.Guardian);
                    userFound = true;
                    break;
                }
                const teacher = school.teachers.find((t: Teacher) => t.loginCode === code);
                if (teacher) {
                    if (!teacher.assignments) teacher.assignments = {};
                    setSelectedSchoolId(school.id);
                    setCurrentTeacher(teacher);
                    setUserRole(UserRole.Teacher);
                    userFound = true;
                    break;
                }
                let foundPrincipal: Principal | null = null;
                let principalAccessibleStages: EducationalStage[] = [];
                for (const stageStr in school.principals) {
                    const stage = stageStr as EducationalStage;
                    const principalInStage = school.principals[stage]?.find((p: Principal) => p.loginCode === code);
                    if(principalInStage) {
                        foundPrincipal = principalInStage;
                        principalAccessibleStages.push(stage);
                    }
                }
                if (foundPrincipal) {
                    setSelectedSchoolId(school.id);
                    setPrincipalStages(principalAccessibleStages);
                    setUserRole(UserRole.Principal);
                    userFound = true;
                    break;
                }
            }
            if (!userFound) {
                 console.warn(`No role found for code: ${code}. Logging out.`);
                 handleLogout(true);
            }
        }
    } catch (error: any) {
        console.error("Fatal error during data fetch:", error);
        setFatalError(`Failed to load application data: ${error.message}`);
        handleLogout(true);
    } finally {
        setIsLoading(false);
    }
  }, [session, handleLogout, navigateTo]);

  const handleLogin = useCallback(async (code: string) => {
    // Check if the user is the Super Admin based on the login code.
    const isSuperAdmin = code.toLowerCase() === SUPER_ADMIN_CODE.toLowerCase();
    
    // Construct the email based on the user type.
    const email = isSuperAdmin
        ? SUPER_ADMIN_EMAIL
        : `${code}@school-app.com`;
    
    // For all users, the code they enter in the form is their password.
    // The Super Admin's password must be set to match SUPER_ADMIN_CODE in the Supabase dashboard.
    const password = code;
    
    const { error } = await (supabase.auth as any).signInWithPassword({ email, password });
    if (error) {
        throw error;
    }
  }, []);

  useEffect(() => {
    (supabase.auth as any).getSession().then(({ data: { session } }: { data: { session: Session | null }}) => {
      setSession(session)
    });

    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
      if (_event === "SIGNED_OUT") {
          handleLogout();
      }
    });

    return () => subscription?.unsubscribe();
  }, [handleLogout]);

  useEffect(() => {
    if (session) {
      fetchUserData();
    } else if (!isSupabaseConfigured) {
        // In mock mode, fetch data even without a session to show login screen
        fetchUserData();
    } else {
      setIsLoading(false);
      setSchools([]);
    }
  }, [session, fetchUserData]);
  
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('isDarkMode');
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
        const newIsDarkMode = !prev;
        if (newIsDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('isDarkMode', String(newIsDarkMode));
        return newIsDarkMode;
    });
  }, []);

  const showFeedbackModal = useCallback(() => {
    const lastShown = localStorage.getItem('feedbackLastShown');
    const now = new Date().getTime();
    // Show feedback modal once a week
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    if (!lastShown || now - Number(lastShown) > oneWeek) {
        setIsFeedbackModalOpen(true);
        localStorage.setItem('feedbackLastShown', String(now));
    }
  }, []);

  useEffect(() => {
    if(session && userRole && userRole !== UserRole.SuperAdmin) {
        const timer = setTimeout(showFeedbackModal, 60000); // 1 minute after login
        return () => clearTimeout(timer);
    }
  }, [session, userRole, showFeedbackModal]);

  const handleOpenConfirmModal = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModalContent({ title, message, onConfirm });
    setIsConfirmModalOpen(true);
  };

  // #endregion

  // #region RENDER LOGIC
  if (!isSupabaseConfigured && !((import.meta as any).env.PROD === false)) {
    return <ConfigErrorScreen />;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400">Loading...</div>;
  }
  
  if (fatalError) {
    return <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-500 p-4">{fatalError}</div>;
  }
  
  if (!session && isSupabaseConfigured) {
      return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
            <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        </div>
      );
  }

  if (selectedSchool && !selectedSchool.isActive && userRole !== UserRole.SuperAdmin) {
      return (
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
              <MaintenanceScreen onLogout={handleLogout} />
          </div>
      );
  }
  
  const renderPage = () => {
    switch (currentPage) {
        case Page.UnifiedLogin:
             return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
        
        // Super Admin Pages
        case Page.SuperAdminDashboard:
            return <SuperAdminDashboard 
                schools={schools}
                onAddSchool={async (name, principalCode, logoUrl) => {
                    const { data: signUpData, error: signUpError } = await (supabase.auth as any).signUp({ email: `${principalCode}@school-app.com`, password: principalCode });
                    if (signUpError && signUpError.message !== 'User already registered') { alert(signUpError.message); return; }

                    const { data: schoolData, error: schoolError } = await supabase.from('schools').insert(camelToSnakeCase({
                        name,
                        logoUrl,
                        principals: {},
                        isActive: true,
                        stages: [EducationalStage.PRE_SCHOOL, EducationalStage.PRIMARY, EducationalStage.MIDDLE, EducationalStage.HIGH],
                        featureFlags: ALL_FEATURES_ENABLED,
                    })).select();
                    if(schoolError) { alert(schoolError.message); return; }

                    const schoolId = schoolData[0].id;
                    const { error: principalError } = await supabase.from('principals').insert(camelToSnakeCase({ name: `مدير ${name}`, loginCode: principalCode, stage: EducationalStage.PRIMARY, schoolId }));
                    if(principalError) { alert(principalError.message); } else { await fetchUserData(); }
                }}
                onDeleteSchool={(schoolId, schoolName) => handleOpenConfirmModal(
                    t('confirmDeleteSchool', { schoolName }),
                    ``,
                    async () => {
                        await supabase.from('schools').delete().match({ id: schoolId });
                        await fetchUserData();
                    }
                )}
                onManageSchool={(schoolId) => {
                    setSchoolForSuperAdminViewId(schoolId);
                    navigateTo(Page.SuperAdminSchoolManagement);
                }}
                onNavigate={navigateTo}
                onLogout={handleLogout}
            />;
        case Page.SuperAdminSchoolManagement:
             return <SuperAdminSchoolManagement 
                school={selectedSchool!}
                toggleDarkMode={toggleDarkMode}
                isDarkMode={isDarkMode}
                onBack={handleBack}
                onLogout={handleLogout}
                onUpdateSchoolDetails={async (schoolId, name, logoUrl) => {
                    const { error } = await supabase.from('schools').update(camelToSnakeCase({ name, logoUrl })).match({ id: schoolId });
                    if (error) alert(error.message); else await fetchUserData();
                }}
                onToggleStatus={async () => {
                    const { error } = await supabase.from('schools').update({ is_active: !selectedSchool!.isActive }).match({ id: selectedSchool!.id });
                    if (error) alert(error.message); else await fetchUserData();
                }}
                onToggleStage={async (stage) => {
                    const currentStages = selectedSchool!.stages || [];
                    const newStages = currentStages.includes(stage)
                        ? currentStages.filter(s => s !== stage)
                        : [...currentStages, stage];
                    const { error } = await supabase.from('schools').update({ stages: newStages }).match({ id: selectedSchool!.id });
                    if (error) alert(error.message); else await fetchUserData();
                }}
                onToggleFeatureFlag={async (feature) => {
                    const currentFlags = selectedSchool!.featureFlags || {};
                    const newFlags = { ...currentFlags, [feature]: !currentFlags[feature] };
                    const { error } = await supabase.from('schools').update({ feature_flags: newFlags }).match({ id: selectedSchool!.id });
                    if (error) alert(error.message); else await fetchUserData();
                }}
                onAddPrincipal={async (stage, name, loginCode) => {
                    const { data: signUpData, error: signUpError } = await (supabase.auth as any).signUp({ email: `${loginCode}@school-app.com`, password: loginCode });
                    if (signUpError && signUpError.message !== 'User already registered') { alert(signUpError.message); return; }

                    const { error } = await supabase.from('principals').insert(camelToSnakeCase({ name, loginCode, stage, schoolId: selectedSchool!.id }));
                    if (error) alert(error.message); else await fetchUserData();
                }}
                onDeletePrincipal={async (stage, principalId, principalName) => handleOpenConfirmModal(
                    t('confirmDeletePrincipal', { name: principalName }),
                    ``,
                    async () => {
                        const { error } = await supabase.from('principals').delete().match({ id: principalId });
                        if (error) alert(error.message); else await fetchUserData();
                    }
                )}
                onUpdatePrincipalCode={async (stage, principalId, newCode) => { /* Logic to update user password in Supabase Auth */ }}
                onEnterFeaturePage={(page, stage) => {
                    setIsSuperAdminImpersonating(true);
                    setSelectedStage(stage);
                    navigateTo(page);
                }}
            />;
         case Page.SuperAdminFeedbackAnalysis:
            return <SuperAdminFeedbackAnalysis
                schools={schools}
                onBack={handleBack}
                onLogout={handleLogout}
                onAnalyze={async () => {
                    if (!aiRef.current) throw new Error("AI Client not initialized.");
                    const feedbackText = schools.flatMap(s => s.feedback).map(f => `Rating: ${f.rating}, Comment: ${f.comments}, Role: ${f.userRole}`).join('\n---\n');
                    const prompt = `Analyze the following user feedback for a school app. Identify common themes, summarize positive and negative points, and provide actionable suggestions for improvement. The feedback is:\n${feedbackText}`;
                    const response = await aiRef.current.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [{ text: prompt }] } });
                    return response.text;
                }}
            />;
            
        // Guardian Pages
        case Page.GuardianDashboard:
            return <GuardianDashboard 
                student={currentStudent!} 
                school={selectedSchool!}
                onSelectSubject={(subject) => {
                    setSelectedSubject(subject);
                    navigateTo(Page.GuardianSubjectMenu);
                }}
                onLogout={handleLogout}
                navigateTo={navigateTo}
                notifications={selectedSchool!.notifications}
                toggleDarkMode={toggleDarkMode}
                isDarkMode={isDarkMode}
            />;
        case Page.GuardianSubjectMenu:
            return <GuardianSubjectMenu 
                subject={selectedSubject!}
                school={selectedSchool!}
                studentLevel={currentStudent!.level}
                onSelectAction={navigateTo}
                onBack={handleBack}
                onLogout={handleLogout}
                toggleDarkMode={toggleDarkMode}
                isDarkMode={isDarkMode}
            />;
        
        // ... all other pages
        
        default:
            if (!session && !isSupabaseConfigured) { // Allow mock mode to show login
                 return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            }
            // Fallback for any unhandled page or state
            return <div className="text-center">
                <h1 className="text-xl font-bold dark:text-white">Page Not Found or User Role Unidentified</h1>
                <p className="dark:text-gray-300">Current Role: {userRole}</p>
                <p className="dark:text-gray-300">Current Page: {currentPage}</p>
                <button onClick={() => handleLogout()} className="mt-4 bg-red-500 text-white p-2 rounded">Logout</button>
            </div>;
    }
  };

  const mainContent = (
      <main className={`w-full max-w-7xl mx-auto transition-all duration-300 ${!session ? 'flex items-center justify-center h-full' : (isDesktop ? '' : 'pt-24')}`}>
        {renderPage()}
      </main>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gray-100 dark:bg-gray-900 flex items-center p-4 font-sans transition-colors duration-300 relative`}>
        {session && selectedSchool && userRole !== UserRole.SuperAdmin && !isDesktop &&
            <SearchHeader 
                schoolName={selectedSchool.name}
                query={searchQuery}
                onQueryChange={handleSearchChange}
                isSearching={isSearching}
                results={searchResults}
                onResultClick={handleResultClick}
            />
        }
        {mainContent}
        {isFeedbackModalOpen && selectedSchoolId && (
            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                onSubmit={async (rating, comments) => {
                    await supabase.from('feedback').insert(camelToSnakeCase({ userRole, schoolId: selectedSchoolId, rating, comments, date: new Date() }));
                    setIsFeedbackModalOpen(false);
                }}
            />
        )}
        {selectedResult && (
            <SearchResultModal result={selectedResult} onClose={() => setSelectedResult(null)} isDarkMode={isDarkMode} />
        )}
        <ConfirmationModal
            isOpen={isConfirmModalOpen}
            title={confirmModalContent.title}
            message={confirmModalContent.message}
            onConfirm={() => {
                confirmModalContent.onConfirm();
                setIsConfirmModalOpen(false);
            }}
            onCancel={() => setIsConfirmModalOpen(false)}
        />
    </div>
  );
  // #endregion
}