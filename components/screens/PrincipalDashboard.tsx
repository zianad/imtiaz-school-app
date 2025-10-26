
import React from 'react';
import { Page, School, SchoolFeature, EducationalStage } from '../../types';
import LogoutButton from '../LogoutButton';
import { useTranslation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeSwitcher from '../ThemeSwitcher';
import BackButton from '../BackButton';

interface PrincipalDashboardProps {
    school: School;
    stage: EducationalStage;
    onSelectAction: (page: Page) => void;
    onLogout: () => void;
    onBack: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const ActionButton: React.FC<{
    label: string;
    icon: string;
    onClick: () => void;
    color: string;
    fullWidth?: boolean;
}> = ({ label, icon, onClick, color, fullWidth = false }) => (
    <button
        onClick={onClick}
        className={`font-bold py-5 px-4 rounded-xl transition duration-300 ease-in-out shadow-lg text-white flex items-center justify-center gap-3 transform hover:-translate-y-1 hover:shadow-2xl ${color} ${fullWidth ? 'col-span-2' : ''}`}
    >
        <span className="text-2xl">{icon}</span>
        <span className="text-md md:text-lg">{label}</span>
    </button>
);

const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({ school, stage, onSelectAction, onLogout, onBack, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();

    const allActions: { feature: SchoolFeature, label: string; icon: string; page: Page; color: string; fullWidth?: boolean }[] = [
        {
            feature: 'statisticsDashboard',
            label: t('statisticsDashboard'),
            icon: "📊",
            page: Page.PrincipalPerformanceTracking,
            color: "bg-indigo-500 hover:bg-indigo-600",
        },
        {
            feature: 'educationalTips',
            label: t('educationalTips'),
            icon: "💡",
            page: Page.PrincipalEducationalTips,
            color: "bg-cyan-600 hover:bg-cyan-700"
        },
        {
            feature: 'announcements',
            label: t('announcements'),
            icon: "📢",
            page: Page.PrincipalAnnouncements,
            color: "bg-sky-600 hover:bg-sky-700"
        },
         {
            feature: 'complaintsAndSuggestions',
            label: t('complaintsAndSuggestions'),
            icon: "✍️",
            page: Page.PrincipalComplaints,
            color: "bg-orange-600 hover:bg-orange-700"
        },
        {
            feature: 'reviewNotes',
            label: t('reviewNotes'),
            icon: "🗒️",
            page: Page.PrincipalReviewNotes,
            color: "bg-emerald-500 hover:bg-emerald-600"
        },
        {
            feature: 'reviewAlbumPhotos',
            label: t('reviewAlbumPhotos'),
            icon: "🖼️",
            page: Page.PrincipalReviewAlbum,
            color: "bg-fuchsia-500 hover:bg-fuchsia-600"
        },
         {
            feature: 'monthlyFees',
            label: t('monthlyFees'),
            icon: "💰",
            page: Page.PrincipalMonthlyFees,
            color: "bg-green-500 hover:bg-green-600"
        },
         {
            feature: 'interviewRequests',
            label: t('interviewRequests'),
            icon: "🤝",
            page: Page.PrincipalInterviewRequests,
            color: "bg-purple-500 hover:bg-purple-600"
        },
        {
            feature: 'schoolManagement',
            label: t('schoolManagement'),
            icon: "🏫",
            page: Page.PrincipalManagementMenu,
            color: "bg-slate-700 hover:bg-slate-800",
            fullWidth: true
        },
        {
            feature: 'browseAsTeacher',
            label: t('browseAsTeacher'),
            icon: "👨‍🏫",
            page: Page.PrincipalBrowseAsTeacherSelection,
            color: "bg-blue-700 hover:bg-blue-800",
            fullWidth: true
        },
    ];

    const enabledActions = allActions.filter(action => school.featureFlags[action.feature] !== false);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-gray-200 dark:border-gray-700 animate-fade-in w-full relative">
            <div className="absolute top-4 start-4 z-10 flex gap-2">
                <LanguageSwitcher />
                <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
            </div>
            
            <div className="text-center">
                {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-24 h-24 rounded-full object-contain mb-4 mx-auto shadow-md" />}
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-2">{t('principalDashboardTitle')}</h1>
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 text-center mb-6">{t(`${stage.toLowerCase()}Stage` as any)}</h2>
            </div>


            <div className="grid grid-cols-2 gap-4">
                {enabledActions.map(action => (
                    <ActionButton
                        key={action.page}
                        label={action.label}
                        icon={action.icon}
                        onClick={() => onSelectAction(action.page)}
                        color={action.color}
                        fullWidth={action.fullWidth}
                    />
                ))}
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

export default PrincipalDashboard;