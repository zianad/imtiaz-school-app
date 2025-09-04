
import React, { useState } from 'react';
import { Student, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface TeacherNotesFormProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    students: Student[];
    onSaveNote: (studentIds: string[], observation: string) => void;
    onMarkAbsent: (studentIds: string[]) => void;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherNotesForm: React.FC<TeacherNotesFormProps> = ({ school, toggleDarkMode, isDarkMode, students, onSaveNote, onMarkAbsent, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [observation, setObservation] = useState('');

    const handleStudentSelect = (studentId: string) => {
        setSelectedStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };
    
    const handleSelectAll = () => {
        if (selectedStudentIds.length === students.length) {
            setSelectedStudentIds([]);
        } else {
            setSelectedStudentIds(students.map(s => s.id));
        }
    };

    const handleSave = () => {
        if (selectedStudentIds.length === 0 || !observation.trim()) {
            alert(t('fillAllFields'));
            return;
        }
        onSaveNote(selectedStudentIds, observation);
        setObservation('');
        setSelectedStudentIds([]);
    };

    const handleAbsence = () => {
        if (selectedStudentIds.length === 0) {
            alert(t('fillAllFields'));
            return;
        }
        onMarkAbsent(selectedStudentIds);
        setSelectedStudentIds([]);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('notesAndAbsences')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Selection */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-inner">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold text-lg text-gray-700 dark:text-gray-200">اختيار التلاميذ</h2>
                        <button onClick={handleSelectAll} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                            {selectedStudentIds.length === students.length ? 'إلغاء الكل' : 'تحديد الكل'}
                        </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                        {students.map(student => (
                            <label key={student.id} className="flex items-center p-2 bg-white dark:bg-gray-800 rounded-md cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={selectedStudentIds.includes(student.id)}
                                    onChange={() => handleStudentSelect(student.id)}
                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="mr-3 font-medium text-gray-800 dark:text-gray-200">{student.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Note & Absence Actions */}
                <div className="space-y-4">
                    <textarea
                        placeholder="اكتب ملاحظتك هنا..."
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        rows={8}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    <button
                        onClick={handleSave}
                        disabled={selectedStudentIds.length === 0 || !observation.trim()}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow-lg disabled:bg-gray-400"
                    >
                        {t('sendForReview')}
                    </button>
                    <button
                        onClick={handleAbsence}
                        disabled={selectedStudentIds.length === 0}
                        className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition shadow-lg disabled:bg-gray-400"
                    >
                        تسجيل غياب
                    </button>
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherNotesForm;
