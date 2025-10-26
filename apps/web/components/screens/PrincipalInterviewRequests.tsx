import React from 'react';
import { InterviewRequest, Student, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface PrincipalInterviewRequestsProps {
    school: School;
    requests: InterviewRequest[];
    students: Student[];
    onComplete: (requestId: number) => void;
    onBack: () => void;
    onLogout: () => void;
    isDesktop?: boolean;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const PrincipalInterviewRequests: React.FC<PrincipalInterviewRequestsProps> = ({ school, requests, students, onComplete, onBack, onLogout, isDesktop = false, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    
    const getStudentName = (studentId: string) => {
        return students.find(s => s.id === studentId)?.name || 'Unknown Student';
    };
    
    const sortedRequests = [...requests].sort((a,b) => a.date.getTime() - b.date.getTime());

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-purple-600 dark:border-purple-500 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('interviewRequests')}</h1>

            <div className="max-h-[70vh] overflow-y-auto space-y-4 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {sortedRequests.length > 0 ? sortedRequests.map(request => (
                    <div key={request.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {t('requestFrom', { studentName: getStudentName(request.studentId) })}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {new Date(request.date).toLocaleString('ar-DZ', { dateStyle: 'full', timeStyle: 'short' })}
                        </p>
                        <button 
                            onClick={() => onComplete(request.id)}
                            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition"
                        >
                            {t('markAsCompleted')}
                        </button>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">{t('noInterviewRequests')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                 <div className="w-1/2">
                    <BackButton onClick={onBack} />
                </div>
                <div className="w-1/2">
                    <LogoutButton onClick={onLogout} />
                </div>
            </div>
        </div>
    );
};

export default PrincipalInterviewRequests;