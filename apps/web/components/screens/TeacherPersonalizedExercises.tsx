import React, { useState, useEffect } from 'react';
import { Student, Subject, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ReactMarkdown from 'react-markdown';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface TeacherPersonalizedExercisesProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    student: Student;
    subject: Subject;
    onGenerate: (student: Student, subject: Subject) => Promise<string>;
    onSave: (studentId: string, content: string, domain: string) => void;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherPersonalizedExercises: React.FC<TeacherPersonalizedExercisesProps> = ({ school, toggleDarkMode, isDarkMode, student, subject, onGenerate, onSave, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [exercises, setExercises] = useState('');
    const [domain, setDomain] = useState('');
    const [error, setError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setExercises('');
        try {
            const result = await onGenerate(student, subject);
            setExercises(result);
        } catch (e: any) {
            setError(e.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSave = () => {
        if (exercises) {
            onSave(student.id, exercises, domain);
            setSaveSuccess(true);
            setExercises('');
            setDomain('');
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">{t('personalizedExercises')}</h1>
            <p className="text-lg text-blue-700 dark:text-blue-400 font-semibold mb-4 text-center">{student.name} - {subject}</p>
            
            <div className="space-y-4">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                    {isLoading ? '...' : '✨'} {isLoading ? t('generatingExercises') : t('generateExercises')}
                </button>
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                {saveSuccess && <p className="text-green-600 dark:text-green-400 text-center font-semibold animate-pulse">{t('sentForReviewSuccess')}</p>}
            </div>

            {exercises && (
                <div className="mt-6 animate-fade-in">
                     {subject === Subject.Arabic && (
                        <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder={t('contentDomainOptional')}
                            className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                    )}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed dark:border-gray-600 max-h-[50vh] overflow-y-auto prose prose-sm max-w-none dark:prose-invert">
                       <ReactMarkdown>{exercises}</ReactMarkdown>
                    </div>
                    <button
                        onClick={handleSave}
                        className="w-full mt-4 bg-teal-500 text-white font-bold py-3 rounded-lg hover:bg-teal-600 transition shadow-lg"
                    >
                        {t('saveAndSendExercises')}
                    </button>
                </div>
            )}
            
            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherPersonalizedExercises;
