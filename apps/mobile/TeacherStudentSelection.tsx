import React from 'react';
import { Student } from '../../packages/core/types';
import { useTranslation } from '../../packages/core/i18n';

interface MobileTeacherStudentSelectionProps {
    students: Student[];
    onSelectStudent: (student: Student) => void;
    onBack: () => void;
}

const MobileTeacherStudentSelection: React.FC<MobileTeacherStudentSelectionProps> = ({ students, onSelectStudent, onBack }) => {
    const { t } = useTranslation();
    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>{t('studentGrades')}</h1>
            
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {students.length > 0 ? (
                    students.map(student => (
                        <button
                            key={student.id}
                            onClick={() => onSelectStudent(student)}
                            style={{ width: '100%', textAlign: 'right', padding: '16px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '1rem' }}
                        >
                            {student.name}
                        </button>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#6b7280' }}>{t('noStudents')}</p>
                )}
            </div>
            
            <button
                onClick={onBack}
                style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#1f2937', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '16px', fontWeight: 'bold' }}
            >
                {t('back')}
            </button>
        </div>
    );
};

export default MobileTeacherStudentSelection;
