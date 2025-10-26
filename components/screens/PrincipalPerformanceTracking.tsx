import React, { useState, useMemo } from 'react';
import { Student, EducationalStage } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';
import { STAGE_DETAILS } from '../../constants';

declare global {
  interface Window {
    Recharts: any;
  }
}

interface PrincipalPerformanceTrackingProps {
    stage: EducationalStage;
    students: Student[];
    onBack: () => void;
    onLogout: () => void;
}

const PrincipalPerformanceTracking: React.FC<PrincipalPerformanceTrackingProps> = ({ stage, students, onBack, onLogout }) => {
    const { t } = useTranslation();
    const Recharts = window.Recharts;
    
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

    const stageLevels = STAGE_DETAILS[stage].levels;

    const calculateStudentAverage = (student: Student): number | null => {
        const allGrades = Object.values(student.grades).flat().map(g => g.score).filter(s => s !== null) as number[];
        if (allGrades.length === 0) return null;
        return allGrades.reduce((sum, score) => sum + score, 0) / allGrades.length;
    };

    const levelAverages = useMemo(() => {
        return stageLevels.map(level => {
            const levelStudents = students.filter(s => s.level === level);
            const averages = levelStudents.map(calculateStudentAverage).filter(avg => avg !== null) as number[];
            if (averages.length === 0) return { name: level, [t('averageGrade')]: 0 };
            const levelAverage = averages.reduce((sum, avg) => sum + avg, 0) / averages.length;
            return { name: level, [t('averageGrade')]: parseFloat(levelAverage.toFixed(2)) };
        });
    }, [students, t, stageLevels]);
    
    const studentsInSelectedLevel = useMemo(() => {
        if (!selectedLevel) return [];
        return students.filter(s => s.level === selectedLevel)
            .map(s => ({ ...s, average: calculateStudentAverage(s) }))
            .sort((a, b) => (b.average || 0) - (a.average || 0));
    }, [selectedLevel, students]);

    if (!Recharts) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full text-center relative">
                <div className="absolute top-4 start-4 z-10">
                    <LanguageSwitcher />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('performanceTracking')}</h1>
                <p className="text-gray-600">Loading charts...</p>
                <div className="mt-8 flex items-center gap-4">
                    <BackButton onClick={onBack} />
                    <LogoutButton onClick={onLogout} />
                </div>
            </div>
        );
    }
    
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = Recharts;

    if (selectedLevel) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
                 <div className="absolute top-4 start-4 z-10">
                    <LanguageSwitcher />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t('levelPerformance', { level: selectedLevel })}</h1>
                <div className="max-h-[70vh] overflow-y-auto space-y-3 p-2">
                    {studentsInSelectedLevel.length > 0 ? (
                        studentsInSelectedLevel.map(student => (
                            <div key={student.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border-r-4 border-blue-400 flex justify-between items-center">
                                <span className="font-bold text-lg text-gray-800">{student.name}</span>
                                <span className="text-gray-600">
                                    {t('averageGrade')}:{' '}
                                    <span className={`font-bold text-lg ${(student.average ?? 0) >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                                        {student.average?.toFixed(2) ?? 'N/A'}
                                    </span>
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-10">{t('noStudents')}</p>
                    )}
                </div>
                <div className="mt-8 flex items-center gap-4">
                    <button 
                        onClick={() => setSelectedLevel(null)} 
                        className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out shadow-sm"
                    >
                        {t('back')}
                    </button>
                    <LogoutButton onClick={onLogout} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('performanceTracking')}</h1>
            
            <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-inner">
                <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">{t('averageGradePerLevel')}</h2>
                <div style={{ direction: 'ltr', width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={levelAverages} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 10]} />
                            <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }} interval={0}/>
                            <Tooltip />
                            <Bar dataKey={t('averageGrade')} fill="#3B82F6" background={{ fill: '#eee' }} onClick={(data) => setSelectedLevel(data.name)} style={{ cursor: 'pointer' }}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default PrincipalPerformanceTracking;