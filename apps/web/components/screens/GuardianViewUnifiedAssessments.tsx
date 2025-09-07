
import React, { useState, useEffect } from 'react';
import { UnifiedAssessment, Student, Subject, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewUnifiedAssessmentsProps {
    student: Student;
    subject: Subject | null;
    school: School;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewUnifiedAssessments: React.FC<GuardianViewUnifiedAssessmentsProps> = ({ student, subject, school, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [assessments, setAssessments] = useState<UnifiedAssessment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAssessments = async () => {
            if (!subject) return;
            setIsLoading(true);
            const { data, error } = await supabase
                .from('unified_assessments')
                .select('*')
                .eq('school_id', school.id)
                .eq('subject', subject)
                .eq('level', student.level)
                .order('date', { ascending: false });

            if (error) {
                console.error("Error fetching assessments:", error);
            } else {
                setAssessments(snakeToCamelCase(data));
            }
            setIsLoading(false);
        };
        fetchAssessments();
    }, [school.id, student.level, subject]);

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('unifiedAssessments')}</h1>
            
            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {isLoading ? <p>{t('loading')}...</p> : assessments.length > 0 ? (
                    <div className="space-y-4">
                        {assessments.map(item => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                <h2 className="font-bold text-xl text-blue-700 dark:text-blue-400 mb-2">{item.title}</h2>
                                {item.image && <img src={item.image} alt={item.title} className="w-full h-auto rounded-lg shadow-md mb-3" />}
                                {item.pdf && (
                                    <a href={item.pdf.url} download={item.pdf.name} className="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
                                        {t('download')} PDF
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noAssessments')}</p>
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

export default GuardianViewUnifiedAssessments;
