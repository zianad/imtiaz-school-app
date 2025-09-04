
import React from 'react';
import { UnifiedAssessment, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianViewUnifiedAssessmentsProps {
    school: School;
    assessments: UnifiedAssessment[];
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewUnifiedAssessments: React.FC<GuardianViewUnifiedAssessmentsProps> = ({ school, assessments, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const sortedAssessments = [...assessments].sort((a,b) => b.date.getTime() - a.date.getTime());

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('unifiedAssessments')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {sortedAssessments.length > 0 ? (
                    sortedAssessments.map(assessment => (
                        <div key={assessment.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-blue-500 dark:border-blue-400">
                            <h2 className="font-bold text-lg text-blue-700 dark:text-blue-300">{assessment.title}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{new Date(assessment.date).toLocaleDateString()}</p>
                            {assessment.image && <img src={assessment.image} alt={assessment.title} className="rounded-md max-w-full h-auto mb-3" />}
                            {assessment.pdf && (
                                <a href={assessment.pdf.url} download={assessment.pdf.name} className="block w-full text-center mt-2 bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition">
                                    {t('download')} PDF
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">{t('noAssessments')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewUnifiedAssessments;
