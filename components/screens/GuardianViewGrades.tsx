
import React from 'react';
import { Student, Subject, Grade } from '../../core/types';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import { useTranslation } from '../../core/i18n';
import LanguageSwitcher from '../common/LanguageSwitcher';

declare global {
  interface Window {
    Recharts: any;
  }
}

interface GuardianViewGradesProps {
  student: Student;
  subject: Subject;
  onBack: () => void;
  onLogout: () => void;
}

const GuardianViewGrades: React.FC<GuardianViewGradesProps> = ({ student, subject, onBack, onLogout }) => {
    const Recharts = window.Recharts || {};
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;
    const { t, language } = useTranslation();
    const isFrenchUI = language === 'fr';

    const title = t('performanceTracking'); // Changed to be more generic
    const description = isFrenchUI ? "Le graphique montre la moyenne des notes pour chaque série de devoirs." : "يعرض المبيان متوسط النقط لكل سلسلة من الفروض.";
    const loadingText = isFrenchUI ? "Chargement du graphique..." : "جاري تحميل المبيان...";
    const scoreLabel = isFrenchUI ? "Moyenne" : "المعدل";
    const noDataText = isFrenchUI ? "Pas de notes disponibles pour cette matière." : "لا توجد نقط مسجلة لهذه المادة بعد.";

    if (!ResponsiveContainer) {
        return (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in w-full text-center relative">
                 <div className="absolute top-4 start-4 z-10">
                    <LanguageSwitcher />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">{title}</h1>
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">{loadingText}</p>
                </div>
                 <div className="mt-8 flex items-center gap-4">
                    <BackButton onClick={onBack} />
                    <LogoutButton onClick={onLogout} />
                </div>
            </div>
        );
    }

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
    
    const chartData = processGradesForChart(student.grades[subject]);
    const hasData = chartData.some(d => d[scoreLabel] !== null);

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher/>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">{title}</h1>
            <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center">{subject}</h2>

            <div className="p-3 mb-4 bg-blue-50 text-blue-800 border-r-4 border-blue-500 rounded-lg text-sm text-center">
                {description}
            </div>
            
            <div className="w-full h-64 mt-4 bg-gray-50 p-4 rounded-lg">
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#4B5563" />
                            <YAxis type="number" domain={[0, 10]} stroke="#4B5563" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '0.5rem',
                                    direction: isFrenchUI ? 'ltr' : 'rtl',
                                }}
                            />
                            <Legend />
                            <Line connectNulls type="monotone" dataKey={scoreLabel} stroke="#3B82F6" strokeWidth={3} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-lg">{noDataText}</p>
                    </div>
                )}
            </div>
            
            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewGrades;