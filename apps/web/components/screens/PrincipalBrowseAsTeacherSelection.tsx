import React, { useState } from 'react';
import { Subject, EducationalStage, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import { STAGE_DETAILS, CLASSES, SUBJECT_ICONS } from '../../../../packages/core/constants';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface PrincipalBrowseAsTeacherSelectionProps {
    school: School;
    stage: EducationalStage;
    onSelectionComplete: (level: string, subject: Subject, className: string) => void;
    onBack: () => void;
    onLogout: () => void;
    isDesktop?: boolean;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const PrincipalBrowseAsTeacherSelection: React.FC<PrincipalBrowseAsTeacherSelectionProps> = ({ school, stage, onSelectionComplete, onBack, onLogout, isDesktop = false, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>('');

    const isSelectionComplete = selectedLevel && selectedSubject && selectedClass;

    const stageDetails = STAGE_DETAILS[stage];
    const availableLevels = stageDetails.levels;
    const availableSubjects = stageDetails.subjects;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl text-center border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in relative w-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('selectLevelAndSubjectPrompt')}</h1>

            {/* Level Selection */}
            <div className="mb-6">
                <h3 className="font-bold text-xl text-gray-700 dark:text-gray-200 mb-3">{t('level')}</h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {availableLevels.map(level => (
                        <button
                            key={level}
                            onClick={() => setSelectedLevel(level)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow
                                ${selectedLevel === level ? 'bg-slate-700 text-white ring-2 ring-offset-2 ring-slate-500' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500'}
                            `}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            {/* Subject Selection */}
            <div className="mb-6">
                <h3 className="font-bold text-xl text-gray-700 dark:text-gray-200 mb-3">{t('subject')}</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                     {availableSubjects.map(subject => (
                         <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`p-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-md flex flex-col items-center justify-center space-y-2 transform hover:-translate-y-1
                                ${selectedSubject === subject ? 'bg-white dark:bg-gray-700 ring-4 ring-offset-0 ring-teal-400' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'}
                            `}
                        >
                            <span className="text-4xl">
                                {SUBJECT_ICONS[subject] || '📖'}
                            </span>
                            <span className="text-gray-700 dark:text-gray-200 text-sm">{t(subject as any)}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Class Selection */}
             <div className="mb-8">
                <h3 className="font-bold text-xl text-gray-700 dark:text-gray-200 mb-3">{t('class')}</h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {CLASSES.map(cls => (
                        <button
                            key={cls}
                            onClick={() => setSelectedClass(cls)}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow
                                ${selectedClass === cls ? 'bg-slate-700 text-white ring-2 ring-offset-2 ring-slate-500' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500'}
                            `}
                        >
                            {cls}
                        </button>
                    ))}
                </div>
            </div>


            <button
                onClick={() => onSelectionComplete(selectedLevel, selectedSubject!, selectedClass)}
                disabled={!isSelectionComplete}
                className="w-full mt-4 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out shadow-lg text-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105"
            >
                {t('next')}
            </button>
            
            <div className="mt-6 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default PrincipalBrowseAsTeacherSelection;