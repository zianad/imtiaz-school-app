
import React from 'react';
import LogoutButton from '../LogoutButton';
import { useTranslation } from '../../i18n';

interface MaintenanceScreenProps {
    onLogout: () => void;
}

const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ onLogout }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border-t-8 border-yellow-500 animate-fade-in w-full max-w-md mx-auto">
            <div className="text-6xl mb-4">🛠️</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('maintenanceTitle')}</h1>
            <p className="text-gray-600 text-lg mb-8">{t('maintenanceMessage')}</p>
            <div className="w-1/2 mx-auto">
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default MaintenanceScreen;
