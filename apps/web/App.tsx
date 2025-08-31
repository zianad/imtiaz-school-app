import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { Session } from '@supabase/supabase-js';
import { Page, UserRole, Subject, Summary, Exercise, Note, ExamProgram, Student, Grade, Absence, Notification, School, Teacher, Announcement, Complaint, EducationalTip, Language, SchoolFeature, MonthlyFeePayment, InterviewRequest, SupplementaryLesson, Timetable, Quiz, Project, LibraryItem, PersonalizedExercise, AlbumPhoto, UnifiedAssessment, EducationalStage, Hotspot, TalkingCard, MemorizationItem, Principal, Expense, Feedback, Question, SearchResult, SearchResultType, SearchableContent } from '../../packages/core/types';
import { getBlankGrades, SUPER_ADMIN_CODE, ALL_FEATURES_ENABLED } from '../../packages/core/constants';
import { useTranslation } from '../../packages/core/i18n';
import { snakeToCamelCase, camelToSnakeCase, getStageForLevel, useWindowSize, compressImage } from '../../packages/core/utils';
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
    if (process.env.API_KEY && isSupabaseConfigured) { // Only init AI if live
      aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
      console.warn("Gemini API key not set or in mock mode. AI features will be mocked.");
    }
  }, []);

  const activeSchoolId = isSuperAdminImpersonating ? schoolForSuperAdminViewId : selectedSchoolId;
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
    supabase.auth.signOut();
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
        const { data, error } = await supabase.from('schools').select(`
            *, principals(*), students(*, grades(*)), teachers(*), summaries(*), exercises(*), notes(*), absences(*), exam_programs(*), notifications(*), announcements(*), complaints(*), educational_tips(*), monthly_fee_payments(*), interview_requests(*), supplementary_lessons(*), timetables(*), quizzes(*), projects(*), library_items(*), album_photos(*), personalized_exercises(*), unified_assessments(*), talking_cards(*), memorization_items(*), expenses(*), feedback(*)
        `);

        if (error) throw error;
        
        let transformedSchools = data as any[];

        if (isSupabaseConfigured) {
          const camelCaseSchools: any[] = snakeToCamelCase(data);
          transformedSchools = camelCaseSchools.map(school => {
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
                  students: (school.students || []).map((st: any) => ({
                      ...st,
                      grades: (st.grades || []).reduce((acc: any, g: Grade & { subject: Subject }) => {
                          if (g.subject) {
                              (acc[g.subject] = acc[g.subject] || []).push(g);
                          }
                          return acc;
                      }, {}),
                  })),
              };
          });
        }
        
        setSchools(transformedSchools as School[]);

        const email = session?.user?.email;
        if (!email) {
            handleLogout(true);
            return;
        }
        const code = email.startsWith(SUPER_ADMIN_CODE) ? SUPER_ADMIN_CODE : email.split('@')[0];
        
        let page: Page | null = null;
        let found = false;

        if (code === SUPER_ADMIN_CODE) {
            setUserRole(UserRole.SuperAdmin);
            page = Page.SuperAdminDashboard;
            found = true;
        } else {
            for (const school of transformedSchools) {
                const student = school.students.find((s: Student) => s.guardianCode === code);
                if (student) {
                    setSelectedSchoolId(school.id);
                    setCurrentStudent(student);
                    setUserRole(UserRole.Guardian);
                    page = Page.GuardianDashboard;
                    setSelectedStage(student.stage);
                    found = true;
                    break;
                }
                const teacher = school.teachers.find((t: Teacher) => t.loginCode === code);
                if (teacher) {
                    setSelectedSchoolId(school.id);
                    setCurrentTeacher(teacher);
                    setUserRole(UserRole.Teacher);
                    page = Page.TeacherDashboard;
                    found = true;
                    break;
                }
                let accessibleStages: EducationalStage[] = [];
                let foundPrincipal = false;
                for (const stageStr in school.principals) {
                    const stage = stageStr as EducationalStage;
                    if (school.principals[stage]?.some((p: Principal) => p.loginCode === code)) {
                        accessibleStages.push(stage);
                        foundPrincipal = true;
                    }
                }
                if (foundPrincipal) {
                    setSelectedSchoolId(school.id);
                    setUserRole(UserRole.Principal);
                    setPrincipalStages(accessibleStages);
                    page = Page.PrincipalStageSelection;
                    found = true;
                    break;
                }
            }
        }

        if (page && historyRef.current.length === 1 && historyRef.current[0] === Page.UnifiedLogin) {
            navigateTo(page);
        } else if (!found) {
            handleLogout(true);
            throw new Error(t('invalidCode'));
        }

    } catch (error: any) {
        console.error("Failed to fetch initial user data:", error);
        setFatalError(`Failed to fetch user data: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  }, [session, handleLogout, navigateTo, t]);
  
  const handleLogin = useCallback(async (code: string) => {
      let email, password;
      if (code === SUPER_ADMIN_CODE) {
          email = `${SUPER_ADMIN_CODE}@superadmin.com`;
          password = SUPER_ADMIN_CODE;
      } else {
          email = `${code}@school-app.com`;
          password = code;
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { throw error; }
      if (!data.session) { throw new Error('Login failed: No session returned'); }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchUserData();
    else setIsLoading(false);
  }, [session, fetchUserData]);
  // #endregion

  // #region Dark Mode
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  // #endregion
  
  // #region Confirmation Modal
  const openConfirmationModal = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModalContent({ title, message, onConfirm });
    setIsConfirmModalOpen(true);
  };
  // #endregion

  // #region Data Handlers (Hybrid)

  const handleGenericDelete = async (tableName: string, itemId: any, itemName: string) => {
    openConfirmationModal(
      `${t('delete')} ${itemName}`,
      t('confirmDeleteItem', { item: itemName }),
      async () => {
        try {
          const { error } = await supabase.from(tableName).delete().match({ id: itemId });
          if (error) throw error;
          await fetchUserData();
        } catch (error: any) {
          console.error(`Error deleting from ${tableName}:`, error);
          alert(`Error: ${error.message}`);
        }
      }
    );
  };
    
  // Super Admin Handlers
    const handleAddSchool = async (name: string, principalCode: string, logoUrl: string) => {
        try {
            if (isSupabaseConfigured) {
              const { data: schoolData, error: schoolError } = await supabase.from('schools').insert(camelToSnakeCase({ name, logoUrl, isActive: true, stages: Object.values(EducationalStage), featureFlags: ALL_FEATURES_ENABLED, monthlyFeeAmount: 0, transportationFee: 0, })).select().single();
              if (schoolError) throw schoolError;
              const schoolId = schoolData.id;
              
              const principalStagesData = Object.values(EducationalStage).map(stage => {
                  const code = stage === EducationalStage.PRIMARY ? principalCode : `${principalCode}_${stage.toLowerCase().substring(0,3)}`;
                  return { schoolId, stage, name: `${t('principal')} ${t(`${stage.toLowerCase()}Stage` as any)}`, loginCode: code, };
              });
              for(const principal of principalStagesData) {
                  const { error: signUpError } = await supabase.auth.signUp({ email: `${principal.loginCode}@school-app.com`, password: principal.loginCode, });
                  if (signUpError && !signUpError.message.includes('User already registered')) throw new Error(`Failed to create principal user for ${principal.stage}: ${signUpError.message}`);
              }
              const { error: principalError } = await supabase.from('principals').insert(camelToSnakeCase(principalStagesData));
              if (principalError) throw principalError;
            } else {
               await supabase.from('schools').insert({ name, logo_url: logoUrl, is_active: true, id: `school-${Date.now()}` });
               // Mock mode simplifies principal creation
            }
            await fetchUserData();
        } catch (error: any) {
            console.error("Error adding school:", error);
            alert(`Error: ${error.message}`);
        }
    };
    const handleUpdateSchoolDetails = async (schoolId: string, name: string, logoUrl: string) => {
      try {
        const { error } = await supabase.from('schools').update({ name, logo_url: logoUrl }).match({ id: schoolId });
        if (error) throw error;
        await fetchUserData();
      } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleDeleteSchool = (schoolId: string, schoolName: string) => handleGenericDelete('schools', schoolId, schoolName);
    const handleToggleSchoolStatus = async () => {
        if (!selectedSchool) return;
        try {
            const { error } = await supabase.from('schools').update({ is_active: !selectedSchool.isActive }).match({ id: activeSchoolId });
            if (error) throw error;
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleToggleStage = async (stage: EducationalStage) => {
        if (!selectedSchool) return;
        const newStages = selectedSchool.stages.includes(stage) ? selectedSchool.stages.filter(st => st !== stage) : [...selectedSchool.stages, stage];
        try {
            const { error } = await supabase.from('schools').update({ stages: newStages }).match({ id: activeSchoolId });
            if (error) throw error;
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleToggleFeatureFlag = async (feature: SchoolFeature) => {
        if (!selectedSchool) return;
        const newFlags = { ...selectedSchool.featureFlags, [feature]: !selectedSchool.featureFlags[feature] };
        try {
            const { error } = await supabase.from('schools').update({ feature_flags: newFlags }).match({ id: activeSchoolId });
            if (error) throw error;
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleAddPrincipal = async (stage: EducationalStage, name: string, loginCode: string) => {
        try {
            await supabase.auth.signUp({ email: `${loginCode}@school-app.com`, password: loginCode, });
            const { error } = await supabase.from('principals').insert(camelToSnakeCase({ name, loginCode, stage, schoolId: activeSchoolId }));
            if (error) throw error;
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleDeletePrincipal = (stage: EducationalStage, principalId: string, principalName: string) => handleGenericDelete('principals', principalId, principalName);
    const handleUpdatePrincipalCode = async (stage: EducationalStage, principalId: string, newCode: string) => {
        try {
            const { error } = await supabase.from('principals').update({ login_code: newCode }).match({ id: principalId });
            if (error) throw error;
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleManageSchool = (schoolId: string) => {
        setSchoolForSuperAdminViewId(schoolId);
        navigateTo(Page.SuperAdminSchoolManagement);
    };

    // Principal Handlers
    const handleAddTeacher = async (teacher: Omit<Teacher, 'id'>) => {
        try {
            await supabase.auth.signUp({ email: `${teacher.loginCode}@school-app.com`, password: teacher.loginCode, });
            const { error } = await supabase.from('teachers').insert(camelToSnakeCase({ ...teacher, schoolId: activeSchoolId }));
            if (error) throw error;
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleUpdateTeacher = async (updatedTeacher: Teacher) => {
        try {
            const { error } = await supabase.from('teachers').update(camelToSnakeCase(updatedTeacher)).match({ id: updatedTeacher.id });
            if (error) throw error;
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleDeleteTeacher = (teacherId: string, teacherName: string) => handleGenericDelete('teachers', teacherId, teacherName);
    const handleAddStudent = async (student: Omit<Student, 'id' | 'grades'>) => {
        try {
            await supabase.auth.signUp({ email: `${student.guardianCode}@school-app.com`, password: student.guardianCode, });
            const { error } = await supabase.from('students').insert(camelToSnakeCase({ ...student, schoolId: activeSchoolId }));
            if (error) throw error;
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleAddMultipleStudents = async (students: Omit<Student, 'id' | 'grades'>[]) => {
        try {
            for (const student of students) {
              await supabase.auth.signUp({ email: `${student.guardianCode}@school-app.com`, password: student.guardianCode, });
            }
            const studentsToAdd = students.map(s => camelToSnakeCase({ ...s, schoolId: activeSchoolId }));
            const { error } = await supabase.from('students').insert(studentsToAdd);
            if (error) throw error;
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleUpdateStudent = async (updatedStudent: Student) => {
        const { grades, ...studentData } = updatedStudent;
        try {
            const { error } = await supabase.from('students').update(camelToSnakeCase(studentData)).match({ id: studentData.id });
            if (error) throw error;
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleDeleteStudent = (studentId: string, studentName: string) => handleGenericDelete('students', studentId, studentName);
    const handleAddAnnouncement = async (ann: Omit<Announcement, 'id' | 'date'>) => {
        try {
            const { error } = await supabase.from('announcements').insert(camelToSnakeCase({ ...ann, date: new Date(), schoolId: activeSchoolId }));
            if (error) throw error;
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleAddEducationalTip = async (tip: Omit<EducationalTip, 'id' | 'date'>) => {
        try {
            const { error } = await supabase.from('educational_tips').insert(camelToSnakeCase({ ...tip, date: new Date(), schoolId: activeSchoolId }));
            if (error) throw error;
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleUpdateNoteStatus = async (noteId: number, status: 'approved' | 'rejected') => {
        try {
            if (status === 'approved') {
                await supabase.from('notes').update({ status }).match({ id: noteId });
                const noteToApprove = selectedSchool?.notes.find(n => n.id === noteId);
                if(noteToApprove) {
                    const newNotifications = noteToApprove.studentIds.map(studentId => ({ studentId, schoolId: activeSchoolId, message: t('notificationMessage', {subject: noteToApprove.subject}), date: new Date(), read: false, }));
                    await supabase.from('notifications').insert(camelToSnakeCase(newNotifications));
                }
            } else {
                await supabase.from('notes').delete().match({ id: noteId });
            }
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleUpdateAlbumPhotoStatus = async (photoId: number, status: 'approved' | 'rejected') => {
        try {
            if (status === 'approved') {
                await supabase.from('album_photos').update({ status }).match({ id: photoId });
            } else {
                await supabase.from('album_photos').delete().match({ id: photoId });
            }
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleMarkAsPaid = async (studentId: string) => {
        try {
            const now = new Date();
            const payment = { studentId, amount: selectedSchool?.monthlyFeeAmount || 0, date: new Date(), month: now.getMonth() + 1, year: now.getFullYear(), schoolId: activeSchoolId };
            await supabase.from('monthly_fee_payments').insert(camelToSnakeCase(payment));
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleMarkInterviewCompleted = async (requestId: number) => {
        try {
            await supabase.from('interview_requests').update({ status: 'completed' }).match({ id: requestId });
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleUpdateFees = async (monthlyFee: number, transportationFee: number) => {
        try {
            await supabase.from('schools').update({ monthly_fee_amount: monthlyFee, transportation_fee: transportationFee }).match({ id: activeSchoolId });
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleAddExpense = async (expense: Omit<Expense, 'id'|'type'|'teacherId'>) => {
        try {
            await supabase.from('expenses').insert(camelToSnakeCase({ ...expense, schoolId: activeSchoolId, type: 'manual' }));
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    
    // Helper for Teacher Handlers
    const handleGenericTeacherSave = async (tableName: string, data: any) => {
        try {
            const payload = { ...data, level: selectedLevel, class: selectedClass, subject: selectedSubject!, stage: selectedStage!, schoolId: activeSchoolId, date: new Date() };
            await supabase.from(tableName).insert(camelToSnakeCase(payload));
            await fetchUserData();
        } catch (error: any) { alert(`Error saving to ${tableName}: ${error.message}`); }
    };

    // Teacher Handlers
    const handleSaveSummary = (data: Omit<Summary, 'id'|'level'|'class'|'subject'|'stage'>) => handleGenericTeacherSave('summaries', data);
    const handleDeleteSummary = (item: Summary) => handleGenericDelete('summaries', item.id, item.title);
    const handleSaveExercise = (data: Omit<Exercise, 'id'|'level'|'class'|'subject'|'date'|'stage'>) => handleGenericTeacherSave('exercises', data);
    const handleDeleteExercise = (item: Exercise) => handleGenericDelete('exercises', item.id, `${t('exercise')} on ${item.date}`);
    const handleSaveNote = async (data: Omit<Note, 'id'|'level'|'class'|'subject'|'date'|'stage'|'status'>) => {
        try {
            const payload = { ...data, level: selectedLevel, class: selectedClass, subject: selectedSubject!, stage: selectedStage!, schoolId: activeSchoolId, date: new Date(), status: 'pending' };
            await supabase.from('notes').insert(camelToSnakeCase(payload));
            await fetchUserData();
        } catch (error: any) { alert(`Error saving note: ${error.message}`); }
    };
    const handleDeleteNote = (item: Note) => handleGenericDelete('notes', item.id, `${t('note')} for ${item.studentIds.length} students`);
    const handleMarkAbsent = async (studentIds: string[]) => {
        try {
            const newAbsences = studentIds.map(studentId => ({ studentId, date: new Date(), level: selectedLevel, class: selectedClass, subject: selectedSubject!, stage: selectedStage!, schoolId: activeSchoolId }));
            await supabase.from('absences').insert(camelToSnakeCase(newAbsences));
            await fetchUserData();
        } catch (error: any) { alert(`Error marking absent: ${error.message}`); }
    };
    const handleDeleteAbsence = (item: Absence) => handleGenericDelete('absences', item.id, `Absence on ${item.date}`);
    const handleSaveGrades = async (studentId: string, subject: Subject, grades: Grade[]) => {
        try {
            await supabase.from('grades').delete().match({ student_id: studentId, subject: subject });
            const gradesToAdd = grades.map(g => ({ ...g, studentId, subject, schoolId: activeSchoolId }));
            await supabase.from('grades').insert(camelToSnakeCase(gradesToAdd));
            await fetchUserData();
        } catch (error: any) { alert(`Error saving grades: ${error.message}`); }
    };
    const handleSaveExamProgram = (data: Omit<ExamProgram, 'id'|'level'|'class'|'subject'|'date'|'stage'>) => handleGenericTeacherSave('exam_programs', data);
    const handleDeleteExamProgram = (item: ExamProgram) => handleGenericDelete('exam_programs', item.id, `Program on ${item.date}`);
    const handleSaveSupplementaryLesson = (data: Omit<SupplementaryLesson, 'id'|'level'|'class'|'subject'|'stage'>) => handleGenericTeacherSave('supplementary_lessons', data);
    const handleDeleteSupplementaryLesson = (itemId: number) => { const item = selectedSchool?.supplementaryLessons.find(i => i.id === itemId); if(item) handleGenericDelete('supplementary_lessons', item.id, item.title); };
    const handleSaveTimetable = (data: Omit<Timetable, 'id'|'level'|'class'|'date'|'stage'>) => handleGenericTeacherSave('timetables', data);
    const handleDeleteTimetable = (itemId: number) => { const item = selectedSchool?.timetables.find(i => i.id === itemId); if(item) handleGenericDelete('timetables', item.id, `Timetable for ${item.level}`); };
    const handleSaveQuiz = (data: Omit<Quiz, 'id'|'level'|'class'|'subject'|'date'|'stage'>) => handleGenericTeacherSave('quizzes', data);
    const handleDeleteQuiz = (item: Quiz) => handleGenericDelete('quizzes', item.id, item.title);
    const handleSaveProject = (data: Omit<Project, 'id'|'level'|'class'|'subject'|'date'|'stage'>) => handleGenericTeacherSave('projects', data);
    const handleDeleteProject = (item: Project) => handleGenericDelete('projects', item.id, item.title);
    const handleSaveLibraryItem = (data: Omit<LibraryItem, 'id'|'level'|'class'|'subject'|'date'|'stage'>) => handleGenericTeacherSave('library_items', data);
    const handleDeleteLibraryItem = (itemId: number) => { const item = selectedSchool?.libraryItems.find(i => i.id === itemId); if(item) handleGenericDelete('library_items', item.id, item.title); };
    const handleSavePersonalizedExercise = async (studentId: string, content: string, domain: string) => {
        try {
            const payload = { studentId, content, domain, subject: selectedSubject!, stage: selectedStage!, schoolId: activeSchoolId, date: new Date() };
            await supabase.from('personalized_exercises').insert(camelToSnakeCase(payload));
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleSaveAlbumPhoto = async (caption: string, image: string) => {
        try {
            const payload = { caption, image, status: 'pending', level: selectedLevel, class: selectedClass, stage: selectedStage!, schoolId: activeSchoolId, date: new Date() };
            await supabase.from('album_photos').insert(camelToSnakeCase(payload));
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleDeleteAlbumPhoto = (item: AlbumPhoto) => handleGenericDelete('album_photos', item.id, item.caption);
    const handleSaveUnifiedAssessment = (title: string, data: { image?: string; pdf?: { name: string; url: string } }) => handleGenericTeacherSave('unified_assessments', { title, ...data });
    const handleDeleteUnifiedAssessment = (item: UnifiedAssessment) => handleGenericDelete('unified_assessments', item.id, item.title);
    const handleSaveTalkingCard = (image: string, hotspots: Hotspot[]) => handleGenericTeacherSave('talking_cards', { image, hotspots });
    const handleDeleteTalkingCard = (item: TalkingCard) => handleGenericDelete('talking_cards', item.id, `Card from ${item.date}`);
    const handleSaveMemorizationItem = (data: Omit<MemorizationItem, 'id'|'level'|'class'|'subject'|'date'|'stage'>) => handleGenericTeacherSave('memorization_items', data);
    const handleDeleteMemorizationItem = (item: MemorizationItem) => handleGenericDelete('memorization_items', item.id, item.title);

    // Guardian Handlers
    const handleSubmitComplaint = async (content: string, fileData?: { image?: string; pdf?: { name: string; url: string; } }) => {
        try {
            const payload = { content, ...fileData, studentId: currentStudent!.id, schoolId: activeSchoolId, date: new Date() };
            await supabase.from('complaints').insert(camelToSnakeCase(payload));
            await fetchUserData();
            alert(t('requestSent'));
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleGuardianPay = async (month: number, year: number, amount: number) => {
         try {
            const payload = { studentId: currentStudent!.id, month, year, amount, date: new Date(), schoolId: activeSchoolId };
            await supabase.from('monthly_fee_payments').insert(camelToSnakeCase(payload));
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleRequestInterview = async () => {
         try {
            const payload = { studentId: currentStudent!.id, schoolId: activeSchoolId, date: new Date(), status: 'pending' };
            await supabase.from('interview_requests').insert(camelToSnakeCase(payload));
            await fetchUserData();
        } catch (error: any) { alert(`Error: ${error.message}`); }
    };
    const handleMarkNotificationsRead = async () => {
        try {
            await supabase.from('notifications').update({ read: true }).match({ student_id: currentStudent!.id, read: false });
            await fetchUserData();
        } catch (error: any) { console.error("Error marking notifications read", error); }
    };
    
  // #endregion

  // #region AI Handlers (Hybrid)
    const handleGenerateAITip = async (): Promise<string> => {
        if (!isSupabaseConfigured || !aiRef.current) {
          await new Promise(res => setTimeout(res, 500));
          return language === 'fr' ? "Conseil IA: Assurez-vous que votre enfant dorme suffisamment." : "نصيحة الذكاء الاصطناعي: تأكد من أن طفلك يحصل على قسط كافٍ من النوم.";
        }
        const prompt = language === 'fr' 
            ? "Générez un conseil pédagogique court et utile pour les parents."
            : "أنشئ نصيحة تربوية قصيرة ومفيدة للآباء.";
        const response = await aiRef.current.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    };

    const handleAnalyzeComplaints = async (): Promise<string> => {
        if (!isSupabaseConfigured || !aiRef.current) {
          await new Promise(res => setTimeout(res, 1000));
          return t('noComplaintsToAnalyze');
        }
        const complaintsSource = userRole === UserRole.SuperAdmin ? schools.flatMap(s => s.complaints || []) : (selectedSchool?.complaints || []);
        if (complaintsSource.length < 2) return t('noComplaintsToAnalyze');
        
        const complaintsText = complaintsSource.map(c => `- ${c.content}`).join('\n');
        const prompt = `Analyze the following parent complaints for a school. Provide a concise analysis in ${language}. Your analysis must include: 1. Common themes (2-3 bullet points). 2. A sentiment summary (positive, neutral, negative percentages). 3. One actionable suggestion for the administration. Complaints:\n${complaintsText}`;
        const response = await aiRef.current.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    };

    const handleGenerateAIComment = async (student: Student, subject: Subject): Promise<string> => {
        if (!isSupabaseConfigured || !aiRef.current) {
          await new Promise(res => setTimeout(res, 1000));
          return language === 'fr' ? `Commentaire pour ${student.name}: Élève sérieux avec un bon potentiel. Doit participer plus.` : `ملاحظة لـ ${student.name}: تلميذ جاد ولديه إمكانيات جيدة. يجب أن يشارك أكثر.`;
        }
        const grades = student.grades[subject] || [];
        const prompt = `Generate a constructive, personalized report card comment in ${language} for student ${student.name} in subject ${subject}. Mention strengths and areas for improvement. Student's grades data: ${JSON.stringify(grades)}`;
        const response = await aiRef.current.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    };
     const handleSendAIReportForReview = (studentId: string, comment: string) => {
        handleSaveNote({ studentIds: [studentId], observation: comment, type: 'ai_report' });
    };

    const handleGenerateLessonPlan = async (topic: string): Promise<string> => {
        if (!isSupabaseConfigured || !aiRef.current) {
          await new Promise(res => setTimeout(res, 1000));
          return `## ${t('lessonPlan')}: ${topic}\n\n* ${t('learningObjectives')}: ...\n* ${t('inClassActivities')}: ...\n* ${t('homework')}: ...`;
        }
        const prompt = `Create a structured lesson plan in ${language} for the topic "${topic}". Include sections for: Learning Objectives, In-Class Activities, and Homework.`;
        const response = await aiRef.current.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    };

    const handleGeneratePersonalizedExercises = async (student: Student, subject: Subject): Promise<string> => {
        if (!isSupabaseConfigured || !aiRef.current) {
          await new Promise(res => setTimeout(res, 1000));
          return `## ${t('supportExercises')}\n\n1. ...\n\n## ${t('enrichmentExercises')}\n\n1. ...`;
        }
        const grades = student.grades[subject] || [];
        const prompt = `Generate a set of personalized exercises in ${language} for student ${student.name} in subject ${subject}. Include a section for "Support Exercises" targeting weaker areas, and a section for "Enrichment Exercises" for strengths. Base this on the student's grades: ${JSON.stringify(grades)}`;
        const response = await aiRef.current.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    };

    const handleAnalyzeTalkingCard = async (image: string): Promise<Hotspot[]> => {
        await new Promise(res => setTimeout(res, 1500));
        return [
            { label: "قطة", box: { x: 0.1, y: 0.2, width: 0.3, height: 0.5 } },
            { label: "كرة", box: { x: 0.5, y: 0.6, width: 0.2, height: 0.2 } },
        ];
    };
    
    const handleExtractMemorizationText = async (imageB64: string): Promise<string> => {
        if (!isSupabaseConfigured || !aiRef.current) {
            await new Promise(res => setTimeout(res, 1000));
            return "هذا نص تجريبي مستخرج من الصورة.";
        }
        const prompt = `Extract the text from this image. The language of the text is ${language}.`;
        const imagePart = { inlineData: { mimeType: 'image/jpeg', data: imageB64.split(',')[1] } };
        const response = await aiRef.current.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [{ text: prompt }, imagePart] } });
        return response.text;
    };
  // #endregion

  const renderPage = () => {
      // Offline mode check replaces the fatal error for missing keys
      if (fatalError) return <div className="text-red-500 p-4 bg-red-100 rounded">{fatalError}</div>;
      if (isLoading) return <div className="flex items-center justify-center h-screen"><div>Loading...</div></div>;
      
      switch (currentPage) {
          case Page.UnifiedLogin:
              return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
          // All other cases remain largely the same, just passing the live data handlers now.
          // Super Admin
          case Page.SuperAdminDashboard:
              return <SuperAdminDashboard schools={schools} onAddSchool={handleAddSchool} onDeleteSchool={(id, name) => handleDeleteSchool(id, name)} onManageSchool={handleManageSchool} onNavigate={navigateTo} onLogout={handleLogout} />;
          case Page.SuperAdminSchoolManagement:
              const schoolToManage = schools.find(s => s.id === schoolForSuperAdminViewId);
              if (!schoolToManage) return <div onClick={() => handleBack()}>School not found. Go back.</div>;
              return <SuperAdminSchoolManagement school={schoolToManage} onUpdateSchoolDetails={handleUpdateSchoolDetails} onToggleStatus={handleToggleSchoolStatus} onToggleStage={handleToggleStage} onToggleFeatureFlag={handleToggleFeatureFlag} onEnterFeaturePage={(page, stage) => { setSelectedStage(stage); setIsSuperAdminImpersonating(true); navigateTo(page); }} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onAddPrincipal={handleAddPrincipal} onDeletePrincipal={(stage, id, name) => handleDeletePrincipal(stage, id, name)} onUpdatePrincipalCode={handleUpdatePrincipalCode} />;
          case Page.SuperAdminFeedbackAnalysis:
              return <SuperAdminFeedbackAnalysis schools={schools} onAnalyze={handleAnalyzeComplaints} onBack={handleBack} onLogout={handleLogout} />;

          // Principal
          case Page.PrincipalStageSelection:
              if (!selectedSchool) return null;
              return <PrincipalStageSelection school={selectedSchool} accessibleStages={principalStages} onSelectStage={(s) => {setSelectedStage(s); navigateTo(Page.PrincipalDashboard)}} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
          case Page.PrincipalDashboard:
              if (!selectedSchool || !selectedStage) return null;
              return <PrincipalDashboard school={selectedSchool} stage={selectedStage} onSelectAction={navigateTo} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} isDesktop={isDesktop} />;
          case Page.PrincipalReviewNotes:
               if (!selectedSchool || !selectedStage) return null;
              return <PrincipalReviewNotes school={selectedSchool} notes={selectedSchool.notes.filter(n => n.stage === selectedStage && n.status === 'pending')} students={selectedSchool.students} onApprove={(id) => handleUpdateNoteStatus(id, 'approved')} onReject={(id) => handleUpdateNoteStatus(id, 'rejected')} onBack={handleBack} onLogout={handleLogout} isDesktop={isDesktop} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
          case Page.PrincipalManageTeachers:
                if (!selectedSchool || !selectedStage) return null;
                return <PrincipalManageTeachers school={selectedSchool} stage={selectedStage} teachers={selectedSchool.teachers} onAddTeacher={handleAddTeacher} onUpdateTeacher={handleUpdateTeacher} onDeleteTeacher={(id, name) => handleDeleteTeacher(id, name)} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} isDesktop={isDesktop}/>;
          case Page.PrincipalManageStudents:
                if (!selectedSchool || !selectedStage) return null;
                return <PrincipalManageStudents school={selectedSchool} stage={selectedStage} students={selectedSchool.students.filter(s => s.stage === selectedStage)} onAddStudent={handleAddStudent} onAddMultipleStudents={handleAddMultipleStudents} onUpdateStudent={handleUpdateStudent} onDeleteStudent={(id, name) => handleDeleteStudent(id, name)} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} isDesktop={isDesktop}/>;
          case Page.PrincipalAnnouncements:
                if (!selectedSchool) return null;
                return <PrincipalAnnouncements school={selectedSchool} announcements={selectedSchool.announcements} teachers={selectedSchool.teachers} onAddAnnouncement={handleAddAnnouncement} onBack={handleBack} onLogout={handleLogout} isDesktop={isDesktop} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
          case Page.PrincipalComplaints:
                if (!selectedSchool) return null;
                return <PrincipalComplaints school={selectedSchool} complaints={selectedSchool.complaints} students={selectedSchool.students} onAnalyze={handleAnalyzeComplaints} onBack={handleBack} onLogout={handleLogout} isDesktop={isDesktop} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
          case Page.PrincipalEducationalTips:
                if (!selectedSchool) return null;
                return <PrincipalEducationalTips school={selectedSchool} tips={selectedSchool.educationalTips} onAddTip={handleAddEducationalTip} onGenerateAITip={handleGenerateAITip} onBack={handleBack} onLogout={handleLogout} isDesktop={isDesktop} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
          case Page.PrincipalPerformanceTracking:
                if (!selectedSchool || !selectedStage) return null;
                return <PrincipalPerformanceTracking school={selectedSchool} stage={selectedStage} students={selectedSchool.students.filter(s => s.stage === selectedStage)} onBack={handleBack} onLogout={handleLogout} isDesktop={isDesktop} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
          case Page.PrincipalManagementMenu:
                if (!selectedSchool || !selectedStage) return null;
                return <PrincipalManagementMenu school={selectedSchool} stage={selectedStage} onSelectAction={navigateTo} onBack={handleBack} onLogout={handleLogout} isDesktop={isDesktop} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
          case Page.PrincipalBrowseAsTeacherSelection:
                if (!selectedSchool || !selectedStage) return null;
                return <PrincipalBrowseAsTeacherSelection school={selectedSchool} stage={selectedStage} onSelectionComplete={(level, subject, cls) => { setSelectedLevel(level); setSelectedSubject(subject); setSelectedClass(cls); setIsPrincipalImpersonatingTeacher(true); navigateTo(Page.TeacherDashboard); }} onBack={handleBack} onLogout={handleLogout} isDesktop={isDesktop} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
          case Page.PrincipalMonthlyFees:
                if (!selectedSchool || !selectedStage) return null;
                return <PrincipalMonthlyFees school={selectedSchool} stage={selectedStage} students={selectedSchool.students.filter(s => s.stage === selectedStage)} payments={selectedSchool.monthlyFeePayments} onMarkAsPaid={handleMarkAsPaid} onBack={handleBack} onLogout={handleLogout} isDesktop={isDesktop} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
          case Page.PrincipalInterviewRequests:
                if (!selectedSchool) return null;
                return <PrincipalInterviewRequests school={selectedSchool} requests={selectedSchool.interviewRequests.filter(r => r.status === 'pending')} students={selectedSchool.students} onComplete={handleMarkInterviewCompleted} onBack={handleBack} onLogout={handleLogout} isDesktop={isDesktop} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
          case Page.PrincipalFeeManagement:
                if (!selectedSchool) return null;
                return <PrincipalFeeManagement school={selectedSchool} onUpdateFees={handleUpdateFees} onBack={handleBack} onLogout={handleLogout} isDesktop={isDesktop} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
          case Page.PrincipalReviewAlbum:
                if (!selectedSchool) return null;
                return <PrincipalReviewAlbum school={selectedSchool} pendingPhotos={selectedSchool.albumPhotos.filter(p => p.status === 'pending')} onApprove={(id) => handleUpdateAlbumPhotoStatus(id, 'approved')} onReject={(id) => handleUpdateAlbumPhotoStatus(id, 'rejected')} onBack={handleBack} onLogout={handleLogout} isDesktop={isDesktop} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
          case Page.PrincipalFinancialDashboard:
                if (!selectedSchool || !selectedStage) return null;
                return <PrincipalFinancialDashboard school={selectedSchool} stage={selectedStage} onAddExpense={handleAddExpense} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} isDesktop={isDesktop}/>;

          // ... All other cases for Teacher and Guardian also remain the same, just passing new handlers
          // Teacher
          case Page.TeacherDashboard:
              if (!selectedSchool) return null;
              let teacherForDashboard: Teacher | null = currentTeacher;
              if (isPrincipalImpersonatingTeacher) {
                  if (!selectedSubject || !selectedLevel || !selectedClass) return null;
                  teacherForDashboard = { id: 'impersonating-principal', name: t('browseAsTeacher'), loginCode: '', subjects: [selectedSubject], assignments: { [selectedLevel]: [selectedClass] } };
              }
              if (!teacherForDashboard) return null;
              return <TeacherDashboard school={selectedSchool} teacher={teacherForDashboard} onSelectionComplete={(level, subject) => { setSelectedLevel(level); setSelectedSubject(subject); setSelectedStage(getStageForLevel(level)); navigateTo(Page.TeacherClassSelection); }} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} isImpersonating={isPrincipalImpersonatingTeacher} />;
          case Page.TeacherClassSelection:
              if (!selectedSchool || !selectedLevel || (!isPrincipalImpersonatingTeacher && !currentTeacher)) return null;
              const classesForSelection = isPrincipalImpersonatingTeacher ? (selectedSchool.teachers.flatMap(t => t.assignments[selectedLevel] || [])).filter((v,i,a)=>a.indexOf(v)===i) : currentTeacher!.assignments[selectedLevel] || [];
              return <TeacherClassSelection school={selectedSchool} classes={classesForSelection} onSelectClass={(cls) => { setSelectedClass(cls); navigateTo(Page.TeacherActionMenu); }} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
          case Page.TeacherActionMenu:
              if (!selectedSchool || !selectedLevel) return null;
              return <TeacherActionMenu school={selectedSchool} selectedLevel={selectedLevel} onSelectAction={navigateTo} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
          case Page.TeacherManageSummaries:
              if (!selectedSchool || !selectedSubject) return null;
              return <TeacherContentForm school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} title={t('summaries')} items={selectedSchool.summaries.filter(i => i.level === selectedLevel && i.class === selectedClass && i.subject === selectedSubject)} onSave={(title, content, files, link, domain) => handleSaveSummary({ title, content, ...files, externalLink: link, domain })} onDelete={handleDeleteSummary} onBack={handleBack} onLogout={handleLogout} showTitleField={true} subject={selectedSubject} />;
          case Page.TeacherManageExercises:
              if (!selectedSchool || !selectedSubject) return null;
              return <TeacherContentForm school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} title={t('exercises')} items={selectedSchool.exercises.filter(i => i.level === selectedLevel && i.class === selectedClass && i.subject === selectedSubject)} onSave={(_, content, files, link, domain) => handleSaveExercise({ content, ...files, externalLink: link, domain })} onDelete={handleDeleteExercise} onBack={handleBack} onLogout={handleLogout} subject={selectedSubject} />;
          case Page.TeacherManageNotes:
              if (!selectedSchool || !selectedSubject) return null;
              return <TeacherNotesForm school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} students={selectedSchool.students.filter(s => s.level === selectedLevel && s.class === selectedClass)} notes={selectedSchool.notes.filter(i => i.level === selectedLevel && i.class === selectedClass && i.subject === selectedSubject)} absences={selectedSchool.absences.filter(i => i.level === selectedLevel && i.class === selectedClass && i.subject === selectedSubject)} onSave={(ids, obs, files, link) => handleSaveNote({ studentIds: ids, observation: obs, ...files, externalLink: link })} onMarkAbsent={handleMarkAbsent} onBack={handleBack} onLogout={handleLogout} onDeleteNote={handleDeleteNote} onDeleteAbsence={handleDeleteAbsence} />;
          case Page.TeacherStudentSelection:
                if (!selectedSchool) return null;
                return <TeacherStudentSelection school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} students={selectedSchool.students.filter(s => s.level === selectedLevel && s.class === selectedClass)} onSelectStudent={st => { setStudentForGrading(st); navigateTo(Page.TeacherStudentGrades); }} onBack={handleBack} onLogout={handleLogout} title={t('studentGrades')} />;
          case Page.TeacherStudentGrades:
                if (!studentForGrading || !selectedSubject || !selectedSchool) return null;
                return <TeacherStudentGrades school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} student={studentForGrading} subject={selectedSubject} initialGrades={studentForGrading.grades[selectedSubject] || getBlankGrades(selectedSubject)} onSave={handleSaveGrades} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherManageExamProgram:
                if (!selectedSchool || !selectedSubject) return null;
                return <TeacherExamProgramForm school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} programs={selectedSchool.examPrograms.filter(i => i.level === selectedLevel && i.class === selectedClass && i.subject === selectedSubject)} onSave={handleSaveExamProgram} onDelete={handleDeleteExamProgram} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherGenerateReportCard:
                if (!selectedSchool) return null;
                return <TeacherGenerateReportCard school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} students={selectedSchool.students.filter(s => s.level === selectedLevel && s.class === selectedClass)} onSelectStudent={st => { setStudentForReport(st); navigateTo(Page.TeacherStudentReportGeneration); }} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherStudentReportGeneration:
                if (!studentForReport || !selectedSubject || !selectedSchool) return null;
                return <TeacherStudentReportGeneration school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} student={studentForReport} subject={selectedSubject} onGenerateComment={handleGenerateAIComment} onSendForReview={handleSendAIReportForReview} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherAddSupplementaryLesson:
                if (!selectedSchool || !selectedSubject) return null;
                return <TeacherAddSupplementaryLesson school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} lessons={selectedSchool.supplementaryLessons.filter(l => l.level === selectedLevel && l.class === selectedClass && l.subject === selectedSubject)} onSave={(title, link, domain) => handleSaveSupplementaryLesson({ title, externalLink: link, domain })} onDelete={handleDeleteSupplementaryLesson} onBack={handleBack} onLogout={handleLogout} subject={selectedSubject} />;
          case Page.TeacherAddTimetable:
                if (!selectedSchool) return null;
                return <TeacherAddTimetable school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} timetables={selectedSchool.timetables.filter(t => t.level === selectedLevel && t.class === selectedClass)} onSave={handleSaveTimetable} onDelete={handleDeleteTimetable} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherAddQuiz:
                if (!selectedSchool || !selectedSubject) return null;
                return <TeacherAddQuiz school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} quizzes={selectedSchool.quizzes.filter(q => q.level === selectedLevel && q.class === selectedClass && q.subject === selectedSubject)} onSave={handleSaveQuiz} onDelete={handleDeleteQuiz} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherAddProject:
                if (!selectedSchool || !selectedSubject) return null;
                return <TeacherAddProject school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} projects={selectedSchool.projects.filter(p => p.level === selectedLevel && p.class === selectedClass && p.subject === selectedSubject)} onSave={handleSaveProject} onDelete={handleDeleteProject} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherAddLibrary:
                if (!selectedSchool || !selectedSubject) return null;
                return <TeacherAddLibrary school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} libraryItems={selectedSchool.libraryItems.filter(i => i.level === selectedLevel && i.class === selectedClass && i.subject === selectedSubject)} onSave={handleSaveLibraryItem} onDelete={handleDeleteLibraryItem} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherLessonPlanner:
                if (!selectedSchool) return null;
                return <TeacherLessonPlanner school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onGenerate={handleGenerateLessonPlan} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherStudentSelectionForExercises:
                if (!selectedSchool) return null;
                return <TeacherStudentSelection school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} students={selectedSchool.students.filter(s => s.level === selectedLevel && s.class === selectedClass)} onSelectStudent={st => { setStudentForPersonalizedExercises(st); navigateTo(Page.TeacherPersonalizedExercises); }} onBack={handleBack} onLogout={handleLogout} title={t('personalizedExercises')} />;
          case Page.TeacherPersonalizedExercises:
                if (!studentForPersonalizedExercises || !selectedSubject || !selectedSchool) return null;
                return <TeacherPersonalizedExercises school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} student={studentForPersonalizedExercises} subject={selectedSubject} onGenerate={handleGeneratePersonalizedExercises} onSave={handleSavePersonalizedExercise} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherManageAlbum:
                if (!selectedSchool) return null;
                return <TeacherManageAlbum school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} photos={selectedSchool.albumPhotos.filter(p => p.level === selectedLevel && p.class === selectedClass)} onSave={handleSaveAlbumPhoto} onDelete={handleDeleteAlbumPhoto} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherAddUnifiedAssessment:
                if (!selectedSchool || !selectedSubject) return null;
                return <TeacherAddUnifiedAssessment school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} assessments={selectedSchool.unifiedAssessments.filter(a => a.level === selectedLevel && a.subject === selectedSubject)} onSave={handleSaveUnifiedAssessment} onDelete={handleDeleteUnifiedAssessment} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherManageTalkingCards:
                if (!selectedSchool) return null;
                return <TeacherManageTalkingCards school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} cards={selectedSchool.talkingCards.filter(c => c.level === selectedLevel && c.class === selectedClass)} onAnalyze={handleAnalyzeTalkingCard} onSave={handleSaveTalkingCard} onDelete={(id) => handleGenericDelete('talking_cards', id, `Card ID ${id}`)} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherManageMemorization:
                if (!selectedSchool || !selectedSubject) return null;
                return <TeacherManageMemorization school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} items={selectedSchool.memorizationItems.filter(i => i.level === selectedLevel && i.class === selectedClass && i.subject === selectedSubject)} onSave={handleSaveMemorizationItem} onDelete={(id) => handleGenericDelete('memorization_items', id, `Item ID ${id}`)} onExtractText={handleExtractMemorizationText} onBack={handleBack} onLogout={handleLogout} />;
          case Page.TeacherViewAnnouncements:
                if (!selectedSchool || !currentTeacher) return null;
                const teacherAnnouncements = selectedSchool.announcements.filter(a => a.targetAudience === 'teachers' && (!a.teacherIds || a.teacherIds.length === 0 || a.teacherIds.includes(currentTeacher.id)));
                return <TeacherViewAnnouncements announcements={teacherAnnouncements} onBack={handleBack} onLogout={handleLogout} school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;

          // Guardian
          case Page.GuardianDashboard:
              if (!selectedSchool || !currentStudent) return null;
              return <GuardianDashboard student={currentStudent} school={selectedSchool} notifications={selectedSchool.notifications} onSelectSubject={(sub) => { setSelectedSubject(sub); navigateTo(Page.GuardianSubjectMenu); }} onLogout={handleLogout} navigateTo={navigateTo} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
          case Page.GuardianSubjectMenu:
              if (!selectedSchool || !currentStudent || !selectedSubject) return null;
              return <GuardianSubjectMenu school={selectedSchool} subject={selectedSubject} studentLevel={currentStudent.level} onSelectAction={navigateTo} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
          case Page.GuardianViewSummaries:
              if (!selectedSchool || !currentStudent || !selectedSubject) return null;
              return <GuardianViewContent school={selectedSchool} title={t('summaries')} items={selectedSchool.summaries.filter(i => i.level === currentStudent?.level && i.class === currentStudent.class && i.subject === selectedSubject)} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
          case Page.GuardianViewExercises:
              if (!selectedSchool || !currentStudent || !selectedSubject) return null;
              return <GuardianViewContent school={selectedSchool} title={t('exercises')} items={selectedSchool.exercises.filter(i => i.level === currentStudent?.level && i.class === currentStudent.class && i.subject === selectedSubject)} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
          case Page.GuardianViewNotes:
              if (!selectedSchool || !currentStudent || !selectedSubject) return null;
              return <GuardianViewNotes school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} student={currentStudent} notes={selectedSchool.notes.filter(n => n.subject === selectedSubject && n.status === 'approved')} absences={selectedSchool.absences.filter(a => a.subject === selectedSubject)} title={t('guardianNotesTitle')} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianViewGrades:
                if (!currentStudent || !selectedSubject || !selectedSchool) return null;
                return <GuardianViewGrades school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} student={currentStudent} subject={selectedSubject} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianViewExamProgram:
                if (!selectedSchool || !currentStudent || !selectedSubject) return null;
                return <GuardianViewExamProgram school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} programs={selectedSchool.examPrograms.filter(p => p.level === currentStudent?.level && p.class === currentStudent.class && p.subject === selectedSubject)} isFrenchUI={language === 'fr'} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianViewSupplementaryLessons:
                if (!selectedSchool || !currentStudent || !selectedSubject) return null;
                return <GuardianViewSupplementaryLessons school={selectedSchool} lessons={selectedSchool.supplementaryLessons.filter(l => l.level === currentStudent?.level && l.class === currentStudent.class && l.subject === selectedSubject)} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
          case Page.GuardianViewTimetable:
                if (!selectedSchool || !currentStudent) return null;
                return <GuardianViewTimetable school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} timetables={selectedSchool.timetables.filter(t => t.level === currentStudent?.level && t.class === currentStudent.class)} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianViewQuizzes:
                if (!selectedSchool || !currentStudent || !selectedSubject) return null;
                return <GuardianViewQuizzes school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} quizzes={selectedSchool.quizzes.filter(q => q.level === currentStudent?.level && q.class === currentStudent.class && q.subject === selectedSubject)} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianViewProjects:
                if (!selectedSchool || !currentStudent || !selectedSubject) return null;
                return <GuardianViewProjects school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} projects={selectedSchool.projects.filter(p => p.level === currentStudent?.level && p.class === currentStudent.class && p.subject === selectedSubject)} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianViewLibrary:
                if (!selectedSchool || !currentStudent || !selectedSubject) return null;
                return <GuardianViewLibrary school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} items={selectedSchool.libraryItems.filter(i => i.level === currentStudent?.level && i.class === currentStudent.class && i.subject === selectedSubject)} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianNotifications:
                if (!selectedSchool || !currentStudent) return null;
                return <GuardianNotifications school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} notifications={selectedSchool.notifications.filter(n => n.studentId === currentStudent?.id)} onMarkRead={handleMarkNotificationsRead} onBack={handleBack} />;
          case Page.GuardianViewAnnouncements:
                if (!selectedSchool) return null;
                return <GuardianViewAnnouncements announcements={selectedSchool.announcements.filter(a => a.targetAudience === 'guardians')} onBack={handleBack} onLogout={handleLogout} school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
          case Page.GuardianViewEducationalTips:
                if (!selectedSchool) return null;
                return <GuardianViewEducationalTips school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} tips={selectedSchool.educationalTips} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianSubmitComplaint:
                if (!selectedSchool) return null;
                return <GuardianSubmitComplaint school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onSubmit={handleSubmitComplaint} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianMonthlyFees:
                if (!selectedSchool || !currentStudent) return null;
                return <GuardianMonthlyFees student={currentStudent} school={selectedSchool} payments={selectedSchool.monthlyFeePayments.filter(p => p.studentId === currentStudent?.id)} onPay={handleGuardianPay} onBack={handleBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
          case Page.GuardianRequestInterview:
                if (!currentStudent || !selectedSchool) return null;
                return <GuardianRequestInterview school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} student={currentStudent} onRequest={handleRequestInterview} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianViewPersonalizedExercises:
                if (!selectedSchool || !currentStudent || !selectedSubject) return null;
                return <GuardianViewPersonalizedExercises school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} exercises={selectedSchool.personalizedExercises.filter(e => e.studentId === currentStudent?.id && e.subject === selectedSubject)} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianViewAlbum:
                if (!selectedSchool || !currentStudent) return null;
                return <GuardianViewAlbum school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} photos={selectedSchool.albumPhotos.filter(p => p.level === currentStudent?.level && p.class === currentStudent.class && p.status === 'approved')} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianViewUnifiedAssessments:
                if (!selectedSchool || !currentStudent || !selectedSubject) return null;
                return <GuardianViewUnifiedAssessments school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} assessments={selectedSchool.unifiedAssessments.filter(a => a.level === currentStudent?.level && a.subject === selectedSubject)} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianViewTalkingCards:
                if (!selectedSchool || !currentStudent) return null;
                return <GuardianViewTalkingCards school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} cards={selectedSchool.talkingCards.filter(c => c.level === currentStudent?.level && c.class === currentStudent.class)} onBack={handleBack} onLogout={handleLogout} />;
          case Page.GuardianViewMemorization:
                if (!selectedSchool || !currentStudent) return null;
                return <GuardianViewMemorization school={selectedSchool} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} items={selectedSchool.memorizationItems.filter(i => i.level === currentStudent?.level && i.class === currentStudent.class)} onBack={handleBack} onLogout={handleLogout} />;
          
          default:
              return (
                  <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                      <h1 className="text-2xl font-bold text-red-600">Page Not Found</h1>
                      <p className="text-gray-600 mt-2">The page you requested could not be found: {Page[currentPage]}</p>
                      <button onClick={handleBack} className="mt-4 bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition">Go Back</button>
                  </div>
              );
      }
  };

  const isFullscreenPage = currentPage === Page.PrincipalDashboard && isDesktop;
  const shouldShowSearchHeader = !!(activeSchoolId && currentPage !== Page.UnifiedLogin);

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
        {shouldShowSearchHeader && selectedSchool && (
            <SearchHeader 
                schoolName={selectedSchool.name}
                query={searchQuery}
                onQueryChange={handleSearchChange}
                isSearching={isSearching}
                results={searchResults}
                onResultClick={handleResultClick}
            />
        )}
        <main className={`transition-all duration-300 ${shouldShowSearchHeader ? 'pt-24' : ''} ${isFullscreenPage ? '' : 'flex items-center justify-center p-4'}`}>
            <div className={isFullscreenPage ? "w-full h-screen" : "w-full max-w-4xl mx-auto"}>
                {renderPage()}
            </div>
        </main>
        {selectedResult && (
            <SearchResultModal
                result={selectedResult}
                onClose={() => setSelectedResult(null)}
                isDarkMode={isDarkMode}
            />
        )}
        <ConfirmationModal 
            isOpen={isConfirmModalOpen}
            title={confirmModalContent.title}
            message={confirmModalContent.message}
            onConfirm={confirmModalContent.onConfirm}
            onCancel={() => setIsConfirmModalOpen(false)}
        />
    </div>
  );
}