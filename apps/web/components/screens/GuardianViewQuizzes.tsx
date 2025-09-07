
import React, { useState, useEffect } from 'react';
import { Quiz, Question, Student, Subject, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewQuizzesProps {
    student: Student;
    subject: Subject | null;
    school: School;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewQuizzes: React.FC<GuardianViewQuizzesProps> = ({ student, subject, school, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!subject) return;
            setIsLoading(true);
            const { data, error } = await supabase
                .from('quizzes')
                .select('*')
                .eq('school_id', school.id)
                .eq('subject', subject)
                .eq('level', student.level)
                .order('date', { ascending: false });

            if (error) {
                console.error("Error fetching quizzes:", error);
            } else {
                setQuizzes(snakeToCamelCase(data));
            }
            setIsLoading(false);
        };
        fetchQuizzes();
    }, [school.id, student.level, subject]);

    const startQuiz = (quiz: Quiz) => {
        setActiveQuiz(quiz);
        setAnswers(new Array(quiz.questions.length).fill(-1));
        setShowResults(false);
    };

    const handleAnswer = (qIndex: number, aIndex: number) => {
        if (showResults) return;
        const newAnswers = [...answers];
        newAnswers[qIndex] = aIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = () => {
        setShowResults(true);
    };

    const score = activeQuiz ? answers.reduce((correct, ans, i) => {
        return ans === activeQuiz.questions[i].correctAnswerIndex ? correct + 1 : correct;
    }, 0) : 0;

    if (activeQuiz) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 w-full relative">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">{activeQuiz.title}</h1>
                <div className="max-h-[60vh] overflow-y-auto space-y-6 p-2">
                    {activeQuiz.questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">{qIndex + 1}. {q.question}</p>
                            <div className="space-y-2">
                                {q.options.map((opt, oIndex) => {
                                    const isSelected = answers[qIndex] === oIndex;
                                    const isCorrect = q.correctAnswerIndex === oIndex;
                                    let btnClass = 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700';
                                    if (showResults) {
                                        if (isCorrect) btnClass = 'bg-green-200 dark:bg-green-800';
                                        else if (isSelected) btnClass = 'bg-red-200 dark:bg-red-800';
                                    } else if (isSelected) {
                                        btnClass = 'bg-blue-200 dark:bg-blue-800 ring-2 ring-blue-500';
                                    }
                                    return (
                                        <button key={oIndex} onClick={() => handleAnswer(qIndex, oIndex)} className={`w-full text-right p-3 rounded-lg transition-all ${btnClass}`}>
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                {showResults ? (
                    <div className="text-center mt-6">
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-100">النتيجة: {score} / {activeQuiz.questions.length}</p>
                        <button onClick={() => setActiveQuiz(null)} className="w-full mt-4 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300">
                            {t('back')}
                        </button>
                    </div>
                ) : (
                    <button onClick={handleSubmit} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700">
                        {t('submit')}
                    </button>
                )}
            </div>
        );
    }

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('quizzes')}</h1>

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {isLoading ? <p>{t('loading')}...</p> : quizzes.length > 0 ? (
                    <div className="space-y-3">
                        {quizzes.map(quiz => (
                            <button key={quiz.id} onClick={() => startQuiz(quiz)} className="w-full text-right bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                                <p className="font-semibold text-blue-600 dark:text-blue-400">{quiz.title}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{quiz.questions.length} أسئلة</p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">{t('noQuizzes')}</p>
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
