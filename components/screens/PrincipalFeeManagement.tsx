
import React, { useState } from 'react';
import { School } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface PrincipalFeeManagementProps {
    school: School;
    onUpdateFees: (monthlyFee: number, transportationFee: number) => void;
    onBack: () => void;
    onLogout: () => void;
}

const PrincipalFeeManagement: React.FC<PrincipalFeeManagementProps> = ({ school, onUpdateFees, onBack, onLogout }) => {
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
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-slate-700 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('manageFees')}</h1>

            <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
                    <label htmlFor="monthly-fee" className="block text-lg font-semibold text-gray-700 text-center mb-2">{t('monthlyFee')}</label>
                    <input
                        id="monthly-fee"
                        type="number"
                        value={monthlyFee}
                        onChange={e => setMonthlyFee(Number(e.target.value))}
                        placeholder={t('monthlyFeeAmountLabel')}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-lg"
                    />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
                    <label htmlFor="transport-fee" className="block text-lg font-semibold text-gray-700 text-center mb-2">{t('transportation')}</label>
                    <input
                        id="transport-fee"
                        type="number"
                        value={transportationFee}
                        onChange={e => setTransportationFee(Number(e.target.value))}
                        placeholder={t('transportationFeeAmountLabel')}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-lg"
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
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default PrincipalFeeManagement;
