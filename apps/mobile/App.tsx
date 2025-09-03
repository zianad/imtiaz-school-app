

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { LanguageProvider, useTranslation } from '../../packages/core/i18n';
import { HELP_PHONE_NUMBER, getBlankGrades, SUPER_ADMIN_LOGIN_CODE, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } from '../../packages/core/constants';
import { Student, Subject, Summary, Exercise, Note, Absence, Grade, EducationalStage, MemorizationItem, School, Teacher, UserRole, Principal } from '../../packages/core/types';
import MobileGuardianDashboard from './GuardianDashboard';
import MobileGuardianSubjectMenu, { MobileGuardianPage } from './GuardianSubjectMenu';
import MobileGuardianViewContent from './GuardianViewContent';
import GuardianViewMemorization from './GuardianViewMemorization';

// Teacher Mobile Screens
import MobileTeacherDashboard from './TeacherDashboard';
import MobileTeacherClassSelection from './TeacherClassSelection';
import MobileTeacherActionMenu, { MobileTeacherAction } from './TeacherActionMenu';
import MobileTeacherManageSummaries from './TeacherManageSummaries';
import MobileTeacherManageExercises from './TeacherManageExercises';
import MobileTeacherManageNotes from './TeacherManageNotes';
import MobileTeacherStudentSelection from './TeacherStudentSelection';
import MobileTeacherStudentGrades from './TeacherStudentGrades';
import MobileTeacherManageMemorization from './TeacherManageMemorization';

// Principal Mobile Screens
import MobilePrincipalStageSelection from './PrincipalStageSelection';
import MobilePrincipalDashboard, { PrincipalAction } from './PrincipalDashboard';
import MobilePrincipalReviewNotes from './PrincipalReviewNotes';
import MobilePrincipalManageTeachers from './PrincipalManageTeachers';
import MobilePrincipalManageStudents from './PrincipalManageStudents';

// Super Admin Mobile Screens
import MobileSuperAdminDashboard from './SuperAdminDashboard';
import MobileSuperAdminSchoolManagement from './SuperAdminSchoolManagement';
import { getStageForLevel, snakeToCamelCase, camelToSnakeCase } from '../../packages/core/utils';
import { supabase, isSupabaseConfigured } from '../../packages/core/supabaseClient';
// FIX: The `Session` type from '@supabase/supabase-js' was not being resolved correctly. Changed to a direct import to resolve the module resolution issue.
import { Session } from '@supabase/supabase-js';
import MobileConfigErrorScreen from './ConfigErrorScreen';


const EventHorizonLogo = () => (
    <div style={{ marginBottom: '24px' }}>
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	    viewBox="0 0 595.3 841.9" xmlSpace="preserve" style={{ width: '14rem', height: 'auto', margin: '0 auto' }}>
            <path style={{fill: '#E30613'}} d="M357.4,167.9c-33.2,68.8-67.6,125.4-108.1,120.9c-5.4-0.6-10.8-0.8-16.2,0c-40.9,5.6-31.6,35.1-64.7,114 l49-73.5l2.5,42.3c0.7,11.5-0.7,23-4.2,34l-8,25.2c29.4-23.5,52.8-48.5,75.1-83.2l3.1-28.9c0-2.2,0.5-4.3,1.4-6.3L357.4,167.9z"/>
            <path style={{fill: '#006633'}} d="M367.1,163.3c-38.3,139.9-102.4,274.6-299.7,361c49-13.5,89.4-33.2,127.7-59.2l-26,96l60.8-120.5l32.7-31.7	l59.7,152.7l-34.2-181.3C333.3,324.4,362.5,250.1,367.1,163.3z"/>
            <circle style={{fill: '#E30613'}} cx="250.9" cy="254.5" r="24.3"/>
            <g>
                <path style={{fill: '#E30613', stroke: '#006633', strokeWidth: 2, strokeMiterlimit: 10}} d="M361.1,131.8l-10.7,13.1c5.6,11.2,14.3,16.9,25.7,18.1l10.2-15.7L361.1,131.8z"/>
                <polygon style={{fill: '#E30613', stroke: '#006633', strokeWidth: 2, strokeMiterlimit: 10}} points="381.8,134 396,157.1 366.8,147.7 353.4,122.2 	"/>
                <polyline style={{fill: 'none', stroke: '#006633', strokeWidth: 2, strokeMiterlimit: 10}} points="380.3,168.4 383.5,149.7 375.9,139.9 	"/>
                <ellipse transform="matrix(0.2247 -0.9744 0.9744 0.2247 154.9655 472.7437)" style={{fill: '#E30613', stroke: '#006633', strokeWidth: 2, strokeMiterlimit: 10}} cx="374.6" cy="139" rx="1.7" ry="2.6"/>
                <line style={{fill: '#E30613', stroke: '#006633', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10}} x1="377.9" y1="167.6" x2="372.9" y2="172"/>
                <line style={{fill: '#E30613', stroke: '#006633', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10}} x1="378.9" y1="167.5" x2="376.2" y2="173.5"/>
                <line style={{fill: '#E30613', stroke: '#006633', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10}} x1="380.9" y1="168.1" x2="379.6" y2="174.6"/>
                <line style={{fill: '#E30613', stroke: '#006633', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 10}} x1="382.5" y1="168.3" x2="384.2" y2="174.7"/>
                <ellipse style={{fill: '#E30613', stroke: '#006633', strokeWidth: 2, strokeMiterlimit: 10}} cx="380.3" cy="167.4" rx="2.6" ry="1.2"/>
            </g>
        </svg>
    </div>
);


const MobileLoginScreen = ({ onLogin }: { onLogin: (code: string) => Promise<void> }) => {
    const [code, setCode] = useState('');
    const { t } = useTranslation();
    const [status, setStatus] = useState<'idle' | 'checking' | 'incorrect'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setStatus('checking');
        try {
            await onLogin(code.trim());
            // On success, the parent component will re-render and this component will be unmounted.
        } catch(err) {
            setStatus('incorrect');
            setTimeout(() => setStatus('idle'), 800);
        }
    };
    
    return (
        <div style={{ padding: '32px', border: '1px solid #e5e7eb', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxWidth: '400px', margin: 'auto' }}>
            <EventHorizonLogo />
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>{t('unifiedLoginWelcome')}</h1>
            <p style={{ color: '#4b5563', marginBottom: '32px' }}>{t('unifiedLoginPrompt')}</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t('loginCodePlaceholder')}
                    style={{ 
                        width: '100%', 
                        padding: '16px', 
                        border: `2px solid ${status === 'incorrect' ? '#f97316' : '#d1d5db'}`, 
                        borderRadius: '8px', 
                        textAlign: 'center', 
                        fontSize: '1.25rem',
                        letterSpacing: '0.1em'
                    }}
                />
                <button
                    type="submit"
                    style={{ 
                        width: '100%', 
                        backgroundColor: '#3b82f6', 
                        color: 'white', 
                        fontWeight: 'bold',
                        padding: '16px', 
                        borderRadius: '8px', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontSize: '1.125rem',
                        marginTop: '24px',
                        opacity: status === 'checking' ? 0.7 : 1
                    }}
                    disabled={status === 'checking'}
                >
                    {status === 'checking' ? '...' : t('login')}
                </button>
            </form>

            <div style={{ marginTop: '32px' }}>
                <a
                    href={`tel:${HELP_PHONE_NUMBER}`}
                    style={{ color: '#3b82f6', textDecoration: 'underline', fontWeight: '600' }}
                >
                    {t('requestHelp')}
                </a>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '8px' }}>
                    {t('helpNote')}
                </p>
            </div>
        </div>
    );
};


function AppContent() {
  const [session, setSession] = useState<Session | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);

  const [role, setRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<Student | Teacher | Principal | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  
  // Guardian state
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [guardianPage, setGuardianPage] = useState<MobileGuardianPage | null>(null);

  // Teacher state
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [teacherAction, setTeacherAction] = useState<MobileTeacherAction | null>(null);
  const [studentForGrading, setStudentForGrading] = useState<Student | null>(null);

  // Principal state
  const [selectedStage, setSelectedStage] = useState<EducationalStage | null>(null);
  const [principalAction, setPrincipalAction] = useState<PrincipalAction | null>(null);
  const [accessibleStages, setAccessibleStages] = useState<EducationalStage[]>([]);

  // Super Admin State
  const [managedSchool, setManagedSchool] = useState<School | null>(null);

  const { t, language } = useTranslation();
  const aiRef = useRef<GoogleGenAI | null>(null);
  // FIX: Cast import.meta to any to bypass TypeScript error in environments without vite/client types.
  // Vite exposes production status via import.meta.env.PROD
  const isProduction = (import.meta as any).env.PROD;

  useEffect(() => {
    // FIX: Per Gemini API guidelines, the API key must be obtained from process.env.API_KEY.
    // In Vite, env variables are on import.meta.env and must be prefixed with VITE_
    const apiKey = (import.meta as any).env.VITE_API_KEY;
    if (apiKey) {
      aiRef.current = new GoogleGenAI({ apiKey: apiKey });
    } else {
      console.warn("Gemini API key not found in import.meta.env.VITE_API_KEY. AI features will not be available for mobile.");
    }
  }, []);
  
  const handleLogout = useCallback(() => {
    // FIX: The `signOut` method does not exist on `SupabaseAuthClient` type. Casting to `any` to bypass incorrect type definition.
    (supabase.auth as any).signOut();
    setSession(null);
    setRole(null);
    setCurrentUser(null);
    setSelectedSchool(null);
    setSelectedSubject(null);
    setGuardianPage(null);
    setSelectedLevel('');
    setSelectedClass('');
    setTeacherAction(null);
    setStudentForGrading(null);
    setSelectedStage(null);
    setPrincipalAction(null);
    setManagedSchool(null);
  }, []);
  
  const fetchUserData = useCallback(async () => {
    if (!isSupabaseConfigured) {
        setFatalError("Supabase is not configured.");
        setIsLoading(false);
        return;
    }
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
            return;
        }

        // Step 2: Fetch all other related data for all schools in parallel
        const relatedTables = [
            'summaries', 'exercises', 'notes', 'exam_programs', 'notifications', 
            'announcements', 'educational_tips', 'monthly_fee_payments', 'interview_requests', 
            'supplementary_lessons', 'timetables', 'quizzes', 'projects', 'library_items', 
            'album_photos', 'personalized_exercises', 'unified_assessments', 'talking_cards', 
            'memorization_items', 'absences', 'complaints', 'expenses'
        ];

        const promises = relatedTables.map(table => 
            supabase.from(table).select('*').in('school_id', schoolIds)
        );
        
        // Use Promise.allSettled to make data fetching resilient to errors in individual tables.
        const results = await Promise.allSettled(promises);

        const relatedDataMap: { [key: string]: any[] } = {};
        
        results.forEach((result, index) => {
            const tableName = relatedTables[index];
            if (result.status === 'fulfilled') {
                if (result.value.error) {
                    // Log Supabase-specific errors from fulfilled promises
                    console.warn(`Error fetching data for table '${tableName}':`, result.value.error.message);
                    relatedDataMap[tableName] = [];
                } else {
                    relatedDataMap[tableName] = result.value.data || [];
                }
            } else {
                // Log network or other errors from rejected promises
                console.error(`Failed to fetch data for table '${tableName}':`, result.reason);
                relatedDataMap[tableName] = []; // Ensure the key exists even on failure
            }
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
        if (!email) { handleLogout(); return; }

        if (email === SUPER_ADMIN_EMAIL) {
            setRole(UserRole.SuperAdmin);
        } else {
            const code = email.split('@')[0];
            for (const school of transformedSchools) {
                const student = school.students.find((s: Student) => s.guardianCode === code);
                if (student) {
                    setSelectedSchool(school);
                    setCurrentUser(student);
                    setRole(UserRole.Guardian);
                    break;
                }
                const teacher = school.teachers.find((t: Teacher) => t.loginCode === code);
                if (teacher) {
                    if (!teacher.assignments) teacher.assignments = {};
                    setSelectedSchool(school);
                    setCurrentUser(teacher);
                    setRole(UserRole.Teacher);
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
                    setSelectedSchool(school);
                    setCurrentUser(foundPrincipal);
                    setRole(UserRole.Principal);
                    setAccessibleStages(principalAccessibleStages);
                    break;
                }
            }
        }
    } catch (error: any) {
        setFatalError(`Failed to fetch data: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  }, [session, handleLogout]);

   const handleLogin = useCallback(async (code: string) => {
    // Check for super admin is case-insensitive to identify the user role.
    const isSuperAdmin = code.toLowerCase() === SUPER_ADMIN_LOGIN_CODE.toLowerCase();
    
    // Determine the email and password for the sign-in attempt.
    const email = isSuperAdmin ? SUPER_ADMIN_EMAIL : `${code}@school-app.com`;
    // For super admin, use the definitive password from constants. For all other users, their code is their password.
    const password = isSuperAdmin ? SUPER_ADMIN_PASSWORD : code;
    
    const { data, error } = await (supabase.auth as any).signInWithPassword({ email, password });

    if (error) {
        throw error;
    }
    if (!data.session) {
      throw new Error('Login failed: No session returned');
    }
  }, []);

  useEffect(() => {
    // FIX: The `getSession` method does not exist on `SupabaseAuthClient` type. Casting to `any` to bypass incorrect type definition.
    (supabase.auth as any).getSession().then(({ data: { session } }) => setSession(session));
    // FIX: The `onAuthStateChange` method does not exist on `SupabaseAuthClient` type. Casting to `any` to bypass incorrect type definition.
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchUserData();
    else { setIsLoading(false); setSchools([]); }
  }, [session, fetchUserData]);
  
  if (isProduction && !isSupabaseConfigured) {
    return <MobileConfigErrorScreen />;
  }

  if (isLoading) return <div style={{textAlign: 'center'}}>Loading...</div>;
  if (fatalError) return <div style={{textAlign: 'center', color: 'red'}}>{fatalError}</div>;
  if (!session || !role) return <MobileLoginScreen onLogin={handleLogin} />;
  
  // SUPER ADMIN FLOW
  if(role === UserRole.SuperAdmin) {
    if(managedSchool) {
        return <MobileSuperAdminSchoolManagement 
            school={managedSchool}
            onToggleStatus={async () => {
                const { error } = await supabase.from('schools').update({ is_active: !managedSchool.isActive }).match({ id: managedSchool.id });
                if (error) alert(error.message); else await fetchUserData();
            }}
            onAddPrincipal={async (schoolId, stage, name, loginCode) => {
                // FIX: The `signUp` method does not exist on `SupabaseAuthClient` type. Casting to `any` to bypass incorrect type definition.
                await (supabase.auth as any).signUp({ email: `${loginCode}@school-app.com`, password: loginCode });
                const { error } = await supabase.from('principals').insert(camelToSnakeCase({ name, loginCode, stage, schoolId }));
                if (error) alert(error.message); else await fetchUserData();
            }}
            onDeletePrincipal={async (schoolId, stage, principalId) => {
                const { error } = await supabase.from('principals').delete().match({ id: principalId });
                if (error) alert(error.message); else await fetchUserData();
            }}
            onBack={() => setManagedSchool(null)}
        />
    }
    return <MobileSuperAdminDashboard schools={schools} onManageSchool={setManagedSchool} onLogout={handleLogout} />;
  }

  // PRINCIPAL FLOW
  if (role === UserRole.Principal && selectedSchool) {
    if(!selectedStage) {
        return <MobilePrincipalStageSelection accessibleStages={accessibleStages} onSelectStage={setSelectedStage} onLogout={handleLogout} />
    }
    if(principalAction) {
        switch(principalAction) {
            case 'reviewNotes':
                return <MobilePrincipalReviewNotes 
                    notes={selectedSchool.notes.filter(n => n.stage === selectedStage && n.status === 'pending')}
                    students={selectedSchool.students}
                    onApprove={async (noteId) => {
                        await supabase.from('notes').update({ status: 'approved' }).match({ id: noteId });
                        await fetchUserData();
                    }}
                    onReject={async (noteId) => {
                        await supabase.from('notes').delete().match({ id: noteId });
                        await fetchUserData();
                    }}
                    onBack={() => setPrincipalAction(null)}
                />
            case 'manageTeachers':
                 return <MobilePrincipalManageTeachers 
                    stage={selectedStage}
                    teachers={selectedSchool.teachers}
                    onAddTeacher={async (teacher) => {
                         // FIX: The `signUp` method does not exist on `SupabaseAuthClient` type. Casting to `any` to bypass incorrect type definition.
                         await (supabase.auth as any).signUp({ email: `${teacher.loginCode}@school-app.com`, password: teacher.loginCode });
                         await supabase.from('teachers').insert(camelToSnakeCase({ ...teacher, schoolId: selectedSchool.id }));
                         await fetchUserData();
                    }}
                    onUpdateTeacher={async (updatedTeacher) => {
                        await supabase.from('teachers').update(camelToSnakeCase(updatedTeacher)).match({ id: updatedTeacher.id });
                        await fetchUserData();
                    }}
                    onDeleteTeacher={async (teacherId) => {
                        await supabase.from('teachers').delete().match({ id: teacherId });
                        await fetchUserData();
                    }}
                    onBack={() => setPrincipalAction(null)}
                 />
            case 'manageStudents':
                 return <MobilePrincipalManageStudents 
                    stage={selectedStage}
                    students={selectedSchool.students.filter(s => s.stage === selectedStage)}
                    onAddStudent={async (student) => {
                         // FIX: The `signUp` method does not exist on `SupabaseAuthClient` type. Casting to `any` to bypass incorrect type definition.
                         await (supabase.auth as any).signUp({ email: `${student.guardianCode}@school-app.com`, password: student.guardianCode });
                         await supabase.from('students').insert(camelToSnakeCase({ ...student, schoolId: selectedSchool.id }));
                         await fetchUserData();
                    }}
                    onDeleteStudent={async (studentId) => {
                         await supabase.from('students').delete().match({ id: studentId });
                         await fetchUserData();
                    }}
                    onBack={() => setPrincipalAction(null)}
                 />
        }
    }
    return <MobilePrincipalDashboard onSelectAction={setPrincipalAction} onBack={() => setSelectedStage(null)} />;
  }

  // TEACHER FLOW
  if (role === UserRole.Teacher && selectedSchool) {
    const teacher = currentUser as Teacher;
    if(!selectedLevel) {
        return <MobileTeacherDashboard teacher={teacher} onSelectLevel={setSelectedLevel} onLogout={handleLogout}/>
    }
    if(!selectedClass) {
        return <MobileTeacherClassSelection teacher={teacher} selectedLevel={selectedLevel} onSelectClass={setSelectedClass} onBack={() => setSelectedLevel('')} />
    }
    if(teacherAction) {
        const currentStage = getStageForLevel(selectedLevel)!;
        const studentsInClass = selectedSchool.students.filter(s => s.level === selectedLevel && s.class === selectedClass);
        if(studentForGrading){
            const subjectForGrading = teacher.subjects[0]; // Assuming one subject for now
            return <MobileTeacherStudentGrades 
                student={studentForGrading}
                subject={subjectForGrading}
                initialGrades={studentForGrading.grades[subjectForGrading] || getBlankGrades(subjectForGrading)}
                onSave={async (subject, newGrades) => {
                    await supabase.from('grades').delete().match({ student_id: studentForGrading.id, subject: subject });
                    const gradesToAdd = newGrades.map(g => ({...g, studentId: studentForGrading.id, subject, schoolId: selectedSchool.id }));
                    await supabase.from('grades').insert(camelToSnakeCase(gradesToAdd));
                    await fetchUserData();
                    setStudentForGrading(null);
                }}
                onBack={() => setStudentForGrading(null)}
            />
        }
        
        const handleGenericSave = async (tableName: string, data: any) => {
            const payload = { ...data, level: selectedLevel, class: selectedClass, subject: teacher.subjects[0], stage: currentStage, schoolId: selectedSchool.id, date: new Date() };
            await supabase.from(tableName).insert(camelToSnakeCase(payload));
            await fetchUserData();
        };
        const handleGenericDelete = async (tableName: string, id: number) => {
            await supabase.from(tableName).delete().match({ id });
            await fetchUserData();
        };

        switch(teacherAction) {
            case 'manageSummaries':
                return <MobileTeacherManageSummaries 
                    items={selectedSchool.summaries.filter(s => s.level === selectedLevel && s.class === selectedClass)}
                    onSave={(title, content) => handleGenericSave('summaries', { title, content })}
                    onDelete={(id) => handleGenericDelete('summaries', id)}
                    onBack={() => setTeacherAction(null)}
                />
            case 'manageExercises':
                 return <MobileTeacherManageExercises 
                    items={selectedSchool.exercises.filter(s => s.level === selectedLevel && s.class === selectedClass)}
                    onSave={(content) => handleGenericSave('exercises', { content })}
                    onDelete={(id) => handleGenericDelete('exercises', id)}
                    onBack={() => setTeacherAction(null)}
                />
            case 'manageNotes':
                 return <MobileTeacherManageNotes 
                    students={studentsInClass}
                    onSaveNote={async (studentIds, observation) => {
                        const payload = { studentIds, observation, date: new Date(), level: selectedLevel, class: selectedClass, subject: teacher.subjects[0], status: 'pending', stage: currentStage, schoolId: selectedSchool.id };
                        await supabase.from('notes').insert(camelToSnakeCase(payload));
                        await fetchUserData();
                    }}
                    onMarkAbsent={async (studentIds) => {
                        const absences = studentIds.map(id => ({ studentId: id, date: new Date(), level: selectedLevel, class: selectedClass, subject: teacher.subjects[0], stage: currentStage, schoolId: selectedSchool.id }));
                        await supabase.from('absences').insert(camelToSnakeCase(absences));
                        await fetchUserData();
                    }}
                    onBack={() => setTeacherAction(null)}
                 />
            case 'manageGrades':
                 return <MobileTeacherStudentSelection 
                    students={studentsInClass}
                    onSelectStudent={setStudentForGrading}
                    onBack={() => setTeacherAction(null)}
                 />
            case 'manageMemorization':
                return <MobileTeacherManageMemorization
                    items={selectedSchool.memorizationItems.filter(i => i.level === selectedLevel && i.class === selectedClass)}
                    onSave={(item) => handleGenericSave('memorization_items', item)}
                    onDelete={(id) => handleGenericDelete('memorization_items', id)}
                    onExtractText={async (imageB64: string): Promise<string> => {
                        if (!aiRef.current) {
                           throw new Error("AI Client not initialized.");
                        }
                        const prompt = `Extract the text from this image. The language of the text is ${language}.`;
                        const imagePart = { inlineData: { mimeType: 'image/jpeg', data: imageB64.split(',')[1] } };
                        const response = await aiRef.current.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [{ text: prompt }, imagePart] } });
                        return response.text;
                    }}
                    onBack={() => setTeacherAction(null)}
                />
        }
    }
    return <MobileTeacherActionMenu onSelectAction={setTeacherAction} onBack={() => setSelectedClass('')} />;
  }


  // GUARDIAN FLOW
  if(role === UserRole.Guardian && selectedSchool) {
    const student = currentUser as Student;
    if (selectedSubject && guardianPage) {
        switch (guardianPage) {
            case 'summaries':
                return <MobileGuardianViewContent title={t('summaries')} items={selectedSchool.summaries.filter(s => s.level === student.level && s.class === student.class && s.subject === selectedSubject)} onBack={() => setGuardianPage(null)} />;
            case 'exercises':
                return <MobileGuardianViewContent title={t('exercises')} items={selectedSchool.exercises.filter(e => e.level === student.level && e.class === student.class && e.subject === selectedSubject)} onBack={() => setGuardianPage(null)} />;
        }
    }
    if(guardianPage === 'memorization'){
        return <GuardianViewMemorization 
            school={selectedSchool}
            items={selectedSchool.memorizationItems.filter(i => i.level === student.level && i.class === student.class)}
            onBack={() => setGuardianPage(null)}
            onLogout={handleLogout}
            // Dummy props, mobile doesn't have dark mode yet
            toggleDarkMode={() => {}} 
            isDarkMode={false}
        />
    }

    if (selectedSubject) {
        return <MobileGuardianSubjectMenu subject={selectedSubject} onSelectAction={setGuardianPage} onBack={() => setSelectedSubject(null)} />;
    }

    return <MobileGuardianDashboard 
        student={student} 
        onLogout={handleLogout} 
        onSelectSubject={setSelectedSubject} 
        onSelectMemorization={() => {setSelectedSubject(Subject.IslamicEducation); setGuardianPage('memorization')}}
    />;
  }
  
  return null;
}


export default function MobileApp() {
    return (
        <LanguageProvider>
            <div style={{ fontFamily: "'Cairo', sans-serif", backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AppContent />
            </div>
        </LanguageProvider>
    );
}