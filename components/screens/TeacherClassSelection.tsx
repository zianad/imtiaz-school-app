
import React from 'react';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import { useTranslation } from '../../core/i18n';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface TeacherClassSelectionProps {
    onSelectClass: (className: string) => void;
    onBack: () => void;
    onLogout: () => void;
    classes: string[];
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const TeacherClassSelection: React.FC<TeacherClassSelectionProps> = ({ onSelectClass, onBack, onLogout, classes }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border-t-8 border-blue-600 animate-fade-in relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">اختر القسم</h1>
            <h2 className="text-xl text-gray-600 mb-8">القسم الذي تدرسه حاليا</h2>
            
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

            <p className="text-xs text-gray-400 mt-8">ملاحظة: أنا سأدخل يدويا في الكود عدد المجموعات</p>

            <div className="mt-6 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherClassSelection;
