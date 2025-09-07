
import React from 'react';
import { Notification, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianNotificationsProps {
    notifications: Notification[];
    school: School;
    onBack: () => void;
    onLogout: () => void;
    onMarkAsRead: (notificationId: number) => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianNotifications: React.FC<GuardianNotificationsProps> = ({ notifications, school, onBack, onLogout, onMarkAsRead, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();

    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('notifications')}</h1>

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {sortedNotifications.length > 0 ? (
                    <div className="space-y-4">
                        {sortedNotifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-lg shadow-sm border-l-4 ${notification.read ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'bg-blue-50 dark:bg-blue-900/50 border-blue-500'}`}
                            >
                                <p className="text-gray-800 dark:text-gray-200">{notification.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                                    {new Date(notification.date).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noNewNotifications')}</p>
                    </div>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianNotifications;
