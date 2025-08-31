import React, { useState, useEffect } from 'react';
import { Student, Grade, Subject, School } from '../../../../packages/core/types';
import { SUBJECT_MAP } from '../../../../packages/core/constants';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { useTranslation } from '../../../../packages/core/i18n';

interface TeacherStudentGradesProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    student: Student;
    subject: Subject;
    initialGrades: Grade[];
    onSave: (studentId: string, subject: Subject, grades: Grade[]) => void;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherStudentGrades: React.FC<TeacherStudentGradesProps> = ({ school, toggleDarkMode, isDarkMode, student, subject, initialGrades, onSave, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [grades, setGrades] = useState<Grade[]>(initialGrades);
    const [activeSemester, setActiveSemester] = useState<1 | 2>(1);

    const subSubjects = SUBJECT_MAP[subject] || [];

    useEffect(() => {
        setGrades(initialGrades);
    }, [initialGrades]);

    const handleGradeChange = (subSubject: string, semester: 1 | 2, assignment: 1 | 2, score: string) => {
        const newGrades = [...grades];
        const gradeIndex = newGrades.findIndex(g => g.subSubject === subSubject && g.semester === semester && g.assignment === assignment);
        
        const newScore = score === '' ? null : Math.max(0, Math.min(10, parseFloat(score)));

        if (gradeIndex > -1) {
            newGrades[gradeIndex].score = newScore;
        } else {
            newGrades.push({ subSubject, semester, assignment, score: newScore });
        }
        setGrades(newGrades);
    };

    const getGrade = (subSubject: string, semester: 1 | 2, assignment: 1 | 2): string => {
        const grade = grades.find(g => g.subSubject === subSubject && g.semester === semester && g.assignment === assignment)?.score;
        return grade === null || grade === undefined ? '' : String(grade);
    };

    const handleSaveClick = () => {
        onSave(student.id, subject, grades);
        alert(t('saveSuccess'));
        onBack();
    };

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

            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">إدخال نقط التلميذ(ة): {student.name}</h1>
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400 text-center mb-6">{subject}</h2>

            <div className="flex border-b-2 border-gray-200 dark:border-gray-700 mb-4">
                <button
                    onClick={() => setActiveSemester(1)}
                    className={`flex-1 py-2 text-lg font-semibold transition-colors ${activeSemester === 1 ? 'border-b-4 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    الأسدس الأول
                </button>
                <button
                    onClick={() => setActiveSemester(2)}
                    className={`flex-1 py-2 text-lg font-semibold transition-colors ${activeSemester === 2 ? 'border-b-4 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    الأسدس الثاني
                </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-2">
                {subSubjects.map(category => (
                    <div key={category} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 text-center mb-3">{category}</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-gray-700 dark:text-gray-300">الفرض الأول</label>
                                <input
                                    type="number"
                                    step="0.25"
                                    min="0"
                                    max="10"
                                    value={getGrade(category, activeSemester, 1)}
                                    onChange={(e) => handleGradeChange(category, activeSemester, 1, e.target.value)}
                                    className="w-24 p-2 border-2 border-gray-300 rounded-lg text-center font-bold bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-gray-700 dark:text-gray-300">الفرض الثاني</label>
                                <input
                                    type="number"
                                    step="0.25"
                                    min="0"
                                    max="10"
                                    value={getGrade(category, activeSemester, 2)}
                                    onChange={(e) => handleGradeChange(category, activeSemester, 2, e.target.value)}
                                    className="w-24 p-2 border-2 border-gray-300 rounded-lg text-center font-bold bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSaveClick}
                className="w-full mt-6 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition shadow-lg text-lg"
            >
                حفظ النقط
            </button>

            <div className="mt-4 flex items-center gap-4">
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

export default TeacherStudentGrades;
