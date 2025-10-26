
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { db } from './firebase';
import { collection, onSnapshot, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

import { Page, UserRole, Subject, Summary, Exercise, Note, ExamProgram, Student, Grade, Absence, Notification, School, Teacher, Announcement, Complaint, EducationalTip, Language, SchoolFeature, MonthlyFeePayment, InterviewRequest, SupplementaryLesson, Timetable, Quiz, Project, LibraryItem, PersonalizedExercise, AlbumPhoto, UnifiedAssessment, EducationalStage, Hotspot, TalkingCard, MemorizationItem, Principal } from './types';
import { getBlankGrades, SUBJECT_MAP, SUPER_ADMIN_CODE, STAGE_DETAILS, CLASSES, ALL_FEATURES_ENABLED, MOCK_STUDENTS, MOCK_TEACHERS } from './constants';
import { useTranslation } from './i18n';
import { getStageForLevel } from './utils';

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

// Principal Screens
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

// Guardian Screens
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


// Teacher Screens
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

// Super Admin Screens
import SuperAdminSchoolManagement from './components/screens/SuperAdminSchoolManagement';
import MaintenanceScreen from './components/screens/MaintenanceScreen';
import FeedbackModal from './components/FeedbackModal';

const reviveFirestoreDates = (obj: any) => {
    if (obj === null || typeof obj !== 'object') return obj;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // Check if it's a Firestore Timestamp object which has a toDate method
            if (obj[key] && typeof obj[key].toDate === 'function') {
                obj[key] = obj[key].toDate();
            } else if (typeof obj[key] === 'object') {
                reviveFirestoreDates(obj[key]);
            }
        }
    }
};


export default function App() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const { t, language } = useTranslation();
  const currentPage = history[history.length - 1];

  const activeSchoolId = isSuperAdminImpersonating ? schoolForSuperAdminViewId : selectedSchoolId;
  const selectedSchool = schools.find(s => s.id === activeSchoolId);

  useEffect(() => {
    const schoolsCollection = collection(db, 'schools');
    const unsubscribe = onSnapshot(schoolsCollection, (snapshot) => {
        const schoolsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as School[];
        reviveFirestoreDates(schoolsData);
        setSchools(schoolsData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching schools:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
}, []);


  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Feedback Modal Logic
  useEffect(() => {
    if (userRole && (userRole === UserRole.Guardian || userRole === UserRole.Teacher || userRole === UserRole.Principal)) {
      const today = new Date();
      const dayOfMonth = today.getDate();
      const monthYear = `${today.getFullYear()}-${today.getMonth()}`;
      const feedbackKey = `feedbackPrompt_${monthYear}`;
      const hasInteractedThisMonth = localStorage.getItem(feedbackKey);
      if (dayOfMonth >= 18 && !hasInteractedThisMonth) {
        setIsFeedbackModalOpen(true);
      }
    }
  }, [userRole]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const navigateTo = useCallback((page: Page) => {
    setHistory(prev => [...prev, page]);
  }, []);

  const handleLogout = useCallback(() => {
    setHistory([Page.UnifiedLogin]);
    setUserRole(null);
    setSelectedSchoolId(null);
    setSelectedStage(null);
    setSelectedLevel('');
    setSelectedClass('');
    setSelectedSubject(null);
    setCurrentStudent(null);
    setCurrentTeacher(null);
    setStudentForGrading(null);
    setStudentForReport(null);
    setStudentForPersonalizedExercises(null);
    setSchoolForSuperAdminViewId(null);
    setIsSuperAdminImpersonating(false);
    setIsPrincipalImpersonatingTeacher(false);
    setPrincipalStages([]);
  }, []);

  const goBack = useCallback(() => {
    if (history.length <= 1) return;

    const leavingPage = history[history.length - 1];
    const destinationPage = history[history.length - 2];
    
    // Reset selections when going back from certain pages
    if (leavingPage === Page.PrincipalDashboard) setSelectedStage(null);
    if (leavingPage === Page.TeacherDashboard) setSelectedStage(null);
    if (leavingPage === Page.GuardianDashboard) setSelectedSubject(null);

    if (leavingPage === Page.TeacherActionMenu && isPrincipalImpersonatingTeacher) {
        setIsPrincipalImpersonatingTeacher(false);
        setSelectedLevel('');
        setSelectedClass('');
        setSelectedSubject(null);
    }
    
    if (isSuperAdminImpersonating && destinationPage === Page.SuperAdminSchoolManagement) {
      setIsSuperAdminImpersonating(false);
    }

    if (currentPage === Page.TeacherStudentGrades) setStudentForGrading(null);
    if (currentPage === Page.TeacherStudentReportGeneration) setStudentForReport(null);
    if (currentPage === Page.TeacherPersonalizedExercises) setStudentForPersonalizedExercises(null);
    if (currentPage === Page.SuperAdminSchoolManagement) setSchoolForSuperAdminViewId(null);
    
    setHistory(prev => prev.slice(0, -1));
  }, [history, currentPage, isSuperAdminImpersonating, isPrincipalImpersonatingTeacher]);

  const handleLogin = async (code: string): Promise<boolean> => {
    let page: Page | null = null;
    let found = false;
    let accessibleStages: EducationalStage[] = [];

    if (code === SUPER_ADMIN_CODE) {
        setUserRole(UserRole.SuperAdmin);
        page = Page.SuperAdminDashboard;
        found = true;
    } else {
        for (const school of schools) {
            let foundPrincipal = false;
            for (const stageStr in school.principals) {
                const stage = stageStr as EducationalStage;
                const stagePrincipals = school.principals[stage] || [];
                if (stagePrincipals.some(p => p.loginCode === code)) {
                    if (!accessibleStages.includes(stage)) {
                        accessibleStages.push(stage);
                    }
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

            const student = school.students.find(s => s.guardianCode === code);
            if (student) {
                setSelectedSchoolId(school.id);
                setCurrentStudent(student);
                setUserRole(UserRole.Guardian);
                page = Page.GuardianDashboard;
                setSelectedStage(student.stage);
                found = true;
                break;
            }
            const teacher = school.teachers.find(t => t.loginCode === code);
            if (teacher) {
                setSelectedSchoolId(school.id);
                setCurrentTeacher(teacher);
                setUserRole(UserRole.Teacher);
                page = Page.TeacherDashboard;
                found = true;
                break;
            }
        }
    }

    if (page) {
      await new Promise(resolve => setTimeout(resolve, 400));
      navigateTo(page);
    }
    
    return found;
  };


  const updateSchoolData = async (updater: (school: School) => School) => {
    if (!activeSchoolId) return;
    const schoolToUpdate = schools.find(s => s.id === activeSchoolId);
    if (!schoolToUpdate) return;
    
    const updatedSchoolData = updater(schoolToUpdate);
    const schoolRef = doc(db, 'schools', activeSchoolId);
    
    // Firestore cannot store custom objects with methods, so we convert it to a plain object.
    // Also remove 'id' as it's the document key.
    const { id, ...dataToSave } = JSON.parse(JSON.stringify(updatedSchoolData));
    
    await updateDoc(schoolRef, dataToSave);
  };
  
  const handleStageSelect = (stage: EducationalStage) => {
    setSelectedStage(stage);
    navigateTo(Page.PrincipalDashboard);
  };

  const handleFeedbackSubmit = (rating: number, comments: string) => {
    console.log("Feedback Submitted:", {
      userRole,
      schoolId: selectedSchoolId,
      studentId: currentStudent?.id,
      teacherId: currentTeacher?.id,
      rating,
      comments,
      date: new Date().toISOString(),
    });

    const today = new Date();
    const monthYear = `${today.getFullYear()}-${today.getMonth()}`;
    localStorage.setItem(`feedbackPrompt_${monthYear}`, 'submitted');
    
    alert(t('feedbackThanks'));
    setIsFeedbackModalOpen(false);
  };
  
  const handleFeedbackDismiss = () => {
    const today = new Date();
    const monthYear = `${today.getFullYear()}-${today.getMonth()}`;
    localStorage.setItem(`feedbackPrompt_${monthYear}`, 'dismissed');
    setIsFeedbackModalOpen(false);
  };

  // TEACHER HANDLERS
  const handleLevelAndSubjectSelect = (level: string, subject: Subject) => {
    const stage = getStageForLevel(level);
    if(stage) {
      setSelectedStage(stage);
    }
    setSelectedLevel(level);
    setSelectedSubject(subject);
    navigateTo(Page.TeacherClassSelection);
  };
  const handleSelectClass = (className: string) => { setSelectedClass(className); navigateTo(Page.TeacherActionMenu); };
  const handleSelectStudentForGrading = (student: Student) => { setStudentForGrading(student); navigateTo(Page.TeacherStudentGrades); };
  const handleSelectStudentForReport = (student: Student) => { setStudentForReport(student); navigateTo(Page.TeacherStudentReportGeneration); };
  const handleSelectStudentForExercises = (student: Student) => { setStudentForPersonalizedExercises(student); navigateTo(Page.TeacherPersonalizedExercises); };
  
  const handleSaveSummary = async (title: string, content: string, files: { image?: string; pdf?: { name: string; url: string; }}, externalLink: string) => {
      if (!selectedStage || !selectedSubject) return;
      const newSummary: Summary = { id: Date.now(), title, content, stage: selectedStage, level: selectedLevel, class: selectedClass, subject: selectedSubject, externalLink: externalLink || undefined, ...files };
      await updateSchoolData(school => {
          const studentsInClass = school.students.filter(s => s.level === selectedLevel && s.class === selectedClass);
          const notificationMessage = t('notificationNewSummary', { subject: selectedSubject! });
          const newNotifications: Notification[] = studentsInClass.map(student => ({
              id: Date.now() + Math.random(),
              studentId: student.id,
              message: notificationMessage,
              date: new Date(),
              read: false,
          }));
          return { ...school, summaries: [...school.summaries, newSummary], notifications: [...school.notifications, ...newNotifications] };
      });
  };
  
  const handleSaveExercise = async (_title: string, content: string, files: { image?: string; pdf?: { name: string; url: string; }}, externalLink: string) => {
       if (!selectedStage || !selectedSubject) return;
      const newExercise: Exercise = { id: Date.now(), content, date: new Date(), stage: selectedStage, level: selectedLevel, class: selectedClass, subject: selectedSubject, externalLink: externalLink || undefined, ...files };
      await updateSchoolData(school => {
          const studentsInClass = school.students.filter(s => s.level === selectedLevel && s.class === selectedClass);
          const notificationMessage = t('notificationNewExercise', { subject: selectedSubject! });
          const newNotifications: Notification[] = studentsInClass.map(student => ({
              id: Date.now() + Math.random(),
              studentId: student.id,
              message: notificationMessage,
              date: new Date(),
              read: false,
          }));
          return { ...school, exercises: [...school.exercises, newExercise], notifications: [...school.notifications, ...newNotifications] };
      });
  };
  
  const handleSaveNote = async (studentIds: string[], observation: string, files: { image?: string; pdf?: { name: string; url: string; } }, externalLink: string) => {
      if (!selectedStage || !selectedSubject) return;
      const newNote: Note = { id: Date.now(), studentIds, observation, date: new Date(), stage: selectedStage, level: selectedLevel, class: selectedClass, subject: selectedSubject, status: 'pending', externalLink: externalLink || undefined, ...files };
      await updateSchoolData(school => ({ ...school, notes: [...school.notes, newNote] }));
  };

  const handleSaveAbsence = async (studentIds: string[]) => {
    if (!selectedStage || !selectedSubject) return;
    const newAbsences: Absence[] = studentIds.map(studentId => ({ id: Date.now() + Math.random(), studentId, date: new Date(), stage: selectedStage, level: selectedLevel, class: selectedClass, subject: selectedSubject }));
    await updateSchoolData(school => ({ ...school, absences: [...school.absences, ...newAbsences] }));
  };

    const handleDeleteSummary = async (id: number) => {
        await updateSchoolData(school => ({ ...school, summaries: school.summaries.filter(s => s.id !== id) }));
    };

    const handleDeleteExercise = async (id: number) => {
        await updateSchoolData(school => ({ ...school, exercises: school.exercises.filter(e => e.id !== id) }));
    };
    
    const handleDeleteNote = async (id: number) => {
        await updateSchoolData(school => ({ ...school, notes: school.notes.filter(n => n.id !== id) }));
    };

    const handleDeleteAbsence = async (id: number) => {
        await updateSchoolData(school => ({ ...school, absences: school.absences.filter(a => a.id !== id) }));
    };

    const handleSaveExamProgram = async (data: { image?: string; pdf?: { name: string; url: string; } }) => {
        if (!selectedStage || !selectedSubject) return;
        const newProgram: ExamProgram = { id: Date.now(), date: new Date(), stage: selectedStage, level: selectedLevel, class: selectedClass, subject: selectedSubject, ...data };
        await updateSchoolData(school => {
            const studentsInClass = school.students.filter(s => s.level === selectedLevel && s.class === selectedClass);
            const notificationMessage = t('notificationNewExamProgram', { subject: selectedSubject! });
            const newNotifications: Notification[] = studentsInClass.map(student => ({
                id: Date.now() + Math.random(),
                studentId: student.id,
                message: notificationMessage,
                date: new Date(),
                read: false,
            }));
            return { ...school, examPrograms: [...school.examPrograms, newProgram], notifications: [...school.notifications, ...newNotifications] };
        });
    };

    const handleDeleteExamProgram = async (id: number) => {
        await updateSchoolData(school => ({ ...school, examPrograms: school.examPrograms.filter(p => p.id !== id) }));
    };

    const handleSaveGrades = async (subject: Subject, grades: Grade[]) => {
        if (!studentForGrading) return;
        await updateSchoolData(school => {
            const newStudents = school.students.map(s => {
                if (s.id === studentForGrading.id) {
                    const newGrades = {...s.grades, [subject]: grades};
                    return { ...s, grades: newGrades };
                }
                return s;
            });
            const newSelectedSchool = { ...school, students: newStudents };
            setCurrentStudent(newStudents.find(s => s.id === currentStudent?.id) || null);
            setStudentForGrading(newStudents.find(s => s.id === studentForGrading.id) || null);
            return newSelectedSchool;
        });
        alert('تم حفظ النقط بنجاح!');
        goBack();
    };
    
    const handleGenerateAIComment = async (student: Student, subject: Subject): Promise<string> => {
        if (!process.env.API_KEY) return Promise.reject(new Error('API key is not configured.'));

        const grades = student.grades[subject];
        const validGrades = grades?.filter(g => g.score !== null) ?? [];

        if (validGrades.length < 3) {
        return Promise.reject("Not enough grades to generate a comment.");
        }
        
        const gradesSummary = SUBJECT_MAP[subject].map(subSubject => {
            const subGrades = validGrades.filter(g => g.subSubject === subSubject);
            if (subGrades.length === 0) return null;
            const average = subGrades.reduce((sum, g) => sum + g.score!, 0) / subGrades.length;
            return `${subSubject}: ${average.toFixed(2)}/10`;
        }).filter(Boolean).join('\n');
        
        const prompt = `
            Please act as a caring and professional teacher. Based on the following grades for a student named ${student.name} in the subject of ${subject}, write a supportive and constructive report card comment in ${language}.
            The comment should be 2-4 sentences long. It should start by acknowledging a strength, then gently point out an area for improvement, and end with an encouraging sentence.
            
            The grading scale is out of 10. A score of 5 is passing.
            
            Grades Summary:
            ${gradesSummary}
            
            Generate only the comment text.
        `;

        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    };
    
    const handleSendNoteForReview = async (studentId: string, comment: string) => {
        if(!selectedStage || !selectedSubject) return;
        const newNote: Note = {
            id: Date.now(),
            studentIds: [studentId],
            observation: comment,
            date: new Date(),
            stage: selectedStage,
            level: selectedLevel,
            class: selectedClass,
            subject: selectedSubject!,
            status: 'pending',
            type: 'ai_report'
        };
        await updateSchoolData(school => ({ ...school, notes: [...school.notes, newNote] }));
    };

    // GUARDIAN HANDLERS
    const handleGuardianSelectSubject = (subject: Subject) => { setSelectedSubject(subject); navigateTo(Page.GuardianSubjectMenu); };
    
    const handleMarkAsRead = useCallback(async () => {
        if (!currentStudent) return;
        await updateSchoolData(school => ({
            ...school,
            notifications: school.notifications.map(n => n.studentId === currentStudent.id ? { ...n, read: true } : n)
        }));
    }, [currentStudent, activeSchoolId]);


    // PRINCIPAL HANDLERS
    const handlePrincipalApproveNote = async (noteId: number) => {
        await updateSchoolData(school => {
            const noteToApprove = school.notes.find(n => n.id === noteId);
            if (!noteToApprove) return school;

            const notificationMessage = t('notificationMessage', { subject: noteToApprove.subject });
            const newNotifications: Notification[] = noteToApprove.studentIds.map(studentId => ({
                id: Date.now() + Math.random(),
                studentId,
                message: notificationMessage,
                date: new Date(),
                read: false,
            }));

            return {
                ...school,
                notes: school.notes.map(n => n.id === noteId ? { ...n, status: 'approved' } : n),
                notifications: [...school.notifications, ...newNotifications]
            };
        });
    };

    const handlePrincipalRejectNote = async (noteId: number) => {
        await updateSchoolData(school => ({
            ...school,
            notes: school.notes.filter(n => n.id !== noteId)
        }));
    };
    
    const handleAddTeacher = async (teacher: Omit<Teacher, 'id'>) => {
        const newTeacher = { ...teacher, id: `teacher-${Date.now()}` };
        await updateSchoolData(school => ({...school, teachers: [...school.teachers, newTeacher]}));
    };
    
    const handleUpdateTeacher = async (updatedTeacher: Teacher) => {
        await updateSchoolData(school => ({...school, teachers: school.teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t)}));
    };

    const handleDeleteTeacher = async (teacherId: string) => {
        await updateSchoolData(school => ({...school, teachers: school.teachers.filter(t => t.id !== teacherId)}));
    };

    const handleAddStudent = async (student: Omit<Student, 'id' | 'grades'>) => {
        const newStudent: Student = { ...student, id: `student-${Date.now()}`, grades: {} };
        await updateSchoolData(school => ({ ...school, students: [...school.students, newStudent] }));
    };
    
    const handleAddMultipleStudents = async (students: Omit<Student, 'id' | 'grades'>[]) => {
        const newStudents: Student[] = students.map(s => ({ ...s, id: `student-${Date.now()}-${Math.random()}`, grades: {} }));
        await updateSchoolData(school => ({...school, students: [...school.students, ...newStudents]}));
    };

    const handleDeleteStudent = async (studentId: string) => {
        await updateSchoolData(school => ({ ...school, students: school.students.filter(s => s.id !== studentId) }));
    };

    const handleUpdateStudent = async (updatedStudent: Student) => {
        await updateSchoolData(school => ({
            ...school,
            students: school.students.map(s => s.id === updatedStudent.id ? updatedStudent : s)
        }));
    };

    const handleAddAnnouncement = async (announcement: Omit<Announcement, 'id'|'date'>) => {
        const newAnnouncement: Announcement = { ...announcement, id: Date.now(), date: new Date() };
        await updateSchoolData(school => ({...school, announcements: [newAnnouncement, ...school.announcements]}));
        alert(t('sentAnnouncements'));
    };
    
    const handleAddComplaint = async (content: string, file?: { image?: string; pdf?: { name: string; url: string; } }) => {
        if (!currentStudent) return;
        const newComplaint: Complaint = { id: Date.now(), content, studentId: currentStudent.id, date: new Date(), ...file };
        await updateSchoolData(school => ({...school, complaints: [newComplaint, ...school.complaints]}));
        alert('تم إرسال شكواك / اقتراحك بنجاح.');
        goBack();
    };

    const handleAddEducationalTip = async (tip: Omit<EducationalTip, 'id'|'date'>) => {
        const newTip: EducationalTip = { ...tip, id: Date.now(), date: new Date() };
        await updateSchoolData(school => ({...school, educationalTips: [newTip, ...school.educationalTips]}));
    };

    const handleGenerateAITip = async (): Promise<string> => {
        if (!process.env.API_KEY) return Promise.reject(new Error('API key is not configured.'));
        const prompt = `Generate a short, practical, and encouraging educational tip for parents of primary school children. The language must be ${language}. Focus on topics like creating a good study environment, fostering a love for reading, or healthy screen time habits. The tone should be positive and supportive. Generate only the tip text itself.`;
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    };
    
    const handleAnalyzeComplaints = async (): Promise<string> => {
        if (!process.env.API_KEY) return Promise.reject(new Error('API key is not configured.'));
        if (!selectedSchool || selectedSchool.complaints.length < 3) return Promise.reject(new Error(t('noComplaintsToAnalyze')));
        
        const complaintTexts = selectedSchool.complaints.map(c => `- ${c.content}`).join('\n');

        const prompt = `
            As an expert school administrator analyzing feedback, please review the following list of complaints and suggestions from parents.
            In ${language}, provide a concise summary that includes:
            1.  **Common Themes:** Identify 2-3 recurring topics or issues.
            2.  **Sentiment Summary:** Briefly describe the overall tone (e.g., mostly constructive, some frustration regarding a specific topic, etc.).
            3.  **Actionable Insights:** Suggest one or two concrete, actionable steps the school could take to address the main concerns.
            
            Format the response clearly using Markdown with headings for each section.
            
            Here are the complaints:
            ${complaintTexts}
        `;
        
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    };

    const handleSetPrincipalImpersonating = (level: string, subject: Subject, className: string) => {
        setIsPrincipalImpersonatingTeacher(true);
        setSelectedLevel(level);
        setSelectedSubject(subject);
        setSelectedClass(className);
        const stage = getStageForLevel(level);
        if (stage) setSelectedStage(stage);
        navigateTo(Page.TeacherActionMenu);
    };

    const handleMarkFeeAsPaid = async (studentId: string) => {
        if (!selectedSchool?.monthlyFeeAmount) return;
        const now = new Date();
        const newPayment: MonthlyFeePayment = {
            id: Date.now(),
            studentId,
            amount: selectedSchool.monthlyFeeAmount,
            date: now,
            month: now.getMonth() + 1,
            year: now.getFullYear()
        };
        await updateSchoolData(school => ({
            ...school,
            monthlyFeePayments: [...school.monthlyFeePayments, newPayment]
        }));
    };
    
    const handleRequestInterview = async () => {
        if (!currentStudent) return;
        const newRequest: InterviewRequest = {
            id: Date.now(),
            studentId: currentStudent.id,
            date: new Date(),
            status: 'pending'
        };
        await updateSchoolData(school => ({
            ...school,
            interviewRequests: school.interviewRequests.filter(r => r.studentId !== currentStudent.id).concat(newRequest) // Replace old requests
        }));
    };

    const handleCompleteInterview = async (requestId: number) => {
        await updateSchoolData(school => ({
            ...school,
            interviewRequests: school.interviewRequests.filter(r => r.id !== requestId)
        }));
    };

    const handleGuardianPayFee = async (month: number, year: number, amount: number) => {
        if (!currentStudent) return;
        const newPayment: MonthlyFeePayment = {
            id: Date.now(),
            studentId: currentStudent.id,
            amount,
            date: new Date(),
            month,
            year
        };
         await updateSchoolData(school => {
            const studentName = school.students.find(s => s.id === newPayment.studentId)?.name || '';
            const newNotification: Notification = {
                id: Date.now(),
                studentId: '', // No specific student, this is for principal
                targetRole: UserRole.Principal,
                message: t('feeNotification', { studentName, amount: String(newPayment.amount) }),
                date: new Date(),
                read: false,
            };
            return {
                ...school,
                monthlyFeePayments: [...school.monthlyFeePayments, newPayment],
                notifications: school.notifications.concat(newNotification)
            };
         });
    };
    
    // Super Admin Handlers
    const handleAddSchool = async (name: string, principalCode: string, logoUrl: string) => {
        const newSchool: Omit<School, 'id'> = {
            name,
            logoUrl: logoUrl || undefined,
            principals: {
                [EducationalStage.PRIMARY]: [{id: `p-${Date.now()}`, name: 'Default Principal', loginCode: principalCode}]
            },
            isActive: true,
            stages: [EducationalStage.PRIMARY], // Default to primary
            featureFlags: ALL_FEATURES_ENABLED,
            students: [], teachers: [], summaries: [], exercises: [], notes: [], absences: [], examPrograms: [], notifications: [], announcements: [], complaints: [], educationalTips: [], monthlyFeePayments: [], interviewRequests: [], supplementaryLessons: [], timetables: [], quizzes: [], projects: [], libraryItems: [], albumPhotos: [], personalizedExercises: [], unifiedAssessments: [], talkingCards: [], memorizationItems: []
        };
        await addDoc(collection(db, 'schools'), newSchool);
    };
    
    const handleDeleteSchool = async (schoolId: string) => {
        await deleteDoc(doc(db, 'schools', schoolId));
    };

    const handleManageSchool = (schoolId: string) => {
        setSchoolForSuperAdminViewId(schoolId);
        navigateTo(Page.SuperAdminSchoolManagement);
    };
    
    const handleToggleSchoolStatus = async () => {
        if (!schoolForSuperAdminViewId) return;
        const schoolRef = doc(db, 'schools', schoolForSuperAdminViewId);
        const schoolToUpdate = schools.find(s => s.id === schoolForSuperAdminViewId);
        if (schoolToUpdate) {
            await updateDoc(schoolRef, { isActive: !schoolToUpdate.isActive });
        }
    };
    
    const handleToggleSchoolStage = async (stage: EducationalStage) => {
        if (!schoolForSuperAdminViewId) return;
        const schoolToUpdate = schools.find(s => s.id === schoolForSuperAdminViewId);
        if (schoolToUpdate) {
             const newStages = schoolToUpdate.stages.includes(stage)
                ? schoolToUpdate.stages.filter(st => st !== stage)
                : [...schoolToUpdate.stages, stage];
            await updateDoc(doc(db, 'schools', schoolForSuperAdminViewId), { stages: newStages });
        }
    }

    const handleToggleFeatureFlag = async (feature: SchoolFeature) => {
         if (!schoolForSuperAdminViewId) return;
         const schoolToUpdate = schools.find(s => s.id === schoolForSuperAdminViewId);
         if (schoolToUpdate) {
            const newFlags = {...schoolToUpdate.featureFlags, [feature]: schoolToUpdate.featureFlags[feature] === false };
            await updateDoc(doc(db, 'schools', schoolForSuperAdminViewId), { featureFlags: newFlags });
         }
    };
    
    const handleEnterFeaturePage = (page: Page, stage: EducationalStage) => {
        setIsSuperAdminImpersonating(true);
        setUserRole(UserRole.Principal);
        setSelectedSchoolId(schoolForSuperAdminViewId);
        setSelectedStage(stage);
        navigateTo(page);
    };

    const handleAddPrincipal = async (stage: EducationalStage, name: string, loginCode: string) => {
        if (!schoolForSuperAdminViewId) return;
        const schoolToUpdate = schools.find(s => s.id === schoolForSuperAdminViewId);
        if (schoolToUpdate) {
            const newPrincipal: Principal = { id: `p-${Date.now()}`, name, loginCode };
            const updatedPrincipals = { ...schoolToUpdate.principals };
            updatedPrincipals[stage] = [...(updatedPrincipals[stage] || []), newPrincipal];
            await updateDoc(doc(db, 'schools', schoolForSuperAdminViewId), { principals: updatedPrincipals });
        }
    };
    const handleDeletePrincipal = async (stage: EducationalStage, principalId: string) => {
        if (!schoolForSuperAdminViewId) return;
        const schoolToUpdate = schools.find(s => s.id === schoolForSuperAdminViewId);
        if (schoolToUpdate) {
            const updatedPrincipals = { ...schoolToUpdate.principals };
            updatedPrincipals[stage] = (updatedPrincipals[stage] || []).filter(p => p.id !== principalId);
            await updateDoc(doc(db, 'schools', schoolForSuperAdminViewId), { principals: updatedPrincipals });
        }
    };
    const handleUpdatePrincipalCode = async (stage: EducationalStage, principalId: string, newCode: string) => {
        if (!schoolForSuperAdminViewId) return;
        const schoolToUpdate = schools.find(s => s.id === schoolForSuperAdminViewId);
        if (schoolToUpdate) {
            const updatedPrincipals = { ...schoolToUpdate.principals };
            if (updatedPrincipals[stage]) {
                updatedPrincipals[stage] = updatedPrincipals[stage]!.map(p =>
                    p.id === principalId ? { ...p, loginCode: newCode } : p
                );
            }
            await updateDoc(doc(db, 'schools', schoolForSuperAdminViewId), { principals: updatedPrincipals });
        }
    };

    const handleUpdateFees = async (monthlyFee: number, transportationFee: number) => {
        await updateSchoolData(school => ({
            ...school,
            monthlyFeeAmount: monthlyFee,
            transportationFee: transportationFee,
        }));
    };
    
    // NEW FEATURES HANDLERS

    const handleSaveSupplementaryLesson = async (title: string, externalLink: string) => {
        if (!selectedStage || !selectedSubject) return;
        const newLesson: SupplementaryLesson = { id: Date.now(), title, externalLink, stage: selectedStage, level: selectedLevel, class: selectedClass, subject: selectedSubject };
        await updateSchoolData(school => ({ ...school, supplementaryLessons: [...school.supplementaryLessons, newLesson] }));
    };

    const handleDeleteSupplementaryLesson = async (id: number) => {
        await updateSchoolData(school => ({ ...school, supplementaryLessons: school.supplementaryLessons.filter(l => l.id !== id) }));
    };

    const handleSaveTimetable = async (data: { image?: string; pdf?: { name: string; url: string; } }) => {
        if (!selectedStage) return;
        const newTimetable: Timetable = { id: Date.now(), ...data, stage: selectedStage, level: selectedLevel, class: selectedClass, date: new Date() };
        await updateSchoolData(school => ({ ...school, timetables: [...school.timetables, newTimetable] }));
    };

    const handleDeleteTimetable = async (id: number) => {
        await updateSchoolData(school => ({ ...school, timetables: school.timetables.filter(t => t.id !== id) }));
    };
    
    const handleSaveQuiz = async (quiz: Omit<Quiz, 'id'|'level'|'class'|'subject'|'date'|'stage'>) => {
        if (!selectedStage || !selectedSubject) return;
        const newQuiz: Quiz = { ...quiz, id: Date.now(), stage: selectedStage, level: selectedLevel, class: selectedClass, subject: selectedSubject, date: new Date() };
        await updateSchoolData(school => ({...school, quizzes: [...school.quizzes, newQuiz]}));
    };
    
    const handleDeleteQuiz = async (id: number) => {
        await updateSchoolData(school => ({...school, quizzes: school.quizzes.filter(q => q.id !== id)}));
    };

    const handleSaveProject = async (project: Omit<Project, 'id'|'level'|'class'|'subject'|'date'|'stage'>) => {
        if (!selectedStage || !selectedSubject) return;
        const newProject: Project = { ...project, id: Date.now(), stage: selectedStage, level: selectedLevel, class: selectedClass, subject: selectedSubject, date: new Date() };
        await updateSchoolData(school => ({...school, projects: [...school.projects, newProject]}));
    };
    
    const handleDeleteProject = async (id: number) => {
        await updateSchoolData(school => ({...school, projects: school.projects.filter(p => p.id !== id)}));
    };
    
    const handleSaveLibraryItem = async (item: Omit<LibraryItem, 'id'|'level'|'class'|'subject'|'date'|'stage'>) => {
        if (!selectedStage || !selectedSubject) return;
        const newItem: LibraryItem = { ...item, id: Date.now(), stage: selectedStage, level: selectedLevel, class: selectedClass, subject: selectedSubject, date: new Date() };
        await updateSchoolData(school => ({...school, libraryItems: [...school.libraryItems, newItem]}));
    };
    
    const handleDeleteLibraryItem = async (id: number) => {
        await updateSchoolData(school => ({...school, libraryItems: school.libraryItems.filter(i => i.id !== id)}));
    };

    const handleGeneratePersonalizedExercises = async (student: Student, subject: Subject): Promise<string> => {
        if (!process.env.API_KEY) return Promise.reject(new Error('API key is not configured.'));
        const grades = student.grades[subject];
        if (!grades || grades.filter(g => g.score !== null).length < 2) {
            return Promise.reject("Not enough grades to generate exercises.");
        }
        
        const gradesSummary = SUBJECT_MAP[subject].map(subSubject => {
            const subGrades = grades.filter(g => g.subSubject === subSubject && g.score !== null);
            if (subGrades.length === 0) return null;
            const average = subGrades.reduce((sum, g) => sum + g.score!, 0) / subGrades.length;
            return `${subSubject} (Average: ${average.toFixed(2)}/10)`;
        }).filter(Boolean).join(', ');

        const prompt = `
            Act as a teacher creating personalized homework for a student named ${student.name} in ${subject}.
            The student's recent performance is: ${gradesSummary}.
            A score below 5/10 indicates difficulty. A score above 8/10 indicates mastery.
            
            Please generate a set of exercises in ${language} formatted in Markdown.
            The exercises should include:
            1.  A "Support Exercises" section with 2-3 problems targeting the areas where the student's average is lowest.
            2.  An "Enrichment Exercises" section with 1-2 more challenging problems related to the areas where the student's average is highest.
            
            Keep the exercises concise and appropriate for a primary school student. Start with a brief, encouraging opening sentence for the student.
        `;
        
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    };
    
    const handleSavePersonalizedExercises = async (studentId: string, content: string) => {
        if (!selectedSubject || !selectedStage) return;
        const newExercise: PersonalizedExercise = {
            id: Date.now(),
            studentId,
            subject: selectedSubject,
            stage: selectedStage,
            content,
            date: new Date()
        };
        await updateSchoolData(school => {
            const notificationMessage = t('notificationNewPersonalizedExercise', { subject: selectedSubject! });
            const newNotification: Notification = {
                id: Date.now() + Math.random(),
                studentId,
                message: notificationMessage,
                date: new Date(),
                read: false,
            };
            return {
                ...school,
                personalizedExercises: [...school.personalizedExercises, newExercise],
                notifications: school.notifications.concat(newNotification)
            };
        });
    };
    
    const handleSaveAlbumPhoto = async (caption: string, image: string) => {
        if (!selectedStage) return;
        const newPhoto: AlbumPhoto = {
            id: Date.now(),
            caption,
            image,
            stage: selectedStage,
            level: selectedLevel,
            class: selectedClass,
            date: new Date(),
            status: 'pending'
        };
        await updateSchoolData(school => ({ ...school, albumPhotos: [...school.albumPhotos, newPhoto] }));
    };

    const handleDeleteAlbumPhoto = async (id: number) => {
        await updateSchoolData(school => ({ ...school, albumPhotos: school.albumPhotos.filter(p => p.id !== id) }));
    };
    
    const handleApproveAlbumPhoto = async (photoId: number) => {
        await updateSchoolData(school => {
            const photoToApprove = school.albumPhotos.find(p => p.id === photoId);
            if (!photoToApprove) return school;

            const studentsInClass = school.students.filter(s => s.level === photoToApprove.level && s.class === photoToApprove.class);
            const notificationMessage = t('notificationNewPhoto');
            const newNotifications: Notification[] = studentsInClass.map(student => ({
                id: Date.now() + Math.random(),
                studentId: student.id,
                message: notificationMessage,
                date: new Date(),
                read: false,
            }));
            
            return {
                ...school,
                albumPhotos: school.albumPhotos.map(p => p.id === photoId ? { ...p, status: 'approved' } : p),
                notifications: [...school.notifications, ...newNotifications]
            };
        });
    };

    const handleRejectAlbumPhoto = async (photoId: number) => {
        await updateSchoolData(school => ({
            ...school,
            albumPhotos: school.albumPhotos.filter(p => p.id !== photoId)
        }));
    };
    
    const handleSaveUnifiedAssessment = async (title: string, data: { image?: string; pdf?: { name: string; url: string; } }) => {
        if (!selectedSubject || !selectedStage) return;
        const newAssessment: UnifiedAssessment = { id: Date.now(), title, ...data, stage: selectedStage, level: selectedLevel, subject: selectedSubject, date: new Date() };
        await updateSchoolData(school => {
            const studentsInLevel = school.students.filter(s => s.level === selectedLevel);
            const notificationMessage = t('notificationNewUnifiedAssessment', { subject: selectedSubject! });
            const newNotifications: Notification[] = studentsInLevel.map(student => ({
                id: Date.now() + Math.random(),
                studentId: student.id,
                message: notificationMessage,
                date: new Date(),
                read: false,
            }));
            return {
                ...school,
                unifiedAssessments: [...school.unifiedAssessments, newAssessment],
                notifications: [...school.notifications, ...newNotifications]
            };
        });
    };
    
    const handleDeleteUnifiedAssessment = async (id: number) => {
        await updateSchoolData(school => ({ ...school, unifiedAssessments: school.unifiedAssessments.filter(a => a.id !== id) }));
    };

    // TALKING CARDS HANDLERS
    const handleAnalyzeImageForTalkingCard = async (image: string): Promise<Hotspot[]> => {
        if (!process.env.API_KEY) return Promise.reject(new Error('API key is not configured.'));

        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: image.split(',')[1],
            },
        };

        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    label: { type: Type.STRING, description: 'The name of the object in Arabic.' },
                    box: {
                        type: Type.OBJECT,
                        properties: {
                            x: { type: Type.NUMBER, description: 'The top-left x-coordinate as a percentage of the image width (0.0 to 1.0).' },
                            y: { type: Type.NUMBER, description: 'The top-left y-coordinate as a percentage of the image height (0.0 to 1.0).' },
                            width: { type: Type.NUMBER, description: 'The width as a percentage of the image width (0.0 to 1.0).' },
                            height: { type: Type.NUMBER, description: 'The height as a percentage of the image height (0.0 to 1.0).' },
                        },
                        required: ['x', 'y', 'width', 'height'],
                    },
                },
                required: ['label', 'box'],
            },
        };

        const prompt = `Analyze the image to identify the main, distinct objects suitable for a child to learn. For each object, provide its name in Arabic and its bounding box. The bounding box coordinates (x, y) and dimensions (width, height) must be percentages of the total image dimensions (values between 0 and 1). Output must be a JSON array of objects, strictly following the provided schema.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, imagePart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
            }
        });
        
        return JSON.parse(response.text);
    };

    const handleSaveTalkingCard = async (image: string, hotspots: Hotspot[]) => {
        if (!selectedStage) return;
        const newCard: TalkingCard = {
            id: Date.now(),
            stage: selectedStage,
            level: selectedLevel,
            class: selectedClass,
            image,
            hotspots,
            date: new Date(),
        };
        await updateSchoolData(school => {
            const studentsInClass = school.students.filter(s => s.level === selectedLevel && s.class === selectedClass);
            const notificationMessage = t('notificationNewTalkingCard' as any);
            const newNotifications: Notification[] = studentsInClass.map(student => ({
                id: Date.now() + Math.random(),
                studentId: student.id,
                message: notificationMessage,
                date: new Date(),
                read: false,
            }));
            return { 
                ...school, 
                talkingCards: [...school.talkingCards, newCard],
                notifications: [...school.notifications, ...newNotifications]
            };
        });
    };

    const handleDeleteTalkingCard = async (id: number) => {
        await updateSchoolData(school => ({ ...school, talkingCards: school.talkingCards.filter(c => c.id !== id)}));
    };


    const renderPage = () => {
      if (isLoading) {
          return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold">Loading...</div></div>;
      }
      if (!selectedSchool && userRole !== UserRole.SuperAdmin) {
        return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
      }
      if (selectedSchool && !selectedSchool.isActive && userRole !== UserRole.SuperAdmin && !isSuperAdminImpersonating) {
        return <MaintenanceScreen onLogout={handleLogout} />;
      }
  
      const studentsInClass = selectedSchool?.students.filter(s => s.stage === selectedStage && s.level === selectedLevel && s.class === selectedClass) || [];
  
      switch (currentPage) {
        case Page.UnifiedLogin:
          return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;

        // SUPER ADMIN
        case Page.SuperAdminDashboard:
            return <SuperAdminDashboard schools={schools} onAddSchool={handleAddSchool} onDeleteSchool={handleDeleteSchool} onManageSchool={handleManageSchool} onLogout={handleLogout} />;
        case Page.SuperAdminSchoolManagement:
            const schoolForView = schools.find(s => s.id === schoolForSuperAdminViewId);
            return schoolForView ? <SuperAdminSchoolManagement school={schoolForView} onToggleStatus={handleToggleSchoolStatus} onToggleStage={handleToggleSchoolStage} onToggleFeatureFlag={handleToggleFeatureFlag} onEnterFeaturePage={handleEnterFeaturePage} onBack={goBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} onAddPrincipal={handleAddPrincipal} onDeletePrincipal={handleDeletePrincipal} onUpdatePrincipalCode={handleUpdatePrincipalCode}/> : null;
  
        // TEACHER
        case Page.TeacherDashboard:
          return currentTeacher && selectedSchool && <TeacherDashboard school={selectedSchool} teacher={currentTeacher} onSelectionComplete={handleLevelAndSubjectSelect} onBack={goBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
        case Page.TeacherClassSelection:
            const classesForLevel = currentTeacher?.assignments[selectedLevel] || [];
            return currentTeacher && <TeacherClassSelection classes={classesForLevel} onSelectClass={handleSelectClass} onBack={goBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
        case Page.TeacherActionMenu:
          return selectedSchool && <TeacherActionMenu school={selectedSchool} selectedLevel={selectedLevel} onSelectAction={navigateTo} onBack={goBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
        case Page.TeacherManageSummaries:
            return selectedSchool && selectedSubject && <TeacherContentForm title={t('summaries')} items={selectedSchool.summaries.filter(s => s.stage === selectedStage && s.level === selectedLevel && s.class === selectedClass && s.subject === selectedSubject)} onSave={handleSaveSummary} onDelete={handleDeleteSummary} onBack={goBack} onLogout={handleLogout} showTitleField />;
        case Page.TeacherManageExercises:
            return selectedSchool && selectedSubject && <TeacherContentForm title={t('exercises')} items={selectedSchool.exercises.filter(e => e.stage === selectedStage && e.level === selectedLevel && e.class === selectedClass && e.subject === selectedSubject)} onSave={handleSaveExercise} onDelete={handleDeleteExercise} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherManageNotes:
            return selectedSchool && selectedSubject && <TeacherNotesForm students={studentsInClass} notes={selectedSchool.notes.filter(n => n.level === selectedLevel && n.class === selectedClass && n.subject === selectedSubject)} absences={selectedSchool.absences.filter(a => a.level === selectedLevel && a.class === selectedClass && a.subject === selectedSubject)} onSave={handleSaveNote} onDeleteNote={handleDeleteNote} onDeleteAbsence={handleDeleteAbsence} onMarkAbsent={handleSaveAbsence} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherStudentSelection:
            return <TeacherStudentSelection students={studentsInClass} onSelectStudent={handleSelectStudentForGrading} onBack={goBack} onLogout={handleLogout} title={t('studentGrades')} />;
        case Page.TeacherStudentGrades:
            return studentForGrading && selectedSubject && <TeacherStudentGrades student={studentForGrading} subject={selectedSubject} initialGrades={studentForGrading.grades[selectedSubject] || getBlankGrades(selectedSubject)} onSave={handleSaveGrades} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherManageExamProgram:
            return selectedSchool && selectedSubject && <TeacherExamProgramForm programs={selectedSchool.examPrograms.filter(p => p.level === selectedLevel && p.class === selectedClass && p.subject === selectedSubject)} onSave={handleSaveExamProgram} onDelete={handleDeleteExamProgram} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherGenerateReportCard:
            return <TeacherGenerateReportCard students={studentsInClass} onSelectStudent={handleSelectStudentForReport} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherStudentReportGeneration:
            return studentForReport && selectedSubject && <TeacherStudentReportGeneration student={studentForReport} subject={selectedSubject} onGenerateComment={handleGenerateAIComment} onSendForReview={handleSendNoteForReview} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherViewAnnouncements:
            return selectedSchool && currentTeacher && <TeacherViewAnnouncements announcements={selectedSchool.announcements.filter(a => a.targetAudience === 'teachers' && (!a.teacherIds || a.teacherIds.length === 0 || a.teacherIds.includes(currentTeacher.id)))} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherAddSupplementaryLesson:
            return selectedSchool && selectedSubject && <TeacherAddSupplementaryLesson lessons={selectedSchool.supplementaryLessons.filter(l => l.level === selectedLevel && l.class === selectedClass && l.subject === selectedSubject)} onSave={handleSaveSupplementaryLesson} onDelete={handleDeleteSupplementaryLesson} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherAddUnifiedAssessment:
            return selectedSchool && selectedSubject && <TeacherAddUnifiedAssessment assessments={selectedSchool.unifiedAssessments.filter(a => a.level === selectedLevel && a.subject === selectedSubject)} onSave={handleSaveUnifiedAssessment} onDelete={handleDeleteUnifiedAssessment} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherAddTimetable:
            return selectedSchool && <TeacherAddTimetable timetables={selectedSchool.timetables.filter(t => t.level === selectedLevel && t.class === selectedClass)} onSave={handleSaveTimetable} onDelete={handleDeleteTimetable} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherAddQuiz:
            return selectedSchool && selectedSubject && <TeacherAddQuiz quizzes={selectedSchool.quizzes.filter(q => q.level === selectedLevel && q.class === selectedClass && q.subject === selectedSubject)} onSave={handleSaveQuiz} onDelete={handleDeleteQuiz} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherAddProject:
            return selectedSchool && selectedSubject && <TeacherAddProject projects={selectedSchool.projects.filter(p => p.level === selectedLevel && p.class === selectedClass && p.subject === selectedSubject)} onSave={handleSaveProject} onDelete={handleDeleteProject} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherAddLibrary:
            return selectedSchool && selectedSubject && <TeacherAddLibrary libraryItems={selectedSchool.libraryItems.filter(i => i.level === selectedLevel && i.class === selectedClass && i.subject === selectedSubject)} onSave={handleSaveLibraryItem} onDelete={handleDeleteLibraryItem} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherLessonPlanner:
            return <TeacherLessonPlanner onGenerate={() => Promise.resolve("AI Planner response")} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherStudentSelectionForExercises:
            return <TeacherStudentSelection students={studentsInClass} onSelectStudent={handleSelectStudentForExercises} onBack={goBack} onLogout={handleLogout} title={t('selectStudentForExercises')} />;
        case Page.TeacherPersonalizedExercises:
            return studentForPersonalizedExercises && selectedSubject && <TeacherPersonalizedExercises student={studentForPersonalizedExercises} subject={selectedSubject} onGenerate={handleGeneratePersonalizedExercises} onSave={handleSavePersonalizedExercises} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherManageAlbum:
            return selectedSchool && <TeacherManageAlbum photos={selectedSchool.albumPhotos.filter(p => p.level === selectedLevel && p.class === selectedClass)} onSave={handleSaveAlbumPhoto} onDelete={handleDeleteAlbumPhoto} onBack={goBack} onLogout={handleLogout} />;
        case Page.TeacherManageTalkingCards:
            return selectedSchool && <TeacherManageTalkingCards cards={selectedSchool.talkingCards.filter(c => c.level === selectedLevel && c.class === selectedClass)} onAnalyze={handleAnalyzeImageForTalkingCard} onSave={handleSaveTalkingCard} onDelete={handleDeleteTalkingCard} onBack={goBack} onLogout={handleLogout} />;

        // GUARDIAN
        case Page.GuardianDashboard:
          return currentStudent && selectedSchool && <GuardianDashboard school={selectedSchool} student={currentStudent} notifications={selectedSchool.notifications.filter(n => n.studentId === currentStudent.id)} onSelectSubject={handleGuardianSelectSubject} navigateTo={navigateTo} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
        case Page.GuardianSubjectMenu:
          return currentStudent && selectedSubject && selectedSchool && <GuardianSubjectMenu school={selectedSchool} subject={selectedSubject} onSelectAction={navigateTo} onBack={goBack} onLogout={handleLogout} studentLevel={currentStudent.level} />;
        case Page.GuardianViewSummaries:
          return selectedSchool && currentStudent && selectedSubject && <GuardianViewContent title={t('summaries')} items={selectedSchool.summaries.filter(s => s.stage === currentStudent.stage && s.level === currentStudent.level && s.class === currentStudent.class && s.subject === selectedSubject).sort((a,b) => b.id - a.id)} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewExercises:
          return selectedSchool && currentStudent && selectedSubject && <GuardianViewContent title={t('exercises')} items={selectedSchool.exercises.filter(e => e.stage === currentStudent.stage && e.level === currentStudent.level && e.class === currentStudent.class && e.subject === selectedSubject).sort((a,b) => b.id - a.id)} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewNotes:
          return selectedSchool && currentStudent && selectedSubject && <GuardianViewNotes title={t('guardianNotesTitle')} notes={selectedSchool.notes.filter(n => n.studentIds.includes(currentStudent.id) && n.subject === selectedSubject && n.status === 'approved')} absences={selectedSchool.absences.filter(a => a.studentId === currentStudent.id && a.subject === selectedSubject)} student={currentStudent} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewGrades:
          return currentStudent && selectedSubject && <GuardianViewGrades student={currentStudent} subject={selectedSubject} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewExamProgram:
          return selectedSchool && currentStudent && selectedSubject && <GuardianViewExamProgram programs={selectedSchool.examPrograms.filter(p => p.stage === currentStudent.stage && p.level === currentStudent.level && p.class === currentStudent.class && p.subject === selectedSubject)} isFrenchUI={language === 'fr'} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewSupplementaryLessons:
          return selectedSchool && currentStudent && selectedSubject && <GuardianViewSupplementaryLessons lessons={selectedSchool.supplementaryLessons.filter(l => l.stage === currentStudent.stage && l.level === currentStudent.level && l.class === currentStudent.class && l.subject === selectedSubject)} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewUnifiedAssessments:
          return selectedSchool && currentStudent && selectedSubject && <GuardianViewUnifiedAssessments assessments={selectedSchool.unifiedAssessments.filter(a => a.stage === currentStudent.stage && a.level === currentStudent.level && a.subject === selectedSubject)} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewTimetable:
          return selectedSchool && currentStudent && <GuardianViewTimetable timetables={selectedSchool.timetables.filter(t => t.stage === currentStudent.stage && t.level === currentStudent.level && t.class === currentStudent.class)} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewQuizzes:
          return selectedSchool && currentStudent && selectedSubject && <GuardianViewQuizzes quizzes={selectedSchool.quizzes.filter(q => q.stage === currentStudent.stage && q.level === currentStudent.level && q.class === currentStudent.class && q.subject === selectedSubject)} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewProjects:
          return selectedSchool && currentStudent && selectedSubject && <GuardianViewProjects projects={selectedSchool.projects.filter(p => p.stage === currentStudent.stage && p.level === currentStudent.level && p.class === currentStudent.class && p.subject === selectedSubject)} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewLibrary:
          return selectedSchool && currentStudent && selectedSubject && <GuardianViewLibrary items={selectedSchool.libraryItems.filter(i => i.stage === currentStudent.stage && i.level === currentStudent.level && i.class === currentStudent.class && i.subject === selectedSubject)} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianNotifications:
          return selectedSchool && currentStudent && <GuardianNotifications notifications={selectedSchool.notifications.filter(n => n.studentId === currentStudent.id)} onMarkRead={handleMarkAsRead} onBack={goBack} />;
        case Page.GuardianViewAnnouncements:
          return selectedSchool && <GuardianViewAnnouncements announcements={selectedSchool.announcements.filter(a => a.targetAudience === 'guardians')} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewEducationalTips:
          return selectedSchool && <GuardianViewEducationalTips tips={selectedSchool.educationalTips} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianSubmitComplaint:
          return <GuardianSubmitComplaint onSubmit={handleAddComplaint} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianMonthlyFees:
          return selectedSchool && currentStudent && <GuardianMonthlyFees student={currentStudent} school={selectedSchool} payments={selectedSchool.monthlyFeePayments.filter(p => p.studentId === currentStudent.id)} onPay={handleGuardianPayFee} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianRequestInterview:
          return currentStudent && <GuardianRequestInterview student={currentStudent} onRequest={handleRequestInterview} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewPersonalizedExercises:
          return selectedSchool && currentStudent && selectedSubject && <GuardianViewPersonalizedExercises exercises={selectedSchool.personalizedExercises.filter(e => e.studentId === currentStudent.id && e.subject === selectedSubject)} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewAlbum:
          return selectedSchool && currentStudent && <GuardianViewAlbum photos={selectedSchool.albumPhotos.filter(p => p.level === currentStudent.level && p.class === currentStudent.class && p.status === 'approved')} onBack={goBack} onLogout={handleLogout} />;
        case Page.GuardianViewTalkingCards:
            return selectedSchool && currentStudent && <GuardianViewTalkingCards cards={selectedSchool.talkingCards.filter(c => c.stage === currentStudent.stage && c.level === currentStudent.level && c.class === currentStudent.class)} onBack={goBack} onLogout={handleLogout} />;

        // PRINCIPAL
        case Page.PrincipalStageSelection:
            return selectedSchool && <PrincipalStageSelection school={selectedSchool} accessibleStages={principalStages} onSelectStage={handleStageSelect} onBack={handleLogout} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>
        case Page.PrincipalDashboard:
          return selectedSchool && selectedStage && <PrincipalDashboard school={selectedSchool} stage={selectedStage} onSelectAction={navigateTo} onLogout={handleLogout} onBack={goBack} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
        case Page.PrincipalManageTeachers:
            return selectedSchool && selectedStage && <PrincipalManageTeachers stage={selectedStage} teachers={selectedSchool.teachers} onAddTeacher={handleAddTeacher} onUpdateTeacher={handleUpdateTeacher} onDeleteTeacher={handleDeleteTeacher} onBack={goBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
        case Page.PrincipalManageStudents:
            return selectedSchool && selectedStage && <PrincipalManageStudents stage={selectedStage} students={selectedSchool.students.filter(s => s.stage === selectedStage)} onAddStudent={handleAddStudent} onAddMultipleStudents={handleAddMultipleStudents} onUpdateStudent={handleUpdateStudent} onDeleteStudent={handleDeleteStudent} onBack={goBack} onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>;
        case Page.PrincipalManagementMenu:
            return selectedSchool && selectedStage && <PrincipalManagementMenu school={selectedSchool} stage={selectedStage} onSelectAction={navigateTo} onBack={goBack} onLogout={handleLogout} />;
        case Page.PrincipalReviewNotes:
            return selectedSchool && selectedStage && <PrincipalReviewNotes notes={selectedSchool.notes.filter(n => n.status === 'pending' && n.stage === selectedStage)} students={selectedSchool.students} onApprove={handlePrincipalApproveNote} onReject={handlePrincipalRejectNote} onBack={goBack} onLogout={handleLogout} />;
        case Page.PrincipalAnnouncements:
            return selectedSchool && <PrincipalAnnouncements announcements={selectedSchool.announcements} teachers={selectedSchool.teachers} onAddAnnouncement={handleAddAnnouncement} onBack={goBack} onLogout={handleLogout} />;
        case Page.PrincipalComplaints:
            return selectedSchool && <PrincipalComplaints complaints={selectedSchool.complaints} students={selectedSchool.students} onAnalyze={handleAnalyzeComplaints} onBack={goBack} onLogout={handleLogout} />;
        case Page.PrincipalEducationalTips:
            return selectedSchool && <PrincipalEducationalTips tips={selectedSchool.educationalTips} onAddTip={handleAddEducationalTip} onGenerateAITip={handleGenerateAITip} onBack={goBack} onLogout={handleLogout} />;
        case Page.PrincipalPerformanceTracking:
            return selectedSchool && selectedStage && <PrincipalPerformanceTracking stage={selectedStage} students={selectedSchool.students.filter(s => s.stage === selectedStage)} onBack={goBack} onLogout={handleLogout} />;
        case Page.PrincipalBrowseAsTeacherSelection:
            return selectedSchool && selectedStage && <PrincipalBrowseAsTeacherSelection stage={selectedStage} onSelectionComplete={handleSetPrincipalImpersonating} onBack={goBack} onLogout={handleLogout} />;
        case Page.PrincipalMonthlyFees:
            return selectedSchool && selectedStage && <PrincipalMonthlyFees school={selectedSchool} stage={selectedStage} students={selectedSchool.students.filter(s => s.stage === selectedStage)} payments={selectedSchool.monthlyFeePayments} onMarkAsPaid={handleMarkFeeAsPaid} onBack={goBack} onLogout={handleLogout} />;
        case Page.PrincipalInterviewRequests:
            return selectedSchool && <PrincipalInterviewRequests requests={selectedSchool.interviewRequests} students={selectedSchool.students} onComplete={handleCompleteInterview} onBack={goBack} onLogout={handleLogout} />;
        case Page.PrincipalFeeManagement:
            return selectedSchool && <PrincipalFeeManagement school={selectedSchool} onUpdateFees={handleUpdateFees} onBack={goBack} onLogout={handleLogout} />;
        case Page.PrincipalReviewAlbum:
            return selectedSchool && selectedStage && <PrincipalReviewAlbum pendingPhotos={selectedSchool.albumPhotos.filter(p => p.status === 'pending' && p.stage === selectedStage)} onApprove={handleApproveAlbumPhoto} onReject={handleRejectAlbumPhoto} onBack={goBack} onLogout={handleLogout} />;

        default:
          return <div>Page not implemented yet: {Page[currentPage]}</div>;
      }
    };
  
    return (
      <div className="container mx-auto p-4 flex justify-center items-start min-h-screen">
        <div className="w-full max-w-2xl">
          {renderPage()}
          <FeedbackModal 
            isOpen={isFeedbackModalOpen}
            onSubmit={handleFeedbackSubmit}
            onClose={handleFeedbackDismiss}
          />
        </div>
      </div>
    );
  }
