
import React from 'react';
import { useTranslation } from '../core/i18n';

const Logo: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center mb-8">
            <div className="p-2 bg-white rounded-xl shadow-md">
                <img src="https://i.imgur.com/3gXIM3w.png" alt="G.S TAJ EL HIKMA Logo" className="w-48 h-auto" />
            </div>
            <p className="mt-3 text-sm text-gray-500">{t('discoverPleasureOfLearning')}</p>
        </div>
    );
};

export default Logo;