
import React, { useState, useEffect, useMemo } from 'react';
import { PersonalizedExercise, Student, Subject, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';
import ReactMarkdown from 'react-markdown';

interface GuardianViewPersonalizedExercisesProps {
    student: Student;
    subject: Subject | null;
    school: School;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewPersonalizedExercises: React.FC<GuardianViewPersonalizedExercisesProps> = ({ student, subject, school, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [exercises, setExercises] = useState<PersonalizedExercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchExercises = async () => {
            if (!subject) return;
            setIsLoading(true);
            const { data, error } = await supabase
                .from('personalized_exercises')
                .select('*')
                .eq('school_id', school.id)
                .eq('student_id', student.id)
                .eq('subject', subject)
                .order('date', { ascending: false });
            
            if (error) {
                console.error("Error fetching exercises:", error);
            } else {
                setExercises(snakeToCamelCase(data));
            }
            setIsLoading(false);
        };
        fetchExercises();
    }, [school.id, student.id, subject]);

    const exercisesByDomain = useMemo(() => {
        const groups: Record<string, PersonalizedExercise[]> = {};
        for (const ex of exercises) {
            const domainKey = ex.domain || t('miscellaneous');
            if (!groups[domainKey]) groups[domainKey] = [];
            groups[domainKey].push(ex);
        }
        return groups;
    }, [exercises, t]);

    const hasDomains = subject === Subject.Arabic && Object.keys(exercisesByDomain).length > 1;

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('personalizedExercises')}</h1>

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                 {isLoading ? <p>{t('loading')}...</p> : exercises.length > 0 ? (
                    hasDomains ? (
                        Object.entries(exercisesByDomain).map(([domain, domainEx]) => (
                            <div key={domain} className="mb-6">
                                <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-3 border-b-2 pb-2">{domain}</h2>
                                {domainEx.map(ex => (
                                    <div key={ex.id} className="prose prose-sm max-w-none dark:prose-invert bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-3">
                                        <ReactMarkdown>{ex.content}</ReactMarkdown>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        exercises.map(ex => (
                           <div key={ex.id} className="prose prose-sm max-w-none dark:prose-invert bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-3">
                                <ReactMarkdown>{ex.content}</ReactMarkdown>
                            </div>
                        ))
                    )
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noPersonalizedExercises')}</p>
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

export default GuardianViewPersonalizedExercises;
