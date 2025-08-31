import React from 'react';
import { useTranslation } from '../../../../packages/core/i18n';

interface BackButtonProps {
    onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
    const { t } = useTranslation();
    return (
        <button
            onClick={onClick}
            className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out shadow-sm dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
        >
            {t('back')}
        </button>
    );
};

export default BackButton;
