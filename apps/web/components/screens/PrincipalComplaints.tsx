import React, { useState, useEffect } from 'react';
import { Complaint, Student, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ReactMarkdown from 'react-markdown';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface PrincipalComplaintsProps {
    school: School;
    onAnalyze: () => Promise<string>;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const PrincipalComplaints: React.FC<PrincipalComplaintsProps> = ({ school, onAnalyze, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        const fetchComplaintsData = async () => {
            setIsDataLoading(true);
            const { data: complaintsData, error: complaintsError } = await supabase
                .from('complaints')
                .select('*')
                .eq('school_id', school.id)
                .order('date', { ascending: false });

            if (complaintsError) console.error("Error fetching complaints", complaintsError);
            else setComplaints(snakeToCamelCase(complaintsData) as Complaint[]);

            const { data: studentsData, error: studentsError } = await supabase
                .from('students')
                .select('id, name')
                .eq('school_id', school.id);

            if (studentsError) console.error("Error fetching students for complaints", studentsError);
            else setStudents(snakeToCamelCase(studentsData) as Student[]);

            setIsDataLoading(false);
        };
        fetchComplaintsData();
    }, [school.id]);
    
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">{t('complaintAnalysis')}</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed max-h-[60vh] overflow-y-auto prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                )}
                 <div className="mt-6">
                    <button onClick={() => setIsModalOpen(false)} className="w-full bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                        {t('back')}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 w-full relative">
            {isModalOpen && renderModal()}
            <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">{t('complaintsAndSuggestions')}</h1>
            
            <div className="mb-6">
                <button 
                    onClick={handleAnalyze} 
                    disabled={complaints.length < 2 || isLoading}
                    className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    🧠 {t('analyzeComplaints')}
                </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto space-y-4 p-2">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('receivedComplaints')}</h2>
                {isDataLoading ? <p className="text-center dark:text-gray-300">Loading...</p> : complaints.length > 0 ? complaints.map(c => (
                    <div key={c.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm border-l-4 border-orange-500 dark:border-orange-400">
                        <p className="whitespace-pre-wrap mb-2 text-gray-800 dark:text-gray-200">{c.content}</p>
                        {c.image && <img src={c.image} alt="attachment" className="mt-2 rounded-lg max-w-full h-auto"/>}
                        {c.pdf && <a href={c.pdf.url} download={c.pdf.name} className="text-blue-600 dark:text-blue-400 hover:underline">Download PDF</a>}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                            {t('fromGuardianOf')} {getStudentName(c.studentId)} - {new Date(c.date).toLocaleString()}
                        </p>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">{t('noComplaints')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <div className="w-1/2">
                    <BackButton onClick={onBack} />
                </div>
                <div className="w-1/2">
                    <LogoutButton onClick={onLogout} />
                </div>
            </div>
        </div>
    );
};

export default PrincipalComplaints;