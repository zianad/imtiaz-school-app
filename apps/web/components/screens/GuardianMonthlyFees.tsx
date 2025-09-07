
import React, { useState, useMemo } from 'react';
import { Student, School, MonthlyFeePayment } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianMonthlyFeesProps {
    student: Student;
    school: School;
    payments: MonthlyFeePayment[];
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianMonthlyFees: React.FC<GuardianMonthlyFeesProps> = ({ student, school, payments, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    const academicYearMonths = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];

    const monthlyFee = school.monthlyFeeAmount || 0;
    const transportFee = school.transportationFee || 0;
    const totalFee = monthlyFee + transportFee;

    const getMonthStatus = (month: number) => {
        const year = month >= 9 ? currentYear : currentYear + 1; // Adjust for school year
        return payments.some(p => p.studentId === student.id && p.month === month && p.year === year);
    };

    const handlePay = () => {
        // In a real app, this would integrate with a payment gateway.
        setIsProcessing(true);
        setTimeout(() => {
            alert(t('paymentSuccessful'));
            setIsProcessing(false);
            setShowPaymentForm(false);
            // Here you would typically refetch payment data or update state.
        }, 2000);
    };

    const renderPaymentForm = () => (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner mt-4 space-y-3">
            <h3 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-200">{t('payByCard')}</h3>
            <div className="text-lg font-bold text-center text-blue-600 dark:text-blue-400">{totalFee.toLocaleString()} MAD</div>
            <input type="text" placeholder={t('cardNumber')} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
            <div className="flex gap-2">
                <input type="text" placeholder={t('expiryDate')} className="w-1/2 p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
                <input type="text" placeholder={t('cvc')} className="w-1/2 p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
            </div>
            <input type="text" placeholder={t('cardholderName')} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
            <button onClick={handlePay} disabled={isProcessing} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400">
                {isProcessing ? t('processingPayment') : t('confirmPayment')}
            </button>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('monthlyFees')}</h1>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner">
                <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-200 mb-4">{t('academicYearMonths')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {academicYearMonths.map(month => {
                        const hasPaid = getMonthStatus(month);
                        const isCurrent = month === currentMonth;
                        return (
                            <div key={month} className={`p-3 rounded-lg text-center font-bold ${hasPaid ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' : isCurrent ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 animate-pulse' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}`}>
                                {new Date(2000, month - 1, 1).toLocaleString('ar', { month: 'long' })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {!getMonthStatus(currentMonth) && totalFee > 0 && !showPaymentForm && (
                <button onClick={() => setShowPaymentForm(true)} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
                    {t('pay')} {new Date(2000, currentMonth-1, 1).toLocaleString('ar', { month: 'long' })}
                </button>
            )}

            {showPaymentForm && renderPaymentForm()}

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianMonthlyFees;
