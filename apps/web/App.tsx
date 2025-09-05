import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Page, UserRole, School, Student, Teacher, Principal, Subject, EducationalStage, Note, Announcement, Complaint, EducationalTip, MonthlyFeePayment, InterviewRequest, Summary, Exercise, ExamProgram, Notification, SupplementaryLesson, Timetable, Quiz, Project, LibraryItem, AlbumPhoto, PersonalizedExercise, UnifiedAssessment, TalkingCard, MemorizationItem, Feedback, Expense, SearchResult, SchoolFeature } from '../../packages/core/types';
import { supabase, isSupabaseConfigured } from '../../packages/core/supabaseClient';
import { SUPER_ADMIN_LOGIN_CODE, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, MOCK_SCHOOLS, ALL_FEATURES_ENABLED } from '../../packages/core/constants';
import { useTranslation } from '../../packages/core/i18n';
import { snakeToCamelCase, camelToSnakeCase } from '../../packages/core/utils';

// Screen Imports
import UnifiedLoginScreen from './components/screens/UnifiedLoginScreen';
import SuperAdminDashboard from './components/screens/SuperAdminDashboard';
import SuperAdminSchoolManagement from './components/screens/SuperAdminSchoolManagement';
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
import PrincipalInsightsDashboard from './components/screens/PrincipalInsightsDashboard';
import TeacherManageAlbum from './components/screens/TeacherManageAlbum';
import GuardianViewAlbum from './components/screens/GuardianViewAlbum';
import PrincipalReviewAlbum from './components/screens/PrincipalReviewAlbum';
import TeacherAddUnifiedAssessment from './components/screens/TeacherAddUnifiedAssessment';
import GuardianViewUnifiedAssessments from './components/screens/GuardianViewUnifiedAssessments';
import TeacherViewAnnouncements from './components/screens/TeacherViewAnnouncements';
import TeacherManageTalkingCards from './components/screens/TeacherManageTalkingCards';
import GuardianViewTalkingCards from './components/screens/GuardianViewTalkingCards';
import TeacherManageMemorization from './components/screens/TeacherManageMemorization';
import GuardianViewMemorization from './components/screens/GuardianViewMemorization';
import PrincipalFinancialDashboard from './components/screens/PrincipalFinancialDashboard';
import SuperAdminFeedbackAnalysis from './components/screens/SuperAdminFeedbackAnalysis';
import FeedbackModal from './components/FeedbackModal';
import SearchHeader from './components/common/SearchHeader';
import SearchResultModal from './components/common/SearchResultModal';
import ConfirmationModal from './components/common/ConfirmationModal';

const App: React.FC = () => {
  // Global State
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any | null>(null);
  const [page, setPage] = useState<Page>(Page.UnifiedLogin);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<Student | Teacher | Principal | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [schools, setSchools] = useState<School[]>([]); // For SuperAdmin
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Navigation State
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStage, setSelectedStage] = useState<EducationalStage | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult | null>(null);

  // Confirmation Modal State
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const { t } = useTranslation();

  const processSchoolData = useCallback((schoolData: any): any => {
    if (!schoolData) return null;
    if (Array.isArray(schoolData)) {
        return schoolData.map(s => processSchoolData(s));
    }

    const camelSchool = snakeToCamelCase(schoolData);
    if (camelSchool.principals && Array.isArray(camelSchool.principals)) {
        camelSchool.principals = camelSchool.principals.reduce((acc: { [key in EducationalStage]?: Principal[] }, principal: Principal) => {
            const stage = principal.stage;
            if (!acc[stage]) {
                acc[stage] = [];
            }
            acc[stage]!.push(principal);
            return acc;
        }, {});
    }
    return camelSchool;
  }, []);

  const refreshSchoolState = useCallback(async (schoolId: string) => {
    const { data: refreshedSchool, error: refreshError } = await supabase.from('schools').select('*, principals(*)').eq('id', schoolId).single();
    if (refreshError) throw refreshError;
    setSchool(processSchoolData(refreshedSchool));

    const { data: allSchools, error: allSchoolsError } = await supabase.from('schools').select('id, name, logo_url, is_active, stages, feature_flags, principals:principals(id, name, login_code, stage)');
    if (allSchoolsError) throw allSchoolsError;
    setSchools(processSchoolData(allSchools));
  }, [processSchoolData]);


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  const navigateTo = (newPage: Page, state?: any) => {
    setPage(newPage);
    if (state?.isImpersonating) {
      setIsImpersonating(true);
    }
    if(state?.selectedStage) {
      setSelectedStage(state.selectedStage);
    }
  };

  const handleBack = () => {
    // A simplified back logic, can be improved with a history stack
    switch (page) {
      case Page.GuardianSubjectMenu: setPage(Page.GuardianDashboard); break;
      case Page.GuardianViewSummaries:
      case Page.GuardianViewExercises:
      case Page.GuardianViewNotes:
      case Page.GuardianViewGrades:
        setPage(Page.GuardianSubjectMenu);
        break;
      case Page.TeacherClassSelection: setPage(Page.TeacherDashboard); break;
      case Page.TeacherActionMenu: setPage(isImpersonating ? Page.PrincipalBrowseAsTeacherSelection : Page.TeacherDashboard); break;
      case Page.TeacherManageSummaries:
      case Page.TeacherManageExercises:
      case Page.TeacherManageNotes:
      case Page.TeacherStudentSelection:
        setPage(Page.TeacherActionMenu);
        break;
      case Page.TeacherStudentGrades: setPage(Page.TeacherStudentSelection); break;
      case Page.PrincipalDashboard: setPage(isImpersonating ? Page.SuperAdminSchoolManagement : Page.PrincipalStageSelection); break;
      case Page.PrincipalManageTeachers:
      case Page.PrincipalManageStudents:
      case Page.PrincipalManagementMenu:
        setPage(Page.PrincipalDashboard);
        break;
      case Page.SuperAdminSchoolManagement: setPage(Page.SuperAdminDashboard); break;
      default: setPage(Page.UnifiedLogin); // Fallback
    }
     if (isImpersonating && page === Page.TeacherDashboard) {
      setIsImpersonating(false);
      setPage(Page.PrincipalDashboard);
    }
  };
  
  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmation({ isOpen: true, title, message, onConfirm });
  };


  useEffect(() => {
    if (!isSupabaseConfigured && process.env.NODE_ENV !== 'production') {
      setSchools(MOCK_SCHOOLS);
      setIsLoading(false);
    } else {
       const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          if (!session) {
            setIsLoading(false);
            setPage(Page.UnifiedLogin);
            setCurrentUser(null);
            setSchool(null);
            setUserRole(null);
          }
      });
      setIsLoading(false);
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogin = useCallback(async (rawCode: string) => {
    const code = rawCode.trim().toLowerCase();
    if (code === SUPER_ADMIN_LOGIN_CODE.toLowerCase()) {
        const { error } = await supabase.auth.signInWithPassword({
            email: SUPER_ADMIN_EMAIL,
            password: SUPER_ADMIN_PASSWORD,
        });
        if (error) throw error;
        setUserRole(UserRole.SuperAdmin);
        setPage(Page.SuperAdminDashboard);
        const { data, error: schoolError } = await supabase.from('schools').select('id, name, logo_url, is_active, stages, feature_flags, principals:principals(id, name, login_code, stage)');
        if(schoolError) throw schoolError;
        setSchools(processSchoolData(data));
    } else {
        // Search for user across all roles
        let userMatch: { user: any, role: UserRole, schoolId: string } | null = null;
        const tables = ['students', 'teachers', 'principals'];
        for (const table of tables) {
            const codeColumn = table === 'students' ? 'guardian_code' : 'login_code';
            const { data, error } = await supabase.from(table).select('*, school_id').eq(codeColumn, code).limit(1).maybeSingle();
            if (error) console.error(`Error searching in ${table}`, error);
            if (data) {
                userMatch = { 
                    user: data, 
                    role: table === 'students' ? UserRole.Guardian : table === 'teachers' ? UserRole.Teacher : UserRole.Principal,
                    schoolId: data.school_id
                };
                break;
            }
        }
        
        if (userMatch) {
            const email = `${code}@${userMatch.schoolId}.com`;
            // FIX: Updated the password generation logic again for increased complexity to satisfy
            // stricter cloud authentication policies. This ensures that even simple numeric login codes
            // result in a strong password, preventing sign-up failures on the first login attempt.
            const password = `ImtiazApp_${code}_S3cure!`;
            
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

            if (signInError && signInError.message.includes('Invalid login credentials')) {
                const { error: signUpError } = await supabase.auth.signUp({ email, password });
                if (signUpError && !signUpError.message.includes('User already registered')) {
                    throw signUpError;
                }
                const { error: retrySignInError } = await supabase.auth.signInWithPassword({ email, password });
                if (retrySignInError) throw retrySignInError;
            } else if (signInError) {
                throw signInError;
            }

            // Fetch school data
            const { data: schoolData, error: schoolError } = await supabase
                .from('schools')
                .select(`*, students(*), teachers(*), principals(*)`)
                .eq('id', userMatch.schoolId)
                .single();
            if (schoolError) throw schoolError;
            
            const fullSchoolData = processSchoolData(schoolData);

            if(!fullSchoolData.isActive) {
                await supabase.auth.signOut();
                setPage(Page.Maintenance);
                return;
            }
            
            setUserRole(userMatch.role);
            setCurrentUser(snakeToCamelCase(userMatch.user));
            setSchool(fullSchoolData);

            switch (userMatch.role) {
                case UserRole.Guardian: setPage(Page.GuardianDashboard); break;
                case UserRole.Teacher: setPage(Page.TeacherDashboard); break;
                case UserRole.Principal: setPage(Page.PrincipalStageSelection); break;
            }
             setTimeout(() => setShowFeedbackModal(true), 30000);
        } else {
            throw new Error(t('invalidCode'));
        }
    }
  }, [t, processSchoolData]);
  
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setCurrentUser(null);
    setSchool(null);
    setUserRole(null);
    setPage(Page.UnifiedLogin);
    setIsImpersonating(false);
  }, []);
  
  const handleAddSchool = async (name: string, principalCode: string, logo: string) => {
    if (!name || !principalCode) {
      alert(t('enterSchoolNameAndCode'));
      return;
    }
    try {
      setIsLoading(true);
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name,
          logo_url: logo || null,
          is_active: true,
          stages: [EducationalStage.PRIMARY, EducationalStage.MIDDLE, EducationalStage.HIGH, EducationalStage.PRE_SCHOOL],
          feature_flags: ALL_FEATURES_ENABLED,
        })
        .select()
        .single();

      if (schoolError) throw schoolError;
      if (!schoolData) throw new Error("School creation failed.");

      const newSchoolId = schoolData.id;

      const { error: principalError } = await supabase
        .from('principals')
        .insert({
          name: `${t('principal')} ${t('primaryStage')}`,
          login_code: principalCode.trim().toLowerCase(),
          stage: EducationalStage.PRIMARY,
          school_id: newSchoolId,
        });
      
      if (principalError) {
        await supabase.from('schools').delete().match({ id: newSchoolId });
        throw principalError;
      }

      const { data, error: refreshError } = await supabase.from('schools').select('id, name, logo_url, is_active, stages, feature_flags, principals:principals(id, name, login_code, stage)');
      if (refreshError) throw refreshError;
      setSchools(processSchoolData(data));

    } catch (error: any) {
      console.error("Error adding school:", error);
      alert(`${t('failedToAddSchool')}: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteSchool = (schoolId: string, schoolName: string) => {
    showConfirmation(
        t('confirmDeleteSchool', { schoolName }),
        '',
        async () => {
            try {
                setIsLoading(true);
                const { error } = await supabase.from('schools').delete().match({ id: schoolId });
                if (error) throw error;
                setSchools(prev => prev.filter(s => s.id !== schoolId));
            } catch (error: any) {
                alert(`${t('failedToDeleteSchool')}: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    );
  };
  
   const handleAddPrincipal = async (stage: EducationalStage, name: string, loginCode: string) => {
    if (!school) return;
    try {
        setIsLoading(true);
        const lowerLoginCode = loginCode.trim().toLowerCase();
        // Comprehensive check for code uniqueness within the school
        const tables = [
            { name: 'principals', codeCol: 'login_code' },
            { name: 'teachers', codeCol: 'login_code' },
            { name: 'students', codeCol: 'guardian_code' }
        ];
        for (const table of tables) {
            const { data: existing, error: checkError } = await supabase
                .from(table.name)
                .select('id')
                .eq('school_id', school.id)
                .eq(table.codeCol, lowerLoginCode)
                .limit(1);
            if (checkError) throw checkError;
            if (existing && existing.length > 0) {
                throw new Error(t('principalCodeExists'));
            }
        }

        const { error } = await supabase.from('principals').insert({
            school_id: school.id,
            stage,
            name,
            login_code: lowerLoginCode
        });
        if (error) throw error;
        
        await refreshSchoolState(school.id);

    } catch (error: any) {
        if (error.message && (error.message.includes('duplicate key value') || error.message === t('principalCodeExists'))) {
            alert(t('principalCodeExists'));
        } else {
            alert(`${t('failedToAddPrincipal')}: ${error.message}`);
        }
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeletePrincipal = (stage: EducationalStage, principalId: string, principalName: string) => {
    if (!school) return;
    showConfirmation(
        t('confirmDeletePrincipal', { name: principalName }), '',
        async () => {
            try {
                setIsLoading(true);
                const { error } = await supabase.from('principals').delete().match({ id: principalId });
                if (error) throw error;
                await refreshSchoolState(school.id);
            } catch (error: any) {
                alert(`${t('failedToDeletePrincipal')}: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    );
  };
  
  const handleUpdatePrincipalCode = async (stage: EducationalStage, principalId: string, newCode: string) => {
      if (!school) return;
      try {
          setIsLoading(true);
          const lowerNewCode = newCode.trim().toLowerCase();
          const tables = [
            { name: 'principals', codeCol: 'login_code' },
            { name: 'teachers', codeCol: 'login_code' },
            { name: 'students', codeCol: 'guardian_code' }
          ];

          for (const table of tables) {
              let query = supabase.from(table.name).select('id').eq('school_id', school.id).eq(table.codeCol, lowerNewCode);
              if (table.name === 'principals') {
                  query = query.neq('id', principalId);
              }
              const { data: existing, error: checkError } = await query.limit(1);

              if (checkError) throw checkError;
              if (existing && existing.length > 0) {
                  throw new Error(t('principalCodeExists'));
              }
          }

          const { error: updateError } = await supabase.from('principals').update({ login_code: lowerNewCode }).match({ id: principalId });
          if (updateError) throw updateError;
          await refreshSchoolState(school.id);
      } catch (error: any) {
          if (error.message && (error.message.includes('duplicate key value') || error.message === t('principalCodeExists'))) {
            alert(t('principalCodeExists'));
          } else {
            alert(`${t('failedToUpdateCode')}: ${error.message}`);
          }
      } finally {
          setIsLoading(false);
      }
  };

  const handleToggleStage = async (stage: EducationalStage) => {
    if (!school) return;
    try {
        setIsLoading(true);
        const currentStages = school.stages || [];
        const newStages = currentStages.includes(stage)
            ? currentStages.filter(s => s !== stage)
            : [...currentStages, stage];

        const { error } = await supabase
            .from('schools')
            .update({ stages: newStages })
            .eq('id', school.id);
        if (error) throw error;
        await refreshSchoolState(school.id);
    } catch (error: any) {
        alert(`Failed to update stages: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleToggleSchoolStatus = async () => {
    if (!school) return;
    try {
        setIsLoading(true);
        const newStatus = !school.isActive;
        const { error } = await supabase
            .from('schools')
            .update({ is_active: newStatus })
            .eq('id', school.id);
        if (error) throw error;
        await refreshSchoolState(school.id);
    } catch (error: any) {
        alert(`Failed to update school status: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleToggleFeatureFlag = async (feature: SchoolFeature) => {
    if (!school) return;
    try {
        setIsLoading(true);
        const currentFlags = school.featureFlags || {};
        const newFlags = { ...currentFlags, [feature]: !currentFlags[feature] };
        
        const { error } = await supabase
            .from('schools')
            .update({ feature_flags: newFlags })
            .eq('id', school.id);
        if (error) throw error;
        await refreshSchoolState(school.id);
    } catch (error: any) {
        alert(`Failed to update feature flag: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleUpdateSchoolDetails = async (schoolId: string, name: string, logoUrl: string) => {
    try {
        setIsLoading(true);
        const { error } = await supabase
            .from('schools')
            .update({ name: name, logo_url: logoUrl })
            .eq('id', schoolId);
        if (error) throw error;
        await refreshSchoolState(schoolId);
    } catch (error: any) {
        alert(`Failed to update school details: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };


  const renderPage = () => {
    if (!session && userRole !== UserRole.SuperAdmin && page !== Page.Maintenance) {
      if (isSupabaseConfigured || process.env.NODE_ENV !== 'production') {
        return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
      }
    }

    switch (page) {
        case Page.UnifiedLogin:
             return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
        case Page.SuperAdminDashboard:
            return <SuperAdminDashboard schools={schools} onAddSchool={handleAddSchool} onDeleteSchool={handleDeleteSchool} onManageSchool={(id) => { const s = schools.find(sc=>sc.id===id); if(s) { setSchool(s); setPage(Page.SuperAdminSchoolManagement); } }} onLogout={handleLogout} onNavigate={navigateTo}/>
        case Page.SuperAdminSchoolManagement:
            if (!school) return null;
            return <SuperAdminSchoolManagement 
                school={school} 
                onBack={() => setPage(Page.SuperAdminDashboard)} 
                onLogout={handleLogout} 
                toggleDarkMode={toggleDarkMode} 
                isDarkMode={isDarkMode} 
                onToggleStatus={handleToggleSchoolStatus} 
                onToggleStage={handleToggleStage} 
                onAddPrincipal={handleAddPrincipal} 
                onDeletePrincipal={handleDeletePrincipal} 
                onUpdatePrincipalCode={handleUpdatePrincipalCode} 
                onToggleFeatureFlag={handleToggleFeatureFlag} 
                onEnterFeaturePage={(p, s) => { setSelectedStage(s); setPage(p); setIsImpersonating(true); }} 
                onUpdateSchoolDetails={handleUpdateSchoolDetails} 
            />;
        case Page.PrincipalStageSelection: {
            if (!school || !currentUser) return null;
            const principal = currentUser as Principal;

            let accessibleStages: EducationalStage[] = [];
            if (school.principals) {
                if (Array.isArray(school.principals)) {
                    accessibleStages = school.principals
                        .filter(p => p && p.id === principal.id)
                        .map(p => p.stage);
                } else if (typeof school.principals === 'object') {
                    accessibleStages = Object.entries(school.principals)
                        .filter(([_, principalList]) => 
                            Array.isArray(principalList) && principalList.some(p => p && p.id === principal.id)
                        )
                        .map(([stageKey]) => stageKey as EducationalStage);
                }
            }

            return <PrincipalStageSelection school={school} accessibleStages={[...new Set(accessibleStages)]} onSelectStage={(s) => {setSelectedStage(s); setPage(Page.PrincipalDashboard)}} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onBack={handleBack}/>
        }
        case Page.PrincipalDashboard:
            if (!school || !selectedStage) return null;
            return <PrincipalDashboard school={school} stage={selectedStage} onSelectAction={(p) => navigateTo(p)} onLogout={handleLogout} onBack={() => setPage(Page.PrincipalStageSelection)} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        case Page.GuardianDashboard:
            if (!school || !currentUser) return null;
            return <GuardianDashboard student={currentUser as Student} school={school} notifications={school.notifications || []} onSelectSubject={(s) => {setSelectedSubject(s); setPage(Page.GuardianSubjectMenu)}} onLogout={handleLogout} navigateTo={navigateTo} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
        case Page.GuardianSubjectMenu:
             if (!school || !currentUser || !selectedSubject) return null;
             return <GuardianSubjectMenu school={school} studentLevel={(currentUser as Student).level} subject={selectedSubject} onSelectAction={(p) => setPage(p)} onBack={() => setPage(Page.GuardianDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>
        case Page.TeacherDashboard:
             if (!school || !currentUser) return null;
             return <TeacherDashboard school={school} teacher={currentUser as Teacher} onSelectionComplete={(level, subject) => {setSelectedLevel(level); setSelectedSubject(subject); setPage(Page.TeacherActionMenu)}} onBack={() => isImpersonating ? setPage(Page.PrincipalDashboard) : handleLogout()} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} isImpersonating={isImpersonating}/>
        case Page.TeacherActionMenu:
              if (!school || !currentUser || !selectedLevel || !selectedSubject) return null;
              return <TeacherActionMenu school={school} selectedLevel={selectedLevel} onSelectAction={(p) => setPage(p)} onBack={() => setPage(Page.TeacherDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>
        // FIX: Replaced non-existent Page.GuardianViewContent with correct pages for summaries and exercises.
        case Page.GuardianViewSummaries:
            if (!school || !currentUser || !selectedSubject) return null;
            return <GuardianViewContent school={school} student={currentUser as Student} subject={selectedSubject} type="summaries" onBack={() => setPage(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
        case Page.GuardianViewExercises:
            if (!school || !currentUser || !selectedSubject) return null;
            return <GuardianViewContent school={school} student={currentUser as Student} subject={selectedSubject} type="exercises" onBack={() => setPage(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
        case Page.Maintenance:
            return <MaintenanceScreen onLogout={handleLogout} />;
        default:
            return <div>Page not found</div>;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isSupabaseConfigured && process.env.NODE_ENV === 'production') {
      return <ConfigErrorScreen />;
  }

  const isUserLoggedIn = userRole && userRole !== UserRole.SuperAdmin && school;

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark' : ''}`}>
        {isUserLoggedIn && (
            <SearchHeader schoolName={school.name} query={searchQuery} onQueryChange={setSearchQuery} isSearching={isSearching} results={searchResults} onResultClick={setSelectedSearchResult} />
        )}
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 pt-24 sm:pt-4">
            {renderPage()}
        </div>
        {showFeedbackModal && (
            <FeedbackModal 
                isOpen={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
                onSubmit={(rating, comments) => { /* ... */ }}
            />
        )}
        {selectedSearchResult && (
            <SearchResultModal result={selectedSearchResult} onClose={() => setSelectedSearchResult(null)} isDarkMode={isDarkMode} />
        )}
        {confirmation && (
            <ConfirmationModal
                isOpen={confirmation.isOpen}
                title={confirmation.title}
                message={confirmation.message}
                onConfirm={confirmation.onConfirm}
                onCancel={() => setConfirmation(null)}
            />
        )}
    </div>
  );
};

export default App;