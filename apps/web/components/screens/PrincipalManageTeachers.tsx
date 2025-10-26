import React, { useState, useEffect, useCallback } from 'react';
import { School, Teacher, Subject, EducationalStage } from '../../../../packages/core/types';
import { STAGE_DETAILS, CLASSES } from '../../../../packages/core/constants';
import { useTranslation } from '../../../../packages/core/i18n';
import { supabase } from '../../../../packages/core/supabaseClient';
import { camelToSnakeCase, snakeToCamelCase } from '../../../../packages/core/utils';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

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

    const [name, setName] = useState('');
    const [loginCode, setLoginCode] = useState('');
    const [salary, setSalary] = useState<number | undefined>(undefined);
    
    const stageDetails = STAGE_DETAILS[stage];
    const stageSubjects = stageDetails.subjects;
    const stageLevels = stageDetails.levels;

    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
    const [assignments, setAssignments] = useState<{ [level: string]: string[] }>({});
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

    const fetchTeachers = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('teachers')
            .select('*')
            .eq('school_id', school.id);
        
        if (error) {
            console.error("Error fetching teachers", error);
        } else {
            // FIX: The data received from Supabase can be null, which would cause a crash when setting the state. This has been corrected by ensuring that an empty array is used as a fallback if the data is null.
            setTeachers(snakeToCamelCase(data || []));
        }
        setIsLoading(false);
    }, [school.id]);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

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
        setSelectedSubjects(prev =>
            prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
        );
    };

    const handleLevelToggle = (level: string) => {
        const newAssignments = { ...assignments };
        if (newAssignments[level]) {
            delete newAssignments[level];
        } else {
            newAssignments[level] = [];
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasAssignments = Object.values(assignments).some(classes => classes.length > 0);
        if (name.trim() && loginCode.trim() && selectedSubjects.length > 0 && hasAssignments) {
            const teacherData = { 
                name, 
                login_code: loginCode,
                salary: salary,
                subjects: selectedSubjects, 
                assignments,
                school_id: school.id,
            };
            
            let result;
            if (editingTeacher) {
                result = await supabase.from('teachers').update(teacherData).match({ id: editingTeacher.id });
            } else {
                result = await supabase.from('teachers').insert([teacherData]);
            }
            
            if (result.error) {
                alert('Error saving teacher: ' + result.error.message);
            } else {
                setEditingTeacher(null);
                fetchTeachers(); // Refresh list
            }
        } else {
            alert(t('fillAllFields' as any));
        }
    };

    const handleDeleteTeacher = async (teacherId: string) => {
        if(window.confirm(t('confirmDeleteTeacher' as any, { name: teachers.find(t=>t.id === teacherId)?.name }))){
            const { error } = await supabase.from('teachers').delete().match({ id: teacherId });
            if(error) {
                alert('Error deleting teacher: ' + error.message);
            } else {
                fetchTeachers(); // Refresh list
            }
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-slate-700 w-full relative">
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4 max-h-[75vh] overflow-y-auto">
                     <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">
                        {editingTeacher ? `${t('edit')}: ${editingTeacher.name}` : t('addTeacher')}
                    </h2>
                    <input type="text" placeholder={t('teacherName')} value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"/>
                    <input type="text" placeholder={t('loginCode')} value={loginCode} onChange={e => setLoginCode(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"/>
                    <input type="number" placeholder={t('salary' as any)} value={salary ?? ''} onChange={e => setSalary(e.target.value ? Number(e.target.value) : undefined)} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"/>
                    
                    <div className="p-2 border rounded dark:border-gray-600">
                        <h3 className="font-semibold text-center text-gray-700 dark:text-gray-200">{t('subject')}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {stageSubjects.map(s => (
                            <label key={s} className="flex items-center gap-1"><input type="checkbox" checked={selectedSubjects.includes(s)} onChange={() => handleSubjectToggle(s)} /> {t(s as any)}</label>
                        ))}
                        </div>
                    </div>
                    <div className="p-2 border rounded dark:border-gray-600">
                        <h3 className="font-semibold text-center text-gray-700 dark:text-gray-200">{t('levels')}</h3>
                        {stageLevels.map(level => (
                            <div key={level} className="mt-2 p-2 bg-white dark:bg-gray-800 rounded">
                                <label className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2"><input type="checkbox" checked={!!assignments[level]} onChange={() => handleLevelToggle(level)} /> {level}</label>
                                {assignments[level] && (
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 pl-4 text-sm text-gray-700 dark:text-gray-300">
                                        {CLASSES.map(cls => <label key={cls} className="flex items-center gap-1"><input type="checkbox" checked={assignments[level].includes(cls)} onChange={() => handleClassToggle(level, cls)} /> {cls}</label>)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">{editingTeacher ? t('update') : t('add')}</button>
                        {editingTeacher && <button type="button" onClick={() => setEditingTeacher(null)} className="flex-1 bg-gray-300 dark:bg-gray-600 py-2 rounded-lg">{t('cancel')}</button>}
                    </div>
                </form>

                {/* List Section */}
                 <div className="max-h-[75vh] overflow-y-auto space-y-3 p-2">
                     <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('existingTeachers')}</h2>
                    {isLoading ? <p className="text-center dark:text-gray-300">{t('loading' as any)}...</p> : teachers.map(teacher => (
                        <div key={teacher.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg shadow-sm">
                            <p className="font-bold text-gray-800 dark:text-gray-100">{teacher.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{teacher.subjects.map(s => t(s as any)).join(', ')} - Code: {teacher.loginCode}</p>
                            <div className="flex gap-4 mt-2">
                                <button onClick={() => setEditingTeacher(teacher)} className="text-sm font-semibold text-blue-600 hover:underline">{t('edit')}</button>
                                <button onClick={() => handleDeleteTeacher(teacher.id)} className="text-sm font-semibold text-red-600 hover:underline">{t('delete')}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default PrincipalManageTeachers;