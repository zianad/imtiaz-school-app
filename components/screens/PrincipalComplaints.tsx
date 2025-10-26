
import React, { useState } from 'react';
import { Complaint, Student } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';

interface PrincipalComplaintsProps {
    complaints: Complaint[];
    students: Student[];
    onAnalyze: () => Promise<string>;
    onBack: () => void;
    onLogout: () => void;
}

const PrincipalComplaints: React.FC<PrincipalComplaintsProps> = ({ complaints, students, onAnalyze, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const getStudentName = (studentId: string) => {
        return students.find(s => s.id === studentId)?.name || 'Unknown Student';
    };

    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalysis('');
        setIsModalOpen(true);
        try {
            const result = await onAnalyze();
            setAnalysis(result);
        } catch (e: any) {
            setAnalysis(t('noComplaintsToAnalyze'));
        } finally {
            setIsLoading(false);
        }
    };

    const renderModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t('complaintAnalysis')}</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed max-h-[60vh] overflow-y-auto prose prose-sm max-w-none">
                        {analysis === t('noComplaintsToAnalyze') ? <p>{analysis}</p> : <ReactMarkdown>{analysis}</ReactMarkdown>}
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
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-orange-600 w-full relative">
            {isModalOpen && renderModal()}
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t('complaintsAndSuggestions')}</h1>

            <div className="mb-4">
                <button
                    onClick={handleAnalyze}
                    disabled={complaints.length < 3}
                    className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    🧠 {t('analyzeComplaints')} (BETA)
                </button>
            </div>


            <div className="max-h-[60vh] overflow-y-auto space-y-4 p-2">
                {complaints.length > 0 ? complaints.sort((a, b) => b.date.getTime() - a.date.getTime()).map(c => (
                    <div key={c.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                        <p className="text-sm text-gray-600 mb-1">{t('fromGuardianOf')}: <strong>{getStudentName(c.studentId)}</strong></p>
                        <p className="whitespace-pre-wrap mb-2">{c.content}</p>
                        {c.image && <img src={c.image} alt="attachment" className="mt-2 rounded-lg max-w-xs h-auto"/>}
                        {c.pdf && <a href={c.pdf.url} download={c.pdf.name} className="text-blue-600 hover:underline">Download PDF</a>}
                        <p className="text-xs text-gray-400 mt-2 text-right">{new Date(c.date).toLocaleString()}</p>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-10">{t('noComplaints')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default PrincipalComplaints;