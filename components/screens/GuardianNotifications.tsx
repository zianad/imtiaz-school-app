
import React, { useEffect } from 'react';
import { Notification } from '../../types';
import BackButton from '../BackButton';
import { useTranslation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher';

interface GuardianNotificationsProps {
    notifications: Notification[];
    onMarkRead: () => void;
    onBack: () => void;
}

const GuardianNotifications: React.FC<GuardianNotificationsProps> = ({ notifications, onMarkRead, onBack }) => {
    const { t } = useTranslation();

    useEffect(() => {
        onMarkRead();
    }, [onMarkRead]);

    const sortedNotifications = [...notifications].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
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