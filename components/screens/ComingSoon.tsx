
import React from 'react';
import BackButton from '../BackButton';
import { useTranslation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher';

interface ComingSoonProps {
    onBack: () => void;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ onBack }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border-t-8 border-gray-400 animate-fade-in relative w-full">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <div className="text-6xl mb-4">🚧</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('comingSoonTitle')}</h1>
            <p className="text-gray-600 text-lg">{t('comingSoonMessage')}</p>
            <div className="mt-8 w-1/2 mx-auto">
               <BackButton onClick={onBack} />
            </div>
        </div>
    );
};

export default ComingSoon;