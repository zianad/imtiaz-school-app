
import React, { useState, useEffect } from 'react';
import { ExamProgram, School, Student } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewExamProgramProps {
    school: School;
    student: Student;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewExamProgram: React.FC<GuardianViewExamProgramProps> = ({ school, student, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [examPrograms, setExamPrograms] = useState<ExamProgram[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('exam_programs')
                .select('*')
                .eq('school_id', school.id)
                .eq('level', student.level)
                .order('date', { ascending: false });

            if (error) {
                console.error("Error fetching exam programs:", error);
            } else {
                setExamPrograms(snakeToCamelCase(data));
            }
            setIsLoading(false);
        };
        fetchPrograms();
    }, [school.id, student.level]);

    const latestProgram = examPrograms[0];

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
            
            <div className="w-full min-h-[400px] max-h-[70vh] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {isLoading ? (
                     <div className="flex items-center justify-center h-full"><p className="text-gray-500 dark:text-gray-400">{t('loading')}...</p></div>
                ) : latestProgram ? (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            تم النشر بتاريخ: {new Date(latestProgram.date).toLocaleDateString()}
                        </p>
                        {latestProgram.image && (
                            <img src={latestProgram.image} alt="Exam Program" className="w-full h-auto rounded-md shadow" />
                        )}
                        {latestProgram.pdf && (
                            <a
                                href={latestProgram.pdf.url}
                                download={latestProgram.pdf.name}
                                className="block w-full text-center mt-3 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition"
                            >
                                {t('download')} PDF
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">لم يتم نشر برنامج الفروض بعد.</p>
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