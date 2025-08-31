import React from 'react';
import { Page, School, EducationalStage } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface PrincipalManagementMenuProps {
    school: School;
    stage: EducationalStage;
    onSelectAction: (page: Page) => void;
    onBack: () => void;
    onLogout: () => void;
    isDesktop?: boolean;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const PrincipalManagementMenu: React.FC<PrincipalManagementMenuProps> = ({ school, stage, onSelectAction, onBack, onLogout, isDesktop = false, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    
    const teacherCount = school.teachers.length;
    const studentCount = school.students.filter(s => s.stage === stage).length;

    const actions = [
        { label: `${t('manageTeachers')} (${teacherCount})`, page: Page.PrincipalManageTeachers, icon: '👨‍🏫' },
        { label: `${t('manageStudents')} (${studentCount})`, page: Page.PrincipalManageStudents, icon: '🎓' },
        { label: t('manageFees'), page: Page.PrincipalFeeManagement, icon: '💰' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-slate-700 animate-fade-in w-full relative">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">{t('schoolManagement')}</h1>

            <div className="space-y-4">
                {actions.map(action => (
                    <button
                        key={action.page}
                        onClick={() => onSelectAction(action.page)}
                        className="w-full font-bold py-5 px-4 rounded-xl transition duration-300 ease-in-out shadow-lg text-white flex items-center justify-center gap-4 transform hover:-translate-y-1 hover:shadow-2xl bg-blue-600 hover:bg-blue-700"
                    >
                       <span className="text-3xl">{action.icon}</span>
                       <span className="text-lg">{action.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-10 flex items-center gap-4">
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

export default PrincipalManagementMenu;