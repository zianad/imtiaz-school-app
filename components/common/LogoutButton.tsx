
import React from 'react';
import { useTranslation } from '../../core/i18n';

interface LogoutButtonProps {
    onClick: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => {
    const { t } = useTranslation();
    return (
        <button
            onClick={onClick}
            className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out shadow-sm"
        >
            {t('logout')}
        </button>
    );
};

export default LogoutButton;