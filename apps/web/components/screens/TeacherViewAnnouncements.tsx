
import React from 'react';
import { Announcement, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface TeacherViewAnnouncementsProps {
    announcements: Announcement[];
    onBack: () => void;
    onLogout: () => void;
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const TeacherViewAnnouncements: React.FC<TeacherViewAnnouncementsProps> = ({ announcements, onBack, onLogout, school, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('announcements')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-4 p-2">
                {announcements.length > 0 ? announcements.sort((a,b) => b.date.getTime() - a.date.getTime()).map(ann => (
                    <div key={ann.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm border-l-4 border-blue-500 dark:border-blue-400">
                        <p className="whitespace-pre-wrap mb-2 text-gray-800 dark:text-gray-200">{ann.content}</p>
                        {ann.image && <img src={ann.image} alt="attachment" className="mt-2 rounded-lg max-w-full h-auto"/>}
                        {ann.pdf && <a href={ann.pdf.url} download={ann.pdf.name} className="text-blue-600 dark:text-blue-400 hover:underline">Download PDF</a>}
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right">{new Date(ann.date).toLocaleString()}</p>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">{t('noAnnouncements')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherViewAnnouncements;
