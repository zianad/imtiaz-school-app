
import React from 'react';
import { Student, School } from '../../../../packages/core/types';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface TeacherGenerateReportCardProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    students: Student[];
    onSelectStudent: (student: Student) => void;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherGenerateReportCard: React.FC<TeacherGenerateReportCardProps> = ({ school, toggleDarkMode, isDarkMode, students, onSelectStudent, onBack, onLogout }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">إنشاء ملاحظات بالذكاء الإصطناعي ✨</h1>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6 text-lg">اختر التلميذ(ة) لإنشاء ملاحظة مخصصة بناءً على نقاطه.</p>
            
            {students.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {students.map(student => (
                        <button
                            key={student.id}
                            onClick={() => onSelectStudent(student)}
                            className="w-full text-right p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-200 shadow-sm border-r-4 border-transparent hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">{student.name}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">لا يوجد تلاميذ في هذا الفوج.</p>
            )}

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherGenerateReportCard;
