
import React, { useMemo } from 'react';
import { Summary, Exercise, School, Subject } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianViewContentProps {
    title: string;
    items: (Summary | Exercise)[];
    onBack: () => void;
    school: School;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewContent: React.FC<GuardianViewContentProps> = ({ title, items, onBack, school, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const sortedItems = [...items].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

    const isArabicContent = items.length > 0 && items[0]?.subject === Subject.Arabic;

    const itemsByDomain = useMemo(() => {
        if (!isArabicContent) return null;
        const groups: Record<string, typeof items> = {};
        for (const item of sortedItems) {
            const domainKey = item.domain || t('miscellaneous');
            if (!groups[domainKey]) {
                groups[domainKey] = [];
            }
            groups[domainKey].push(item);
        }
        return groups;
    }, [sortedItems, t, isArabicContent]);

    const renderItem = (item: Summary | Exercise) => (
        <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-r-4 border-blue-400 dark:border-blue-500">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">{'title' in item ? item.title : `${t('exercises')} - ${new Date(item.date!).toLocaleDateString()}`}</h2>
                {!itemsByDomain && item.domain && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{item.domain}</span>
                )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{item.content}</p>
        </div>
    );
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{title}</h1>
            
            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {sortedItems.length > 0 ? (
                     itemsByDomain ? (
                        <div className="space-y-6">
                            {Object.entries(itemsByDomain).map(([domain, domainItems]) => (
                                <div key={domain}>
                                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-3 border-b-2 pb-2">{domain}</h2>
                                    <div className="space-y-4">
                                        {domainItems.map(renderItem)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sortedItems.map(renderItem)}
                        </div>
                    )
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">لا يوجد محتوى لعرضه حاليا.</p>
                    </div>
                )}
            </div>
            
             <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewContent;
