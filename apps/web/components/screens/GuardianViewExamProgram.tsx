
import React, { useState, useEffect } from 'react';
import { ExamProgram, Student, Subject, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewExamProgramProps {
    student: Student;
    subject: Subject | null;
    school: School;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewExamProgram: React.FC<GuardianViewExamProgramProps> = ({ student, subject, school, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [programs, setPrograms] = useState<ExamProgram[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            if (!subject) return;
            setIsLoading(true);
            const { data, error } = await supabase
                .from('exam_programs')
                .select('*')
                .eq('school_id', school.id)
                .eq('subject', subject)
                .eq('level', student.level)
                .order('date', { ascending: false });

            if (error) {
                console.error("Error fetching exam programs:", error);
            } else {
                setPrograms(snakeToCamelCase(data));
            }
            setIsLoading(false);
        };
        fetchPrograms();
    }, [school.id, student.level, subject]);

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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('examProgram')}</h1>

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Loading...</p>
                    </div>
                ) : programs.length > 0 ? (
                    <div className="space-y-4">
                        {programs.map(program => (
                            <div key={program.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                                    {t('examProgram')} - {new Date(program.date).toLocaleDateString()}
                                </h2>
                                {program.image && <img src={program.image} alt="Exam Program" className="mt-2 rounded-lg max-w-full h-auto" />}
                                {program.pdf && (
                                    <a
                                        href={program.pdf.url}
                                        download={program.pdf.name}
                                        className="mt-2 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                                    >
                                        {t('download')} PDF
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">لا يوجد برنامج فروض حاليا.</p>
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

export default GuardianViewExamProgram;
