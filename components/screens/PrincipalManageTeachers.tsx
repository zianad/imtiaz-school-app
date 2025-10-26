

import React, { useState, useEffect } from 'react';
import { Teacher, Subject, EducationalStage } from '../../types';
import { STAGE_DETAILS, CLASSES } from '../../constants';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';
import ThemeSwitcher from '../ThemeSwitcher';

interface PrincipalManageTeachersProps {
    stage: EducationalStage;
    teachers: Teacher[];
    onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
    onUpdateTeacher: (teacher: Teacher) => void;
    onDeleteTeacher: (teacherId: string) => void;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const PrincipalManageTeachers: React.FC<PrincipalManageTeachersProps> = ({ stage, teachers, onAddTeacher, onUpdateTeacher, onDeleteTeacher, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [loginCode, setLoginCode] = useState('');
    
    const stageSubjects = STAGE_DETAILS[stage].subjects;
    const stageLevels = STAGE_DETAILS[stage].levels;

    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [assignments, setAssignments] = useState<{ [level: string]: string[] }>({});
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

    useEffect(() => {
        if (editingTeacher) {
            setName(editingTeacher.name);
            setLoginCode(editingTeacher.loginCode);
            setSelectedSubjects(editingTeacher.subjects);
            setSelectedLevels(Object.keys(editingTeacher.assignments));
            setAssignments(editingTeacher.assignments);
        } else {
            resetForm();
        }
    }, [editingTeacher]);

    useEffect(() => {
      setSelectedSubjects([]);
      setSelectedLevels([]);
      setAssignments({});
    }, [stage]);
    
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
            const teacherData = {
                name,
                loginCode,
                subjects: selectedSubjects,
                assignments,
            };
            if (editingTeacher) {
                onUpdateTeacher({
                    ...editingTeacher,
                    ...teacherData,
                });
            } else {
                onAddTeacher(teacherData);
            }
            setEditingTeacher(null);
        } else {
            alert(t('fillAllFields'));
        }
    };
    
    const handleDelete = (teacherId: string, teacherName: string) => {
        if (window.confirm(t('confirmDeleteTeacher', { name: teacherName }))) {
            onDeleteTeacher(teacherId);
        }
    };

    const handleEditClick = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingTeacher(null);
    };


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 w-full relative">
            <div className="absolute top-4 start-4 z-10 flex gap-2">
                <LanguageSwitcher />
                <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('manageTeachers')}</h1>
            
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center border-b dark:border-gray-600 pb-3 mb-4">
                    {editingTeacher ? `${t('edit')}: ${editingTeacher.name}` : t('addTeacher')}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder={t('teacherName')} value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition" required />
                    <input type="text" placeholder={t('loginCode')} value={loginCode} onChange={e => setLoginCode(e.target.value)} className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition" required />
                    
                    <div>
                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300 block mb-2 text-center">{t('subject')}</label>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                            {stageSubjects.map(s => (
                                <label key={s} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedSubjects.includes(s)}
                                        onChange={() => handleSubjectToggle(s)}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-800 dark:text-gray-200">{t(s as any)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <label className="font-medium text-sm text-gray-700 dark:text-gray-300 block mb-2 text-center">{t('levels')}</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {stageLevels.map(level => (
                                <button type="button" key={level} onClick={() => handleLevelToggle(level)} className={`p-2 rounded-md text-sm transition-colors ${selectedLevels.includes(level) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'}`}>
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                     
                    {selectedLevels.length > 0 && (
                        <div className="space-y-4 pt-4 border-t-2 border-dashed dark:border-gray-600">
                             {selectedLevels.map(level => (
                                <div key={level}>
                                    <label className="font-medium text-sm text-gray-700 dark:text-gray-300 block mb-2 text-center">الأفواج لـ "{level}"</label>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {CLASSES.map(cls => (
                                            <button type="button" key={`${level}-${cls}`} onClick={() => handleClassToggle(level, cls)} className={`p-2 rounded-md flex-1 text-sm transition-colors min-w-[90px] ${assignments[level]?.includes(cls) ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'}`}>
                                                {cls}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                    <div className="flex items-center gap-2 !mt-6">
                        <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
                            {editingTeacher ? t('updateTeacher') : t('addTeacher')}
                        </button>
                        {editingTeacher && (
                            <button type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition shadow-sm">
                                {t('cancel')}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center border-t dark:border-gray-600 pt-4">{t('existingTeachers')}</h2>
                <div className="max-h-[50vh] overflow-y-auto space-y-3 p-2">
                     {teachers.length > 0 ? [...teachers].sort((a,b) => a.name.localeCompare(b.name)).map(teacher => (
                        <div key={teacher.id} className="bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-md border-l-4 border-blue-500 dark:border-blue-400">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{teacher.name}</p>
                                    <p className="text-sm text-blue-700 dark:text-blue-400 font-semibold">{teacher.subjects.map(s => t(s as any)).join(' | ')}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('loginCode')}: {teacher.loginCode}</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => handleEditClick(teacher)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold p-2 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition text-sm">{t('edit')}</button>
                                    <button onClick={() => handleDelete(teacher.id, teacher.name)} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold p-2 rounded-md hover:bg-red-100 dark:hover:bg-gray-700 transition text-sm">{t('delete')}</button>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 space-y-1 pt-2 border-t border-gray-100 dark:border-gray-700">
                                {Object.entries(teacher.assignments).map(([level, classes]) => (
                                    <p key={level}><strong>{level}:</strong> {classes.join(' | ')}</p>
                                ))}
                            </div>
                        </div>
                    )) : (
                       <p className="text-center text-gray-500 dark:text-gray-400 py-6">{t('noTeachers')}</p>
                    )}
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