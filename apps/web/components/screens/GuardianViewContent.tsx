import React from 'react';
import { School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianViewContentProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    title: string;
    items: { 
        id: number;
        title?: string; 
        content: string;
        image?: string; // base64
        pdf?: { name: string; url: string }; // blob url
        externalLink?: string;
        date?: Date;
    }[];
    message?: string;
    onBack: () => void;
    onLogout: () => void;
}

const GuardianViewContent: React.FC<GuardianViewContentProps> = ({ school, toggleDarkMode, isDarkMode, title, items, message, onBack, onLogout }) => {
    const { t } = useTranslation();

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
                {items.length > 0 ? (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-r-4 border-blue-400 dark:border-blue-500">
                                <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">{item.title || `تمرين بتاريخ: ${item.date ? new Date(item.date).toLocaleDateString('ar-DZ') : ''}`}</h2>
                                {item.content && <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.content}</p>}
                                {item.image && (
                                    <img src={item.image} alt="ملحق" className="mt-3 rounded-lg max-w-full h-auto shadow-sm" />
                                )}
                                {item.pdf && (
                                    <a
                                        href={item.pdf.url}
                                        download={item.pdf.name}
                                        className="block text-center mt-3 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        تحميل PDF: {item.pdf.name}
                                    </a>
                                )}
                                {item.externalLink && (
                                     <a
                                        href={item.externalLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-center mt-3 bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition"
                                    >
                                        🔗 رابط شرح إضافي
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">لا يوجد محتوى لعرضه حاليا.</p>
                    </div>
                )}
            </div>

            {message && <p className="text-center text-gray-600 dark:text-gray-300 mt-4 font-semibold">{message}</p>}
            
            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewContent;