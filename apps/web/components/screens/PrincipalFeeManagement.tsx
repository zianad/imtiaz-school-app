import React, { useState } from 'react';
import { School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface PrincipalFeeManagementProps {
    school: School;
    onUpdateFees: (monthlyFee: number, transportationFee: number) => void;
    onBack: () => void;
    onLogout: () => void;
    isDesktop?: boolean;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const PrincipalFeeManagement: React.FC<PrincipalFeeManagementProps> = ({ school, onUpdateFees, onBack, onLogout, isDesktop = false, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [monthlyFee, setMonthlyFee] = useState(school.monthlyFeeAmount || 0);
    const [transportationFee, setTransportationFee] = useState(school.transportationFee || 0);

    const handleUpdate = () => {
        const monthly = Number(monthlyFee);
        const transport = Number(transportationFee);

        if (isNaN(monthly) || isNaN(transport) || monthly < 0 || transport < 0) {
            alert(t('fillAllFields'));
            return;
        }
        
        onUpdateFees(monthly, transport);
        alert(t('feesUpdated'));
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-slate-700 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('manageFees')}</h1>

            <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner">
                    <label htmlFor="monthly-fee" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 text-center mb-2">{t('monthlyFees')}</label>
                    <input
                        id="monthly-fee"
                        type="number"
                        value={monthlyFee}
                        onChange={e => setMonthlyFee(Number(e.target.value))}
                        placeholder={t('monthlyFeeAmountLabel')}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-lg text-gray-900 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner">
                    <label htmlFor="transport-fee" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 text-center mb-2">{t('transportation')}</label>
                    <input
                        id="transport-fee"
                        type="number"
                        value={transportationFee}
                        onChange={e => setTransportationFee(Number(e.target.value))}
                        placeholder={t('transportationFeeAmountLabel')}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-lg text-gray-900 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                </div>

                <button
                    onClick={handleUpdate}
                    className="w-full bg-teal-500 text-white font-bold py-3 rounded-lg hover:bg-teal-600 transition shadow-lg text-xl"
                >
                    {t('update')}
                </button>
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

export default PrincipalFeeManagement;