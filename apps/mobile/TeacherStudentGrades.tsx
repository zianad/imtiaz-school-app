import React, { useState, useEffect } from 'react';
import { Student, Grade, Subject } from '../../packages/core/types';
import { SUBJECT_MAP } from '../../packages/core/constants';
import { useTranslation } from '../../packages/core/i18n';

interface MobileTeacherStudentGradesProps {
    student: Student;
    subject: Subject;
    initialGrades: Grade[];
    onSave: (subject: Subject, grades: Grade[]) => void;
    onBack: () => void;
}

const MobileTeacherStudentGrades: React.FC<MobileTeacherStudentGradesProps> = ({ student, subject, initialGrades, onSave, onBack }) => {
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

    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center' }}>إدخال نقط: {student.name}</h1>
            <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#3b82f6', textAlign: 'center', marginBottom: '16px' }}>{subject}</h2>

            <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: '16px' }}>
                <button 
                    onClick={() => setActiveSemester(1)}
                    style={{ flex: 1, padding: '8px', fontSize: '1rem', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer', color: activeSemester === 1 ? '#3b82f6' : '#6b7280', borderBottom: activeSemester === 1 ? '2px solid #3b82f6' : 'none' }}
                >
                    الأسدس الأول
                </button>
                <button 
                    onClick={() => setActiveSemester(2)}
                    style={{ flex: 1, padding: '8px', fontSize: '1rem', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer', color: activeSemester === 2 ? '#3b82f6' : '#6b7280', borderBottom: activeSemester === 2 ? '2px solid #3b82f6' : 'none' }}
                >
                    الأسدس الثاني
                </button>
            </div>

            <div style={{ maxHeight: '50vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px' }}>
                {subSubjects.map(category => (
                    <div key={category} style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#1e40af', textAlign: 'center', marginBottom: '12px' }}>{category}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>الفرض الأول</label>
                                <input 
                                    type="number"
                                    step="0.25"
                                    min="0"
                                    max="10"
                                    value={getGrade(category, activeSemester, 1)}
                                    onChange={(e) => handleGradeChange(category, activeSemester, 1, e.target.value)}
                                    style={{ width: '80px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'center' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>الفرض الثاني</label>
                                <input 
                                    type="number" 
                                    step="0.25"
                                    min="0"
                                    max="10"
                                    value={getGrade(category, activeSemester, 2)}
                                    onChange={(e) => handleGradeChange(category, activeSemester, 2, e.target.value)}
                                    style={{ width: '80px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'center' }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={() => onSave(subject, grades)} style={{ width: '100%', marginTop: '16px', backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                حفظ النقط
            </button>
            <button
                onClick={onBack}
                style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#1f2937', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '8px', fontWeight: 'bold' }}
            >
                {t('back')}
            </button>
        </div>
    );
};

export default MobileTeacherStudentGrades;
