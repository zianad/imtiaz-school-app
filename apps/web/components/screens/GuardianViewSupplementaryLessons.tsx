import React from 'react';
import { SupplementaryLesson, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianViewSupplementaryLessonsProps {
    school: School;
    lessons: SupplementaryLesson[];
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewSupplementaryLessons: React.FC<GuardianViewSupplementaryLessonsProps> = ({ school, lessons, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const sortedLessons = [...lessons].sort((a,b) => b.id - a.id);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('supplementaryLessons')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {sortedLessons.length > 0 ? (
                    sortedLessons.map(lesson => (
                        <a 
                            key={lesson.id} 
                            href={lesson.externalLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500 dark:border-blue-400"
                        >
                            <p className="font-semibold text-lg text-blue-700 dark:text-blue-300">{lesson.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{lesson.externalLink}</p>
                        </a>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">{t('noLessons')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewSupplementaryLessons;