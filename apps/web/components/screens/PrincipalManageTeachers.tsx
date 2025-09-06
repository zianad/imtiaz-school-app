import React, { useState, useEffect, useCallback } from 'react';
import { Teacher, Subject, EducationalStage, School } from '../../../../packages/core/types';
import { STAGE_DETAILS, CLASSES } from '../../../../packages/core/constants';
import { useTranslation } from '../../../../packages/core/i18n';
import { supabase } from '../../../../packages/core/supabaseClient';
import { camelToSnakeCase, snakeToCamelCase } from '../../../../packages/core/utils';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';
import ConfirmationModal from '../common/ConfirmationModal';

interface PrincipalManageTeachersProps {
    school: School;
    stage: EducationalStage;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const PrincipalManageTeachers: React.FC<PrincipalManageTeachersProps> = ({ school, stage, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [loginCode, setLoginCode] = useState('');
    const [salary, setSalary] = useState<number | undefined>(undefined);
    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
    const [assignments, setAssignments] = useState<{ [level: string]: string[] }>({});
    
    const stageDetails = STAGE_DETAILS[stage];

    const fetchTeachers = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('teachers')
            .select('*')
            .eq('school_id', school.id);
        
        if (error) {
            console.error("Error fetching teachers:", error);
        } else {
            setTeachers(snakeToCamelCase(data));
        }
        setIsLoading(false);
    }, [school.id]);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    const resetForm = () => {
        setName('');
        setLoginCode('');
        setSalary(undefined);
        setSelectedSubjects([]);
        setAssignments({});
        setEditingTeacher(null);
        setIsFormVisible(false);
    };

    useEffect(() => {
        if (editingTeacher) {
            setName(editingTeacher.name);
            setLoginCode(editingTeacher.loginCode);
            setSalary(editingTeacher.salary);
            setSelectedSubjects(editingTeacher.subjects);
            setAssignments(editingTeacher.assignments);
            setIsFormVisible(true);
        } else {
            resetForm();
        }
    }, [editingTeacher]);

    const handleSubjectToggle = (subject: Subject) => {
        setSelectedSubjects(prev =>
            prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
        );
    };

    const handleLevelToggle = (level: string) => {
        setAssignments(prev => {
            const newAssignments = { ...prev };
            if (newAssignments[level]) {
                delete newAssignments[level];
            } else {
                newAssignments[level] = [];
            }
            return newAssignments;
        });
    };

    const handleClassToggle = (level: string, cls: string) => {
        setAssignments(prev => {
            const currentClasses = prev[level] || [];
            const newClasses = currentClasses.includes(cls)
                ? currentClasses.filter(c => c !== cls)
                : [...currentClasses, cls];
            return { ...prev, [level]: newClasses };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasAssignments = Object.values(assignments).some(classes => classes.length > 0);
        if (name.trim() && loginCode.trim() && selectedSubjects.length > 0 && hasAssignments) {
            const teacherData = {
                school_id: school.id,
                name,
                login_code: loginCode,
                salary,
                subjects: selectedSubjects,
                assignments,
            };

            const { error } = editingTeacher
                ? await supabase.from('teachers').update(teacherData).match({ id: editingTeacher.id })
                : await supabase.from('teachers').insert(teacherData);

            if (error) {
                alert('Failed to save teacher: ' + error.message);
            } else {
                await fetchTeachers();
                resetForm();
            }
        } else {
            alert(t('fillAllFields'));
        }
    };
    
    const handleDelete = async () => {
        if (!teacherToDelete) return;
        const { error } = await supabase.from('teachers').delete().match({ id: teacherToDelete.id });
        if (error) {
            alert('Failed to delete teacher: ' + error.message);
        } else {
            setTeachers(prev => prev.filter(t => t.id !== teacherToDelete.id));
        }
        setTeacherToDelete(null);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-slate-700 w-full relative">
            <ConfirmationModal
                isOpen={!!teacherToDelete}
                title={`${t('delete')} ${teacherToDelete?.name}`}
                message={`هل أنت متأكد من رغبتك في حذف الأستاذ؟ لا يمكن التراجع عن هذا الإجراء.`}
                onConfirm={handleDelete}
                onCancel={() => setTeacherToDelete(null)}
            />
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">{t('manageTeachers')}</h1>
            
            {!isFormVisible && (
                <button 
                    onClick={() => setIsFormVisible(true)}
                    className="w-full bg-blue-600 text-white font-bold py-3 mb-6 rounded-lg hover:bg-blue-700 transition"
                >
                    + {t('addTeacher')}
                </button>
            )}

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4">
                    <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-200">{editingTeacher ? t('edit') : t('addTeacher')}</h2>
                    <input type="text" placeholder={t('teacherName')} value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded" />
                    <input type="text" placeholder={t('loginCode')} value={loginCode} onChange={e => setLoginCode(e.target.value)} required className="w-full p-2 border rounded" />
                    <input type="number" placeholder="الراتب (اختياري)" value={salary || ''} onChange={e => setSalary(e.target.value ? Number(e.target.value) : undefined)} className="w-full p-2 border rounded" />

                    <div className="p-2 border rounded">
                        <h3 className="text-center font-semibold mb-2">{t('subject')}</h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {stageDetails.subjects.map(s => <button type="button" key={s} onClick={() => handleSubjectToggle(s)} className={`px-3 py-1 rounded-full text-sm ${selectedSubjects.includes(s) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{t(s as any)}</button>)}
                        </div>
                    </div>
                    
                    <div className="p-2 border rounded max-h-60 overflow-y-auto">
                        <h3 className="text-center font-semibold mb-2">المستويات والأفواج</h3>
                        {stageDetails.levels.map(level => (
                            <div key={level} className="mb-2">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={!!assignments[level]} onChange={() => handleLevelToggle(level)} />
                                    <span>{level}</span>
                                </label>
                                {assignments[level] && (
                                    <div className="flex flex-wrap gap-2 mt-1 pl-6">
                                        {CLASSES.map(cls => <button type="button" key={cls} onClick={() => handleClassToggle(level, cls)} className={`px-2 py-1 rounded-full text-xs ${assignments[level].includes(cls) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>{cls}</button>)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600">{editingTeacher ? t('updateTeacher') : t('addTeacher')}</button>
                        <button type="button" onClick={() => { setEditingTeacher(null); setIsFormVisible(false); }} className="flex-1 bg-gray-300 font-bold py-2 rounded-lg hover:bg-gray-400">{t('cancel')}</button>
                    </div>
                </form>
            )}

            <div className="max-h-96 overflow-y-auto space-y-2">
                {isLoading ? <p>Loading...</p> : teachers.map(teacher => (
                    <div key={teacher.id} className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{teacher.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Code: {teacher.loginCode}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingTeacher(teacher)} className="text-blue-600 hover:underline text-sm">{t('edit')}</button>
                                <button onClick={() => setTeacherToDelete(teacher)} className="text-red-500 hover:underline text-sm">{t('delete')}</button>
                            </div>
                        </div>
                    </div>
                ))}
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

export default PrincipalManageTeachers;
