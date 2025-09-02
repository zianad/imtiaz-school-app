import React from 'react';
import { Student, Subject, Page, Notification, School, SchoolFeature, EducationalStage } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import { STAGE_DETAILS, SUBJECT_ICONS } from '../../../../packages/core/constants';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import NotificationIcon from '../../../../packages/ui/NotificationIcon';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianDashboardProps {
    student: Student;
    school: School;
    onSelectSubject: (subject: Subject) => void;
    onLogout: () => void;
    navigateTo: (page: Page) => void;
    notifications: Notification[];
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianDashboard: React.FC<GuardianDashboardProps> = ({ student, school, onSelectSubject, onLogout, navigateTo, notifications, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const unreadCount = notifications.filter(n => n.studentId === student.id && !n.read).length;

    const availableSubjects = STAGE_DETAILS[student.stage]?.subjects || [];

    const isPreSchool = student.stage === EducationalStage.PRE_SCHOOL;

    const otherActions: { label: string; page: Page; icon: string; feature: SchoolFeature, stage?: EducationalStage }[] = [
        { label: t('memorizationHelper'), page: Page.GuardianViewMemorization, icon: '🧠', feature: 'guardianViewMemorization' },
        { label: t('talkingCards'), page: Page.GuardianViewTalkingCards, icon: '🗣️', feature: 'guardianViewTalkingCards', stage: EducationalStage.PRE_SCHOOL },
        { label: t('classAlbum'), page: Page.GuardianViewAlbum, icon: '🖼️', feature: 'guardianViewAlbum' },
        { label: t('monthlyFees'), page: Page.GuardianMonthlyFees, icon: '💳', feature: 'guardianPayFees' },
        { label: t('viewAnnouncements'), page: Page.GuardianViewAnnouncements, icon: '📢', feature: 'announcements' },
        { label: t('viewEducationalTips'), page: Page.GuardianViewEducationalTips, icon: '💡', feature: 'educationalTips' },
        { label: t('submitComplaintOrSuggestion'), page: Page.GuardianSubmitComplaint, icon: '✍️', feature: 'guardianSubmitComplaints' },
        { label: t('requestInterview'), page: Page.GuardianRequestInterview, icon: '🤝', feature: 'guardianRequestInterview' },
    ];

    const enabledOtherActions = otherActions
        .filter(action => school.featureFlags[action.feature] !== false)
        .filter(action => !action.stage || action.stage === student.stage);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in text-center w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                    <span className="font-bold text-lg text-gray-700 dark:text-gray-200">{school.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                    <NotificationIcon unreadCount={unreadCount} onClick={() => navigateTo(Page.GuardianNotifications)} />
                </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('guardianDashboardTitle')}</h1>

            <div className="text-center my-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg shadow-inner">
                <p className="font-bold text-3xl text-gray-800 dark:text-gray-100">{student.name}</p>
                <p className="text-gray-600 dark:text-gray-300 text-lg mt-1">{t('studentLevel')}: {student.level}</p>
            </div>

            {!isPreSchool && (
                <>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{t('selectSubjectToFollow')}</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {availableSubjects.map(subject => (
                             <button
                                key={subject}
                                onClick={() => onSelectSubject(subject)}
                                className="p-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg flex flex-col items-center justify-center space-y-2 transform hover:-translate-y-1 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                            >
                                <span className="text-4xl">{SUBJECT_ICONS[subject] || '📖'}</span>
                                <span className="text-sm">{t(subject as any)}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
            
            <div className={`mt-6 ${!isPreSchool && 'border-t dark:border-gray-700 pt-6'} space-y-3`}>
                 {enabledOtherActions.map(action => (
                    <button
                        key={action.page}
                        onClick={() => navigateTo(action.page)}
                        className={`w-full font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out shadow-md text-md flex items-center justify-center gap-3
                        ${action.stage === EducationalStage.PRE_SCHOOL ? 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500 text-white' : 'bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500 text-white'}
                        `}
                    >
                       <span>{action.icon}</span>
                       <span>{action.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-8">
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianDashboard;