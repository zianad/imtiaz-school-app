import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { Page, UserRole, Student, Teacher, Principal, Subject, School, Grade, Summary, Exercise, Note, Absence, ExamProgram, Notification, Announcement, Complaint, EducationalTip, InterviewRequest, MonthlyFeePayment, SupplementaryLesson, UnifiedAssessment, Timetable, Quiz, Project, LibraryItem, PersonalizedExercise, AlbumPhoto, TalkingCard, Hotspot, MemorizationItem, Expense, Feedback } from '../../packages/core/types';
import { supabase, isSupabaseConfigured } from '../../packages/core/supabaseClient';
import { SUPER_ADMIN_LOGIN_CODE, getBlankGrades } from '../../packages/core/constants';
import { snakeToCamelCase } from '../../packages/core/utils';

// Import Screens
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
import TeacherContentForm from './components/screens/TeacherContentForm';
import TeacherStudentSelection from './components/screens/TeacherStudentSelection';
import TeacherStudentGrades from './components/screens/TeacherStudentGrades';
import TeacherNotesForm from './components/screens/TeacherNotesForm';
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
import GuardianNotifications from './components/screens/GuardianNotifications';
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
import ConfigErrorScreen from './components/screens/ConfigErrorScreen';
import FeedbackModal from './components/FeedbackModal';

const App: React.FC = () => {
    // Global State
    const [page, setPage] = useState<Page>(Page.UnifiedLogin);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [currentUser, setCurrentUser] = useState<Student | Teacher | Principal | { id: string } | null>(null);
    const [schools, setSchools] = useState<School[]>([]);
    const [currentSchool, setCurrentSchool] = useState<School | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [sessionChecked, setSessionChecked] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    // AI instance
    const ai = new GoogleGenAI({apiKey: (import.meta as any).env.VITE_API_KEY as string});

    // Screen-specific state
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedStage, setSelectedStage] = useState<any>(null); // For Principal
    const [impersonatingTeacher, setImpersonatingTeacher] = useState<Teacher | null>(null);
    const [selectedSchoolForMgmt, setSelectedSchoolForMgmt] = useState<School | null>(null);

    // Data state
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const checkDarkMode = () => {
            const isDark = localStorage.getItem('darkMode') === 'true' ||
                (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
            setIsDarkMode(isDark);
            document.documentElement.classList.toggle('dark', isDark);
        };
        checkDarkMode();
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newIsDark = !prev;
            localStorage.setItem('darkMode', String(newIsDark));
            document.documentElement.classList.toggle('dark', newIsDark);
            return newIsDark;
        });
    };

    const fetchSchools = useCallback(async () => {
        const { data, error } = await supabase.from('schools').select('*');
        if (error) {
            console.error("Error fetching schools:", error);
        } else {
            const schoolData = snakeToCamelCase(data) as School[];
            // Initialize empty arrays/objects for optional data to prevent runtime errors
            const schoolsWithDefaults = schoolData.map(s => ({
                ...s,
                principals: s.principals || {}, // FIX: Ensure principals is an object
                students: s.students || [],
                teachers: s.teachers || [],
                summaries: s.summaries || [],
                exercises: s.exercises || [],
                notes: s.notes || [],
                absences: s.absences || [],
                examPrograms: s.examPrograms || [],
                notifications: s.notifications || [],
                announcements: s.announcements || [],
                complaints: s.complaints || [],
                educationalTips: s.educationalTips || [],
                monthlyFeePayments: s.monthlyFeePayments || [],
                interviewRequests: s.interviewRequests || [],
                supplementaryLessons: s.supplementaryLessons || [],
                timetables: s.timetables || [],
                quizzes: s.quizzes || [],
                projects: s.projects || [],
                libraryItems: s.libraryItems || [],
                albumPhotos: s.albumPhotos || [],
                personalizedExercises: s.personalizedExercises || [],
                unifiedAssessments: s.unifiedAssessments || [],
                talkingCards: s.talkingCards || [],
                memorizationItems: s.memorizationItems || [],
                expenses: s.expenses || [],
                feedback: s.feedback || [],
            }));
            setSchools(schoolsWithDefaults);
        }
    }, []);


    useEffect(() => {
        fetchSchools();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                // User is signed in.
            } else {
                handleLogout();
            }
        });
        setSessionChecked(true);
        return () => subscription.unsubscribe();
    }, [fetchSchools]);
    
    const handleLogin = async (code: string) => {
        if (code.toLowerCase() === SUPER_ADMIN_LOGIN_CODE.toLowerCase()) {
             await supabase.auth.signInWithPassword({
                email: (import.meta as any).env.VITE_SUPER_ADMIN_EMAIL,
                password: (import.meta as any).env.VITE_SUPER_ADMIN_PASSWORD
            });
            setUserRole(UserRole.SuperAdmin);
            setCurrentUser({ id: SUPER_ADMIN_LOGIN_CODE });
            setPage(Page.SuperAdminDashboard);
            return;
        }

        let userFound = false;
        for (const school of schools) {
            // Find student
            const student = school.students.find(s => s.guardianCode === code);
            if (student) {
                const email = `${code}@${school.id}.com`;
                const password = code;
                await supabase.auth.signInWithPassword({ email, password });
                setUserRole(UserRole.Guardian);
                setCurrentUser(student);
                setCurrentSchool(school);
                setPage(Page.GuardianDashboard);
                userFound = true;
                break;
            }

            // Find teacher
            const teacher = school.teachers.find(t => t.loginCode === code);
            if (teacher) {
                const email = `${code}@${school.id}.com`;
                const password = code;
                await supabase.auth.signInWithPassword({ email, password });
                setUserRole(UserRole.Teacher);
                setCurrentUser(teacher);
                setCurrentSchool(school);
                setPage(Page.TeacherDashboard);
                userFound = true;
                break;
            }

            // Find principal
            for (const stageKey in school.principals) {
                const principal = school.principals[stageKey as keyof typeof school.principals]?.find(p => p.loginCode === code);
                if (principal) {
                    const email = `${code}@${school.id}.com`;
                    const password = code;
                    await supabase.auth.signInWithPassword({ email, password });
                    setUserRole(UserRole.Principal);
                    setCurrentUser(principal);
                    setCurrentSchool(school);
                    setPage(Page.PrincipalStageSelection);
                    userFound = true;
                    break;
                }
            }
             if (userFound) break;
        }
        if (!userFound) {
            throw new Error("Invalid login credentials");
        }
    };
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsFeedbackModalOpen(true);
        // Reset all state
        setPage(Page.UnifiedLogin);
        setUserRole(null);
        setCurrentUser(null);
        setCurrentSchool(null);
        setSelectedSubject(null);
        setSelectedLevel('');
        setSelectedClass('');
        setSelectedStudent(null);
        setSelectedStage(null);
        setImpersonatingTeacher(null);
        setNotifications([]);
    };

    const navigateTo = (newPage: Page) => setPage(newPage);

    // AI Handlers
    const handleGenerateAiNote = async (student: Student, subject: Subject): Promise<string> => {
        const grades = student.grades[subject]?.filter(g => g.score !== null);
        if (!grades || grades.length === 0) {
            return "لا توجد نقاط كافية لإنشاء ملاحظة.";
        }
        
        const prompt = `
            بصفتك أستاذًا، اكتب ملاحظة مخصصة باللغة العربية حول أداء التلميذ(ة) "${student.name}" في مادة "${subject}".
            استخدم النقاط التالية كنقطة انطلاق. كن إيجابيا وبناءً، مع ذكر نقاط القوة ومجالات التحسين.
            النقاط: ${JSON.stringify(grades)}
            الملاحظة يجب ألا تتجاوز 4-5 جمل.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
            },
        });
        return response.text;
    };
    
    const handleGenerateLessonPlan = async (topic: string): Promise<string> => {
        const prompt = `
            أنشئ خطة درس مفصلة باللغة العربية لمادة "${selectedSubject}" حول الموضوع: "${topic}".
            يجب أن تتضمن الخطة:
            1.  الأهداف التعليمية.
            2.  المواد والوسائل التعليمية.
            3.  مراحل الدرس (تمهيد، بناء المفهوم، تطبيق، تقويم).
            4.  أنشطة مقترحة لكل مرحلة.
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    };

    const handleGeneratePersonalizedExercises = async (student: Student, subject: Subject): Promise<string> => {
        const grades = student.grades[subject]?.filter(g => g.score !== null);
        const prompt = `
            بناءً على نقاط التلميذ(ة) "${student.name}" في مادة "${subject}", أنشئ 3-4 تمارين دعم وتمكين مخصصة.
            ركز على المجالات التي حصل فيها التلميذ(ة) على أضعف النقاط. يجب أن تكون التمارين باللغة العربية.
            النقاط: ${JSON.stringify(grades || [])}
        `;
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    };
    
    const handleAnalyzeComplaints = async (): Promise<string> => {
        const complaints = currentSchool?.complaints?.map(c => c.content) || [];
        if (complaints.length < 2) {
            throw new Error("Not enough complaints to analyze.");
        }
        const prompt = `
            حلل الشكايات التالية الواردة من أولياء الأمور.
            لخص المواضيع الرئيسية للشكايات، وحدد الاتجاهات أو المشاكل المتكررة، واقترح 3 حلول عملية وملموسة يمكن لإدارة المدرسة تنفيذها.
            الرد يجب أن يكون باللغة العربية وفي شكل تقرير منظم.
            الشكايات:
            ${complaints.map(c => `- ${c}`).join('\n')}
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    };

    const handleGenerateAITip = async (): Promise<string> => {
        const prompt = "أنشئ نصيحة تربوية قصيرة ومؤثرة باللغة العربية لأولياء الأمور لتحسين مشاركتهم في المسار الدراسي لأبنائهم.";
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    };
    
    const handleQuizGeneration = async (image: string): Promise<Omit<Quiz, 'id'|'level'|'class'|'subject'|'date'|'stage'>> => {
        const schema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: 'A short, relevant title for the quiz based on the image content.'},
                questions: {
                    type: Type.ARRAY,
                    description: 'An array of 3 to 5 multiple-choice questions.',
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING, description: 'The question text.' },
                            options: { type: Type.ARRAY, description: 'An array of 3 or 4 possible answers.', items: { type: Type.STRING } },
                            correctAnswerIndex: { type: Type.INTEGER, description: 'The 0-based index of the correct answer in the options array.' }
                        },
                        required: ['question', 'options', 'correctAnswerIndex']
                    }
                }
            },
            required: ['title', 'questions']
        };
        const prompt = `Based on the content of this image, generate a multiple-choice quiz. The language of the quiz must be Arabic.`;
        const imagePart = { inlineData: { mimeType: 'image/jpeg', data: image.split(',')[1] } };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, imagePart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
            }
        });
        
        return JSON.parse(response.text);
    };

    const handleAnalyzeImageForTalkingCard = async (image: string): Promise<Hotspot[]> => {
        const prompt = `Identify the main objects in this image and provide their names in Arabic and their bounding box coordinates. The bounding box should be relative to the image size (0 to 1).`;
        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    label: { type: Type.STRING, description: "The name of the object in Arabic." },
                    box: {
                        type: Type.OBJECT,
                        properties: {
                            x: { type: Type.NUMBER, description: "Top-left x coordinate (0-1)." },
                            y: { type: Type.NUMBER, description: "Top-left y coordinate (0-1)." },
                            width: { type: Type.NUMBER, description: "Width of the box (0-1)." },
                            height: { type: Type.NUMBER, description: "Height of the box (0-1)." },
                        },
                        required: ["x", "y", "width", "height"]
                    }
                },
                required: ["label", "box"]
            }
        };

        const imagePart = { inlineData: { mimeType: 'image/jpeg', data: image.split(',')[1] } };
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: prompt }, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        return JSON.parse(response.text);
    };

    const handleExtractTextFromImage = async (image: string): Promise<string> => {
        const prompt = "Extract any Arabic text from this image. If no text is found, return an empty string.";
        const imagePart = { inlineData: { mimeType: 'image/jpeg', data: image.split(',')[1] } };
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: prompt }, imagePart] },
        });
        return response.text;
    };
    
    const handleAnalyzeFeedback = async (): Promise<string> => {
        const feedback = schools.flatMap(s => s.feedback || []).map(f => `Rating: ${f.rating}, Comments: ${f.comments}`);
        if (feedback.length < 2) throw new Error("Not enough feedback to analyze.");

        const prompt = `Analyze the following user feedback for a school management app. Summarize key positive points, common complaints, and suggest 3 actionable improvements. Respond in Arabic. Feedback: \n${feedback.join('\n')}`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    };

    const renderPage = () => {
        switch (page) {
            case Page.UnifiedLogin: return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.Maintenance: return <MaintenanceScreen onLogout={handleLogout} />;
            
            // Super Admin
            case Page.SuperAdminDashboard: return <SuperAdminDashboard schools={schools} onAddSchool={async(name, code, logo) => { /* Placeholder */ }} onDeleteSchool={async(id) => { /* Placeholder */ }} onManageSchool={(id) => { setSelectedSchoolForMgmt(schools.find(s=>s.id === id) || null); setPage(Page.SuperAdminSchoolManagement); }} onNavigate={navigateTo} onLogout={handleLogout} />;
            case Page.SuperAdminSchoolManagement: return <SuperAdminSchoolManagement school={selectedSchoolForMgmt!} onUpdateSchoolDetails={() => {}} onToggleStatus={() => {}} onToggleStage={() => {}} onToggleFeatureFlag={() => {}} onEnterFeaturePage={(p, s) => { setSelectedStage(s); navigateTo(p); }} onBack={() => navigateTo(Page.SuperAdminDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onAddPrincipal={()=>{}} onDeletePrincipal={()=>{}} onUpdatePrincipalCode={()=>{}} />;
            case Page.SuperAdminFeedbackAnalysis: return <SuperAdminFeedbackAnalysis schools={schools} onAnalyze={handleAnalyzeFeedback} onBack={() => navigateTo(Page.SuperAdminDashboard)} onLogout={handleLogout} />;

            // Principal
            case Page.PrincipalStageSelection:
                const principal = currentUser as Principal;
                const accessibleStages = schools.find(s => s.id === currentSchool!.id)?.principals[principal.stage] ? [principal.stage] : [];
                return <PrincipalStageSelection school={currentSchool!} accessibleStages={accessibleStages} onSelectStage={(stage) => { setSelectedStage(stage); navigateTo(Page.PrincipalDashboard); }} onBack={handleLogout} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.PrincipalDashboard: return <PrincipalDashboard school={currentSchool!} stage={selectedStage} onSelectAction={navigateTo} onBack={() => navigateTo(Page.PrincipalStageSelection)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.PrincipalReviewNotes: return <PrincipalReviewNotes school={currentSchool!} stage={selectedStage} notes={currentSchool?.notes || []} students={currentSchool?.students || []} onApprove={() => {}} onReject={() => {}} onBack={() => navigateTo(Page.PrincipalDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
            case Page.PrincipalManagementMenu: return <PrincipalManagementMenu school={currentSchool!} stage={selectedStage} onSelectAction={navigateTo} onBack={()=>navigateTo(Page.PrincipalDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>
            case Page.PrincipalManageTeachers: return <PrincipalManageTeachers school={currentSchool!} stage={selectedStage} onBack={()=>navigateTo(Page.PrincipalManagementMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>
            case Page.PrincipalManageStudents: return <PrincipalManageStudents school={currentSchool!} stage={selectedStage} onBack={()=>navigateTo(Page.PrincipalManagementMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>
            case Page.PrincipalAnnouncements: return <PrincipalAnnouncements school={currentSchool!} announcements={currentSchool?.announcements || []} teachers={currentSchool?.teachers || []} onAddAnnouncement={()=>{}} onBack={()=>navigateTo(Page.PrincipalDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
            case Page.PrincipalComplaints: return <PrincipalComplaints school={currentSchool!} onAnalyze={handleAnalyzeComplaints} onBack={()=>navigateTo(Page.PrincipalDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
            case Page.PrincipalEducationalTips: return <PrincipalEducationalTips school={currentSchool!} tips={currentSchool?.educationalTips || []} onAddTip={()=>{}} onGenerateAITip={handleGenerateAITip} onBack={()=>navigateTo(Page.PrincipalDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
            case Page.PrincipalPerformanceTracking: return <PrincipalPerformanceTracking school={currentSchool!} stage={selectedStage} students={currentSchool?.students || []} onBack={()=>navigateTo(Page.PrincipalDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.PrincipalBrowseAsTeacherSelection: return <PrincipalBrowseAsTeacherSelection school={currentSchool!} stage={selectedStage} onSelectionComplete={(level, subject, className) => { setSelectedLevel(level); setSelectedSubject(subject); setSelectedClass(className); navigateTo(Page.TeacherActionMenu);}} onBack={() => navigateTo(Page.PrincipalDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
            case Page.PrincipalMonthlyFees: return <PrincipalMonthlyFees school={currentSchool!} stage={selectedStage} students={currentSchool?.students || []} payments={currentSchool?.monthlyFeePayments || []} onMarkAsPaid={()=>{}} onBack={() => navigateTo(Page.PrincipalDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.PrincipalInterviewRequests: return <PrincipalInterviewRequests school={currentSchool!} requests={currentSchool?.interviewRequests || []} students={currentSchool?.students || []} onComplete={()=>{}} onBack={() => navigateTo(Page.PrincipalDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.PrincipalFeeManagement: return <PrincipalFeeManagement school={currentSchool!} onUpdateFees={()=>{}} onBack={() => navigateTo(Page.PrincipalManagementMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.PrincipalReviewAlbum: return <PrincipalReviewAlbum school={currentSchool!} pendingPhotos={currentSchool?.albumPhotos?.filter(p=>p.status === 'pending') || []} onApprove={()=>{}} onReject={()=>{}} onBack={() => navigateTo(Page.PrincipalDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.PrincipalFinancialDashboard: return <PrincipalFinancialDashboard school={currentSchool!} stage={selectedStage} onAddExpense={() => {}} onBack={() => navigateTo(Page.PrincipalDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            
            // Teacher
            case Page.TeacherDashboard: return <TeacherDashboard school={currentSchool!} teacher={currentUser as Teacher} onSelectionComplete={(level, subject) => { setSelectedLevel(level); setSelectedSubject(subject); navigateTo(Page.TeacherClassSelection); }} onBack={handleLogout} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
            case Page.TeacherClassSelection: return <TeacherClassSelection school={currentSchool!} classes={(currentUser as Teacher).assignments[selectedLevel]} onSelectClass={(c) => { setSelectedClass(c); navigateTo(Page.TeacherActionMenu); }} onBack={() => navigateTo(Page.TeacherDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherActionMenu: return <TeacherActionMenu school={currentSchool!} selectedLevel={selectedLevel} onSelectAction={navigateTo} onBack={() => navigateTo(Page.TeacherClassSelection)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherManageSummaries: return <TeacherContentForm school={currentSchool!} type='summary' subject={selectedSubject!} items={currentSchool?.summaries || []} onSave={()=>{}} onDelete={()=>{}} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherManageExercises: return <TeacherContentForm school={currentSchool!} type='exercise' subject={selectedSubject!} items={currentSchool?.exercises || []} onSave={()=>{}} onDelete={()=>{}} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherStudentSelection: return <TeacherStudentSelection school={currentSchool!} title="إختر تلميذا" students={currentSchool?.students.filter(s=>s.level === selectedLevel && s.class === selectedClass) || []} onSelectStudent={(s) => {setSelectedStudent(s); navigateTo(Page.TeacherStudentGrades);}} onBack={() => navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
            case Page.TeacherStudentGrades: return <TeacherStudentGrades school={currentSchool!} student={selectedStudent!} subject={selectedSubject!} initialGrades={selectedStudent?.grades[selectedSubject!] || getBlankGrades(selectedSubject!)} onSave={()=>{}} onBack={() => navigateTo(Page.TeacherStudentSelection)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherManageNotes: return <TeacherNotesForm school={currentSchool!} students={currentSchool?.students.filter(s=>s.level === selectedLevel && s.class === selectedClass) || []} onSaveNote={()=>{}} onMarkAbsent={()=>{}} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherManageExamProgram: return <TeacherExamProgramForm school={currentSchool!} examPrograms={currentSchool?.examPrograms || []} onSave={()=>{}} onDelete={()=>{}} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherGenerateReportCard: return <TeacherGenerateReportCard school={currentSchool!} students={currentSchool?.students.filter(s=>s.level === selectedLevel && s.class === selectedClass) || []} onSelectStudent={(s) => {setSelectedStudent(s); navigateTo(Page.TeacherStudentReportGeneration);}} onBack={() => navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
            case Page.TeacherStudentReportGeneration: return <TeacherStudentReportGeneration school={currentSchool!} student={selectedStudent!} subject={selectedSubject!} onGenerateComment={handleGenerateAiNote} onSendForReview={()=>{}} onBack={()=>navigateTo(Page.TeacherGenerateReportCard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherAddSupplementaryLesson: return <TeacherAddSupplementaryLesson school={currentSchool!} subject={selectedSubject!} lessons={currentSchool?.supplementaryLessons || []} onSave={()=>{}} onDelete={()=>{}} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherAddUnifiedAssessment: return <TeacherAddUnifiedAssessment school={currentSchool!} assessments={currentSchool?.unifiedAssessments || []} onSave={()=>{}} onDelete={()=>{}} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherAddTimetable: return <TeacherAddTimetable school={currentSchool!} timetables={currentSchool?.timetables || []} onSave={()=>{}} onDelete={()=>{}} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherAddQuiz: return <TeacherAddQuiz school={currentSchool!} quizzes={currentSchool?.quizzes || []} onSave={()=>{}} onDelete={()=>{}} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
            case Page.TeacherAddProject: return <TeacherAddProject school={currentSchool!} projects={currentSchool?.projects || []} onSave={()=>{}} onDelete={()=>{}} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
            case Page.TeacherAddLibrary: return <TeacherAddLibrary school={currentSchool!} libraryItems={currentSchool?.libraryItems || []} onSave={()=>{}} onDelete={()=>{}} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
            case Page.TeacherLessonPlanner: return <TeacherLessonPlanner school={currentSchool!} onGenerate={handleGenerateLessonPlan} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherStudentSelectionForExercises: return <TeacherStudentSelection school={currentSchool!} title="اختر تلميذا لتمارين الدعم" students={currentSchool?.students.filter(s=>s.level === selectedLevel && s.class === selectedClass) || []} onSelectStudent={(s) => {setSelectedStudent(s); navigateTo(Page.TeacherPersonalizedExercises);}} onBack={() => navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
            case Page.TeacherPersonalizedExercises: return <TeacherPersonalizedExercises school={currentSchool!} student={selectedStudent!} subject={selectedSubject!} onGenerate={handleGeneratePersonalizedExercises} onSave={()=>{}} onBack={()=>navigateTo(Page.TeacherStudentSelectionForExercises)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherManageAlbum: return <TeacherManageAlbum school={currentSchool!} photos={currentSchool?.albumPhotos || []} onSave={()=>{}} onDelete={()=>{}} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherManageTalkingCards: return <TeacherManageTalkingCards school={currentSchool!} cards={currentSchool?.talkingCards || []} onAnalyze={handleAnalyzeImageForTalkingCard} onSave={()=>{}} onDelete={()=>{}} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherManageMemorization: return <TeacherManageMemorization school={currentSchool!} items={currentSchool?.memorizationItems || []} onSave={()=>{}} onDelete={()=>{}} onExtractText={handleExtractTextFromImage} onBack={()=>navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.TeacherViewAnnouncements: return <TeacherViewAnnouncements school={currentSchool!} announcements={currentSchool?.announcements.filter(a => a.targetAudience === 'teachers' && (a.teacherIds?.includes((currentUser as Teacher).id) || !a.teacherIds)) || []} onBack={() => navigateTo(Page.TeacherActionMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;

            // Guardian
            case Page.GuardianDashboard: return <GuardianDashboard school={currentSchool!} student={currentUser as Student} onSelectSubject={(s) => { setSelectedSubject(s); navigateTo(Page.GuardianSubjectMenu); }} onLogout={handleLogout} navigateTo={navigateTo} notifications={notifications} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianSubjectMenu: return <GuardianSubjectMenu school={currentSchool!} subject={selectedSubject!} onSelectAction={navigateTo} onBack={() => navigateTo(Page.GuardianDashboard)} onLogout={handleLogout} studentLevel={(currentUser as Student).level} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewSummaries: return <GuardianViewContent school={currentSchool!} type='summaries' student={currentUser as Student} subject={selectedSubject} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewExercises: return <GuardianViewContent school={currentSchool!} type='exercises' student={currentUser as Student} subject={selectedSubject} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewNotes: return <GuardianViewNotes student={currentUser as Student} school={currentSchool!} subject={selectedSubject} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewGrades: return <GuardianViewGrades student={currentUser as Student} subject={selectedSubject} school={currentSchool!} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewExamProgram: return <GuardianViewExamProgram student={currentUser as Student} subject={selectedSubject} school={currentSchool!} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianNotifications: return <GuardianNotifications notifications={notifications} school={currentSchool!} onBack={() => navigateTo(Page.GuardianDashboard)} onLogout={handleLogout} onMarkAsRead={() => {}} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewAnnouncements: return <GuardianViewAnnouncements announcements={currentSchool?.announcements.filter(a => a.targetAudience === 'guardians') || []} onBack={()=>navigateTo(Page.GuardianDashboard)} onLogout={handleLogout} school={currentSchool!} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewEducationalTips: return <GuardianViewEducationalTips tips={currentSchool?.educationalTips || []} onBack={()=>navigateTo(Page.GuardianDashboard)} onLogout={handleLogout} school={currentSchool!} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianSubmitComplaint: return <GuardianSubmitComplaint student={currentUser as Student} school={currentSchool!} onSubmit={()=>{}} onBack={()=>navigateTo(Page.GuardianDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianMonthlyFees: return <GuardianMonthlyFees student={currentUser as Student} school={currentSchool!} payments={currentSchool?.monthlyFeePayments || []} onBack={()=>navigateTo(Page.GuardianDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianRequestInterview: return <GuardianRequestInterview student={currentUser as Student} school={currentSchool!} onRequest={()=>{}} onBack={()=>navigateTo(Page.GuardianDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewSupplementaryLessons: return <GuardianViewSupplementaryLessons school={currentSchool!} student={currentUser as Student} subject={selectedSubject!} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewUnifiedAssessments: return <GuardianViewUnifiedAssessments school={currentSchool!} student={currentUser as Student} subject={selectedSubject!} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewTimetable: return <GuardianViewTimetable school={currentSchool!} student={currentUser as Student} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewQuizzes: return <GuardianViewQuizzes school={currentSchool!} student={currentUser as Student} subject={selectedSubject!} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewProjects: return <GuardianViewProjects school={currentSchool!} student={currentUser as Student} subject={selectedSubject!} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewLibrary: return <GuardianViewLibrary school={currentSchool!} student={currentUser as Student} subject={selectedSubject!} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewPersonalizedExercises: return <GuardianViewPersonalizedExercises school={currentSchool!} student={currentUser as Student} subject={selectedSubject!} onBack={() => navigateTo(Page.GuardianSubjectMenu)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewAlbum: return <GuardianViewAlbum school={currentSchool!} student={currentUser as Student} onBack={() => navigateTo(Page.GuardianDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewTalkingCards: return <GuardianViewTalkingCards school={currentSchool!} student={currentUser as Student} onBack={() => navigateTo(Page.GuardianDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            case Page.GuardianViewMemorization: return <GuardianViewMemorization school={currentSchool!} student={currentUser as Student} onBack={() => navigateTo(Page.GuardianDashboard)} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;

            default: return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
        }
    };

    if (!isSupabaseConfigured) {
        return <ConfigErrorScreen />;
    }

    return (
        <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-500">
            {sessionChecked ? renderPage() : <div>Loading...</div>}
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
        </main>
    );
};

export default App;