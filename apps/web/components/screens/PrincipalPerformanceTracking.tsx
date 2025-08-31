import React, { useState, useMemo } from 'react';
import { Student, EducationalStage, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import { STAGE_DETAILS } from '../../../../packages/core/constants';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

declare global {
  interface Window {
    Recharts: any;
  }
}

interface PrincipalPerformanceTrackingProps {
    school: School;
    stage: EducationalStage;
    students: Student[];
    onBack: () => void;
    onLogout: () => void;
    isDesktop?: boolean;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const PrincipalPerformanceTracking: React.FC<PrincipalPerformanceTrackingProps> = ({ school, stage, students, onBack, onLogout, isDesktop = false, toggleDarkMode, isDarkMode }) => {
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full text-center relative">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('performanceTracking')}</h1>
                <p className="text-gray-600 dark:text-gray-300">Loading charts...</p>
                <div className="mt-8 flex items-center gap-4">
                    <div className="w-1/2">
                       <BackButton onClick={onBack} />
                    </div>
                     <div className="w-1/2">
                        <LogoutButton onClick={onLogout} />
                    </div>
                </div>
            </div>
        );
    }
    
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = Recharts;

    if (selectedLevel) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 w-full relative">
                 <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">{t('levelPerformance', { level: selectedLevel })}</h1>
                <div className="max-h-[70vh] overflow-y-auto space-y-3 p-2">
                    {studentsInSelectedLevel.length > 0 ? (
                        studentsInSelectedLevel.map(student => (
                            <div key={student.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm border-r-4 border-blue-400 flex justify-between items-center">
                                <span className="font-bold text-lg text-gray-800 dark:text-gray-200">{student.name}</span>
                                <span className="text-gray-600 dark:text-gray-300">
                                    {t('averageGrade')}:{' '}
                                    <span className={`font-bold text-lg ${(student.average ?? 0) >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                                        {student.average?.toFixed(2) ?? 'N/A'}
                                    </span>
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-10">{t('noStudents')}</p>
                    )}
                </div>
                <div className="mt-8 flex items-center gap-4">
                    <div className="w-1/2">
                        <button 
                            onClick={() => setSelectedLevel(null)} 
                            className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out shadow-sm dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                        >
                            {t('back')}
                        </button>
                    </div>
                     <div className="w-1/2">
                        <LogoutButton onClick={onLogout} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('performanceTracking')}</h1>
            
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center mb-4">{t('averageGradePerLevel')}</h2>
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

export default PrincipalPerformanceTracking;