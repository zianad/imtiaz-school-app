import React, { useState } from 'react';
import { Student, Grade, Subject, School } from '../../../../packages/core/types';
import { SUBJECT_MAP } from '../../../../packages/core/constants';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianViewGradesProps {
    student: Student;
    subject: Subject | null;
    school: School;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewGrades: React.FC<GuardianViewGradesProps> = ({ student, subject, school, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [activeSemester, setActiveSemester] = useState<1 | 2>(1);
    
    if (!subject) {
        return <div>Error: Subject not selected.</div>;
    }

    const grades = (student.grades || {})[subject] || [];
    const subSubjects = SUBJECT_MAP[subject] || [];

    const getGrade = (subSubject: string, semester: 1 | 2, assignment: 1 | 2): number | null => {
        const grade = grades.find(g => g.subSubject === subSubject && g.semester === semester && g.assignment === assignment);
        return grade ? grade.score : null;
    };

    const calculateAverage = (scores: (number | null)[]): string => {
        const validScores = scores.filter(s => s !== null) as number[];
        if (validScores.length === 0) return '-';
        const average = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
        return average.toFixed(2);
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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">{t('studentGrades')}: {student.name}</h1>
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

            <div className="max-h-[50vh] overflow-y-auto pr-2">
                <table className="w-full text-center border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300">المكون</th>
                            <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300">الفرض 1</th>
                            <th className="p-3 font-semibold text-sm text-gray-600 dark:text-gray-300">الفرض 2</th>
                            <th className="p-3 font-semibold text-sm text-blue-600 dark:text-blue-400">المعدل</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subSubjects.map(sub => {
                            const score1 = getGrade(sub, activeSemester, 1);
                            const score2 = getGrade(sub, activeSemester, 2);
                            const avg = calculateAverage([score1, score2]);
                            return (
                                <tr key={sub} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{sub}</td>
                                    <td className={`p-3 font-bold ${(score1 ?? 0) < 5 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>{score1 ?? '-'}</td>
                                    <td className={`p-3 font-bold ${(score2 ?? 0) < 5 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>{score2 ?? '-'}</td>
                                    <td className={`p-3 font-bold ${parseFloat(avg) < 5 ? 'text-red-600' : 'text-blue-600 dark:text-blue-400'}`}>{avg}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewGrades;