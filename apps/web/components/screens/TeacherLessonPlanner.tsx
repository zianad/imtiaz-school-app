
import React, { useState } from 'react';
// Fix: Add School import
import { School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
// Fix: Add ThemeSwitcher import
import ThemeSwitcher from '../common/ThemeSwitcher';

interface TeacherLessonPlannerProps {
    // Fix: Add school, toggleDarkMode, isDarkMode props
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    onGenerate: (topic: string) => Promise<string>;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherLessonPlanner: React.FC<TeacherLessonPlannerProps> = ({ school, toggleDarkMode, isDarkMode, onGenerate, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lessonPlan, setLessonPlan] = useState('');
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError(t('fillAllFields'));
            return;
        }
        setIsLoading(true);
        setError('');
        setLessonPlan('');
        try {
            const plan = await onGenerate(topic);
            setLessonPlan(plan);
        } catch (e: any) {
            setError(e.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('lessonPlanner')}</h1>

            <div className="space-y-4 mb-6">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('lessonTopic')}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                    {isLoading ? '...' : '✨'} {isLoading ? t('generatingPlan') : t('generatePlan')}
                </button>
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            </div>

            {lessonPlan && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed dark:border-gray-600 max-h-[50vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">{t('lessonPlan')}</h2>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{lessonPlan}</ReactMarkdown>
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

export default TeacherLessonPlanner;
