
import React, { useState } from 'react';
// Fix: Add School import
import { SupplementaryLesson, Subject, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
// Fix: Add ThemeSwitcher import
import ThemeSwitcher from '../common/ThemeSwitcher';

interface TeacherAddSupplementaryLessonProps {
    // Fix: Add school, toggleDarkMode, isDarkMode props
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    lessons: SupplementaryLesson[];
    onSave: (title: string, externalLink: string, domain: string) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
    onLogout: () => void;
    subject: Subject;
}

const TeacherAddSupplementaryLesson: React.FC<TeacherAddSupplementaryLessonProps> = ({ school, toggleDarkMode, isDarkMode, lessons, onSave, onDelete, onBack, onLogout, subject }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [externalLink, setExternalLink] = useState('');
    const [domain, setDomain] = useState('');

    const handleSave = () => {
        if (title.trim() && externalLink.trim()) {
            try {
                // Basic URL validation
                new URL(externalLink);
                onSave(title, externalLink, domain);
                setTitle('');
                setExternalLink('');
                setDomain('');
            } catch (_) {
                alert('الرجاء إدخال رابط صحيح.');
            }
        } else {
            alert(t('fillAllFields'));
        }
    };

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('supplementaryLessons')}</h1>

            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex-shrink-0">{t('addSupplementaryLesson')}</h2>
                    {subject === Subject.Arabic && (
                        <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder={t('contentDomainOptional')}
                            className="w-full md:w-auto md:flex-grow p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                    )}
                </div>
                <input
                    type="text"
                    placeholder={t('lessonTitle')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
                <input
                    type="url"
                    placeholder={t('externalLink')}
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
                <button onClick={handleSave} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
                    {t('addLink')}
                </button>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center border-t dark:border-gray-600 pt-4">{t('supplementaryLessons')}</h2>
                <div className="max-h-60 overflow-y-auto space-y-2 p-2">
                    {lessons.length > 0 ? (
                        [...lessons].sort((a, b) => b.id - a.id).map(lesson => (
                            <div key={lesson.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex justify-between items-center">
                                <a href={lesson.externalLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex-grow truncate">
                                    {lesson.title}
                                </a>
                                <button onClick={() => onDelete(lesson.id)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 text-sm flex-shrink-0">
                                    {t('delete')}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noLessons')}</p>
                    )}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherAddSupplementaryLesson;
