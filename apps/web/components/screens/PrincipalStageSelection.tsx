import React, { useMemo } from 'react';
import { School, EducationalStage } from '../../../../packages/core/types';
import LogoutButton from '../common/LogoutButton';
import { useTranslation } from '../../../../packages/core/i18n';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface PrincipalStageSelectionProps {
    school: School;
    accessibleStages: EducationalStage[];
    onSelectStage: (stage: EducationalStage) => void;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const STAGE_COLORS: { [key in EducationalStage]: string } = {
    [EducationalStage.PRE_SCHOOL]: 'bg-purple-500 hover:bg-purple-600',
    [EducationalStage.PRIMARY]: 'bg-blue-500 hover:bg-blue-600',
    [EducationalStage.MIDDLE]: 'bg-teal-500 hover:bg-teal-600',
    [EducationalStage.HIGH]: 'bg-indigo-500 hover:bg-indigo-600',
};

const PrincipalStageSelection: React.FC<PrincipalStageSelectionProps> = ({ school, accessibleStages, onSelectStage, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    
    const stagesToDisplay = useMemo(() => {
        // Guard against all possible undefined/null/non-array props to prevent crashes.
        if (!school || !Array.isArray(school.stages) || !Array.isArray(accessibleStages)) {
            return [];
        }
        
        // Filter the school's active stages to only show the ones the principal can access.
        return school.stages.filter(stage => accessibleStages.includes(stage));
    }, [school, accessibleStages]);

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-t-8 border-gray-800 dark:border-gray-600 animate-fade-in text-center w-full relative">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                    <span className="font-bold text-xl text-gray-700 dark:text-gray-200">{school.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('selectStage')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{t('principalWelcome')}</p>

            <div className="space-y-4">
                {stagesToDisplay.length > 0 ? (
                    stagesToDisplay.map(stage => (
                        <button
                            key={stage}
                            onClick={() => onSelectStage(stage)}
                            className={`w-full text-white font-bold py-5 px-4 rounded-lg transition duration-300 ease-in-out shadow-lg text-xl transform hover:scale-105 ${STAGE_COLORS[stage]}`}
                        >
                            {t(`${stage.toLowerCase()}Stage` as any)}
                        </button>
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 py-4">
                        لا توجد مراحل تعليمية مخصصة لك حاليا. الرجاء التواصل مع المدير الخارق.
                    </p>
                )}
            </div>

            <div className="mt-8">
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default PrincipalStageSelection;
