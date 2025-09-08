import React, { useState, useMemo, useEffect } from 'react';
import { Student, MonthlyFeePayment, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianMonthlyFeesProps {
    student: Student;
    school: School;
    onPay: (month: number, year: number, amount: number) => void;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

type AcademicMonth = {
    name: string;
    month: number; // 1-12
    year: number;
};

const GuardianMonthlyFees: React.FC<GuardianMonthlyFeesProps> = ({ student, school, onPay, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    // FIX: Destructure i18n from useTranslation to correctly access the language property.
    const { t, i18n } = useTranslation();
    const [payments, setPayments] = useState<MonthlyFeePayment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<AcademicMonth | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvc: '', name: '' });
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [includeTransportation, setIncludeTransportation] = useState(false);
    
    const monthlyFee = school.monthlyFeeAmount || 500;
    const transportationFee = school.transportationFee || 250;
    const totalAmount = monthlyFee + (includeTransportation ? transportationFee : 0);

    const fetchPayments = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('monthly_fee_payments')
            .select('*')
            .eq('school_id', school.id)
            .eq('student_id', student.id);
        
        if(error) console.error("Error fetching payments:", error);
        else setPayments(snakeToCamelCase(data));
        setIsLoading(false);
    };

    useEffect(() => {
        fetchPayments();
    }, [school.id, student.id]);

    const getAcademicYearMonths = useMemo((): AcademicMonth[] => {
        const now = new Date();
        const currentMonth = now.getMonth(); // 0-11
        const currentFullYear = now.getFullYear();
        // Academic year in Morocco is from September (month 8) to June.
        const startYear = currentMonth >= 8 ? currentFullYear : currentFullYear - 1;
        
        const months: AcademicMonth[] = [];
        for (let i = 0; i < 10; i++) { // September to June
            const monthIndex = (8 + i) % 12;
            const year = startYear + (monthIndex < 8 ? 1 : 0);
            const date = new Date(year, monthIndex, 1);
            months.push({ 
                name: date.toLocaleString(i18n.language === 'fr' ? 'fr-FR' : 'ar-MA', { month: 'long' }), 
                month: monthIndex + 1, // 1-12
                year: year 
            });
        }
        return months;
    }, [i18n.language]);

    const handlePayClick = (month: AcademicMonth) => {
        setSelectedMonth(month);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (isProcessing) return;
        setIsModalOpen(false);
        setSelectedMonth(null);
        setCardInfo({ number: '', expiry: '', cvc: '', name: '' });
        setIncludeTransportation(false);
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!cardInfo.number.match(/^\d{16}$/) || !cardInfo.expiry.match(/^\d{2}\/\d{2}$/) || !cardInfo.cvc.match(/^\d{3}$/) || !cardInfo.name.trim()) {
            alert(t('fillAllFields'));
            return;
        }
        
        setIsProcessing(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 2500));
        
        if (selectedMonth) {
            onPay(selectedMonth.month, selectedMonth.year, totalAmount);
        }
        
        setIsProcessing(false);
        setPaymentSuccess(true);
        await fetchPayments(); // Refetch payments after successful transaction
        setTimeout(() => {
            handleCloseModal();
            setPaymentSuccess(false);
        }, 2000);
    };
    
    const renderPaymentModal = () => {
        if (!isModalOpen || !selectedMonth) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                    {paymentSuccess ? (
                        <div className="text-center p-4">
                            <div className="text-6xl mb-4">✅</div>
                            <h2 className="text-2xl font-bold text-green-600">{t('paymentSuccessful')}</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">شكراً لكم!</p>
                        </div>
                    ) : (
                        <form onSubmit={handlePaymentSubmit}>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center mb-2">{t('payByCard')}</h2>
                            <p className="text-center text-gray-600 dark:text-gray-300 mb-4">{selectedMonth.name} {selectedMonth.year}</p>

                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
                                <div className="flex justify-between items-center text-gray-800 dark:text-gray-200">
                                    <span>{t('monthlyFees')}:</span>
                                    <span className="font-semibold">{monthlyFee} {t('paymentAmount').replace(/.*\((.*)\)/, '$1')}</span>
                                </div>

                                <label className="flex justify-between items-center text-gray-800 dark:text-gray-200 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" checked={includeTransportation} onChange={e => setIncludeTransportation(e.target.checked)} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                                        <span>{t('transportation')}:</span>
                                    </div>
                                    <span className="font-semibold">{transportationFee} {t('paymentAmount').replace(/.*\((.*)\)/, '$1')}</span>
                                </label>
                                
                                <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>

                                <div className="flex justify-between items-center text-gray-900 dark:text-gray-100 font-bold text-lg">
                                    <span>{t('totalAmount')}:</span>
                                    <span>{totalAmount} {t('paymentAmount').replace(/.*\((.*)\)/, '$1')}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <input type="tel" value={cardInfo.number} onChange={e => setCardInfo({...cardInfo, number: e.target.value.replace(/\D/g, '')})} placeholder={t('cardNumber')} maxLength={16} className="w-full p-3 border-2 bg-gray-100 border-gray-300 rounded-lg text-center tracking-wider text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required />
                                <div className="flex gap-4">
                                    <input type="tel" value={cardInfo.expiry} onChange={e => setCardInfo({...cardInfo, expiry: e.target.value})} placeholder={t('expiryDate')} className="w-1/2 p-3 border-2 bg-gray-100 border-gray-300 rounded-lg text-center text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required />
                                    <input type="tel" value={cardInfo.cvc} onChange={e => setCardInfo({...cardInfo, cvc: e.target.value.replace(/\D/g, '')})} placeholder={t('cvc')} maxLength={3} className="w-1/2 p-3 border-2 bg-gray-100 border-gray-300 rounded-lg text-center text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required />
                                </div>
                                <input type="text" value={cardInfo.name} onChange={e => setCardInfo({...cardInfo, name: e.target.value})} placeholder={t('cardholderName')} className="w-full p-3 border-2 bg-gray-100 border-gray-300 rounded-lg text-center text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required />
                            </div>

                            <div className="mt-6 space-y-2">
                                <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg disabled:bg-blue-300 disabled:cursor-wait flex items-center justify-center">
                                    {isProcessing && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                    {isProcessing ? t('processingPayment') : t('confirmPayment')}
                                </button>
                                <button type="button" onClick={handleCloseModal} disabled={isProcessing} className="w-full bg-gray-200 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition">
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">{t('monthlyFees')}</h1>
            <p className="text-center text-gray-600 mb-6">{t('monthlyFeePrompt' as any)}</p>
            
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center border-b pb-2">{t('academicYearMonths')}</h2>
                {isLoading ? <p>{t('loading')}...</p> : (
                <div className="max-h-96 overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-lg">
                    {getAcademicYearMonths.map(month => {
                        const isPaid = payments.some(p => p.month === month.month && p.year === month.year);
                        return (
                            <div key={`${month.year}-${month.month}`} className={`p-4 rounded-lg shadow-sm flex justify-between items-center border-l-8 ${isPaid ? 'bg-green-100 border-green-500' : 'bg-red-50 border-red-500'}`}>
                                <div>
                                    <p className="font-bold text-lg text-gray-800">{month.name} <span className="text-sm text-gray-500">{month.year}</span></p>
                                    <p className={`text-sm font-semibold ${isPaid ? 'text-green-700' : 'text-red-700'}`}>{isPaid ? t('paymentCompleted') : t('paymentDue')}</p>
                                </div>
                                {!isPaid && (
                                    <button onClick={() => handlePayClick(month)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-md">
                                        {t('pay')}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
            
            {renderPaymentModal()}
        </div>
    );
};

export default GuardianMonthlyFees;