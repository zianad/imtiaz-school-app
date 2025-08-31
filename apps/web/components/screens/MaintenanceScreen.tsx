import React from 'react';
import { useTranslation } from '../../../../packages/core/i18n';
import LogoutButton from '../../../../packages/ui/LogoutButton';

interface MaintenanceScreenProps {
    onLogout: () => void;
}

const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ onLogout }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center border-t-8 border-yellow-500 animate-fade-in w-full max-w-md mx-auto">
            <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 dark:text-yellow-600 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M16.816 3.184a1 1 0 00-1.414 0l-1.879 1.879a1 1 0 000 1.414l1.88 1.88a1 1 0 001.414 0l1.879-1.88a1 1 0 000-1.414l-1.88-1.879zM10 10a2 2 0 114 0 2 2 0 01-4 0z" />
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M12.293 15.293a1 1 0 011.414 0l1.88 1.88a1 1 0 010 1.414l-1.88 1.88a1 1 0 01-1.414-1.415L12 17.414l-1.293 1.293a1 1 0 01-1.414-1.415l1.88-1.88a1 1 0 010-1.414l-1.88-1.88a1 1 0 111.414-1.414L12 12.586l1.293-1.293zM3 4a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('maintenanceTitle')}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">{t('maintenanceMessage')}</p>
            <div className="w-full sm:w-2/3 mx-auto">
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default MaintenanceScreen;
