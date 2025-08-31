import React from 'react';
import { Page, Subject, School, SchoolFeature } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianSubjectMenuProps {
    subject: Subject;
    school: School;
    onSelectAction: (page: Page) => void;
    onBack: () => void;
    onLogout: () => void;
    studentLevel: string;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianSubjectMenu: React.FC<GuardianSubjectMenuProps> = ({ subject, school, onSelectAction, onBack, onLogout, studentLevel, toggleDarkMode, isDarkMode }) => {
    const { t, language } = useTranslation();
    const isFrenchUI = language === 'fr';

    const getActions = (): { label: string, page: Page, icon: string, level?: string, feature: SchoolFeature }[] => [
        { label: t('summaries'), page: Page.GuardianViewSummaries, icon: '📝', feature: 'guardianViewSummaries' },
        { label: t('exercises'), page: Page.GuardianViewExercises, icon: '🏋️', feature: 'guardianViewExercises' },
        { label: t('notes'), page: Page.GuardianViewNotes, icon: '🗒️', feature: 'guardianViewNotesAndAbsences' },
        { label: t('studentGrades'), page: Page.GuardianViewGrades, icon: '📊', feature: 'guardianViewGrades' },
        { label: t('examProgram'), page: Page.GuardianViewExamProgram, icon: '🗓️', feature: 'guardianViewExamProgram' },
        { label: t('personalizedExercises'), page: Page.GuardianViewPersonalizedExercises, icon: '🎯', feature: 'guardianViewPersonalizedExercises' },
        { label: t('supplementaryLessons'), page: Page.GuardianViewSupplementaryLessons, icon: '🏫', feature: 'guardianViewSupplementaryLessons' },
        { label: t('unifiedAssessments'), page: Page.GuardianViewUnifiedAssessments, icon: '🏆', level: 'المستوى السادس ابتدائي', feature: 'guardianViewUnifiedAssessments' },
        { label: t('timetable'), page: Page.GuardianViewTimetable, icon: '🕒', feature: 'guardianViewTimetable' },
        { label: t('quizzes'), page: Page.GuardianViewQuizzes, icon: '✍️', feature: 'guardianViewQuizzes' },
        { label: t('unitProject'), page: Page.GuardianViewProjects, icon: '🏗️', feature: 'guardianViewProjects' },
        { label: t('digitalLibrary'), page: Page.GuardianViewLibrary, icon: '📚', feature: 'guardianViewLibrary' },
    ];

    const actions = getActions();
    const title = isFrenchUI ? subject : `مادة ${subject}`;
    
    const availableActions = actions
        .filter(action => school.featureFlags[action.feature] !== false)
        .filter(action => !action.level || action.level === studentLevel);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl text-center border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{title}</h1>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
                {availableActions.map(action => (
                    <button
                        key={action.page}
                        onClick={() => onSelectAction(action.page)}
                        className="font-bold py-4 px-2 rounded-xl transition duration-300 ease-in-out shadow-lg text-center flex flex-col items-center justify-center space-y-2 transform hover:-translate-y-1 hover:shadow-2xl bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
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

export default GuardianSubjectMenu;