


import React, { useState } from 'react';
import { Student, Subject, School } from '../../../../packages/core/types';
import { SUBJECT_MAP } from '../../../../packages/core/constants';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface TeacherStudentReportGenerationProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    student: Student;
    subject: Subject;
    onGenerateComment: (student: Student, subject: Subject) => Promise<string>;
    onSendForReview: (studentId: string, comment: string) => void;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherStudentReportGeneration: React.FC<TeacherStudentReportGenerationProps> = ({ school, toggleDarkMode, isDarkMode, student, subject, onGenerateComment, onSendForReview, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [generatedComment, setGeneratedComment] = useState('');
    const [error, setError] = useState('');
    const [sendSuccess, setSendSuccess] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setGeneratedComment('');
        try {
            const comment = await onGenerateComment(student, subject);
            setGeneratedComment(comment);
        } catch (e: any) {
            const errorMessage = e.message || 'An unexpected error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSendForReview = () => {
        if (!generatedComment) return;
        onSendForReview(student.id, generatedComment);
        setGeneratedComment(''); // Clear the comment after sending
        setSendSuccess(t('sentForReviewSuccess'));
        setTimeout(() => setSendSuccess(''), 3000);
    };

    const getGradeSummary = () => {
        const grades = student.grades[subject];
        if (!grades || grades.every(g => g.score === null)) {
            return <p className="text-center text-gray-500 dark:text-gray-400">لا توجد نقاط لعرضها.</p>;
        }

        const validSubSubjects = SUBJECT_MAP[subject].map(subSubject => {
            const subSubjectGrades = grades.filter(g => g.subSubject === subSubject && g.score !== null);
            if (subSubjectGrades.length === 0) return null;
            const average = subSubjectGrades.reduce((sum, g) => sum + g.score!, 0) / subSubjectGrades.length;
            return (
                <li key={subSubject} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{subSubject}</span>
                    <span className={`font-bold ${average >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                        {average.toFixed(2)}/10
                    </span>
                </li>
            );
        }).filter(Boolean);

        if(validSubSubjects.length === 0) {
            return <p className="text-center text-gray-500 dark:text-gray-400">لا توجد نقاط لعرضها.</p>;
        }

        return <ul className="space-y-2 text-sm">{validSubSubjects}</ul>;
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">ملاحظة التلميذ(ة)</h1>
            <p className="text-lg text-blue-700 dark:text-blue-400 font-semibold mb-4 text-center">{student.name} - {subject}</p>
            
            <div className="bg-blue-50 dark:bg-gray-700/50 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-2 text-center">ملخص النقاط</h3>
                <div className="max-h-40 overflow-y-auto pr-2">
                    {getGradeSummary()}
                </div>
            </div>
            
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg flex items-center justify-center disabled:opacity-75 disabled:cursor-wait"
            >
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : '🚀'}
                <span className="mx-2 text-lg">{isLoading ? 'جاري الإنشاء...' : 'إنشاء ملاحظة بالذكاء الإصطناعي'}</span>
            </button>
            
            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

            {generatedComment && (
                <div className="mt-6 animate-fade-in">
                    <textarea
                        value={generatedComment}
                        onChange={(e) => setGeneratedComment(e.target.value)}
                        rows={8}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        placeholder="الملاحظة المنشأة..."
                    />
                    <button
                        onClick={handleSendForReview}
                        className="w-full mt-2 bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-600 transition duration-300"
                    >
                        {t('sendForReview')}
                    </button>
                </div>
            )}
            
            {sendSuccess && <p className="text-green-600 dark:text-green-400 text-center font-semibold mt-2 animate-pulse">{sendSuccess}</p>}
            
            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherStudentReportGeneration;
