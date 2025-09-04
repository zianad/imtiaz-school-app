import React, { useState, useCallback, useEffect } from 'react';
import { UserRole, Student, Teacher, School, Subject, EducationalStage, Summary, Exercise, Note, Grade, Absence, Principal, Announcement, Complaint, EducationalTip, AlbumPhoto, InterviewRequest, MonthlyFeePayment, MemorizationItem } from '../../packages/core/types';
import { SUPER_ADMIN_LOGIN_CODE, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, ALL_FEATURES_ENABLED } from '../../packages/core/constants';
import { supabase, isSupabaseConfigured } from '../../packages/core/supabaseClient';
import { snakeToCamelCase, camelToSnakeCase, getStageForLevel } from '../../packages/core/utils';

// Mobile Screens
import UnifiedLoginScreen from './components/screens/UnifiedLoginScreen';
import MobileConfigErrorScreen from './ConfigErrorScreen';
// Guardian
import MobileGuardianDashboard from './GuardianDashboard';
import MobileGuardianSubjectMenu, { MobileGuardianPage } from './GuardianSubjectMenu';
import MobileGuardianViewContent from './GuardianViewContent';
import MobileGuardianViewMemorization from './GuardianViewMemorization';
// Teacher
import MobileTeacherDashboard from './TeacherDashboard';
import MobileTeacherClassSelection from './TeacherClassSelection';
import MobileTeacherActionMenu, { MobileTeacherAction } from './TeacherActionMenu';
import MobileTeacherManageSummaries from './TeacherManageSummaries';
import MobileTeacherManageExercises from './TeacherManageExercises';
import MobileTeacherManageNotes from './TeacherManageNotes';
import MobileTeacherStudentSelection from './TeacherStudentSelection';
import MobileTeacherStudentGrades from './TeacherStudentGrades';
import MobileTeacherManageMemorization from './TeacherManageMemorization';
// Principal
import MobilePrincipalStageSelection from './PrincipalStageSelection';
import MobilePrincipalDashboard, { PrincipalAction } from './PrincipalDashboard';
import MobilePrincipalReviewNotes from './PrincipalReviewNotes';
import MobilePrincipalManageTeachers from './PrincipalManageTeachers';
import MobilePrincipalManageStudents from './PrincipalManageStudents';
// Super Admin
import MobileSuperAdminDashboard from './SuperAdminDashboard';
import MobileSuperAdminSchoolManagement from './SuperAdminSchoolManagement';


export default function App() {
  const [schools, setSchools] = useState<School[]>([]);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);

  // Navigation and user context
  const [page, setPage] = useState('login');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // Role-specific data
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [principalStages, setPrincipalStages] = useState<EducationalStage[]>([]);

  // Selection state for navigation
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<EducationalStage | null>(null);
  const [studentForGrading, setStudentForGrading] = useState<Student | null>(null);

  // Super Admin context
  const [schoolToManage, setSchoolToManage] = useState<School | null>(null);
  
  // #region Authentication & Data Loading
  const handleLogout = useCallback(() => {
    (supabase.auth as any).signOut();
    setSession(null);
    setUserRole(null);
    setCurrentStudent(null);
    setCurrentTeacher(null);
    setSelectedSchool(null);
    setPage('login');
  }, []);

  const fetchUserData = useCallback(async (forceReload = false) => {
    setIsLoading(true);
    setFatalError(null);
    try {
        const email = session?.user?.email;
        if (!email) { handleLogout(); return; }

        if (email === SUPER_ADMIN_EMAIL) {
            const { data, error } = await supabase.from('schools').select(`id, name, logo_url, is_active, principals(login_code, stage)`);
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
                return { ...school, principals: principalsByStage };
            });

            setSchools(transformedSchools as School[]);
            setUserRole(UserRole.SuperAdmin);
            setPage('superAdminDashboard');
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

            const { data: schoolData, error: schoolError } = await supabase.from('schools').select(`*, principals(*), students(*, grades(*)), teachers(*), summaries(*), exercises(*), notes(*), absences(*), exam_programs(*), notifications(*), announcements(*), complaints(*), educational_tips(*), monthly_fee_payments(*), interview_requests(*), album_photos(*), memorization_items(*), feedback(*), expenses(*)`).eq('id', schoolId).single();
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

            if (studentData) {
                const student = transformedSchool.students.find((s: Student) => s.guardianCode === code);
                setCurrentStudent(student);
                setUserRole(UserRole.Guardian);
                setPage('guardianDashboard');
            } else if (teacherData) {
                const teacher = transformedSchool.teachers.find((t: Teacher) => t.loginCode === code);
                if (teacher && !teacher.assignments) teacher.assignments = {};
                setCurrentTeacher(teacher);
                setUserRole(UserRole.Teacher);
                setPage('teacherDashboard');
            } else if (principalData) {
                const principalAccessibleStages = Object.entries(transformedSchool.principals)
                    .filter(([_, principals]) => (principals as Principal[]).some(p => p.loginCode === code))
                    .map(([stage]) => stage as EducationalStage);
                setPrincipalStages(principalAccessibleStages);
                setUserRole(UserRole.Principal);
                setPage('principalStageSelection');
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

  const handleLogin = useCallback(async (code: string) => {
    const isSuperAdmin = code.toLowerCase() === SUPER_ADMIN_LOGIN_CODE.toLowerCase();
    const email = isSuperAdmin ? SUPER_ADMIN_EMAIL : `${code}@school-app.com`;
    const password = isSuperAdmin ? SUPER_ADMIN_PASSWORD : code;
    const { error } = await (supabase.auth as any).signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  useEffect(() => {
    (supabase.auth as any).getSession().then(({ data: { session } }: { data: { session: any | null }}) => setSession(session));
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((_event: any, session: any) => {
      setSession(session);
      if (_event === "SIGNED_OUT") handleLogout();
    });
    return () => subscription?.unsubscribe();
  }, [handleLogout]);

  useEffect(() => {
    if (session) fetchUserData();
    else if (!isSupabaseConfigured) fetchUserData();
    else setIsLoading(false);
  }, [session, fetchUserData]);
  // #endregion

  // #region CRUD Callbacks
  const handleSaveContent = async (type: 'summary' | 'exercise', title: string, content: string) => {
    if (!selectedSchool || !selectedLevel || !selectedClass || !selectedSubject) return;
    const data: any = {
        school_id: selectedSchool.id,
        stage: getStageForLevel(selectedLevel),
        level: selectedLevel,
        class: selectedClass,
        subject: selectedSubject,
        content: content,
        date: new Date(),
    };
    if (type === 'summary') data.title = title;

    const { error } = await supabase.from(type === 'summary' ? 'summaries' : 'exercises').insert(data);
    if (error) alert(error.message); else await fetchUserData(true);
  };

  const handleDeleteContent = async (type: 'summary' | 'exercise', id: number) => {
    const { error } = await supabase.from(type === 'summary' ? 'summaries' : 'exercises').delete().match({ id });
    if (error) alert(error.message); else await fetchUserData(true);
  };

  const handleSaveNote = async (studentIds: string[], observation: string) => {
    if (!selectedSchool || !selectedLevel || !selectedClass || !selectedSubject) return;
     const { error } = await supabase.from('notes').insert({
        school_id: selectedSchool.id,
        stage: getStageForLevel(selectedLevel),
        level: selectedLevel,
        class: selectedClass,
        subject: selectedSubject,
        student_ids: studentIds,
        observation: observation,
        status: 'pending',
        date: new Date(),
    });
    if (error) alert(error.message); else { alert('Note sent for review!'); await fetchUserData(true); }
  };
  
  const handleMarkAbsent = async (studentIds: string[]) => {
    if (!selectedSchool || !selectedLevel || !selectedClass || !selectedSubject) return;
    const absenceData = studentIds.map(studentId => ({
        school_id: selectedSchool.id,
        stage: getStageForLevel(selectedLevel),
        level: selectedLevel,
        class: selectedClass,
        subject: selectedSubject,
        student_id: studentId,
        date: new Date(),
    }));
    const { error } = await supabase.from('absences').insert(absenceData);
    if (error) alert(error.message); else { alert('Absence marked.'); await fetchUserData(true); }
  };

  const handleSaveGrades = async (subject: Subject, grades: Grade[]) => {
      if (!studentForGrading) return;
      await supabase.from('grades').delete().match({ student_id: studentForGrading.id, subject: subject });

      const newGrades = grades.filter(g => g.score !== null).map(g => ({
          student_id: studentForGrading.id,
          school_id: selectedSchool!.id,
          subject: subject,
          sub_subject: g.subSubject,
          semester: g.semester,
          assignment: g.assignment,
          score: g.score,
      }));
      if (newGrades.length > 0) {
        const { error: insertError } = await supabase.from('grades').insert(newGrades);
        if (insertError) alert(insertError.message); else { alert('Grades saved!'); setPage('teacherStudentSelection'); }
      } else {
        alert('Grades saved!'); setPage('teacherStudentSelection');
      }
      await fetchUserData(true);
  };

  const handlePrincipalNoteReview = async (noteId: number, approve: boolean) => {
    const { error } = await supabase.from('notes').update({ status: approve ? 'approved' : 'rejected' }).match({ id: noteId });
    if(error) alert(error.message); else await fetchUserData(true);
  }

  // #endregion

  if (!isSupabaseConfigured && !((import.meta as any).env.PROD === false)) {
    return <MobileConfigErrorScreen />;
  }

  if (isLoading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;
  }
  
  if (fatalError) {
    return <div style={{ padding: '16px', color: 'red', textAlign: 'center' }}>{fatalError}</div>;
  }

  if (!session && isSupabaseConfigured) {
      return <UnifiedLoginScreen onLogin={handleLogin} />;
  }
  
  // RENDER LOGIC
  switch(page) {
    case 'login': return <UnifiedLoginScreen onLogin={handleLogin} />;
    
    // Guardian Flow
    case 'guardianDashboard': return <MobileGuardianDashboard student={currentStudent!} onLogout={handleLogout} onSelectSubject={(s) => { setSelectedSubject(s); setPage('guardianSubjectMenu'); }} onSelectMemorization={() => setPage('guardianViewMemorization')}/>;
    case 'guardianSubjectMenu': return <MobileGuardianSubjectMenu subject={selectedSubject!} onBack={() => setPage('guardianDashboard')} onSelectAction={(p) => setPage(`guardianView-${p}`)} />;
    case 'guardianView-summaries': return <MobileGuardianViewContent title="Summaries" items={selectedSchool?.summaries.filter(i => i.subject === selectedSubject && i.level === currentStudent?.level) || []} onBack={() => setPage('guardianSubjectMenu')} />;
    case 'guardianView-exercises': return <MobileGuardianViewContent title="Exercises" items={selectedSchool?.exercises.filter(i => i.subject === selectedSubject && i.level === currentStudent?.level) || []} onBack={() => setPage('guardianSubjectMenu')} />;
    // Add more guardian views here...
    case 'guardianViewMemorization': return <MobileGuardianViewMemorization school={selectedSchool!} toggleDarkMode={()=>{}} isDarkMode={false} items={selectedSchool?.memorizationItems.filter(i => i.level === currentStudent?.level) || []} onBack={() => setPage('guardianDashboard')} onLogout={handleLogout} />;

    // Teacher Flow
    case 'teacherDashboard': return <MobileTeacherDashboard teacher={currentTeacher!} onLogout={handleLogout} onSelectLevel={(l) => { setSelectedLevel(l); setPage('teacherClassSelection'); }} />;
    case 'teacherClassSelection': return <MobileTeacherClassSelection teacher={currentTeacher!} selectedLevel={selectedLevel} onBack={() => setPage('teacherDashboard')} onSelectClass={(c) => { setSelectedClass(c); setPage('teacherActionMenu'); }} />;
    case 'teacherActionMenu': return <MobileTeacherActionMenu onBack={() => setPage('teacherClassSelection')} onSelectAction={(a) => setPage(`teacher-${a}`)} />;
    case 'teacher-manageSummaries': return <MobileTeacherManageSummaries items={selectedSchool?.summaries.filter(i=> i.level === selectedLevel && i.class === selectedClass && i.subject === currentTeacher?.subjects[0]) || []} onBack={() => setPage('teacherActionMenu')} onSave={(title, content) => handleSaveContent('summary', title, content)} onDelete={(id) => handleDeleteContent('summary', id)} />;
    case 'teacher-manageExercises': return <MobileTeacherManageExercises items={selectedSchool?.exercises.filter(i=> i.level === selectedLevel && i.class === selectedClass && i.subject === currentTeacher?.subjects[0]) || []} onBack={() => setPage('teacherActionMenu')} onSave={(content) => handleSaveContent('exercise', '', content)} onDelete={(id) => handleDeleteContent('exercise', id)} />;
    case 'teacher-manageNotes': return <MobileTeacherManageNotes students={selectedSchool?.students.filter(s => s.level === selectedLevel && s.class === selectedClass) || []} onBack={() => setPage('teacherActionMenu')} onSaveNote={handleSaveNote} onMarkAbsent={handleMarkAbsent} />;
    case 'teacher-manageGrades': setPage('teacherStudentSelection'); return null; // Intermediate step
    case 'teacherStudentSelection': return <MobileTeacherStudentSelection students={selectedSchool?.students.filter(s => s.level === selectedLevel && s.class === selectedClass) || []} onBack={() => setPage('teacherActionMenu')} onSelectStudent={(s) => { setStudentForGrading(s); setPage('teacherStudentGrades'); }} />;
    case 'teacherStudentGrades': return <MobileTeacherStudentGrades student={studentForGrading!} subject={currentTeacher!.subjects[0]} initialGrades={studentForGrading?.grades[currentTeacher!.subjects[0]] || []} onBack={() => setPage('teacherStudentSelection')} onSave={handleSaveGrades} />;
    case 'teacher-manageMemorization': return <MobileTeacherManageMemorization items={selectedSchool?.memorizationItems.filter(i => i.level === selectedLevel && i.class === selectedClass && i.subject === currentTeacher?.subjects[0]) || []} onBack={() => setPage('teacherActionMenu')} onSave={async (item) => { /* ... */ }} onDelete={async (id) => { /* ... */ }} onExtractText={async (img) => ''} />;

    // Principal Flow
    case 'principalStageSelection': return <MobilePrincipalStageSelection accessibleStages={principalStages} onLogout={handleLogout} onSelectStage={(s) => { setSelectedStage(s); setPage('principalDashboard'); }} />;
    case 'principalDashboard': return <MobilePrincipalDashboard onBack={() => setPage('principalStageSelection')} onSelectAction={(a) => setPage(`principal-${a}`)} />;
    case 'principal-reviewNotes': return <MobilePrincipalReviewNotes notes={selectedSchool?.notes.filter(n => n.stage === selectedStage && n.status === 'pending') || []} students={selectedSchool?.students || []} onBack={() => setPage('principalDashboard')} onApprove={(id) => handlePrincipalNoteReview(id, true)} onReject={(id) => handlePrincipalNoteReview(id, false)} />;
    case 'principal-manageTeachers': return <MobilePrincipalManageTeachers stage={selectedStage!} teachers={selectedSchool?.teachers || []} onBack={() => setPage('principalDashboard')} onAddTeacher={async (t) => { /* ... */ }} onUpdateTeacher={async (t) => { /* ... */ }} onDeleteTeacher={async (id) => { /* ... */ }} />;
    case 'principal-manageStudents': return <MobilePrincipalManageStudents stage={selectedStage!} students={selectedSchool?.students.filter(s => s.stage === selectedStage) || []} onBack={() => setPage('principalDashboard')} onAddStudent={async (s) => { /* ... */ }} onDeleteStudent={async (id) => { /* ... */ }} />;

    // Super Admin Flow
    case 'superAdminDashboard': return <MobileSuperAdminDashboard schools={schools} onLogout={handleLogout} onManageSchool={(s) => { setSchoolToManage(s); setPage('superAdminSchoolManagement'); }} />;
    case 'superAdminSchoolManagement': return <MobileSuperAdminSchoolManagement school={schoolToManage!} onBack={() => setPage('superAdminDashboard')} onToggleStatus={async () => { /* ... */ }} onAddPrincipal={async () => { /* ... */ }} onDeletePrincipal={async () => { /* ... */ }} />;

    default: return <UnifiedLoginScreen onLogin={handleLogin} />;
  }
}