
import React from 'react';
import { Student, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianRequestInterviewProps {
    student: Student;
    school: School;
    onRequest: (studentId: string) => void;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianRequestInterview: React.FC<GuardianRequestInterviewProps> = ({ student, school, onRequest, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();

    const handleRequest = () => {
        if (window.confirm(t('confirmRequestInterview'))) {
            onRequest(student.id);
            alert(t('requestSent'));
            onBack();
        }
    };

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('requestInterview')}</h1>
            
            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner text-center">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{t('requestInterviewPrompt')}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">{student.name}</p>
                
                <button
                    onClick={handleRequest}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition shadow-lg text-lg"
                >
                    {t('confirm')}
                </button>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianRequestInterview;
