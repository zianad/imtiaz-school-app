
import React, { useState } from 'react';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import { useTranslation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';

interface PrincipalInsightsDashboardProps {
    onAnalyze: () => Promise<string>;
    onBack: () => void;
    onLogout: () => void;
}

const PrincipalInsightsDashboard: React.FC<PrincipalInsightsDashboardProps> = ({ onAnalyze, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError('');
        setAnalysis('');
        try {
            const result = await onAnalyze();
            setAnalysis(result);
        } catch (e: any) {
            setError(e.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-pink-500 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('insightsDashboard')}</h1>

            <div className="space-y-4 mb-6">
                 <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                    {isLoading ? '...' : '🧠'} {isLoading ? t('generatingAnalysis') : t('analyzeComplaints')}
                </button>
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            </div>

            {analysis && (
                 <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed max-h-[50vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t('complaintAnalysis')}</h2>
                    <div className="prose prose-sm max-w-none">
                         {analysis === t('noComplaintsToAnalyze') ? <p>{analysis}</p> : <ReactMarkdown>{analysis}</ReactMarkdown>}
                    </div>
                </div>
            )}

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default PrincipalInsightsDashboard;
