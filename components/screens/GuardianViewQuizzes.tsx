
import React, { useState } from 'react';
import { Quiz } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface GuardianViewQuizzesProps {
    quizzes: Quiz[];
    onBack: () => void;
    onLogout: () => void;
}

const GuardianViewQuizzes: React.FC<GuardianViewQuizzesProps> = ({ quizzes, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    
    const sortedQuizzes = [...quizzes].sort((a,b) => b.date.getTime() - a.date.getTime());

    if (selectedQuiz) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
                <div className="absolute top-4 start-4 z-10"><LanguageSwitcher /></div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">{selectedQuiz.title}</h1>
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
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('quizzes')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-lg">
                {sortedQuizzes.length > 0 ? (
                    sortedQuizzes.map(quiz => (
                        <button 
                            key={quiz.id} 
                            onClick={() => setSelectedQuiz(quiz)}
                            className="w-full text-right bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-r-4 border-blue-500"
                        >
                            <p className="font-semibold text-lg text-blue-700">{quiz.title}</p>
                            <p className="text-sm text-gray-500">{new Date(quiz.date).toLocaleDateString()}</p>
                        </button>
                    ))
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
