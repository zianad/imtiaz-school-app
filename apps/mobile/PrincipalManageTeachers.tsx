import React, { useState, useEffect } from 'react';
import { Teacher, Subject, EducationalStage } from '../../packages/core/types';
import { STAGE_DETAILS, CLASSES } from '../../packages/core/constants';
import { useTranslation } from '../../packages/core/i18n';

interface MobilePrincipalManageTeachersProps {
    stage: EducationalStage;
    teachers: Teacher[];
    onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
    onUpdateTeacher: (teacher: Teacher) => void;
    onDeleteTeacher: (teacherId: string) => void;
    onBack: () => void;
}

const MobilePrincipalManageTeachers: React.FC<MobilePrincipalManageTeachersProps> = ({ stage, teachers, onAddTeacher, onUpdateTeacher, onDeleteTeacher, onBack }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [loginCode, setLoginCode] = useState('');
    
    const stageDetails = STAGE_DETAILS[stage];
    const stageSubjects = stageDetails.subjects;
    const stageLevels = stageDetails.levels;

    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [assignments, setAssignments] = useState<{ [level: string]: string[] }>({});
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

    useEffect(() => {
        if (editingTeacher) {
            setName(editingTeacher.name);
            setLoginCode(editingTeacher.loginCode);
            // FIX: Ensure subjects is an array to prevent crashes.
            setSelectedSubjects(Array.isArray(editingTeacher.subjects) ? editingTeacher.subjects : []);
            setSelectedLevels(Object.keys(editingTeacher.assignments));
            setAssignments(editingTeacher.assignments);
        } else {
            resetForm();
        }
    }, [editingTeacher]);
    
    const resetForm = () => {
        setName('');
        setLoginCode('');
        setSelectedSubjects([]);
        setSelectedLevels([]);
        setAssignments({});
    };

    const handleSubjectToggle = (subject: Subject) => {
        setSelectedSubjects(prev =>
            prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
        );
    };

    const handleLevelToggle = (level: string) => {
        const newSelectedLevels = selectedLevels.includes(level)
            ? selectedLevels.filter(l => l !== level)
            : [...selectedLevels, level];
        setSelectedLevels(newSelectedLevels);

        const newAssignments = { ...assignments };
        if (newSelectedLevels.includes(level)) {
            if (!newAssignments[level]) {
                newAssignments[level] = [];
            }
        } else {
            delete newAssignments[level];
        }
        setAssignments(newAssignments);
    };

    const handleClassToggle = (level: string, cls: string) => {
        const currentClasses = assignments[level] || [];
        const newClasses = currentClasses.includes(cls)
            ? currentClasses.filter(c => c !== cls)
            : [...currentClasses, cls];
        setAssignments(prev => ({ ...prev, [level]: newClasses }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const hasAssignments = Object.values(assignments).some(classes => classes.length > 0);
        if (name.trim() && loginCode.trim() && selectedSubjects.length > 0 && selectedLevels.length > 0 && hasAssignments) {
            const teacherData = { name, loginCode, subjects: selectedSubjects, assignments };
            if (editingTeacher) {
                onUpdateTeacher({ ...editingTeacher, ...teacherData });
            } else {
                onAddTeacher(teacherData);
            }
            setEditingTeacher(null);
        } else {
            alert(t('fillAllFields'));
        }
    };

    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>{t('manageTeachers')}</h1>
            
            <div style={{ marginBottom: '24px', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                <h2 style={{ fontWeight: '600', textAlign: 'center', marginBottom: '12px' }}>
                    {editingTeacher ? `${t('edit')}: ${editingTeacher.name}` : t('addTeacher')}
                </h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="text" placeholder={t('teacherName')} value={name} onChange={e => setName(e.target.value)} required style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                    <input type="text" placeholder={t('loginCode')} value={loginCode} onChange={e => setLoginCode(e.target.value)} required style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                    
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '8px' }}>
                        <h3 style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>{t('subject')}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                            {stageSubjects.map(s => (
                                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSubjects.includes(s)}
                                        onChange={() => handleSubjectToggle(s)}
                                    />
                                    <span style={{ fontSize: '0.8rem' }}>{t(s as any)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '8px' }}>
                        <h3 style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>{t('levels')}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
                            {stageLevels.map(level => <button type="button" key={level} onClick={() => handleLevelToggle(level)} style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: selectedLevels.includes(level) ? '#3b82f6' : '#e5e7eb', color: selectedLevels.includes(level) ? 'white' : 'black' }}>{level}</button>)}
                        </div>
                    </div>

                    {selectedLevels.length > 0 && (
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <h3 style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: '600' }}>{t('classes')}</h3>
                            {selectedLevels.map(level => (
                                <div key={level}>
                                    <p style={{fontSize: '0.8rem', fontWeight: '500', textAlign: 'center'}}>{level}</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
                                        {CLASSES.map(cls => (
                                            <button type="button" key={`${level}-${cls}`} onClick={() => handleClassToggle(level, cls)} style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: assignments[level]?.includes(cls) ? '#10b981' : '#e5e7eb', color: assignments[level]?.includes(cls) ? 'white' : 'black' }}>{cls}</button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                            {editingTeacher ? t('updateTeacher') : t('addTeacher')}
                        </button>
                        {editingTeacher && <button type="button" onClick={() => setEditingTeacher(null)} style={{ flex: 1, padding: '10px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '4px' }}>{t('cancel')}</button>}
                    </div>
                </form>
            </div>

            <div>
                <h2 style={{ fontWeight: '600', marginBottom: '8px', textAlign: 'center' }}>{t('existingTeachers')}</h2>
                <div style={{ maxHeight: '30vh', overflowY: 'auto', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '8px' }}>
                     {teachers.length > 0 ? teachers.map(teacher => (
                        <div key={teacher.id} style={{ padding: '8px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '8px' }}>
                            <p style={{ fontWeight: 'bold' }}>{teacher.name}</p>
                            <p style={{ fontSize: '0.8rem' }}>{teacher.subjects.map(s => t(s as any)).join('، ')} - Code: {teacher.loginCode}</p>
                             <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                <button onClick={() => setEditingTeacher(teacher)} style={{ color: '#3b82f6', border: 'none', background: 'none', fontWeight: 'bold' }}>{t('edit')}</button>
                                <button onClick={() => onDeleteTeacher(teacher.id)} style={{ color: '#ef4444', border: 'none', background: 'none', fontWeight: 'bold' }}>{t('delete')}</button>
                            </div>
                        </div>
                    )) : <p style={{ textAlign: 'center', color: '#6b7280' }}>{t('noTeachers')}</p>}
                </div>
            </div>

            <button onClick={onBack} style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#1f2937', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '24px', fontWeight: 'bold' }}>{t('back')}</button>
        </div>
    );
};

export default MobilePrincipalManageTeachers;