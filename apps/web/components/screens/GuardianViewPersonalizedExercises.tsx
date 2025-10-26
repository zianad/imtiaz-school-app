import React, { useMemo, useState, useEffect } from 'react';
import { PersonalizedExercise, Subject, School, Student } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ReactMarkdown from 'react-markdown';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewPersonalizedExercisesProps {
    school: School;
    student: Student;
    subject: Subject | null;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewPersonalizedExercises: React.FC<GuardianViewPersonalizedExercisesProps> = ({ school, student, subject, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
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

            if (error) console.error("Error fetching exercises:", error);
            // FIX: The data received from Supabase can be null, which would cause a crash when setting the state. This has been corrected by ensuring that an empty array is used as a fallback if the data is null.
            else setExercises(snakeToCamelCase(data || []));
            setIsLoading(false);
        };
        fetchExercises();
    }, [school.id, student.id, subject]);

    const sortedExercises = exercises;
    
    const isArabicContent = subject === Subject.Arabic;

    const exercisesByDomain = useMemo(() => {
        if (!isArabicContent) return null;
        const groups: Record<string, typeof exercises> = {};
        for (const item of sortedExercises) {
            const domainKey = item.domain || t('miscellaneous');
            if (!groups[domainKey]) {
                groups[domainKey] = [];
            }
            groups[domainKey].push(item);
        }
        return groups;
    }, [sortedExercises, t, isArabicContent]);

    const renderExercise = (exercise: PersonalizedExercise) => (
         <div key={exercise.id} className="bg-white p-4 rounded-lg shadow-md border-r-4 border-blue-400">
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">{new Date(exercise.date).toLocaleDateString()}</p>
                {!exercisesByDomain && exercise.domain && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{exercise.domain}</span>
                )}
            </div>
             <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{exercise.content}</ReactMarkdown>
             </div>
        </div>
    );

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('personalizedExercises')}</h1>
            
            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 border-2 border-dashed rounded-lg p-4 space-y-4">
                {isLoading ? <p>{t('loading')}...</p> : sortedExercises.length > 0 ? (
                     exercisesByDomain ? (
                        <div className="space-y-6">
                            {Object.entries(exercisesByDomain).map(([domain, domainItems]) => (
                                <div key={domain}>
                                    <h2 className="text-xl font-bold text-gray-700 mb-3 border-b-2 pb-2">{domain}</h2>
                                    <div className="space-y-4">
                                        {domainItems.map(renderExercise)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        sortedExercises.map(renderExercise)
                    )
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-lg">{t('noPersonalizedExercises')}</p>
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