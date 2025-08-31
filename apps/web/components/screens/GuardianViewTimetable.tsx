import React from 'react';
import { Timetable, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianViewTimetableProps {
    school: School;
    timetables: Timetable[];
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewTimetable: React.FC<GuardianViewTimetableProps> = ({ school, timetables, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const latestTimetable = timetables.sort((a,b) => b.date.getTime() - a.date.getTime())[0];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('timetable')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto p-2 bg-gray-50 rounded-lg">
                {latestTimetable ? (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-2">
                            {t('add')} {new Date(latestTimetable.date).toLocaleDateString()}
                        </p>
                        {latestTimetable.image && (
                            <img src={latestTimetable.image} alt="Timetable" className="w-full h-auto rounded-md shadow" />
                        )}
                        {latestTimetable.pdf && (
                            <a
                                href={latestTimetable.pdf.url}
                                download={latestTimetable.pdf.name}
                                className="block w-full text-center mt-3 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition"
                            >
                                {t('download')} PDF
                            </a>
                        )}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-10">{t('noTimetable')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewTimetable;