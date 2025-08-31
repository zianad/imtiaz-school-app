import React, { useState } from 'react';
import { EducationalTip, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface PrincipalEducationalTipsProps {
    school: School;
    tips: EducationalTip[];
    onAddTip: (tip: Omit<EducationalTip, 'id' | 'date'>) => void;
    onGenerateAITip: () => Promise<string>;
    onBack: () => void;
    onLogout: () => void;
    isDesktop?: boolean;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const PrincipalEducationalTips: React.FC<PrincipalEducationalTipsProps> = ({ school, tips, onAddTip, onGenerateAITip, onBack, onLogout, isDesktop = false, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSend = () => {
        if (content.trim()) {
            onAddTip({ content });
            setContent('');
        }
    };

    const handleAIGenerate = async () => {
        setIsLoading(true);
        const tip = await onGenerateAITip();
        setContent(tip);
        setIsLoading(false);
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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('educationalTips')}</h1>
            
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4">
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t('educationalTipContent')} rows={6} className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                <button onClick={handleAIGenerate} disabled={isLoading} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50">
                    {isLoading ? '...' : '✨'} {t('generateWithAI')}
                </button>
                <button onClick={handleSend} disabled={!content.trim()} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg disabled:opacity-50">{t('sendTip')}</button>
            </div>
            
            <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center border-t dark:border-gray-600 pt-4">{t('sentTips')}</h2>
                <div className="max-h-60 overflow-y-auto space-y-2 p-2">
                    {tips.length > 0 ? tips.map(tip => (
                        <div key={tip.id} className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                            <p className="text-gray-800 dark:text-gray-200">{tip.content}</p>
                        </div>
                    )) : <p className="text-center text-gray-500 dark:text-gray-400">{t('noTips')}</p>}
                </div>
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

export default PrincipalEducationalTips;