import React from 'react';
import { Student, Subject, Grade, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import { SUBJECT_MAP } from '../../../../packages/core/constants';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GuardianViewGradesProps {
  school: School;
  student: Student;
  subject: Subject;
  onBack: () => void;
  onLogout: () => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const GuardianViewGrades: React.FC<GuardianViewGradesProps> = ({ school, student, subject, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t, language } = useTranslation();
    const isFrenchUI = language === 'fr';

    const title = t('studentGrades');
    const description = isFrenchUI ? "Le graphique montre la moyenne des notes pour chaque série de devoirs." : "يعرض المبيان متوسط النقط لكل سلسلة من الفروض.";
    const scoreLabel = isFrenchUI ? "Moyenne" : "المعدل";
    const noDataText = isFrenchUI ? "Pas de notes disponibles pour cette matière." : "لا توجد نقط مسجلة لهذه المادة بعد.";

    const processGradesForChart = (gradesForSubject: Grade[] | undefined) => {
        const assignments = [
            { semester: 1, assignment: 1, name: isFrenchUI ? 'DS 1 (S1)' : 'ف 1 (س1)' },
            { semester: 1, assignment: 2, name: isFrenchUI ? 'DS 2 (S1)' : 'ف 2 (س1)' },
            { semester: 2, assignment: 1, name: isFrenchUI ? 'DS 1 (S2)' : 'ف 1 (س2)' },
            { semester: 2, assignment: 2, name: isFrenchUI ? 'DS 2 (S2)' : 'ف 2 (س2)' },
        ];

        return assignments.map(point => {
            const relevantGrades = gradesForSubject?.filter(g => 
                g.semester === point.semester && g.assignment === point.assignment && g.score !== null
            ) || [];

            let average = null;
            if (relevantGrades.length > 0) {
                const sum = relevantGrades.reduce((acc, curr) => acc + (curr.score ?? 0), 0);
                average = parseFloat((sum / relevantGrades.length).toFixed(2));
            }
            return { name: point.name, [scoreLabel]: average };
        });
    };
    
    const gradesForSubject = student.grades[subject] || [];
    const chartData = processGradesForChart(gradesForSubject);
    const hasData = chartData.some(d => d[scoreLabel] !== null);

    const subSubjects = SUBJECT_MAP[subject] || [];

    const getGradeFor = (subSubject: string, semester: 1 | 2, assignment: 1 | 2): number | null => {
        return gradesForSubject.find(g => g.subSubject === subSubject && g.semester === semester && g.assignment === assignment)?.score ?? null;
    }

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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">{title} - {subject}</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">{description}</p>
            
            <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {hasData ? (
                    <div className="w-full h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#4A5568" : "#E2E8F0"} />
                                <XAxis dataKey="name" stroke={isDarkMode ? "#A0AEC0" : "#4A5568"} fontSize={12} />
                                <YAxis type="number" domain={[0, 10]} stroke={isDarkMode ? "#A0AEC0" : "#4A5568"} />
                                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#2D3748' : '#FFFFFF', border: '1px solid #4A5568' }} />
                                <Legend />
                                <Line connectNulls type="monotone" dataKey={scoreLabel} stroke="#3B82F6" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">{noDataText}</p>
                    </div>
                )}
            </div>
            
            <div className="max-h-60 overflow-y-auto">
                 <table className="w-full text-sm text-center">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-2 py-3">{t('subject')}</th>
                            <th className="px-2 py-3">ف1 (س1)</th>
                            <th className="px-2 py-3">ف2 (س1)</th>
                            <th className="px-2 py-3">ف1 (س2)</th>
                            <th className="px-2 py-3">ف2 (س2)</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 dark:text-gray-200">
                        {subSubjects.map(sub => (
                            <tr key={sub} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className="px-2 py-2 font-semibold">{sub}</td>
                                <td>{getGradeFor(sub, 1, 1)}</td>
                                <td>{getGradeFor(sub, 1, 2)}</td>
                                <td>{getGradeFor(sub, 2, 1)}</td>
                                <td>{getGradeFor(sub, 2, 2)}</td>
                            </tr>
                        ))}
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