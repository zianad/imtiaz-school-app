
import React from 'react';
// Fix: Add School import
import { Student, School } from '../../../../packages/core/types';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
// Fix: Add ThemeSwitcher import
import ThemeSwitcher from '../common/ThemeSwitcher';

interface TeacherStudentSelectionProps {
    // Fix: Add school, toggleDarkMode, isDarkMode props
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    students: Student[];
    onSelectStudent: (student: Student) => void;
    onBack: () => void;
    onLogout: () => void;
    title: string;
}

const TeacherStudentSelection: React.FC<TeacherStudentSelectionProps> = ({ students, onSelectStudent, onBack, onLogout, title }) => {
    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in w-full relative">
             <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{title}</h1>
            
            {students.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {students.map(student => (
                        <button
                            key={student.id}
                            onClick={() => onSelectStudent(student)}
                            className="w-full text-right p-4 bg-gray-100 rounded-lg hover:bg-blue-100 transition duration-200 shadow-sm border-r-4 border-transparent hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <span className="font-semibold text-lg text-gray-800">{student.name}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">لا يوجد تلاميذ في هذا الفوج.</p>
            )}

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherStudentSelection;
