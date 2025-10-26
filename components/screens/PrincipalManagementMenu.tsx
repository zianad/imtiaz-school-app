
import React from 'react';
import { Page, School, EducationalStage } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import { useTranslation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher';

interface PrincipalManagementMenuProps {
    school: School;
    stage: EducationalStage;
    onSelectAction: (page: Page) => void;
    onBack: () => void;
    onLogout: () => void;
}

const PrincipalManagementMenu: React.FC<PrincipalManagementMenuProps> = ({ school, stage, onSelectAction, onBack, onLogout }) => {
    const { t } = useTranslation();
    
    const teacherCount = school.teachers.length;
    const studentCount = school.students.filter(s => s.stage === stage).length;

    const actions = [
        { label: `${t('manageTeachers')} (${teacherCount})`, page: Page.PrincipalManageTeachers, icon: '👨‍🏫' },
        { label: `${t('manageStudents')} (${studentCount})`, page: Page.PrincipalManageStudents, icon: '🎓' },
        { label: t('manageFees'), page: Page.PrincipalFeeManagement, icon: '💰' },
    ];

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-slate-700 animate-fade-in w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">{t('schoolManagement')}</h1>

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
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default PrincipalManagementMenu;
