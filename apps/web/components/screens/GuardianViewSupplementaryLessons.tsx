import React, { useState, useEffect } from 'react';
import { SupplementaryLesson, School, Student, Subject } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewSupplementaryLessonsProps {
    school: School;
    student: Student;
    subject: Subject | null;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewSupplementaryLessons: React.FC<GuardianViewSupplementaryLessonsProps> = ({ school, student, subject, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [lessons, setLessons] = useState<SupplementaryLesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            if (!subject) return;
            setIsLoading(true);
            const { data, error } = await supabase
                .from('supplementary_lessons')
                .select('*')
                .eq('school_id', school.id)
                .eq('level', student.level)
                .eq('subject', subject)
                .order('id', { ascending: false });

            if (error) {
                console.error("Error fetching lessons:", error);
            } else {
                setLessons(snakeToCamelCase(data));
            }
            setIsLoading(false);
        };
        fetchLessons();
    }, [school.id, student.level, subject]);

    const sortedLessons = lessons;

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('supplementaryLessons')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {isLoading ? <p>{t('loading')}...</p> : sortedLessons.length > 0 ? (
                    sortedLessons.map(lesson => (
                        <a 
                            key={lesson.id} 
                            href={lesson.externalLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500 dark:border-blue-400"
                        >
                            <p className="font-semibold text-lg text-blue-700 dark:text-blue-300">{lesson.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{lesson.externalLink}</p>
                        </a>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">{t('noLessons')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewSupplementaryLessons;