import React, { useState } from 'react';
import { Subject, Teacher, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import { SUBJECT_ICONS } from '../../../../packages/core/constants';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface TeacherDashboardProps {
    school: School;
    onSelectionComplete: (level: string, subject: Subject) => void;
    onBack: () => void;
    onLogout: () => void;
    teacher: Teacher;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    isImpersonating?: boolean;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ school, onSelectionComplete, onBack, onLogout, teacher, toggleDarkMode, isDarkMode, isImpersonating = false }) => {
    const { t } = useTranslation();
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
        teacher.subjects.length === 1 ? teacher.subjects[0] : null
    );

    const teacherLevels = Object.keys(teacher.assignments);
    const isSelectionComplete = selectedLevel && selectedSubject;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl text-center border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in relative">
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{isImpersonating ? t('browseAsTeacher') : t('teacherDashboardTitle')}</h1>
            <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t('teacherSelectLevelAndSubject')}</h2>

            <div className="space-y-8">
                {/* Level Selection */}
                <div>
                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-4">{t('level')}</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {teacherLevels.map(level => (
                            <button
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md transform hover:scale-105
                                    ${selectedLevel === level ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}
                                `}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subject Selection */}
                {teacher.subjects.length > 1 ? (
                    <div>
                        <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-4">{t('subject')}</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {teacher.subjects.map(subject => (
                                <button
                                    key={subject}
                                    onClick={() => setSelectedSubject(subject)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md transform hover:scale-105 flex items-center gap-2
                                        ${selectedSubject === subject ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}
                                    `}
                                >
                                    <span>{SUBJECT_ICONS[subject]}</span>
                                    {t(subject as any)}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                     <div>
                        <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-4">{t('subject')}</h3>
                        <div className="p-4 rounded-lg font-bold text-lg bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                           {t(teacher.subjects[0] as any)}
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={() => onSelectionComplete(selectedLevel, selectedSubject!)}
                disabled={!isSelectionComplete}
                className="w-full mt-10 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg text-lg disabled:bg-blue-300 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105"
            >
                {t('next')}
            </button>
            
            {isImpersonating ? (
                <div className="mt-8">
                    <BackButton onClick={onBack} />
                </div>
            ) : (
                <div className="mt-6 flex items-center gap-4">
                    <BackButton onClick={onBack} />
                    <LogoutButton onClick={onLogout} />
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;