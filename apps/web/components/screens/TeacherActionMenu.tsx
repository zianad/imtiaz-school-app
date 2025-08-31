import React from 'react';
import { Page, School, SchoolFeature, EducationalStage } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import { getStageForLevel } from '../../../../packages/core/utils';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface TeacherActionMenuProps {
    onSelectAction: (page: Page) => void;
    onBack: () => void;
    onLogout: () => void;
    selectedLevel: string;
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const TeacherActionMenu: React.FC<TeacherActionMenuProps> = ({ onSelectAction, onBack, onLogout, selectedLevel, school, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const currentStage = getStageForLevel(selectedLevel);

    const actions: { label: string; page: Page; icon: string; isAI?: boolean; level?: string; feature: SchoolFeature, stage?: EducationalStage }[] = [
        { label: t('announcements'), page: Page.TeacherViewAnnouncements, icon: '📢', feature: 'teacherViewAnnouncements' },
        { label: t('summaries'), page: Page.TeacherManageSummaries, icon: '📝', feature: 'teacherManageSummaries' },
        { label: t('exercises'), page: Page.TeacherManageExercises, icon: '🏋️', feature: 'teacherManageExercises' },
        { label: t('notesAndAbsences'), page: Page.TeacherManageNotes, icon: '🗒️', feature: 'teacherManageNotesAndAbsences' },
        { label: t('studentGrades'), page: Page.TeacherStudentSelection, icon: '📊', feature: 'teacherManageGrades' },
        { label: t('examProgram'), page: Page.TeacherManageExamProgram, icon: '🗓️', feature: 'teacherManageExamProgram' },
        { label: t('memorizationHelper'), page: Page.TeacherManageMemorization, icon: '🧠', feature: 'teacherManageMemorization', isAI: true },
        { label: t('aiNotes'), page: Page.TeacherGenerateReportCard, isAI: true, icon: '✨', feature: 'teacherGenerateAiNotes' },
        { label: t('lessonPlanner'), page: Page.TeacherLessonPlanner, isAI: true, icon: '🧑‍🏫', feature: 'teacherLessonPlanner' },
        { label: t('personalizedExercises'), page: Page.TeacherStudentSelectionForExercises, isAI: true, icon: '🎯', feature: 'teacherPersonalizedExercises' },
        { label: t('supplementaryLessons'), page: Page.TeacherAddSupplementaryLesson, icon: '🏫', feature: 'teacherManageSupplementaryLessons' },
        { label: t('unifiedAssessments'), page: Page.TeacherAddUnifiedAssessment, icon: '🏆', level: 'المستوى السادس ابتدائي', feature: 'teacherManageUnifiedAssessments' },
        { label: t('timetable'), page: Page.TeacherAddTimetable, icon: '🕒', feature: 'teacherManageTimetable' },
        { label: t('quizzes'), page: Page.TeacherAddQuiz, icon: '✍️', feature: 'teacherManageQuizzes' },
        { label: t('unitProject'), page: Page.TeacherAddProject, icon: '🏗️', feature: 'teacherManageProjects' },
        { label: t('digitalLibrary'), page: Page.TeacherAddLibrary, icon: '📚', feature: 'teacherManageLibrary' },
        { label: t('classAlbum'), page: Page.TeacherManageAlbum, icon: '🖼️', feature: 'teacherManageAlbum' },
        { label: t('talkingCards'), page: Page.TeacherManageTalkingCards, icon: '🗣️', feature: 'teacherManageTalkingCards', isAI: true, stage: EducationalStage.PRE_SCHOOL },
    ];
    
    const availableActions = actions
        .filter(action => school.featureFlags[action.feature] !== false)
        .filter(action => !action.level || action.level === selectedLevel)
        .filter(action => !action.stage || action.stage === currentStage);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                    <span className="font-bold text-lg text-gray-700 dark:text-gray-200">{school.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">اختر الإجراء المطلوب</h1>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
                {availableActions.map(action => (
                    <button
                        key={action.page}
                        onClick={() => onSelectAction(action.page)}
                        className={`font-bold py-4 px-2 rounded-xl transition duration-300 ease-in-out shadow-lg text-center flex flex-col items-center justify-center space-y-2 transform hover:-translate-y-1 hover:shadow-2xl
                        ${action.page === Page.TeacherViewAnnouncements
                          ? 'bg-teal-500 text-white hover:bg-teal-600'
                          : (action.isAI 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-500 text-white hover:bg-blue-600')
                        }`}
                    >
                       <span className="text-4xl">{action.icon}</span>
                       <span className="text-sm md:text-base font-semibold">{action.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherActionMenu;