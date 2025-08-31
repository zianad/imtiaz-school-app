import React, { useState } from 'react';
import { Student } from '../../packages/core/types';
import { useTranslation } from '../../packages/core/i18n';

interface MobileTeacherManageNotesProps {
    students: Student[];
    onSaveNote: (studentIds: string[], observation: string) => void;
    onMarkAbsent: (studentIds: string[]) => void;
    onBack: () => void;
}

const MobileTeacherManageNotes: React.FC<MobileTeacherManageNotesProps> = ({ students, onSaveNote, onMarkAbsent, onBack }) => {
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
        if (selectedStudentIds.length === 0) {
            alert(t('pleaseSelectStudents' as any));
            return;
        }
        if (!observation.trim()) {
            alert(t('pleaseWriteNote' as any));
            return;
        }
        onSaveNote(selectedStudentIds, observation);
        setObservation('');
        setSelectedStudentIds([]);
    };

    const handleAbsence = () => {
        if (selectedStudentIds.length === 0) {
            alert(t('pleaseSelectForAbsence' as any));
            return;
        }
        onMarkAbsent(selectedStudentIds);
        setSelectedStudentIds([]);
    };

    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>{t('notesAndAbsences')}</h1>

            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h2 style={{ fontWeight: '600' }}>{t('selectStudentsLabel' as any)}</h2>
                    <button onClick={handleSelectAll} style={{ fontSize: '0.8rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
                        {selectedStudentIds.length === students.length ? t('deselectAll' as any) : t('selectAll' as any)}
                    </button>
                </div>
                <div style={{ maxHeight: '25vh', overflowY: 'auto', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    {students.map(student => (
                        <div key={student.id} style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                            <input
                                type="checkbox"
                                id={`student-${student.id}`}
                                checked={selectedStudentIds.includes(student.id)}
                                onChange={() => handleStudentSelect(student.id)}
                                style={{ width: '1.2rem', height: '1.2rem', marginLeft: '8px' }}
                            />
                            <label htmlFor={`student-${student.id}`}>{student.name}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
                 <textarea
                    placeholder={t('writeNotePlaceholder' as any)}
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    rows={4}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
                />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <button onClick={handleSave} style={{ padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {t('saveNote' as any)}
                </button>
                 <button onClick={handleAbsence} style={{ padding: '10px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {t('markAsAbsent' as any)}
                </button>
            </div>


            <button
                onClick={onBack}
                style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#1f2937', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '32px', fontWeight: 'bold' }}
            >
                {t('back')}
            </button>
        </div>
    );
};

export default MobileTeacherManageNotes;
