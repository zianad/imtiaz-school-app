import React, { useState, useMemo, useEffect } from 'react';
import { Quiz, Subject, School, Student } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewQuizzesProps {
    school: School;
    student: Student;
    subject: Subject | null;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewQuizzes: React.FC<GuardianViewQuizzesProps> = ({ school, student, subject, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!subject) return;
            setIsLoading(true);
            const { data, error } = await supabase
                .from('quizzes')
                .select('*')
                .eq('school_id', school.id)
                .eq('level', student.level)
                .eq('subject', subject)
                .order('date', { ascending: false });

            if (error) console.error("Error fetching quizzes:", error);
            else setQuizzes(snakeToCamelCase(data));
            setIsLoading(false);
        };
        fetchQuizzes();
    }, [school.id, student.level, subject]);
    
    const sortedQuizzes = quizzes;

    const isArabicContent = subject === Subject.Arabic;

    const quizzesByDomain = useMemo(() => {
        if (!isArabicContent) return null;
        const groups: Record<string, typeof quizzes> = {};
        for (const item of sortedQuizzes) {
            const domainKey = item.domain || t('miscellaneous');
            if (!groups[domainKey]) {
                groups[domainKey] = [];
            }
            groups[domainKey].push(item);
        }
        return groups;
    }, [sortedQuizzes, t, isArabicContent]);

    const renderQuizButton = (quiz: Quiz) => (
         <button 
            key={quiz.id} 
            onClick={() => setSelectedQuiz(quiz)}
            className="w-full text-right bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-r-4 border-blue-500"
        >
            <div className="flex justify-between items-center">
                <p className="font-semibold text-lg text-blue-700">{quiz.title}</p>
                {quiz.domain && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{quiz.domain}</span>
                )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{new Date(quiz.date).toLocaleDateString()}</p>
        </button>
    );

    if (selectedQuiz) {
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
                <div className="flex justify-center items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800 text-center">{selectedQuiz.title}</h1>
                    {selectedQuiz.domain && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold ms-3 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{selectedQuiz.domain}</span>
                    )}
                </div>
                <div className="max-h-[70vh] overflow-y-auto space-y-4 p-2 bg-gray-50 rounded-lg">
                    {selectedQuiz.questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="font-semibold text-gray-800">{qIndex + 1}. {q.question}</p>
                            <ul className="mt-2 space-y-2">
                                {q.options.map((option, oIndex) => (
                                    <li key={oIndex} className="p-2 bg-gray-100 rounded">
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <button onClick={() => setSelectedQuiz(null)} className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                        {t('back')}
                    </button>
                </div>
            </div>
        )
    }

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
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('quizzes')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-lg">
                {isLoading ? <p>{t('loading')}...</p> : sortedQuizzes.length > 0 ? (
                     quizzesByDomain ? (
                        <div className="space-y-6">
                            {Object.entries(quizzesByDomain).map(([domain, domainItems]) => (
                                <div key={domain}>
                                    <h2 className="text-xl font-bold text-gray-700 mb-3 border-b-2 pb-2">{domain}</h2>
                                    <div className="space-y-3">
                                        {domainItems.map(renderQuizButton)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sortedQuizzes.map(renderQuizButton)}
                        </div>
                    )
                ) : (
                    <p className="text-center text-gray-500 py-10">{t('noQuizzes')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewQuizzes;