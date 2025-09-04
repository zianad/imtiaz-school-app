import React, { useState, useMemo } from 'react';
import { School, Feedback, UserRole } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ReactMarkdown from 'react-markdown';

interface SuperAdminFeedbackAnalysisProps {
    schools: School[];
    onAnalyze: () => Promise<string>;
    onBack: () => void;
    onLogout: () => void;
}

const SuperAdminFeedbackAnalysis: React.FC<SuperAdminFeedbackAnalysisProps> = ({ schools, onAnalyze, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const allFeedback = useMemo(() => {
        return schools.flatMap(school =>
            (school.feedback || []).map(f => ({ ...f, schoolName: school.name }))
        ).sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [schools]);

    const averageRating = useMemo(() => {
        if (allFeedback.length === 0) return 0;
        const total = allFeedback.reduce((sum, f) => sum + f.rating, 0);
        return total / allFeedback.length;
    }, [allFeedback]);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalysis('');
        setIsModalOpen(true);
        try {
            const result = await onAnalyze();
            setAnalysis(result);
        } catch (e: any) {
            setAnalysis(e.message || t('noFeedbackToAnalyze'));
        } finally {
            setIsLoading(false);
        }
    };

    const renderModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t('feedbackAnalysisReport')}</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed max-h-[60vh] overflow-y-auto prose prose-sm max-w-none">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                )}
                 <div className="mt-6">
                    <button onClick={() => setIsModalOpen(false)} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition">
                        {t('back')}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-teal-500 w-full relative">
            {isModalOpen && renderModal()}
             <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">{t('feedbackAnalysis')}</h1>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-inner text-center">
                <p className="text-lg text-gray-600">{t('averageRating')}</p>
                <p className="text-4xl font-bold text-teal-600">
                    {averageRating.toFixed(2)} <span className="text-2xl text-yellow-400">★</span>
                </p>
            </div>

            <div className="mb-6">
                <button 
                    onClick={handleAnalyze} 
                    disabled={allFeedback.length < 2}
                    className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    🧠 {t('analyzeAllFeedback')}
                </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto space-y-3 p-2">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('allFeedback')}</h2>
                {allFeedback.length > 0 ? allFeedback.map(f => (
                    <div key={f.id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-teal-400">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-800">{f.schoolName} - {t(f.userRole as any)}</span>
                            <span className="text-yellow-500 font-bold">{f.rating} ★</span>
                        </div>
                        <p className="text-gray-600 text-sm">{f.comments}</p>
                        <p className="text-xs text-gray-400 text-right mt-1">{new Date(f.date).toLocaleDateString()}</p>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-10">{t('noFeedbackToAnalyze')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default SuperAdminFeedbackAnalysis;