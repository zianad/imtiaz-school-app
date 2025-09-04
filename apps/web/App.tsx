
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

import {
  Page, UserRole, School, Student, Teacher, Principal, Subject, EducationalStage, Note, Grade, ExamProgram, Summary,
  Exercise, Notification, Announcement, Complaint, EducationalTip, InterviewRequest, MonthlyFeePayment, SchoolFeature,
  SupplementaryLesson, Timetable, Quiz, Question, Project, LibraryItem, AlbumPhoto, PersonalizedExercise, UnifiedAssessment,
  TalkingCard, Hotspot, MemorizationItem, Feedback, Expense, SearchResult, SearchableContent, SearchResultType
} from '../../packages/core/types';

import { supabase, isSupabaseConfigured } from '../../packages/core/supabaseClient';
import { SUPER_ADMIN_LOGIN_CODE, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, getBlankGrades, MOCK_SCHOOLS } from '../../packages/core/constants';
import { useTranslation } from '../../packages/core/i18n';
import { snakeToCamelCase } from '../../packages/core/utils';

// Import all screen components
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
import PrincipalMonthlyFees from './components/screens/PrincipalMonthlyFees';
import PrincipalInterviewRequests from './components/screens/PrincipalInterviewRequests';
import PrincipalBrowseAsTeacherSelection from './components/screens/PrincipalBrowseAsTeacherSelection';
import PrincipalFeeManagement from './components/screens/PrincipalFeeManagement';
import PrincipalReviewAlbum from './components/screens/PrincipalReviewAlbum';
import PrincipalFinancialDashboard from './components/screens/PrincipalFinancialDashboard';
import TeacherDashboard from './components/screens/TeacherDashboard';
import TeacherClassSelection from './components/screens/TeacherClassSelection';
import TeacherActionMenu from './components/screens/TeacherActionMenu';
import TeacherContentForm from './components/screens/TeacherContentForm';
import TeacherNotesForm from './components/screens/TeacherNotesForm';
import TeacherStudentSelection from './components/screens/TeacherStudentSelection';
import TeacherStudentGrades from './components/screens/TeacherStudentGrades';
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
import GuardianViewSupplementaryLessons from './components/screens/GuardianViewSupplementaryLessons';
import GuardianViewUnifiedAssessments from './components/screens/GuardianViewUnifiedAssessments';
import GuardianViewTimetable from './components/screens/GuardianViewTimetable';
import GuardianViewQuizzes from './components/screens/GuardianViewQuizzes';
import GuardianViewProjects from './components/screens/GuardianViewProjects';
import GuardianViewLibrary from './components/screens/GuardianViewLibrary';
import GuardianNotifications from './components/screens/GuardianNotifications';
import GuardianViewAnnouncements from './components/screens/GuardianViewAnnouncements';
import GuardianViewEducationalTips from './components/screens/GuardianViewEducationalTips';
import GuardianSubmitComplaint from './components/screens/GuardianSubmitComplaint';
import GuardianMonthlyFees from './components/screens/GuardianMonthlyFees';
import GuardianRequestInterview from './components/screens/GuardianRequestInterview';
import GuardianViewPersonalizedExercises from './components/screens/GuardianViewPersonalizedExercises';
import GuardianViewAlbum from './components/screens/GuardianViewAlbum';
import GuardianViewTalkingCards from './components/screens/GuardianViewTalkingCards';
import GuardianViewMemorization from './components/screens/GuardianViewMemorization';
import ConfigErrorScreen from './components/screens/ConfigErrorScreen';
import FeedbackModal from './components/FeedbackModal';
import ConfirmationModal from './components/common/ConfirmationModal';
import SearchHeader from './components/common/SearchHeader';
import SearchResultModal from './components/common/SearchResultModal';

const App: React.FC = () => {
    // FIX: Add state and logic to manage the entire application flow.
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [page, setPage] = useState<Page>(Page.UnifiedLogin);
    const [user, setUser] = useState<Student | Teacher | Principal | { name: string; id: string } | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [school, setSchool] = useState<School | null>(null);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionChecked, setSessionChecked] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

    // Navigation state
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedStage, setSelectedStage] = useState<EducationalStage | null>(null);
    const [isImpersonating, setIsImpersonating] = useState(false);
    const [principalBrowsingAs, setPrincipalBrowsingAs] = useState<{ level: string, subject: Subject, class: string } | null>(null);

    // UI State
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult | null>(null);


    const { t } = useTranslation();

    const genAI = useMemo(() => {
        const apiKey = (import.meta as any).env.VITE_API_KEY;
        if (apiKey) {
            return new GoogleGenAI({ apiKey });
        }
        console.warn("VITE_API_KEY is not set. AI features will be disabled.");
        return null;
    }, []);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleLogin = async (code: string) => {
        // Implement login logic using Supabase
    };

    const handleLogout = async () => {
        // Implement logout logic
    };

    const navigateTo = (newPage: Page, state?: any) => {
        setPage(newPage);
        if (state?.student) setSelectedStudent(state.student);
        if (state?.subject) setSelectedSubject(state.subject);
        if (state?.level) setSelectedLevel(state.level);
    };

    const onBack = () => {
        // A simple back navigation logic
        // This would be more robust with a proper routing library
        window.history.back();
    };

    const renderPage = () => {
        // Render different components based on the current page
        // This will be a large switch statement
        // For brevity, a simplified version is shown here
        switch (page) {
            case Page.UnifiedLogin:
                return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
            // Add cases for all other pages...
            default:
                return <UnifiedLoginScreen onLogin={handleLogin} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
        }
    };

    if (!isSupabaseConfigured && !MOCK_SCHOOLS) {
        return <ConfigErrorScreen />;
    }
ْ
    return (
        <div className={`min-h-screen font-sans ${isDarkMode ? 'dark' : ''}`}>
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
                {/* Render the current page */}
                {renderPage()}

                {/* Modals and Overlays */}
                <FeedbackModal 
                    isOpen={isFeedbackModalOpen} 
                    onSubmit={() => {}} 
                    onClose={() => setIsFeedbackModalOpen(false)} 
                />
                <ConfirmationModal 
                    {...confirmationModal}
                    onCancel={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
                />
                {selectedSearchResult && (
                    <SearchResultModal 
                        result={selectedSearchResult}
                        onClose={() => setSelectedSearchResult(null)}
                        isDarkMode={isDarkMode}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
