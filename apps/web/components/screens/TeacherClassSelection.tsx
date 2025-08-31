import React from 'react';
import { useTranslation } from '../../../../packages/core/i18n';
import { School } from '../../../../packages/core/types';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface TeacherClassSelectionProps {
    school: School;
    onSelectClass: (className: string) => void;
    onBack: () => void;
    onLogout: () => void;
    classes: string[];
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const TeacherClassSelection: React.FC<TeacherClassSelectionProps> = ({ school, onSelectClass, onBack, onLogout, classes, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                    <span className="font-bold text-lg text-gray-700 dark:text-gray-200">{school.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">اختر القسم</h1>
            <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-8">القسم الذي تدرسه حاليا</h2>
            
            <div className="flex flex-col items-center gap-4">
                {classes.map(className => (
                    <button
                        key={className}
                        onClick={() => onSelectClass(className)}
                        className="w-full max-w-sm bg-blue-500 text-white font-bold py-5 px-12 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out shadow-lg text-xl transform hover:scale-105"
                    >
                        {className}
                    </button>
                ))}
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 mt-8">ملاحظة: أنا سأدخل يدويا في الكود عدد المجموعات</p>

            <div className="mt-6 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherClassSelection;