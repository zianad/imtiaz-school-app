import React, { useState, useEffect } from 'react';
import { Teacher, School, EducationalStage, Subject } from '../../../../packages/core/types';
import { STAGE_DETAILS, CLASSES } from '../../../../packages/core/constants';
import { useTranslation } from '../../../../packages/core/i18n';
import { getStageForLevel } from '../../../../packages/core/utils';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface PrincipalManageTeachersProps {
    school: School;
    stage: EducationalStage;
    teachers: Teacher[];
    onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
    onUpdateTeacher: (teacher: Teacher) => void;
    onDeleteTeacher: (teacherId: string, teacherName: string) => void;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    isDesktop?: boolean;
}

const TeacherForm: React.FC<{
    stage: EducationalStage,
    editingTeacher: Teacher | null,
    onSave: (data: Omit<Teacher, 'id'>) => void,
    onCancel: () => void
}> = ({ stage, editingTeacher, onSave, onCancel }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [loginCode, setLoginCode] = useState('');
    const [salary, setSalary] = useState<number | undefined>(undefined);
    
    const stageDetails = STAGE_DETAILS[stage];
    const stageSubjects = stageDetails.subjects;
    const stageLevels = stageDetails.levels;

    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
    const [assignments, setAssignments] = useState<{ [level: string]: string[] }>({});

    useEffect(() => {
        if (editingTeacher) {
            setName(editingTeacher.name);
            setLoginCode(editingTeacher.loginCode);
            setSalary(editingTeacher.salary);
            setSelectedSubjects(editingTeacher.subjects);
            setAssignments(editingTeacher.assignments);
        } else {
            resetForm();
        }
    }, [editingTeacher]);
    
    const resetForm = () => {
        setName('');
        setLoginCode('');
        setSalary(undefined);
        setSelectedSubjects([]);
        setAssignments({});
    };
    
    const handleSubjectToggle = (subject: Subject) => {
        setSelectedSubjects(prev => prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]);
    };
    
    const handleAssignmentChange = (level: string, classes: string[]) => {
        setAssignments(prev => ({...prev, [level]: classes }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const hasAssignments = Object.values(assignments).some(classes => classes.length > 0);
        if (name.trim() && loginCode.trim() && selectedSubjects.length > 0 && hasAssignments) {
            onSave({ name, loginCode, subjects: selectedSubjects, assignments, salary });
            onCancel(); // Close modal on save
        } else {
            alert(t('fillAllFields'));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">{editingTeacher ? t('edit') : t('addTeacher')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder={t('teacherName')} value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 border-2 border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg"/>
                        <input type="text" placeholder={t('loginCode')} value={loginCode} onChange={e => setLoginCode(e.target.value)} required className="w-full p-3 border-2 border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg"/>
                        <input type="number" placeholder="الراتب (اختياري)" value={salary || ''} onChange={e => setSalary(e.target.value ? Number(e.target.value) : undefined)} className="w-full p-3 border-2 border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg"/>
                    </div>

                    <div className="p-3 border-2 border-dashed rounded-lg">
                        <h3 className="font-semibold text-center mb-2">{t('subject')}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                            {stageSubjects.map(s => <label key={s} className="flex items-center gap-2"><input type="checkbox" checked={selectedSubjects.includes(s)} onChange={() => handleSubjectToggle(s)} /> {t(s as any)}</label>)}
                        </div>
                    </div>

                    <div className="p-3 border-2 border-dashed rounded-lg space-y-3">
                        <h3 className="font-semibold text-center">{t('levels')} & {t('classes')}</h3>
                        {stageLevels.map(level => (
                            <div key={level}>
                                <h4 className="font-medium">{level}</h4>
                                <div className="flex flex-wrap gap-x-3 gap-y-1">
                                    {CLASSES.map(cls => <label key={cls} className="flex items-center gap-1.5"><input type="checkbox" checked={assignments[level]?.includes(cls)} onChange={() => handleAssignmentChange(level, (assignments[level] || []).includes(cls) ? (assignments[level] || []).filter(c => c !== cls) : [...(assignments[level] || []), cls] )} /> {cls}</label>)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200">{t('cancel')}</button>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">{editingTeacher ? t('saveChanges') : t('addTeacher')}</button>
                    </div>
                </form>
             </div>
        </div>
    );
};


const PrincipalManageTeachers: React.FC<PrincipalManageTeachersProps> = ({ school, stage, teachers = [], onAddTeacher, onUpdateTeacher, onDeleteTeacher, onBack, onLogout, toggleDarkMode, isDarkMode, isDesktop = false }) => {
    const { t } = useTranslation();
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleSave = (teacherData: Omit<Teacher, 'id'>) => {
        if (editingTeacher) {
            onUpdateTeacher({ ...editingTeacher, ...teacherData });
        } else {
            onAddTeacher(teacherData);
        }
    };
    
    const teachersForStage = teachers.filter(t => {
        const teacherStages = [...new Set(Object.keys(t.assignments).map(level => getStageForLevel(level)).filter(Boolean))];
        return teacherStages.includes(stage);
    });

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('manageTeachers')}</h1>
            
            <button onClick={() => setIsAddModalOpen(true)} className="w-full bg-blue-600 text-white font-bold py-3 mb-6 rounded-lg hover:bg-blue-700 transition shadow-lg">{t('addTeacher')}</button>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center border-t dark:border-gray-600 pt-4">{t('existingTeachers')}</h2>
                <div className="max-h-96 overflow-y-auto space-y-3 p-2">
                     {teachersForStage.length > 0 ? teachersForStage.map(teacher => (
                        <div key={teacher.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg shadow-sm">
                             <div className="flex justify-between items-center">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{teacher.name}</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setEditingTeacher(teacher)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline text-sm">{t('edit')}</button>
                                    <button onClick={() => onDeleteTeacher(teacher.id, teacher.name)} className="font-medium text-red-600 dark:text-red-500 hover:underline text-sm">{t('delete')}</button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Code: {teacher.loginCode}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('subject')}: {teacher.subjects.join(', ')}</p>
                        </div>
                    )) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noTeachers')}</p>}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>

            {(isAddModalOpen || editingTeacher) && (
                <TeacherForm 
                    stage={stage}
                    editingTeacher={editingTeacher}
                    onSave={handleSave}
                    onCancel={() => { setIsAddModalOpen(false); setEditingTeacher(null); }}
                />
            )}
        </div>
    );
};

export default PrincipalManageTeachers;
