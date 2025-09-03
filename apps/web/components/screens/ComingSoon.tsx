import React from 'react';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';

interface ComingSoonProps {
    onBack: () => void;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ onBack }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center border-t-8 border-yellow-500 animate-fade-in w-full max-w-md mx-auto">
            <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 dark:text-yellow-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('comingSoonTitle')}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">{t('comingSoonMessage')}</p>
            <div className="w-full sm:w-2/3 mx-auto">
                <BackButton onClick={onBack} />
            </div>
        </div>
    );
};

export default ComingSoon;
