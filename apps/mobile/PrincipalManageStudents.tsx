import React, { useState } from 'react';
import { Student, EducationalStage } from '../../packages/core/types';
import { STAGE_DETAILS, CLASSES } from '../../packages/core/constants';
import { useTranslation } from '../../packages/core/i18n';

interface MobilePrincipalManageStudentsProps {
    stage: EducationalStage;
    students: Student[];
    onAddStudent: (student: Omit<Student, 'id' | 'grades'>) => void;
    onDeleteStudent: (studentId: string) => void;
    onBack: () => void;
}

const MobilePrincipalManageStudents: React.FC<MobilePrincipalManageStudentsProps> = ({ stage, students, onAddStudent, onDeleteStudent, onBack }) => {
    const { t } = useTranslation();
    const stageLevels = STAGE_DETAILS[stage].levels;
    
    const [name, setName] = useState('');
    const [guardianCode, setGuardianCode] = useState('');
    const [level, setLevel] = useState<string>(stageLevels[0]);
    const [studentClass, setStudentClass] = useState<string>(CLASSES[0]);

    // Filter state
    const [filterLevel, setFilterLevel] = useState<string>(stageLevels[0]);
    const [filterClass, setFilterClass] = useState<string>(CLASSES[0]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && guardianCode.trim() && level && studentClass) {
            onAddStudent({ name, guardianCode, stage, level, class: studentClass });
            setName('');
            setGuardianCode('');
        } else {
            alert(t('fillAllFields'));
        }
    };
    
    const filteredStudents = students.filter(s => s.level === filterLevel && s.class === filterClass);

    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>{t('manageStudents')}</h1>
            
            <div style={{ marginBottom: '24px', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                <h2 style={{ fontWeight: '600', textAlign: 'center', marginBottom: '12px' }}>{t('addStudent')}</h2>
                <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="text" placeholder={t('studentName')} value={name} onChange={e => setName(e.target.value)} required style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                    <input type="text" placeholder={t('guardianCode')} value={guardianCode} onChange={e => setGuardianCode(e.target.value)} required style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                         <select value={level} onChange={e => setLevel(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                            {stageLevels.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <select value={studentClass} onChange={e => setStudentClass(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button type="submit" style={{ padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>{t('addStudent')}</button>
                </form>
            </div>

            <div>
                <h2 style={{ fontWeight: '600', marginBottom: '8px', textAlign: 'center' }}>{t('existingStudents')}</h2>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                        {stageLevels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select value={filterClass} onChange={e => setFilterClass(e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}>
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div style={{ maxHeight: '30vh', overflowY: 'auto', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '8px' }}>
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <div key={student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '8px' }}>
                                <span>{student.name}</span>
                                <button onClick={() => onDeleteStudent(student.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>{t('delete')}</button>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#6b7280' }}>{t('noStudents')}</p>
                    )}
                </div>
            </div>

            <button onClick={onBack} style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#1f2937', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '24px', fontWeight: 'bold' }}>{t('back')}</button>
        </div>
    );
};

export default MobilePrincipalManageStudents;