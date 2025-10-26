
import React, { useState } from 'react';
import { EducationalTip } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface PrincipalEducationalTipsProps {
    tips: EducationalTip[];
    onAddTip: (tip: Omit<EducationalTip, 'id' | 'date'>) => void;
    onGenerateAITip: () => Promise<string>;
    onBack: () => void;
    onLogout: () => void;
}

const PrincipalEducationalTips: React.FC<PrincipalEducationalTipsProps> = ({ tips, onAddTip, onGenerateAITip, onBack, onLogout }) => {
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
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('educationalTips')}</h1>
            
            <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-inner space-y-4">
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t('educationalTipContent')} rows={6} className="w-full p-3 border-2 rounded-lg" />
                <button onClick={handleAIGenerate} disabled={isLoading} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50">
                    {isLoading ? '...' : '✨'} {t('generateWithAI')}
                </button>
                <button onClick={handleSend} disabled={!content.trim()} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg disabled:opacity-50">{t('sendTip')}</button>
            </div>
            
            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center border-t pt-4">{t('sentTips')}</h2>
                <div className="max-h-60 overflow-y-auto space-y-2 p-2">
                    {tips.length > 0 ? tips.map(tip => (
                        <div key={tip.id} className="bg-white p-3 rounded-lg shadow-sm">
                            <p>{tip.content}</p>
                        </div>
                    )) : <p className="text-center text-gray-500">{t('noTips')}</p>}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default PrincipalEducationalTips;