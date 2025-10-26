
import React from 'react';
import { Timetable } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface GuardianViewTimetableProps {
    timetables: Timetable[];
    onBack: () => void;
    onLogout: () => void;
}

const GuardianViewTimetable: React.FC<GuardianViewTimetableProps> = ({ timetables, onBack, onLogout }) => {
    const { t } = useTranslation();
    const latestTimetable = timetables.sort((a,b) => b.date.getTime() - a.date.getTime())[0];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
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
