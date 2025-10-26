
import React, { useState, useEffect } from 'react';
import { Student, Grade, Subject } from '../../core/types';
import { SUBJECT_MAP } from '../../core/constants';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface TeacherStudentGradesProps {
    student: Student;
    subject: Subject;
    initialGrades: Grade[];
    onSave: (subject: Subject, grades: Grade[]) => void;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherStudentGrades: React.FC<TeacherStudentGradesProps> = ({ student, subject, initialGrades, onSave, onBack, onLogout }) => {
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

    const isSocialStudies = (sub: string) => sub === 'الإجتماعيات';
    const shouldShowSocialStudies = student.level !== 'المستوى الأول ابتدائي' && student.level !== 'المستوى الثاني ابتدائي' && student.level !== 'المستوى الثالث ابتدائي';

    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">إدخال نقط: {student.name}</h1>
            <h2 className="text-lg font-semibold text-blue-700 mb-6 text-center">{subject}</h2>
            
            <div className="flex justify-center border-b-2 border-gray-200 mb-4">
                <button 
                    onClick={() => setActiveSemester(1)}
                    className={`px-6 py-2 text-lg font-semibold rounded-t-lg transition-colors duration-200 ${activeSemester === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    الأسدس الأول
                </button>
                <button 
                    onClick={() => setActiveSemester(2)}
                    className={`px-6 py-2 text-lg font-semibold rounded-t-lg transition-colors duration-200 ${activeSemester === 2 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    الأسدس الثاني
                </button>
            </div>
            
            <div className="space-y-4 max-h-[50vh] overflow-y-auto p-2">
                {subSubjects.map(category => {
                    if (isSocialStudies(category) && !shouldShowSocialStudies) {
                        return null;
                    }
                    return (
                        <div key={category} className="bg-blue-50 p-4 rounded-lg shadow-sm">
                            <h3 className="font-bold text-blue-800 text-center mb-3 text-lg">{category}</h3>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                <div className="flex items-center">
                                    <label className="flex-1 text-md text-gray-700">الفرض الأول</label>
                                    <input 
                                        type="number"
                                        step="0.25"
                                        min="0"
                                        max="10"
                                        value={getGrade(category, activeSemester, 1)}
                                        onChange={(e) => handleGradeChange(category, activeSemester, 1, e.target.value)}
                                        className="w-24 p-2 border-2 border-gray-300 rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <label className="flex-1 text-md text-gray-700">الفرض الثاني</label>
                                    <input 
                                        type="number" 
                                        step="0.25"
                                        min="0"
                                        max="10"
                                        value={getGrade(category, activeSemester, 2)}
                                        onChange={(e) => handleGradeChange(category, activeSemester, 2, e.target.value)}
                                        className="w-24 p-2 border-2 border-gray-300 rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

             <button onClick={() => onSave(subject, grades)} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg text-lg">
                حفظ النقط
            </button>

            <div className="mt-6 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherStudentGrades;