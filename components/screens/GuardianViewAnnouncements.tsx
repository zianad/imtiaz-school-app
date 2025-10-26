
import React from 'react';
import { Announcement } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface GuardianViewAnnouncementsProps {
    announcements: Announcement[];
    onBack: () => void;
    onLogout: () => void;
}

const GuardianViewAnnouncements: React.FC<GuardianViewAnnouncementsProps> = ({ announcements, onBack, onLogout }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('announcements')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-4 p-2">
                {announcements.length > 0 ? announcements.sort((a,b) => b.date.getTime() - a.date.getTime()).map(ann => (
                    <div key={ann.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                        <p className="whitespace-pre-wrap mb-2">{ann.content}</p>
                        {ann.image && <img src={ann.image} alt="attachment" className="mt-2 rounded-lg max-w-full h-auto"/>}
                        {ann.pdf && <a href={ann.pdf.url} download={ann.pdf.name} className="text-blue-600 hover:underline">Download PDF</a>}
                        <p className="text-xs text-gray-400 mt-2 text-right">{new Date(ann.date).toLocaleString()}</p>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-10">{t('noAnnouncements')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewAnnouncements;