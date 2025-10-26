import React, { useEffect } from 'react';
import { Notification, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianNotificationsProps {
    school: School;
    notifications: Notification[];
    onMarkRead: () => void;
    onBack: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianNotifications: React.FC<GuardianNotificationsProps> = ({ school, notifications, onMarkRead, onBack, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();

    useEffect(() => {
        onMarkRead();
    }, [onMarkRead]);

    const sortedNotifications = [...notifications].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('notifications')}</h1>
            
            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4">
                {sortedNotifications.length > 0 ? (
                    <div className="space-y-3">
                        {sortedNotifications.map(notification => (
                            <div key={notification.id} className="bg-white p-4 rounded-lg shadow-sm border-r-4 border-blue-400">
                                <p className="text-gray-700">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1 text-left">
                                    {new Date(notification.date).toLocaleString('ar-DZ', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-lg">{t('noNewNotifications')}</p>
                    </div>
                )}
            </div>
            
             <div className="mt-8">
                <BackButton onClick={onBack} />
            </div>
        </div>
    );
};

export default GuardianNotifications;