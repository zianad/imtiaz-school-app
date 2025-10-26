import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { School, Student, Teacher, MonthlyFeePayment, Expense, EducationalStage } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';


interface PrincipalFinancialDashboardProps {
    school: School;
    stage: EducationalStage;
    onAddExpense: (expense: Omit<Expense, 'id' | 'type' | 'teacherId'>) => void;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    isDesktop?: boolean;
}

const PrincipalFinancialDashboard: React.FC<PrincipalFinancialDashboardProps> = ({
    school,
    stage,
    onAddExpense,
    onBack,
    onLogout,
    toggleDarkMode,
    isDarkMode,
    isDesktop = false,
}) => {
    const { t } = useTranslation();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [financialData, setFinancialData] = useState<{
        monthlyIncome: number;
        salaryExpenses: number;
        manualExpensesTotal: number;
        manualExpensesForCurrentMonth: Expense[];
        allPaymentsForStage: MonthlyFeePayment[];
        allStudentsForStage: Student[];
    }>({
        monthlyIncome: 0,
        salaryExpenses: 0,
        manualExpensesTotal: 0,
        manualExpensesForCurrentMonth: [],
        allPaymentsForStage: [],
        allStudentsForStage: []
    });

    const fetchFinancialData = useCallback(async () => {
        setIsLoading(true);
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        // 1. Get student IDs for the current stage
        const { data: studentsData, error: studentsError } = await supabase
            .from('students')
            .select('id, name')
            .eq('school_id', school.id)
            .eq('stage', stage);
        
        if (studentsError) {
            console.error(studentsError);
            setIsLoading(false);
            return;
        }
        const studentsForStage = snakeToCamelCase(studentsData) as Student[];
        const studentIds = studentsForStage.map(s => s.id);

        // 2. Get payments for those students for the current month
        const { data: paymentsData, error: paymentsError } = await supabase
            .from('monthly_fee_payments')
            .select('amount, student_id, date')
            .eq('school_id', school.id)
            .eq('month', currentMonth)
            .eq('year', currentYear)
            .in('student_id', studentIds);
        
        const monthlyIncome = paymentsError ? 0 : (paymentsData || []).reduce((sum, p) => sum + p.amount, 0);
        const allPayments = paymentsError ? [] : snakeToCamelCase(paymentsData) as MonthlyFeePayment[];

        // 3. Calculate salaries (teachers are already loaded)
        const salaryExpenses = (school.teachers || []).reduce((sum, t) => sum + (t.salary || 0), 0);
        
        // 4. Fetch manual expenses for the current month
        const { data: expensesData, error: expensesError } = await supabase
            .from('expenses')
            .select('*')
            .eq('school_id', school.id)
            .eq('type', 'manual')
            .gte('date', `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`)
            .lt('date', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`);

        const manualExpensesForCurrentMonth = expensesError ? [] : snakeToCamelCase(expensesData) as Expense[];
        const manualExpensesTotal = manualExpensesForCurrentMonth.reduce((sum, e) => sum + e.amount, 0);

        setFinancialData({
            monthlyIncome,
            salaryExpenses,
            manualExpensesTotal,
            manualExpensesForCurrentMonth,
            allPaymentsForStage: allPayments,
            allStudentsForStage: studentsForStage
        });
        setIsLoading(false);
    }, [school.id, stage, school.teachers]);

    useEffect(() => {
        fetchFinancialData();
    }, [fetchFinancialData]);
    
    const totalExpenses = financialData.salaryExpenses + financialData.manualExpensesTotal;
    const netProfit = financialData.monthlyIncome - totalExpenses;
    
    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        const expenseAmount = parseFloat(amount);
        if (description.trim() && !isNaN(expenseAmount) && expenseAmount > 0) {
            onAddExpense({
                description,
                amount: expenseAmount,
                date: new Date(),
            });
            setDescription('');
            setAmount('');
            // Refetch data to show new expense
            await fetchFinancialData();
        } else {
            alert(t('fillAllFields'));
        }
    };
    
    const currency = 'MAD';

    const renderLoadingState = () => (
        <div className="text-center py-10">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-yellow-500 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">{t('financialManagement')}</h1>
            
            {isLoading ? renderLoadingState() : (
            <>
                <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner">
                    <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-200 mb-4">{t('financialSummary')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-green-800 dark:text-green-300">{t('totalIncome')}</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{financialData.monthlyIncome.toLocaleString()} {currency}</p>
                        </div>
                        <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-red-800 dark:text-red-300">{t('totalExpenses')}</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{totalExpenses.toLocaleString()} {currency}</p>
                        </div>
                        <div className={`p-4 rounded-lg ${netProfit >= 0 ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-orange-100 dark:bg-orange-900/50'}`}>
                            <p className={`text-sm font-semibold ${netProfit >= 0 ? 'text-blue-800 dark:text-blue-300' : 'text-orange-800 dark:text-orange-300'}`}>{netProfit >= 0 ? t('netProfit') : t('netLoss')}</p>
                            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>{netProfit.toLocaleString()} {currency}</p>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('expenses')}</h2>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg max-h-48 overflow-y-auto">
                            <h3 className="font-bold text-center mb-2 text-gray-700 dark:text-gray-200">{t('teacherSalaries')}</h3>
                            {(school.teachers || []).filter(t => t.salary).map(t => (
                                <div key={t.id} className="flex justify-between text-sm p-1 text-gray-600 dark:text-gray-300"><span>{t.name}</span> <span className="font-mono">{t.salary?.toLocaleString()} {currency}</span></div>
                            ))}
                            <h3 className="font-bold text-center mt-3 mb-2 border-t pt-2 text-gray-700 dark:text-gray-200">{t('manualExpenses')}</h3>
                            {financialData.manualExpensesForCurrentMonth.map(e => (
                                <div key={e.id} className="flex justify-between text-sm p-1 text-gray-600 dark:text-gray-300"><span>{e.description}</span> <span className="font-mono">{e.amount.toLocaleString()} {currency}</span></div>
                            ))}
                        </div>
                        <form onSubmit={handleAddExpense} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
                            <h3 className="font-bold text-center text-gray-700 dark:text-gray-200">{t('addExpense')}</h3>
                            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder={t('expenseDescription')} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"/>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={t('amount')} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"/>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">{t('add')}</button>
                        </form>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('income')}</h2>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg max-h-96 overflow-y-auto">
                            {financialData.allPaymentsForStage.map(p => (
                                <div key={p.id} className="flex justify-between items-center text-sm p-2 border-b border-gray-200 dark:border-gray-600">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{financialData.allStudentsForStage.find(s=>s.id === p.studentId)?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(p.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className="font-mono font-bold text-green-600 dark:text-green-400">{p.amount.toLocaleString()} {currency}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
            )}
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

export default PrincipalFinancialDashboard;