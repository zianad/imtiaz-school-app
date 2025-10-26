
import React from 'react';
import { EducationalTip } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface GuardianViewEducationalTipsProps {
    tips: EducationalTip[];
    onBack: () => void;
    onLogout: () => void;
}

const GuardianViewEducationalTips: React.FC<GuardianViewEducationalTipsProps> = ({ tips, onBack, onLogout }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('educationalTips')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-4 p-2">
                {tips.length > 0 ? tips.sort((a, b) => b.date.getTime() - a.date.getTime()).map(tip => (
                    <div key={tip.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                        <p className="whitespace-pre-wrap">{tip.content}</p>
                        <p className="text-xs text-gray-400 mt-2 text-right">{new Date(tip.date).toLocaleDateString()}</p>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-10">{t('noTips')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewEducationalTips;