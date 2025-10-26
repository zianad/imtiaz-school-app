
import React, { useState, useEffect } from 'react';
import { Student, Subject } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import { useTranslation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';

interface TeacherPersonalizedExercisesProps {
    student: Student;
    subject: Subject;
    onGenerate: (student: Student, subject: Subject) => Promise<string>;
    onSave: (studentId: string, content: string) => void;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherPersonalizedExercises: React.FC<TeacherPersonalizedExercisesProps> = ({ student, subject, onGenerate, onSave, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [exercises, setExercises] = useState('');
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
            onSave(student.id, exercises);
            setSaveSuccess(true);
            setExercises('');
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10"><LanguageSwitcher /></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">{t('personalizedExercises')}</h1>
            <p className="text-lg text-blue-700 font-semibold mb-4 text-center">{student.name} - {subject}</p>
            
            <div className="space-y-4">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                    {isLoading ? '...' : '✨'} {isLoading ? t('generatingExercises') : t('generateExercises')}
                </button>
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                {saveSuccess && <p className="text-green-600 text-center font-semibold animate-pulse">{t('sentForReviewSuccess')}</p>}
            </div>

            {exercises && (
                <div className="mt-6 animate-fade-in">
                    <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed max-h-[50vh] overflow-y-auto prose prose-sm max-w-none">
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
