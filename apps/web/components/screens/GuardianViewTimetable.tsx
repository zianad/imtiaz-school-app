
import React, { useState, useEffect } from 'react';
import { Timetable, Student, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewTimetableProps {
    student: Student;
    school: School;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewTimetable: React.FC<GuardianViewTimetableProps> = ({ student, school, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [timetable, setTimetable] = useState<Timetable | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTimetable = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('timetables')
                .select('*')
                .eq('school_id', school.id)
                .eq('level', student.level)
                .eq('class', student.class)
                .order('date', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
                console.error("Error fetching timetable:", error);
            } else {
                setTimetable(snakeToCamelCase(data));
            }
            setIsLoading(false);
        };
        fetchTimetable();
    }, [school.id, student.level, student.class]);

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('timetable')}</h1>

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4 flex items-center justify-center">
                {isLoading ? <p>{t('loading')}...</p> : timetable ? (
                    <div>
                        {timetable.image && <img src={timetable.image} alt="Timetable" className="max-w-full h-auto rounded-lg shadow-md" />}
                        {timetable.pdf && (
                             <a href={timetable.pdf.url} download={timetable.pdf.name} className="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
                                {t('download')} PDF
                            </a>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noTimetable')}</p>
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
