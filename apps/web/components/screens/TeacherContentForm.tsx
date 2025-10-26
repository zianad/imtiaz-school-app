import React, { useState, useMemo } from 'react';
import { Summary, Exercise, Subject, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

type ContentType = 'summary' | 'exercise';

interface TeacherContentFormProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    type: ContentType;
    items: (Summary | Exercise)[];
    onSave: (data: { title?: string; content: string; domain: string; }) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
    onLogout: () => void;
    subject: Subject;
}

const TeacherContentForm: React.FC<TeacherContentFormProps> = ({ school, toggleDarkMode, isDarkMode, type, items, onSave, onDelete, onBack, onLogout, subject }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [domain, setDomain] = useState('');

    const pageTitle = type === 'summary' ? t('summaries') : t('exercises');

    const handleSave = () => {
        if (!content.trim() || (type === 'summary' && !title.trim())) {
            alert(t('fillAllFields'));
            return;
        }
        onSave({ title, content, domain });
        setTitle('');
        setContent('');
        setDomain('');
    };

    // FIX: Add a check to ensure `items` is an array before accessing its properties.
    const isArabicContent = items && items.length > 0 && items[0]?.subject === Subject.Arabic;

    const itemsByDomain = useMemo(() => {
        // FIX: Add a check to ensure `items` exists before using it in the memoization dependency array.
        if (!isArabicContent || !items) return null;
        const groups: Record<string, typeof items> = {};
        for (const item of items) {
            const domainKey = item.domain || t('miscellaneous');
            if (!groups[domainKey]) {
                groups[domainKey] = [];
            }
            groups[domainKey].push(item);
        }
        return groups;
    }, [items, t, isArabicContent]);

    const renderItem = (item: Summary | Exercise) => (
         <div key={item.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex justify-between items-center">
            <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {'title' in item ? item.title : `${new Date(item.date!).toLocaleDateString()}`}
                </span>
                {!itemsByDomain && item.domain && (
                     <span className="bg-blue-100 text-blue-800 text-xs font-semibold ms-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{item.domain}</span>
                )}
            </div>
            <button
                onClick={() => onDelete(item.id)}
                className="text-red-500 hover:text-red-700 font-bold px-3 py-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 transition text-sm"
            >
                {t('delete')}
            </button>
        </div>
    );

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{pageTitle}</h1>

            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex-shrink-0">{t('add')} {pageTitle}</h2>
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
                {type === 'summary' && (
                    <input
                        type="text"
                        placeholder={t('lessonTitle')}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                )}
                <textarea
                    placeholder={t('contentText')}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
                <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow-lg"
                >
                    {t('saveItem')}
                </button>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center border-t dark:border-gray-600 pt-4">المحتويات الحالية</h2>
                <div className="max-h-60 overflow-y-auto space-y-2 p-2">
                    {/* FIX: Add a check to ensure `items` is an array before attempting to map over it. */}
                    {items && items.length > 0 ? (
                         itemsByDomain ? (
                            <div className="space-y-4">
                                {Object.entries(itemsByDomain).map(([domain, domainItems]) => (
                                    <div key={domain}>
                                        <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-2 border-b-2 pb-1">{domain}</h3>
                                        <div className="space-y-2">
                                            {domainItems.map(renderItem)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             [...items].sort((a,b) => b.id - a.id).map(renderItem)
                        )
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">لا يوجد محتوى حاليا.</p>
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

export default TeacherContentForm;