import React from 'react';
import { Page, School, SchoolFeature, EducationalStage } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface PrincipalDashboardProps {
    school: School;
    stage: EducationalStage;
    onSelectAction: (page: Page) => void;
    onLogout: () => void;
    onBack: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    isDesktop?: boolean;
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

const StatCard: React.FC<{ title: string; value: string | number; icon: string }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-md flex items-center gap-4">
        <div className="text-4xl">{icon}</div>
        <div>
            <p className="text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);


const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({ school, stage, onSelectAction, onLogout, onBack, toggleDarkMode, isDarkMode, isDesktop = false }) => {
    const { t } = useTranslation();

    const allActions: { feature: SchoolFeature, label: string; icon: string; page: Page; color: string; fullWidth?: boolean }[] = [
        { feature: 'statisticsDashboard', label: t('statisticsDashboard'), icon: "📊", page: Page.PrincipalPerformanceTracking, color: "bg-indigo-500 hover:bg-indigo-600" },
        { feature: 'educationalTips', label: t('educationalTips'), icon: "💡", page: Page.PrincipalEducationalTips, color: "bg-cyan-600 hover:bg-cyan-700" },
        { feature: 'announcements', label: t('announcements'), icon: "📢", page: Page.PrincipalAnnouncements, color: "bg-sky-600 hover:bg-sky-700" },
        { feature: 'complaintsAndSuggestions', label: t('complaintsAndSuggestions'), icon: "✍️", page: Page.PrincipalComplaints, color: "bg-orange-600 hover:bg-orange-700" },
        { feature: 'reviewNotes', label: t('reviewNotes'), icon: "🗒️", page: Page.PrincipalReviewNotes, color: "bg-emerald-500 hover:bg-emerald-600" },
        { feature: 'reviewAlbumPhotos', label: t('reviewAlbumPhotos'), icon: "🖼️", page: Page.PrincipalReviewAlbum, color: "bg-fuchsia-500 hover:bg-fuchsia-600" },
        { feature: 'monthlyFees', label: t('monthlyFees'), icon: "💰", page: Page.PrincipalMonthlyFees, color: "bg-green-500 hover:bg-green-600" },
        { feature: 'interviewRequests', label: t('interviewRequests'), icon: "🤝", page: Page.PrincipalInterviewRequests, color: "bg-purple-500 hover:bg-purple-600" },
        { feature: 'financialManagement', label: t('financialManagement'), icon: "💼", page: Page.PrincipalFinancialDashboard, color: "bg-yellow-500 hover:bg-yellow-600" },
        { feature: 'schoolManagement', label: t('schoolManagement'), icon: "🏫", page: Page.PrincipalManagementMenu, color: "bg-slate-700 hover:bg-slate-800" },
        { feature: 'browseAsTeacher', label: t('browseAsTeacher'), icon: "👨‍🏫", page: Page.PrincipalBrowseAsTeacherSelection, color: "bg-blue-700 hover:bg-blue-800", fullWidth: true },
    ];

    const enabledActions = allActions.filter(action => school.featureFlags[action.feature] !== false);

    const studentCount = school.students.filter(s => s.stage === stage).length;
    const teacherCount = school.teachers.length;
    const pendingNotesCount = school.notes.filter(n => n.status === 'pending' && n.stage === stage).length;

    const renderDesktopLayout = () => {
        return (
            <div className="bg-gray-100 dark:bg-gray-900 w-full flex overflow-hidden h-screen">
                {/* Sidebar */}
                <div className="w-1/3 max-w-xs bg-white dark:bg-gray-800 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b dark:border-gray-700 flex items-center gap-3">
                        {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                        <div>
                            <h2 className="font-bold text-gray-800 dark:text-gray-100">{school.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t(`${stage.toLowerCase()}Stage` as any)}</p>
                        </div>
                    </div>
                    {/* Actions */}
                    <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                        {enabledActions.map(action => (
                            <button
                                key={action.page}
                                onClick={() => onSelectAction(action.page)}
                                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-right"
                            >
                                <span className="text-2xl w-8 text-center">{action.icon}</span>
                                <span className="font-semibold">{action.label}</span>
                            </button>
                        ))}
                    </nav>
                    {/* Footer */}
                    <div className="p-4 border-t dark:border-gray-700 space-y-2">
                        <button onClick={onBack} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out shadow-sm dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                            {t('changeStage')}
                        </button>
                        <LogoutButton onClick={onLogout} />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('dashboard')}</h1>
                        <div className="flex items-center gap-2">
                            <LanguageSwitcher />
                            <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <StatCard title={t('manageStudents')} value={studentCount} icon="🎓" />
                        <StatCard title={t('manageTeachers')} value={teacherCount} icon="👨‍🏫" />
                        <StatCard title={t('reviewNotes')} value={pendingNotesCount} icon="🗒️" />
                    </div>
                     <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t('principalWelcome')}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                           استخدم القائمة على اليسار للوصول إلى الميزات المختلفة. يمكنك تتبع أداء التلاميذ وإدارة الموظفين والتواصل مع أولياء الأمور والمزيد.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderMobileLayout = () => (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-gray-200 dark:border-gray-700 animate-fade-in w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                    <div>
                         <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{school.name}</h1>
                         <p className="text-gray-500 dark:text-gray-400">{t(`${stage.toLowerCase()}Stage` as any)}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">{t('principalDashboardTitle')}</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title={t('manageStudents')} value={studentCount} icon="🎓" />
                <StatCard title={t('manageTeachers')} value={teacherCount} icon="👨‍🏫" />
                <StatCard title={t('reviewNotes')} value={pendingNotesCount} icon="🗒️" />
            </div>

            {/* Action Buttons */}
            <div className="border-t dark:border-gray-700 pt-6">
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">{t('dashboard')}</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            </div>
            
            <div className="mt-10 flex items-center gap-4">
                <div className="w-1/2">
                    <button onClick={onBack} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out shadow-sm dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                        {t('changeStage')}
                    </button>
                </div>
                <div className="w-1/2">
                    <LogoutButton onClick={onLogout} />
                </div>
            </div>
        </div>
    );
    
    return isDesktop ? renderDesktopLayout() : renderMobileLayout();
};

export default PrincipalDashboard;