
import React from 'react';
import { Student } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';

interface TeacherGenerateReportCardProps {
    students: Student[];
    onSelectStudent: (student: Student) => void;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherGenerateReportCard: React.FC<TeacherGenerateReportCardProps> = ({ students, onSelectStudent, onBack, onLogout }) => {
    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">إنشاء ملاحظات بالذكاء الإصطناعي ✨</h1>
            <p className="text-gray-500 text-center mb-6 text-lg">اختر التلميذ(ة) لإنشاء ملاحظة مخصصة بناءً على نقاطه.</p>
            
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

export default TeacherGenerateReportCard;