
import React, { useState, useEffect, useMemo } from 'react';
import { SupplementaryLesson, Student, Subject, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewSupplementaryLessonsProps {
    student: Student;
    subject: Subject | null;
    school: School;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewSupplementaryLessons: React.FC<GuardianViewSupplementaryLessonsProps> = ({ student, subject, school, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
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
                .eq('subject', subject)
                .eq('level', student.level)
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

    const lessonsByDomain = useMemo(() => {
        const groups: Record<string, SupplementaryLesson[]> = {};
        for (const lesson of lessons) {
            const domainKey = lesson.domain || t('miscellaneous');
            if (!groups[domainKey]) groups[domainKey] = [];
            groups[domainKey].push(lesson);
        }
        return groups;
    }, [lessons, t]);

    const hasDomains = subject === Subject.Arabic && Object.keys(lessonsByDomain).length > 1;

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

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {isLoading ? <p className="text-center">{t('loading')}</p> : lessons.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noLessons')}</p>
                    </div>
                ) : hasDomains ? (
                    Object.entries(lessonsByDomain).map(([domain, domainLessons]) => (
                        <div key={domain} className="mb-6">
                            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-3 border-b-2 pb-2">{domain}</h2>
                            <div className="space-y-3">
                                {domainLessons.map(lesson => (
                                    <a key={lesson.id} href={lesson.externalLink} target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                                        <p className="font-semibold text-blue-600 dark:text-blue-400">{lesson.title}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="space-y-3">
                        {lessons.map(lesson => (
                             <a key={lesson.id} href={lesson.externalLink} target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                                <p className="font-semibold text-blue-600 dark:text-blue-400">{lesson.title}</p>
                            </a>
                        ))}
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

export default GuardianViewSupplementaryLessons;
