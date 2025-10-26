import React, { useState } from 'react';
import { Student, MonthlyFeePayment, School, EducationalStage } from '../../types';
import { STAGE_DETAILS, CLASSES } from '../../constants';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface PrincipalMonthlyFeesProps {
    school: School;
    stage: EducationalStage;
    students: Student[];
    payments: MonthlyFeePayment[];
    onMarkAsPaid: (studentId: string) => void;
    onBack: () => void;
    onLogout: () => void;
}

const PrincipalMonthlyFees: React.FC<PrincipalMonthlyFeesProps> = ({ school, stage, students, payments, onMarkAsPaid, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const stageLevels = STAGE_DETAILS[stage].levels;

    const getPaymentStatus = (studentId: string) => {
        return payments.some(p => p.studentId === studentId && p.month === currentMonth && p.year === currentYear);
    };
    
    const handleMarkPaid = (studentId: string) => {
        onMarkAsPaid(studentId);
    };

    const renderStudentList = () => {
        const classStudents = students.filter(s => s.level === selectedLevel && s.class === selectedClass);
        return (
            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">{selectedLevel} - {selectedClass}</h2>
                <div className="max-h-[60vh] overflow-y-auto space-y-3 p-2">
                    {classStudents.length > 0 ? classStudents.map(student => {
                        const hasPaid = getPaymentStatus(student.id);
                        return (
                            <div key={student.id} className={`p-3 rounded-lg shadow-sm flex justify-between items-center ${hasPaid ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
                                <span className="font-bold text-gray-800">{student.name}</span>
                                {hasPaid ? (
                                    <span className="font-semibold text-green-700">{t('paid')}</span>
                                ) : (
                                    <button onClick={() => handleMarkPaid(student.id)} className="bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-blue-600 transition">
                                        {t('markAsPaid')}
                                    </button>
                                )}
                            </div>
                        )
                    }) : <p className="text-gray-500 text-center py-4">{t('noStudents')}</p>}
                </div>
                 <div className="mt-6">
                    <button onClick={() => setSelectedClass(null)} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out shadow-sm">
                        {t('back')}
                    </button>
                </div>
            </div>
        );
    };

    const renderClassList = () => (
        <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">{t('selectClassPrompt')}</h2>
            <div className="space-y-3">
                {CLASSES.map(cls => (
                    <button key={cls} onClick={() => setSelectedClass(cls)} className="w-full text-lg bg-blue-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-600 transition">
                        {cls}
                    </button>
                ))}
            </div>
            <div className="mt-6">
                 <button onClick={() => setSelectedLevel(null)} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out shadow-sm">
                    {t('back')}
                 </button>
            </div>
        </div>
    );
    
    const renderLevelList = () => (
        <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">{t('level')}</h2>
            <div className="space-y-3">
                {stageLevels.map(level => (
                    <button key={level} onClick={() => setSelectedLevel(level)} className="w-full text-lg bg-blue-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-600 transition">
                        {level}
                    </button>
                ))}
            </div>
             <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-green-600 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('principalFeeManagement')}</h1>
            
            {selectedLevel && selectedClass ? renderStudentList() : selectedLevel ? renderClassList() : renderLevelList()}
        </div>
    );
};

export default PrincipalMonthlyFees;