
import React from 'react';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import { useTranslation } from '../../core/i18n';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface GuardianViewContentProps {
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

const GuardianViewContent: React.FC<GuardianViewContentProps> = ({ title, items, message, onBack, onLogout }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in w-full relative">
             <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{title}</h1>

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4">
                {items.length > 0 ? (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md border-r-4 border-blue-400">
                                <h2 className="font-bold text-xl text-gray-800">{item.title || `تمرين بتاريخ: ${item.date ? new Date(item.date).toLocaleDateString('ar-DZ') : ''}`}</h2>
                                {item.content && <p className="mt-2 text-gray-700 whitespace-pre-wrap">{item.content}</p>}
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
                        <p className="text-gray-500 text-lg">لا يوجد محتوى لعرضه حاليا.</p>
                    </div>
                )}
            </div>

            {message && <p className="text-center text-gray-600 mt-4 font-semibold">{message}</p>}
            
            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewContent;